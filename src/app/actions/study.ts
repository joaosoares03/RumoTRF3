"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TOPIC_REVIEW_INTERVALS } from "@/lib/sm2";
import { dayFromKey } from "@/lib/utils";

const DAY = 86400000;

async function ownTask(userId: string, id: string) {
  const t = await db.studyTask.findFirst({ where: { id, userId } });
  if (!t) throw new Error("Tarefa não encontrada");
  return t;
}

/** Atualiza o progresso do assunto conforme a atividade realizada. */
async function touchTopic(userId: string, topicId: string, kind: "TEORIA" | "REVISAO") {
  const p = await db.topicProgress.findUnique({ where: { userId_topicId: { userId, topicId } } });
  const now = new Date();
  if (kind === "TEORIA") {
    await db.topicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: { lastStudiedAt: now, status: p && p.status !== "NAO_INICIADO" ? p.status : "EM_ESTUDO", nextReviewAt: p?.nextReviewAt ?? new Date(now.getTime() + DAY) },
      create: { userId, topicId, status: "EM_ESTUDO", lastStudiedAt: now, nextReviewAt: new Date(now.getTime() + DAY) },
    });
  } else {
    const stage = Math.min((p?.reviewStage ?? 0) + 1, TOPIC_REVIEW_INTERVALS.length);
    const interval = TOPIC_REVIEW_INTERVALS[Math.min(stage, TOPIC_REVIEW_INTERVALS.length - 1)];
    await db.topicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: { lastReviewedAt: now, reviewStage: stage, status: p?.status === "DOMINADO" ? "DOMINADO" : "REVISANDO", nextReviewAt: stage >= TOPIC_REVIEW_INTERVALS.length ? null : new Date(now.getTime() + interval * DAY) },
      create: { userId, topicId, status: "REVISANDO", lastReviewedAt: now, reviewStage: 1, nextReviewAt: new Date(now.getTime() + 7 * DAY) },
    });
  }
}

export async function completeTask(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const minutes = Math.max(0, Math.min(600, Number(formData.get("minutes")) || 0));
  const task = await ownTask(user.id, id);
  if (task.status === "CONCLUIDA") {
    await db.studyTask.update({ where: { id }, data: { status: "PENDENTE", completedAt: null, actualMinutes: 0 } });
  } else {
    const now = new Date();
    await db.studyTask.update({ where: { id }, data: { status: "CONCLUIDA", completedAt: now, actualMinutes: minutes } });
    if (minutes > 0) {
      await db.studySession.create({
        data: { userId: user.id, disciplineId: task.disciplineId, topicId: task.topicId, type: "LIVRE", startedAt: new Date(now.getTime() - minutes * 60000), endedAt: now, durationSec: minutes * 60, notes: `Tarefa concluída: ${task.title}` },
      });
    }
    if (task.topicId && (task.type === "TEORIA" || task.type === "REVISAO")) await touchTopic(user.id, task.topicId, task.type);
  }
  revalidatePath("/dashboard");
  revalidatePath("/planejador");
  revalidatePath("/agenda");
}

export async function skipTask(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await ownTask(user.id, id);
  await db.studyTask.update({ where: { id }, data: { status: "PULADA" } });
  revalidatePath("/planejador");
  revalidatePath("/dashboard");
}

export async function moveTask(id: string, dateKey: string) {
  const user = await requireUser();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw new Error("Data inválida");
  await ownTask(user.id, id);
  await db.studyTask.update({ where: { id }, data: { date: dayFromKey(dateKey), rescheduled: { increment: 1 } } });
  revalidatePath("/planejador");
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
}

const manualTaskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["TEORIA", "QUESTOES", "REVISAO", "REDACAO", "SIMULADO", "FLASHCARDS", "LABORATORIO"]),
  minutes: z.coerce.number().int().min(5).max(600),
  disciplineId: z.string().optional(),
});

export async function addManualTask(formData: FormData) {
  const user = await requireUser();
  const d = manualTaskSchema.parse({
    title: formData.get("title"),
    date: formData.get("date"),
    type: formData.get("type"),
    minutes: formData.get("minutes"),
    disciplineId: formData.get("disciplineId") || undefined,
  });
  await db.studyTask.create({ data: { userId: user.id, title: d.title, date: dayFromKey(d.date), type: d.type, plannedMinutes: d.minutes, disciplineId: d.disciplineId ?? null, manual: true, order: 99 } });
  revalidatePath("/planejador");
  revalidatePath("/agenda");
}

export async function deleteTask(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await ownTask(user.id, id);
  await db.studyTask.delete({ where: { id } });
  revalidatePath("/planejador");
  revalidatePath("/agenda");
}

export async function setTopicStatus(formData: FormData) {
  const user = await requireUser();
  const topicId = String(formData.get("topicId"));
  const status = z.enum(["NAO_INICIADO", "EM_ESTUDO", "REVISANDO", "DOMINADO"]).parse(formData.get("status"));
  const priority = formData.get("priority") ? Math.max(1, Math.min(3, Number(formData.get("priority")))) : undefined;
  await db.topic.findUniqueOrThrow({ where: { id: topicId } });
  await db.topicProgress.upsert({
    where: { userId_topicId: { userId: user.id, topicId } },
    update: { status, ...(priority ? { priority } : {}), ...(status === "NAO_INICIADO" ? { nextReviewAt: null, reviewStage: 0 } : {}) },
    create: { userId: user.id, topicId, status, priority: priority ?? 2, lastStudiedAt: status === "NAO_INICIADO" ? null : new Date(), nextReviewAt: status === "EM_ESTUDO" ? new Date(Date.now() + DAY) : null },
  });
  revalidatePath("/edital");
  revalidatePath(`/assuntos/${topicId}`);
}

export async function markTopicReviewed(formData: FormData) {
  const user = await requireUser();
  const topicId = String(formData.get("topicId"));
  await db.topic.findUniqueOrThrow({ where: { id: topicId } });
  await touchTopic(user.id, topicId, "REVISAO");
  revalidatePath("/edital");
  revalidatePath(`/assuntos/${topicId}`);
}

export async function toggleSubtopic(formData: FormData) {
  const user = await requireUser();
  const subtopicId = String(formData.get("subtopicId"));
  const sub = await db.subtopic.findUniqueOrThrow({ where: { id: subtopicId } });
  const existing = await db.subtopicCheck.findUnique({ where: { userId_subtopicId: { userId: user.id, subtopicId } } });
  if (existing) await db.subtopicCheck.delete({ where: { id: existing.id } });
  else {
    await db.subtopicCheck.create({ data: { userId: user.id, subtopicId } });
    const p = await db.topicProgress.findUnique({ where: { userId_topicId: { userId: user.id, topicId: sub.topicId } } });
    if (!p || p.status === "NAO_INICIADO") await touchTopic(user.id, sub.topicId, "TEORIA");
  }
  revalidatePath(`/assuntos/${sub.topicId}`);
  revalidatePath("/edital");
}

// ───────── Aulas ─────────

export async function completeLesson(lessonId: string, readSeconds: number) {
  const user = await requireUser();
  const lesson = await db.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { topic: { include: { module: true } } } });
  const now = new Date();
  const existing = await db.lessonProgress.findUnique({ where: { userId_lessonId: { userId: user.id, lessonId } } });
  const done = !existing?.completedAt;
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { completedAt: done ? now : null, lastReadAt: now },
    create: { userId: user.id, lessonId, completedAt: now },
  });
  await logReading(user.id, lesson.topic.module.disciplineId, lesson.topicId, readSeconds);
  if (done) await touchTopic(user.id, lesson.topicId, "TEORIA");
  revalidatePath(`/aulas/${lesson.slug}`);
  return { completed: done };
}

async function logReading(userId: string, disciplineId: string, topicId: string, readSeconds: number) {
  const secs = Math.max(0, Math.min(4 * 3600, Math.round(readSeconds)));
  if (secs < 60) return;
  const end = new Date();
  await db.studySession.create({ data: { userId, disciplineId, topicId, type: "AULA", startedAt: new Date(end.getTime() - secs * 1000), endedAt: end, durationSec: secs } });
}

export async function recordReading(lessonId: string, readSeconds: number) {
  const user = await requireUser();
  const lesson = await db.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { topic: { include: { module: true } } } });
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { lastReadAt: new Date(), readCount: { increment: 1 } },
    create: { userId: user.id, lessonId },
  });
  await logReading(user.id, lesson.topic.module.disciplineId, lesson.topicId, readSeconds);
}

export async function toggleLessonFavorite(lessonId: string) {
  const user = await requireUser();
  const p = await db.lessonProgress.findUnique({ where: { userId_lessonId: { userId: user.id, lessonId } } });
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { favorite: !p?.favorite },
    create: { userId: user.id, lessonId, favorite: true },
  });
  return !p?.favorite;
}

export async function addHighlight(lessonId: string, text: string, note: string) {
  const user = await requireUser();
  const t = text.trim().slice(0, 2000);
  if (t.length < 3) throw new Error("Selecione um trecho maior");
  await db.lesson.findUniqueOrThrow({ where: { id: lessonId } });
  const h = await db.highlight.create({ data: { userId: user.id, lessonId, text: t, note: note.slice(0, 2000) } });
  return { id: h.id, text: h.text, note: h.note };
}

export async function deleteHighlight(id: string) {
  const user = await requireUser();
  await db.highlight.deleteMany({ where: { id, userId: user.id } });
}

// ───────── Sessões de estudo (modo foco / Pomodoro) ─────────

export async function logStudySession(input: { startedAt: string; endedAt: string; type: string; disciplineId?: string | null; notes?: string }) {
  const user = await requireUser();
  const start = new Date(input.startedAt);
  const end = new Date(input.endedAt);
  const secs = Math.round((end.getTime() - start.getTime()) / 1000);
  if (!(secs > 30 && secs < 6 * 3600) || end.getTime() > Date.now() + 60000) throw new Error("Sessão inválida");
  const type = ["POMODORO", "LIVRE"].includes(input.type) ? input.type : "LIVRE";
  if (input.disciplineId) await db.discipline.findUniqueOrThrow({ where: { id: input.disciplineId } });
  await db.studySession.create({ data: { userId: user.id, startedAt: start, endedAt: end, durationSec: secs, type, disciplineId: input.disciplineId || null, notes: (input.notes ?? "").slice(0, 500) } });
  revalidatePath("/dashboard");
  revalidatePath("/foco");
}

export async function markNotificationsRead() {
  const user = await requireUser();
  await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath("/", "layout");
}

export async function saveWeeklyGoal(formData: FormData) {
  const user = await requireUser();
  const weekStart = dayFromKey(String(formData.get("weekStart")));
  const targetMinutes = Math.max(0, Math.min(10000, Number(formData.get("targetMinutes")) || 0));
  const targetQuestions = Math.max(0, Math.min(5000, Number(formData.get("targetQuestions")) || 0));
  const targetReviews = Math.max(0, Math.min(5000, Number(formData.get("targetReviews")) || 0));
  await db.weeklyGoal.upsert({
    where: { userId_weekStart: { userId: user.id, weekStart } },
    update: { targetMinutes, targetQuestions, targetReviews },
    create: { userId: user.id, weekStart, targetMinutes, targetQuestions, targetReviews },
  });
  revalidatePath("/planejador");
  revalidatePath("/dashboard");
}
