import Link from "next/link";
import { Check, BookOpen, CircleHelp, RotateCcw, PenLine, Timer, Layers, FlaskConical } from "lucide-react";
import { completeTask } from "@/app/actions/study";
import { cn, formatMinutes, TASK_TYPE_LABEL } from "@/lib/utils";

const ICON = { TEORIA: BookOpen, QUESTOES: CircleHelp, REVISAO: RotateCcw, REDACAO: PenLine, SIMULADO: Timer, FLASHCARDS: Layers, LABORATORIO: FlaskConical } as const;

export function taskHref(t: { type: string; topicId: string | null; disciplineId: string | null }) {
  switch (t.type) {
    case "TEORIA":
    case "REVISAO":
      return t.topicId ? `/assuntos/${t.topicId}` : "/disciplinas";
    case "QUESTOES":
      return t.topicId ? `/questoes/resolver?assunto=${t.topicId}` : t.disciplineId ? `/questoes/resolver?disciplina=${t.disciplineId}` : "/questoes";
    case "REDACAO":
      return "/redacao";
    case "SIMULADO":
      return "/simulados";
    case "FLASHCARDS":
      return "/flashcards/revisar";
    default:
      return "/laboratorio";
  }
}

export function TaskRow({
  task,
  color,
  showDate,
}: {
  task: { id: string; title: string; type: string; plannedMinutes: number; status: string; topicId: string | null; disciplineId: string | null; date: Date; rescheduled: number; actualMinutes: number };
  color?: string;
  showDate?: string;
}) {
  const Icon = ICON[task.type as keyof typeof ICON] ?? BookOpen;
  const done = task.status === "CONCLUIDA";
  return (
    <li className={cn("group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-border hover:bg-surface-2/60", done && "opacity-60")}>
      <form action={completeTask}>
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="minutes" value={done ? 0 : task.plannedMinutes} />
        <button
          className={cn("grid size-6 place-items-center rounded-lg border-2 transition", done ? "border-success bg-success text-white" : "border-border hover:border-accent")}
          aria-label={done ? `Desmarcar "${task.title}"` : `Concluir "${task.title}" e registrar ${task.plannedMinutes} minutos`}
          title={done ? "Desmarcar" : `Concluir e registrar ${formatMinutes(task.plannedMinutes)}`}
        >
          {done && <Check className="size-3.5" strokeWidth={3} />}
        </button>
      </form>
      <span className="grid grid-cols-1 size-8 shrink-0 place-items-center rounded-lg" style={{ background: color ? `${color}22` : "var(--surface-2)", color: color ?? "var(--muted)" }}>
        <Icon className="size-4" />
      </span>
      <Link href={taskHref(task)} className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", done && "line-through")}>{task.title}</div>
        <div className="text-xs text-muted">
          {TASK_TYPE_LABEL[task.type]} · {formatMinutes(task.plannedMinutes)}
          {showDate && ` · ${showDate}`}
          {task.rescheduled > 0 && " · reagendada"}
          {done && task.actualMinutes > 0 && ` · ${formatMinutes(task.actualMinutes)} registrados`}
        </div>
      </Link>
    </li>
  );
}
