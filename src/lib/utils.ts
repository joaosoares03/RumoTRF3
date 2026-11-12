import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fuso de referência da plataforma (prova em São Paulo). */
export const TZ = "America/Sao_Paulo";

/** Retorna a data (YYYY-MM-DD) no fuso de São Paulo. */
export function localDateKey(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Converte YYYY-MM-DD para Date às 12:00 UTC (evita problemas de fuso ao armazenar "dias"). */
export function dayFromKey(key: string): Date {
  return new Date(`${key}T12:00:00.000Z`);
}

export function today(): Date {
  return dayFromKey(localDateKey());
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export function startOfWeek(d: Date): Date {
  // semana começando na segunda-feira
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(dayFromKey(d.toISOString().slice(0, 10)), diff);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((dayFromKey(a.toISOString().slice(0, 10)).getTime() - dayFromKey(b.toISOString().slice(0, 10)).getTime()) / 86400000);
}

export function formatDate(d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" }) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...opts }).format(date);
}

/** Formata datas que representam "dias" (armazenadas às 12:00 UTC). */
export function formatDay(d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" }) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...opts }).format(date);
}

export function formatMinutes(min: number): string {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h${String(r).padStart(2, "0")}` : `${h}h`;
}

export function pct(n: number, d: number): number {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const STATUS_LABEL: Record<string, string> = {
  NAO_INICIADO: "Não iniciado",
  EM_ESTUDO: "Em estudo",
  REVISANDO: "Revisando",
  DOMINADO: "Dominado",
};

export const TASK_TYPE_LABEL: Record<string, string> = {
  TEORIA: "Teoria",
  QUESTOES: "Questões",
  REVISAO: "Revisão",
  REDACAO: "Redação",
  SIMULADO: "Simulado",
  FLASHCARDS: "Flashcards",
  LABORATORIO: "Laboratório",
};

export const SPECIALTY_LABEL: Record<string, string> = {
  DEV: "Desenvolvimento de Sistemas",
  SUP: "Suporte Técnico",
  AMBAS: "Ambas as especialidades",
};

/** Gerador pseudoaleatório com semente (mulberry32) — sorteios reprodutíveis por URL. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
