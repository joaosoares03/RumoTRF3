import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CircleHelp, Library } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTopicStats, topicPercent } from "@/lib/data";
import { contentCoverage } from "@/lib/coverage";
import { Badge, ButtonLink, Card, CardBody, PageHeader, Progress } from "@/components/ui";
import { STATUS_LABEL } from "@/lib/utils";

export default async function DisciplinaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const d = await db.discipline.findUnique({
    where: { slug },
    include: {
      specialty: true,
      modules: { orderBy: { order: "asc" }, include: { topics: { orderBy: { order: "asc" }, include: { subtopics: true, lessons: { select: { slug: true, title: true, estimatedMinutes: true } } } } } },
    },
  });
  if (!d) notFound();
  const ids = d.modules.flatMap((m) => m.topics.map((t) => t.id));
  const [stats, cov] = await Promise.all([getTopicStats(user.id, ids), contentCoverage(ids)]);
  return (
    <div>
      <PageHeader
        eyebrow={d.kind === "GERAL" ? "Conhecimentos Gerais · peso 1 · compartilhada" : `Conhecimentos Específicos · peso 2 · ${d.specialty?.code} ${d.specialty?.shortName}`}
        title={d.name}
        description={d.editalRef}
        actions={<ButtonLink href={`/questoes/resolver?disciplina=${d.id}`}>Questões da disciplina</ButtonLink>}
      />
      <Card className="mb-6">
        <CardBody>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Texto oficial do edital</div>
          <p className="text-sm leading-relaxed">{d.editalText}</p>
        </CardBody>
      </Card>
      <div className="space-y-6">
        {d.modules.map((m) => (
          <section key={m.id}>
            <h2 className="mb-2 font-display text-lg font-semibold">{m.name}</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {m.topics.map((t) => {
                const s = stats.get(t.id)!;
                const c = cov.get(t.id)!;
                const pct = topicPercent(s.progress?.status, s.checked, t.subtopics.length);
                return (
                  <Card key={t.id} className="p-4">
                    <Link href={`/assuntos/${t.id}`} className="font-medium leading-snug hover:text-accent">
                      {t.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                      <Badge tone={s.progress?.status === "DOMINADO" ? "success" : s.progress?.status ? "amber" : "neutral"}>{STATUS_LABEL[s.progress?.status ?? "NAO_INICIADO"]}</Badge>
                      <Badge>
                        <BookOpen className="size-3" /> {c.lessons}
                      </Badge>
                      <Badge>
                        <Library className="size-3" /> {c.verifiedResources}
                      </Badge>
                      <Badge>
                        <CircleHelp className="size-3" /> {c.questions}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={pct} color={d.color} />
                      <span className="text-xs text-muted">{pct}%</span>
                    </div>
                    {t.lessons[0] && (
                      <Link href={`/aulas/${t.lessons[0].slug}`} className="mt-3 inline-block text-xs font-medium text-accent">
                        Aula: {t.lessons[0].title} ({t.lessons[0].estimatedMinutes} min) →
                      </Link>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
