import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SimuladoRunner } from "@/components/simulado-runner";

export const metadata = { title: "Simulado em andamento" };

export default async function SimuladoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const s = await db.simulado.findFirst({
    where: { id, userId: user.id },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          question: {
            select: {
              statement: true,
              alternatives: { select: { letter: true, text: true }, orderBy: { letter: "asc" } }, // sem gabarito
              topic: { select: { module: { select: { discipline: { select: { name: true } } } } } },
            },
          },
        },
      },
      essay: { include: { prompt: true } },
    },
  });
  if (!s) notFound();
  if (s.status === "FINALIZADO") redirect(`/simulados/${s.id}/resultado`);
  return (
    <SimuladoRunner
      simuladoId={s.id}
      title={s.title}
      timeLimitSec={s.timeLimitSec}
      elapsedSec={s.elapsedSec}
      currentIndex={s.currentIndex}
      items={s.items.map((it) => ({
        id: it.id,
        section: it.section,
        selectedLetter: it.selectedLetter,
        flagged: it.flagged,
        statement: it.question.statement,
        alternatives: it.question.alternatives,
        discipline: it.question.topic.module.discipline.name,
      }))}
      essay={
        s.includesEssay && s.essay
          ? {
              title: s.essay.title,
              content: s.essay.content,
              prompt: s.essay.prompt ? { title: s.essay.prompt.title, thematicPhrase: s.essay.prompt.thematicPhrase, motivatingTexts: s.essay.prompt.motivatingTexts, instructions: s.essay.prompt.instructions } : null,
            }
          : null
      }
    />
  );
}
