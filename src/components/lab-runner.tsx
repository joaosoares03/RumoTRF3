"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Play, CheckCircle2, XCircle, Eye, RotateCcw } from "lucide-react";
import { recordLabAttempt } from "@/app/actions/labs";
import { Badge, Button, Card, Notice } from "./ui";
import { cn } from "@/lib/utils";

type Step = { question: string; options: string[]; correct: number; feedback: string };
type Payload = { schema?: string; expectedSql?: string; orderMatters?: boolean; steps?: Step[] };
type SqlResult = { columns: string[]; values: unknown[][] };

declare global {
  interface Window {
    initSqlJs?: (cfg: { locateFile: (f: string) => string }) => Promise<{ Database: new () => { run: (s: string) => void; exec: (s: string) => SqlResult[]; close: () => void } }>;
  }
}

function loadSqlJs() {
  return new Promise<NonNullable<Window["initSqlJs"]>>((resolve, reject) => {
    if (window.initSqlJs) return resolve(window.initSqlJs);
    const s = document.createElement("script");
    s.src = "/vendor/sql-wasm.js";
    s.onload = () => (window.initSqlJs ? resolve(window.initSqlJs) : reject(new Error("sql.js indisponível")));
    s.onerror = () => reject(new Error("Falha ao carregar sql.js"));
    document.head.appendChild(s);
  });
}

function normalize(r: SqlResult | undefined, orderMatters: boolean) {
  const rows = (r?.values ?? []).map((row) => JSON.stringify(row.map((v) => (typeof v === "number" ? Math.round(v * 1000) / 1000 : v))));
  return orderMatters ? rows : [...rows].sort();
}

function SqlLab({ exerciseId, payload, solution }: { exerciseId: string; payload: Payload; solution: string }) {
  const [sql, setSql] = useState("SELECT * FROM processo;");
  const [result, setResult] = useState<SqlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [show, setShow] = useState(false);
  const [, start] = useTransition();
  const started = useRef(Date.now());

  const run = async (check: boolean) => {
    setError(null);
    setVerdict(null);
    try {
      const init = await loadSqlJs();
      const SQL = await init({ locateFile: () => "/vendor/sql-wasm.wasm" });
      // banco novo em memória a cada execução: nada persiste, nada roda no servidor
      const db = new SQL.Database();
      db.run(payload.schema ?? "");
      const out = db.exec(sql);
      const last = out[out.length - 1];
      setResult(last ?? { columns: [], values: [] });
      if (check) {
        const ref = new SQL.Database();
        ref.run(payload.schema ?? "");
        const exp = ref.exec(payload.expectedSql ?? "");
        const ok = JSON.stringify(normalize(last, !!payload.orderMatters)) === JSON.stringify(normalize(exp[exp.length - 1], !!payload.orderMatters));
        setVerdict(ok);
        ref.close();
        start(() => recordLabAttempt(exerciseId, ok, sql, (Date.now() - started.current) / 1000));
      }
      db.close();
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const tables = [...(payload.schema ?? "").matchAll(/CREATE TABLE (\w+) \(([^;]+)\);/g)].map((m) => ({ name: m[1], cols: m[2].split(",").map((c) => c.trim().split(" ")[0]) }));

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Esquema disponível</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {tables.map((t) => <code key={t.name} className="rounded-lg bg-surface-2 px-2 py-1">{t.name}({t.cols.join(", ")})</code>)}
        </div>
      </Card>
      <Card className="p-4">
        <label htmlFor="sql" className="text-sm font-medium">Sua consulta (SQLite, executada no seu navegador)</label>
        <textarea id="sql" value={sql} onChange={(e) => setSql(e.target.value)} rows={7} spellCheck={false} className="mt-2 w-full rounded-xl border border-border bg-[#0f1117] p-3 font-mono text-sm text-[#e6e6e6]" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => run(false)}><Play className="size-4" /> Executar</Button>
          <Button onClick={() => run(true)}><CheckCircle2 className="size-4" /> Verificar resposta</Button>
          <Button variant="ghost" onClick={() => setShow(!show)}><Eye className="size-4" /> {show ? "Ocultar" : "Ver"} solução</Button>
        </div>
        {verdict !== null && <Notice tone={verdict ? "success" : "danger"} className="mt-3">{verdict ? "Correto! O resultado bate com o esperado." : "O resultado é diferente do esperado. Confira filtros, colunas e ordenação."}</Notice>}
        {error && <Notice tone="danger" className="mt-3">Erro de SQL: {error}</Notice>}
        {show && <pre className="mt-3 overflow-auto rounded-xl bg-[#0f1117] p-3 text-sm text-[#e6e6e6]">{solution}</pre>}
      </Card>
      {result && (
        <Card className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs"><tr>{result.columns.map((c) => <th key={c} className="px-3 py-2">{c}</th>)}</tr></thead>
            <tbody>{result.values.map((r, i) => <tr key={i} className="border-t border-border">{r.map((v, j) => <td key={j} className="px-3 py-1.5">{String(v)}</td>)}</tr>)}</tbody>
          </table>
          {!result.values.length && <p className="p-3 text-sm text-muted">Nenhuma linha retornada.</p>}
        </Card>
      )}
    </div>
  );
}

function StepsLab({ exerciseId, steps, solution }: { exerciseId: string; steps: Step[]; solution: string }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(steps.map(() => null));
  const [, start] = useTransition();
  const started = useRef(Date.now());
  const finished = answers.every((a) => a !== null);
  const score = answers.filter((a, k) => a === steps[k].correct).length;

  useEffect(() => {
    if (finished) start(() => recordLabAttempt(exerciseId, score === steps.length, JSON.stringify(answers), (Date.now() - started.current) / 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  return (
    <div className="space-y-3">
      {steps.slice(0, i + 1).map((s, k) => {
        const a = answers[k];
        return (
          <Card key={k} className="animate-fade-up p-5">
            <div className="mb-2 flex items-center gap-2 text-xs"><Badge tone="accent">Etapa {k + 1} de {steps.length}</Badge></div>
            <p className="font-medium">{s.question}</p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {s.options.map((o, j) => (
                <button
                  key={j}
                  disabled={a !== null}
                  onClick={() => {
                    const n = [...answers];
                    n[k] = j;
                    setAnswers(n);
                    if (k === i && i < steps.length - 1) setTimeout(() => setI(i + 1), 400);
                  }}
                  className={cn("rounded-xl border px-4 py-2.5 text-left text-sm transition", a === null && "border-border hover:border-accent", a !== null && j === s.correct && "border-success bg-teal-soft", a === j && j !== s.correct && "border-danger bg-accent-soft", a !== null && j !== s.correct && a !== j && "border-border opacity-60")}
                >
                  {o}
                </button>
              ))}
            </div>
            {a !== null && (
              <p className={cn("mt-3 flex items-start gap-2 text-sm", a === s.correct ? "text-success" : "text-danger")}>
                {a === s.correct ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
                <span className="text-text">{s.feedback}</span>
              </p>
            )}
          </Card>
        );
      })}
      {finished && (
        <Card className="p-5">
          <p className="font-semibold">Resultado: {score}/{steps.length} etapas corretas</p>
          <p className="mt-1 text-sm text-muted">Resumo da solução: {solution}</p>
          <Button variant="secondary" className="mt-3" onClick={() => { setAnswers(steps.map(() => null)); setI(0); started.current = Date.now(); }}><RotateCcw className="size-4" /> Refazer</Button>
        </Card>
      )}
    </div>
  );
}

export function LabRunner({ exerciseId, kind, payload, solution }: { exerciseId: string; kind: string; payload: Payload; solution: string }) {
  if (kind === "SQL") return <SqlLab exerciseId={exerciseId} payload={payload} solution={solution} />;
  return <StepsLab exerciseId={exerciseId} steps={payload.steps ?? []} solution={solution} />;
}
