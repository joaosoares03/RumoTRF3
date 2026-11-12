import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Caderno de erros" };

export default async function CadernoErrosPage() {
  const user = await requireUser();
  const answers = await db.answer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { question: { include: { topic: { include: { module: { include: { discipline: true } } } }, alternatives: { where: { isCorrect: true } } } } },
  });
  const seen = new Set<string>();
  const wrong: typeof answers = [];
  const errorsCount = new Map<string, number>();
  for (const a of answers) {
    if (!a.isCorrect) errorsCount.set(a.questionId, (errorsCount.get(a.questionId) ?? 0) + 1);
    if (seen.has(a.questionId)) continue;
    seen.add(a.questionId);
    if (!a.isCorrect) wrong.push(a);
  }
  const byDisc = new Map<string, number>();
  wrong.forEach((w) => byDisc.set(w.question.topic.module.discipline.name, (byDisc.get(w.question.topic.module.discipline.name) ?? 0) + 1));

  return (
    <div>
      <PageHeader
        title="Caderno de erros"
        description="Questões cuja última resposta foi incorreta. Ao acertar uma questão aqui, ela sai do caderno. Cada erro também gera um flashcard pessoal."
        actions={
          wrong.length > 0 && (
            <ButtonLink href="/questoes/resolver?situacao=erradas&qtd=50">
              <RotateCcw className="size-4" /> Revisar somente os erros
            </ButtonLink>
          )
        }
      />
      {wrong.length === 0 ? (
        <EmptyState title="Caderno vazio" description="Nenhum erro pendente. Continue resolvendo questões — os erros aparecem aqui automaticamente." action={<ButtonLink href="/questoes">Resolver questões</ButtonLink>} />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {[...byDisc.entries()].map(([k, v]) => (
              <Badge key={k} tone="danger">
                {k}: {v}
              </Badge>
            ))}
          </div>
          <div className="space-y-3">
            {wrong.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <Badge>{a.question.code}</Badge>
                  <span>{a.question.topic.module.discipline.name}</span>›<span className="truncate">{a.question.topic.title}</span>
                  <span className="ml-auto">Errou {errorsCount.get(a.questionId)}× · última em {formatDate(a.createdAt)}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm">{a.question.statement}</p>
                <div className="mt-2 text-xs">
                  Sua resposta: <strong className="text-danger">{a.selectedLetter}</strong> · Gabarito: <strong className="text-success">{a.question.alternatives[0]?.letter}</strong>
                </div>
                <Link href={`/questoes/resolver?assunto=${a.question.topicId}&situacao=erradas`} className="mt-2 inline-block text-xs font-medium text-accent">
                  Refazer erros deste assunto →
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
