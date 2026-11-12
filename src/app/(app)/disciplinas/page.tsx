import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, scopeOf } from "@/lib/data";
import { editalProgress } from "@/lib/stats";
import { Badge, Card, PageHeader, Progress } from "@/components/ui";

export const metadata = { title: "Disciplinas e aulas" };

export default async function DisciplinasPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const { perDiscipline } = await editalProgress(user.id, [active]);
  const lessonCounts = await db.lesson.groupBy({ by: ["topicId"], _count: true, where: { status: "PUBLICADO" } });
  const topicDisc = await db.topic.findMany({ select: { id: true, module: { select: { disciplineId: true } } } });
  const tdMap = new Map(topicDisc.map((t) => [t.id, t.module.disciplineId]));
  const lessonsByDisc = new Map<string, number>();
  for (const l of lessonCounts) {
    const d = tdMap.get(l.topicId)!;
    lessonsByDisc.set(d, (lessonsByDisc.get(d) ?? 0) + l._count);
  }
  const groups = [
    { title: "Conhecimentos Gerais — 24 questões, peso 1 (compartilhados entre 006 e 007)", items: perDiscipline.filter((d) => d.kind === "GERAL") },
    { title: `Conhecimentos Específicos — 36 questões, peso 2 (${active === "DEV" ? "006 · Desenvolvimento de Sistemas" : "007 · Suporte Técnico"})`, items: perDiscipline.filter((d) => d.kind !== "GERAL") },
  ];
  return (
    <div>
      <PageHeader title="Disciplinas e aulas" description="Disciplina → módulo → assunto → subassunto → aula, materiais, exercícios e revisões." />
      {groups.map((g) => (
        <section key={g.title} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-muted">{g.title}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {g.items.map((d) => (
              <Link key={d.id} href={`/disciplinas/${d.slug}`} className="group">
                <Card className="h-full p-5 transition group-hover:-translate-y-0.5 group-hover:border-accent/50">
                  <div className="mb-3 h-1.5 w-10 rounded-full" style={{ background: d.color }} />
                  <h3 className="font-semibold leading-snug group-hover:text-accent">{d.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge>{d.topics} assuntos</Badge>
                    <Badge>{lessonsByDisc.get(d.id) ?? 0} aula(s)</Badge>
                    {d.answered > 0 && <Badge tone="teal">{Math.round((d.correct / d.answered) * 100)}% acertos</Badge>}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={d.percent} color={d.color} />
                    <span className="text-xs tabular-nums text-muted">{d.percent}%</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
