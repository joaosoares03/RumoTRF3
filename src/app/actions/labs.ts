"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

/** Registra a tentativa no laboratório. A execução de SQL ocorre só no navegador (sql.js/WebAssembly). */
export async function recordLabAttempt(exerciseId: string, correct: boolean, answer: string, elapsedSec: number) {
  const user = await requireUser();
  const ex = await db.labExercise.findUniqueOrThrow({ where: { id: exerciseId } });
  await db.labAttempt.create({ data: { userId: user.id, exerciseId, correct, answer: answer.slice(0, 5000) } });
  const secs = Math.max(0, Math.min(3600, Math.round(elapsedSec)));
  if (secs >= 30) {
    const end = new Date();
    const topic = ex.topicId ? await db.topic.findUnique({ where: { id: ex.topicId }, include: { module: true } }) : null;
    await db.studySession.create({ data: { userId: user.id, type: "LIVRE", topicId: ex.topicId, disciplineId: topic?.module.disciplineId ?? null, startedAt: new Date(end.getTime() - secs * 1000), endedAt: end, durationSec: secs, notes: `Laboratório: ${ex.title}` } });
  }
  revalidatePath("/laboratorio");
}
