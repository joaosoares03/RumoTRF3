import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines, getPrefs, scopeOf } from "@/lib/data";
import { createCard, deleteCard, toggleSuspend } from "@/app/actions/flashcards";
import { Badge, Button, ButtonLink, Card, CardBody, CardHeader, Field, PageHeader, StatCard, inputClass } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Flashcards" };

export default async function FlashcardsPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { prepared, active } = scopeOf(prefs);
  const keys = [...new Set([...prepared, active])];
  const disciplines = await getDisciplines(keys);
  const now = new Date();
  const since30 = new Date(Date.now() - 30 * 86400000);
  const [logs30, totalLogs, personal] = await Promise.all([
    db.reviewLog.findMany({ where: { userId: user.id, reviewedAt: { gte: since30 } }, select: { grade: true, intervalBefore: true } }),
    db.reviewLog.count({ where: { userId: user.id } }),
    db.flashcard.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" }, take: 50, include: { discipline: { select: { name: true } }, states: { where: { userId: user.id } } } }),
  ]);
  const matureReviews = logs30.filter((l) => l.intervalBefore >= 1);
  const retention = matureReviews.length ? Math.round((matureReviews.filter((l) => l.grade >= 3).length / matureReviews.length) * 100) : null;

  const decks = await Promise.all(
    disciplines.map(async (d) => {
      const base = { disciplineId: d.id, OR: [{ ownerId: null }, { ownerId: user.id }] };
      const [total, due, fresh] = await Promise.all([
        db.flashcard.count({ where: base }),
        db.flashcardState.count({ where: { userId: user.id, suspended: false, dueAt: { lte: now }, flashcard: base } }),
        db.flashcard.count({ where: { ...base, states: { none: { userId: user.id } } } }),
      ]);
      return { d, total, due, fresh };
    }),
  );
  const totalDue = decks.reduce((a, b) => a + b.due, 0);
  const upcoming = await db.flashcardState.count({ where: { userId: user.id, suspended: false, dueAt: { gt: now, lte: new Date(Date.now() + 7 * 86400000) } } });

  return (
    <div>
      <PageHeader
        title="Flashcards e revisão espaçada"
        description="Algoritmo SM-2 (SuperMemo 2). Questões erradas viram flashcards pessoais automaticamente. Documentação do algoritmo em docs/ALGORITMOS.md."
        actions={<ButtonLink href="/flashcards/revisar"><Layers className="size-4" /> Revisar agora ({totalDue})</ButtonLink>}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Vencidos hoje" value={totalDue} tone="accent" />
        <StatCard label="Próximos 7 dias" value={upcoming} />
        <StatCard label="Retenção (30 dias)" value={retention === null ? "—" : `${retention}%`} hint="acertos em cartões já vistos" tone="teal" />
        <StatCard label="Revisões totais" value={totalLogs} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Baralhos por disciplina" />
            <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {decks.map(({ d, total, due, fresh }) => (
                <div key={d.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: d.color }} /><span className="text-sm font-medium">{d.name}</span></div>
                  <div className="mt-2 flex gap-1.5 text-xs"><Badge>{total} cartões</Badge><Badge tone={due ? "accent" : "neutral"}>{due} vencidos</Badge><Badge tone="teal">{fresh} novos</Badge></div>
                  {total > 0 && <Link href={`/flashcards/revisar?disciplina=${d.id}`} className="mt-2 inline-block text-xs font-medium text-accent">Revisar este baralho →</Link>}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Seus cartões pessoais" subtitle="Criados por você ou gerados a partir de questões erradas" />
            <CardBody>
              {personal.length ? (
                <ul className="divide-y divide-border">
                  {personal.map((c) => (
                    <li key={c.id} className="flex items-start gap-3 py-3 text-sm">
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 font-medium">{c.front}</div>
                        <div className="mt-1 text-xs text-muted">
                          {c.discipline.name} · {c.sourceQuestionId ? "gerado de questão errada" : c.type.toLowerCase()} · {c.states[0] ? `próxima: ${formatDate(c.states[0].dueAt)}${c.states[0].suspended ? " (suspenso)" : ""}` : "novo"}
                        </div>
                      </div>
                      <form action={toggleSuspend}><input type="hidden" name="id" value={c.id} /><Button variant="ghost" className="text-xs">{c.states[0]?.suspended ? "Reativar" : "Suspender"}</Button></form>
                      <form action={deleteCard}><input type="hidden" name="id" value={c.id} /><Button variant="ghost" className="text-xs text-danger">Excluir</Button></form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">Nenhum cartão pessoal ainda.</p>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Criar flashcard" icon={<Plus className="size-4" />} />
          <CardBody>
            <form action={createCard} className="space-y-3">
              <Field label="Disciplina">
                <select name="disciplineId" required className={inputClass}>{disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
              </Field>
              <Field label="Tipo" hint="Lacuna: escreva {{resposta}} na frente para ocultá-la.">
                <select name="type" className={inputClass}><option value="BASICO">Pergunta e resposta</option><option value="LACUNA">Preenchimento de lacuna</option><option value="CODIGO">Código / comando</option></select>
              </Field>
              <Field label="Frente"><textarea name="front" required rows={3} className={inputClass} /></Field>
              <Field label="Verso"><textarea name="back" required rows={3} className={inputClass} /></Field>
              <Button className="w-full">Criar cartão</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
