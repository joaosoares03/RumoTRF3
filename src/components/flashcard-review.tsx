"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { reviewCard } from "@/app/actions/flashcards";
import { GRADE_BUTTONS } from "@/lib/sm2";
import { Badge, Button, Card } from "./ui";
import { cn } from "@/lib/utils";

type C = { id: string; front: string; back: string; type: string; discipline: string; topic: string | null; isNew: boolean; personal: boolean };

function renderFront(c: C, revealed: boolean) {
  if (c.type !== "LACUNA") return c.front;
  // {{resposta}} vira lacuna até a revelação
  return c.front.replace(/\{\{(.+?)\}\}/g, (_, x) => (revealed ? `[${x}]` : "_____"));
}

export function FlashcardReview({ cards }: { cards: C[] }) {
  const [queue, setQueue] = useState(cards);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const shownAt = useRef(Date.now());

  useEffect(() => {
    shownAt.current = Date.now();
    setRevealed(false);
  }, [queue[0]?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
      }
      if (revealed && ["1", "2", "3", "4"].includes(e.key)) grade(GRADE_BUTTONS[Number(e.key) - 1].grade);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const grade = (g: number) => {
    const c = queue[0];
    if (!c || pending) return;
    start(async () => {
      const r = await reviewCard(c.id, g, (Date.now() - shownAt.current) / 1000);
      setLast(`Próxima revisão em ${r.intervalDays} dia(s)`);
      setDone((d) => d + 1);
      // cartões errados voltam ao fim da fila desta sessão
      setQueue((q) => (g < 3 ? [...q.slice(1), c] : q.slice(1)));
    });
  };

  if (!queue.length)
    return (
      <Card className="p-10 text-center">
        <p className="font-display text-2xl font-semibold">Revisões concluídas! 🎉</p>
        <p className="mt-2 text-sm text-muted">{done} revisão(ões) registrada(s) nesta sessão.</p>
        <Link href="/flashcards" className="mt-4 inline-block text-sm font-medium text-accent">Voltar aos baralhos</Link>
      </Card>
    );

  const c = queue[0];
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{queue.length} na fila · {done} revisados</span>
        {last && <span className="text-success">{last}</span>}
      </div>
      <Card className="min-h-[320px] p-8">
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Badge>{c.discipline}</Badge>
          {c.isNew && <Badge tone="teal">novo</Badge>}
          {c.personal && <Badge tone="amber">pessoal</Badge>}
          {c.type === "CODIGO" && <Badge>código/comando</Badge>}
          {c.type === "LACUNA" && <Badge>lacuna</Badge>}
        </div>
        {c.topic && <div className="mb-2 text-xs text-muted">{c.topic}</div>}
        <div className={cn("whitespace-pre-wrap text-lg leading-relaxed", c.type === "CODIGO" && "font-mono text-base")}>{renderFront(c, revealed)}</div>
        {revealed && (
          <div className="animate-fade-up mt-6 border-t border-border pt-6">
            <div className={cn("whitespace-pre-wrap leading-relaxed", c.type === "CODIGO" && "rounded-xl bg-[#0f1117] p-4 font-mono text-sm text-[#e6e6e6]")}>{c.back}</div>
          </div>
        )}
      </Card>
      {!revealed ? (
        <Button className="w-full py-3" onClick={() => setRevealed(true)}>
          <RotateCw className="size-4" /> Mostrar resposta (espaço)
        </Button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_BUTTONS.map((b, i) => (
            <button key={b.grade} disabled={pending} onClick={() => grade(b.grade)} className={cn("rounded-xl border px-2 py-3 text-sm font-medium transition hover:-translate-y-0.5", i === 0 ? "border-danger/40 bg-accent-soft text-danger" : i === 1 ? "border-amber/40 bg-amber-soft" : i === 2 ? "border-teal/40 bg-teal-soft" : "border-success/40 bg-teal-soft text-success")}>
              {b.label}
              <div className="text-[10px] font-normal text-muted">{b.hint} · tecla {i + 1}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
