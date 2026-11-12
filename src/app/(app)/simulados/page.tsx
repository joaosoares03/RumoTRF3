import Link from "next/link";
import { Timer, Zap, BookOpen, Target, SlidersHorizontal } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines, getPrefs, scopeOf } from "@/lib/data";
import { createSimulado } from "@/app/actions/simulados";
import { TrendChart } from "@/components/charts";
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Field, Notice, PageHeader, inputClass } from "@/components/ui";
import { formatDate, formatMinutes } from "@/lib/utils";
import { EXAM_RULES } from "../../../../content/edital";

export const metadata = { title: "Simulados" };

export default async function SimuladosPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const spec = await db.specialty.findUniqueOrThrow({ where: { key: active } });
  const [sims, disciplines, nGerais, nEsp] = await Promise.all([
    db.simulado.findMany({ where: { userId: user.id, specialtyId: spec.id }, orderBy: { startedAt: "desc" } }),
    getDisciplines([active]),
    db.question.count({ where: { status: "PUBLICADO", topic: { module: { discipline: { specialtyId: null } } } } }),
    db.question.count({ where: { status: "PUBLICADO", topic: { module: { discipline: { specialtyId: spec.id } } } } }),
  ]);
  const done = sims.filter((s) => s.status === "FINALIZADO").reverse();
  const chart = done.map((s, i) => ({
    label: `#${i + 1}`,
    nota: s.objectiveScore,
    gerais: s.scoreGerais,
    especificos: s.scoreEspec,
  }));

  return (
    <div>
      <PageHeader
        eyebrow={`${spec.code} · ${spec.shortName}`}
        title="Simulados no estilo Vunesp"
        description={`Estrutura do edital: ${EXAM_RULES.geraisQuestions} questões de Conhecimentos Gerais (peso 1) + ${EXAM_RULES.especificosQuestions} de Conhecimentos Específicos (peso 2), 5 alternativas, redação e 4h30 de prova. As questões são autorais de treinamento; não há ranking — a plataforma não possui dados oficiais de outros candidatos.`}
      />
      {erro && <Notice tone="danger" className="mb-4">Não há questões suficientes com esses filtros.</Notice>}
      {(nGerais < 24 || nEsp < 36) && <Notice tone="warning" className="mb-4">Banco atual: {nGerais} questões gerais e {nEsp} específicas — o simulado completo usa o máximo disponível.</Notice>}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col p-5">
          <Timer className="size-6 text-accent" />
          <h3 className="mt-3 font-semibold">Simulado completo</h3>
          <p className="mt-1 flex-1 text-sm text-muted">60 questões (24 + 36), redação e cronômetro de 4h30. Salva automaticamente.</p>
          <form action={createSimulado} className="mt-4">
            <input type="hidden" name="type" value="COMPLETO" />
            <Button className="w-full">Iniciar prova</Button>
          </form>
        </Card>
        <Card className="flex flex-col p-5">
          <Zap className="size-6 text-amber" />
          <h3 className="mt-3 font-semibold">Simulado rápido</h3>
          <p className="mt-1 flex-1 text-sm text-muted">20 questões (8 gerais + 12 específicas) em 1 hora.</p>
          <form action={createSimulado} className="mt-4">
            <input type="hidden" name="type" value="RAPIDO" />
            <Button variant="secondary" className="w-full">Iniciar</Button>
          </form>
        </Card>
        <Card className="p-5">
          <BookOpen className="size-6 text-teal" />
          <h3 className="mt-3 font-semibold">Por disciplina</h3>
          <form action={createSimulado} className="mt-3 space-y-2">
            <input type="hidden" name="type" value="DISCIPLINA" />
            <select name="disciplineId" className={inputClass} aria-label="Disciplina" required>
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select name="qtd" defaultValue="15" className={inputClass} aria-label="Quantidade">
              {[10, 15, 20, 30].map((n) => <option key={n} value={n}>{n} questões</option>)}
            </select>
            <Button variant="secondary" className="w-full">Iniciar</Button>
          </form>
        </Card>
        <Card className="p-5">
          <Target className="size-6 text-violet" />
          <h3 className="mt-3 font-semibold">Por assunto</h3>
          <form action={createSimulado} className="mt-3 space-y-2">
            <input type="hidden" name="type" value="ASSUNTO" />
            <select name="topicId" className={inputClass} aria-label="Assunto" required>
              {disciplines.map((d) => (
                <optgroup key={d.id} label={d.name}>
                  {d.modules.flatMap((m) => m.topics.map((t) => <option key={t.id} value={t.id}>{t.title.slice(0, 70)}</option>))}
                </optgroup>
              ))}
            </select>
            <input type="hidden" name="qtd" value="10" />
            <Button variant="secondary" className="w-full">Iniciar (até 10)</Button>
          </form>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader title="Simulado personalizado" icon={<SlidersHorizontal className="size-4" />} />
        <CardBody>
          <form action={createSimulado} className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <input type="hidden" name="type" value="PERSONALIZADO" />
            <Field label="Questões gerais"><input type="number" name="gerais" min={0} max={24} defaultValue={12} className={inputClass} /></Field>
            <Field label="Questões específicas"><input type="number" name="especificos" min={0} max={36} defaultValue={18} className={inputClass} /></Field>
            <Field label="Tempo (min)"><input type="number" name="minutos" min={5} max={270} defaultValue={120} className={inputClass} /></Field>
            <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" name="redacao" className="size-4 accent-[var(--accent)]" /> Incluir redação</label>
            <div className="flex items-end"><Button className="w-full">Criar</Button></div>
          </form>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader title="Seus simulados" subtitle={`${done.length} finalizado(s) nesta especialidade`} />
          <CardBody>
            {sims.length ? (
              <ul className="divide-y divide-border">
                {sims.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <Link href={s.status === "FINALIZADO" ? `/simulados/${s.id}/resultado` : `/simulados/${s.id}`} className="font-medium hover:text-accent">{s.title}</Link>
                      <div className="text-xs text-muted">
                        {formatDate(s.startedAt)} · {formatMinutes(s.elapsedSec / 60)} de {formatMinutes(s.timeLimitSec / 60)}
                      </div>
                    </div>
                    {s.status === "FINALIZADO" ? (
                      <>
                        <Badge tone="teal">Nota objetiva {s.objectiveScore?.toLocaleString("pt-BR")}</Badge>
                        <Badge tone={s.habilitado ? "success" : "danger"}>{s.habilitado ? "Atingiu os mínimos" : "Abaixo dos mínimos"}</Badge>
                      </>
                    ) : (
                      <Badge tone="amber">Em andamento — retomar</Badge>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Nenhum simulado ainda" description="Comece por um simulado rápido para calibrar seu ritmo." />
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Comparação entre simulados" subtitle="Notas (0–10) por prova" />
          <CardBody>
            {chart.length >= 1 ? (
              <TrendChart data={chart} lines={[{ key: "nota", name: "Nota objetiva", color: "var(--accent)" }, { key: "gerais", name: "Gerais", color: "var(--teal)" }, { key: "especificos", name: "Específicos", color: "var(--amber)" }]} />
            ) : (
              <EmptyState title="Sem dados para comparar" description="Os gráficos aparecem após o primeiro simulado finalizado." />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
