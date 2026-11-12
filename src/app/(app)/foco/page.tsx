import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines, getPrefs, scopeOf } from "@/lib/data";
import { minutesToday } from "@/lib/stats";
import { Pomodoro } from "@/components/pomodoro";
import { Card, CardBody, CardHeader, PageHeader } from "@/components/ui";
import { formatDate, formatMinutes } from "@/lib/utils";

export const metadata = { title: "Modo foco" };

export default async function FocoPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { prepared, active } = scopeOf(prefs);
  const [disciplines, today, recent] = await Promise.all([
    getDisciplines([...new Set([...prepared, active])]),
    minutesToday(user.id),
    db.studySession.findMany({ where: { userId: user.id }, orderBy: { startedAt: "desc" }, take: 10, include: { discipline: { select: { name: true } } } }),
  ]);
  return (
    <div>
      <PageHeader title="Modo foco" description={`Pomodoro com registro automático do tempo. Hoje: ${formatMinutes(today)} de ${formatMinutes(prefs.dailyMinutes)}.`} />
      <Pomodoro focusMin={prefs.pomodoroFocus} breakMin={prefs.pomodoroBreak} disciplines={disciplines.map((d) => ({ id: d.id, name: d.name }))} />
      <Card className="mx-auto mt-6 max-w-xl">
        <CardHeader title="Últimas sessões registradas" />
        <CardBody>
          {recent.length ? (
            <ul className="space-y-1 text-sm">
              {recent.map((s) => (
                <li key={s.id} className="flex justify-between gap-2">
                  <span className="truncate">{s.type.toLowerCase()} · {s.discipline?.name ?? "sem disciplina"}</span>
                  <span className="shrink-0 text-muted">{formatDate(s.startedAt, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · {formatMinutes(s.durationSec / 60)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted">Nenhuma sessão ainda.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
