import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getExam } from "@/lib/data";
import { TaskRow } from "@/components/task-row";
import { Card, CardBody, EmptyState, PageHeader } from "@/components/ui";
import { addDays, cn, dayFromKey, formatMinutes, localDateKey, startOfWeek } from "@/lib/utils";

export const metadata = { title: "Agenda" };

const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ vista?: string; data?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const exam = await getExam();
  const view = sp.vista === "dia" || sp.vista === "mes" ? sp.vista : "semana";
  const ref = sp.data && /^\d{4}-\d{2}-\d{2}$/.test(sp.data) ? dayFromKey(sp.data) : dayFromKey(localDateKey());
  const refKey = ref.toISOString().slice(0, 10);
  const examKey = localDateKey(exam.examDate);
  const todayKey = localDateKey();

  let from: Date, to: Date, prev: string, next: string, title: string;
  if (view === "dia") {
    from = ref;
    to = addDays(ref, 1);
    prev = addDays(ref, -1).toISOString().slice(0, 10);
    next = addDays(ref, 1).toISOString().slice(0, 10);
    title = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: "UTC" }).format(ref);
  } else if (view === "semana") {
    from = startOfWeek(ref);
    to = addDays(from, 7);
    prev = addDays(from, -7).toISOString().slice(0, 10);
    next = addDays(from, 7).toISOString().slice(0, 10);
    title = `Semana de ${from.toISOString().slice(8, 10)}/${from.toISOString().slice(5, 7)}`;
  } else {
    from = dayFromKey(`${refKey.slice(0, 7)}-01`);
    const y = from.getUTCFullYear(), m = from.getUTCMonth();
    to = new Date(Date.UTC(y, m + 1, 1, 12));
    prev = new Date(Date.UTC(y, m - 1, 1, 12)).toISOString().slice(0, 10);
    next = to.toISOString().slice(0, 10);
    title = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(from);
  }
  const tasks = await db.studyTask.findMany({ where: { userId: user.id, date: { gte: from, lt: to } }, orderBy: [{ date: "asc" }, { order: "asc" }], include: { discipline: { select: { color: true } } } });
  const byDay = new Map<string, typeof tasks>();
  for (const t of tasks) {
    const k = t.date.toISOString().slice(0, 10);
    byDay.set(k, [...(byDay.get(k) ?? []), t]);
  }

  return (
    <div>
      <PageHeader title="Agenda" description="Visualização diária, semanal e mensal das tarefas do seu plano." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl bg-surface-2 p-1 text-sm">
          {[["dia", "Dia"], ["semana", "Semana"], ["mes", "Mês"]].map(([k, l]) => (
            <Link key={k} href={`/agenda?vista=${k}&data=${refKey}`} className={cn("rounded-lg px-3 py-1.5", view === k && "bg-surface font-semibold shadow-sm")}>{l}</Link>
          ))}
        </div>
        <Link href={`/agenda?vista=${view}&data=${prev}`} className="grid grid-cols-1 size-9 place-items-center rounded-xl hover:bg-surface-2" aria-label="Anterior"><ChevronLeft className="size-4" /></Link>
        <Link href={`/agenda?vista=${view}`} className="rounded-xl px-3 py-2 text-sm hover:bg-surface-2">Hoje</Link>
        <Link href={`/agenda?vista=${view}&data=${next}`} className="grid grid-cols-1 size-9 place-items-center rounded-xl hover:bg-surface-2" aria-label="Próximo"><ChevronRight className="size-4" /></Link>
        <h2 className="ml-2 font-display text-xl font-semibold capitalize">{title}</h2>
      </div>

      {view === "mes" ? (
        <Card className="p-3">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (from.getUTCDay() + 6) % 7 }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: Math.round((to.getTime() - from.getTime()) / 86400000) }, (_, i) => {
              const d = addDays(from, i);
              const k = d.toISOString().slice(0, 10);
              const list = byDay.get(k) ?? [];
              const done = list.filter((t) => t.status === "CONCLUIDA").length;
              const min = list.reduce((a, t) => a + t.plannedMinutes, 0);
              return (
                <Link key={k} href={`/agenda?vista=dia&data=${k}`} className={cn("min-h-[84px] rounded-xl border border-border p-1.5 text-left text-xs transition hover:border-accent", k === todayKey && "ring-2 ring-accent", k === examKey && "bg-amber-soft")}>
                  <div className="font-semibold">{d.getUTCDate()}</div>
                  {k === examKey && <div className="text-[10px] font-bold text-amber">PROVA</div>}
                  {list.length > 0 && <div className="mt-1 text-[10px] text-muted">{list.length} tarefas · {formatMinutes(min)}</div>}
                  {list.length > 0 && <div className="mt-1 h-1 overflow-hidden rounded bg-surface-2"><div className="h-full bg-success" style={{ width: `${(done / list.length) * 100}%` }} /></div>}
                </Link>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: view === "dia" ? 1 : 7 }, (_, i) => {
            const d = addDays(from, i);
            const k = d.toISOString().slice(0, 10);
            const list = byDay.get(k) ?? [];
            return (
              <Card key={k}>
                <CardBody>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className={cn("font-semibold", k === todayKey && "text-accent")}>{WD[d.getUTCDay()]}, {k.slice(8, 10)}/{k.slice(5, 7)}</span>
                    {k === examKey && <span className="rounded bg-amber px-2 text-xs font-bold text-black">DIA DA PROVA</span>}
                    <span className="text-xs text-muted">{list.length ? `${list.length} tarefas · ${formatMinutes(list.reduce((a, t) => a + t.plannedMinutes, 0))}` : ""}</span>
                  </div>
                  {list.length ? <ul className="space-y-1">{list.map((t) => <TaskRow key={t.id} task={t} color={t.discipline?.color} />)}</ul> : <EmptyState title="Sem tarefas" />}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
