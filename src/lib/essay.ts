/**
 * Análise automática LOCAL (heurística) de redações — gratuita e sem IA.
 * Gera indicadores orientativos ligados aos critérios do item 9.52 do edital (A: tema, B: estrutura,
 * C: língua, D: coesão). NÃO atribui nota: a correção oficial é feita por examinadores da Vunesp.
 */
export const WORDS_PER_LINE = 11; // média aproximada de palavras por linha manuscrita na folha de resposta

export const CONNECTIVES: Record<string, string[]> = {
  "Adição": ["além disso", "ademais", "outrossim", "também", "não só", "bem como", "inclusive"],
  "Oposição / concessão": ["entretanto", "contudo", "todavia", "no entanto", "porém", "embora", "ainda que", "apesar de", "mesmo que", "não obstante"],
  "Causa / explicação": ["porque", "visto que", "uma vez que", "já que", "pois", "dado que", "haja vista"],
  "Consequência / conclusão": ["portanto", "logo", "por conseguinte", "assim", "dessa forma", "desse modo", "consequentemente", "em suma", "diante disso", "por isso"],
  "Exemplificação / esclarecimento": ["por exemplo", "isto é", "ou seja", "a saber", "como exemplo", "a exemplo de"],
  "Condição": ["caso", "desde que", "contanto que", "se"],
  "Finalidade": ["a fim de", "para que", "com o intuito de", "com o objetivo de"],
  "Comparação": ["assim como", "da mesma forma", "do mesmo modo", "tal como", "analogamente"],
  "Sequência / tempo": ["em primeiro lugar", "em seguida", "por fim", "primeiramente", "posteriormente", "finalmente"],
};

const STOPWORDS = new Set(
  "a o e de da do das dos em no na nos nas um uma uns umas que se por para com como mais mas não ao à às aos os as é são ser ter há foi era seu sua seus suas isso este esta esse essa ele ela eles elas também já ou nem pelo pela pelos pelas sobre entre quando muito muitos muitas pois sem até onde lhe lhes".split(" "),
);

export type EssayAnalysis = {
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  avgSentenceWords: number;
  connectivesFound: { category: string; term: string; count: number }[];
  connectiveCategories: number;
  repeatedWords: { word: string; count: number }[];
  firstPersonSingular: string[];
  secondPerson: string[];
  proposalReferences: string[];
  longSentences: number;
  shortParagraphs: number;
  alerts: { criterion: "A" | "B" | "C" | "D" | "GERAL"; level: "erro" | "atencao" | "ok"; message: string }[];
};

function countMatches(text: string, term: string): number {
  const re = new RegExp(`(^|[^\\p{L}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^\\p{L}])`, "giu");
  return (text.match(re) || []).length;
}

export function countWords(text: string): number {
  return (text.trim().match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) || []).length;
}

export function estimateLines(text: string): number {
  return text
    .split(/\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .reduce((sum, p) => sum + Math.max(1, Math.ceil(countWords(p) / WORDS_PER_LINE)), 0);
}

export function analyzeEssay(rawTitle: string, rawText: string): EssayAnalysis {
  const text = rawText.replace(/\r/g, "");
  const lower = text.toLowerCase();
  // comparação insensível a acentos (ex.: "voce" e "você")
  const strip = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const plain = strip(lower);
  const paragraphsArr = text.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  const sentencesArr = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => countWords(s) > 0);
  const words = countWords(text);
  const lines = estimateLines(text);

  const connectivesFound: EssayAnalysis["connectivesFound"] = [];
  for (const [category, terms] of Object.entries(CONNECTIVES)) {
    for (const term of terms) {
      if (term === "se" || term === "caso") continue; // ambíguos demais para contagem automática
      const c = countMatches(plain, strip(term));
      if (c) connectivesFound.push({ category, term, count: c });
    }
  }
  const connectiveCategories = new Set(connectivesFound.map((c) => c.category)).size;

  const freq = new Map<string, number>();
  for (const w of lower.match(/\p{L}{4,}/gu) || []) {
    if (STOPWORDS.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const repeatedWords = [...freq.entries()]
    .filter(([, c]) => c >= Math.max(4, Math.round(words / 60)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  const fps = ["eu", "meu", "minha", "meus", "minhas", "comigo", "acredito que eu", "na minha opinião"].filter((t) => countMatches(plain, strip(t)) > 0);
  const sps = ["você", "vocês", "tu", "teu", "tua", "vós"].filter((t) => countMatches(plain, strip(t)) > 0);
  const refs = ["texto i", "texto ii", "texto iii", "coletânea", "textos de apoio", "texto de apoio", "proposta de redação", "como afirma o autor", "nesta prova", "nesta redação"].filter(
    (t) => countMatches(plain, strip(t)) > 0,
  );

  const longSentences = sentencesArr.filter((s) => countWords(s) > 45).length;
  const shortParagraphs = paragraphsArr.filter((p) => p.split(/(?<=[.!?])\s+/).filter((s) => countWords(s) > 0).length <= 1).length;

  const alerts: EssayAnalysis["alerts"] = [];
  if (!words) alerts.push({ criterion: "GERAL", level: "erro", message: "Redação em branco recebe nota zero (item 9.53, c)." });
  if (lines > 0 && lines <= 7) alerts.push({ criterion: "GERAL", level: "erro", message: `Estimativa de ${lines} linhas: textos com 7 linhas ou menos recebem nota zero (item 9.53, h).` });
  else if (lines <= 15 && words) alerts.push({ criterion: "C", level: "atencao", message: `Estimativa de ${lines} linhas: com 15 linhas ou menos o texto perde 1 ponto nos critérios C e D (item 9.54.4).` });
  else if (lines <= 20 && words) alerts.push({ criterion: "D", level: "atencao", message: `Estimativa de ${lines} linhas: com 20 linhas ou menos não é possível obter nota máxima em C e D (item 9.54.4).` });
  else if (words) alerts.push({ criterion: "GERAL", level: "ok", message: `Extensão estimada adequada (${lines} linhas).` });

  if (words && paragraphsArr.length < 3) alerts.push({ criterion: "B", level: "erro", message: "Menos de 3 parágrafos: a macroestrutura (introdução, desenvolvimento e conclusão) pode ficar incompleta; monobloco é penalizado em D." });
  else if (words && paragraphsArr.length >= 4) alerts.push({ criterion: "B", level: "ok", message: `${paragraphsArr.length} parágrafos — estrutura compatível com introdução, desenvolvimento e conclusão.` });

  if (fps.length) alerts.push({ criterion: "B", level: "atencao", message: `Marcas de 1ª pessoa do singular (${fps.join(", ")}) podem ser penalizadas — prefira a impessoalidade.` });
  if (sps.length) alerts.push({ criterion: "B", level: "atencao", message: `Marcas de 2ª pessoa (${sps.join(", ")}) podem ser penalizadas.` });
  if (refs.length) alerts.push({ criterion: "B", level: "atencao", message: `Referência direta à proposta/coletânea (${refs.join(", ")}) compromete a autonomia do texto.` });
  if (rawTitle.trim()) alerts.push({ criterion: "A", level: "atencao", message: "O título não é considerado na avaliação do tema (item 9.54.3) — o tema precisa aparecer no corpo do texto." });

  if (words && connectiveCategories < 3) alerts.push({ criterion: "D", level: "atencao", message: "Pouca variedade de conectivos: use relações de oposição, causa e conclusão para encadear ideias." });
  else if (words) alerts.push({ criterion: "D", level: "ok", message: `Conectivos de ${connectiveCategories} categorias diferentes.` });
  if (repeatedWords.length) alerts.push({ criterion: "D", level: "atencao", message: `Repetições frequentes: ${repeatedWords.map((r) => `"${r.word}" (${r.count}×)`).join(", ")}. Considere sinônimos ou retomadas pronominais.` });
  if (longSentences) alerts.push({ criterion: "C", level: "atencao", message: `${longSentences} período(s) com mais de 45 palavras — verifique pontuação e clareza.` });
  if (shortParagraphs >= 2) alerts.push({ criterion: "D", level: "atencao", message: `${shortParagraphs} parágrafos com um único período — o edital considera negativa a predominância de parágrafos muito curtos.` });

  return {
    words,
    lines,
    paragraphs: paragraphsArr.length,
    sentences: sentencesArr.length,
    avgSentenceWords: sentencesArr.length ? Math.round(words / sentencesArr.length) : 0,
    connectivesFound,
    connectiveCategories,
    repeatedWords,
    firstPersonSingular: fps,
    secondPerson: sps,
    proposalReferences: refs,
    longSentences,
    shortParagraphs,
    alerts,
  };
}
