/**
 * Relatório de cobertura e de lacunas EXATAS por assunto, medido no banco (separado por especialidade).
 * Gera docs/relatorios/cobertura.md e docs/relatorios/lacunas.md.
 * Uso: npm run content:coverage
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";

const db = new PrismaClient();

async function main() {
  const disciplines = await db.discipline.findMany({
    orderBy: { order: "asc" },
    include: {
      specialty: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          topics: {
            orderBy: { order: "asc" },
            include: {
              _count: { select: { lessons: { where: { status: "PUBLICADO" } }, lessonCovers: { where: { lesson: { status: "PUBLICADO" } } }, questions: { where: { status: "PUBLICADO" } }, flashcards: true, labs: true } },
              resources: { include: { resource: { select: { status: true, verificationStatus: true } } } },
            },
          },
        },
      },
    },
  });
  type Row = { disc: string; spec: string; slug: string; title: string; lessons: number; res: number; q: number; fc: number; labs: number };
  const rows: Row[] = [];
  for (const d of disciplines)
    for (const m of d.modules)
      for (const t of m.topics)
        rows.push({
          disc: d.name,
          spec: d.specialty?.key ?? "GERAL",
          slug: t.slug,
          title: t.title,
          lessons: t._count.lessons + t._count.lessonCovers,
          res: t.resources.filter((r) => r.resource.status === "PUBLICADO" && r.resource.verificationStatus === "VERIFICADO").length,
          q: t._count.questions,
          fc: t._count.flashcards,
          labs: t._count.labs,
        });

  const pct = (arr: Row[], f: (r: Row) => boolean) => (arr.length ? Math.round((arr.filter(f).length / arr.length) * 100) : 0);
  const block = (label: string, arr: Row[]) =>
    `### ${label} — ${arr.length} assuntos\n\n| Indicador | Cobertura |\n|---|---|\n| Assuntos com aula autoral | ${pct(arr, (r) => r.lessons > 0)}% |\n| Assuntos com material verificado | ${pct(arr, (r) => r.res > 0)}% |\n| Assuntos com questões | ${pct(arr, (r) => r.q > 0)}% |\n| Assuntos com flashcards | ${pct(arr, (r) => r.fc > 0)}% |\n| Assuntos completos (aula + material + questões) | ${pct(arr, (r) => r.lessons > 0 && r.res > 0 && r.q > 0)}% |\n| Questões publicadas | ${arr.reduce((a, r) => a + r.q, 0)} |\n`;
  const ger = rows.filter((r) => r.spec === "GERAL");
  const dev = rows.filter((r) => r.spec === "DEV");
  const sup = rows.filter((r) => r.spec === "SUP");
  const now = new Date().toISOString();
  const cobertura = `# Cobertura de conteúdo (medida no banco)\n\nGerado em ${now} por \`npm run content:coverage\`.\n\n${block("Conhecimentos Gerais (compartilhados)", ger)}\n${block("Específicos — 006 Desenvolvimento de Sistemas", dev)}\n${block("Específicos — 007 Suporte Técnico", sup)}\n${block("Edital completo do cargo 006 (gerais + específicos)", [...ger, ...dev])}\n${block("Edital completo do cargo 007 (gerais + específicos)", [...ger, ...sup])}`;
  const gap = (r: Row) => [!r.lessons && "aula", !r.res && "material verificado", !r.q && "questões"].filter(Boolean).join(", ");
  const lacunas = `# Lacunas exatas por assunto\n\nGerado em ${now}. Lista todo assunto do edital que ainda não tem aula autoral, material verificado ou questões publicadas.\n\n${[
    ["Conhecimentos Gerais", ger],
    ["006 — Desenvolvimento de Sistemas", dev],
    ["007 — Suporte Técnico", sup],
  ]
    .map(([l, arr]) => {
      const g = (arr as Row[]).filter((r) => gap(r));
      return `## ${l} (${g.length} com lacuna)\n\n| Assunto (slug) | Disciplina | Falta |\n|---|---|---|\n${g.map((r) => `| ${r.title.replace(/\|/g, "/")} (\`${r.slug}\`) | ${r.disc} | ${gap(r)} |`).join("\n")}\n`;
    })
    .join("\n")}`;
  mkdirSync("docs/relatorios", { recursive: true });
  writeFileSync("docs/relatorios/cobertura.md", cobertura);
  writeFileSync("docs/relatorios/lacunas.md", lacunas);
  console.log(cobertura);
  console.log("→ docs/relatorios/cobertura.md e docs/relatorios/lacunas.md");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
