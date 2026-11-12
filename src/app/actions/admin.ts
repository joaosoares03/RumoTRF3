"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkUrl, expectedText, youtubeOEmbed } from "@/lib/linkcheck";
import { importLessons, importQuestions, importResources, type ImportReport } from "@/lib/content-import";

async function log(entity: string, entityId: string, action: string, details: string, userId: string) {
  await db.contentChangeLog.create({ data: { entity, entityId, action, details, userId } });
}

export async function verifyResource(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const r = await db.resource.findUniqueOrThrow({ where: { id } });
  let out = await checkUrl(r.url, expectedText(r.description));
  let title = r.title;
  // vídeos do YouTube: confirma título e canal reais via oEmbed
  if (r.type === "VIDEO" && /youtube\.com|youtu\.be/.test(r.url)) {
    const meta = await youtubeOEmbed(r.url);
    if (!meta) out = { status: "QUEBRADO", http: out.http, msg: "oEmbed não encontrou o vídeo" };
    else {
      title = `${meta.title} — ${meta.author}`;
      out = { ...out, msg: `oEmbed: "${meta.title}" (${meta.author})` };
    }
  }
  await db.resource.update({
    where: { id },
    data: { title, verificationStatus: out.status, httpStatus: out.http, verifiedAt: out.status === "VERIFICADO" ? new Date() : r.verifiedAt, verificationMethod: "GET + texto esperado (painel admin)" + (r.type === "VIDEO" ? " + oEmbed" : ""), status: out.status === "VERIFICADO" ? r.status : r.status === "PUBLICADO" ? "EM_REVISAO" : r.status },
  });
  await db.resourceCheckLog.create({ data: { resourceId: id, httpStatus: out.http, ok: out.status === "VERIFICADO", method: "GET", message: out.msg } });
  await log("Resource", id, "VERIFICADO_LINK", `${out.status}: ${out.msg}`, admin.id);
  revalidatePath("/admin");
}

export async function setResourceStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const status = z.enum(["PUBLICADO", "EM_REVISAO", "REJEITADO"]).parse(formData.get("status"));
  const r = await db.resource.findUniqueOrThrow({ where: { id } });
  if (status === "PUBLICADO" && r.verificationStatus !== "VERIFICADO") redirect("/admin?aba=recursos&erro=publicar-sem-verificar");
  await db.resource.update({ where: { id }, data: { status } });
  await log("Resource", id, `STATUS_${status}`, r.title, admin.id);
  revalidatePath("/admin");
}

export async function deleteResource(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const r = await db.resource.delete({ where: { id } });
  await log("Resource", id, "EXCLUIDO", `${r.title} (${r.url})`, admin.id);
  revalidatePath("/admin");
}

function encodeReport(r: ImportReport) {
  return encodeURIComponent(JSON.stringify({ ...r, duplicates: r.duplicates.slice(0, 30), errors: r.errors.slice(0, 30) }));
}

export async function importAction(formData: FormData) {
  const admin = await requireAdmin();
  const kind = String(formData.get("kind"));
  const publish = formData.get("publish") === "on";
  let items: unknown[];
  try {
    const parsed = JSON.parse(String(formData.get("json") ?? "[]"));
    items = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    redirect(`/admin?aba=importar&relatorio=${encodeReport({ created: 0, updated: 0, duplicates: [], errors: ["JSON inválido"] })}`);
  }
  if (items.length > 500) items = items.slice(0, 500);
  const rep = kind === "questoes" ? await importQuestions(items, admin.id, publish) : kind === "aulas" ? await importLessons(items, admin.id, publish) : await importResources(items, admin.id);
  revalidatePath("/admin");
  redirect(`/admin?aba=importar&relatorio=${encodeReport(rep)}`);
}

export async function setQuestionStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const status = z.enum(["PUBLICADO", "EM_REVISAO", "RASCUNHO"]).parse(formData.get("status"));
  const q = await db.question.update({ where: { id }, data: { status } });
  await log("Question", id, `STATUS_${status}`, q.code, admin.id);
  revalidatePath("/admin");
}

export async function setLessonStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const status = z.enum(["PUBLICADO", "RASCUNHO"]).parse(formData.get("status"));
  const l = await db.lesson.update({ where: { id }, data: { status } });
  await log("Lesson", id, `STATUS_${status}`, l.slug, admin.id);
  revalidatePath("/admin");
}

const versionSchema = z.object({
  number: z.string().min(3).max(20),
  title: z.string().min(5).max(200),
  url: z.string().url().refine((u) => u.startsWith("https://"), "Use https"),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(5).max(2000),
  alert: z.boolean(),
});

export async function addEditalVersion(formData: FormData) {
  const admin = await requireAdmin();
  const d = versionSchema.parse({ number: formData.get("number"), title: formData.get("title"), url: formData.get("url"), publishedAt: formData.get("publishedAt"), summary: formData.get("summary"), alert: formData.get("alert") === "on" });
  const exam = await db.exam.findFirstOrThrow();
  const v = await db.editalVersion.upsert({
    where: { examId_number: { examId: exam.id, number: d.number } },
    update: { title: d.title, url: d.url, summary: d.summary, publishedAt: new Date(`${d.publishedAt}T12:00:00Z`) },
    create: { examId: exam.id, number: d.number, title: d.title, url: d.url, summary: d.summary, publishedAt: new Date(`${d.publishedAt}T12:00:00Z`) },
  });
  if (d.alert) await db.officialUpdate.create({ data: { examId: exam.id, title: `${d.title} publicado`, summary: d.summary, url: d.url, publishedAt: new Date(`${d.publishedAt}T12:00:00Z`) } });
  await log("EditalVersion", v.id, "CADASTRADO", `${d.number} — ${d.title}`, admin.id);
  revalidatePath("/admin");
  revalidatePath("/concurso");
}

export async function updateExamDate(formData: FormData) {
  const admin = await requireAdmin();
  const date = String(formData.get("date"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Data inválida");
  const exam = await db.exam.findFirstOrThrow();
  await db.exam.update({ where: { id: exam.id }, data: { examDate: new Date(`${date}T09:00:00-03:00`) } });
  await log("Exam", exam.id, "DATA_PROVA", date, admin.id);
  revalidatePath("/", "layout");
}
