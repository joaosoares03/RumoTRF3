import { EXAM_RULES } from "../../content/edital";

/**
 * Cálculo de nota conforme o Edital nº 01/2026, Capítulo 10:
 *  - cada prova objetiva (Gerais e Específicos) é avaliada de 0 a 10;
 *  - nota objetiva = média aritmética ponderada (peso 1 Gerais, peso 2 Específicos);
 *  - habilitação (ampla concorrência): ≥ 12 acertos em Gerais, ≥ 18 em Específicos e média ≥ 6,00.
 *  - habilitação (negros, pardos, indígenas, quilombolas e PcD): ≥ 10, ≥ 15 e média ≥ 4,80.
 * A redação (0–10) é eliminatória (≥ 5,00 / ≥ 4,00) e somada à nota objetiva na classificação (13.2).
 * Não existe "nota de corte" oficial antes do resultado — a plataforma só aplica os mínimos do edital.
 */
export type ObjectiveResult = {
  correctGerais: number;
  totalGerais: number;
  correctEspec: number;
  totalEspec: number;
  scoreGerais: number; // 0..10
  scoreEspec: number; // 0..10
  objectiveScore: number; // média ponderada 0..10
  habilitadoAmpla: boolean;
  habilitadoCotas: boolean;
  /** true quando o simulado tem exatamente a estrutura oficial (24 + 36) e os mínimos podem ser aplicados literalmente */
  officialStructure: boolean;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function scoreObjective(correctGerais: number, totalGerais: number, correctEspec: number, totalEspec: number): ObjectiveResult {
  const scoreGerais = totalGerais ? round2((correctGerais / totalGerais) * 10) : 0;
  const scoreEspec = totalEspec ? round2((correctEspec / totalEspec) * 10) : 0;
  const pesoG = totalGerais ? EXAM_RULES.pesoGerais : 0;
  const pesoE = totalEspec ? EXAM_RULES.pesoEspecificos : 0;
  const objectiveScore = pesoG + pesoE ? round2((scoreGerais * pesoG + scoreEspec * pesoE) / (pesoG + pesoE)) : 0;

  const officialStructure = totalGerais === EXAM_RULES.geraisQuestions && totalEspec === EXAM_RULES.especificosQuestions;
  const a = EXAM_RULES.habilitacao.amplaConcorrencia;
  const c = EXAM_RULES.habilitacao.cotasPcd;
  // Para simulados com outra quantidade de questões, aplica-se a proporção equivalente (50% / 40%), arredondando para cima.
  const minG = (p: number, abs: number) => (officialStructure ? abs : Math.ceil(totalGerais * p));
  const minE = (p: number, abs: number) => (officialStructure ? abs : Math.ceil(totalEspec * p));

  const habilitadoAmpla =
    correctGerais >= minG(0.5, a.minAcertosGerais) && correctEspec >= minE(0.5, a.minAcertosEspecificos) && objectiveScore >= a.minMediaPonderada;
  const habilitadoCotas =
    correctGerais >= minG(0.4, c.minAcertosGerais) && correctEspec >= minE(0.4, c.minAcertosEspecificos) && objectiveScore >= c.minMediaPonderada;

  return { correctGerais, totalGerais, correctEspec, totalEspec, scoreGerais, scoreEspec, objectiveScore, habilitadoAmpla, habilitadoCotas, officialStructure };
}
