import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines } from "@/lib/data";
import { contentCoverage, coverageSummary } from "@/lib/coverage";
import { addEditalVersion, deleteResource, importAction, setLessonStatus, setQuestionStatus, setResourceStatus, updateExamDate, verifyResource } from "@/app/actions/admin";
import { Badge, Button, Card, CardBody, CardHeader, Field, Notice, PageHeader, StatCard, inputClass } from "@/components/ui";
import { cn, formatDate, localDateKey, parseJson } from "@/lib/utils";

export const metadata = { title: "Administração" };

const TABS = [
  ["visao", "Cobertura e lacunas"],
  ["recursos", "Materiais e links"],
  ["questoes", "Questões"],
  ["aulas", "Aulas"],
  ["importar", "Importação em lote"],
  ["edital", "Edital e versões"],
  ["historico", "Histórico"],
] as const;

const VS_TONE: Record<string, "success" | "danger" | "amber" | "neutral"> = { VERIFICADO: "success", QUEBRADO: "danger", INACESSIVEL: "amber", DIVERGENTE: "amber", NAO_VERIFICADO: "neutral" };

const EXAMPLES = {
  recursos: `[{
  "title": "Título exato da página",
  "url": "https://exemplo.gov.br/pagina",
  "type": "DOCUMENTACAO",
  "provider": "Órgão ou site",
  "language": "pt-BR",
  "category": "OFICIAL",
  "topics": ["etica-lgpd"],
  "expect": "texto que deve existir na página"
}]`,
  questoes: `[{
  "code": "DEV-200", "topic": "dev-sql", "difficulty": 2, "origin": "AUTORAL",
  "statement": "Enunciado...",
  "alternatives": [
    {"text": "A...", "correct": false, "why": "Por que está errada"},
    {"text": "B...", "correct": true,  "why": "Por que está correta"},
    {"text": "C...", "correct": false, "why": "..."},
    {"text": "D...", "correct": false, "why": "..."},
    {"text": "E...", "correct": false, "why": "..."}
  ],
  "explanation": "Gabarito fundamentado...",
  "reference": "Fonte verificável"
}]`,
  aulas: `[{ "slug": "minha-aula", "topic": "dev-kafka", "title": "Título", "minutes": 20, "summary": "Resumo...", "content": "## Para começar\\n..." }]`,
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ aba?: string; relatorio?: string; erro?: string; status?: string }> }) {
  const sp = await searchParams;
  const admin = await requireAdmin();
  const tab = TABS.some(([k]) => k === sp.aba) ? sp.aba! : "visao";

  return (
    <div>
      <PageHeader title="Painel administrativo" description={`Gestão do acervo: tópicos, materiais, questões, aulas, fontes, links quebrados e versões do edital. Acesso restrito (${admin.email}).`} />
      <nav className="mb-6 flex flex-wrap gap-1 rounded-2xl bg-surface-2 p-1 text-sm" aria-label="Seções do painel">
        {TABS.map(([k, l]) => (
          <Link key={k} href={`/admin?aba=${k}`} className={cn("rounded-xl px-3 py-1.5", tab === k ? "bg-surface font-semibold shadow-sm" : "text-muted hover:text-text")}>{l}</Link>
        ))}
      </nav>
      {sp.erro === "publicar-sem-verificar" && <Notice tone="danger" className="mb-4">Um recurso só pode ser publicado depois de verificado.</Notice>}
      {tab === "visao" && <Coverage />}
      {tab === "recursos" && <Resources status={sp.status} />}
      {tab === "questoes" && <Questions />}
      {tab === "aulas" && <Lessons />}
      {tab === "importar" && <Import report={sp.relatorio} />}
      {tab === "edital" && <Edital />}
      {tab === "historico" && <History />}
    </div>
  );
}

async function Coverage() {
  const [dev, sup] = await Promise.all([getDisciplines(["DEV"]), getDisciplines(["SUP"])]);
  const rows = [];
  for (const [label, discs] of [["006 · Desenvolvimento (gerais + específicos)", dev], ["007 · Suporte Técnico (gerais + específicos)", sup]] as const) {
    const ids = discs.flatMap((d) => d.modules.flatMap((m) => m.topics.map((t) => t.id)));
    const cov = await contentCoverage(ids);
    rows.push({ label, s: coverageSummary(cov), discs, cov });
  }
  const [q, l, r, f, labs] = await Promise.all([db.question.count(), db.lesson.count(), db.resource.count(), db.flashcard.count({ where: { ownerId: null } }), db.labExercise.count()]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Questões" value={q} />
        <StatCard label="Aulas" value={l} />
        <StatCard label="Recursos" value={r} />
        <StatCard label="Flashcards oficiais" value={f} />
        <StatCard label="Laboratórios" value={labs} />
      </div>
      {rows.map(({ label, s, discs, cov }) => (
        <Card key={label}>
          <CardHeader title={label} subtitle={`${s.topics} assuntos · ${s.gaps} com alguma lacuna · ${s.complete}% completos (aula + material verificado + questões)`} />
          <CardBody>
            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">
              <div>Com aula: <strong>{s.withLesson}%</strong></div>
              <div>Com material verificado: <strong>{s.withResource}%</strong></div>
              <div>Com questões: <strong>{s.withQuestion}%</strong></div>
              <div>Com flashcards: <strong>{s.withFlashcard}%</strong></div>
            </div>
            <details>
              <summary className="cursor-pointer text-sm font-medium">Ver lacunas por assunto</summary>
              <table className="mt-3 w-full text-xs">
                <thead className="text-left text-muted"><tr><th className="py-1">Assunto</th><th>Aulas</th><th>Materiais ✔</th><th>Questões</th><th>Flashcards</th></tr></thead>
                <tbody>
                  {discs.flatMap((d) => d.modules.flatMap((m) => m.topics)).map((t) => {
                    const c = cov.get(t.id)!;
                    if (c.lessons && c.verifiedResources && c.questions) return null;
                    return (
                      <tr key={t.id} className="border-t border-border">
                        <td className="py-1 pr-2"><Link href={`/assuntos/${t.id}`} className="hover:text-accent">{t.title.slice(0, 90)}</Link> <span className="text-muted">({t.slug})</span></td>
                        <td className={c.lessons ? "" : "text-danger"}>{c.lessons}</td>
                        <td className={c.verifiedResources ? "" : "text-danger"}>{c.verifiedResources}</td>
                        <td className={c.questions ? "" : "text-danger"}>{c.questions}</td>
                        <td>{c.flashcards}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </details>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

async function Resources({ status }: { status?: string }) {
  const list = await db.resource.findMany({
    where: status ? { verificationStatus: status } : {},
    orderBy: [{ verificationStatus: "asc" }, { provider: "asc" }],
    include: { topics: { include: { topic: { select: { slug: true } } } }, checks: { orderBy: { checkedAt: "desc" }, take: 1 } },
  });
  return (
    <Card>
      <CardHeader title={`Recursos (${list.length})`} subtitle="Verificação = GET + texto esperado; vídeos do YouTube também pelo oEmbed. Execute em lote: npm run links:check" />
      <CardBody>
        <div className="mb-3 flex flex-wrap gap-1 text-xs">
          {["", "VERIFICADO", "NAO_VERIFICADO", "INACESSIVEL", "DIVERGENTE", "QUEBRADO"].map((s) => (
            <Link key={s} href={`/admin?aba=recursos${s ? `&status=${s}` : ""}`} className={cn("rounded-full px-2.5 py-1", (status ?? "") === s ? "bg-accent text-white" : "bg-surface-2")}>{s || "Todos"}</Link>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="text-left text-muted"><tr><th className="py-2">Recurso</th><th>Verificação</th><th>Publicação</th><th>Ações</th></tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="max-w-[420px] py-2 pr-2">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent">{r.title}</a>
                    <div className="truncate text-muted">{r.url}</div>
                    <div className="text-muted">{r.provider} · {r.type} · {r.language} · {r.category} · origem {r.origin} · {r.topics.map((t) => t.topic.slug).join(", ")}</div>
                  </td>
                  <td className="py-2">
                    <Badge tone={VS_TONE[r.verificationStatus] ?? "neutral"}>{r.verificationStatus}</Badge>
                    <div className="mt-1 text-muted">{r.httpStatus ? `HTTP ${r.httpStatus}` : ""} {r.verifiedAt ? `· ${formatDate(r.verifiedAt)}` : ""}</div>
                    {r.checks[0] && <div className="text-muted">{r.checks[0].message}</div>}
                  </td>
                  <td className="py-2"><Badge tone={r.status === "PUBLICADO" ? "success" : r.status === "REJEITADO" ? "danger" : "amber"}>{r.status}</Badge></td>
                  <td className="space-y-1 py-2">
                    <form action={verifyResource}><input type="hidden" name="id" value={r.id} /><Button variant="secondary" className="px-2 py-1 text-xs">Verificar agora</Button></form>
                    <form action={setResourceStatus} className="flex gap-1">
                      <input type="hidden" name="id" value={r.id} />
                      <select name="status" defaultValue={r.status} className="rounded border border-border bg-surface px-1 py-0.5" aria-label="Status de publicação"><option value="PUBLICADO">Publicar</option><option value="EM_REVISAO">Em revisão</option><option value="REJEITADO">Rejeitar</option></select>
                      <Button variant="ghost" className="px-2 py-0.5 text-xs">OK</Button>
                    </form>
                    <form action={deleteResource}><input type="hidden" name="id" value={r.id} /><Button variant="ghost" className="px-2 py-0.5 text-xs text-danger">Excluir</Button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

async function Questions() {
  const list = await db.question.findMany({ orderBy: { code: "asc" }, include: { topic: { select: { slug: true } }, alternatives: { select: { isCorrect: true, text: true } }, _count: { select: { answers: true } } } });
  const issues = (q: (typeof list)[number]) => {
    const p: string[] = [];
    if (q.alternatives.length !== 5) p.push(`${q.alternatives.length} alternativas`);
    if (q.alternatives.filter((a) => a.isCorrect).length !== 1) p.push("gabarito inválido");
    if (new Set(q.alternatives.map((a) => a.text.trim().toLowerCase())).size !== q.alternatives.length) p.push("alternativas repetidas");
    if (q.explanation.length < 20) p.push("sem justificativa");
    if (q.reference.length < 5) p.push("sem referência");
    return p;
  };
  const bad = list.filter((q) => issues(q).length);
  return (
    <Card>
      <CardHeader title={`Questões (${list.length})`} subtitle={`Validação automática: ${bad.length} com problema(s). Gabaritos e comentários editáveis via importação JSON (mesmo código = atualização).`} />
      <CardBody className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-xs">
          <thead className="text-left text-muted"><tr><th className="py-2">Código</th><th>Assunto</th><th>Origem</th><th>Validação</th><th>Respostas</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((q) => {
              const p = issues(q);
              return (
                <tr key={q.id} className="border-t border-border">
                  <td className="py-1.5 font-medium">{q.code}</td>
                  <td>{q.topic.slug}</td>
                  <td>{q.origin}{q.year ? ` ${q.year}` : ""}</td>
                  <td>{p.length ? <Badge tone="danger">{p.join(", ")}</Badge> : <Badge tone="success">ok</Badge>}</td>
                  <td>{q._count.answers}</td>
                  <td>
                    <form action={setQuestionStatus} className="flex gap-1">
                      <input type="hidden" name="id" value={q.id} />
                      <select name="status" defaultValue={q.status} className="rounded border border-border bg-surface px-1 py-0.5" aria-label="Status"><option>PUBLICADO</option><option>EM_REVISAO</option><option>RASCUNHO</option></select>
                      <Button variant="ghost" className="px-2 py-0.5 text-xs">OK</Button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

async function Lessons() {
  const list = await db.lesson.findMany({ orderBy: { slug: "asc" }, include: { topic: { select: { slug: true, title: true } }, _count: { select: { progress: true } } } });
  return (
    <Card>
      <CardHeader title={`Aulas (${list.length})`} subtitle="Para editar o texto, importe a aula com o mesmo slug (a versão é incrementada)." />
      <CardBody className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-xs">
          <thead className="text-left text-muted"><tr><th className="py-2">Aula</th><th>Assunto</th><th>Versão</th><th>Leitores</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="py-1.5"><Link href={`/aulas/${l.slug}`} className="font-medium hover:text-accent">{l.title}</Link></td>
                <td>{l.topic.slug}</td>
                <td>v{l.version} · {formatDate(l.updatedAt)}</td>
                <td>{l._count.progress}</td>
                <td>
                  <form action={setLessonStatus} className="flex gap-1">
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status} className="rounded border border-border bg-surface px-1 py-0.5" aria-label="Status"><option>PUBLICADO</option><option>RASCUNHO</option></select>
                    <Button variant="ghost" className="px-2 py-0.5 text-xs">OK</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function Import({ report }: { report?: string }) {
  const rep = report ? parseJson<{ created: number; updated: number; duplicates: string[]; errors: string[] } | null>(decodeURIComponent(report), null) : null;
  return (
    <div className="space-y-6">
      {rep && (
        <Notice tone={rep.errors.length ? "warning" : "success"}>
          <strong>Importação concluída:</strong> {rep.created} criado(s), {rep.updated} atualizado(s), {rep.duplicates.length} duplicado(s) ignorado(s), {rep.errors.length} erro(s).
          {rep.duplicates.length > 0 && <div className="mt-1 text-xs">Duplicados: {rep.duplicates.join(" · ")}</div>}
          {rep.errors.length > 0 && <ul className="mt-1 list-disc pl-5 text-xs">{rep.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
        </Notice>
      )}
      <Notice>
        Pipeline: <strong>validar</strong> (Zod) → <strong>detectar duplicados</strong> (URL, título normalizado, enunciado) → gravar <strong>em revisão</strong> → <strong>verificar links</strong> (aba Materiais ou <code>npm run links:check</code>) → <strong>publicar</strong>. Recursos nunca são marcados como verificados sem verificação real. A mesma importação existe por linha de comando: <code>npm run content:import -- arquivo.json</code>.
      </Notice>
      {(["recursos", "questoes", "aulas"] as const).map((k) => (
        <Card key={k}>
          <CardHeader title={k === "recursos" ? "Importar materiais/links" : k === "questoes" ? "Importar questões" : "Importar aulas"} subtitle="Cole um array JSON (até 500 itens)" />
          <CardBody>
            <form action={importAction} className="space-y-3">
              <input type="hidden" name="kind" value={k} />
              <textarea name="json" rows={10} required className={cn(inputClass, "font-mono text-xs")} placeholder={EXAMPLES[k]} />
              {k !== "recursos" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="publish" className="accent-[var(--accent)]" /> Publicar imediatamente (senão fica em revisão/rascunho)</label>}
              <Button>Validar e importar</Button>
            </form>
            <details className="mt-3"><summary className="cursor-pointer text-xs text-muted">Formato esperado</summary><pre className="mt-2 overflow-auto rounded-xl bg-surface-2 p-3 text-xs">{EXAMPLES[k]}</pre></details>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

async function Edital() {
  const exam = await db.exam.findFirstOrThrow({ include: { versions: { orderBy: { publishedAt: "desc" } } } });
  const [d, m, t, s] = await Promise.all([db.discipline.count(), db.module.count(), db.topic.count(), db.subtopic.count()]);
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader title="Estrutura cadastrada" subtitle="Fonte: content/edital.ts (Anexo VI). Alterações estruturais: edite o arquivo e rode npm run db:seed (idempotente)." />
        <CardBody className="space-y-2 text-sm">
          <p>{d} disciplinas · {m} módulos · {t} assuntos · {s} subassuntos</p>
          <form action={updateExamDate} className="flex items-end gap-2">
            <Field label="Data da prova"><input type="date" name="date" defaultValue={localDateKey(exam.examDate)} className={inputClass} /></Field>
            <Button variant="secondary">Atualizar</Button>
          </form>
          <p className="text-xs text-muted">Ao mudar a data, os usuários devem regenerar o plano no Planejador.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Versões do edital" />
        <CardBody className="space-y-3">
          {exam.versions.map((v) => <div key={v.id} className="text-sm"><strong>{v.number}</strong> — {v.title} <span className="text-xs text-muted">({formatDate(v.publishedAt)})</span></div>)}
          <form action={addEditalVersion} className="grid grid-cols-1 gap-2 border-t border-border pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Número"><input name="number" required placeholder="03/2026" className={inputClass} /></Field>
              <Field label="Publicação (DOU)"><input name="publishedAt" type="date" required className={inputClass} /></Field>
            </div>
            <Field label="Título"><input name="title" required className={inputClass} /></Field>
            <Field label="URL oficial (https)"><input name="url" type="url" required className={inputClass} /></Field>
            <Field label="Resumo das alterações"><textarea name="summary" required rows={3} className={inputClass} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="alert" defaultChecked className="accent-[var(--accent)]" /> Gerar alerta oficial para os usuários</label>
            <Button>Cadastrar versão</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

async function History() {
  const logs = await db.contentChangeLog.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: { select: { name: true } } } });
  return (
    <Card>
      <CardHeader title="Histórico de alterações do acervo" subtitle="Últimos 200 registros" />
      <CardBody className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-xs">
          <thead className="text-left text-muted"><tr><th className="py-2">Data</th><th>Entidade</th><th>Ação</th><th>Detalhes</th><th>Por</th></tr></thead>
          <tbody>{logs.map((l) => <tr key={l.id} className="border-t border-border"><td className="py-1.5">{formatDate(l.createdAt, { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>{l.entity}</td><td>{l.action}</td><td className="max-w-[420px] truncate">{l.details}</td><td>{l.user?.name ?? "sistema"}</td></tr>)}</tbody>
        </table>
      </CardBody>
    </Card>
  );
}
