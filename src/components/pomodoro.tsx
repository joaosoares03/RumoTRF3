"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { logStudySession } from "@/app/actions/study";
import { Button, Card, Notice } from "./ui";
import { cn } from "@/lib/utils";

/** Pomodoro com registro automático das sessões de foco no histórico de estudo. */
export function Pomodoro({ focusMin, breakMin, disciplines }: { focusMin: number; breakMin: number; disciplines: { id: string; name: string }[] }) {
  const [phase, setPhase] = useState<"foco" | "pausa">("foco");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(focusMin * 60);
  const [disc, setDisc] = useState("");
  const [cycles, setCycles] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const focusStart = useRef<Date | null>(null);
  const accumulated = useRef(0);

  const total = (phase === "foco" ? focusMin : breakMin) * 60;

  const logFocus = async (end: Date) => {
    if (!focusStart.current) return;
    const secs = accumulated.current + (running ? (end.getTime() - focusStart.current.getTime()) / 1000 : 0);
    accumulated.current = 0;
    focusStart.current = null;
    if (secs < 60) return;
    try {
      await logStudySession({ startedAt: new Date(end.getTime() - secs * 1000).toISOString(), endedAt: end.toISOString(), type: "POMODORO", disciplineId: disc || null });
      setMsg(`Sessão de foco de ${Math.round(secs / 60)} min registrada.`);
    } catch {
      setMsg("Não foi possível registrar a sessão.");
    }
  };

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    const end = new Date();
    if (phase === "foco") {
      void logFocus(end);
      setCycles((c) => c + 1);
      setPhase("pausa");
      setLeft(breakMin * 60);
      try {
        new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play().catch(() => {});
      } catch {}
      if ("Notification" in window && Notification.permission === "granted") new Notification("Pausa! 🎉", { body: `Descanse ${breakMin} minutos.` });
    } else {
      setPhase("foco");
      setLeft(focusMin * 60);
      focusStart.current = running ? new Date() : null;
      if ("Notification" in window && Notification.permission === "granted") new Notification("Hora de focar", { body: `${focusMin} minutos de estudo.` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  useEffect(() => {
    document.title = `${String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0")}:${String(Math.max(0, left) % 60).padStart(2, "0")} · ${phase === "foco" ? "Foco" : "Pausa"}`;
    return () => {
      document.title = "Modo foco · Rumo TRF3";
    };
  }, [left, phase]);

  const toggle = () => {
    if (running) {
      if (phase === "foco" && focusStart.current) accumulated.current += (Date.now() - focusStart.current.getTime()) / 1000;
      focusStart.current = null;
    } else {
      if (phase === "foco") focusStart.current = new Date();
      if ("Notification" in window && Notification.permission === "default") Notification.requestPermission().catch(() => {});
    }
    setRunning(!running);
  };

  const pct = ((total - Math.max(0, left)) / total) * 100;
  const R = 120;
  const C = 2 * Math.PI * R;

  return (
    <Card className="mx-auto max-w-xl p-8 text-center">
      <div className="mb-4 flex justify-center gap-2 text-sm">
        <span className={cn("rounded-full px-3 py-1", phase === "foco" ? "bg-accent text-white" : "bg-surface-2 text-muted")}>Foco {focusMin} min</span>
        <span className={cn("rounded-full px-3 py-1", phase === "pausa" ? "bg-teal text-white" : "bg-surface-2 text-muted")}>Pausa {breakMin} min</span>
      </div>
      <div className="relative mx-auto grid grid-cols-1 size-[270px] place-items-center">
        <svg width="270" height="270" className="absolute -rotate-90" aria-hidden>
          <circle cx="135" cy="135" r={R} stroke="var(--surface-2)" strokeWidth="12" fill="none" />
          <circle cx="135" cy="135" r={R} stroke={phase === "foco" ? "var(--accent)" : "var(--teal)"} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C} style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div>
          <div className="font-display text-6xl font-semibold tabular-nums" role="timer" aria-live="off">
            {String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0")}:{String(Math.max(0, left) % 60).padStart(2, "0")}
          </div>
          <div className="mt-1 text-sm text-muted">{phase === "foco" ? "Concentre-se" : "Respire e alongue-se"} · ciclo {cycles + 1}</div>
        </div>
      </div>
      <select value={disc} onChange={(e) => setDisc(e.target.value)} className="mx-auto mt-6 block w-full max-w-xs rounded-xl border border-border bg-surface px-3 py-2 text-sm" aria-label="Disciplina estudada">
        <option value="">Disciplina (opcional)</option>
        {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={toggle} className="px-6">{running ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Iniciar</>}</Button>
        <Button variant="secondary" onClick={() => setLeft(0)} aria-label="Pular fase"><SkipForward className="size-4" /></Button>
        <Button variant="ghost" onClick={async () => { if (phase === "foco") await logFocus(new Date()); setRunning(false); setPhase("foco"); setLeft(focusMin * 60); }} aria-label="Reiniciar"><RotateCcw className="size-4" /></Button>
      </div>
      {msg && <Notice tone="success" className="mt-4">{msg}</Notice>}
      <p className="mt-4 text-xs text-muted">Sessões de foco com 1 minuto ou mais são registradas automaticamente ao fim de cada ciclo ou ao reiniciar. Ajuste as durações em Configurações.</p>
    </Card>
  );
}
