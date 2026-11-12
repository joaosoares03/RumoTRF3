/** Relatório rápido: quantas aulas publicadas têm videoaula verificada (assunto principal ou assuntos cobertos). */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const verifiedVideo = { type: "VIDEO", status: "PUBLICADO", verificationStatus: "VERIFICADO" } as const;

async function main() {
  const lessons = await db.lesson.findMany({ where: { status: "PUBLICADO" }, select: { id: true, slug: true, topicId: true } });
  const covers = await db.lessonCoverage.findMany({ select: { lessonId: true, topicId: true } });
  const links = await db.resourceTopic.findMany({ where: { resource: verifiedVideo }, select: { topicId: true } });
  const withVideo = new Set(links.map((l) => l.topicId));
  let primary = 0;
  let any = 0;
  const missing: string[] = [];
  for (const l of lessons) {
    const ids = [l.topicId, ...covers.filter((c) => c.lessonId === l.id).map((c) => c.topicId)];
    if (withVideo.has(l.topicId)) primary++;
    if (ids.some((id) => withVideo.has(id))) any++;
    else missing.push(l.slug);
  }
  console.log(`Aulas: ${lessons.length} · com vídeo do assunto principal: ${primary} · com algum vídeo: ${any}`);
  if (missing.length) console.log("Sem vídeo:", missing.join(", "));
}

main().finally(() => db.$disconnect());
