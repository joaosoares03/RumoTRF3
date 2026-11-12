import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiEnabled } from "@/lib/ai";
import { deleteEssay } from "@/app/actions/essays";
import { EssayEditor } from "@/components/essay-editor";
import { Button, PageHeader } from "@/components/ui";
import { parseJson } from "@/lib/utils";
import { ESSAY_CHECKLIST } from "../../../../../content/essays";
import { EXAM_RULES } from "../../../../../content/edital";
import type { EssayAnalysis } from "@/lib/essay";

export const metadata = { title: "Redação" };

export default async function EssayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const e = await db.essay.findFirst({ where: { id, userId: user.id }, include: { prompt: true } });
  if (!e) notFound();
  return (
    <div>
      <div className="mb-2 text-xs text-muted">
        <Link href="/redacao" className="hover:text-accent">Redação</Link> › {e.prompt?.title ?? "Texto livre"}
      </div>
      <PageHeader
        title={e.title.startsWith("Exercício") ? e.title : e.prompt?.title ?? "Redação livre"}
        description="Texto dissertativo-argumentativo (item 9.51). Autossalvamento ativo; o tempo de escrita é registrado no seu histórico."
        actions={
          <form action={deleteEssay}>
            <input type="hidden" name="id" value={e.id} />
            <Button variant="ghost">Excluir</Button>
          </form>
        }
      />
      <EssayEditor
        id={e.id}
        initialTitle={e.title.startsWith("Exercício") ? "" : e.title}
        initialContent={e.content}
        status={e.status}
        prompt={e.prompt ? { thematicPhrase: e.prompt.thematicPhrase, motivatingTexts: e.prompt.motivatingTexts, instructions: e.prompt.instructions } : null}
        exercise={e.title.startsWith("Exercício") ? e.title : null}
        checklistItems={ESSAY_CHECKLIST}
        initialChecklist={parseJson(e.checklist, {})}
        initialScores={parseJson(e.selfScores, {})}
        criteria={EXAM_RULES.redacao.criterios}
        initialAnalysis={parseJson<EssayAnalysis | null>(e.autoAnalysis, null)}
        initialAI={e.aiFeedback}
        aiAvailable={aiEnabled()}
      />
    </div>
  );
}
