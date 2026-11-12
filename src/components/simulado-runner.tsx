"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Flag, ChevronLeft, ChevronRight, Send, PenLine, ListChecks, Timer, Save } from "lucide-react";
import { finalizeSimulado, saveSimuladoEssay, saveSimuladoItem, saveSimuladoProgress } from "@/app/actions/simulados";
import { Badge, Button, Card, Notice } from "./ui";
import { cn } from "@/lib/utils";

type Item = { id: string; section: string; selectedLetter: string | null; flagged: boolean; statement: string; alternatives: { letter: string; text: string }[]; discipline: string };

export function SimuladoRunner({
  simuladoId,
  title,
  items: initial,
  timeLimitSec,
  elapsedSec,
  currentIndex,
  essay,
}: {
  simuladoId: string;
  title: string;
  items: Item[];
  timeLimitSec: number;
  elapsedSec: number;
  currentIndex: number;
  essay: { title: string; content: string; prompt: { title: string; thematicPhrase: string; motivatingTexts: string; instructions: string } | null } | null;
}) {
  const [items, setItems] = useState(initial);
  const [idx, setIdx] = useState(Math.min(currentIndex, initial.length - 1));
  const [tab, setTab] = useState<"questoes" | "redacao">("questoes");
  const [elapsed, setElapsed] = useState(elapsedSec);
  const [confirm, setConfirm] = useState(false);
  const [saveState, setSaveState] = useState<"ok" | "saving" | "erro">("ok");
  const [eTitle, setETitle] = useState(essay?.title ?? "");
  const [eText, setEText] = useState(essay?.content ?? "");
  const [pending, start] = useTransition();
  const elapsedRef = useRef(elapsedSec);
  const idxRef = useRef(idx);
  idxRef.current = idx;

  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }
    }, 1000);
    const save = setInterval(() => void saveSimuladoProgress(simuladoId, elapsedRef.current, idxRef.current).catch(() => setSaveState("erro")), 30000);
    return () => {
      clearInterval(t);
      clearInterval(save);
    };
  }, [simuladoId]);

  // salva redação com debounce
  useEffect(() => {
    if (!essay) return;
    const t = setTimeout(() => {
      setSaveState("saving");
      saveSimuladoEssay(simuladoId, eTitle, eText).then(() => setSaveState("ok")).catch(() => setSaveState("erro"));
    }, 1500);
    return () => clearTimeout(t);
  }, [eTitle, eText, essay, simuladoId]);

  const remaining = Math.max(0, timeLimitSec - elapsed);
  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(1, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const update = useCallback(
    (i: number, data: { selectedLetter?: string | null; flagged?: boolean }) => {
      const it = items[i];
      setItems((prev) => prev.map((x, k) => (k === i ? { ...x, ...data } : x)));
      setSaveState("saving");
      saveSimuladoItem(simuladoId, it.id, data, elapsedRef.current, i)
        .then(() => setSaveState("ok"))
        .catch(() => setSaveState("erro"));
    },
    [items, simuladoId],
  );

  const answered = items.filter((i) => i.selectedLetter).length;
  const flagged = items.filter((i) => i.flagged).length;
  const cur = items[idx];
  const words = eText.trim() ? eText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <Card className="sticky top-16 z-10 flex flex-wrap items-center gap-3 p-3">
        <div className="hidden min-w-[10rem] flex-1 truncate text-sm font-semibold md:block" title={title}>{title}</div>
        <Badge tone={remaining < 600 ? "danger" : "neutral"} className="text-sm tabular-nums">
          <Timer className="size-3.5" /> {fmt(remaining)}
        </Badge>
        <Badge>
          {answered}/{items.length} respondidas
        </Badge>
        {flagged > 0 && <Badge tone="accent">{flagged} p/ revisar</Badge>}
        <span className={cn("text-xs", saveState === "erro" ? "text-danger" : "text-muted")}>
          <Save className="mr-1 inline size-3" />
          {saveState === "saving" ? "salvando..." : saveState === "erro" ? "erro ao salvar — verifique a conexão" : "progresso salvo"}
        </span>
        {essay && (
          <div className="flex rounded-xl bg-surface-2 p-1 text-xs">
            <button onClick={() => setTab("questoes")} className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5", tab === "questoes" && "bg-surface font-semibold shadow-sm")}>
              <ListChecks className="size-3.5" /> Objetiva
            </button>
            <button onClick={() => setTab("redacao")} className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5", tab === "redacao" && "bg-surface font-semibold shadow-sm")}>
              <PenLine className="size-3.5" /> Redação
            </button>
          </div>
        )}
        <Button onClick={() => setConfirm(true)} variant="primary">
          <Send className="size-4" /> Finalizar
        </Button>
      </Card>

      {remaining === 0 && <Notice tone="warning">O tempo previsto terminou. Finalize o simulado para ver o resultado (o tempo excedente fica registrado).</Notice>}

      {confirm && (
        <Card className="border-accent p-5">
          <p className="font-semibold">Finalizar o simulado?</p>
          <p className="mt-1 text-sm text-muted">
            {items.length - answered} questão(ões) em branco{flagged ? ` e ${flagged} marcada(s) para revisar` : ""}. Questões em branco contam como erro. Após finalizar, não é possível alterar as respostas.
            {essay && ` Redação: ${words} palavras.`}
          </p>
          <div className="mt-4 flex gap-2">
            <Button disabled={pending} onClick={() => start(() => finalizeSimulado(simuladoId, elapsedRef.current))}>
              {pending ? "Corrigindo..." : "Sim, finalizar e corrigir"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Continuar a prova
            </Button>
          </div>
        </Card>
      )}

      {tab === "questoes" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <Badge tone="accent">Questão {idx + 1}</Badge>
              <Badge>{cur.section === "GERAIS" ? "Conhecimentos Gerais (peso 1)" : "Conhecimentos Específicos (peso 2)"}</Badge>
              <Badge>{cur.discipline}</Badge>
              <button onClick={() => update(idx, { flagged: !cur.flagged })} className={cn("ml-auto flex items-center gap-1 rounded-lg px-2 py-1", cur.flagged ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2")} aria-pressed={cur.flagged}>
                <Flag className="size-3.5" fill={cur.flagged ? "currentColor" : "none"} /> Revisar depois
              </button>
            </div>
            <div className="prose-study mb-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{cur.statement}</ReactMarkdown>
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Alternativas">
              {cur.alternatives.map((a) => {
                const sel = cur.selectedLetter === a.letter;
                return (
                  <button
                    key={a.letter}
                    role="radio"
                    aria-checked={sel}
                    onClick={() => update(idx, { selectedLetter: sel ? null : a.letter })}
                    className={cn("flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition", sel ? "border-accent bg-accent-soft/50" : "border-border hover:border-muted")}
                  >
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold", sel ? "border-accent bg-accent text-white" : "border-border")}>{a.letter}</span>
                    <span className="pt-0.5">{a.text}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted">Clique novamente na alternativa marcada para deixar a questão em branco.</p>
            <div className="mt-5 flex justify-between">
              <Button variant="secondary" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
                <ChevronLeft className="size-4" /> Anterior
              </Button>
              <Button variant="secondary" onClick={() => setIdx(Math.min(items.length - 1, idx + 1))} disabled={idx === items.length - 1}>
                Próxima <ChevronRight className="size-4" />
              </Button>
            </div>
          </Card>
          <Card className="h-fit p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Navegação</div>
            <div className="grid grid-cols-6 gap-1.5">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => setIdx(i)}
                  aria-label={`Questão ${i + 1}${it.selectedLetter ? `, respondida ${it.selectedLetter}` : ", em branco"}${it.flagged ? ", marcada para revisar" : ""}`}
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-lg text-xs font-medium",
                    i === idx && "ring-2 ring-accent",
                    it.selectedLetter ? "bg-teal-soft text-teal" : "bg-surface-2 text-muted",
                  )}
                >
                  {i + 1}
                  {it.flagged && <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-accent" />}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-muted">
              <div>■ verde: respondida · ■ cinza: em branco · ● vermelho: revisar</div>
              <div>Gerais: 1–{items.filter((i) => i.section === "GERAIS").length}</div>
            </div>
          </Card>
        </div>
      ) : (
        essay && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="max-h-[75vh] overflow-auto p-5">
              {essay.prompt ? (
                <>
                  <Badge tone="amber">Tema autoral de treinamento</Badge>
                  <h2 className="mt-2 font-display text-xl font-semibold">{essay.prompt.thematicPhrase}</h2>
                  <div className="prose-study mt-3 text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{essay.prompt.motivatingTexts}</ReactMarkdown>
                  </div>
                  <p className="mt-3 text-sm font-medium">{essay.prompt.instructions}</p>
                </>
              ) : (
                <p className="text-sm text-muted">Nenhum tema cadastrado.</p>
              )}
            </Card>
            <Card className="flex flex-col p-5">
              <input value={eTitle} onChange={(e) => setETitle(e.target.value)} placeholder="Título (opcional — não é avaliado)" className="mb-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm" />
              <textarea value={eText} onChange={(e) => setEText(e.target.value)} className="min-h-[50vh] flex-1 rounded-xl border border-border bg-surface p-4 font-serif text-[15px] leading-7" placeholder="Escreva sua redação aqui. Separe os parágrafos com uma linha em branco." />
              <div className="mt-2 text-xs text-muted">{words} palavras · salvamento automático</div>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
