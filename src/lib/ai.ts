import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { EXAM_RULES } from "../../content/edital";

/**
 * Análise ORIENTATIVA de redação por IA (opcional).
 * - Só é usada se ANTHROPIC_API_KEY estiver configurada; caso contrário a plataforma usa apenas a análise local gratuita.
 * - O resultado é sempre identificado como estimativa NÃO OFICIAL — a nota real é atribuída pela banca.
 * - Fallback de recusa do lado do servidor habilitado (fallbacks: "default").
 */
export function aiEnabled() {
  return !!process.env.ANTHROPIC_API_KEY;
}

const SYSTEM = `Você é um corretor experiente de redações de concursos públicos no Brasil, especializado nos critérios da Fundação Vunesp.
Avalie o texto do candidato SOMENTE com base nos critérios oficiais do edital do concurso TRF3 2026 (item 9.52):
${EXAM_RULES.redacao.criterios.map((c) => `- Critério ${c.key} — ${c.nome}: ${c.descricao}`).join("\n")}
Regras de nota zero (item 9.53): ${EXAM_RULES.redacao.notaZero.join("; ")}.
Observações do edital: ${EXAM_RULES.redacao.observacoes.join(" ")}

Responda em português do Brasil, em Markdown, com as seções:
## Visão geral (2–3 frases)
## Critério A — Tema
## Critério B — Estrutura e coerência
## Critério C — Língua
## Critério D — Coesão
## Pontos a melhorar (lista priorizada, com trechos citados do texto e sugestão de reescrita)
## Estimativa não oficial (faixa de nota de 0 a 10 e justificativa curta)
Seja específico e honesto. Não invente regras que não estejam acima. Deixe claro que a estimativa é orientativa e não substitui a correção da banca.`;

export async function analyzeEssayWithAI(input: { theme: string; title: string; text: string }): Promise<string> {
  if (!aiEnabled()) throw new Error("Integração de IA não configurada (ANTHROPIC_API_KEY ausente).");
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
  try {
    const response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Tema proposto: ${input.theme || "(redação livre)"}\nTítulo (não avaliado): ${input.title || "(sem título)"}\n\nTexto do candidato:\n"""\n${input.text}\n"""`,
        },
      ],
    });
    if (response.stop_reason === "refusal") return "A análise por IA não pôde ser gerada para este texto. Use a análise local e a autoavaliação.";
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (response.stop_reason === "max_tokens") return `${text}\n\n_(Resposta interrompida por limite de tamanho.)_`;
    return text || "A IA não retornou conteúdo.";
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) throw new Error("Chave de API inválida. Verifique ANTHROPIC_API_KEY no arquivo .env.");
    if (error instanceof Anthropic.RateLimitError) throw new Error("Limite de uso da API atingido. Tente novamente em alguns minutos.");
    if (error instanceof Anthropic.BadRequestError) throw new Error(`Requisição recusada pela API: ${error.message}`);
    if (error instanceof Anthropic.APIConnectionError) throw new Error("Sem conexão com a API. Verifique sua internet.");
    if (error instanceof Anthropic.APIError) throw new Error(`Erro da API (${error.status}).`);
    throw error;
  }
}
