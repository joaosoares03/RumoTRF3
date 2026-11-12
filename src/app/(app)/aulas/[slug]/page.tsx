import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Markdown, tocFromMarkdown } from "@/components/markdown";
import { LessonTools } from "@/components/lesson-tools";
import { QuestionPlayer } from "@/components/question-player";
import { loadPlayerQuestions } from "@/lib/questions";
import { Badge, Card, CardBody, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

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
  const fix = await loadPlayerQuestions(user.id, { topicId: { in: [lesson.topicId, ...(await db.lessonCoverage.findMany({ where: { lessonId: lesson.id }, select: { topicId: true } })).map((c) => c.topicId)] }, status: "PUBLICADO" }, 5, false);
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
