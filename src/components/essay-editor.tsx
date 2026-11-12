"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Timer, Save, Sparkles, CheckCircle2, AlertTriangle, Info, RotateCcw } from "lucide-react";
import { finishEssay, reopenEssay, requestAIFeedback, saveEssayDraft, saveEssayReview } from "@/app/actions/essays";
import { analyzeEssay, countWords, estimateLines, type EssayAnalysis } from "@/lib/essay";
import { Badge, Button, Card, CardBody, CardHeader, Notice } from "./ui";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
  status: string;
  prompt: { thematicPhrase: string; motivatingTexts: string; instructions: string } | null;
  exercise: string | null;
  checklistItems: string[];
  initialChecklist: Record<string, boolean>;
  initialScores: Record<string, number>;
  criteria: { key: string; nome: string; descricao: string }[];
  initialAnalysis: EssayAnalysis | null;
  initialAI: string;
  aiAvailable: boolean;
};

const EXERCISE_HELP: Record<string, string> = {
  "Exercício — Introdução": "Escreva apenas a INTRODUÇÃO (5–6 linhas): contextualize o tema sem copiar os textos e apresente sua tese de forma explícita.",
  "Exercício — Parágrafo de desenvolvimento": "Escreva UM parágrafo de desenvolvimento (7–8 linhas): tópico frasal, fundamentação (fato, lei, exemplo) e fechamento ligado à tese.",
  "Exercício — Conclusão": "Escreva apenas a CONCLUSÃO (4–5 linhas): retome a tese com outras palavras e feche o raciocínio, sem argumento novo (proposta de intervenção não é exigida pela Vunesp).",
};

export function EssayEditor(p: Props) {
  const [title, setTitle] = useState(p.initialTitle);
  const [text, setText] = useState(p.initialContent);
  const [status, setStatus] = useState(p.status);
  const [saved, setSaved] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(p.initialAnalysis);
  const [checklist, setChecklist] = useState(p.initialChecklist);
  const [scores, setScores] = useState(p.initialScores);
  const [ai, setAi] = useState(p.initialAI);
  const [aiMsg, setAiMsg] = useState<string | null>(null);
  const [timerOn, setTimerOn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [pending, start] = useTransition();
  const unsaved = useRef(0);
  const lastActivity = useRef(Date.now());
  const live = useMemo(() => ({ words: countWords(text), lines: estimateLines(text) }), [text]);
  const readOnly = status === "FINALIZADA";

  // tempo ativo de escrita (pausado após 2 min sem digitar)
  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() - lastActivity.current < 120000 && !readOnly) unsaved.current += 1;
      if (timerOn) setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [timerOn, readOnly]);

  // autossalvamento
  useEffect(() => {
    if (readOnly) return;
    const t = setTimeout(() => {
      const add = unsaved.current;
      unsaved.current = 0;
      saveEssayDraft(p.id, title, text, add)
        .then((r) => setSaved(r.savedAt))
        .catch(() => setSaved(null));
    }, 2000);
    return () => clearTimeout(t);
  }, [title, text, p.id, readOnly]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const helpText = p.exercise ? EXERCISE_HELP[p.exercise] : null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {p.prompt && (
          <Card>
            <details open={!text}>
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Proposta: {p.prompt.thematicPhrase} <Badge tone="amber" className="ml-2">autoral · treinamento</Badge>
              </summary>
              <div className="prose-study px-5 pb-5 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.prompt.motivatingTexts}</ReactMarkdown>
                <p className="font-medium">{p.prompt.instructions}</p>
              </div>
            </details>
          </Card>
        )}
        {helpText && <Notice tone="success">{helpText}</Notice>}
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <Badge tone={live.lines <= 7 ? "danger" : live.lines <= 20 ? "amber" : "success"}>~{live.lines} linhas</Badge>
            <Badge>{live.words} palavras</Badge>
            <button onClick={() => setTimerOn(!timerOn)} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5", timerOn ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted")}>
              <Timer className="size-3" /> {timerOn ? "Pausar" : "Cronômetro"} {fmt(seconds)}
            </button>
            {seconds >= 60 * 60 && <Badge tone="amber">Na prova, reserve ~1h para a redação</Badge>}
            <span className="ml-auto text-muted">
              <Save className="mr-1 inline size-3" />
              {readOnly ? "Finalizada" : saved ? `Rascunho salvo ${new Date(saved).toLocaleTimeString("pt-BR")}` : "Salvando automaticamente..."}
            </span>
          </div>
          <input value={title} onChange={(e) => { setTitle(e.target.value); lastActivity.current = Date.now(); }} disabled={readOnly} placeholder="Título (opcional — não é considerado na correção)" className="mb-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm" aria-label="Título" />
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); lastActivity.current = Date.now(); }}
            disabled={readOnly}
            aria-label="Texto da redação"
            placeholder="Escreva seu texto dissertativo-argumentativo. Deixe uma linha em branco entre os parágrafos."
            className="min-h-[60vh] w-full rounded-xl border border-border bg-surface p-4 font-serif text-[15.5px] leading-8 outline-none focus:border-accent"
            style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, var(--border) 32px)", backgroundPosition: "0 16px", backgroundAttachment: "local" }}
          />
          <p className="mt-1 text-[11px] text-muted">Estimativa de linhas: ~11 palavras por linha manuscrita. A folha oficial pode variar; use como referência.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!readOnly ? (
              <Button disabled={pending || live.words < 10} onClick={() => start(async () => { const a = await finishEssay(p.id, title, text); setAnalysis(a); setStatus("FINALIZADA"); })}>
                <CheckCircle2 className="size-4" /> Finalizar e analisar
              </Button>
            ) : (
              <Button variant="secondary" disabled={pending} onClick={() => start(async () => { await reopenEssay(p.id); setStatus("RASCUNHO"); })}>
                <RotateCcw className="size-4" /> Reabrir para edição
              </Button>
            )}
            <Button variant="outline" disabled={pending} onClick={() => setAnalysis(analyzeEssay(title, text))}>
              Análise rápida (local)
            </Button>
          </div>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader title="Análise automática local" subtitle="Indicadores heurísticos — não é nota" />
          <CardBody className="space-y-2 pt-3">
            {analysis ? (
              <>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-surface-2 p-2"><div className="font-display text-lg">{analysis.paragraphs}</div>parágrafos</div>
                  <div className="rounded-lg bg-surface-2 p-2"><div className="font-display text-lg">{analysis.sentences}</div>períodos</div>
                  <div className="rounded-lg bg-surface-2 p-2"><div className="font-display text-lg">{analysis.avgSentenceWords}</div>pal./período</div>
                </div>
                <ul className="space-y-1.5">
                  {analysis.alerts.map((a, i) => (
                    <li key={i} className="flex gap-2 text-xs">
                      {a.level === "erro" ? <AlertTriangle className="size-4 shrink-0 text-danger" /> : a.level === "atencao" ? <Info className="size-4 shrink-0 text-amber" /> : <CheckCircle2 className="size-4 shrink-0 text-success" />}
                      <span><strong>{a.criterion === "GERAL" ? "Geral" : `Crit. ${a.criterion}`}:</strong> {a.message}</span>
                    </li>
                  ))}
                </ul>
                {analysis.connectivesFound.length > 0 && <p className="text-[11px] text-muted">Conectivos usados: {analysis.connectivesFound.map((c) => c.term).join(", ")}</p>}
              </>
            ) : (
              <p className="text-sm text-muted">Clique em &quot;Análise rápida&quot; ou finalize a redação.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Autoavaliação pelos critérios do edital" subtitle="Atribua de 0 a 10 a cada critério (item 9.52)" />
          <CardBody className="space-y-3 pt-3">
            {p.criteria.map((c) => (
              <label key={c.key} className="block text-xs">
                <span className="flex justify-between font-medium"><span>{c.key} — {c.nome}</span><span>{scores[c.key] ?? "—"}</span></span>
                <input type="range" min={0} max={10} step={0.5} value={scores[c.key] ?? 5} onChange={(e) => setScores({ ...scores, [c.key]: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
                <span className="text-muted">{c.descricao}</span>
              </label>
            ))}
            <div className="border-t border-border pt-3">
              <div className="mb-2 text-xs font-semibold">Checklist de revisão</div>
              {p.checklistItems.map((item) => (
                <label key={item} className="flex items-start gap-2 py-0.5 text-xs">
                  <input type="checkbox" checked={!!checklist[item]} onChange={(e) => setChecklist({ ...checklist, [item]: e.target.checked })} className="mt-0.5 accent-[var(--accent)]" />
                  {item}
                </label>
              ))}
            </div>
            <Button variant="secondary" className="w-full" disabled={pending} onClick={() => start(() => saveEssayReview(p.id, checklist, scores))}>
              Salvar autoavaliação
            </Button>
            <p className="text-[11px] text-muted">A média da autoavaliação aparece no histórico como referência pessoal — não é a nota da banca.</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Análise por IA (opcional)" subtitle="Estimativa NÃO OFICIAL" icon={<Sparkles className="size-4" />} />
          <CardBody className="space-y-2 pt-3">
            {!p.aiAvailable && <Notice>Desativada: configure <code>ANTHROPIC_API_KEY</code> no .env para habilitar. Tudo continua funcionando sem ela.</Notice>}
            {p.aiAvailable && (
              <Button className="w-full" disabled={pending || live.words < 50} onClick={() => start(async () => { setAiMsg(null); const r = await requestAIFeedback(p.id); if (r.ok) setAi(r.text); else setAiMsg(r.text); })}>
                <Sparkles className="size-4" /> {pending ? "Analisando..." : "Pedir análise orientativa"}
              </Button>
            )}
            {aiMsg && <Notice tone="warning">{aiMsg}</Notice>}
            {ai && (
              <div className="prose-study max-h-[60vh] overflow-auto text-sm">
                <Notice tone="warning" className="mb-2">Estimativa gerada por IA, não oficial. A nota real é atribuída por examinadores da Vunesp.</Notice>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{ai}</ReactMarkdown>
              </div>
            )}
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}
