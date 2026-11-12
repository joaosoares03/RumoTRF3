"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type AnswerResult = {
  correct: boolean;
  correctLetter: string;
  explanation: string;
  reference: string;
  alternatives: { letter: string; text: string; isCorrect: boolean; explanation: string }[];
  stats: { total: number; correctRate: number };
};

/** Registra a resposta e devolve o gabarito comentado (o gabarito só sai do servidor após a resposta). */
export async function answerQuestion(questionId: string, letter: string, timeSpentSec: number, mode: "PRATICA" | "REVISAO" | "CRONOMETRADO" = "PRATICA"): Promise<AnswerResult> {
  const user = await requireUser();
  if (!/^[A-E]$/.test(letter)) throw new Error("Alternativa inválida");
  const q = await db.question.findUniqueOrThrow({
    where: { id: questionId },
    include: { alternatives: { orderBy: { letter: "asc" } }, topic: { include: { module: true } } },
  });
  const correctAlt = q.alternatives.find((a) => a.isCorrect)!;
  const correct = correctAlt.letter === letter;
  const secs = Math.max(0, Math.min(3600, Math.round(timeSpentSec)));
  const now = new Date();
  await db.answer.create({ data: { userId: user.id, questionId, selectedLetter: letter, isCorrect: correct, timeSpentSec: secs, mode } });

  // tempo de resolução vira sessão de estudo (intervalos sobrepostos são mesclados nas estatísticas)
  if (secs >= 5) {
    await db.studySession.create({
      data: { userId: user.id, type: "QUESTOES", disciplineId: q.topic.module.disciplineId, topicId: q.topicId, startedAt: new Date(now.getTime() - Math.min(secs, 900) * 1000), endedAt: now, durationSec: Math.min(secs, 900) },
    });
  }

  // revisão automática de questões erradas: cria um flashcard pessoal com o gabarito (uma vez por questão)
  if (!correct) {
    const exists = await db.flashcard.findFirst({ where: { ownerId: user.id, sourceQuestionId: q.id } });
    if (!exists) {
      const card = await db.flashcard.create({
        data: {
          ownerId: user.id,
          disciplineId: q.topic.module.disciplineId,
          topicId: q.topicId,
          type: "BASICO",
          sourceQuestionId: q.id,
          front: `[Questão errada ${q.code}] ${q.statement.length > 600 ? q.statement.slice(0, 600) + "…" : q.statement}`,
          back: `Resposta: ${correctAlt.letter}) ${correctAlt.text}\n\n${q.explanation}`,
        },
      });
      await db.flashcardState.create({ data: { userId: user.id, flashcardId: card.id, dueAt: new Date(now.getTime() + 86400000) } });
    }
  }

  const [total, rights] = await Promise.all([db.answer.count({ where: { questionId } }), db.answer.count({ where: { questionId, isCorrect: true } })]);
  // sem revalidatePath: a página de resolução não deve ser recarregada (manteria o gabarito visível)
  return {
    correct,
    correctLetter: correctAlt.letter,
    explanation: q.explanation,
    reference: q.reference,
    alternatives: q.alternatives.map((a) => ({ letter: a.letter, text: a.text, isCorrect: a.isCorrect, explanation: a.explanation })),
    stats: { total, correctRate: total ? Math.round((rights / total) * 100) : 0 },
  };
}

async function upsertState(userId: string, questionId: string, data: { favorite?: boolean; flagged?: boolean; note?: string }) {
  await db.question.findUniqueOrThrow({ where: { id: questionId }, select: { id: true } });
  return db.questionUserState.upsert({ where: { userId_questionId: { userId, questionId } }, update: data, create: { userId, questionId, ...data } });
}

export async function toggleFavorite(questionId: string) {
  const user = await requireUser();
  const s = await db.questionUserState.findUnique({ where: { userId_questionId: { userId: user.id, questionId } } });
  const r = await upsertState(user.id, questionId, { favorite: !s?.favorite });
  return r.favorite;
}

export async function toggleFlag(questionId: string) {
  const user = await requireUser();
  const s = await db.questionUserState.findUnique({ where: { userId_questionId: { userId: user.id, questionId } } });
  const r = await upsertState(user.id, questionId, { flagged: !s?.flagged });
  return r.flagged;
}

export async function saveQuestionNote(questionId: string, note: string) {
  const user = await requireUser();
  await upsertState(user.id, questionId, { note: note.slice(0, 5000) });
}
