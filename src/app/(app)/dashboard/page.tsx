import Link from "next/link";
import { CalendarClock, CircleHelp, Flame, Layers, Target, Timer, TrendingUp, Clock, Sparkles, Megaphone, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activeDayKeys, dueFlashcardsCount, getExam, getPrefs, scopeOf, streakFrom } from "@/lib/data";
import { dailySeries, editalProgress, minutesThisWeek, minutesToday, nextSuggestion, questionTotals, syncAchievements, syncNotifications } from "@/lib/stats";
import { Badge, ButtonLink, Card, CardBody, CardHeader, EmptyState, Notice, Progress, Ring, StatCard } from "@/components/ui";
import { DailyActivityChart } from "@/components/charts";
import { TaskRow } from "@/components/task-row";
import { ActivityCalendar } from "@/components/activity-calendar";
import { formatDate, formatMinutes, localDateKey, SPECIALTY_LABEL, today } from "@/lib/utils";

export const metadata = { title: "Painel" };

function greeting() {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(new Date()));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ bemvindo?: string }> }) {
  const { bemvindo } = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { prepared, active } = scopeOf(prefs);
  const exam = await getExam();
  const t = today();

  await syncNotifications(user.id);

  const [edital, qt, todayMin, week, series, cards, sims, keys, tasks, suggestion, updates, topicReviews, plannedMonth] = await Promise.all([
    editalProgress(user.id, [active]),
    questionTotals(user.id, [active]),
    minutesToday(user.id),
    minutesThisWeek(user.id),
    dailySeries(user.id, 14),
    dueFlashcardsCount(user.id, prepared),
    db.simulado.count({ where: { userId: user.id, status: "FINALIZADO", OR: [{ specialty: { key: active } }, { specialtyId: null }] } }),
    activeDayKeys(user.id),
    db.studyTask.findMany({ where: { userId: user.id, date: t }, orderBy: { order: "asc" }, include: { discipline: { select: { color: true } } } }),
    nextSuggestion(user.id, [active]),
    db.officialUpdate.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    db.topicProgress.count({ where: { userId: user.id, nextReviewAt: { lte: new Date() } } }),
    db.studyTask.groupBy({ by: ["date"], where: { userId: user.id }, _sum: { plannedMinutes: true } }),
  ]);
  const streak = streakFrom(keys);
  await syncAchievements(user.id, { answered: qt.answered, streak, editalPct: edital.overall });

  const examKey = localDateKey(exam.examDate);
  const daysLeft = Math.max(0, Math.round((new Date(`${examKey}T12:00:00Z`).getTime() - t.getTime()) / 86400000));
  const goalPct = Math.min(100, (todayMin / prefs.dailyMinutes) * 100);
  const overdue = await db.studyTask.count({ where: { userId: user.id, status: "PENDENTE", date: { lt: t } } });
  const todayDone = tasks.filter((x) => x.status === "CONCLUIDA").length;
  const plannedMap = new Map(plannedMonth.map((p) => [p.date.toISOString().slice(0, 10), p._sum.plannedMinutes ?? 0]));
  const now = new Date();
  const ym = { y: Number(localDateKey().slice(0, 4)), m: Number(localDateKey().slice(5, 7)) - 1 };
  const firstName = user.name.split(" ")[0];
  void now;

  return (
    <div className="space-y-6">
      {bemvindo && (
        <Notice tone="success">
          <strong>Plano gerado!</strong> Seu cronograma até a prova está no <Link href="/planejador" className="underline">Planejador</Link>. Os indicadores abaixo começam zerados e passam a refletir sua atividade real.
        </Notice>
      )}

      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted">
              {greeting()}, {firstName} 👋
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Faltam <span className="text-accent">{daysLeft} dias</span> para a prova
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge tone="accent">{active === "DEV" ? "006" : "007"} · {SPECIALTY_LABEL[active]}</Badge>
              <Badge>{formatDate(exam.examDate, { day: "2-digit", month: "long", year: "numeric" })} · Vunesp</Badge>
              {prefs.specialtyMode === "AMBAS" && <Badge tone="teal">Preparando as duas especialidades</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Ring value={goalPct} size={104} label={formatMinutes(todayMin)} sublabel={`meta ${formatMinutes(prefs.dailyMinutes)}`} />
            <Ring value={edital.overall} size={104} color="var(--teal)" sublabel="do edital" />
          </div>
        </div>
      </section>

      {/* Indicadores */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Hoje" value={formatMinutes(todayMin)} hint={`Semana: ${formatMinutes(week.minutes)}`} icon={<Clock className="size-4" />} tone="accent" />
        <StatCard label="Sequência" value={`${streak} ${streak === 1 ? "dia" : "dias"}`} hint="dias seguidos com estudo" icon={<Flame className="size-4" />} tone="amber" />
        <StatCard label="Questões" value={qt.answered} hint={`${active === "DEV" ? "006" : "007"} + gerais`} icon={<CircleHelp className="size-4" />} tone="teal" />
        <StatCard label="Acertos" value={qt.answered ? `${qt.rate.toLocaleString("pt-BR")}%` : "—"} hint={qt.answered ? `${qt.correct} de ${qt.answered}` : "responda questões para medir"} icon={<Target className="size-4" />} />
        <StatCard label="Revisões" value={cards.due + topicReviews} hint={`${cards.due} flashcards · ${topicReviews} assuntos`} icon={<Layers className="size-4" />} tone="accent" />
        <StatCard label="Simulados" value={sims} hint="finalizados" icon={<Timer className="size-4" />} />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Tarefas do dia */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Tarefas de hoje"
            subtitle={tasks.length ? `${todayDone} de ${tasks.length} concluídas` : "Nenhuma tarefa planejada para hoje"}
            icon={<CalendarClock className="size-4" />}
            action={<ButtonLink href="/planejador" variant="ghost" className="text-xs">Planejador <ArrowRight className="size-3.5" /></ButtonLink>}
          />
          <CardBody className="pt-3">
            {overdue > 0 && (
              <Notice tone="warning" className="mb-3">
                Você tem <strong>{overdue}</strong> tarefa(s) atrasada(s). <Link href="/planejador" className="font-medium underline">Replanejar</Link>
              </Notice>
            )}
            {tasks.length ? (
              <ul className="space-y-1">
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} color={task.discipline?.color} />
                ))}
              </ul>
            ) : (
              <EmptyState title="Dia livre no plano" description="Hoje não é um dos seus dias de estudo ou o plano ainda não foi gerado." action={<ButtonLink href="/planejador" variant="secondary">Abrir planejador</ButtonLink>} />
            )}
          </CardBody>
        </Card>

        {/* Sugestão */}
        <Card className="flex flex-col">
          <CardHeader title="Próximo passo sugerido" subtitle="Calculado com base no plano e no seu desempenho" icon={<Sparkles className="size-4" />} />
          <CardBody className="flex flex-1 flex-col pt-3">
            {suggestion ? (
              <>
                <Badge tone="teal" className="self-start">{suggestion.reason}</Badge>
                <div className="mt-3 text-xs font-medium uppercase tracking-wide" style={{ color: suggestion.discipline.color }}>
                  {suggestion.discipline.name}
                </div>
                <div className="mt-1 font-semibold leading-snug">{suggestion.topic.title}</div>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {suggestion.lessonSlug && <ButtonLink href={`/aulas/${suggestion.lessonSlug}`}>Abrir aula</ButtonLink>}
                  <ButtonLink href={`/assuntos/${suggestion.topic.id}`} variant="secondary">Materiais</ButtonLink>
                  <ButtonLink href={`/questoes/resolver?assunto=${suggestion.topic.id}`} variant="outline">Questões</ButtonLink>
                </div>
              </>
            ) : (
              <EmptyState title="Tudo em dia!" description="Sem pendências no momento. Que tal um simulado?" action={<ButtonLink href="/simulados">Simulados</ButtonLink>} />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Evolução dos últimos 14 dias" subtitle="Minutos estudados, questões respondidas e taxa de acerto (dados reais)" icon={<TrendingUp className="size-4" />} />
          <CardBody>
            {series.some((s) => s.minutos || s.questoes) ? (
              <DailyActivityChart data={series} />
            ) : (
              <EmptyState title="Sem atividade registrada ainda" description="Conclua tarefas, use o modo foco, leia aulas ou responda questões — o gráfico se preenche automaticamente." />
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Calendário de estudos" subtitle={`Prova em ${formatDate(exam.examDate)}`} icon={<CalendarClock className="size-4" />} />
          <CardBody>
            <ActivityCalendar year={ym.y} month={ym.m} active={keys} planned={plannedMap} todayKey={localDateKey()} examKey={examKey} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Progresso por disciplina"
            subtitle={`Edital ${active === "DEV" ? "006" : "007"}: ${edital.overall}% estudado — gerais compartilhadas + específicas da especialidade`}
            icon={<Target className="size-4" />}
            action={<ButtonLink href="/edital" variant="ghost" className="text-xs">Edital verticalizado <ArrowRight className="size-3.5" /></ButtonLink>}
          />
          <CardBody className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {edital.perDiscipline.map((d) => (
              <Link key={d.id} href={`/disciplinas/${d.slug}`} className="group block">
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: d.color }} />
                    <span className="truncate group-hover:text-accent">{d.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {d.percent}%{d.answered ? ` · ${Math.round((d.correct / d.answered) * 100)}% ac.` : ""}
                  </span>
                </div>
                <Progress value={d.percent} color={d.color} />
                <div className="mt-1 text-[11px] text-muted">
                  {d.kind === "GERAL" ? "Conhecimentos gerais · peso 1" : "Conhecimentos específicos · peso 2"} · {d.topics} assuntos
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Atualizações oficiais" subtitle="Editais e retificações cadastrados" icon={<Megaphone className="size-4" />} />
          <CardBody className="space-y-3 pt-3">
            {updates.map((u) => (
              <a key={u.id} href={u.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border p-3 transition hover:border-accent">
                <div className="text-xs text-muted">{formatDate(u.publishedAt)}</div>
                <div className="mt-0.5 text-sm font-medium">{u.title}</div>
                <div className="mt-1 text-xs text-muted">{u.summary}</div>
              </a>
            ))}
            <ButtonLink href="/concurso" variant="secondary" className="w-full">
              Central do concurso
            </ButtonLink>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
