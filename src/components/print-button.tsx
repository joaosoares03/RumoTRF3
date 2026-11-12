"use client";

import { Printer } from "lucide-react";

/** Exportação em PDF pelo diálogo de impressão do navegador ("Salvar como PDF"). */
export function PrintButton({ label = "Exportar PDF" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="no-print inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium hover:bg-surface-2">
      <Printer className="size-4" /> {label}
    </button>
  );
}
