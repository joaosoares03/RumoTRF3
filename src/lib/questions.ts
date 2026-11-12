import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import type { PlayerQuestion } from "@/components/question-player";
import { seededRandom, shuffle } from "./utils";
import type { SpecKey } from "./data";

export type QuestionFilters = {
  disciplina?: string;
  assunto?: string;
  dificuldade?: string;
  situacao?: string; // ineditas | respondidas | erradas | favoritas | sinalizadas
  origem?: string; // AUTORAL | OFICIAL
  qtd?: string;
};

export function scopeWhere(specKeys: SpecKey[]): Prisma.QuestionWhereInput {
  return { status: "PUBLICADO", topic: { module: { discipline: { OR: [{ specialtyId: null }, { specialty: { key: { in: specKeys } } }] } } } };
}

export async function buildQuestionWhere(userId: string, specKeys: SpecKey[], f: QuestionFilters): Promise<Prisma.QuestionWhereInput> {
  const and: Prisma.QuestionWhereInput[] = [scopeWhere(specKeys)];
  if (f.disciplina) and.push({ topic: { module: { disciplineId: f.disciplina } } });
  if (f.assunto) and.push({ topicId: f.assunto });
  if (f.dificuldade && ["1", "2", "3"].includes(f.dificuldade)) and.push({ difficulty: Number(f.dificuldade) });
  if (f.origem === "AUTORAL" || f.origem === "OFICIAL") and.push({ origin: f.origem });
  switch (f.situacao) {
    case "ineditas":
      and.push({ answers: { none: { userId } } });
      break;
    case "respondidas":
      and.push({ answers: { some: { userId } } });
      break;
    case "erradas": {
      // erradas = última resposta do usuário incorreta
      const last = await db.answer.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { questionId: true, isCorrect: true } });
      const seen = new Set<string>();
      const wrong: string[] = [];
      for (const a of last) {
        if (seen.has(a.questionId)) continue;
        seen.add(a.questionId);
        if (!a.isCorrect) wrong.push(a.questionId);
      }
      and.push({ id: { in: wrong } });
      break;
    }
    case "favoritas":
      and.push({ states: { some: { userId, favorite: true } } });
      break;
    case "sinalizadas":
      and.push({ states: { some: { userId, flagged: true } } });
      break;
  }
  return { AND: and };
}

export async function loadPlayerQuestions(userId: string, where: Prisma.QuestionWhereInput, take = 20, random: boolean | number = true): Promise<PlayerQuestion[]> {
  const ids = (await db.question.findMany({ where, select: { id: true }, orderBy: { code: "asc" } })).map((q) => q.id);
  const picked = (random === false ? ids : shuffle(ids, typeof random === "number" ? seededRandom(random) : Math.random)).slice(0, Math.max(1, Math.min(100, take)));
  const qs = await db.question.findMany({
    where: { id: { in: picked } },
    include: {
      alternatives: { select: { letter: true, text: true }, orderBy: { letter: "asc" } }, // sem isCorrect/explicação!
      topic: { select: { title: true, module: { select: { discipline: { select: { name: true } } } } } },
      states: { where: { userId } },
      answers: { where: { userId }, select: { isCorrect: true } },
    },
  });
  const byId = new Map(qs.map((q) => [q.id, q]));
  return picked
    .map((id) => byId.get(id)!)
    .filter(Boolean)
    .map((q) => ({
      id: q.id,
      code: q.code,
      statement: q.statement,
      difficulty: q.difficulty,
      board: q.board,
      origin: q.origin,
      year: q.year,
      topicTitle: q.topic.title,
      disciplineName: q.topic.module.discipline.name,
      alternatives: q.alternatives,
      favorite: q.states[0]?.favorite ?? false,
      flagged: q.states[0]?.flagged ?? false,
      note: q.states[0]?.note ?? "",
      previous: { answered: q.answers.length, correct: q.answers.filter((a) => a.isCorrect).length },
    }));
}
