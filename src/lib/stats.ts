import "server-only";
import { db } from "./db";
import {
  activeDayKeys,
  dueFlashcardsCount,
  getDisciplines,
  getPrefs,
  getTopicStats,
  localDayBounds,
  mergedMinutes,
  scopeOf,
  streakFrom,
  topicPercent,
  type SpecKey,
} from "./data";
import { addDays, localDateKey, today } from "./utils";

/** Progresso do edital por disciplina, para as especialidades informadas. */
export async function editalProgress(userId: string, specKeys: SpecKey[]) {
  const disciplines = await getDisciplines(specKeys);
  const topicIds = disciplines.flatMap((d) => d.modules.flatMap((m) => m.topics.map((t) => t.id)));
  const stats = await getTopicStats(userId, topicIds);
  const perDiscipline = disciplines.map((d) => {
    const topics = d.modules.flatMap((m) => m.topics);
    const pcts = topics.map((t) => {
      const s = stats.get(t.id)!;
      return topicPercent(s.progress?.status, s.checked, t.subtopics.length);
    });
    const answered = topics.reduce((a, t) => a + stats.get(t.id)!.answered, 0);
    const correct = topics.reduce((a, t) => a + stats.get(t.id)!.correct, 0);
    return {
      id: d.id,
      slug: d.slug,
      name: d.name,
      kind: d.kind,
      color: d.color,
      specialty: d.specialty?.key ?? null,
      topics: topics.length,
      percent: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0,
      answered,
      correct,
    };
  });
  const allPcts = perDiscipline.flatMap((d) => Array(d.topics).fill(d.percent) as number[]);
  const overall = allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0;
  return { perDiscipline, overall, disciplines, stats };
}

export async function questionTotals(userId: string, specKeys: SpecKey[]) {
  const where = { userId, question: { topic: { module: { discipline: { OR: [{ specialtyId: null }, { specialty: { key: { in: specKeys } } }] } } } } };
  const [answered, correct] = await Promise.all([db.answer.count({ where }), db.answer.count({ where: { ...where, isCorrect: true } })]);
  return { answered, correct, rate: answered ? Math.round((correct / answered) * 1000) / 10 : 0 };
}

/** Série diária dos últimos N dias: minutos estudados, questões respondidas e acertos. */
export async function dailySeries(userId: string, days = 14) {
  const keys = Array.from({ length: days }, (_, i) => localDateKey(addDays(new Date(), i - days + 1)));
  const from = localDayBounds(keys[0]).start;
  const [sessions, answers] = await Promise.all([
    db.studySession.findMany({ where: { userId, startedAt: { gte: from } }, select: { startedAt: true, endedAt: true } }),
    db.answer.findMany({ where: { userId, createdAt: { gte: from } }, select: { createdAt: true, isCorrect: true } }),
  ]);
  return keys.map((k) => {
    const { start, end } = localDayBounds(k);
    const ses = sessions.filter((s) => s.startedAt >= start && s.startedAt < end).map((s) => ({ start: s.startedAt, end: s.endedAt }));
    const ans = answers.filter((a) => a.createdAt >= start && a.createdAt < end);
    const correct = ans.filter((a) => a.isCorrect).length;
    return {
      key: k,
      label: `${k.slice(8, 10)}/${k.slice(5, 7)}`,
      minutos: mergedMinutes(ses),
      questoes: ans.length,
      acertos: correct,
      taxa: ans.length ? Math.round((correct / ans.length) * 100) : null,
    };
  });
}

export async function minutesToday(userId: string) {
  const { start, end } = localDayBounds(localDateKey());
  const s = await db.studySession.findMany({ where: { userId, startedAt: { gte: start, lt: end } }, select: { startedAt: true, endedAt: true } });
  return mergedMinutes(s.map((x) => ({ start: x.startedAt, end: x.endedAt })));
}

export async function minutesThisWeek(userId: string) {
  const now = new Date();
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short" }).format(now));
  const mondayKey = localDateKey(addDays(now, dow === 0 ? -6 : 1 - dow));
  const { start } = localDayBounds(mondayKey);
  const s = await db.studySession.findMany({ where: { userId, startedAt: { gte: start } }, select: { startedAt: true, endedAt: true } });
  return { minutes: mergedMinutes(s.map((x) => ({ start: x.startedAt, end: x.endedAt }))), mondayKey };
}

/** Sugestão do próximo conteúdo — baseada apenas em dados reais (plano do dia, desempenho e ordem do edital). */
export async function nextSuggestion(userId: string, specKeys: SpecKey[]) {
  const t = today();
  const task = await db.studyTask.findFirst({
    where: { userId, status: "PENDENTE", date: { lte: t }, type: { in: ["TEORIA", "REVISAO", "QUESTOES"] }, topicId: { not: null } },
    orderBy: [{ date: "asc" }, { order: "asc" }],
    include: { topic: { include: { lessons: { select: { slug: true }, take: 1 }, lessonCovers: { select: { lesson: { select: { slug: true } } }, take: 1 }, module: { include: { discipline: true } } } } },
  });
  if (task?.topic) {
    return {
      reason: task.date < t ? "Tarefa atrasada do seu plano" : "Próxima tarefa do seu plano de hoje",
      topic: task.topic,
      discipline: task.topic.module.discipline,
      lessonSlug: task.topic.lessons[0]?.slug ?? task.topic.lessonCovers[0]?.lesson.slug ?? null,
      type: task.type,
    };
  }
  // pior desempenho (mínimo 5 respostas)
  const { disciplines, stats } = await editalProgress(userId, specKeys);
  let worst: { id: string; rate: number } | null = null;
  for (const [id, s] of stats) {
    if (s.answered >= 5) {
      const rate = s.correct / s.answered;
      if (rate < 0.65 && (!worst || rate < worst.rate)) worst = { id, rate };
    }
  }
  const pick = worst?.id ?? [...stats.entries()].find(([, s]) => !s.progress || s.progress.status === "NAO_INICIADO")?.[0];
  if (!pick) return null;
  const topic = await db.topic.findUnique({ where: { id: pick }, include: { lessons: { select: { slug: true }, take: 1 }, lessonCovers: { select: { lesson: { select: { slug: true } } }, take: 1 }, module: { include: { discipline: true } } } });
  if (!topic) return null;
  void disciplines;
  return {
    reason: worst ? `Taxa de acerto de ${Math.round(worst.rate * 100)}% neste assunto — reforce a base` : "Próximo assunto ainda não iniciado na ordem do edital",
    topic,
    discipline: topic.module.discipline,
    lessonSlug: topic.lessons[0]?.slug ?? topic.lessonCovers[0]?.lesson.slug ?? null,
    type: worst ? "REVISAO" : "TEORIA",
  };
}

/** Gera notificações (idempotentes por dedupeKey) a partir do estado real do usuário. */
export async function syncNotifications(userId: string) {
  const prefs = await getPrefs(userId);
  if (!prefs.notificationsEnabled) return;
  const { prepared } = scopeOf(prefs);
  const dayKey = localDateKey();
  const { due } = await dueFlashcardsCount(userId, prepared);
  const overdue = await db.studyTask.count({ where: { userId, status: "PENDENTE", date: { lt: today() } } });
  const topicReviews = await db.topicProgress.count({ where: { userId, nextReviewAt: { lte: new Date() } } });
  const items: { type: string; title: string; body: string; link: string; key: string }[] = [];
  if (due > 0) items.push({ type: "REVISAO", title: `${due} flashcard(s) para revisar hoje`, body: "Revisões em dia aumentam a retenção de longo prazo.", link: "/flashcards/revisar", key: `fc-${dayKey}` });
  if (topicReviews > 0) items.push({ type: "REVISAO", title: `${topicReviews} assunto(s) com revisão agendada`, body: "Veja no edital verticalizado quais assuntos estão no ciclo de revisão.", link: "/edital?filtro=revisao", key: `tr-${dayKey}` });
  if (overdue > 0) items.push({ type: "META", title: `${overdue} tarefa(s) atrasada(s) no plano`, body: "Use \"Replanejar atrasadas\" para redistribuí-las nos próximos dias.", link: "/planejador", key: `od-${dayKey}` });
  const updates = await db.officialUpdate.findMany({ orderBy: { publishedAt: "desc" }, take: 5 });
  for (const u of updates) items.push({ type: "OFICIAL", title: u.title, body: u.summary, link: "/concurso", key: `of-${u.id}` });
  for (const it of items) {
    await db.notification.upsert({
      where: { userId_dedupeKey: { userId, dedupeKey: it.key } },
      update: {},
      create: { userId, type: it.type, title: it.title, body: it.body, link: it.link, dedupeKey: it.key },
    });
  }
}

export const ACHIEVEMENTS: Record<string, { title: string; description: string }> = {
  PRIMEIRA_QUESTAO: { title: "Primeiro passo", description: "Respondeu a primeira questão" },
  CEM_QUESTOES: { title: "Centena", description: "Respondeu 100 questões" },
  QUINHENTAS_QUESTOES: { title: "Maratonista", description: "Respondeu 500 questões" },
  PRIMEIRO_SIMULADO: { title: "Ensaio geral", description: "Concluiu o primeiro simulado" },
  SIMULADO_COMPLETO: { title: "Prova de fogo", description: "Concluiu um simulado completo (60 questões)" },
  PRIMEIRA_REDACAO: { title: "Pena afiada", description: "Finalizou a primeira redação" },
  SEQUENCIA_7: { title: "Uma semana firme", description: "7 dias seguidos de estudo" },
  SEQUENCIA_30: { title: "Hábito formado", description: "30 dias seguidos de estudo" },
  FLASHCARDS_100: { title: "Memória de elefante", description: "100 revisões de flashcards" },
  PRIMEIRA_AULA: { title: "Aula concluída", description: "Concluiu a primeira aula" },
  EDITAL_25: { title: "Um quarto do caminho", description: "25% do edital estudado" },
  EDITAL_50: { title: "Metade do edital", description: "50% do edital estudado" },
};

export async function syncAchievements(userId: string, ctx: { answered: number; streak: number; editalPct: number }) {
  const [sims, fullSims, essays, reviews, lessons] = await Promise.all([
    db.simulado.count({ where: { userId, status: "FINALIZADO" } }),
    db.simulado.count({ where: { userId, status: "FINALIZADO", type: "COMPLETO" } }),
    db.essay.count({ where: { userId, status: "FINALIZADA" } }),
    db.reviewLog.count({ where: { userId } }),
    db.lessonProgress.count({ where: { userId, completedAt: { not: null } } }),
  ]);
  const earned: string[] = [];
  if (ctx.answered >= 1) earned.push("PRIMEIRA_QUESTAO");
  if (ctx.answered >= 100) earned.push("CEM_QUESTOES");
  if (ctx.answered >= 500) earned.push("QUINHENTAS_QUESTOES");
  if (sims >= 1) earned.push("PRIMEIRO_SIMULADO");
  if (fullSims >= 1) earned.push("SIMULADO_COMPLETO");
  if (essays >= 1) earned.push("PRIMEIRA_REDACAO");
  if (ctx.streak >= 7) earned.push("SEQUENCIA_7");
  if (ctx.streak >= 30) earned.push("SEQUENCIA_30");
  if (reviews >= 100) earned.push("FLASHCARDS_100");
  if (lessons >= 1) earned.push("PRIMEIRA_AULA");
  if (ctx.editalPct >= 25) earned.push("EDITAL_25");
  if (ctx.editalPct >= 50) earned.push("EDITAL_50");
  const existing = new Set((await db.achievement.findMany({ where: { userId }, select: { code: true } })).map((a) => a.code));
  for (const code of earned.filter((c) => !existing.has(c))) {
    await db.achievement.create({ data: { userId, code } });
    const prefs = await getPrefs(userId);
    if (prefs.notificationsEnabled)
      await db.notification.create({ data: { userId, type: "CONQUISTA", title: `Conquista: ${ACHIEVEMENTS[code].title}`, body: ACHIEVEMENTS[code].description, link: "/desempenho#conquistas", dedupeKey: `ach-${code}` } }).catch(() => {});
  }
  return db.achievement.findMany({ where: { userId }, orderBy: { unlockedAt: "desc" } });
}

export async function getStreak(userId: string) {
  return streakFrom(await activeDayKeys(userId));
}
