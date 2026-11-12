import { cn } from "@/lib/utils";

/** Calendário mensal com dias de estudo reais (heatmap) e dias com tarefas planejadas. */
export function ActivityCalendar({ year, month, active, planned, todayKey, examKey }: { year: number; month: number; active: Set<string>; planned: Map<string, number>; todayKey: string; examKey: string }) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // semana começa na segunda
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const name = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  return (
    <div>
      <div className="mb-2 text-sm font-semibold capitalize">{name}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted">
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isActive = active.has(key);
          const p = planned.get(key) ?? 0;
          return (
            <div
              key={i}
              title={`${d}/${month + 1}${isActive ? " · estudou" : ""}${p ? ` · ${p} min planejados` : ""}${key === examKey ? " · PROVA" : ""}`}
              className={cn(
                "relative grid aspect-square place-items-center rounded-lg text-xs",
                isActive ? "bg-accent font-semibold text-white" : p ? "bg-surface-2" : "text-muted",
                key === todayKey && "ring-2 ring-accent ring-offset-1 ring-offset-[var(--surface)]",
                key === examKey && "bg-amber font-bold text-black",
              )}
            >
              {d}
              {!isActive && p > 0 && <span className="absolute bottom-1 size-1 rounded-full bg-accent" />}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded bg-accent" /> estudou
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded bg-surface-2" /> tarefas planejadas
        </span>
      </div>
    </div>
  );
}
