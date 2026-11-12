import { describe, expect, it } from "vitest";
import { sm2 } from "../src/lib/sm2";
import { scoreObjective } from "../src/lib/scoring";
import { generatePlan, rescheduleOverdue, studyDaysBetween, weightedSequence, disciplineWeights, type PlannerTopic } from "../src/lib/planner";
import { analyzeEssay, countWords, estimateLines } from "../src/lib/essay";
import { questionSchema } from "../src/lib/validation";
import { mergedMinutes, topicPercent, masteryLevel } from "../src/lib/data-pure";
import { seededRandom, shuffle } from "../src/lib/utils";
import { EDITAL_DISCIPLINES, EXAM_RULES } from "../content/edital";
import { QUESTIONS_GERAIS } from "../content/questions/gerais";
import { QUESTIONS_DEV } from "../content/questions/dev";
import { QUESTIONS_SUP } from "../content/questions/sup";

describe("SM-2", () => {
  const s0 = { easeFactor: 2.5, intervalDays: 0, repetitions: 0, lapses: 0 };
  it("intervalos 1, 6 e depois × EF para acertos", () => {
    const a = sm2(s0, 4);
    expect(a.intervalDays).toBe(1);
    const b = sm2(a, 4);
    expect(b.intervalDays).toBe(6);
    const c = sm2(b, 4);
    expect(c.intervalDays).toBe(Math.round(6 * b.easeFactor));
  });
  it("erro zera repetições, volta em 1 dia e conta lapso", () => {
    const r = sm2({ easeFactor: 2.5, intervalDays: 20, repetitions: 4, lapses: 0 }, 1);
    expect(r).toMatchObject({ intervalDays: 1, repetitions: 0, lapses: 1 });
  });
  it("fator de facilidade nunca fica abaixo de 1,3", () => {
    let s = s0;
    for (let i = 0; i < 20; i++) s = sm2(s, 0);
    expect(s.easeFactor).toBe(1.3);
  });
  it("respeita o limite de intervalo (data da prova)", () => {
    expect(sm2({ easeFactor: 2.5, intervalDays: 100, repetitions: 5, lapses: 0 }, 5, 30).intervalDays).toBe(30);
  });
});

describe("Pontuação conforme o edital (Cap. 10)", () => {
  it("média ponderada com pesos 1 (gerais) e 2 (específicos)", () => {
    const r = scoreObjective(12, 24, 18, 36);
    expect(r.scoreGerais).toBe(5);
    expect(r.scoreEspec).toBe(5);
    expect(r.objectiveScore).toBe(5);
    expect(r.officialStructure).toBe(true);
  });
  it("ampla concorrência exige 12, 18 e média ≥ 6", () => {
    expect(scoreObjective(12, 24, 18, 36).habilitadoAmpla).toBe(false); // média 5
    expect(scoreObjective(12, 24, 24, 36).habilitadoAmpla).toBe(true); // (5 + 2×6,67)/3 = 6,11
    expect(scoreObjective(11, 24, 36, 36).habilitadoAmpla).toBe(false); // menos de 12 em gerais
  });
  it("cotas/PcD: 10, 15 e média ≥ 4,80", () => {
    const r = scoreObjective(10, 24, 15, 36);
    // gerais 4,17; específicos 4,17 → média 4,17 < 4,80
    expect(r.habilitadoCotas).toBe(false);
    expect(scoreObjective(10, 24, 20, 36).habilitadoCotas).toBe(true);
  });
  it("estrutura do edital: 24 + 36 questões, 5 alternativas, 4h30", () => {
    expect(EXAM_RULES.geraisQuestions + EXAM_RULES.especificosQuestions).toBe(60);
    expect(EXAM_RULES.alternatives).toBe(5);
    expect(EXAM_RULES.durationMinutes).toBe(270);
    expect(EXAM_RULES.pesoRedacao).toBe(1); // retificação 02/2026
  });
});

describe("Planejador", () => {
  const start = new Date("2026-11-16T12:00:00Z"); // segunda
  const exam = new Date("2027-01-31T12:00:00Z");
  const topics: PlannerTopic[] = [
    ...Array.from({ length: 6 }, (_, i) => ({ id: `g${i}`, title: `Geral ${i}`, disciplineId: "G", disciplineName: "Gerais", kind: "GERAL" as const, order: i, mastered: false, studied: false })),
    ...Array.from({ length: 6 }, (_, i) => ({ id: `e${i}`, title: `Esp ${i}`, disciplineId: "E", disciplineName: "Específicos", kind: "ESPECIFICA" as const, order: 10 + i, mastered: i === 0, studied: false })),
  ];
  const plan = generatePlan({ startDate: start, examDate: exam, dailyMinutes: 120, studyDays: [1, 2, 3, 4, 5], mode: "CICLO", difficultDisciplineIds: [], topics, stats: [] });

  it("só agenda nos dias escolhidos e antes da prova", () => {
    expect(plan.length).toBeGreaterThan(0);
    for (const t of plan) {
      expect([1, 2, 3, 4, 5]).toContain(t.date.getUTCDay());
      expect(t.date.getTime()).toBeLessThan(exam.getTime());
    }
  });
  it("não excede a carga diária", () => {
    const byDay = new Map<string, number>();
    for (const t of plan) byDay.set(t.date.toISOString(), (byDay.get(t.date.toISOString()) ?? 0) + t.plannedMinutes);
    for (const v of byDay.values()) expect(v).toBeLessThanOrEqual(120);
  });
  it("assunto dominado não recebe teoria; todos os demais recebem", () => {
    const theory = new Set(plan.filter((t) => t.type === "TEORIA").map((t) => t.topicId));
    expect(theory.has("e0")).toBe(false);
    for (const id of ["g0", "g5", "e1", "e5"]) expect(theory.has(id)).toBe(true);
  });
  it("agenda revisões espaçadas, redação e simulados", () => {
    expect(plan.some((t) => t.type === "REVISAO")).toBe(true);
    expect(plan.some((t) => t.type === "REDACAO")).toBe(true);
    expect(plan.some((t) => t.type === "SIMULADO")).toBe(true);
  });
  it("específicos (peso 2) pesam mais que gerais", () => {
    const w = disciplineWeights({ topics: topics.map((t) => ({ ...t, mastered: false })), stats: [], difficultDisciplineIds: [] });
    expect(w.get("E")!).toBeGreaterThan(w.get("G")!);
  });
  it("taxa de erro aumenta o peso da disciplina (plano adaptativo)", () => {
    const base = disciplineWeights({ topics, stats: [], difficultDisciplineIds: [] }).get("G")!;
    const withErr = disciplineWeights({ topics, stats: [{ disciplineId: "G", answered: 20, errorRate: 0.5 }], difficultDisciplineIds: [] }).get("G")!;
    expect(withErr).toBeCloseTo(base * 1.5, 1);
  });
  it("semana final é de revisão (sem teoria nova)", () => {
    const finalWeek = plan.filter((t) => t.date.getTime() >= exam.getTime() - 7 * 86400000);
    expect(finalWeek.length).toBeGreaterThan(0);
    expect(finalWeek.some((t) => t.type === "TEORIA")).toBe(false);
  });
  it("round-robin ponderado respeita proporções", () => {
    const seq = weightedSequence(new Map([["a", 2], ["b", 1]]), 30);
    expect(seq.filter((x) => x === "a").length).toBe(20);
  });
  it("replanejamento move atrasadas para dias com folga", () => {
    const days = studyDaysBetween(start, new Date("2026-11-21T12:00:00Z"), [1, 2, 3, 4, 5]);
    const load = new Map([[days[0].toISOString().slice(0, 10), 150]]);
    const moves = rescheduleOverdue([{ id: "x", plannedMinutes: 30 }], load, days, 120);
    expect(moves[0].date.toISOString().slice(0, 10)).toBe(days[1].toISOString().slice(0, 10));
  });
});

describe("Análise de redação (local)", () => {
  it("conta palavras e estima linhas", () => {
    expect(countWords("Um dois três.")).toBe(3);
    expect(estimateLines("a ".repeat(22))).toBe(2);
  });
  it("aponta nota zero por extensão e marcas de pessoa/proposta", () => {
    const a = analyzeEssay("", "Eu acho isso, como afirma o texto I.\n\nVocê concorda.");
    expect(a.alerts.some((x) => x.level === "erro" && x.message.includes("7 linhas"))).toBe(true);
    expect(a.firstPersonSingular).toContain("eu");
    expect(a.secondPerson).toContain("você");
    expect(a.proposalReferences).toContain("texto i");
  });
  it("detecção insensível a acentos", () => {
    expect(analyzeEssay("", "voce precisa ver").secondPerson).toContain("você");
  });
});

describe("Validação de questões", () => {
  const base = {
    code: "T-1",
    topic: "dev-sql",
    difficulty: 1,
    statement: "Enunciado suficientemente longo para validar.",
    alternatives: ["A", "B", "C", "D", "E"].map((t, i) => ({ text: t, correct: i === 0, why: "justificativa" })),
    explanation: "Explicação fundamentada da resposta.",
    reference: "Fonte verificável",
  };
  it("aceita questão válida", () => expect(questionSchema.safeParse(base).success).toBe(true));
  it("rejeita duas corretas, alternativas repetidas e quantidade ≠ 5", () => {
    expect(questionSchema.safeParse({ ...base, alternatives: base.alternatives.map((a) => ({ ...a, correct: true })) }).success).toBe(false);
    expect(questionSchema.safeParse({ ...base, alternatives: base.alternatives.map((a) => ({ ...a, text: "igual" })) }).success).toBe(false);
    expect(questionSchema.safeParse({ ...base, alternatives: base.alternatives.slice(0, 4) }).success).toBe(false);
  });
  it("todas as questões do acervo são válidas e têm código único", () => {
    const all = [...QUESTIONS_GERAIS, ...QUESTIONS_DEV, ...QUESTIONS_SUP];
    for (const q of all) expect(questionSchema.safeParse(q).success, q.code).toBe(true);
    expect(new Set(all.map((q) => q.code)).size).toBe(all.length);
    // banco suficiente para um simulado completo nas duas especialidades
    expect(QUESTIONS_GERAIS.length).toBeGreaterThanOrEqual(24);
    expect(QUESTIONS_DEV.length).toBeGreaterThanOrEqual(36);
    expect(QUESTIONS_SUP.length).toBeGreaterThanOrEqual(36);
  });
});

describe("Estrutura do edital", () => {
  it("5 disciplinas gerais compartilhadas e 7 específicas por especialidade", () => {
    expect(EDITAL_DISCIPLINES.filter((d) => d.specialty === null).length).toBe(5);
    expect(EDITAL_DISCIPLINES.filter((d) => d.specialty === "DEV").length).toBe(7);
    expect(EDITAL_DISCIPLINES.filter((d) => d.specialty === "SUP").length).toBe(7);
  });
  it("slugs de assunto únicos", () => {
    const slugs = EDITAL_DISCIPLINES.flatMap((d) => d.modules.flatMap((m) => m.topics.map((t) => t.slug)));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("Utilidades", () => {
  it("mescla intervalos sobrepostos ao somar tempo", () => {
    const t = (h: number, m: number) => new Date(Date.UTC(2026, 10, 11, h, m));
    expect(mergedMinutes([{ start: t(10, 0), end: t(11, 0) }, { start: t(10, 30), end: t(11, 30) }, { start: t(12, 0), end: t(12, 15) }])).toBe(105);
  });
  it("percentual do assunto e nível de domínio", () => {
    expect(topicPercent("EM_ESTUDO", 0, 0)).toBe(40);
    expect(topicPercent("EM_ESTUDO", 3, 4)).toBe(75);
    expect(masteryLevel(4, 4).label).toBe("Dados insuficientes");
    expect(masteryLevel(10, 9).label).toBe("Alto");
  });
  it("sorteio com semente é reprodutível", () => {
    expect(shuffle([1, 2, 3, 4, 5, 6], seededRandom(42))).toEqual(shuffle([1, 2, 3, 4, 5, 6], seededRandom(42)));
  });
});
