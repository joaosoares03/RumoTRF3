import Link from "next/link";
import { Download, Lightbulb, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activeDayKeys, getPrefs, localDayBounds, mergedMinutes, scopeOf, streakFrom } from "@/lib/data";
import { ACHIEVEMENTS, editalProgress, questionTotals } from "@/lib/stats";
import { SimpleBars, SkillRadar, TrendChart } from "@/components/charts";
import { PrintButton } from "@/components/print-button";
import { Badge, ButtonLink, Card, CardBody, CardHeader, EmptyState, PageHeader, Progress, StatCard } from "@/components/ui";
import { addDays, cn, formatDate, formatMinutes, localDateKey } from "@/lib/utils";

export const metadata = { title: "Desempenho" };

export default async function DesempenhoPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const [edDev, edSup, qtDev, qtSup, keys] = await Promise.all([editalProgress(user.id, ["DEV"]), editalProgress(user.id, ["SUP"]), questionTotals(user.id, ["DEV"]), questionTotals(user.id, ["SUP"]), activeDayKeys(user.id)]);
  const ed = active === "DEV" ? edDev : edSup;

  // tempo por disciplina (sessões, mescladas por disciplina)
  const sessions = await db.studySession.findMany({ where: { userId: user.id }, select: { startedAt: true, endedAt: true, disciplineId: true } });
  const timeByDisc = ed.perDiscipline.map((d) => ({ name: d.name.length > 26 ? d.name.slice(0, 24) + "…" : d.name, minutos: mergedMinutes(sessions.filter((s) => s.disciplineId === d.id).map((s) => ({ start: s.startedAt, end: s.endedAt }))) }));
  const accByDisc = ed.perDiscipline.filter((d) => d.answered).map((d) => ({ name: d.name.length > 18 ? d.name.slice(0, 16) + "…" : d.name, taxa: Math.round((d.correct / d.answered) * 100) }));

  // evolução semanal (12 semanas)
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const monday = addDays(new Date(), -7 * (11 - i));
    const dow = (monday.getUTCDay() + 6) % 7;
    const key = localDateKey(addDays(monday, -dow));
    return key;
  });
  const fromW = localDayBounds(weeks[0]).start;
  const answers = await db.answer.findMany({ where: { userId: user.id, createdAt: { gte: fromW } }, select: { createdAt: true, isCorrect: true } });
  const weekly = weeks.map((k) => {
    const s = localDayBounds(k).start;
    const e = new Date(s.getTime() + 7 * 86400000);
    const ans = answers.filter((a) => a.createdAt >= s && a.createdAt < e);
    return {
      label: `${k.slice(8, 10)}/${k.slice(5, 7)}`,
      horas: Math.round((mergedMinutes(sessions.filter((x) => x.startedAt >= s && x.startedAt < e).map((x) => ({ start: x.startedAt, end: x.endedAt }))) / 60) * 10) / 10,
      questoes: ans.length,
      acertos: ans.length ? Math.round((ans.filter((a) => a.isCorrect).length / ans.length) * 100) : null,
    };
  });

  // assuntos com mais erros
  const wrongs = await db.answer.groupBy({ by: ["questionId"], where: { userId: user.id, isCorrect: false }, _count: true });
  const qTopic = await db.question.findMany({ where: { id: { in: wrongs.map((w) => w.questionId) } }, select: { id: true, topicId: true, topic: { select: { title: true } } } });
  const errByTopic = new Map<string, { title: string; n: number }>();
  for (const w of wrongs) {
    const q = qTopic.find((x) => x.id === w.questionId);
    if (!q) continue;
    const m = errByTopic.get(q.topicId) ?? { title: q.topic.title, n: 0 };
    m.n += w._count;
    errByTopic.set(q.topicId, m);
  }
  const topErr = [...errByTopic.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 8);

  // gerais × específicos
  const ger = ed.perDiscipline.filter((d) => d.kind === "GERAL");
  const esp = ed.perDiscipline.filter((d) => d.kind !== "GERAL");
  const sum = (arr: typeof ger, k: "answered" | "correct") => arr.reduce((a, d) => a + d[k], 0);
  const gRate = sum(ger, "answered") ? Math.round((sum(ger, "correct") / sum(ger, "answered")) * 100) : null;
  const eRate = sum(esp, "answered") ? Math.round((sum(esp, "correct") / sum(esp, "answered")) * 100) : null;

  const [sims, goals, overdueTopics, overdueCards, tasksDone, tasksPending, ach] = await Promise.all([
    db.simulado.findMany({ where: { userId: user.id, status: "FINALIZADO", specialty: { key: active } }, orderBy: { finishedAt: "asc" } }),
    db.weeklyGoal.findMany({ where: { userId: user.id }, orderBy: { weekStart: "desc" }, take: 8 }),
    db.topicProgress.count({ where: { userId: user.id, nextReviewAt: { lt: new Date() } } }),
    db.flashcardState.count({ where: { userId: user.id, suspended: false, dueAt: { lt: new Date() } } }),
    db.studyTask.count({ where: { userId: user.id, status: "CONCLUIDA" } }),
    db.studyTask.count({ where: { userId: user.id, status: "PENDENTE", date: { lt: new Date() } } }),
    db.achievement.findMany({ where: { userId: user.id } }),
  ]);
  const goalRows = await Promise.all(
    goals.map(async (g) => {
      const { start } = localDayBounds(g.weekStart.toISOString().slice(0, 10));
      const end = new Date(start.getTime() + 7 * 86400000);
      const [min, q] = await Promise.all([
        db.studySession.findMany({ where: { userId: user.id, startedAt: { gte: start, lt: end } }, select: { startedAt: true, endedAt: true } }).then((s) => mergedMinutes(s.map((x) => ({ start: x.startedAt, end: x.endedAt })))),
        db.answer.count({ where: { userId: user.id, createdAt: { gte: start, lt: end } } }),
      ]);
      return { g, min, q, ok: min >= g.targetMinutes && q >= g.targetQuestions };
    }),
  );

  // recomendações baseadas em dados reais
  const recs: string[] = [];
  const weakDisc = ed.perDiscipline.filter((d) => d.answered >= 10 && d.correct / d.answered < 0.6).sort((a, b) => a.correct / a.answered - b.correct / b.answered);
  weakDisc.slice(0, 2).forEach((d) => recs.push(`Taxa de acerto de ${Math.round((d.correct / d.answered) * 100)}% em ${d.name}: priorize revisão teórica e baterias de questões. Use "Regenerar com meu desempenho" no Planejador para aumentar o peso dessa disciplina.`));
  if (topErr[0]) recs.push(`O assunto com mais erros é "${topErr[0][1].title}" (${topErr[0][1].n} erros). Refaça o caderno de erros dele.`);
  if (gRate !== null && eRate !== null && eRate < gRate) recs.push(`Específicos (${eRate}%) abaixo dos Gerais (${gRate}%): como específicos têm peso 2, cada ponto ali vale o dobro.`);
  if (overdueCards + overdueTopics > 20) recs.push(`${overdueCards + overdueTopics} revisões atrasadas: dedique o próximo bloco só a revisões.`);
  if (!sims.length) recs.push("Você ainda não fez simulados nesta especialidade: um simulado rápido ajuda a calibrar o ritmo de prova.");
  const notStarted = ed.perDiscipline.filter((d) => d.percent === 0);
  if (notStarted.length) recs.push(`Disciplinas sem progresso: ${notStarted.map((d) => d.name).join(", ")}.`);

  const heat = Array.from({ length: 119 }, (_, i) => localDateKey(addDays(new Date(), i - 118)));

  return (
    <div>
      <PageHeader
        title="Desempenho"
        description="Todos os números vêm da sua atividade registrada (sessões, respostas, revisões, simulados). Nenhum dado é estimado."
        actions={
          <>
            <ButtonLink href="/api/export?tipo=desempenho" variant="secondary"><Download className="size-4" /> CSV por disciplina</ButtonLink>
            <ButtonLink href="/api/export?tipo=sessoes" variant="secondary"><Download className="size-4" /> CSV de sessões</ButtonLink>
            <PrintButton />
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[{ k: "DEV", ed: edDev, qt: qtDev, label: "006 · Desenvolvimento de Sistemas" }, { k: "SUP", ed: edSup, qt: qtSup, label: "007 · Suporte Técnico" }].map((x) => (
          <Card key={x.k} className={cn("p-5", active === x.k && "border-accent/60")}>
            <div className="flex items-center justify-between"><span className="font-semibold">{x.label}</span>{active === x.k && <Badge tone="accent">exibida</Badge>}</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div><div className="text-xs text-muted">Edital</div><div className="font-display text-2xl">{x.ed.overall}%</div></div>
              <div><div className="text-xs text-muted">Questões</div><div className="font-display text-2xl">{x.qt.answered}</div></div>
              <div><div className="text-xs text-muted">Acertos</div><div className="font-display text-2xl">{x.qt.answered ? `${x.qt.rate}%` : "—"}</div></div>
            </div>
            <Progress value={x.ed.overall} className="mt-3" />
            <p className="mt-2 text-[11px] text-muted">Inclui as matérias gerais (compartilhadas) + específicas da especialidade.</p>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
        <StatCard label="Sequência" value={`${streakFrom(keys)} d`} />
        <StatCard label="Dias ativos (120d)" value={heat.filter((k) => keys.has(k)).length} />
        <StatCard label="Gerais" value={gRate === null ? "—" : `${gRate}%`} hint="acertos (peso 1)" />
        <StatCard label="Específicos" value={eRate === null ? "—" : `${eRate}%`} hint="acertos (peso 2)" />
        <StatCard label="Revisões atrasadas" value={overdueCards + overdueTopics} hint={`${overdueCards} cartões · ${overdueTopics} assuntos`} tone="amber" />
        <StatCard label="Tarefas" value={`${tasksDone}`} hint={`${tasksPending} atrasadas`} />
      </div>

      <Card className="mb-6 border-teal/30">
        <CardHeader title="Recomendações" subtitle="Geradas a partir dos seus dados" icon={<Lightbulb className="size-4" />} />
        <CardBody>{recs.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{recs.map((r) => <li key={r}>{r}</li>)}</ul> : <p className="text-sm text-muted">Sem recomendações por enquanto — continue registrando atividade.</p>}</CardBody>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Evolução semanal (12 semanas)" />
          <CardBody>{weekly.some((w) => w.horas || w.questoes) ? <TrendChart data={weekly} lines={[{ key: "horas", name: "Horas", color: "var(--accent)" }, { key: "questoes", name: "Questões", color: "var(--teal)" }, { key: "acertos", name: "% acertos", color: "var(--amber)" }]} /> : <EmptyState title="Sem dados ainda" />}</CardBody>
        </Card>
        <Card>
          <CardHeader title="Taxa de acerto por disciplina" />
          <CardBody>{accByDisc.length >= 3 ? <SkillRadar data={accByDisc} /> : accByDisc.length ? <SimpleBars data={accByDisc} dataKey="taxa" nameKey="name" unit="%" /> : <EmptyState title="Responda questões para ver" />}</CardBody>
        </Card>
        <Card>
          <CardHeader title="Tempo dedicado por disciplina" subtitle="Sessões com disciplina identificada" />
          <CardBody>{timeByDisc.some((t) => t.minutos) ? <SimpleBars data={timeByDisc} dataKey="minutos" nameKey="name" unit=" min" color="var(--teal)" height={Math.max(220, timeByDisc.length * 30)} /> : <EmptyState title="Sem sessões por disciplina ainda" />}</CardBody>
        </Card>
        <Card>
          <CardHeader title="Assuntos com mais erros" />
          <CardBody>
            {topErr.length ? (
              <ol className="space-y-2 text-sm">
                {topErr.map(([id, t], i) => (
                  <li key={id} className="flex items-center gap-2"><span className="w-5 text-muted">{i + 1}.</span><Link href={`/assuntos/${id}`} className="flex-1 truncate hover:text-accent">{t.title}</Link><Badge tone="danger">{t.n}</Badge></li>
                ))}
              </ol>
            ) : <EmptyState title="Nenhum erro registrado" />}
          </CardBody>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Simulados" />
          <CardBody>{sims.length ? <TrendChart data={sims.map((s, i) => ({ label: `#${i + 1}`, nota: s.objectiveScore, gerais: s.scoreGerais, especificos: s.scoreEspec }))} lines={[{ key: "nota", name: "Nota", color: "var(--accent)" }, { key: "gerais", name: "Gerais", color: "var(--teal)" }, { key: "especificos", name: "Específicos", color: "var(--amber)" }]} /> : <EmptyState title="Nenhum simulado finalizado" />}</CardBody>
        </Card>
        <Card>
          <CardHeader title="Metas semanais" subtitle="Cumpridas × pendentes" />
          <CardBody>
            {goalRows.length ? (
              <ul className="space-y-2 text-sm">
                {goalRows.map(({ g, min, q, ok }) => (
                  <li key={g.id} className="flex flex-wrap items-center gap-2">
                    <span className="w-28 text-muted">Semana {formatDate(g.weekStart.toISOString(), { day: "2-digit", month: "2-digit", timeZone: "UTC" })}</span>
                    <span>{formatMinutes(min)}/{formatMinutes(g.targetMinutes)} · {q}/{g.targetQuestions} questões</span>
                    <Badge tone={ok ? "success" : "amber"} className="ml-auto">{ok ? "cumprida" : "pendente"}</Badge>
                  </li>
                ))}
              </ul>
            ) : <EmptyState title="Defina metas no Planejador" />}
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader title="Histórico de consistência (últimos 120 dias)" />
        <CardBody>
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto" style={{ gridAutoColumns: "14px" }}>
            {heat.map((k) => <div key={k} title={k} className={cn("size-3.5 rounded-[3px]", keys.has(k) ? "bg-accent" : "bg-surface-2")} />)}
          </div>
        </CardBody>
      </Card>

      <Card id="conquistas">
        <CardHeader title="Conquistas" subtitle="Gamificação leve — o foco continua sendo o plano" icon={<Trophy className="size-4" />} />
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(ACHIEVEMENTS).map(([code, a]) => {
            const got = ach.find((x) => x.code === code);
            return (
              <div key={code} className={cn("rounded-xl border p-3", got ? "border-amber/40 bg-amber-soft" : "border-border opacity-50")}>
                <div className="font-medium">{got ? "🏆" : "🔒"} {a.title}</div>
                <div className="text-xs text-muted">{a.description}{got && ` · ${formatDate(got.unlockedAt)}`}</div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}
