import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { scoreObjective } from "@/lib/scoring";
import { deleteSimulado } from "@/app/actions/simulados";
import { SimpleBars } from "@/components/charts";
import { Badge, Button, ButtonLink, Card, CardBody, CardHeader, Notice, PageHeader, StatCard } from "@/components/ui";
import { formatDate, formatMinutes } from "@/lib/utils";
import { EXAM_RULES } from "../../../../../../content/edital";

export const metadata = { title: "Resultado do simulado" };

export default async function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const s = await db.simulado.findFirst({
    where: { id, userId: user.id },
    include: {
      specialty: true,
      essay: true,
      items: { orderBy: { order: "asc" }, include: { question: { include: { alternatives: { orderBy: { letter: "asc" } }, topic: { include: { module: { include: { discipline: true } } } } } } } },
    },
  });
  if (!s) notFound();
  if (s.status !== "FINALIZADO") redirect(`/simulados/${s.id}`);
  const r = scoreObjective(s.correctGerais ?? 0, s.totalGerais ?? 0, s.correctEspec ?? 0, s.totalEspec ?? 0);
  const a = EXAM_RULES.habilitacao.amplaConcorrencia;
  const c = EXAM_RULES.habilitacao.cotasPcd;

  const byDisc = new Map<string, { name: string; total: number; correct: number; blank: number }>();
  for (const it of s.items) {
    const d = it.question.topic.module.discipline;
    const m = byDisc.get(d.id) ?? { name: d.name, total: 0, correct: 0, blank: 0 };
    m.total++;
    if (it.isCorrect) m.correct++;
    if (!it.selectedLetter) m.blank++;
    byDisc.set(d.id, m);
  }
  const discData = [...byDisc.values()].map((d) => ({ ...d, name: d.name.length > 28 ? d.name.slice(0, 26) + "…" : d.name, taxa: Math.round((d.correct / d.total) * 100) }));
  const wrong = s.items.filter((it) => !it.isCorrect);

  return (
    <div>
      <PageHeader
        eyebrow={`${s.specialty?.code ?? ""} · ${formatDate(s.startedAt)} · ${formatMinutes(s.elapsedSec / 60)}`}
        title={s.title}
        description="Correção automática da parte objetiva conforme o Capítulo 10 do edital. A redação não recebe nota automática: use a autoavaliação no módulo de Redação."
        actions={
          <>
            <ButtonLink href="/simulados" variant="secondary">Voltar</ButtonLink>
            <form action={deleteSimulado}>
              <input type="hidden" name="id" value={s.id} />
              <Button variant="ghost">Excluir</Button>
            </form>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Nota objetiva" value={r.objectiveScore.toLocaleString("pt-BR")} hint="média ponderada 0–10 (pesos 1 e 2)" tone="accent" />
        <StatCard label="Gerais" value={`${r.correctGerais}/${r.totalGerais}`} hint={`nota ${r.scoreGerais.toLocaleString("pt-BR")}`} />
        <StatCard label="Específicos" value={`${r.correctEspec}/${r.totalEspec}`} hint={`nota ${r.scoreEspec.toLocaleString("pt-BR")}`} />
        <StatCard label="Em branco" value={s.items.filter((i) => !i.selectedLetter).length} hint="contam como erro" />
      </div>

      <Card className="mb-6">
        <CardHeader title="Mínimos do edital (item 10.3 e 10.4.1)" subtitle={r.officialStructure ? "Simulado com a estrutura oficial (24 + 36): mínimos aplicados literalmente." : "Simulado com estrutura diferente da oficial: aplicados os mesmos percentuais (50% / 40%), arredondando para cima."} />
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: "Ampla concorrência", ok: r.habilitadoAmpla, rules: `≥ 50% em Gerais${r.officialStructure ? ` (${a.minAcertosGerais})` : ""}, ≥ 50% em Específicos${r.officialStructure ? ` (${a.minAcertosEspecificos})` : ""} e média ≥ ${a.minMediaPonderada.toLocaleString("pt-BR")}` },
            { label: "Candidatos negros/pardos, indígenas, quilombolas e PcD", ok: r.habilitadoCotas, rules: `≥ 40% em Gerais${r.officialStructure ? ` (${c.minAcertosGerais})` : ""}, ≥ 40% em Específicos${r.officialStructure ? ` (${c.minAcertosEspecificos})` : ""} e média ≥ ${c.minMediaPonderada.toLocaleString("pt-BR")}` },
          ].map((x) => (
            <div key={x.label} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 font-semibold">
                {x.ok ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-danger" />} {x.label}
              </div>
              <p className="mt-1 text-sm text-muted">{x.rules}</p>
            </div>
          ))}
          <Notice className="md:col-span-2">
            Atingir os mínimos indica habilitação na parte objetiva <strong>neste treino</strong>. Não existe nota de corte divulgada antes do resultado; a classificação final soma a nota objetiva à nota da redação (item 13.2), e a redação é eliminatória (mínimo 5,00 — ou 4,00 para cotas/PcD).
          </Notice>
        </CardBody>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Resultado por disciplina" subtitle="% de acerto" />
          <CardBody>
            <SimpleBars data={discData} dataKey="taxa" nameKey="name" unit="%" height={Math.max(200, discData.length * 36)} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Redação" />
          <CardBody>
            {s.essay?.content ? (
              <>
                <p className="text-sm">{s.essay.wordCount} palavras · ~{s.essay.lineEstimate} linhas estimadas.</p>
                <ButtonLink href={`/redacao/${s.essay.id}`} variant="secondary" className="mt-3">Ver análise e autoavaliação</ButtonLink>
              </>
            ) : (
              <p className="text-sm text-muted">{s.includesEssay ? "A redação ficou em branco (nota zero pelo item 9.53, c)." : "Este simulado não incluiu redação."}</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={`Relatório de erros (${wrong.length})`} subtitle="Gabarito comentado das questões erradas ou em branco" action={<PrintButton />} />
        <CardBody className="space-y-4">
          {wrong.map((it) => {
            const correct = it.question.alternatives.find((x) => x.isCorrect)!;
            return (
              <div key={it.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <Badge>Q{it.order + 1}</Badge>
                  <Badge>{it.question.code}</Badge>
                  {it.question.topic.module.discipline.name}
                  {it.selectedLetter ? <Badge tone="danger">Marcou {it.selectedLetter}</Badge> : <Badge><MinusCircle className="size-3" /> em branco</Badge>}
                  <Badge tone="success">Gabarito {correct.letter}</Badge>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm">{it.question.statement}</p>
                <p className="mt-2 text-sm"><strong>{correct.letter})</strong> {correct.text}</p>
                <p className="mt-2 text-sm text-muted">{it.question.explanation}</p>
                <Link href={`/assuntos/${it.question.topicId}`} className="mt-2 inline-block text-xs text-accent">Estudar o assunto →</Link>
              </div>
            );
          })}
          {!wrong.length && <p className="text-sm text-success">Nenhum erro. Excelente!</p>}
        </CardBody>
      </Card>
    </div>
  );
}
