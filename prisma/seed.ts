/**
 * Seed idempotente: pode ser executado várias vezes sem duplicar dados.
 * Carrega edital (estrutura programática), questões (validadas), aulas, flashcards, recursos,
 * temas de redação e laboratório a partir da pasta /content.
 */
import { PrismaClient } from "@prisma/client";
import { EDITAL_DISCIPLINES, EXAM_INFO } from "../content/edital";
import { QUESTIONS_GERAIS } from "../content/questions/gerais";
import { QUESTIONS_DEV } from "../content/questions/dev";
import { QUESTIONS_SUP } from "../content/questions/sup";
import { FLASHCARDS } from "../content/flashcards";
import { ESSAY_PROMPTS } from "../content/essays";
import { LABS } from "../content/labs";
import { RESOURCES, type ResourceSeed } from "../content/resources";
import { VIDEOS } from "../content/videos";
import { LESSONS, LESSON_COVERS } from "../content/lessons";
import { questionSchema } from "../src/lib/validation";

const db = new PrismaClient();

async function main() {
  console.log("▶ Concurso e especialidades");
  const exam = await db.exam.upsert({
    where: { code: EXAM_INFO.code },
    update: { name: EXAM_INFO.name, board: EXAM_INFO.board, examDate: new Date(EXAM_INFO.examDate), notes: EXAM_INFO.notes },
    create: { code: EXAM_INFO.code, name: EXAM_INFO.name, board: EXAM_INFO.board, examDate: new Date(EXAM_INFO.examDate), notes: EXAM_INFO.notes },
  });
  for (const v of EXAM_INFO.versions) {
    await db.editalVersion.upsert({
      where: { examId_number: { examId: exam.id, number: v.number } },
      update: { title: v.title, url: v.url, summary: v.summary, publishedAt: new Date(`${v.publishedAt}T12:00:00Z`) },
      create: { examId: exam.id, number: v.number, title: v.title, url: v.url, summary: v.summary, publishedAt: new Date(`${v.publishedAt}T12:00:00Z`) },
    });
  }
  await db.examMilestone.deleteMany({ where: { examId: exam.id } });
  await db.examMilestone.createMany({
    data: EXAM_INFO.milestones.map((m) => ({
      examId: exam.id,
      item: m.item,
      title: m.title,
      start: new Date(`${m.start}T12:00:00Z`),
      end: "end" in m && m.end ? new Date(`${m.end}T12:00:00Z`) : null,
    })),
  });
  await db.officialUpdate.deleteMany({ where: { examId: exam.id } });
  await db.officialUpdate.createMany({
    data: EXAM_INFO.updates.map((u) => ({ examId: exam.id, title: u.title, summary: u.summary, url: u.url, publishedAt: new Date(`${u.publishedAt}T12:00:00Z`) })),
  });

  const specialtyIds: Record<string, string> = {};
  for (const s of EXAM_INFO.specialties) {
    const sp = await db.specialty.upsert({
      where: { key: s.key },
      update: { name: s.name, shortName: s.shortName, vacancies: s.vacancies, vacancyNotes: s.vacancyNotes, duties: s.duties, code: s.code, slug: s.slug },
      create: { examId: exam.id, key: s.key, code: s.code, slug: s.slug, name: s.name, shortName: s.shortName, vacancies: s.vacancies, vacancyNotes: s.vacancyNotes, duties: s.duties },
    });
    specialtyIds[s.key] = sp.id;
  }

  console.log("▶ Estrutura do edital (Anexo VI)");
  const topicIds: Record<string, string> = {};
  const disciplineIdsBySlug: Record<string, string> = {};
  let dOrder = 0;
  for (const d of EDITAL_DISCIPLINES) {
    const disc = await db.discipline.upsert({
      where: { slug: d.slug },
      update: { name: d.name, kind: d.kind, specialtyId: d.specialty ? specialtyIds[d.specialty] : null, order: dOrder, editalText: d.editalText, editalRef: d.editalRef, color: d.color },
      create: { slug: d.slug, name: d.name, kind: d.kind, specialtyId: d.specialty ? specialtyIds[d.specialty] : null, order: dOrder, editalText: d.editalText, editalRef: d.editalRef, color: d.color },
    });
    dOrder++;
    disciplineIdsBySlug[d.slug] = disc.id;
    let mOrder = 0;
    for (const m of d.modules) {
      const mod = await db.module.upsert({
        where: { slug: m.slug },
        update: { name: m.name, order: mOrder, disciplineId: disc.id },
        create: { slug: m.slug, name: m.name, order: mOrder, disciplineId: disc.id },
      });
      mOrder++;
      let tOrder = 0;
      for (const t of m.topics) {
        const topic = await db.topic.upsert({
          where: { slug: t.slug },
          update: { title: t.title, editalExcerpt: t.excerpt ?? t.title, editalRef: d.editalRef, order: tOrder, moduleId: mod.id },
          create: { slug: t.slug, title: t.title, editalExcerpt: t.excerpt ?? t.title, editalRef: d.editalRef, order: tOrder, moduleId: mod.id },
        });
        tOrder++;
        topicIds[t.slug] = topic.id;
        const subs = t.subtopics ?? [];
        const existing = await db.subtopic.findMany({ where: { topicId: topic.id }, orderBy: { order: "asc" } });
        for (let i = 0; i < subs.length; i++) {
          if (existing[i]) await db.subtopic.update({ where: { id: existing[i].id }, data: { title: subs[i], order: i } });
          else await db.subtopic.create({ data: { topicId: topic.id, title: subs[i], order: i } });
        }
        for (const extra of existing.slice(subs.length)) await db.subtopic.delete({ where: { id: extra.id } });
      }
    }
  }

  console.log("▶ Questões (com validação)");
  const allQuestions = [...QUESTIONS_GERAIS, ...QUESTIONS_DEV, ...QUESTIONS_SUP];
  let qOk = 0;
  const qErrors: string[] = [];
  for (const raw of allQuestions) {
    const parsed = questionSchema.safeParse(raw);
    if (!parsed.success) {
      qErrors.push(`${raw.code}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
      continue;
    }
    const qd = parsed.data;
    const topicId = topicIds[qd.topic];
    if (!topicId) {
      qErrors.push(`${qd.code}: assunto inexistente (${qd.topic})`);
      continue;
    }
    const data = {
      topicId,
      statement: qd.statement,
      difficulty: qd.difficulty,
      origin: qd.origin,
      board: qd.board ?? "Treinamento (estilo Vunesp)",
      year: qd.year ?? null,
      explanation: qd.explanation,
      reference: qd.reference,
      status: "PUBLICADO",
    };
    const question = await db.question.upsert({ where: { code: qd.code }, update: data, create: { code: qd.code, ...data } });
    for (let i = 0; i < 5; i++) {
      const a = qd.alternatives[i];
      const letter = "ABCDE"[i];
      await db.alternative.upsert({
        where: { questionId_letter: { questionId: question.id, letter } },
        update: { text: a.text, isCorrect: a.correct, explanation: a.why },
        create: { questionId: question.id, letter, text: a.text, isCorrect: a.correct, explanation: a.why },
      });
    }
    qOk++;
  }
  console.log(`  ${qOk} questões válidas; ${qErrors.length} rejeitadas`);
  qErrors.forEach((e) => console.warn("  ✗", e));

  console.log("▶ Aulas autorais");
  for (const l of LESSONS) {
    const topicId = topicIds[l.topic];
    if (!topicId) {
      console.warn(`  ✗ aula ${l.slug}: assunto inexistente (${l.topic})`);
      continue;
    }
    await db.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, summary: l.summary, content: l.content, estimatedMinutes: l.minutes, topicId },
      create: { slug: l.slug, title: l.title, summary: l.summary, content: l.content, estimatedMinutes: l.minutes, topicId },
    });
  }
  console.log(`  ${LESSONS.length} aulas`);
  for (const [slug, covers] of Object.entries(LESSON_COVERS)) {
    const lesson = await db.lesson.findUnique({ where: { slug } });
    if (!lesson) {
      console.warn(`  ✗ cobertura: aula inexistente (${slug})`);
      continue;
    }
    await db.lessonCoverage.deleteMany({ where: { lessonId: lesson.id } });
    for (const t of covers) {
      if (!topicIds[t]) console.warn(`  ✗ cobertura ${slug}: assunto inexistente (${t})`);
      else await db.lessonCoverage.create({ data: { lessonId: lesson.id, topicId: topicIds[t] } });
    }
  }

  console.log("▶ Flashcards oficiais");
  const existingCards = await db.flashcard.findMany({ where: { ownerId: null }, select: { front: true } });
  const fronts = new Set(existingCards.map((c) => c.front));
  let fcount = 0;
  for (const [topicSlug, type, front, back] of FLASHCARDS) {
    if (fronts.has(front)) continue;
    const topicId = topicIds[topicSlug];
    if (!topicId) {
      console.warn(`  ✗ flashcard: assunto inexistente (${topicSlug})`);
      continue;
    }
    const topic = await db.topic.findUnique({ where: { id: topicId }, include: { module: true } });
    await db.flashcard.create({ data: { ownerId: null, disciplineId: topic!.module.disciplineId, topicId, type, front, back } });
    fcount++;
  }
  console.log(`  ${fcount} novos flashcards`);

  console.log("▶ Temas de redação");
  for (const p of ESSAY_PROMPTS) {
    await db.essayPrompt.upsert({
      where: { slug: p.slug },
      update: { title: p.title, thematicPhrase: p.thematicPhrase, motivatingTexts: p.motivatingTexts, instructions: p.instructions, axis: p.axis },
      create: { slug: p.slug, title: p.title, thematicPhrase: p.thematicPhrase, motivatingTexts: p.motivatingTexts, instructions: p.instructions, axis: p.axis },
    });
  }

  console.log("▶ Laboratório");
  for (const l of LABS) {
    const data = {
      specialtyId: specialtyIds[l.specialty],
      topicId: topicIds[l.topic] ?? null,
      kind: l.kind,
      title: l.title,
      prompt: l.prompt,
      payload: JSON.stringify(l.payload),
      solution: l.solution,
      difficulty: l.difficulty,
    };
    await db.labExercise.upsert({ where: { slug: l.slug }, update: data, create: { slug: l.slug, ...data } });
  }

  console.log("▶ Biblioteca de recursos (status preservado; verificação via npm run links:check)");
  const videoSeeds: ResourceSeed[] = VIDEOS.map(([id, topics]) => ({ title: `Vídeo do YouTube ${id} (aguardando verificação)`, url: `https://www.youtube.com/watch?v=${id}`, type: "VIDEO", provider: "YouTube", language: "pt-BR", category: "COMPLEMENTAR", topics, expect: "" }));
  for (const r of [...RESOURCES, ...videoSeeds]) {
    const existing = await db.resource.findUnique({ where: { url: r.url } });
    const isVideo = r.type === "VIDEO";
    const base = { ...(isVideo && existing ? {} : { title: r.title, provider: r.provider }), type: r.type, language: r.language, category: r.category, description: isVideo ? "Videoaula de terceiros, incorporada pelo player oficial do YouTube." : `${r.description ?? ""}${r.description ? " " : ""}[esperado: "${r.expect}"]`.trim() };
    const res = existing
      ? await db.resource.update({ where: { id: existing.id }, data: base })
      : await db.resource.create({ data: { ...base, title: r.title, provider: r.provider, url: r.url, origin: "SEED", status: "EM_REVISAO", verificationStatus: "NAO_VERIFICADO" } });
    for (const slug of r.topics) {
      const topicId = topicIds[slug];
      if (!topicId) {
        console.warn(`  ✗ recurso ${r.url}: assunto inexistente (${slug})`);
        continue;
      }
      await db.resourceTopic.upsert({ where: { resourceId_topicId: { resourceId: res.id, topicId } }, update: {}, create: { resourceId: res.id, topicId } });
    }
  }

  await db.contentChangeLog.create({
    data: { entity: "SEED", entityId: exam.id, action: "SEED", details: `Seed executado: ${qOk} questões, ${LESSONS.length} aulas, ${RESOURCES.length} recursos, ${LABS.length} laboratórios.` },
  });
  console.log("✔ Seed concluído");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
