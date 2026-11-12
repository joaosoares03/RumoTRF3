import Link from "next/link";
import { Download, Pin, Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteNote, saveNote } from "@/app/actions/notes";
import { Markdown } from "@/components/markdown";
import { Badge, Button, ButtonLink, Card, CardBody, EmptyState, Field, Notice, PageHeader, inputClass } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Caderno digital" };

export default async function CadernoPage({ searchParams }: { searchParams: Promise<{ q?: string; disciplina?: string; nota?: string; nova?: string; assunto?: string; salvo?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const where: Prisma.NoteWhereInput = {
    userId: user.id,
    ...(sp.disciplina ? { disciplineId: sp.disciplina } : {}),
    ...(sp.q ? { OR: [{ title: { contains: sp.q } }, { content: { contains: sp.q } }] } : {}),
  };
  const [notes, disciplines, current, topic, highlights] = await Promise.all([
    db.note.findMany({ where, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }], include: { discipline: { select: { name: true, color: true } } } }),
    db.discipline.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    sp.nota ? db.note.findFirst({ where: { id: sp.nota, userId: user.id }, include: { topic: { select: { id: true, title: true } } } }) : null,
    sp.assunto ? db.topic.findUnique({ where: { id: sp.assunto }, select: { id: true, title: true } }) : null,
    db.highlight.count({ where: { userId: user.id } }),
  ]);
  const editing = !!current || !!sp.nova;

  return (
    <div>
      <PageHeader
        title="Caderno digital"
        description="Notas em Markdown organizadas por disciplina, com busca textual. Os destaques das aulas também entram na exportação."
        actions={
          <>
            <ButtonLink href="/caderno?nova=1"><Plus className="size-4" /> Nova nota</ButtonLink>
            <ButtonLink href="/api/export?tipo=anotacoes" variant="secondary"><Download className="size-4" /> Exportar (.md)</ButtonLink>
          </>
        }
      />
      {sp.salvo && <Notice tone="success" className="mb-4">Anotação salva.</Notice>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <form className="space-y-2">
            <input name="q" defaultValue={sp.q} placeholder="Buscar nas anotações..." className={inputClass} aria-label="Buscar nas anotações" />
            <select name="disciplina" defaultValue={sp.disciplina ?? ""} className={inputClass} aria-label="Disciplina">
              <option value="">Todas as disciplinas</option>
              {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <Button variant="secondary" className="w-full">Filtrar</Button>
          </form>
          <p className="text-xs text-muted">{notes.length} nota(s) · {highlights} destaque(s) em aulas</p>
          <ul className="space-y-1.5">
            {notes.map((n) => (
              <li key={n.id}>
                <Link href={`/caderno?nota=${n.id}`} className={cn("block rounded-xl border p-3 text-sm transition hover:border-accent", sp.nota === n.id ? "border-accent bg-accent-soft/40" : "border-border bg-surface")}>
                  <div className="flex items-center gap-1.5 font-medium">{n.pinned && <Pin className="size-3 text-accent" />}<span className="truncate">{n.title}</span></div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                    {n.discipline && <span className="size-1.5 rounded-full" style={{ background: n.discipline.color }} />}
                    {n.discipline?.name ?? "Geral"} · {formatDate(n.updatedAt)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {editing ? (
            <Card>
              <CardBody>
                <form action={saveNote} className="space-y-3">
                  {current && <input type="hidden" name="id" value={current.id} />}
                  {(current?.topic ?? topic) && <input type="hidden" name="topicId" value={(current?.topic ?? topic)!.id} />}
                  {(current?.topic ?? topic) && <Badge tone="teal">Vinculada ao assunto: {(current?.topic ?? topic)!.title}</Badge>}
                  <Field label="Título"><input name="title" required defaultValue={current?.title ?? (topic ? `Anotações — ${topic.title.slice(0, 80)}` : "")} className={inputClass} /></Field>
                  <Field label="Disciplina">
                    <select name="disciplineId" defaultValue={current?.disciplineId ?? ""} className={inputClass}>
                      <option value="">{topic || current?.topic ? "Mesma do assunto" : "Geral"}</option>
                      {disciplines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Conteúdo (Markdown)" hint="Use ## para títulos, - para listas, ``` para blocos de código.">
                    <textarea name="content" rows={18} defaultValue={current?.content ?? ""} className={cn(inputClass, "font-mono text-[13px] leading-6")} />
                  </Field>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="pinned" defaultChecked={current?.pinned} className="accent-[var(--accent)]" /> Fixar no topo</label>
                  <div className="flex gap-2"><Button>Salvar</Button>{current && <ButtonLink href="/caderno" variant="ghost">Fechar</ButtonLink>}</div>
                </form>
                {current && (
                  <form action={deleteNote} className="mt-2"><input type="hidden" name="id" value={current.id} /><Button variant="ghost" className="text-danger">Excluir nota</Button></form>
                )}
              </CardBody>
            </Card>
          ) : (
            <EmptyState title="Selecione ou crie uma nota" description="Suas anotações ficam privadas e podem ser exportadas a qualquer momento." action={<ButtonLink href="/caderno?nova=1">Nova nota</ButtonLink>} />
          )}
          {current?.content && (
            <Card className="mt-4">
              <CardBody>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Pré-visualização</div>
                <Markdown>{current.content}</Markdown>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
