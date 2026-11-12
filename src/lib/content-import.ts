import "server-only";
import { z } from "zod";
import { db } from "./db";
import { questionSchema, resourceSchema } from "./validation";
import { slugify } from "./utils";

/**
 * Pipeline de importação de conteúdo (usado pelo painel admin e por scripts/import-content.ts):
 *  validar → detectar duplicados → gravar como EM_REVISAO/RASCUNHO → registrar histórico.
 * Nada é publicado como verificado sem passar pela verificação de links ou pela revisão do administrador.
 */
export type ImportReport = { created: number; updated: number; duplicates: string[]; errors: string[] };

const normalizeTitle = (t: string) => slugify(t);

export async function importResources(items: unknown[], userId: string | null, origin = "IMPORTACAO"): Promise<ImportReport> {
  const rep: ImportReport = { created: 0, updated: 0, duplicates: [], errors: [] };
  const existing = await db.resource.findMany({ select: { url: true, title: true } });
  const urls = new Set(existing.map((e) => e.url.replace(/\/$/, "")));
  const titles = new Set(existing.map((e) => normalizeTitle(e.title)));
  for (const [i, raw] of items.entries()) {
    const extra = z.object({ expect: z.string().min(2).optional() }).safeParse(raw);
    const p = resourceSchema.safeParse(raw);
    if (!p.success) {
      rep.errors.push(`#${i + 1}: ${p.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
      continue;
    }
    const r = p.data;
    const url = r.url.replace(/\/$/, "");
    if (urls.has(url) || titles.has(normalizeTitle(r.title))) {
      rep.duplicates.push(r.url);
      continue;
    }
    const topics = await db.topic.findMany({ where: { slug: { in: r.topics } }, select: { id: true, slug: true } });
    const missing = r.topics.filter((s) => !topics.some((t) => t.slug === s));
    if (missing.length) {
      rep.errors.push(`#${i + 1}: assunto(s) inexistente(s): ${missing.join(", ")}`);
      continue;
    }
    const expect = extra.success && extra.data.expect ? ` [esperado: "${extra.data.expect}"]` : "";
    const res = await db.resource.create({
      data: {
        title: r.title,
        url: r.url,
        type: r.type,
        provider: r.provider,
        language: r.language,
        category: r.category,
        license: r.license ?? "Acesso público — consultar termos do provedor",
        description: (r.description + expect).trim(),
        origin,
        status: "EM_REVISAO",
        verificationStatus: "NAO_VERIFICADO",
        topics: { create: topics.map((t) => ({ topicId: t.id })) },
      },
    });
    urls.add(url);
    titles.add(normalizeTitle(r.title));
    await db.contentChangeLog.create({ data: { entity: "Resource", entityId: res.id, action: "IMPORTADO", details: `${r.title} (${r.url})`, userId } });
    rep.created++;
  }
  return rep;
}

export async function importQuestions(items: unknown[], userId: string | null, publish = false): Promise<ImportReport> {
  const rep: ImportReport = { created: 0, updated: 0, duplicates: [], errors: [] };
  for (const [i, raw] of items.entries()) {
    const p = questionSchema.safeParse(raw);
    if (!p.success) {
      rep.errors.push(`#${i + 1} (${(raw as { code?: string })?.code ?? "?"}): ${p.error.issues.map((x) => x.message).join("; ")}`);
      continue;
    }
    const q = p.data;
    const topic = await db.topic.findUnique({ where: { slug: q.topic } });
    if (!topic) {
      rep.errors.push(`${q.code}: assunto inexistente (${q.topic})`);
      continue;
    }
    const dupStatement = await db.question.findFirst({ where: { statement: q.statement, NOT: { code: q.code } }, select: { code: true } });
    if (dupStatement) {
      rep.duplicates.push(`${q.code} (enunciado idêntico a ${dupStatement.code})`);
      continue;
    }
    const exists = await db.question.findUnique({ where: { code: q.code } });
    const data = {
      topicId: topic.id,
      statement: q.statement,
      difficulty: q.difficulty,
      origin: q.origin,
      board: q.board ?? (q.origin === "OFICIAL" ? "" : "Treinamento (estilo Vunesp)"),
      year: q.year ?? null,
      explanation: q.explanation,
      reference: q.reference,
      status: publish ? "PUBLICADO" : "EM_REVISAO",
    };
    const saved = exists ? await db.question.update({ where: { id: exists.id }, data }) : await db.question.create({ data: { code: q.code, ...data } });
    await db.alternative.deleteMany({ where: { questionId: saved.id } });
    await db.alternative.createMany({ data: q.alternatives.map((a, k) => ({ questionId: saved.id, letter: "ABCDE"[k], text: a.text, isCorrect: a.correct, explanation: a.why })) });
    await db.contentChangeLog.create({ data: { entity: "Question", entityId: saved.id, action: exists ? "ATUALIZADO" : "IMPORTADO", details: q.code, userId } });
    if (exists) rep.updated++;
    else rep.created++;
  }
  return rep;
}

const lessonSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  topic: z.string(),
  title: z.string().min(3),
  minutes: z.number().int().min(1).max(300).default(20),
  summary: z.string().min(10),
  content: z.string().min(50),
});

export async function importLessons(items: unknown[], userId: string | null, publish = false): Promise<ImportReport> {
  const rep: ImportReport = { created: 0, updated: 0, duplicates: [], errors: [] };
  for (const [i, raw] of items.entries()) {
    const p = lessonSchema.safeParse(raw);
    if (!p.success) {
      rep.errors.push(`#${i + 1}: ${p.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
      continue;
    }
    const l = p.data;
    const topic = await db.topic.findUnique({ where: { slug: l.topic } });
    if (!topic) {
      rep.errors.push(`${l.slug}: assunto inexistente (${l.topic})`);
      continue;
    }
    const exists = await db.lesson.findUnique({ where: { slug: l.slug } });
    const data = { topicId: topic.id, title: l.title, summary: l.summary, content: l.content, estimatedMinutes: l.minutes, status: publish ? "PUBLICADO" : "RASCUNHO" };
    const saved = exists ? await db.lesson.update({ where: { id: exists.id }, data: { ...data, version: { increment: 1 } } }) : await db.lesson.create({ data: { slug: l.slug, ...data } });
    await db.contentChangeLog.create({ data: { entity: "Lesson", entityId: saved.id, action: exists ? "ATUALIZADO" : "IMPORTADO", details: l.slug, userId } });
    if (exists) rep.updated++;
    else rep.created++;
  }
  return rep;
}
