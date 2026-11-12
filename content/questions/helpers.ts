import type { QuestionInput } from "../../src/lib/validation";

/**
 * Atalho para escrever questões autorais de forma compacta.
 * alts: [texto, justificativa][] (exatamente 5); correct: índice 0..4 da alternativa correta.
 * Todas as questões deste diretório são AUTORAIS, de treinamento, inspiradas no estilo da banca —
 * NÃO são questões oficiais da Vunesp.
 */
export function q(
  code: string,
  topic: string,
  difficulty: 1 | 2 | 3,
  statement: string,
  alts: [string, string][],
  correct: number,
  explanation: string,
  reference: string,
): QuestionInput {
  return {
    code,
    topic,
    difficulty,
    statement,
    alternatives: alts.map(([text, why], i) => ({ text, why, correct: i === correct })),
    explanation,
    reference,
    origin: "AUTORAL",
    board: "Treinamento (estilo Vunesp) — questão autoral",
  };
}
