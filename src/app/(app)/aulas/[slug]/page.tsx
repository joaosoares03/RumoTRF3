import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Markdown, tocFromMarkdown } from "@/components/markdown";
import { LessonTools } from "@/components/lesson-tools";
import { QuestionPlayer } from "@/components/question-player";
import { loadPlayerQuestions } from "@/lib/questions";
import { PlayCircle } from "lucide-react";
import { Badge, Card, CardBody, CardHeader, PageHeader } from "@/components/ui";
import { VideoGallery, type GalleryVideo } from "@/components/video-gallery";
import { formatDate } from "@/lib/utils";

/** Títulos verificados vêm no formato "Título — Canal" (oEmbed). */
function splitTitle(title: string, provider: string): [string, string] {
  const i = title.lastIndexOf(" — ");
  if (i > 0) return [title.slice(0, i), title.slice(i + 3)];
  return [title, provider.replace(/^YouTube · /, "")];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await db.lesson.findUnique({ where: { slug }, select: { title: true } });
  return { title: l?.title ?? "Aula" };
}

export default async function AulaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: {
      topic: { include: { module: { include: { discipline: true } }, lessons: { select: { slug: true, title: true } } } },
      progress: { where: { userId: user.id } },
      highlights: { where: { userId: user.id }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!lesson || lesson.status !== "PUBLICADO") notFound();
  const toc = tocFromMarkdown(lesson.content);
  const coveredIds = (await db.lessonCoverage.findMany({ where: { lessonId: lesson.id }, select: { topicId: true } })).map((c) => c.topicId);
  const topicIds = [lesson.topicId, ...coveredIds];
  const fix = await loadPlayerQuestions(user.id, { topicId: { in: topicIds }, status: "PUBLICADO" }, 5, false);

  // videoaulas verificadas: primeiro as do assunto principal, depois as dos assuntos que a aula também trata
  const videoLinks = await db.resourceTopic.findMany({
    where: { topicId: { in: topicIds }, resource: { type: "VIDEO", status: "PUBLICADO", verificationStatus: "VERIFICADO" } },
    include: { resource: true, topic: { select: { title: true } } },
  });
  const seen = new Set<string>();
  const videos: GalleryVideo[] = videoLinks
    .sort((a, b) => topicIds.indexOf(a.topicId) - topicIds.indexOf(b.topicId))
    .filter((v) => (seen.has(v.resourceId) ? false : (seen.add(v.resourceId), true)))
    .slice(0, 8)
    .map((v) => {
      const [title, channel] = splitTitle(v.resource.title, v.resource.provider);
      return { id: v.resourceId, url: v.resource.url, title, channel, topic: v.topic.title, primary: v.topicId === lesson.topicId };
    });
  const p = lesson.progress[0];
  // aulas da mesma disciplina para navegação
  const siblings = await db.lesson.findMany({
    where: { status: "PUBLICADO", topic: { module: { disciplineId: lesson.topic.module.disciplineId } } },
    select: { slug: true, title: true },
    orderBy: [{ topic: { module: { order: "asc" } } }, { topic: { order: "asc" } }],
  });
  const i = siblings.findIndex((s) => s.slug === slug);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[220px_1fr_300px]">
      <nav className="hidden xl:block" aria-label="Sumário da aula">
        <div className="sticky top-20 space-y-1 text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Sumário</div>
          {videos.length > 0 && <a href="#videoaula" className="block rounded-lg px-2 py-1 text-muted hover:bg-surface-2 hover:text-text">Videoaula</a>}
          {toc.map((h) => (
            <a key={h.id} href={`#${h.id}`} className={`block truncate rounded-lg px-2 py-1 text-muted hover:bg-surface-2 hover:text-text ${h.level === 3 ? "pl-5 text-xs" : ""}`}>
              {h.text}
            </a>
          ))}
          <a href="#fixacao" className="block rounded-lg px-2 py-1 text-muted hover:bg-surface-2 hover:text-text">Exercícios de fixação</a>
        </div>
      </nav>

      <article className="min-w-0">
        <div className="mb-2 text-xs text-muted">
          <Link href={`/disciplinas/${lesson.topic.module.discipline.slug}`} className="hover:text-accent">{lesson.topic.module.discipline.name}</Link> ›{" "}
          <Link href={`/assuntos/${lesson.topicId}`} className="hover:text-accent">{lesson.topic.title}</Link>
        </div>
        <PageHeader
          title={lesson.title}
          description={
            <span className="flex flex-wrap gap-1.5">
              <Badge tone="amber">Conteúdo autoral</Badge>
              <Badge>{lesson.estimatedMinutes} min</Badge>
              <Badge>versão {lesson.version} · {formatDate(lesson.updatedAt)}</Badge>
              {p?.completedAt && <Badge tone="success">Concluída em {formatDate(p.completedAt)}</Badge>}
            </span>
          }
        />
        {videos.length > 0 && (
          <Card id="videoaula" className="mb-6 scroll-mt-20">
            <CardHeader
              title="Videoaula"
              subtitle={videos.length > 1 ? `${videos.length} vídeos sobre o conteúdo desta aula — escolha abaixo` : "Assista antes ou depois da leitura"}
              icon={<PlayCircle className="size-4" />}
            />
            <CardBody>
              <VideoGallery videos={videos} />
            </CardBody>
          </Card>
        )}
        <Card>
          <CardBody className="p-6 sm:p-8" id="lesson-body">
            <Markdown>{lesson.content}</Markdown>
          </CardBody>
        </Card>

        <Card className="mt-6 border-teal/30">
          <CardBody>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal">Resumo para revisão</div>
            <p className="text-sm leading-relaxed">{lesson.summary}</p>
          </CardBody>
        </Card>

        <section id="fixacao" className="mt-8 scroll-mt-20">
          <h2 className="mb-3 font-display text-xl font-semibold">Exercícios de fixação</h2>
          <QuestionPlayer questions={fix} />
        </section>

        <div className="mt-8 flex justify-between gap-3 text-sm">
          {i > 0 ? <Link href={`/aulas/${siblings[i - 1].slug}`} className="text-accent">← {siblings[i - 1].title}</Link> : <span />}
          {i >= 0 && i < siblings.length - 1 ? <Link href={`/aulas/${siblings[i + 1].slug}`} className="text-right text-accent">{siblings[i + 1].title} →</Link> : <span />}
        </div>
      </article>

      <aside className="xl:sticky xl:top-20 xl:self-start">
        <LessonTools lessonId={lesson.id} title={lesson.title} completed={!!p?.completedAt} favorite={!!p?.favorite} highlights={lesson.highlights.map((h) => ({ id: h.id, text: h.text, note: h.note }))} />
      </aside>
    </div>
  );
}
