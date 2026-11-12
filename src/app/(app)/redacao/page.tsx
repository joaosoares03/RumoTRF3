import Link from "next/link";
import { PenLine, ListChecks, Ban, BookOpen } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { newEssay } from "@/app/actions/essays";
import { TrendChart } from "@/components/charts";
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, PageHeader } from "@/components/ui";
import { formatDate, parseJson } from "@/lib/utils";
import { ARGUMENT_EXAMPLES, ESSAY_STRUCTURE } from "../../../../content/essays";
import { EXAM_RULES } from "../../../../content/edital";
import { CONNECTIVES } from "@/lib/essay";

export const metadata = { title: "Redação" };

export default async function RedacaoPage() {
  const user = await requireUser();
  const [prompts, essays] = await Promise.all([
    db.essayPrompt.findMany({ orderBy: { title: "asc" }, include: { _count: { select: { essays: { where: { userId: user.id } } } } } }),
    db.essay.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, include: { prompt: { select: { title: true } } } }),
  ]);
  const finished = essays.filter((e) => e.status === "FINALIZADA").reverse();
  const chart = finished.map((e, i) => {
    const s = parseJson<Record<string, number>>(e.selfScores, {});
    const vals = Object.values(s);
    return { label: `#${i + 1}`, palavras: e.wordCount, linhas: e.lineEstimate, autoavaliacao: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null };
  });
  const R = EXAM_RULES.redacao;

  return (
    <div>
      <PageHeader
        title="Redação — prova discursiva"
        description="Para Técnico Judiciário: redação dissertativo-argumentativa, eliminatória e classificatória, nota de 0 a 10 (mínimo 5,00 na ampla concorrência; 4,00 para cotas/PcD) e peso 1 após a retificação nº 02/2026."
        actions={
          <form action={newEssay}>
            <Button><PenLine className="size-4" /> Redação livre</Button>
          </form>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Temas autorais para treinamento" subtitle="Não são temas oficiais de provas anteriores — temas oficiais só serão cadastrados quando disponíveis legitimamente" />
            <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {prompts.map((p) => (
                <form key={p.id} action={newEssay} className="flex flex-col rounded-xl border border-border p-4">
                  <input type="hidden" name="tema" value={p.slug} />
                  <Badge className="self-start">{p.axis}</Badge>
                  <div className="mt-2 font-medium leading-snug">{p.thematicPhrase}</div>
                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted">
                    <span>{p._count.essays} redação(ões) suas</span>
                    <Button variant="secondary" className="text-xs">Escrever</Button>
                  </div>
                </form>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Exercícios por parte do texto" subtitle="Treine introdução, desenvolvimento e conclusão separadamente" />
            <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[["introducao", "Introdução"], ["desenvolvimento", "Desenvolvimento"], ["conclusao", "Conclusão"]].map(([k, label]) => (
                <form key={k} action={newEssay} className="rounded-xl border border-border p-4">
                  <input type="hidden" name="exercicio" value={k} />
                  <select name="tema" className="mb-2 w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs" aria-label="Tema do exercício">
                    {prompts.map((p) => <option key={p.id} value={p.slug}>{p.title}</option>)}
                  </select>
                  <Button variant="secondary" className="w-full text-xs">Praticar {label}</Button>
                </form>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Histórico de redações" subtitle={`${essays.length} no total · ${finished.length} finalizadas`} />
            <CardBody>
              {finished.length >= 2 && <TrendChart data={chart} lines={[{ key: "linhas", name: "Linhas estimadas", color: "var(--teal)" }, { key: "autoavaliacao", name: "Autoavaliação média", color: "var(--accent)" }]} />}
              {essays.length ? (
                <ul className="divide-y divide-border">
                  {essays.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center gap-2 py-2.5 text-sm">
                      <Link href={`/redacao/${e.id}`} className="min-w-0 flex-1 truncate font-medium hover:text-accent">
                        {e.title || e.prompt?.title || "Redação livre"}
                      </Link>
                      <span className="text-xs text-muted">{formatDate(e.updatedAt)} · {e.wordCount} palavras · ~{e.lineEstimate} linhas</span>
                      <Badge tone={e.status === "FINALIZADA" ? "success" : "amber"}>{e.status === "FINALIZADA" ? "Finalizada" : "Rascunho"}</Badge>
                      {e.aiFeedback && <Badge tone="teal">análise IA</Badge>}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Nenhuma redação ainda" description="Escolha um tema acima e escreva sua primeira redação." />
              )}
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Critérios oficiais (item 9.52)" icon={<ListChecks className="size-4" />} />
            <CardBody className="space-y-3 pt-3 text-sm">
              {R.criterios.map((c) => (
                <div key={c.key}><strong>{c.key}) {c.nome}:</strong> <span className="text-muted">{c.descricao}</span></div>
              ))}
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted">{R.observacoes.map((o) => <li key={o}>{o}</li>)}</ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Nota zero (item 9.53)" icon={<Ban className="size-4" />} />
            <CardBody className="pt-3"><ul className="list-disc space-y-1 pl-4 text-xs">{R.notaZero.map((n) => <li key={n}>{n}</li>)}</ul></CardBody>
          </Card>
          <Card>
            <CardHeader title="Modelo de estrutura" icon={<BookOpen className="size-4" />} />
            <CardBody className="space-y-3 pt-3 text-sm">
              {ESSAY_STRUCTURE.map((s) => (
                <div key={s.part}><div className="font-medium">{s.part}</div><ul className="list-disc pl-4 text-xs text-muted">{s.tips.map((t) => <li key={t}>{t}</li>)}</ul></div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Banco de conectivos" />
            <CardBody className="space-y-2 pt-3 text-xs">
              {Object.entries(CONNECTIVES).map(([k, v]) => <div key={k}><strong>{k}:</strong> <span className="text-muted">{v.join(", ")}</span></div>)}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Tipos de argumento" />
            <CardBody className="space-y-2 pt-3 text-xs">
              {ARGUMENT_EXAMPLES.map((a) => <div key={a.type}><strong>{a.type}:</strong> <span className="text-muted">{a.example}</span></div>)}
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
