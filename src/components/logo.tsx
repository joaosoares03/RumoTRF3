import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" fill="var(--accent, #e2483d)" />
        <path d="M9 22 L16 9 L23 22" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="22" r="2.2" fill="white" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-[17px] font-semibold tracking-tight">Rumo TRF3</div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] opacity-60">Técnico Judiciário · TI</div>
        </div>
      )}
    </div>
  );
}
