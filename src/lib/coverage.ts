import "server-only";
import { db } from "./db";

/** Cobertura de conteúdo por assunto: aulas, recursos verificados, questões, flashcards e laboratórios. */
export async function contentCoverage(topicIds?: string[]) {
  const where = topicIds ? { id: { in: topicIds } } : {};
  const topics = await db.topic.findMany({
    where,
    select: {
      id: true,
      _count: {
        select: {
          lessons: { where: { status: "PUBLICADO" } },
          lessonCovers: { where: { lesson: { status: "PUBLICADO" } } },
          questions: { where: { status: "PUBLICADO" } },
          flashcards: true,
          labs: true,
        },
      },
      resources: { select: { resource: { select: { verificationStatus: true, status: true } } } },
    },
  });
  const map = new Map<string, { lessons: number; questions: number; flashcards: number; labs: number; resources: number; verifiedResources: number }>();
  for (const t of topics) {
    map.set(t.id, {
      lessons: t._count.lessons + t._count.lessonCovers,
      questions: t._count.questions,
      flashcards: t._count.flashcards,
      labs: t._count.labs,
      resources: t.resources.length,
      verifiedResources: t.resources.filter((r) => r.resource.verificationStatus === "VERIFICADO" && r.resource.status === "PUBLICADO").length,
    });
  }
  return map;
}

export function coverageSummary(map: Map<string, { lessons: number; questions: number; verifiedResources: number; flashcards: number }>) {
  const vals = [...map.values()];
  const n = vals.length || 1;
  const pct = (k: (v: (typeof vals)[number]) => boolean) => Math.round((vals.filter(k).length / n) * 100);
  return {
    topics: vals.length,
    withLesson: pct((v) => v.lessons > 0),
    withResource: pct((v) => v.verifiedResources > 0),
    withQuestion: pct((v) => v.questions > 0),
    withFlashcard: pct((v) => v.flashcards > 0),
    complete: pct((v) => v.lessons > 0 && v.verifiedResources > 0 && v.questions > 0),
    gaps: vals.filter((v) => !v.lessons || !v.verifiedResources || !v.questions).length,
  };
}
