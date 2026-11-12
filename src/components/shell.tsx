"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  BookOpen,
  CircleHelp,
  Timer,
  PenLine,
  Layers,
  CalendarRange,
  CalendarDays,
  FlaskConical,
  ChartLine,
  Library,
  NotebookPen,
  Focus,
  Landmark,
  GitCompareArrows,
  ShieldCheck,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV = [
  { group: "Estudo", items: [
    { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
    { href: "/edital", label: "Edital verticalizado", icon: ListChecks },
    { href: "/disciplinas", label: "Disciplinas e aulas", icon: BookOpen },
    { href: "/questoes", label: "Questões", icon: CircleHelp },
    { href: "/simulados", label: "Simulados", icon: Timer },
    { href: "/redacao", label: "Redação", icon: PenLine },
    { href: "/flashcards", label: "Flashcards", icon: Layers },
    { href: "/laboratorio", label: "Laboratório de TI", icon: FlaskConical },
  ]},
  { group: "Organização", items: [
    { href: "/planejador", label: "Planejador", icon: CalendarRange },
    { href: "/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/foco", label: "Modo foco", icon: Focus },
    { href: "/desempenho", label: "Desempenho", icon: ChartLine },
    { href: "/caderno", label: "Caderno digital", icon: NotebookPen },
    { href: "/biblioteca", label: "Biblioteca", icon: Library },
  ]},
  { group: "Concurso", items: [
    { href: "/concurso", label: "Central do concurso", icon: Landmark },
    { href: "/comparador", label: "Comparador", icon: GitCompareArrows },
  ]},
];

function NavList({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  const groups = isAdmin ? [...NAV, { group: "Gestão", items: [{ href: "/admin", label: "Administração", icon: ShieldCheck }] }] : NAV;
  return (
    <nav className="space-y-5" aria-label="Navegação principal">
      {groups.map((g) => (
        <div key={g.group}>
          <div className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted/80">{g.group}</div>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = path === it.href || path.startsWith(it.href + "/");
              const Icon = it.icon;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition",
                      active ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-surface-2 hover:text-text",
                    )}
                  >
                    <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2.3 : 1.9} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div>
        <Link href="/configuracoes" onClick={onNavigate} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition", path.startsWith("/configuracoes") ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-surface-2 hover:text-text")}>
          <Settings className="size-[17px]" /> Configurações
        </Link>
      </div>
    </nav>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tema", next ? "escuro" : "claro");
    } catch {}
    setDark(next);
  };
  return (
    <button onClick={toggle} className="grid grid-cols-1 size-9 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-text" aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"} title="Alternar tema">
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export function AppShell({
  children,
  user,
  switcher,
  unread,
  logout,
}: {
  children: React.ReactNode;
  user: { name: string; role: string };
  switcher: React.ReactNode;
  unread: number;
  logout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const isAdmin = user.role === "ADMIN";
  return (
    <div className="min-h-screen">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/80 backdrop-blur lg:flex">
        <div className="px-5 pb-4 pt-5">
          <Link href="/dashboard" aria-label="Ir para o painel">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <NavList isAdmin={isAdmin} />
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
            <div className="grid grid-cols-1 size-8 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">{user.name.slice(0, 1).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-[11px] text-muted">{isAdmin ? "Administrador(a)" : "Estudante"}</div>
            </div>
            <form action={logout}>
              <button className="grid grid-cols-1 size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-text" aria-label="Sair" title="Sair">
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <Logo />
              <button onClick={() => setOpen(false)} className="grid grid-cols-1 size-9 place-items-center rounded-xl hover:bg-surface-2" aria-label="Fechar menu">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavList isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
            </div>
            <form action={logout} className="border-t border-border p-3">
              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-2">
                <LogOut className="size-4" /> Sair
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
            <button onClick={() => setOpen(true)} className="grid grid-cols-1 size-9 place-items-center rounded-xl hover:bg-surface-2 lg:hidden" aria-label="Abrir menu">
              <Menu className="size-5" />
            </button>
            <form action="/busca" className="relative hidden max-w-md flex-1 sm:block" role="search">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                name="q"
                placeholder="Buscar disciplinas, aulas, questões, legislação, anotações..."
                aria-label="Busca global"
                className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
              />
            </form>
            <div className="ml-auto flex items-center gap-1">
              <Link href="/busca" className="grid grid-cols-1 size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 sm:hidden" aria-label="Buscar">
                <Search className="size-[18px]" />
              </Link>
              {switcher}
              <Link href="/notificacoes" className="relative grid grid-cols-1 size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-text" aria-label={`Notificações${unread ? ` (${unread} não lidas)` : ""}`}>
                <Bell className="size-[18px]" />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 grid grid-cols-1 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-4 text-white">{unread > 9 ? "9+" : unread}</span>}
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
