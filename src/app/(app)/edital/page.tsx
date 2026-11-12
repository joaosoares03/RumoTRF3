import Link from "next/link";
import { FileText, Filter } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getPrefs, masteryLevel, scopeOf, topicPercent } from "@/lib/data";
import { editalProgress } from "@/lib/stats";
import { contentCoverage, coverageSummary } from "@/lib/coverage";
import { setTopicStatus } from "@/app/actions/study";
import { AutoSubmitForm } from "@/components/auto-submit";
import { Badge, Card, CardBody, PageHeader, Progress, StatCard, inputClass } from "@/components/ui";
import { cn, formatDate, STATUS_LABEL } from "@/lib/utils";

export const metadata = { title: "Edital verticalizado" };

const PRIORITY = { 1: "Alta", 2: "Média", 3: "Baixa" } as Record<number, string>;

export default async function EditalPage({ searchParams }: { searchParams: Promise<{ disciplina?: string; status?: string; filtro?: string; q?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const { disciplines, stats, overall } = await editalProgress(user.id, [active]);
  const topicIds = disciplines.flatMap((d) => d.modules.flatMap((m) => m.topics.map((t) => t.id)));
  const cov = await contentCoverage(topicIds);
  const summary = coverageSummary(cov);
  const now = new Date();

  const rows = disciplines.flatMap((d) =>
    d.modules.flatMap((m) =>
      m.topics.map((t) => {
        const s = stats.get(t.id)!;
        const c = cov.get(t.id)!;
        return { d, m, t, s, c, pct: topicPercent(s.progress?.status, s.checked, t.subtopics.length), status: s.progress?.status ?? "NAO_INICIADO" };
      }),
    ),
  );
  const q = (sp.q ?? "").toLowerCase();
  const filtered = rows.filter((r) => {
    if (sp.disciplina && r.d.slug !== sp.disciplina) return false;
    if (sp.status && r.status !== sp.status) return false;
    if (sp.filtro === "revisao" && !(r.s.progress?.nextReviewAt && r.s.progress.nextReviewAt <= now)) return false;
    if (sp.filtro === "sem-aula" && r.c.lessons > 0) return false;
    if (sp.filtro === "sem-material" && r.c.verifiedResources > 0) return false;
    if (sp.filtro === "sem-questao" && r.c.questions > 0) return false;
    if (q && !r.t.title.toLowerCase().includes(q)) return false;
    return true;
  });
  const statusCount = (s: string) => rows.filter((r) => r.status === s).length;

  return (
    <div>
      <PageHeader
        eyebrow={`Anexo VI · ${active === "DEV" ? "Cargo 006 — Desenvolvimento de Sistemas" : "Cargo 007 — Suporte Técnico"}`}
        title="Edital verticalizado"
        description="Todos os assuntos do conteúdo programático oficial (Edital nº 01/2026, com retificação nº 02/2026), com seu progresso real e a cobertura de conteúdo da plataforma. Alterne a especialidade no topo da página."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Estudado" value={`${overall}%`} hint={`${rows.length} assuntos`} />
        <StatCard label="Não iniciados" value={statusCount("NAO_INICIADO")} />
        <StatCard label="Em estudo" value={statusCount("EM_ESTUDO")} />
        <StatCard label="Revisando" value={statusCount("REVISANDO")} />
        <StatCard label="Dominados" value={statusCount("DOMINADO")} />
        <StatCard label="Com aula" value={`${summary.withLesson}%`} hint="cobertura de aulas" />
        <StatCard label="Com questões" value={`${summary.withQuestion}%`} hint={`materiais verificados: ${summary.withResource}%`} />
      </div>

      <Card className="mb-4">
        <CardBody className="py-4">
          <form className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_180px_200px_auto]">
            <input name="q" defaultValue={sp.q} placeholder="Filtrar assunto..." className={inputClass} aria-label="Filtrar por texto" />
            <select name="disciplina" defaultValue={sp.disciplina ?? ""} className={inputClass} aria-label="Disciplina">
              <option value="">Todas as disciplinas</option>
              {disciplines.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
            <select name="status" defaultValue={sp.status ?? ""} className={inputClass} aria-label="Status">
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select name="filtro" defaultValue={sp.filtro ?? ""} className={inputClass} aria-label="Lacunas">
              <option value="">Sem filtro de lacunas</option>
              <option value="revisao">Revisão vencida</option>
              <option value="sem-aula">Assuntos sem aula</option>
              <option value="sem-material">Sem material verificado</option>
              <option value="sem-questao">Sem questões</option>
            </select>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-2 px-4 py-2 text-sm font-medium hover:bg-border/60">
              <Filter className="size-4" /> Filtrar
            </button>
          </form>
        </CardBody>
      </Card>

      <p className="mb-2 text-xs text-muted">
        {filtered.length} de {rows.length} assuntos. % estudado: Não iniciado 0% · Em estudo 40% · Revisando 75% · Dominado 100% (ou a fração de subassuntos marcados, se maior). Domínio: taxa de acerto real (mín. 5 respostas).
      </p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Assunto (texto do edital)</th>
                <th className="px-3 py-3">Disciplina</th>
                <th className="px-3 py-3 w-32">% estudado</th>
                <th className="px-3 py-3">Questões</th>
                <th className="px-3 py-3">Domínio</th>
                <th className="px-3 py-3">Revisões</th>
                <th className="px-3 py-3">Conteúdo</th>
                <th className="px-3 py-3">Status / prioridade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ d, m, t, s, c, pct, status }) => {
                const ml = masteryLevel(s.answered, s.correct);
                const late = s.progress?.nextReviewAt && s.progress.nextReviewAt <= now;
                return (
                  <tr key={t.id} className="border-t border-border align-top hover:bg-surface-2/40">
                    <td className="max-w-[380px] px-4 py-3">
                      <Link href={`/assuntos/${t.id}`} className="font-medium hover:text-accent">
                        {t.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                        <FileText className="size-3" /> {t.editalRef.replace(" (", " · ").replace(")", "")}
                      </div>
                      {t.subtopics.length > 0 && <div className="mt-1 text-[11px] text-muted">{s.checked}/{t.subtopics.length} subassuntos</div>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs">{d.name}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted">
                        {m.name} · {d.kind === "GERAL" ? "Gerais (compartilhado)" : d.specialty?.key === "DEV" ? "Específico 006" : "Específico 007"}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="mb-1 text-xs tabular-nums">{pct}%</div>
                      <Progress value={pct} color={d.color} />
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {s.answered}
                      <div className="text-[11px] text-muted">{s.answered ? `${Math.round((s.correct / s.answered) * 100)}% acertos` : "—"}</div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={ml.tone}>{ml.label}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <div>Última: {s.progress?.lastReviewedAt ? formatDate(s.progress.lastReviewedAt) : s.progress?.lastStudiedAt ? `estudo ${formatDate(s.progress.lastStudiedAt)}` : "—"}</div>
                      <div className={cn(late && "font-semibold text-accent")}>Próxima: {s.progress?.nextReviewAt ? formatDate(s.progress.nextReviewAt) : "—"}</div>
                    </td>
                    <td className="px-3 py-3 text-[11px]">
                      <div className={c.lessons ? "" : "text-danger"}>{c.lessons ? `${c.lessons} aula(s)` : "sem aula"}</div>
                      <div className={c.verifiedResources ? "" : "text-danger"}>{c.verifiedResources ? `${c.verifiedResources} material(is)` : "sem material verificado"}</div>
                      <div className={c.questions ? "" : "text-danger"}>{c.questions ? `${c.questions} questão(ões)` : "sem questões"}</div>
                    </td>
                    <td className="px-3 py-3">
                      <AutoSubmitForm action={setTopicStatus} className="space-y-1.5">
                        <input type="hidden" name="topicId" value={t.id} />
                        <select name="status" defaultValue={status} aria-label={`Status de ${t.title}`} className="w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs">
                          {Object.entries(STATUS_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <select name="priority" defaultValue={s.progress?.priority ?? 2} aria-label={`Prioridade de ${t.title}`} className="w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs">
                          {[1, 2, 3].map((p) => (
                            <option key={p} value={p}>
                              Prioridade {PRIORITY[p]}
                            </option>
                          ))}
                        </select>
                      </AutoSubmitForm>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
