import "server-only";
import { db } from "./db";
import { addDays, dayFromKey, localDateKey, parseJson, startOfWeek, today } from "./utils";
import { mergedMinutes, topicPercent, masteryLevel, STATUS_PCT } from "./data-pure";
export { mergedMinutes, topicPercent, masteryLevel, STATUS_PCT };

export type SpecKey = "DEV" | "SUP";

export async function getPrefs(userId: string) {
  return db.userPreferences.upsert({ where: { userId }, update: {}, create: { userId } });
}

/** Especialidades preparadas pelo usuário e a especialidade ativa na interface. */
export function scopeOf(prefs: { specialtyMode: string; activeSpecialty: string }) {
  const prepared: SpecKey[] = prefs.specialtyMode === "AMBAS" ? ["DEV", "SUP"] : [prefs.specialtyMode as SpecKey];
  // A especialidade ATIVA define o que é exibido (edital, questões, simulados, estatísticas);
  // as PREPARADAS definem o que entra no plano de estudos. O usuário pode consultar a outra a qualquer momento.
  const active = (prefs.activeSpecialty === "SUP" ? "SUP" : "DEV") as SpecKey;
  return { prepared, active };
}

export async function getExam() {
  return db.exam.findFirstOrThrow({ include: { specialties: true } });
}

/** Disciplinas no escopo: gerais (compartilhadas) + específicas das especialidades informadas. */
export async function getDisciplines(specKeys: SpecKey[]) {
  return db.discipline.findMany({
    where: { OR: [{ specialtyId: null }, { specialty: { key: { in: specKeys } } }] },
    orderBy: { order: "asc" },
    include: {
      specialty: true,
      modules: { orderBy: { order: "asc" }, include: { topics: { orderBy: { order: "asc" }, include: { subtopics: { orderBy: { order: "asc" } } } } } },
    },
  });
}

/** Estatísticas por assunto para o usuário (progresso, subassuntos, respostas). */
export async function getTopicStats(userId: string, topicIds: string[]) {
  const [progress, checks, answers] = await Promise.all([
    db.topicProgress.findMany({ where: { userId, topicId: { in: topicIds } } }),
    db.subtopicCheck.findMany({ where: { userId, subtopic: { topicId: { in: topicIds } } }, include: { subtopic: { select: { topicId: true } } } }),
    db.answer.findMany({ where: { userId, question: { topicId: { in: topicIds } } }, select: { isCorrect: true, question: { select: { topicId: true } } } }),
  ]);
  const map = new Map<string, { progress?: (typeof progress)[number]; checked: number; answered: number; correct: number }>();
  for (const id of topicIds) map.set(id, { checked: 0, answered: 0, correct: 0 });
  for (const p of progress) map.get(p.topicId)!.progress = p;
  for (const c of checks) map.get(c.subtopic.topicId)!.checked++;
  for (const a of answers) {
    const m = map.get(a.question.topicId)!;
    m.answered++;
    if (a.isCorrect) m.correct++;
  }
  return map;
}

export async function getSessions(userId: string, from: Date, to: Date) {
  return db.studySession.findMany({ where: { userId, startedAt: { gte: from, lt: to } }, select: { startedAt: true, endedAt: true, disciplineId: true, type: true, durationSec: true } });
}

/** Limites (UTC) de um dia local de São Paulo (UTC−3, sem horário de verão desde 2019). */
export function localDayBounds(key: string) {
  const start = new Date(`${key}T03:00:00.000Z`);
  return { start, end: new Date(start.getTime() + 86400000) };
}

export async function minutesBetween(userId: string, from: Date, to: Date) {
  const s = await getSessions(userId, from, to);
  return mergedMinutes(s.map((x) => ({ start: x.startedAt, end: x.endedAt })));
}

/** Dias (YYYY-MM-DD locais) com atividade real: sessões, respostas, revisões de flashcards ou tarefas concluídas. */
export async function activeDayKeys(userId: string, sinceDays = 400): Promise<Set<string>> {
  const since = new Date(Date.now() - sinceDays * 86400000);
  const [s, a, r, t] = await Promise.all([
    db.studySession.findMany({ where: { userId, startedAt: { gte: since } }, select: { startedAt: true } }),
    db.answer.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
    db.reviewLog.findMany({ where: { userId, reviewedAt: { gte: since } }, select: { reviewedAt: true } }),
    db.studyTask.findMany({ where: { userId, completedAt: { gte: since } }, select: { completedAt: true } }),
  ]);
  const keys = new Set<string>();
  s.forEach((x) => keys.add(localDateKey(x.startedAt)));
  a.forEach((x) => keys.add(localDateKey(x.createdAt)));
  r.forEach((x) => keys.add(localDateKey(x.reviewedAt)));
  t.forEach((x) => x.completedAt && keys.add(localDateKey(x.completedAt)));
  return keys;
}

export function streakFrom(keys: Set<string>): number {
  let d = today();
  if (!keys.has(localDateKey(new Date()))) d = addDays(d, -1); // a sequência continua válida até o fim do dia
  let n = 0;
  while (keys.has(d.toISOString().slice(0, 10))) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export async function dueFlashcardsCount(userId: string, specKeys: SpecKey[]) {
  const now = new Date();
  const scopeCards = { OR: [{ discipline: { specialtyId: null } }, { discipline: { specialty: { key: { in: specKeys } } } }] };
  const [dueStates, newCards] = await Promise.all([
    db.flashcardState.count({ where: { userId, suspended: false, dueAt: { lte: now }, flashcard: scopeCards } }),
    db.flashcard.count({ where: { AND: [scopeCards, { OR: [{ ownerId: null }, { ownerId: userId }] }], states: { none: { userId } } } }),
  ]);
  return { due: dueStates, newCards };
}

export function weekRange(ref = today()) {
  const start = startOfWeek(ref);
  return { start, end: addDays(start, 7) };
}

export function dayKeyToLocalStart(key: string) {
  return localDayBounds(key).start;
}

export { dayFromKey, parseJson };
