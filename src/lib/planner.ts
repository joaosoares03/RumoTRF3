/**
 * Planejador de estudos — função pura (sem acesso a banco) para facilitar testes.
 *
 * Lógica (documentada também em docs/ALGORITMOS.md):
 * 1. Dias de estudo = dias da semana escolhidos entre a data inicial e a véspera da prova.
 * 2. Peso de cada disciplina = peso da prova (Gerais 1, Específicos 2) × nº de assuntos pendentes
 *    × 1,4 se o estudante marcou a disciplina como difícil × (1 + taxa de erro) quando houver ≥ 5 respostas.
 * 3. Modo CICLO: sequência de disciplinas por round-robin ponderado suave (smooth weighted round robin).
 *    Modo FIXO: cada dia da semana recebe um conjunto fixo de disciplinas, distribuídas pelo peso.
 * 4. Cada dia recebe: flashcards (10–15 min), revisões programadas (1, 7, 15 e 30 dias após a teoria),
 *    blocos de Teoria + Questões do mesmo assunto, redação semanal e simulados quinzenais.
 * 5. Última semana antes da prova = "Semana de revisão": somente revisões, questões, simulado e redação.
 * 6. Quando todos os assuntos foram vistos, inicia-se a "2ª passada" priorizando disciplinas com mais erros.
 * Nenhuma probabilidade de cobrança é presumida: o peso vem exclusivamente do edital e do desempenho real.
 */
import { TOPIC_REVIEW_INTERVALS } from "./sm2";

export type PlannerTopic = {
  id: string;
  title: string;
  disciplineId: string;
  disciplineName: string;
  kind: "GERAL" | "ESPECIFICA";
  order: number;
  mastered: boolean;
  /** já estudado anteriormente (status diferente de NAO_INICIADO) */
  studied: boolean;
};

export type PlannerDisciplineStats = { disciplineId: string; answered: number; errorRate: number };

export type PlannerInput = {
  startDate: Date; // dia às 12:00 UTC
  examDate: Date; // dia às 12:00 UTC
  dailyMinutes: number;
  studyDays: number[]; // 0..6
  mode: "CICLO" | "FIXO";
  difficultDisciplineIds: string[];
  topics: PlannerTopic[];
  stats: PlannerDisciplineStats[];
};

export type PlannedTask = {
  date: Date;
  type: "TEORIA" | "QUESTOES" | "REVISAO" | "REDACAO" | "SIMULADO" | "FLASHCARDS";
  title: string;
  plannedMinutes: number;
  disciplineId: string | null;
  topicId: string | null;
  order: number;
};

const DAY = 86400000;

export function studyDaysBetween(start: Date, examDate: Date, studyDays: number[]): Date[] {
  const days: Date[] = [];
  const allowed = new Set(studyDays.length ? studyDays : [0, 1, 2, 3, 4, 5, 6]);
  for (let t = start.getTime(); t < examDate.getTime() - DAY / 2; t += DAY) {
    const d = new Date(t);
    if (allowed.has(d.getUTCDay())) days.push(d);
  }
  return days;
}

export function disciplineWeights(input: Pick<PlannerInput, "topics" | "stats" | "difficultDisciplineIds">): Map<string, number> {
  const weights = new Map<string, number>();
  const byDisc = new Map<string, PlannerTopic[]>();
  for (const t of input.topics) {
    if (!byDisc.has(t.disciplineId)) byDisc.set(t.disciplineId, []);
    byDisc.get(t.disciplineId)!.push(t);
  }
  for (const [id, topics] of byDisc) {
    const kindWeight = topics[0].kind === "ESPECIFICA" ? 2 : 1;
    const pending = topics.filter((t) => !t.mastered).length || 0.5;
    let w = kindWeight * Math.sqrt(pending) * 2; // raiz suaviza disciplinas com muitos itens curtos
    if (input.difficultDisciplineIds.includes(id)) w *= 1.4;
    const st = input.stats.find((s) => s.disciplineId === id);
    if (st && st.answered >= 5) w *= 1 + st.errorRate;
    weights.set(id, Math.round(w * 100) / 100);
  }
  return weights;
}

/** Smooth weighted round-robin (algoritmo usado no balanceamento do Nginx). */
export function weightedSequence(weights: Map<string, number>, length: number): string[] {
  const entries = [...weights.entries()].filter(([, w]) => w > 0);
  if (!entries.length) return [];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  const current = new Map(entries.map(([k]) => [k, 0]));
  const seq: string[] = [];
  for (let i = 0; i < length; i++) {
    let best: string | null = null;
    for (const [k, w] of entries) {
      current.set(k, current.get(k)! + w);
      if (best === null || current.get(k)! > current.get(best)!) best = k;
    }
    current.set(best!, current.get(best!)! - total);
    seq.push(best!);
  }
  return seq;
}

export function generatePlan(input: PlannerInput): PlannedTask[] {
  const days = studyDaysBetween(input.startDate, input.examDate, input.studyDays);
  if (!days.length || !input.topics.length) return [];

  const M = Math.max(30, input.dailyMinutes);
  const slotSize = M <= 90 ? 45 : 60;
  const flashMin = M >= 90 ? 15 : 10;
  const weights = disciplineWeights(input);
  const discName = new Map(input.topics.map((t) => [t.disciplineId, t.disciplineName]));

  // filas de assuntos por disciplina: primeiro não estudados (ordem do edital), dominados ficam só para revisão
  const queues = new Map<string, PlannerTopic[]>();
  for (const t of [...input.topics].sort((a, b) => a.order - b.order)) {
    if (t.mastered) continue;
    if (!queues.has(t.disciplineId)) queues.set(t.disciplineId, []);
    queues.get(t.disciplineId)!.push(t);
  }
  // assuntos já estudados vão para o fim da fila (revisitados na 2ª passada)
  for (const [k, q] of queues) queues.set(k, [...q.filter((t) => !t.studied), ...q.filter((t) => t.studied)]);

  const finalWeekStart = input.examDate.getTime() - 7 * DAY;
  const tasks: PlannedTask[] = [];
  const reviewsByDay = new Map<string, { topic: PlannerTopic; stage: number }[]>();
  const keyOf = (d: Date) => d.toISOString().slice(0, 10);

  // sequência para o modo CICLO
  const totalSlots = days.length * Math.max(1, Math.floor((M - flashMin) / slotSize));
  const cycle = weightedSequence(weights, totalSlots + 50);
  let cycleIdx = 0;

  // modo FIXO: disciplinas por dia da semana
  const fixedByWeekday = new Map<number, string[]>();
  if (input.mode === "FIXO") {
    const ws = [...new Set(input.studyDays.length ? input.studyDays : [0, 1, 2, 3, 4, 5, 6])];
    const seq = weightedSequence(weights, ws.length * 3);
    ws.forEach((wd, i) => fixedByWeekday.set(wd, [seq[i * 3], seq[i * 3 + 1], seq[i * 3 + 2]].filter(Boolean)));
  }

  const errorOrder = [...weights.keys()].sort((a, b) => {
    const ea = input.stats.find((s) => s.disciplineId === a)?.errorRate ?? 0;
    const eb = input.stats.find((s) => s.disciplineId === b)?.errorRate ?? 0;
    return eb - ea || (weights.get(b)! - weights.get(a)!);
  });
  let secondPassIdx = 0;

  const nextTopicFor = (discId: string | undefined): PlannerTopic | null => {
    if (discId) {
      const q = queues.get(discId);
      if (q && q.length) return q.shift()!;
    }
    // fallback: qualquer disciplina com fila restante, na ordem de peso
    for (const id of [...weights.keys()].sort((a, b) => weights.get(b)! - weights.get(a)!)) {
      const q = queues.get(id);
      if (q && q.length) return q.shift()!;
    }
    return null;
  };

  let weekIndex = -1;
  let lastWeekKey = "";
  days.forEach((day, dayIdx) => {
    let order = 0;
    let remaining = M;
    const push = (t: Omit<PlannedTask, "date" | "order">) => {
      tasks.push({ ...t, date: day, order: order++ });
      remaining -= t.plannedMinutes;
    };
    const isFinalWeek = day.getTime() >= finalWeekStart;
    const nextDay = days[dayIdx + 1];
    const isLastStudyDayOfWeek = !nextDay || getWeekKey(nextDay) !== getWeekKey(day);
    const wk = getWeekKey(day);
    if (wk !== lastWeekKey) {
      weekIndex++;
      lastWeekKey = wk;
    }

    // 1) Flashcards diários
    push({ type: "FLASHCARDS", title: "Revisão de flashcards pendentes", plannedMinutes: flashMin, disciplineId: null, topicId: null });

    // 2) Revisões programadas (máx. 3 por dia)
    const due = (reviewsByDay.get(keyOf(day)) ?? []).slice(0, 3);
    for (const r of due) {
      if (remaining < 15) break;
      push({ type: "REVISAO", title: `Revisão ${r.stage + 1}: ${r.topic.title}`, plannedMinutes: 15, disciplineId: r.topic.disciplineId, topicId: r.topic.id });
    }
    // revisões que não couberam passam para o próximo dia de estudo
    const overflow = (reviewsByDay.get(keyOf(day)) ?? []).slice(due.length);
    if (overflow.length && nextDay) reviewsByDay.set(keyOf(nextDay), [...(reviewsByDay.get(keyOf(nextDay)) ?? []), ...overflow]);

    // 3) Simulado quinzenal e redação semanal no último dia de estudo da semana
    if (isLastStudyDayOfWeek) {
      if (weekIndex % 2 === 1 || isFinalWeek) {
        const full = M >= 180;
        push({
          type: "SIMULADO",
          title: full ? "Simulado completo (60 questões + redação, 4h30)" : "Simulado rápido (20 questões)",
          plannedMinutes: full ? Math.min(270, remaining) : Math.min(60, remaining),
          disciplineId: null,
          topicId: null,
        });
      }
      if (remaining >= 45) push({ type: "REDACAO", title: "Redação dissertativo-argumentativa (treino Vunesp)", plannedMinutes: Math.min(60, remaining), disciplineId: null, topicId: null });
    }

    // 4) Blocos de teoria + questões
    while (remaining >= Math.min(slotSize, 30)) {
      const size = Math.min(slotSize, remaining);
      if (isFinalWeek) {
        // semana de revisão: questões das disciplinas mais fracas
        const disc = errorOrder[secondPassIdx++ % errorOrder.length];
        push({ type: "QUESTOES", title: `Bateria de questões — ${discName.get(disc)}`, plannedMinutes: size, disciplineId: disc, topicId: null });
        continue;
      }
      let discId: string | undefined;
      if (input.mode === "FIXO") {
        const list = fixedByWeekday.get(day.getUTCDay()) ?? [];
        discId = list[order % Math.max(1, list.length)];
      } else {
        discId = cycle[cycleIdx++];
      }
      const topic = nextTopicFor(discId);
      if (!topic) {
        // 2ª passada: questões + revisão priorizando as disciplinas com maior taxa de erro
        const disc = errorOrder[secondPassIdx++ % errorOrder.length];
        push({ type: "QUESTOES", title: `2ª passada — questões de ${discName.get(disc)}`, plannedMinutes: size, disciplineId: disc, topicId: null });
        continue;
      }
      const theory = Math.round(size * 0.6);
      push({ type: "TEORIA", title: topic.title, plannedMinutes: theory, disciplineId: topic.disciplineId, topicId: topic.id });
      push({ type: "QUESTOES", title: `Questões: ${topic.title}`, plannedMinutes: size - theory, disciplineId: topic.disciplineId, topicId: topic.id });
      // agenda revisões futuras
      TOPIC_REVIEW_INTERVALS.forEach((interval, stage) => {
        const target = nearestStudyDay(days, day.getTime() + interval * DAY);
        if (target) {
          const k = keyOf(target);
          reviewsByDay.set(k, [...(reviewsByDay.get(k) ?? []), { topic, stage }]);
        }
      });
    }
  });

  return tasks;
}

function nearestStudyDay(days: Date[], t: number): Date | null {
  for (const d of days) if (d.getTime() >= t - DAY / 2) return d;
  return null;
}

function getWeekKey(d: Date): string {
  const day = d.getUTCDay();
  const monday = new Date(d.getTime() - ((day + 6) % 7) * DAY);
  return monday.toISOString().slice(0, 10);
}

/**
 * Replanejamento: tarefas pendentes atrasadas são movidas para os próximos dias de estudo
 * que ainda tenham folga (até 125% da carga diária).
 */
export function rescheduleOverdue(
  overdue: { id: string; plannedMinutes: number }[],
  upcomingLoad: Map<string, number>,
  futureDays: Date[],
  dailyMinutes: number,
): { id: string; date: Date }[] {
  const cap = Math.round(dailyMinutes * 1.25);
  const moves: { id: string; date: Date }[] = [];
  let di = 0;
  for (const t of overdue) {
    while (di < futureDays.length) {
      const k = futureDays[di].toISOString().slice(0, 10);
      const load = upcomingLoad.get(k) ?? 0;
      if (load + t.plannedMinutes <= cap) {
        upcomingLoad.set(k, load + t.plannedMinutes);
        moves.push({ id: t.id, date: futureDays[di] });
        break;
      }
      di++;
    }
  }
  return moves;
}
