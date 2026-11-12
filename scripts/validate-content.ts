/**
 * Valida o conteúdo autoral em /content antes do seed (sem banco):
 *  - questões: Zod (5 alternativas distintas, 1 correta, justificativas, referência) + assunto existente no edital
 *  - aulas, flashcards, laboratórios e recursos: assunto existente
 *  - códigos e slugs únicos
 * Uso: npm run content:validate   (código de saída 1 se houver erro)
 */
import { EDITAL_DISCIPLINES } from "../content/edital";
import { QUESTIONS_GERAIS } from "../content/questions/gerais";
import { QUESTIONS_DEV } from "../content/questions/dev";
import { QUESTIONS_SUP } from "../content/questions/sup";
import { LESSONS, LESSON_COVERS } from "../content/lessons";
import { FLASHCARDS } from "../content/flashcards";
import { LABS } from "../content/labs";
import { RESOURCES } from "../content/resources";
import { questionSchema } from "../src/lib/validation";

const topics = new Map<string, { specialty: string | null }>();
for (const d of EDITAL_DISCIPLINES) for (const m of d.modules) for (const t of m.topics) {
  if (topics.has(t.slug)) console.error(`✗ slug de assunto duplicado: ${t.slug}`);
  topics.set(t.slug, { specialty: d.specialty });
}
const errors: string[] = [];
const all = [...QUESTIONS_GERAIS, ...QUESTIONS_DEV, ...QUESTIONS_SUP];
const codes = new Set<string>();
for (const q of all) {
  const r = questionSchema.safeParse(q);
  if (!r.success) errors.push(`questão ${q.code}: ${r.error.issues.map((i) => i.message).join("; ")}`);
  if (!topics.has(q.topic)) errors.push(`questão ${q.code}: assunto inexistente ${q.topic}`);
  if (codes.has(q.code)) errors.push(`questão ${q.code}: código duplicado`);
  codes.add(q.code);
  // coerência de especialidade: prefixo do código × especialidade do assunto
  const sp = topics.get(q.topic)?.specialty;
  if (q.code.startsWith("DEV") && sp !== "DEV") errors.push(`questão ${q.code}: assunto não é de Desenvolvimento`);
  if (q.code.startsWith("SUP") && sp !== "SUP") errors.push(`questão ${q.code}: assunto não é de Suporte`);
}
const slugs = new Set<string>();
for (const l of LESSONS) {
  if (!topics.has(l.topic)) errors.push(`aula ${l.slug}: assunto inexistente ${l.topic}`);
  if (slugs.has(l.slug)) errors.push(`aula ${l.slug}: slug duplicado`);
  if (!/^[a-z0-9-]+$/.test(l.slug)) errors.push(`aula ${l.slug}: slug inválido`);
  slugs.add(l.slug);
}
for (const [slug, cov] of Object.entries(LESSON_COVERS)) {
  if (!slugs.has(slug)) errors.push(`cobertura: aula inexistente ${slug}`);
  for (const t of cov) if (!topics.has(t)) errors.push(`cobertura ${slug}: assunto inexistente ${t}`);
}
for (const [t] of FLASHCARDS) if (!topics.has(t)) errors.push(`flashcard: assunto inexistente ${t}`);
for (const l of LABS) if (!topics.has(l.topic)) errors.push(`laboratório ${l.slug}: assunto inexistente ${l.topic}`);
const urls = new Set<string>();
for (const r of RESOURCES) {
  for (const t of r.topics) if (!topics.has(t)) errors.push(`recurso ${r.url}: assunto inexistente ${t}`);
  if (urls.has(r.url)) errors.push(`recurso duplicado: ${r.url}`);
  if (!r.url.startsWith("https://")) errors.push(`recurso sem https: ${r.url}`);
  urls.add(r.url);
}
console.log(`Assuntos: ${topics.size} · Questões: ${all.length} · Aulas: ${LESSONS.length} · Flashcards: ${FLASHCARDS.length} · Laboratórios: ${LABS.length} · Recursos: ${RESOURCES.length}`);
if (errors.length) {
  errors.forEach((e) => console.error("✗", e));
  process.exit(1);
}
console.log("✔ Conteúdo válido");
