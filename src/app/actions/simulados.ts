"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, scopeOf } from "@/lib/data";
import { scoreObjective } from "@/lib/scoring";
import { analyzeEssay, countWords, estimateLines } from "@/lib/essay";
import { shuffle } from "@/lib/utils";
import { EXAM_RULES } from "../../../content/edital";

/** Sorteio equilibrado entre disciplinas (o edital não define quantas questões por disciplina). */
function balancedPick(byDiscipline: Map<string, string[]>, n: number): string[] {
  const pools = [...byDiscipline.values()].map((ids) => shuffle(ids)).filter((p) => p.length);
  const out: string[] = [];
  let i = 0;
  while (out.length < n && pools.some((p) => p.length)) {
    const pool = pools[i % pools.length];
    if (pool.length) out.push(pool.pop()!);
    i++;
  }
  return out;
}

async function pool(where: object) {
  const qs = await db.question.findMany({ where: { status: "PUBLICADO", ...where }, select: { id: true, topic: { select: { module: { select: { disciplineId: true } } } } } });
  const m = new Map<string, string[]>();
  for (const q of qs) {
    const d = q.topic.module.disciplineId;
    if (!m.has(d)) m.set(d, []);
    m.get(d)!.push(q.id);
  }
  return m;
}

const createSchema = z.object({
  type: z.enum(["COMPLETO", "RAPIDO", "DISCIPLINA", "ASSUNTO", "PERSONALIZADO"]),
  disciplineId: z.string().optional(),
  topicId: z.string().optional(),
  qtd: z.coerce.number().int().min(5).max(60).optional(),
  gerais: z.coerce.number().int().min(0).max(24).optional(),
  especificos: z.coerce.number().int().min(0).max(36).optional(),
  minutos: z.coerce.number().int().min(5).max(270).optional(),
  redacao: z.boolean().optional(),
});

export async function createSimulado(formData: FormData) {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const spec = await db.specialty.findUniqueOrThrow({ where: { key: active } });
  const p = createSchema.parse({
    type: formData.get("type"),
    disciplineId: formData.get("disciplineId") || undefined,
    topicId: formData.get("topicId") || undefined,
    qtd: formData.get("qtd") || undefined,
    gerais: formData.get("gerais") || undefined,
    especificos: formData.get("especificos") || undefined,
    minutos: formData.get("minutos") || undefined,
    redacao: formData.get("redacao") === "on",
  });

  const geraisWhere = { topic: { module: { discipline: { specialtyId: null } } } };
  const espWhere = { topic: { module: { discipline: { specialtyId: spec.id } } } };
  let gerais: string[] = [];
  let esp: string[] = [];
  let title = "";
  let timeLimit = 0;
  let includesEssay = false;

  switch (p.type) {
    case "COMPLETO":
      gerais = balancedPick(await pool(geraisWhere), EXAM_RULES.geraisQuestions);
      esp = balancedPick(await pool(espWhere), EXAM_RULES.especificosQuestions);
      title = `Simulado completo — ${spec.code} ${spec.shortName}`;
      timeLimit = EXAM_RULES.durationMinutes * 60;
      includesEssay = true;
      break;
    case "RAPIDO":
      gerais = balancedPick(await pool(geraisWhere), 8);
      esp = balancedPick(await pool(espWhere), 12);
      title = `Simulado rápido — ${spec.code} (20 questões)`;
      timeLimit = 60 * 60;
      break;
    case "DISCIPLINA": {
      const d = await db.discipline.findUniqueOrThrow({ where: { id: p.disciplineId } });
      const ids = shuffle((await db.question.findMany({ where: { status: "PUBLICADO", topic: { module: { disciplineId: d.id } } }, select: { id: true } })).map((q) => q.id)).slice(0, p.qtd ?? 15);
      if (d.specialtyId) esp = ids;
      else gerais = ids;
      title = `Simulado de ${d.name}`;
      timeLimit = (p.qtd ?? 15) * 3 * 60;
      break;
    }
    case "ASSUNTO": {
      const t = await db.topic.findUniqueOrThrow({ where: { id: p.topicId }, include: { module: { include: { discipline: true } } } });
      const ids = shuffle((await db.question.findMany({ where: { status: "PUBLICADO", topicId: t.id }, select: { id: true } })).map((q) => q.id)).slice(0, p.qtd ?? 10);
      if (t.module.discipline.specialtyId) esp = ids;
      else gerais = ids;
      title = `Simulado do assunto: ${t.title.slice(0, 80)}`;
      timeLimit = (p.qtd ?? 10) * 3 * 60;
      break;
    }
    case "PERSONALIZADO":
      gerais = balancedPick(await pool(geraisWhere), p.gerais ?? 10);
      esp = balancedPick(await pool(espWhere), p.especificos ?? 15);
      title = `Simulado personalizado — ${gerais.length} gerais + ${esp.length} específicas`;
      timeLimit = (p.minutos ?? (gerais.length + esp.length) * 3) * 60;
      includesEssay = !!p.redacao; // o tempo informado deve contemplar a redação
      break;
  }
  if (!gerais.length && !esp.length) redirect("/simulados?erro=sem-questoes");

  let essayId: string | null = null;
  if (includesEssay) {
    const prompts = await db.essayPrompt.findMany({ select: { id: true } });
    const prompt = prompts.length ? prompts[Math.floor(Math.random() * prompts.length)] : null;
    const essay = await db.essay.create({ data: { userId: user.id, promptId: prompt?.id ?? null, title: "" } });
    essayId = essay.id;
  }

  const sim = await db.simulado.create({
    data: {
      userId: user.id,
      specialtyId: spec.id,
      type: p.type,
      title,
      timeLimitSec: timeLimit,
      includesEssay,
      essayId,
      items: {
        create: [
          ...gerais.map((questionId, i) => ({ questionId, order: i, section: "GERAIS" })),
          ...esp.map((questionId, i) => ({ questionId, order: gerais.length + i, section: "ESPECIFICOS" })),
        ],
      },
    },
  });
  redirect(`/simulados/${sim.id}`);
}

async function ownSim(userId: string, id: string) {
  const s = await db.simulado.findFirst({ where: { id, userId } });
  if (!s) throw new Error("Simulado não encontrado");
  return s;
}

/** Salvamento automático de resposta/marcação (permite retomar após interrupção). */
export async function saveSimuladoItem(simuladoId: string, itemId: string, data: { selectedLetter?: string | null; flagged?: boolean }, elapsedSec: number, currentIndex: number) {
  const user = await requireUser();
  const s = await ownSim(user.id, simuladoId);
  if (s.status !== "EM_ANDAMENTO") throw new Error("Simulado já finalizado");
  if (data.selectedLetter !== undefined && data.selectedLetter !== null && !/^[A-E]$/.test(data.selectedLetter)) throw new Error("Alternativa inválida");
  await db.simuladoItem.updateMany({ where: { id: itemId, simuladoId }, data });
  await db.simulado.update({ where: { id: simuladoId }, data: { elapsedSec: Math.max(s.elapsedSec, Math.round(elapsedSec)), currentIndex } });
}

export async function saveSimuladoProgress(simuladoId: string, elapsedSec: number, currentIndex: number) {
  const user = await requireUser();
  const s = await ownSim(user.id, simuladoId);
  if (s.status !== "EM_ANDAMENTO") return;
  await db.simulado.update({ where: { id: simuladoId }, data: { elapsedSec: Math.max(s.elapsedSec, Math.round(elapsedSec)), currentIndex } });
}

export async function saveSimuladoEssay(simuladoId: string, title: string, content: string) {
  const user = await requireUser();
  const s = await ownSim(user.id, simuladoId);
  if (!s.essayId || s.status !== "EM_ANDAMENTO") return;
  await db.essay.update({ where: { id: s.essayId }, data: { title: title.slice(0, 200), content: content.slice(0, 20000), wordCount: countWords(content), lineEstimate: estimateLines(content) } });
}

export async function finalizeSimulado(simuladoId: string, elapsedSec: number) {
  const user = await requireUser();
  const s = await db.simulado.findFirst({ where: { id: simuladoId, userId: user.id }, include: { items: { include: { question: { include: { alternatives: { where: { isCorrect: true } } } } } } } });
  if (!s) throw new Error("Simulado não encontrado");
  if (s.status === "FINALIZADO") redirect(`/simulados/${s.id}/resultado`);
  const now = new Date();
  let cg = 0,
    tg = 0,
    ce = 0,
    te = 0;
  for (const it of s.items) {
    const correctLetter = it.question.alternatives[0]?.letter;
    const isCorrect = !!it.selectedLetter && it.selectedLetter === correctLetter;
    if (it.section === "GERAIS") {
      tg++;
      if (isCorrect) cg++;
    } else {
      te++;
      if (isCorrect) ce++;
    }
    await db.simuladoItem.update({ where: { id: it.id }, data: { isCorrect: it.selectedLetter ? isCorrect : false } });
    if (it.selectedLetter) {
      await db.answer.create({ data: { userId: user.id, questionId: it.questionId, selectedLetter: it.selectedLetter, isCorrect, mode: "SIMULADO", simuladoId: s.id } });
    }
  }
  const r = scoreObjective(cg, tg, ce, te);
  const elapsed = Math.max(s.elapsedSec, Math.min(Math.round(elapsedSec), s.timeLimitSec + 600));
  await db.simulado.update({
    where: { id: s.id },
    data: {
      status: "FINALIZADO",
      finishedAt: now,
      elapsedSec: elapsed,
      correctGerais: cg,
      totalGerais: tg,
      correctEspec: ce,
      totalEspec: te,
      scoreGerais: r.scoreGerais,
      scoreEspec: r.scoreEspec,
      objectiveScore: r.objectiveScore,
      habilitado: r.habilitadoAmpla,
    },
  });
  if (elapsed >= 60) {
    await db.studySession.create({ data: { userId: user.id, type: "SIMULADO", startedAt: new Date(now.getTime() - elapsed * 1000), endedAt: now, durationSec: elapsed, notes: s.title } });
  }
  if (s.essayId) {
    const e = await db.essay.findUnique({ where: { id: s.essayId } });
    if (e && e.content.trim()) {
      await db.essay.update({ where: { id: e.id }, data: { status: "FINALIZADA", autoAnalysis: JSON.stringify(analyzeEssay(e.title, e.content)) } });
    }
  }
  revalidatePath("/simulados");
  revalidatePath("/dashboard");
  redirect(`/simulados/${s.id}/resultado`);
}

export async function deleteSimulado(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await ownSim(user.id, id);
  await db.answer.deleteMany({ where: { userId: user.id, simuladoId: id } });
  await db.simulado.delete({ where: { id } });
  revalidatePath("/simulados");
  redirect("/simulados");
}
