import Link from "next/link";
import { Database, Code2, Terminal, Wrench, Headset } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, scopeOf } from "@/lib/data";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";

export const metadata = { title: "Laboratório de TI" };

const KIND = { SQL: { label: "SQL", icon: Database }, CODIGO: { label: "Código", icon: Code2 }, COMANDO: { label: "Comandos", icon: Terminal }, CENARIO: { label: "Troubleshooting", icon: Wrench }, CHAMADO: { label: "Chamado", icon: Headset } } as const;

export default async function LabPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const labs = await db.labExercise.findMany({
    where: { specialty: { key: active } },
    orderBy: [{ kind: "asc" }, { difficulty: "asc" }],
    include: { topic: { select: { title: true } }, attempts: { where: { userId: user.id }, select: { correct: true } } },
  });
  return (
    <div>
      <PageHeader
        title="Laboratório prático de TI"
        description={active === "DEV" ? "Desenvolvimento: SQL executado no seu navegador (SQLite/WebAssembly, isolado — nenhum código roda no servidor), interpretação de código, identificação de erros, APIs, Git, Docker e desenvolvimento seguro." : "Suporte: troubleshooting de rede, DNS/DHCP, Active Directory, Linux, hardware/RAID, segurança e simulações de chamados com ITIL."}
      />
      <Notice className="mb-6">Atividades autorais. Alterne a especialidade no topo para ver o laboratório da outra área.</Notice>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {labs.map((l) => {
          const K = KIND[l.kind as keyof typeof KIND] ?? KIND.CENARIO;
          const ok = l.attempts.some((a) => a.correct);
          return (
            <Link key={l.id} href={`/laboratorio/${l.slug}`} className="group">
              <Card className="h-full p-5 transition group-hover:border-accent/50">
                <div className="flex items-center justify-between">
                  <span className="grid grid-cols-1 size-9 place-items-center rounded-xl bg-surface-2 text-accent"><K.icon className="size-5" /></span>
                  {ok ? <Badge tone="success">Concluído</Badge> : l.attempts.length ? <Badge tone="amber">{l.attempts.length} tentativa(s)</Badge> : null}
                </div>
                <h3 className="mt-3 font-semibold group-hover:text-accent">{l.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs"><Badge>{K.label}</Badge><Badge>{["", "Fácil", "Média", "Difícil"][l.difficulty]}</Badge></div>
                {l.topic && <p className="mt-2 line-clamp-2 text-xs text-muted">{l.topic.title}</p>}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
