/** Funções puras (sem banco) usadas pelas estatísticas — testáveis isoladamente. */

export const STATUS_PCT: Record<string, number> = { NAO_INICIADO: 0, EM_ESTUDO: 40, REVISANDO: 75, DOMINADO: 100 };

/**
 * Percentual estudado de um assunto (regra transparente, exibida na interface):
 *  - base pelo status: Não iniciado 0% · Em estudo 40% · Revisando 75% · Dominado 100%;
 *  - se o assunto tem subassuntos, usa-se o maior valor entre a base e a fração de subassuntos marcados.
 */
export function topicPercent(status: string | undefined, checked: number, totalSub: number) {
  const base = STATUS_PCT[status ?? "NAO_INICIADO"] ?? 0;
  const subs = totalSub ? (checked / totalSub) * 100 : 0;
  return Math.round(Math.max(base, subs));
}

/** Nível de domínio a partir das respostas reais (mínimo de 5 respostas). */
export function masteryLevel(answered: number, correct: number): { label: string; tone: "neutral" | "danger" | "amber" | "success" } {
  if (answered < 5) return { label: "Dados insuficientes", tone: "neutral" };
  const r = correct / answered;
  if (r >= 0.85) return { label: "Alto", tone: "success" };
  if (r >= 0.65) return { label: "Médio", tone: "amber" };
  return { label: "Baixo", tone: "danger" };
}

/** Soma do tempo estudado em minutos, mesclando intervalos sobrepostos (evita contar duas vezes). */
export function mergedMinutes(intervals: { start: Date; end: Date }[]): number {
  const sorted = intervals.filter((i) => i.end > i.start).sort((a, b) => a.start.getTime() - b.start.getTime());
  let total = 0;
  let cs = 0;
  let ce = 0;
  for (const i of sorted) {
    const s = i.start.getTime();
    const e = i.end.getTime();
    if (s > ce) {
      total += ce - cs;
      cs = s;
      ce = e;
    } else if (e > ce) ce = e;
  }
  total += ce - cs;
  return Math.round(total / 60000);
}

