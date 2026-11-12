"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { moveTask } from "@/app/actions/study";
import { cn, formatMinutes, TASK_TYPE_LABEL } from "@/lib/utils";

type T = { id: string; title: string; type: string; plannedMinutes: number; status: string; color: string | null; href: string };
type Day = { key: string; label: string; isToday: boolean; isExam: boolean; tasks: T[] };

/** Quadro semanal com arrastar e soltar (HTML5 DnD) e alternativa acessível por seleção de data. */
export function PlannerBoard({ days }: { days: Day[] }) {
  const [state, setState] = useState(days);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  const move = (id: string, key: string) => {
    const from = state.find((d) => d.tasks.some((t) => t.id === id));
    if (!from || from.key === key) return;
    const task = from.tasks.find((t) => t.id === id)!;
    setState((s) => s.map((d) => (d.key === from.key ? { ...d, tasks: d.tasks.filter((t) => t.id !== id) } : d.key === key ? { ...d, tasks: [...d.tasks, task] } : d)));
    start(async () => {
      try {
        await moveTask(id, key);
      } catch {
        setError("Não foi possível reagendar. Recarregue a página.");
      }
    });
  };

  return (
    <div>
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {state.map((d) => {
          const total = d.tasks.reduce((a, t) => a + t.plannedMinutes, 0);
          return (
            <div
              key={d.key}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(d.key);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                if (dragId) move(dragId, d.key);
                setDragId(null);
              }}
              className={cn("min-h-[180px] rounded-2xl border bg-surface p-2.5 transition", over === d.key ? "border-accent bg-accent-soft/40" : "border-border", d.isToday && "ring-2 ring-accent/50")}
            >
              <div className="mb-2 flex items-baseline justify-between px-1">
                <span className={cn("text-xs font-semibold uppercase", d.isToday && "text-accent")}>{d.label}</span>
                <span className="text-[10px] text-muted">{total ? formatMinutes(total) : ""}</span>
              </div>
              {d.isExam && <div className="mb-2 rounded-lg bg-amber px-2 py-1 text-center text-xs font-bold text-black">DIA DA PROVA</div>}
              <ul className="space-y-1.5">
                {d.tasks.map((t) => (
                  <li
                    key={t.id}
                    draggable={t.status !== "CONCLUIDA"}
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => setDragId(null)}
                    className={cn("group rounded-xl border border-border bg-surface-2/60 p-2 text-xs", t.status === "CONCLUIDA" ? "opacity-50" : "cursor-grab active:cursor-grabbing", t.status === "PULADA" && "line-through opacity-40")}
                    style={{ borderLeft: `3px solid ${t.color ?? "var(--border)"}` }}
                  >
                    <div className="flex items-start gap-1">
                      <GripVertical className="mt-0.5 size-3 shrink-0 text-muted opacity-0 group-hover:opacity-100" />
                      <Link href={t.href} className="line-clamp-3 font-medium hover:text-accent">{t.title}</Link>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
                      <span>{TASK_TYPE_LABEL[t.type]} · {formatMinutes(t.plannedMinutes)}</span>
                      {t.status !== "CONCLUIDA" && (
                        <select
                          aria-label={`Mover "${t.title}" para outro dia`}
                          value=""
                          onChange={(e) => e.target.value && move(t.id, e.target.value)}
                          className="max-w-[60px] rounded bg-transparent text-[10px] opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <option value="">mover</option>
                          {state.filter((x) => x.key !== d.key).map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
                        </select>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">Arraste as tarefas entre os dias para reagendar (ou use o seletor &quot;mover&quot;, acessível por teclado).</p>
    </div>
  );
}
