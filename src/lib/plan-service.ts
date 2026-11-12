import "server-only";
import { db } from "./db";
import { getDisciplines, getExam, getPrefs, scopeOf } from "./data";
import { generatePlan, rescheduleOverdue, studyDaysBetween, type PlannerTopic } from "./planner";
import { addDays, dayFromKey, localDateKey, parseJson, today } from "./utils";

/** Taxa de erro real por disciplina (para o planejamento adaptativo). */
export async function disciplineErrorStats(userId: string) {
  const answers = await db.answer.findMany({ where: { userId }, select: { isCorrect: true, question: { select: { topic: { select: { module: { select: { disciplineId: true } } } } } } } });
  const map = new Map<string, { answered: number; wrong: number }>();
  for (const a of answers) {
    const id = a.question.topic.module.disciplineId;
    const m = map.get(id) ?? { answered: 0, wrong: 0 };
    m.answered++;
    if (!a.isCorrect) m.wrong++;
    map.set(id, m);
  }
  return [...map.entries()].map(([disciplineId, m]) => ({ disciplineId, answered: m.answered, errorRate: m.answered ? m.wrong / m.answered : 0 }));
}

/**
 * Gera (ou regenera) o plano a partir de hoje até a véspera da prova.
 * Tarefas concluídas e tarefas criadas manualmente são preservadas; as pendentes automáticas futuras são substituídas.
 */
export async function buildPlan(userId: string) {
  const prefs = await getPrefs(userId);
  const exam = await getExam();
  const { prepared } = scopeOf(prefs);
  const disciplines = await getDisciplines(prepared);
  const progress = await db.topicProgress.findMany({ where: { userId } });
  const pMap = new Map(progress.map((p) => [p.topicId, p.status]));
  const mastered = new Set(parseJson<string[]>(prefs.masteredTopics, []));

  const topics: PlannerTopic[] = [];
  let order = 0;
  for (const d of disciplines) {
    for (const m of d.modules) {
      for (const t of m.topics) {
        const status = pMap.get(t.id);
        topics.push({
          id: t.id,
          title: t.title.length > 110 ? t.title.slice(0, 107) + "…" : t.title,
          disciplineId: d.id,
          disciplineName: d.name,
          kind: d.kind as "GERAL" | "ESPECIFICA",
          order: order++,
          mastered: mastered.has(t.id) || status === "DOMINADO",
          studied: !!status && status !== "NAO_INICIADO",
        });
      }
    }
  }

  const start = today();
  const examDay = dayFromKey(localDateKey(exam.examDate));
  const difficultSlugs = parseJson<string[]>(prefs.difficultDisciplines, []);
  const difficultIds = disciplines.filter((d) => difficultSlugs.includes(d.slug)).map((d) => d.id);
  const stats = await disciplineErrorStats(userId);

  const planned = generatePlan({
    startDate: start,
    examDate: examDay,
    dailyMinutes: prefs.dailyMinutes,
    studyDays: parseJson<number[]>(prefs.studyDays, [1, 2, 3, 4, 5, 6]),
    mode: prefs.planMode === "FIXO" ? "FIXO" : "CICLO",
    difficultDisciplineIds: difficultIds,
    topics,
    stats,
  });

  await db.$transaction(async (tx) => {
    await tx.studyPlan.updateMany({ where: { userId, active: true }, data: { active: false } });
    const plan = await tx.studyPlan.create({
      data: {
        userId,
        specialtyMode: prefs.specialtyMode,
        mode: prefs.planMode,
        startDate: start,
        endDate: examDay,
        dailyMinutes: prefs.dailyMinutes,
        studyDays: prefs.studyDays,
        params: JSON.stringify({ difficult: difficultSlugs, stats, topics: topics.length }),
      },
    });
    await tx.studyTask.deleteMany({ where: { userId, status: "PENDENTE", manual: false, date: { gte: start } } });
    // createMany em lotes (limite de variáveis do SQLite)
    for (let i = 0; i < planned.length; i += 400) {
      await tx.studyTask.createMany({
        data: planned.slice(i, i + 400).map((t) => ({
          planId: plan.id,
          userId,
          date: t.date,
          type: t.type,
          title: t.title,
          plannedMinutes: t.plannedMinutes,
          disciplineId: t.disciplineId,
          topicId: t.topicId,
          order: t.order,
        })),
      });
    }
  }, { timeout: 60000 });
  return planned.length;
}

/** Move tarefas pendentes atrasadas para os próximos dias de estudo com folga. */
export async function replanOverdue(userId: string) {
  const prefs = await getPrefs(userId);
  const exam = await getExam();
  const start = today();
  const overdue = await db.studyTask.findMany({ where: { userId, status: "PENDENTE", date: { lt: start } }, orderBy: [{ date: "asc" }, { order: "asc" }] });
  if (!overdue.length) return 0;
  const days = studyDaysBetween(start, dayFromKey(localDateKey(exam.examDate)), parseJson<number[]>(prefs.studyDays, [1, 2, 3, 4, 5, 6]));
  const upcoming = await db.studyTask.findMany({ where: { userId, date: { gte: start }, status: "PENDENTE" }, select: { date: true, plannedMinutes: true } });
  const load = new Map<string, number>();
  for (const u of upcoming) {
    const k = u.date.toISOString().slice(0, 10);
    load.set(k, (load.get(k) ?? 0) + u.plannedMinutes);
  }
  // tarefas de flashcards/revisão do passado viram uma só: não acumulam
  const relevant = overdue.filter((t) => t.type !== "FLASHCARDS");
  const moves = rescheduleOverdue(relevant, load, days, prefs.dailyMinutes);
  await db.$transaction([
    ...moves.map((m) => db.studyTask.update({ where: { id: m.id }, data: { date: m.date, rescheduled: { increment: 1 }, order: 50 } })),
    db.studyTask.updateMany({ where: { userId, status: "PENDENTE", type: "FLASHCARDS", date: { lt: start } }, data: { status: "PULADA" } }),
  ]);
  return moves.length;
}

export { addDays };
