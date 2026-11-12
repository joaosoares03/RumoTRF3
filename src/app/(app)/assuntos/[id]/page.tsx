import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CheckSquare, ExternalLink, FlaskConical, Layers, Library, RotateCcw, Square, PlayCircle, FileText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTopicStats, masteryLevel, topicPercent } from "@/lib/data";
import { markTopicReviewed, setTopicStatus, toggleSubtopic } from "@/app/actions/study";
import { AutoSubmitForm } from "@/components/auto-submit";
import { Badge, Button, ButtonLink, Card, CardBody, CardHeader, EmptyState, Notice, PageHeader, Progress } from "@/components/ui";
import { formatDate, STATUS_LABEL } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = { VIDEO: "Vídeo", DOCUMENTACAO: "Documentação", LEGISLACAO: "Legislação", ARTIGO: "Artigo", PDF: "PDF", CURSO: "Curso", NORMATIVO: "Normativo", FERRAMENTA: "Ferramenta" };

export default async function AssuntoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const t = await db.topic.findUnique({
    where: { id },
    include: {
      subtopics: { orderBy: { order: "asc" } },
      module: { include: { discipline: { include: { specialty: true } } } },
      lessons: { where: { status: "PUBLICADO" }, include: { progress: { where: { userId: user.id } } } },
      lessonCovers: { where: { lesson: { status: "PUBLICADO" } }, include: { lesson: { include: { progress: { where: { userId: user.id } } } } } },
      resources: { include: { resource: true } },
      _count: { select: { questions: { where: { status: "PUBLICADO" } }, flashcards: true } },
      labs: { select: { slug: true, title: true, kind: true } },
    },
  });
  if (!t) notFound();
  const stats = (await getTopicStats(user.id, [t.id])).get(t.id)!;
  const checks = new Set((await db.subtopicCheck.findMany({ where: { userId: user.id, subtopic: { topicId: t.id } } })).map((c) => c.subtopicId));
  const pct = topicPercent(stats.progress?.status, stats.checked, t.subtopics.length);
  const ml = masteryLevel(stats.answered, stats.correct);
  const d = t.module.discipline;
  const allLessons = [...t.lessons.map((l) => ({ l, primary: true })), ...t.lessonCovers.map((c) => ({ l: c.lesson, primary: false }))];
  const allVerified = t.resources.filter((r) => r.resource.status === "PUBLICADO" && r.resource.verificationStatus === "VERIFICADO");
  const videos = allVerified.filter((r) => r.resource.type === "VIDEO");
  const verified = allVerified.filter((r) => r.resource.type !== "VIDEO");
  const ytId = (u: string) => new URL(u).searchParams.get("v") ?? "";
  const pending = t.resources.filter((r) => !(r.resource.status === "PUBLICADO" && r.resource.verificationStatus === "VERIFICADO"));
  const notes = await db.note.findMany({ where: { userId: user.id, topicId: t.id }, orderBy: { updatedAt: "desc" }, take: 5 });

  return (
    <div>
      <div className="mb-2 text-xs text-muted">
        <Link href="/disciplinas" className="hover:text-accent">Disciplinas</Link> › <Link href={`/disciplinas/${d.slug}`} className="hover:text-accent">{d.name}</Link> › {t.module.name}
      </div>
      <PageHeader title={t.title} description={<><FileText className="mr-1 inline size-3.5" />{t.editalRef}{t.editalExcerpt !== t.title && <span className="mt-1 block italic">Trecho do edital: “{t.editalExcerpt}”</span>}</>} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Aulas autorais" subtitle="Explicação básica, aprofundamento, exemplos, pegadinhas e resumo" icon={<BookOpen className="size-4" />} />
            <CardBody>
              {allLessons.length ? (
                <ul className="space-y-2">
                  {allLessons.map(({ l, primary }) => (
                    <li key={l.id}>
                      <Link href={`/aulas/${l.slug}`} className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-accent">
                        <PlayCircle className="size-5 text-accent" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{l.title}</div>
                          <div className="text-xs text-muted">{l.estimatedMinutes} min · conteúdo autoral da plataforma{primary ? "" : " · aula que também trata deste assunto"}</div>
                        </div>
                        {l.progress[0]?.completedAt && <Badge tone="success">Concluída</Badge>}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Aula autoral ainda não produzida" description="Este assunto está no relatório de lacunas (docs/relatorios/lacunas.md). Enquanto isso, use os materiais oficiais e as questões." />
              )}
            </CardBody>
          </Card>

          {videos.length > 0 && (
            <Card>
              <CardHeader title="Videoaulas" subtitle="Vídeos públicos do YouTube (conteúdo de terceiros), com título e canal conferidos pelo oEmbed oficial" icon={<PlayCircle className="size-4" />} />
              <CardBody className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {videos.map(({ resource: r }) => (
                  <div key={r.id}>
                    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId(r.url)}`}
                        title={r.title}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="size-full"
                      />
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm font-medium hover:text-accent">{r.title}</a>
                    <div className="text-[11px] text-muted">{r.provider}{r.verifiedAt ? ` · verificado em ${formatDate(r.verifiedAt)}` : ""}</div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Materiais e referências" subtitle="Somente links verificados (HTTP + conteúdo esperado) são exibidos como verificados" icon={<Library className="size-4" />} />
            <CardBody className="space-y-2">
              {verified.map(({ resource: r }) => (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:border-accent">
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      <Badge tone={r.category === "OFICIAL" ? "teal" : "neutral"}>{r.category === "OFICIAL" ? "Fonte oficial" : "Complementar"}</Badge>
                      <Badge>{TYPE_LABEL[r.type] ?? r.type}</Badge>
                      <Badge>{r.provider}</Badge>
                      <Badge>{r.language === "en" ? "Inglês" : "Português"}</Badge>
                      {r.verifiedAt && <Badge tone="success">verificado em {formatDate(r.verifiedAt)}</Badge>}
                    </div>
                  </div>
                </a>
              ))}
              {pending.map(({ resource: r }) => (
                <div key={r.id} className="flex items-start gap-3 rounded-xl border border-dashed border-border p-3 opacity-80">
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted" />
                  <div className="text-sm">
                    {r.title} <Badge tone="amber">pendente de verificação ({r.verificationStatus.toLowerCase()})</Badge>
                  </div>
                </div>
              ))}
              {!t.resources.length && <EmptyState title="Nenhum material cadastrado" description="Lacuna registrada. Materiais podem ser adicionados no painel administrativo ou via importação em lote." />}
              
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-xs uppercase text-muted">Questões</div>
              <div className="font-display text-2xl font-semibold">{t._count.questions}</div>
              <ButtonLink href={`/questoes/resolver?assunto=${t.id}`} variant="secondary" className="mt-2 w-full">Resolver</ButtonLink>
            </Card>
            <Card className="p-4">
              <div className="text-xs uppercase text-muted">Flashcards</div>
              <div className="font-display text-2xl font-semibold">{t._count.flashcards}</div>
              <ButtonLink href={`/flashcards/revisar?assunto=${t.id}`} variant="secondary" className="mt-2 w-full"><Layers className="size-4" /> Revisar</ButtonLink>
            </Card>
            <Card className="p-4">
              <div className="text-xs uppercase text-muted">Laboratório</div>
              <div className="font-display text-2xl font-semibold">{t.labs.length}</div>
              {t.labs[0] ? <ButtonLink href={`/laboratorio/${t.labs[0].slug}`} variant="secondary" className="mt-2 w-full"><FlaskConical className="size-4" /> Praticar</ButtonLink> : <p className="mt-2 text-xs text-muted">Sem atividade prática</p>}
            </Card>
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Seu progresso" />
            <CardBody className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Estudado</span>
                  <span>{pct}%</span>
                </div>
                <Progress value={pct} color={d.color} />
              </div>
              <AutoSubmitForm action={setTopicStatus}>
                <input type="hidden" name="topicId" value={t.id} />
                <label className="text-xs font-medium" htmlFor="st">Status</label>
                <select id="st" name="status" defaultValue={stats.progress?.status ?? "NAO_INICIADO"} className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </AutoSubmitForm>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-surface-2 p-3">
                  <div className="text-xs text-muted">Domínio</div>
                  <Badge tone={ml.tone}>{ml.label}</Badge>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <div className="text-xs text-muted">Acertos</div>
                  <div className="font-semibold">{stats.answered ? `${stats.correct}/${stats.answered}` : "—"}</div>
                </div>
              </div>
              <div className="text-xs text-muted">
                Última revisão: {stats.progress?.lastReviewedAt ? formatDate(stats.progress.lastReviewedAt) : "—"}
                <br />
                Próxima revisão: {stats.progress?.nextReviewAt ? formatDate(stats.progress.nextReviewAt) : "—"}
              </div>
              <form action={markTopicReviewed}>
                <input type="hidden" name="topicId" value={t.id} />
                <Button variant="secondary" className="w-full"><RotateCcw className="size-4" /> Registrar revisão</Button>
              </form>
            </CardBody>
          </Card>

          {t.subtopics.length > 0 && (
            <Card>
              <CardHeader title="Subassuntos" subtitle="Enumeração do próprio edital" />
              <CardBody className="space-y-1">
                {t.subtopics.map((s) => (
                  <form key={s.id} action={toggleSubtopic}>
                    <input type="hidden" name="subtopicId" value={s.id} />
                    <button className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface-2">
                      {checks.has(s.id) ? <CheckSquare className="mt-0.5 size-4 shrink-0 text-success" /> : <Square className="mt-0.5 size-4 shrink-0 text-muted" />}
                      <span className={checks.has(s.id) ? "text-muted line-through" : ""}>{s.title}</span>
                    </button>
                  </form>
                ))}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Suas anotações" action={<ButtonLink href={`/caderno?nova=1&assunto=${t.id}`} variant="ghost" className="text-xs">Nova</ButtonLink>} />
            <CardBody className="space-y-2 text-sm">
              {notes.length ? notes.map((n) => <Link key={n.id} href={`/caderno?nota=${n.id}`} className="block truncate hover:text-accent">{n.title}</Link>) : <p className="text-muted">Nenhuma anotação para este assunto.</p>}
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
