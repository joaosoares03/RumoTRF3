"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyzeEssay, countWords, estimateLines } from "@/lib/essay";
import { aiEnabled, analyzeEssayWithAI } from "@/lib/ai";

export async function newEssay(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("tema") ?? "");
  const exercise = String(formData.get("exercicio") ?? "");
  const prompt = slug ? await db.essayPrompt.findUnique({ where: { slug } }) : null;
  const titles: Record<string, string> = { introducao: "Exercício — Introdução", desenvolvimento: "Exercício — Parágrafo de desenvolvimento", conclusao: "Exercício — Conclusão" };
  const e = await db.essay.create({ data: { userId: user.id, promptId: prompt?.id ?? null, title: titles[exercise] ?? "" } });
  redirect(`/redacao/${e.id}`);
}

async function own(userId: string, id: string) {
  const e = await db.essay.findFirst({ where: { id, userId } });
  if (!e) throw new Error("Redação não encontrada");
  return e;
}

export async function saveEssayDraft(id: string, title: string, content: string, addSeconds: number) {
  const user = await requireUser();
  const e = await own(user.id, id);
  const secs = Math.max(0, Math.min(600, Math.round(addSeconds)));
  await db.essay.update({
    where: { id },
    data: { title: title.slice(0, 200), content: content.slice(0, 20000), wordCount: countWords(content), lineEstimate: estimateLines(content), timeSpentSec: e.timeSpentSec + secs },
  });
  if (secs >= 30) {
    const end = new Date();
    await db.studySession.create({ data: { userId: user.id, type: "REDACAO", startedAt: new Date(end.getTime() - secs * 1000), endedAt: end, durationSec: secs } });
  }
  return { savedAt: new Date().toISOString() };
}

export async function finishEssay(id: string, title: string, content: string) {
  const user = await requireUser();
  await own(user.id, id);
  const analysis = analyzeEssay(title, content);
  await db.essay.update({
    where: { id },
    data: { title: title.slice(0, 200), content: content.slice(0, 20000), wordCount: analysis.words, lineEstimate: analysis.lines, status: "FINALIZADA", autoAnalysis: JSON.stringify(analysis) },
  });
  revalidatePath("/redacao");
  return analysis;
}

export async function reopenEssay(id: string) {
  const user = await requireUser();
  await own(user.id, id);
  await db.essay.update({ where: { id }, data: { status: "RASCUNHO" } });
  revalidatePath(`/redacao/${id}`);
}

export async function saveEssayReview(id: string, checklist: Record<string, boolean>, selfScores: Record<string, number>) {
  const user = await requireUser();
  await own(user.id, id);
  const clean: Record<string, number> = {};
  for (const k of ["A", "B", "C", "D"]) if (typeof selfScores[k] === "number") clean[k] = Math.max(0, Math.min(10, selfScores[k]));
  await db.essay.update({ where: { id }, data: { checklist: JSON.stringify(checklist), selfScores: JSON.stringify(clean) } });
  revalidatePath("/redacao");
}

export async function requestAIFeedback(id: string): Promise<{ ok: boolean; text: string }> {
  const user = await requireUser();
  const e = await db.essay.findFirst({ where: { id, userId: user.id }, include: { prompt: true } });
  if (!e) throw new Error("Redação não encontrada");
  if (!aiEnabled()) return { ok: false, text: "A análise por IA está desativada: configure ANTHROPIC_API_KEY no arquivo .env (opcional). A análise local continua disponível." };
  if (countWords(e.content) < 50) return { ok: false, text: "Escreva ao menos 50 palavras antes de pedir a análise." };
  try {
    const text = await analyzeEssayWithAI({ theme: e.prompt?.thematicPhrase ?? "", title: e.title, text: e.content });
    await db.essay.update({ where: { id }, data: { aiFeedback: text } });
    return { ok: true, text };
  } catch (err) {
    return { ok: false, text: (err as Error).message };
  }
}

export async function deleteEssay(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await own(user.id, id);
  await db.essay.delete({ where: { id } });
  revalidatePath("/redacao");
  redirect("/redacao");
}
