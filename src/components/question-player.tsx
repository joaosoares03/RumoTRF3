"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Star, Flag, StickyNote, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Timer } from "lucide-react";
import { answerQuestion, saveQuestionNote, toggleFavorite, toggleFlag, type AnswerResult } from "@/app/actions/questions";
import { Badge, Button, Card, Notice } from "./ui";
import { cn } from "@/lib/utils";

export type PlayerQuestion = {
  id: string;
  code: string;
  statement: string;
  difficulty: number;
  board: string;
  origin: string;
  year: number | null;
  topicTitle: string;
  disciplineName: string;
  alternatives: { letter: string; text: string }[];
  favorite: boolean;
  flagged: boolean;
  note: string;
  previous: { answered: number; correct: number };
};

const DIFF = { 1: "Fácil", 2: "Média", 3: "Difícil" } as Record<number, string>;

function QuestionCard({ q, index, total, mode, onAnswered }: { q: PlayerQuestion; index: number; total: number; mode: "PRATICA" | "REVISAO" | "CRONOMETRADO"; onAnswered: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [fav, setFav] = useState(q.favorite);
  const [flag, setFlag] = useState(q.flagged);
  const [note, setNote] = useState(q.note);
  const [showNote, setShowNote] = useState(!!q.note);
  const [noteSaved, setNoteSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const startedAt = useRef(Date.now());

  const submit = () => {
    if (!selected) return;
    setError(null);
    start(async () => {
      try {
        const r = await answerQuestion(q.id, selected, (Date.now() - startedAt.current) / 1000, mode);
        setResult(r);
        onAnswered(r.correct);
      } catch {
        setError("Não foi possível registrar a resposta. Verifique sua conexão e tente novamente.");
      }
    });
  };

  return (
    <Card className="animate-fade-up p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <Badge tone="accent">
          Questão {index + 1} de {total}
        </Badge>
        <Badge>{q.code}</Badge>
        <Badge>{DIFF[q.difficulty]}</Badge>
        <Badge tone={q.origin === "OFICIAL" ? "teal" : "amber"} title={q.board}>
          {q.origin === "OFICIAL" ? `${q.board} ${q.year ?? ""}` : "Autoral · treinamento (não oficial)"}
        </Badge>
        {q.previous.answered > 0 && <Badge>Você já respondeu {q.previous.answered}× ({q.previous.correct} acerto(s))</Badge>}
        <div className="ml-auto flex gap-1">
          <button onClick={() => start(async () => setFav(await toggleFavorite(q.id)))} className={cn("grid size-8 place-items-center rounded-lg hover:bg-surface-2", fav ? "text-amber" : "text-muted")} aria-pressed={fav} aria-label="Favoritar" title="Favoritar">
            <Star className="size-4" fill={fav ? "currentColor" : "none"} />
          </button>
          <button onClick={() => start(async () => setFlag(await toggleFlag(q.id)))} className={cn("grid size-8 place-items-center rounded-lg hover:bg-surface-2", flag ? "text-accent" : "text-muted")} aria-pressed={flag} aria-label="Sinalizar para revisão" title="Sinalizar para revisão">
            <Flag className="size-4" fill={flag ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setShowNote(!showNote)} className={cn("grid size-8 place-items-center rounded-lg hover:bg-surface-2", note ? "text-teal" : "text-muted")} aria-label="Anotação pessoal" title="Anotação pessoal">
            <StickyNote className="size-4" />
          </button>
        </div>
      </div>
      <div className="mb-1 text-xs text-muted">
        {q.disciplineName} › {q.topicTitle}
      </div>
      <div className="prose-study mb-5">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.statement}</ReactMarkdown>
      </div>

      <fieldset className="space-y-2" disabled={!!result || pending}>
        <legend className="sr-only">Alternativas</legend>
        {q.alternatives.map((a) => {
          const r = result?.alternatives.find((x) => x.letter === a.letter);
          const isSel = selected === a.letter;
          return (
            <div key={a.letter}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition",
                  !result && isSel && "border-accent bg-accent-soft/50",
                  !result && !isSel && "border-border hover:border-muted",
                  result && r?.isCorrect && "border-success bg-teal-soft",
                  result && isSel && !r?.isCorrect && "border-danger bg-accent-soft",
                  result && !isSel && !r?.isCorrect && "border-border opacity-80",
                )}
              >
                <input type="radio" name={`q-${q.id}`} value={a.letter} checked={isSel} onChange={() => setSelected(a.letter)} className="sr-only" />
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold", isSel ? "border-accent bg-accent text-white" : "border-border")}>{a.letter}</span>
                <span className="pt-0.5">{a.text}</span>
                {result && r?.isCorrect && <CheckCircle2 className="ml-auto size-5 shrink-0 text-success" />}
                {result && isSel && !r?.isCorrect && <XCircle className="ml-auto size-5 shrink-0 text-danger" />}
              </label>
              {result && r && <p className={cn("ml-9 mt-1 text-xs", r.isCorrect ? "text-success" : "text-muted")}>{r.explanation}</p>}
            </div>
          );
        })}
      </fieldset>

      {error && <Notice tone="danger" className="mt-4">{error}</Notice>}

      {!result ? (
        <div className="mt-5 flex justify-end">
          <Button onClick={submit} disabled={!selected || pending}>
            {pending ? "Corrigindo..." : "Responder"}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <Notice tone={result.correct ? "success" : "danger"}>
            <strong>{result.correct ? "Resposta correta!" : `Resposta incorreta — gabarito: ${result.correctLetter}`}</strong>
            {!result.correct && " · A questão foi adicionada ao seu caderno de erros e virou um flashcard para revisão amanhã."}
          </Notice>
          <div className="rounded-xl bg-surface-2 p-4 text-sm">
            <div className="mb-1 font-semibold">Gabarito comentado</div>
            <p>{result.explanation}</p>
            <p className="mt-2 text-xs text-muted">Referência: {result.reference}</p>
            <p className="mt-1 text-xs text-muted">Estatística da plataforma: {result.stats.total} resposta(s), {result.stats.correctRate}% de acerto.</p>
          </div>
        </div>
      )}

      {showNote && (
        <div className="mt-4">
          <label className="text-xs font-medium" htmlFor={`note-${q.id}`}>
            Sua anotação (privada)
          </label>
          <textarea
            id={`note-${q.id}`}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
            onBlur={() => start(async () => {
              await saveQuestionNote(q.id, note);
              setNoteSaved(true);
            })}
            rows={3}
            className="mt-1 w-full rounded-xl border border-border bg-surface p-3 text-sm"
            placeholder="Ex.: confundi DIP com ISP — revisar SOLID."
          />
          {noteSaved && <span className="text-xs text-success">Anotação salva.</span>}
        </div>
      )}
    </Card>
  );
}

export function QuestionPlayer({ questions, mode = "PRATICA", timeLimitMin, emptyHref = "/questoes" }: { questions: PlayerQuestion[]; mode?: "PRATICA" | "REVISAO" | "CRONOMETRADO"; timeLimitMin?: number; emptyHref?: string }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ answered: 0, correct: 0 });
  const [remaining, setRemaining] = useState(timeLimitMin ? timeLimitMin * 60 : 0);

  useEffect(() => {
    if (!timeLimitMin) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLimitMin]);

  if (!questions.length)
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">Nenhuma questão encontrada com esses filtros.</p>
        <p className="mt-1 text-sm text-muted">Ajuste os filtros ou escolha outro assunto. Assuntos sem questões aparecem como lacuna no edital verticalizado.</p>
        <Link href={emptyHref} className="mt-4 inline-block text-sm font-medium text-accent">
          Voltar aos filtros
        </Link>
      </Card>
    );

  const timeUp = !!timeLimitMin && remaining === 0;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted">
          Nesta lista: <strong className="text-text">{score.correct}</strong> acerto(s) em <strong className="text-text">{score.answered}</strong> resposta(s)
        </span>
        {timeLimitMin ? (
          <Badge tone={remaining < 60 ? "danger" : "neutral"} className="ml-auto text-sm">
            <Timer className="size-3.5" /> {String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}
          </Badge>
        ) : null}
      </div>
      {timeUp && <Notice tone="warning">Tempo esgotado! Você pode continuar, mas o treino cronometrado terminou.</Notice>}
      <QuestionCard key={questions[idx].id} q={questions[idx]} index={idx} total={questions.length} mode={mode} onAnswered={(c) => setScore((s) => ({ answered: s.answered + 1, correct: s.correct + (c ? 1 : 0) }))} />
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
          <ChevronLeft className="size-4" /> Anterior
        </Button>
        <div className="hidden gap-1 sm:flex">
          {questions.slice(0, 40).map((q, i) => (
            <button key={q.id} onClick={() => setIdx(i)} className={cn("size-2.5 rounded-full", i === idx ? "bg-accent" : "bg-border")} aria-label={`Ir para a questão ${i + 1}`} />
          ))}
        </div>
        <Button variant="secondary" onClick={() => setIdx(Math.min(questions.length - 1, idx + 1))} disabled={idx === questions.length - 1}>
          Próxima <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
