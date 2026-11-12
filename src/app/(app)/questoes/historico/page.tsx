import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, PageHeader, ButtonLink } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Histórico de respostas" };

export default async function HistoricoPage() {
  const user = await requireUser();
  const answers = await db.answer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { question: { select: { code: true, topic: { select: { title: true, module: { select: { discipline: { select: { name: true } } } } } } } } },
  });
  return (
    <div>
      <PageHeader title="Histórico de respostas" description="Últimas 300 respostas registradas (prática, revisão e simulados)." actions={<ButtonLink href="/api/export?tipo=respostas" variant="secondary">Exportar CSV</ButtonLink>} />
      {answers.length === 0 ? (
        <EmptyState title="Nenhuma resposta ainda" action={<ButtonLink href="/questoes">Resolver questões</ButtonLink>} />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Questão</th>
                <th className="px-4 py-2">Disciplina / assunto</th>
                <th className="px-4 py-2">Modo</th>
                <th className="px-4 py-2">Resposta</th>
                <th className="px-4 py-2">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-2 text-xs">{formatDate(a.createdAt, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-4 py-2">{a.question.code}</td>
                  <td className="max-w-[320px] px-4 py-2 text-xs">
                    {a.question.topic.module.discipline.name} › <span className="text-muted">{a.question.topic.title}</span>
                  </td>
                  <td className="px-4 py-2 text-xs">{a.mode}</td>
                  <td className="px-4 py-2">
                    <Badge tone={a.isCorrect ? "success" : "danger"}>
                      {a.selectedLetter} · {a.isCorrect ? "certa" : "errada"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-xs tabular-nums">{a.timeSpentSec}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
