"use client";

import { useRef, type ReactNode } from "react";

/** Formulário que envia automaticamente ao alterar qualquer campo (selects de status, filtros). */
export function AutoSubmitForm({ action, children, className }: { action?: string | ((fd: FormData) => Promise<void>); children: ReactNode; className?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form ref={ref} action={action} className={className} onChange={() => ref.current?.requestSubmit()}>
      {children}
    </form>
  );
}
