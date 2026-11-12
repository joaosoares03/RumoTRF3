/**
 * Repetição espaçada — algoritmo SM-2 (Piotr Woźniak, SuperMemo 2, 1987), com pequenas adaptações.
 *
 * Entrada: nota de 0 a 5 dada pelo estudante após tentar lembrar a resposta.
 *   0 = "não lembrei nada", 3 = "lembrei com dificuldade", 4 = "lembrei", 5 = "fácil".
 * Na interface usamos 4 botões: Errei (1), Difícil (3), Bom (4), Fácil (5).
 *
 * Regras:
 *  - Se nota < 3: repetições = 0, intervalo = 1 dia (o cartão volta amanhã) e conta um lapso.
 *  - Se nota >= 3: repetições += 1; intervalo = 1 (1ª), 6 (2ª) ou round(intervalo anterior × EF).
 *  - EF' = EF + (0,1 − (5 − q) × (0,08 + (5 − q) × 0,02)), com mínimo de 1,3.
 * Adaptação: o intervalo nunca ultrapassa a data da prova + 0 dias (não faz sentido agendar
 * revisão depois da prova) — essa limitação é aplicada por quem chama (maxIntervalDays).
 */
export type Sm2State = { easeFactor: number; intervalDays: number; repetitions: number; lapses: number };

export function sm2(state: Sm2State, grade: number, maxIntervalDays = 3650): Sm2State {
  const q = Math.max(0, Math.min(5, Math.round(grade)));
  let { easeFactor, intervalDays, repetitions, lapses } = state;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  easeFactor = Math.round(easeFactor * 100) / 100;

  intervalDays = Math.max(1, Math.min(intervalDays, Math.max(1, maxIntervalDays)));
  return { easeFactor, intervalDays, repetitions, lapses };
}

export const GRADE_BUTTONS = [
  { grade: 1, label: "Errei", hint: "volta amanhã" },
  { grade: 3, label: "Difícil", hint: "lembrei com esforço" },
  { grade: 4, label: "Bom", hint: "lembrei" },
  { grade: 5, label: "Fácil", hint: "sem esforço" },
] as const;

/** Revisões de tópicos (teoria) seguem intervalos fixos crescentes: 1, 7, 15, 30 dias. */
export const TOPIC_REVIEW_INTERVALS = [1, 7, 15, 30];
