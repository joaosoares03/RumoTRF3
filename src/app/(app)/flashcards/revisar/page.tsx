import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, scopeOf } from "@/lib/data";
import { FlashcardReview } from "@/components/flashcard-review";
import { PageHeader } from "@/components/ui";
import { shuffle } from "@/lib/utils";

export const metadata = { title: "Revisar flashcards" };

const NEW_PER_SESSION = 20;

export default async function RevisarPage({ searchParams }: { searchParams: Promise<{ disciplina?: string; assunto?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { prepared, active } = scopeOf(prefs);
  const keys = [...new Set([...prepared, active])];
  const scope = {
    AND: [
      { OR: [{ ownerId: null }, { ownerId: user.id }] },
      { OR: [{ discipline: { specialtyId: null } }, { discipline: { specialty: { key: { in: keys } } } }] },
      ...(sp.disciplina ? [{ disciplineId: sp.disciplina }] : []),
      ...(sp.assunto ? [{ topicId: sp.assunto }] : []),
    ],
  };
  const include = { discipline: { select: { name: true } }, topic: { select: { title: true } } };
  const [due, fresh] = await Promise.all([
    db.flashcard.findMany({ where: { ...scope, states: { some: { userId: user.id, suspended: false, dueAt: { lte: new Date() } } } }, include, take: 200 }),
    db.flashcard.findMany({ where: { ...scope, states: { none: { userId: user.id } } }, include, take: 500 }),
  ]);
  const cards = [...shuffle(due).map((c) => ({ c, isNew: false })), ...shuffle(fresh).slice(0, NEW_PER_SESSION).map((c) => ({ c, isNew: true }))].map(({ c, isNew }) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    type: c.type,
    discipline: c.discipline.name,
    topic: c.topic?.title ?? null,
    isNew,
    personal: !!c.ownerId,
  }));
  return (
    <div>
      <PageHeader title="Revisão de flashcards" description={`${due.length} vencido(s) + até ${NEW_PER_SESSION} novos por sessão. Algoritmo SM-2: respostas "Errei" voltam amanhã; acertos aumentam o intervalo progressivamente (limitado à data da prova).`} />
      <FlashcardReview cards={cards} />
    </div>
  );
}
