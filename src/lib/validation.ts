import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(160),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(128)
    .regex(/[A-Za-z]/, "A senha deve conter letras")
    .regex(/[0-9]/, "A senha deve conter números"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha").max(128),
});

export const onboardingSchema = z.object({
  specialtyMode: z.enum(["DEV", "SUP", "AMBAS"]),
  dailyMinutes: z.coerce.number().int().min(30).max(720),
  studyDays: z.array(z.coerce.number().int().min(0).max(6)).min(1, "Escolha ao menos um dia"),
  level: z.enum(["INICIANTE", "INTERMEDIARIO", "AVANCADO"]),
  difficultDisciplines: z.array(z.string()).default([]),
  masteredTopics: z.array(z.string()).default([]),
  objective: z.string().max(300).default(""),
  planMode: z.enum(["CICLO", "FIXO"]),
  worksFullTime: z.boolean().default(false),
});

/** Validação de questões (usada no seed, na importação em lote e no painel administrativo). */
export const questionSchema = z
  .object({
    code: z.string().min(3),
    topic: z.string().min(2), // slug do assunto
    difficulty: z.number().int().min(1).max(3),
    statement: z.string().min(20, "Enunciado muito curto"),
    alternatives: z
      .array(z.object({ text: z.string().min(1), correct: z.boolean().default(false), why: z.string().min(5, "Explique a alternativa") }))
      .length(5, "A questão deve ter exatamente 5 alternativas"),
    explanation: z.string().min(20, "Gabarito fundamentado é obrigatório"),
    reference: z.string().min(5, "Informe uma referência verificável"),
    origin: z.enum(["AUTORAL", "OFICIAL"]).default("AUTORAL"),
    board: z.string().optional(),
    year: z.number().int().optional(),
  })
  .superRefine((q, ctx) => {
    const correct = q.alternatives.filter((a) => a.correct).length;
    if (correct !== 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Deve haver exatamente 1 alternativa correta (encontradas: ${correct})` });
    const texts = q.alternatives.map((a) => a.text.trim().toLowerCase());
    if (new Set(texts).size !== texts.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "As alternativas devem ser distintas" });
    if (q.origin === "OFICIAL" && (!q.board || !q.year)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Questão oficial exige banca e ano" });
  });

export type QuestionInput = z.input<typeof questionSchema>;

export const resourceSchema = z.object({
  title: z.string().trim().min(3).max(300),
  url: z
    .string()
    .trim()
    .url("URL inválida")
    .refine((u) => /^https:\/\//.test(u), "Use apenas URLs https"),
  type: z.enum(["VIDEO", "DOCUMENTACAO", "LEGISLACAO", "ARTIGO", "PDF", "CURSO", "NORMATIVO", "FERRAMENTA"]),
  provider: z.string().trim().min(2).max(120),
  language: z.string().default("pt-BR"),
  category: z.enum(["OFICIAL", "COMPLEMENTAR"]).default("COMPLEMENTAR"),
  description: z.string().max(1000).default(""),
  license: z.string().max(300).optional(),
  topics: z.array(z.string()).min(1, "Associe ao menos um assunto"),
});

export type ResourceInput = z.input<typeof resourceSchema>;
