import Link from "next/link";
import { BookOpen, CircleHelp, FileText, Library, NotebookPen, ListChecks, Scale } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, CardBody, CardHeader, EmptyState, PageHeader, inputClass } from "@/components/ui";

export const metadata = { title: "Busca" };

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: raw } = await searchParams;
  const user = await requireUser();
  const q = (raw ?? "").trim().slice(0, 100);
  const has = q.length >= 2;
  const [disciplines, topics, lessons, questions, resources, notes] = has
    ? await Promise.all([
        db.discipline.findMany({ where: { OR: [{ name: { contains: q } }, { editalText: { contains: q } }] }, take: 10 }),
        db.topic.findMany({ where: { OR: [{ title: { contains: q } }, { editalExcerpt: { contains: q } }, { subtopics: { some: { title: { contains: q } } } }] }, take: 20, include: { module: { include: { discipline: { select: { name: true } } } } } }),
        db.lesson.findMany({ where: { status: "PUBLICADO", OR: [{ title: { contains: q } }, { content: { contains: q } }, { summary: { contains: q } }] }, take: 15 }),
        db.question.findMany({ where: { status: "PUBLICADO", OR: [{ statement: { contains: q } }, { code: { contains: q } }, { explanation: { contains: q } }] }, take: 15, include: { topic: { select: { id: true, title: true } } } }),
        db.resource.findMany({ where: { status: "PUBLICADO", verificationStatus: "VERIFICADO", OR: [{ title: { contains: q } }, { provider: { contains: q } }] }, take: 15 }),
        db.note.findMany({ where: { userId: user.id, OR: [{ title: { contains: q } }, { content: { contains: q } }] }, take: 15 }),
      ])
    : [[], [], [], [], [], []];
  const total = disciplines.length + topics.length + lessons.length + questions.length + resources.length + notes.length;
  const snippet = (text: string) => {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return text.slice(0, 140);
    return (i > 60 ? "…" : "") + text.slice(Math.max(0, i - 60), i + 100).replace(/[#*`>|]/g, "") + "…";
  };
  const legis = resources.filter((r) => r.type === "LEGISLACAO" || r.type === "NORMATIVO");
  const others = resources.filter((r) => !(r.type === "LEGISLACAO" || r.type === "NORMATIVO"));

  return (
    <div>
      <PageHeader title="Busca global" description="Disciplinas, assuntos do edital, aulas, questões, materiais, legislação e suas anotações." />
      <form className="mb-6 flex gap-2" role="search">
        <input name="q" defaultValue={q} autoFocus placeholder="Ex.: crase, RAID 5, LGPD, Kafka, 8.112..." className={inputClass} aria-label="Termo de busca" />
        <button className="rounded-xl bg-accent px-5 text-sm font-medium text-white">Buscar</button>
      </form>
      {!has ? (
        <EmptyState title="Digite ao menos 2 caracteres" />
      ) : total === 0 ? (
        <EmptyState title={`Nada encontrado para "${q}"`} description="Tente um termo mais curto ou sinônimo." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {disciplines.length + topics.length > 0 && (
            <Card>
              <CardHeader title={`Edital (${disciplines.length + topics.length})`} icon={<ListChecks className="size-4" />} />
              <CardBody className="space-y-2 text-sm">
                {disciplines.map((d) => <Link key={d.id} href={`/disciplinas/${d.slug}`} className="block font-medium hover:text-accent">{d.name}</Link>)}
                {topics.map((t) => <Link key={t.id} href={`/assuntos/${t.id}`} className="block hover:text-accent">{t.title} <span className="text-xs text-muted">· {t.module.discipline.name}</span></Link>)}
              </CardBody>
            </Card>
          )}
          {lessons.length > 0 && (
            <Card>
              <CardHeader title={`Aulas (${lessons.length})`} icon={<BookOpen className="size-4" />} />
              <CardBody className="space-y-3 text-sm">{lessons.map((l) => <Link key={l.id} href={`/aulas/${l.slug}`} className="block hover:text-accent"><div className="font-medium">{l.title}</div><div className="text-xs text-muted">{snippet(l.content)}</div></Link>)}</CardBody>
            </Card>
          )}
          {questions.length > 0 && (
            <Card>
              <CardHeader title={`Questões (${questions.length})`} icon={<CircleHelp className="size-4" />} />
              <CardBody className="space-y-3 text-sm">{questions.map((x) => <Link key={x.id} href={`/questoes/resolver?assunto=${x.topic.id}`} className="block hover:text-accent"><Badge>{x.code}</Badge> <span className="text-xs text-muted">{snippet(x.statement)}</span></Link>)}</CardBody>
            </Card>
          )}
          {legis.length > 0 && (
            <Card>
              <CardHeader title={`Legislação e normativos (${legis.length})`} icon={<Scale className="size-4" />} />
              <CardBody className="space-y-2 text-sm">{legis.map((r) => <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="block hover:text-accent">{r.title} <span className="text-xs text-muted">· {r.provider}</span></a>)}</CardBody>
            </Card>
          )}
          {others.length > 0 && (
            <Card>
              <CardHeader title={`Materiais (${others.length})`} icon={<Library className="size-4" />} />
              <CardBody className="space-y-2 text-sm">{others.map((r) => <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="block hover:text-accent">{r.title} <span className="text-xs text-muted">· {r.provider}</span></a>)}</CardBody>
            </Card>
          )}
          {notes.length > 0 && (
            <Card>
              <CardHeader title={`Suas anotações (${notes.length})`} icon={<NotebookPen className="size-4" />} />
              <CardBody className="space-y-3 text-sm">{notes.map((n) => <Link key={n.id} href={`/caderno?nota=${n.id}`} className="block hover:text-accent"><div className="font-medium"><FileText className="mr-1 inline size-3.5" />{n.title}</div><div className="text-xs text-muted">{snippet(n.content)}</div></Link>)}</CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
