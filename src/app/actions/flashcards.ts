"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getExam } from "@/lib/data";
import { sm2 } from "@/lib/sm2";

/** Registra uma revisão com SM-2 e agenda a próxima. O intervalo é limitado à data da prova. */
export async function reviewCard(flashcardId: string, grade: number, elapsedSec: number) {
  const user = await requireUser();
  const card = await db.flashcard.findFirst({ where: { id: flashcardId, OR: [{ ownerId: null }, { ownerId: user.id }] }, include: { discipline: true } });
  if (!card) throw new Error("Cartão não encontrado");
  const exam = await getExam();
  const daysToExam = Math.max(1, Math.ceil((exam.examDate.getTime() - Date.now()) / 86400000));
  const prev = await db.flashcardState.findUnique({ where: { userId_flashcardId: { userId: user.id, flashcardId } } });
  const base = prev ?? { easeFactor: 2.5, intervalDays: 0, repetitions: 0, lapses: 0 };
  const next = sm2(base, grade, daysToExam);
  const now = new Date();
  const dueAt = new Date(now.getTime() + next.intervalDays * 86400000);
  await db.flashcardState.upsert({
    where: { userId_flashcardId: { userId: user.id, flashcardId } },
    update: { ...next, dueAt, lastReviewedAt: now },
    create: { userId: user.id, flashcardId, ...next, dueAt, lastReviewedAt: now },
  });
  await db.reviewLog.create({ data: { userId: user.id, flashcardId, grade, intervalBefore: base.intervalDays, intervalAfter: next.intervalDays } });
  const secs = Math.max(0, Math.min(300, Math.round(elapsedSec)));
  if (secs >= 3) await db.studySession.create({ data: { userId: user.id, type: "FLASHCARDS", disciplineId: card.disciplineId, topicId: card.topicId, startedAt: new Date(now.getTime() - secs * 1000), endedAt: now, durationSec: secs } });
  return { intervalDays: next.intervalDays, dueAt: dueAt.toISOString() };
}

const cardSchema = z.object({
  disciplineId: z.string().min(1),
  topicId: z.string().optional(),
  type: z.enum(["BASICO", "LACUNA", "CODIGO"]),
  front: z.string().trim().min(2).max(2000),
  back: z.string().trim().min(1).max(4000),
});

export async function createCard(formData: FormData) {
  const user = await requireUser();
  const d = cardSchema.parse({ disciplineId: formData.get("disciplineId"), topicId: formData.get("topicId") || undefined, type: formData.get("type"), front: formData.get("front"), back: formData.get("back") });
  await db.discipline.findUniqueOrThrow({ where: { id: d.disciplineId } });
  if (d.topicId) await db.topic.findUniqueOrThrow({ where: { id: d.topicId } });
  await db.flashcard.create({ data: { ownerId: user.id, ...d, topicId: d.topicId ?? null } });
  revalidatePath("/flashcards");
}

export async function updateCard(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const card = await db.flashcard.findFirst({ where: { id, ownerId: user.id } });
  if (!card) throw new Error("Só é possível editar cartões próprios");
  await db.flashcard.update({ where: { id }, data: { front: String(formData.get("front")).slice(0, 2000), back: String(formData.get("back")).slice(0, 4000) } });
  revalidatePath("/flashcards");
}

export async function deleteCard(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await db.flashcard.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/flashcards");
}

export async function toggleSuspend(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const s = await db.flashcardState.findUnique({ where: { userId_flashcardId: { userId: user.id, flashcardId: id } } });
  await db.flashcardState.upsert({
    where: { userId_flashcardId: { userId: user.id, flashcardId: id } },
    update: { suspended: !s?.suspended },
    create: { userId: user.id, flashcardId: id, suspended: true },
  });
  revalidatePath("/flashcards");
}
