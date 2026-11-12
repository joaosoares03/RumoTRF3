"use client";

import { useRef } from "react";

export function SpecialtySwitcher({ action, active, prepared }: { action: (fd: FormData) => Promise<void>; active: string; prepared: string[] }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form ref={ref} action={action}>
      <label className="sr-only" htmlFor="spec-switch">
        Especialidade exibida
      </label>
      <select
        id="spec-switch"
        name="specialty"
        defaultValue={active}
        onChange={() => ref.current?.requestSubmit()}
        title="Alternar especialidade exibida"
        className="max-w-[150px] cursor-pointer rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs font-medium outline-none transition hover:border-accent focus:border-accent sm:max-w-none sm:text-sm"
      >
        <option value="DEV">006 · Desenvolvimento{prepared.includes("DEV") ? "" : " (fora do plano)"}</option>
        <option value="SUP">007 · Suporte Técnico{prepared.includes("SUP") ? "" : " (fora do plano)"}</option>
      </select>
    </form>
  );
}
