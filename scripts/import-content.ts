/**
 * Importação em lote por linha de comando.
 * Uso: npm run content:import -- caminho/arquivo.json [--tipo=recursos|questoes|aulas] [--publicar]
 * O tipo é deduzido do conteúdo quando não informado. Itens passam pela mesma validação do painel admin.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";


async function main() {
  const file = process.argv.find((a) => a.endsWith(".json"));
  if (!file) {
    console.error("Informe o arquivo JSON. Ex.: npm run content:import -- dados/novos-recursos.json");
    process.exit(1);
  }
  const items = JSON.parse(readFileSync(file, "utf8"));
  const arr: Record<string, unknown>[] = Array.isArray(items) ? items : [items];
  const tipoArg = process.argv.find((a) => a.startsWith("--tipo="))?.split("=")[1];
  const tipo = tipoArg ?? (arr[0]?.alternatives ? "questoes" : arr[0]?.content ? "aulas" : "recursos");
  const publish = process.argv.includes("--publicar");
  const mod = await import("../src/lib/content-import");
  const rep = tipo === "questoes" ? await mod.importQuestions(arr, null, publish) : tipo === "aulas" ? await mod.importLessons(arr, null, publish) : await mod.importResources(arr, null, "IMPORTACAO");
  console.log(`Tipo: ${tipo}`);
  console.log(`Criados: ${rep.created} · Atualizados: ${rep.updated} · Duplicados: ${rep.duplicates.length} · Erros: ${rep.errors.length}`);
  rep.duplicates.forEach((d) => console.log("  = duplicado:", d));
  rep.errors.forEach((e) => console.log("  ✗", e));
  if (tipo === "recursos" && rep.created) console.log("Próximo passo: npm run links:check -- --only-pending");
  await new PrismaClient().$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
