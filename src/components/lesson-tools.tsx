"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Highlighter, Star, Trash2, Download } from "lucide-react";
import { addHighlight, completeLesson, deleteHighlight, recordReading, toggleLessonFavorite } from "@/app/actions/study";
import { Button, Card } from "./ui";
import { cn } from "@/lib/utils";

type HL = { id: string; text: string; note: string };

/** Ferramentas do leitor: tempo de leitura, conclusão, favorito, destaques e exportação das anotações. */
export function LessonTools({ lessonId, title, completed, favorite, highlights }: { lessonId: string; title: string; completed: boolean; favorite: boolean; highlights: HL[] }) {
  const [done, setDone] = useState(completed);
  const [fav, setFav] = useState(favorite);
  const [hls, setHls] = useState(highlights);
  const [sel, setSel] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const startRef = useRef(Date.now());
  const activeMs = useRef(0);
  const lastTick = useRef(Date.now());

  // conta apenas o tempo com a aba visível
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") activeMs.current += now - lastTick.current;
      lastTick.current = now;
    };
    const iv = setInterval(tick, 5000);
    const onVis = () => tick();
    document.addEventListener("visibilitychange", onVis);
    const onSel = () => {
      const s = window.getSelection()?.toString().trim() ?? "";
      if (s.length >= 3 && document.querySelector("#lesson-body")?.contains(window.getSelection()?.anchorNode ?? null)) setSel(s.slice(0, 2000));
    };
    document.addEventListener("selectionchange", onSel);
    const flush = () => {
      tick();
      const secs = Math.round(activeMs.current / 1000);
      if (secs >= 60) {
        activeMs.current = 0;
        void recordReading(lessonId, secs);
      }
    };
    window.addEventListener("pagehide", flush);
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [lessonId]);
  void startRef;

  const finish = () =>
    start(async () => {
      const secs = Math.round(activeMs.current / 1000);
      activeMs.current = 0;
      const r = await completeLesson(lessonId, secs);
      setDone(r.completed);
      setMsg(r.completed ? "Aula concluída! O assunto entrou no ciclo de revisões (1, 7, 15 e 30 dias)." : "Marcação de conclusão removida.");
    });

  const exportNotes = () => {
    const md = `# Destaques — ${title}\n\n${hls.map((h) => `> ${h.text}\n${h.note ? `\n${h.note}\n` : ""}`).join("\n")}`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `destaques-${title.slice(0, 40).replace(/[^\w]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2">
          <Button onClick={finish} disabled={pending} variant={done ? "secondary" : "primary"} className="flex-1">
            <CheckCircle2 className="size-4" /> {done ? "Concluída" : "Marcar como concluída"}
          </Button>
          <Button variant="outline" onClick={() => start(async () => setFav(await toggleLessonFavorite(lessonId)))} aria-pressed={fav} aria-label="Favoritar aula" title="Favoritar">
            <Star className={cn("size-4", fav && "text-amber")} fill={fav ? "currentColor" : "none"} />
          </Button>
        </div>
        {msg && <p className="mt-2 text-xs text-success">{msg}</p>}
        <p className="mt-2 text-[11px] text-muted">O tempo de leitura com a aba visível é registrado automaticamente no seu histórico.</p>
      </Card>

      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Highlighter className="size-4 text-amber" /> Destaques e anotações
        </div>
        {sel ? (
          <div className="space-y-2">
            <blockquote className="max-h-24 overflow-auto rounded-lg bg-amber-soft p-2 text-xs">{sel}</blockquote>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anotação sobre o trecho (opcional)" className="w-full rounded-lg border border-border bg-surface p-2 text-xs" />
            <div className="flex gap-2">
              <Button
                className="flex-1 text-xs"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const h = await addHighlight(lessonId, sel, note);
                    setHls([h, ...hls]);
                    setSel("");
                    setNote("");
                    window.getSelection()?.removeAllRanges();
                  })
                }
              >
                Salvar destaque
              </Button>
              <Button variant="ghost" className="text-xs" onClick={() => setSel("")}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted">Selecione um trecho da aula para destacá-lo e anotar.</p>
        )}
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {hls.map((h) => (
            <li key={h.id} className="group rounded-lg border border-border p-2 text-xs">
              <mark className="hl">{h.text}</mark>
              {h.note && <p className="mt-1 text-muted">{h.note}</p>}
              <button onClick={() => start(async () => { await deleteHighlight(h.id); setHls(hls.filter((x) => x.id !== h.id)); })} className="mt-1 hidden items-center gap-1 text-danger group-hover:flex" aria-label="Excluir destaque">
                <Trash2 className="size-3" /> excluir
              </button>
            </li>
          ))}
        </ul>
        {hls.length > 0 && (
          <Button variant="ghost" className="mt-2 w-full text-xs" onClick={exportNotes}>
            <Download className="size-3.5" /> Exportar destaques (.md)
          </Button>
        )}
      </Card>
    </div>
  );
}
