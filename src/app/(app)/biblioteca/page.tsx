import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, EmptyState, Notice, PageHeader, StatCard, inputClass } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Biblioteca" };

const TYPES: Record<string, string> = { DOCUMENTACAO: "Documentação", LEGISLACAO: "Legislação", NORMATIVO: "Normativo (CNJ/CJF)", ARTIGO: "Artigo", CURSO: "Curso/livro", PDF: "PDF", VIDEO: "Vídeo", FERRAMENTA: "Ferramenta" };

export default async function BibliotecaPage({ searchParams }: { searchParams: Promise<{ q?: string; tipo?: string; categoria?: string; idioma?: string; disciplina?: string }> }) {
  const sp = await searchParams;
  await requireUser();
  const where: Prisma.ResourceWhereInput = {
    status: "PUBLICADO",
    verificationStatus: "VERIFICADO",
    ...(sp.tipo ? { type: sp.tipo } : {}),
    ...(sp.categoria ? { category: sp.categoria } : {}),
    ...(sp.idioma ? { language: sp.idioma } : {}),
    ...(sp.disciplina ? { topics: { some: { topic: { module: { disciplineId: sp.disciplina } } } } } : {}),
    ...(sp.q ? { OR: [{ title: { contains: sp.q } }, { provider: { contains: sp.q } }, { topics: { some: { topic: { title: { contains: sp.q } } } } }] } : {}),
  };
  const [resources, totals, disciplines] = await Promise.all([
    db.resource.findMany({ where, orderBy: [{ category: "desc" }, { title: "asc" }], include: { topics: { include: { topic: { select: { id: true, title: true, module: { select: { discipline: { select: { name: true, color: true } } } } } } } } } }),
    db.resource.groupBy({ by: ["verificationStatus"], _count: true }),
    db.discipline.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  const count = (s: string) => totals.find((t) => t.verificationStatus === s)?._count ?? 0;
  return (
    <div>
      <PageHeader title="Biblioteca de materiais" description="Somente recursos públicos e gratuitos cuja URL foi verificada automaticamente (HTTP 2xx + presença do texto esperado na página). Cada item registra fonte, idioma, categoria e data de verificação." />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Verificados" value={count("VERIFICADO")} tone="teal" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="Em revisão" value={count("NAO_VERIFICADO") + count("INACESSIVEL") + count("DIVERGENTE")} hint="não exibidos" />
        <StatCard label="Quebrados" value={count("QUEBRADO")} hint="não exibidos" />
        <StatCard label="Exibindo" value={resources.length} />
      </div>
      <form className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px_160px_140px_200px_auto]">
        <input name="q" defaultValue={sp.q} placeholder="Buscar título, fonte ou assunto..." className={inputClass} aria-label="Buscar" />
        <select name="tipo" defaultValue={sp.tipo ?? ""} className={inputClass} aria-label="Tipo"><option value="">Todos os tipos</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select name="categoria" defaultValue={sp.categoria ?? ""} className={inputClass} aria-label="Categoria"><option value="">Oficial e complementar</option><option value="OFICIAL">Fontes oficiais</option><option value="COMPLEMENTAR">Complementares</option></select>
        <select name="idioma" defaultValue={sp.idioma ?? ""} className={inputClass} aria-label="Idioma"><option value="">Todos os idiomas</option><option value="pt-BR">Português</option><option value="en">Inglês</option></select>
        <select name="disciplina" defaultValue={sp.disciplina ?? ""} className={inputClass} aria-label="Disciplina"><option value="">Todas as disciplinas</option>{disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <button className="rounded-xl bg-surface-2 px-4 text-sm font-medium hover:bg-border/60">Filtrar</button>
      </form>
      <Notice className="mb-4">Videoaulas do YouTube são conteúdo de terceiros; título e canal foram conferidos pelo oEmbed oficial. Filtre por tipo &quot;Vídeo&quot; ou assista incorporado na página de cada assunto.</Notice>
      {resources.length ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {resources.map((r) => (
            <Card key={r.id} className="p-4">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 font-medium hover:text-accent">
                <ExternalLink className="mt-1 size-4 shrink-0 text-muted" /> {r.title}
              </a>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                <Badge tone={r.category === "OFICIAL" ? "teal" : "neutral"}>{r.category === "OFICIAL" ? "Oficial" : "Complementar"}</Badge>
                <Badge>{TYPES[r.type] ?? r.type}</Badge>
                <Badge>{r.provider}</Badge>
                <Badge>{r.language === "en" ? "Inglês" : "Português"}</Badge>
                {r.verifiedAt && <Badge tone="success">verificado {formatDate(r.verifiedAt)}</Badge>}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.topics.slice(0, 4).map((t) => (
                  <Link key={t.topic.id} href={`/assuntos/${t.topic.id}`} className="truncate rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted hover:text-accent" style={{ maxWidth: 260 }}>
                    {t.topic.module.discipline.name}: {t.topic.title}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum material encontrado" description="Ajuste os filtros. Materiais novos podem ser cadastrados ou importados no painel administrativo." />
      )}
    </div>
  );
}
