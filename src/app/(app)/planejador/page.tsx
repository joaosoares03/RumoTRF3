import Link from "next/link";
import { RefreshCw, CalendarClock, ChevronLeft, ChevronRight, Plus, Target } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines, getExam, getPrefs, localDayBounds, mergedMinutes, scopeOf } from "@/lib/data";
import { regeneratePlanAction, replanOverdueAction } from "@/app/actions/prefs";
import { addManualTask, saveWeeklyGoal } from "@/app/actions/study";
import { PlannerBoard } from "@/components/planner-board";
import { taskHref } from "@/components/task-row";
import { Badge, Button, Card, CardBody, CardHeader, Field, Notice, PageHeader, Progress, StatCard, inputClass } from "@/components/ui";
import { addDays, formatDate, formatMinutes, localDateKey, parseJson, SPECIALTY_LABEL, startOfWeek, TASK_TYPE_LABEL, today } from "@/lib/utils";

export const metadata = { title: "Planejador" };

const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function PlanejadorPage({ searchParams }: { searchParams: Promise<{ semana?: string; regerado?: string; replanejadas?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { prepared } = scopeOf(prefs);
  const exam = await getExam();
  const t = today();
  const offset = Number(sp.semana) || 0;
  const weekStart = addDays(startOfWeek(t), offset * 7);
  const weekEnd = addDays(weekStart, 7);
  const examKey = localDateKey(exam.examDate);

  const [plan, weekTasks, overdue, byType, disciplines, goal] = await Promise.all([
    db.studyPlan.findFirst({ where: { userId: user.id, active: true }, orderBy: { generatedAt: "desc" } }),
    db.studyTask.findMany({ where: { userId: user.id, date: { gte: weekStart, lt: weekEnd } }, orderBy: [{ date: "asc" }, { order: "asc" }], include: { discipline: { select: { color: true } } } }),
    db.studyTask.count({ where: { userId: user.id, status: "PENDENTE", date: { lt: t } } }),
    db.studyTask.groupBy({ by: ["type", "status"], where: { userId: user.id }, _count: true, _sum: { plannedMinutes: true } }),
    getDisciplines(prepared),
    db.weeklyGoal.findUnique({ where: { userId_weekStart: { userId: user.id, weekStart } } }),
  ]);

  // planejado × executado na semana exibida
  const plannedMin = weekTasks.reduce((a, x) => a + x.plannedMinutes, 0);
  const doneTasks = weekTasks.filter((x) => x.status === "CONCLUIDA");
  const { start: wsUtc } = localDayBounds(weekStart.toISOString().slice(0, 10));
  const { start: weUtc } = localDayBounds(weekEnd.toISOString().slice(0, 10));
  const sessions = await db.studySession.findMany({ where: { userId: user.id, startedAt: { gte: wsUtc, lt: weUtc } }, select: { startedAt: true, endedAt: true } });
  const execMin = mergedMinutes(sessions.map((s) => ({ start: s.startedAt, end: s.endedAt })));
  const [weekAnswers, weekReviews] = await Promise.all([
    db.answer.count({ where: { userId: user.id, createdAt: { gte: wsUtc, lt: weUtc } } }),
    db.reviewLog.count({ where: { userId: user.id, reviewedAt: { gte: wsUtc, lt: weUtc } } }),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      label: `${WD[d.getUTCDay()]} ${key.slice(8, 10)}/${key.slice(5, 7)}`,
      isToday: key === t.toISOString().slice(0, 10),
      isExam: key === examKey,
      tasks: weekTasks
        .filter((x) => x.date.toISOString().slice(0, 10) === key)
        .map((x) => ({ id: x.id, title: x.title, type: x.type, plannedMinutes: x.plannedMinutes, status: x.status, color: x.discipline?.color ?? null, href: taskHref(x) })),
    };
  });

  const totals = new Map<string, { total: number; done: number; minutes: number }>();
  for (const g of byType) {
    const m = totals.get(g.type) ?? { total: 0, done: 0, minutes: 0 };
    m.total += g._count;
    m.minutes += g._sum.plannedMinutes ?? 0;
    if (g.status === "CONCLUIDA") m.done += g._count;
    totals.set(g.type, m);
  }
  const daysLeft = Math.round((new Date(`${examKey}T12:00:00Z`).getTime() - t.getTime()) / 86400000);
  const studyDays = parseJson<number[]>(prefs.studyDays, []);

  return (
    <div>
      <PageHeader
        title="Planejador inteligente"
        description={plan ? `Plano ${plan.mode === "CICLO" ? "por ciclos" : "com cronograma fixo"} · ${SPECIALTY_LABEL[prefs.specialtyMode]} · ${formatMinutes(prefs.dailyMinutes)}/dia em ${studyDays.map((d) => WD[d]).join(", ")} · gerado em ${formatDate(plan.generatedAt)} · até ${formatDate(exam.examDate)} (${daysLeft} dias)` : "Nenhum plano gerado ainda."}
        actions={
          <>
            <form action={replanOverdueAction}><Button variant="secondary" disabled={!overdue}><CalendarClock className="size-4" /> Replanejar atrasadas ({overdue})</Button></form>
            <form action={regeneratePlanAction}><Button><RefreshCw className="size-4" /> Regenerar com meu desempenho</Button></form>
          </>
        }
      />
      {sp.regerado && <Notice tone="success" className="mb-4">Plano regenerado a partir de hoje, considerando seus erros por disciplina, assuntos já estudados e dificuldades declaradas. Tarefas concluídas e manuais foram preservadas.</Notice>}
      {sp.replanejadas && <Notice tone="success" className="mb-4">{sp.replanejadas} tarefa(s) atrasada(s) redistribuídas nos próximos dias com folga.</Notice>}

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Planejado na semana" value={formatMinutes(plannedMin)} hint={`${weekTasks.length} tarefas`} />
        <StatCard label="Executado (tempo real)" value={formatMinutes(execMin)} hint={plannedMin ? `${Math.round((execMin / plannedMin) * 100)}% do planejado` : "—"} tone="accent" />
        <StatCard label="Tarefas concluídas" value={`${doneTasks.length}/${weekTasks.length}`} tone="teal" />
        <StatCard label="Atrasadas" value={overdue} tone="amber" />
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Semana"
          subtitle={`${formatDate(weekStart.toISOString(), { day: "2-digit", month: "2-digit", timeZone: "UTC" })} a ${formatDate(addDays(weekStart, 6).toISOString(), { day: "2-digit", month: "2-digit", timeZone: "UTC" })}${offset === 0 ? " (atual)" : ""}`}
          action={
            <div className="flex gap-1">
              <Link href={`/planejador?semana=${offset - 1}`} className="grid grid-cols-1 size-8 place-items-center rounded-lg hover:bg-surface-2" aria-label="Semana anterior"><ChevronLeft className="size-4" /></Link>
              <Link href="/planejador" className="rounded-lg px-2 py-1.5 text-xs hover:bg-surface-2">Hoje</Link>
              <Link href={`/planejador?semana=${offset + 1}`} className="grid grid-cols-1 size-8 place-items-center rounded-lg hover:bg-surface-2" aria-label="Próxima semana"><ChevronRight className="size-4" /></Link>
            </div>
          }
        />
        <CardBody>
          <PlannerBoard key={weekStart.toISOString()} days={days} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Metas da semana" icon={<Target className="size-4" />} />
          <CardBody className="space-y-4">
            {goal && (
              <div className="space-y-3 text-sm">
                {[
                  ["Tempo", execMin, goal.targetMinutes, formatMinutes],
                  ["Questões", weekAnswers, goal.targetQuestions, (n: number) => String(n)],
                  ["Revisões de flashcards", weekReviews, goal.targetReviews, (n: number) => String(n)],
                ].map(([label, cur, target, f]) => {
                  const c = cur as number, tg = target as number, fmt = f as (n: number) => string;
                  return tg > 0 ? (
                    <div key={label as string}>
                      <div className="mb-1 flex justify-between"><span>{label as string}</span><span className="text-muted">{fmt(c)} / {fmt(tg)} {c >= tg && "✔"}</span></div>
                      <Progress value={(c / tg) * 100} />
                    </div>
                  ) : null;
                })}
              </div>
            )}
            <form action={saveWeeklyGoal} className="grid grid-cols-3 gap-2">
              <input type="hidden" name="weekStart" value={weekStart.toISOString().slice(0, 10)} />
              <Field label="Minutos"><input name="targetMinutes" type="number" min={0} defaultValue={goal?.targetMinutes ?? prefs.dailyMinutes * studyDays.length} className={inputClass} /></Field>
              <Field label="Questões"><input name="targetQuestions" type="number" min={0} defaultValue={goal?.targetQuestions ?? 100} className={inputClass} /></Field>
              <Field label="Revisões"><input name="targetReviews" type="number" min={0} defaultValue={goal?.targetReviews ?? 100} className={inputClass} /></Field>
              <Button variant="secondary" className="col-span-3">Salvar metas</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Distribuição do plano até a prova" subtitle="Tarefas por tipo (concluídas / total)" />
          <CardBody className="space-y-3">
            {[...totals.entries()].sort((a, b) => b[1].minutes - a[1].minutes).map(([type, m]) => (
              <div key={type}>
                <div className="mb-1 flex justify-between text-sm"><span>{TASK_TYPE_LABEL[type]}</span><span className="text-muted">{m.done}/{m.total} · {formatMinutes(m.minutes)}</span></div>
                <Progress value={(m.done / m.total) * 100} />
              </div>
            ))}
            <p className="text-xs text-muted">Específicos têm peso 2 no plano (como na prova). A última semana antes de {formatDate(exam.examDate)} é a <Badge tone="amber">semana de revisão</Badge>: só questões, revisões, simulado e redação.</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Adicionar tarefa manual" icon={<Plus className="size-4" />} />
          <CardBody>
            <form action={addManualTask} className="space-y-3">
              <Field label="Título"><input name="title" required className={inputClass} placeholder="Ex.: Ler Res. CNJ 335/2020 na íntegra" /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Data"><input name="date" type="date" required defaultValue={localDateKey()} className={inputClass} /></Field>
                <Field label="Minutos"><input name="minutes" type="number" min={5} max={600} defaultValue={30} className={inputClass} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tipo">
                  <select name="type" className={inputClass}>{Object.entries(TASK_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                </Field>
                <Field label="Disciplina">
                  <select name="disciplineId" className={inputClass}><option value="">—</option>{disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                </Field>
              </div>
              <Button className="w-full">Adicionar</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
