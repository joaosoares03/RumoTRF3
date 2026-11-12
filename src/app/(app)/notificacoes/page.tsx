import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { markNotificationsRead } from "@/app/actions/study";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Notificações" };

const TONE = { REVISAO: "accent", META: "amber", OFICIAL: "teal", CONQUISTA: "success", SISTEMA: "neutral" } as const;

export default async function NotificacoesPage() {
  const user = await requireUser();
  const list = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notificações"
        description="Revisões pendentes, metas, alertas oficiais e conquistas. Desative em Configurações, se preferir."
        actions={list.some((n) => !n.readAt) && <form action={markNotificationsRead}><Button variant="secondary">Marcar todas como lidas</Button></form>}
      />
      {list.length ? (
        <div className="space-y-2">
          {list.map((n) => (
            <Card key={n.id} className={cn("p-4", !n.readAt && "border-accent/40")}>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Badge tone={TONE[n.type as keyof typeof TONE] ?? "neutral"}>{n.type.toLowerCase()}</Badge>
                {formatDate(n.createdAt, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                {!n.readAt && <span className="size-2 rounded-full bg-accent" aria-label="não lida" />}
              </div>
              <div className="mt-1 font-medium">{n.link ? <Link href={n.link} className="hover:text-accent">{n.title}</Link> : n.title}</div>
              <p className="text-sm text-muted">{n.body}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhuma notificação" />
      )}
    </div>
  );
}
