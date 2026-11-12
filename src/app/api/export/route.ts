import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, mergedMinutes, scopeOf } from "@/lib/data";
import { editalProgress } from "@/lib/stats";

function csv(rows: (string | number | boolean | null | undefined)[][]) {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    // proteção contra injeção de fórmulas em planilhas
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return /[";\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return "﻿" + rows.map((r) => r.map(esc).join(";")).join("\n");
}

function file(body: string, name: string, type: string) {
  return new NextResponse(body, { headers: { "content-type": type, "content-disposition": `attachment; filename="${name}"`, "cache-control": "no-store" } });
}

/** Exportação dos dados de estudo do próprio usuário (CSV/JSON). Nunca exporta dados de outros usuários. */
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  const tipo = new URL(req.url).searchParams.get("tipo");
  const stamp = new Date().toISOString().slice(0, 10);

  switch (tipo) {
    case "respostas": {
      const a = await db.answer.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" }, include: { question: { select: { code: true, topic: { select: { title: true, module: { select: { discipline: { select: { name: true } } } } } } } } } });
      return file(csv([["data", "questao", "disciplina", "assunto", "modo", "resposta", "correta", "tempo_s"], ...a.map((x) => [x.createdAt.toISOString(), x.question.code, x.question.topic.module.discipline.name, x.question.topic.title, x.mode, x.selectedLetter, x.isCorrect ? "sim" : "nao", x.timeSpentSec])]), `respostas-${stamp}.csv`, "text/csv; charset=utf-8");
    }
    case "sessoes": {
      const s = await db.studySession.findMany({ where: { userId: user.id }, orderBy: { startedAt: "asc" }, include: { discipline: { select: { name: true } } } });
      return file(csv([["inicio", "fim", "minutos", "tipo", "disciplina", "observacao"], ...s.map((x) => [x.startedAt.toISOString(), x.endedAt.toISOString(), Math.round(x.durationSec / 60), x.type, x.discipline?.name ?? "", x.notes])]), `sessoes-${stamp}.csv`, "text/csv; charset=utf-8");
    }
    case "tarefas": {
      const t = await db.studyTask.findMany({ where: { userId: user.id }, orderBy: { date: "asc" }, include: { discipline: { select: { name: true } } } });
      return file(csv([["data", "tipo", "titulo", "disciplina", "planejado_min", "executado_min", "status"], ...t.map((x) => [x.date.toISOString().slice(0, 10), x.type, x.title, x.discipline?.name ?? "", x.plannedMinutes, x.actualMinutes, x.status])]), `tarefas-${stamp}.csv`, "text/csv; charset=utf-8");
    }
    case "desempenho": {
      const prefs = await getPrefs(user.id);
      const { active } = scopeOf(prefs);
      const ed = await editalProgress(user.id, [active]);
      const sessions = await db.studySession.findMany({ where: { userId: user.id }, select: { startedAt: true, endedAt: true, disciplineId: true } });
      return file(
        csv([["disciplina", "tipo", "assuntos", "percentual_estudado", "respostas", "acertos", "taxa_acerto", "minutos"], ...ed.perDiscipline.map((d) => [d.name, d.kind, d.topics, d.percent, d.answered, d.correct, d.answered ? Math.round((d.correct / d.answered) * 100) : "", mergedMinutes(sessions.filter((s) => s.disciplineId === d.id).map((s) => ({ start: s.startedAt, end: s.endedAt })))])]),
        `desempenho-${active}-${stamp}.csv`,
        "text/csv; charset=utf-8",
      );
    }
    case "anotacoes": {
      const n = await db.note.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, include: { discipline: { select: { name: true } } } });
      const h = await db.highlight.findMany({ where: { userId: user.id }, include: { lesson: { select: { title: true } } } });
      const md = `# Caderno digital — exportado em ${stamp}\n\n${n.map((x) => `## ${x.title}\n_${x.discipline?.name ?? "Geral"} · ${x.updatedAt.toISOString().slice(0, 10)}_\n\n${x.content}\n`).join("\n")}\n# Destaques das aulas\n\n${h.map((x) => `- **${x.lesson.title}:** “${x.text}”${x.note ? ` — ${x.note}` : ""}`).join("\n")}\n`;
      return file(md, `caderno-${stamp}.md`, "text/markdown; charset=utf-8");
    }
    case "backup": {
      const data = await db.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          email: true,
          createdAt: true,
          preferences: true,
          topicProgress: true,
          subtopicChecks: true,
          lessonProgress: true,
          highlights: true,
          notes: true,
          answers: true,
          questionStates: true,
          simulados: { include: { items: true } },
          essays: true,
          flashcards: true,
          flashcardStates: true,
          reviewLogs: true,
          plans: true,
          tasks: true,
          sessionsStudy: true,
          goals: true,
          achievements: true,
          labAttempts: true,
        },
      });
      return file(JSON.stringify({ formato: "rumo-trf3-backup", versao: 1, exportadoEm: new Date().toISOString(), dados: data }, null, 2), `backup-estudos-${stamp}.json`, "application/json; charset=utf-8");
    }
    default:
      return NextResponse.json({ error: "tipo inválido (use respostas, sessoes, tarefas, desempenho, anotacoes ou backup)" }, { status: 400 });
  }
}
