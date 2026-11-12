"use client";

import { useActionState, useMemo, useState } from "react";
import { completeOnboarding, type OnboardingState } from "@/app/actions/prefs";
import { Button, Card, Notice, inputClass } from "./ui";
import { cn } from "@/lib/utils";

type Disc = { slug: string; name: string; kind: string; specialty: string | null; topics: { id: string; title: string }[] };

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const STEPS = ["Especialidade", "Disponibilidade", "Nível", "Dificuldades", "Já domino", "Objetivo"];

export function OnboardingWizard({ name, disciplines, examDate, already }: { name: string; disciplines: Disc[]; examDate: string; already: boolean }) {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(completeOnboarding, undefined);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"DEV" | "SUP" | "AMBAS">("DEV");
  const [hours, setHours] = useState(2);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [works, setWorks] = useState(false);
  const daysLeft = Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000);

  const visible = useMemo(() => disciplines.filter((d) => d.specialty === null || mode === "AMBAS" || d.specialty === mode), [disciplines, mode]);
  const totalHours = Math.round(hours * days.length * (daysLeft / 7));

  const choice = (active: boolean) => cn("cursor-pointer rounded-2xl border p-4 text-left transition", active ? "border-accent bg-accent-soft/60 ring-2 ring-[var(--ring)]" : "border-border hover:border-muted");

  return (
    <form action={action} className="animate-fade-up">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{already ? "Refazer configuração" : `Olá, ${name}!`}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Vamos montar seu plano até a prova</h1>
        <p className="mt-2 text-sm text-muted">Faltam {daysLeft} dias para 31/01/2027 (data prevista no Anexo VII, sujeita a alterações).</p>
      </div>

      <ol className="mb-6 flex flex-wrap justify-center gap-1.5" aria-label="Etapas">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" onClick={() => setStep(i)} className={cn("rounded-full px-3 py-1 text-xs font-medium", i === step ? "bg-accent text-white" : i < step ? "bg-teal-soft text-teal" : "bg-surface-2 text-muted")}>
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      <Card className="p-6">
        {/* Etapa 1 */}
        <section hidden={step !== 0} className="space-y-4">
          <h2 className="text-lg font-semibold">Qual especialidade você vai preparar?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {([
              ["DEV", "Desenvolvimento de Sistemas", "Cargo 006 · 5 vagas"],
              ["SUP", "Suporte Técnico", "Cargo 007 · 4 vagas"],
              ["AMBAS", "As duas", "Gerais compartilhadas; específicas separadas"],
            ] as const).map(([v, t, s]) => (
              <label key={v} className={choice(mode === v)}>
                <input type="radio" name="specialtyMode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                <div className="font-semibold">{t}</div>
                <div className="mt-1 text-xs text-muted">{s}</div>
              </label>
            ))}
          </div>
          <Notice>As duas especialidades têm a mesma estrutura: 24 questões de Conhecimentos Gerais (peso 1) + 36 de Conhecimentos Específicos (peso 2) + redação. As matérias gerais são idênticas e o progresso nelas é compartilhado.</Notice>
        </section>

        {/* Etapa 2 */}
        <section hidden={step !== 1} className="space-y-5">
          <h2 className="text-lg font-semibold">Quanto tempo você tem?</h2>
          <div>
            <label className="text-sm font-medium" htmlFor="hours">
              Horas por dia de estudo: <span className="font-display text-xl text-accent">{hours.toLocaleString("pt-BR")}h</span>
            </label>
            <input id="hours" type="range" min={0.5} max={10} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
            <input type="hidden" name="dailyMinutes" value={Math.round(hours * 60)} />
          </div>
          <div>
            <div className="text-sm font-medium">Dias da semana disponíveis</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAYS.map((d, i) => (
                <label key={d} className={cn("cursor-pointer rounded-xl border px-3 py-2 text-sm", days.includes(i) ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border")}>
                  <input type="checkbox" name="studyDays" value={i} checked={days.includes(i)} onChange={(e) => setDays(e.target.checked ? [...days, i] : days.filter((x) => x !== i))} className="sr-only" />
                  {d}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="worksFullTime" checked={works} onChange={(e) => setWorks(e.target.checked)} className="size-4 accent-[var(--accent)]" />
            Trabalho em tempo integral (o plano usa blocos curtos e prioriza questões)
          </label>
          <Notice tone="success">
            Estimativa: cerca de <strong>{totalHours} horas</strong> de estudo até a prova.
          </Notice>
        </section>

        {/* Etapa 3 */}
        <section hidden={step !== 2} className="space-y-4">
          <h2 className="text-lg font-semibold">Seu nível atual de conhecimento</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {([
              ["INICIANTE", "Iniciante", "Começando agora"],
              ["INTERMEDIARIO", "Intermediário", "Já estudei parte do conteúdo"],
              ["AVANCADO", "Avançado", "Revisão e questões"],
            ] as const).map(([v, t, s], i) => (
              <label key={v} className="cursor-pointer rounded-2xl border border-border p-4 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/60">
                <input type="radio" name="level" value={v} defaultChecked={i === 0} className="sr-only" />
                <div className="font-semibold">{t}</div>
                <div className="mt-1 text-xs text-muted">{s}</div>
              </label>
            ))}
          </div>
          <h3 className="pt-2 font-semibold">Como prefere organizar os estudos?</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="cursor-pointer rounded-2xl border border-border p-4 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/60">
              <input type="radio" name="planMode" value="CICLO" defaultChecked className="sr-only" />
              <div className="font-semibold">Ciclo de estudos</div>
              <div className="mt-1 text-xs text-muted">Disciplinas se alternam em sequência ponderada; se perder um dia, o ciclo continua de onde parou.</div>
            </label>
            <label className="cursor-pointer rounded-2xl border border-border p-4 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/60">
              <input type="radio" name="planMode" value="FIXO" className="sr-only" />
              <div className="font-semibold">Cronograma fixo</div>
              <div className="mt-1 text-xs text-muted">Cada dia da semana tem disciplinas definidas.</div>
            </label>
          </div>
        </section>

        {/* Etapa 4 */}
        <section hidden={step !== 3} className="space-y-3">
          <h2 className="text-lg font-semibold">Quais disciplinas você considera mais difíceis?</h2>
          <p className="text-sm text-muted">Elas recebem 40% a mais de tempo no plano. Depois, o sistema ajusta automaticamente com base nos seus erros.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visible.map((d) => (
              <label key={d.slug} className="flex cursor-pointer items-start gap-2 rounded-xl border border-border p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50">
                <input type="checkbox" name="difficultDisciplines" value={d.slug} className="mt-0.5 size-4 accent-[var(--accent)]" />
                <span>
                  {d.name}
                  <span className="ml-1 text-xs text-muted">({d.kind === "GERAL" ? "Gerais" : d.specialty === "DEV" ? "006" : "007"})</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Etapa 5 */}
        <section hidden={step !== 4} className="space-y-3">
          <h2 className="text-lg font-semibold">Assuntos que você já domina</h2>
          <p className="text-sm text-muted">Marcados como "Dominado": entram apenas em revisões e questões. Pode pular esta etapa.</p>
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {visible.map((d) => (
              <details key={d.slug} className="rounded-xl border border-border">
                <summary className="cursor-pointer px-3 py-2 text-sm font-medium">{d.name}</summary>
                <div className="space-y-1 px-3 pb-3">
                  {d.topics.map((t) => (
                    <label key={t.id} className="flex items-start gap-2 text-sm">
                      <input type="checkbox" name="masteredTopics" value={t.id} className="mt-1 size-4 accent-[var(--accent)]" />
                      <span>{t.title}</span>
                    </label>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Etapa 6 */}
        <section hidden={step !== 5} className="space-y-3">
          <h2 className="text-lg font-semibold">Qual é seu objetivo até a prova?</h2>
          <textarea name="objective" rows={3} maxLength={300} className={inputClass} placeholder="Ex.: ser aprovado(a) entre os primeiros em Desenvolvimento de Sistemas, garantindo mais de 70% nas específicas." />
          <Notice>Ao concluir, geramos automaticamente um cronograma diário até a véspera da prova, com teoria, questões, revisões espaçadas (1, 7, 15 e 30 dias), redação semanal, simulados quinzenais e semana final de revisão.</Notice>
          {state?.error && <Notice tone="danger">{state.error}</Notice>}
        </section>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Voltar
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep(step + 1)} disabled={step === 1 && days.length === 0}>
              Continuar
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              {pending ? "Gerando seu plano..." : "Gerar meu plano de estudos"}
            </Button>
          )}
        </div>
      </Card>
    </form>
  );
}
