/**
 * Verificador de links da biblioteca.
 * - Faz GET em cada URL (com redirecionamentos, timeout de 25 s).
 * - Marca VERIFICADO somente se HTTP 2xx E o texto esperado (campo [esperado: "..."] da descrição) aparecer na página.
 * - Marca QUEBRADO para 404/410, INACESSIVEL para timeout/erros de rede/outros status, DIVERGENTE se o texto não aparecer.
 * - Publica automaticamente apenas recursos VERIFICADOS; os demais ficam EM_REVISAO para análise no painel admin.
 * - Registra cada verificação em ResourceCheckLog (histórico) e gera relatório em docs/relatorios/links.md.
 * Uso: npm run links:check            (todos)
 *      npm run links:check -- --only-pending
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { checkUrl, expectedText, youtubeOEmbed } from "../src/lib/linkcheck";

const titles = new Map<string, { title: string; provider: string }>();
/** Vídeos do YouTube são conferidos pelo oEmbed oficial (título e canal reais). */
async function check(url: string, expect: string | null) {
  if (!/youtube\.com\/watch|youtu\.be\//.test(url)) return checkUrl(url, expect);
  const meta = await youtubeOEmbed(url);
  if (!meta) return { status: "QUEBRADO" as const, http: null, msg: "oEmbed não encontrou o vídeo (removido, privado ou sem incorporação)" };
  titles.set(url, { title: `${meta.title} — ${meta.author}`, provider: `YouTube · ${meta.author}` });
  return { status: "VERIFICADO" as const, http: 200, msg: `oEmbed: "${meta.title}" (${meta.author})` };
}

const db = new PrismaClient();
async function main() {
  const onlyPending = process.argv.includes("--only-pending");
  const resources = await db.resource.findMany({ where: onlyPending ? { verificationStatus: { not: "VERIFICADO" } } : {}, orderBy: { provider: "asc" } });
  console.log(`Verificando ${resources.length} recursos...`);
  const rows: string[] = [];
  const counts: Record<string, number> = {};
  for (let i = 0; i < resources.length; i += 6) {
    const batch = resources.slice(i, i + 6);
    const results = await Promise.all(batch.map((r) => check(r.url, expectedText(r.description))));
    for (let j = 0; j < batch.length; j++) {
      const r = batch[j];
      const out = results[j];
      counts[out.status] = (counts[out.status] || 0) + 1;
      await db.resource.update({
        where: { id: r.id },
        data: {
          ...(titles.get(r.url) ?? {}),
          verificationStatus: out.status,
          httpStatus: out.http,
          verifiedAt: out.status === "VERIFICADO" ? new Date() : r.verifiedAt,
          verificationMethod: "GET automático + conferência de texto esperado (scripts/check-links.ts)",
          status: out.status === "VERIFICADO" ? (r.status === "REJEITADO" ? "REJEITADO" : "PUBLICADO") : r.status === "PUBLICADO" ? "EM_REVISAO" : r.status,
        },
      });
      await db.resourceCheckLog.create({ data: { resourceId: r.id, httpStatus: out.http, ok: out.status === "VERIFICADO", method: "GET", message: out.msg } });
      rows.push(`| ${out.status} | ${out.http ?? "-"} | [${r.title.replace(/\|/g, "/")}](${r.url}) | ${out.msg.replace(/\|/g, "/")} |`);
      console.log(`${out.status.padEnd(12)} ${String(out.http ?? "-").padEnd(4)} ${r.url}`);
    }
  }
  mkdirSync("docs/relatorios", { recursive: true });
  const report = `# Relatório de verificação de links\n\nGerado em ${new Date().toISOString()} por \`npm run links:check\`.\n\n${Object.entries(counts)
    .map(([k, v]) => `- **${k}**: ${v}`)
    .join("\n")}\n\n| Status | HTTP | Recurso | Detalhe |\n|---|---|---|---|\n${rows.join("\n")}\n`;
  writeFileSync("docs/relatorios/links.md", report);
  console.log("Resumo:", counts, "→ docs/relatorios/links.md");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
