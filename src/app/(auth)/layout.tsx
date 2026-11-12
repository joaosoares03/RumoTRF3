import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#111216] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-[#ff5d4f]/25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-[#2fc7b4]/15 blur-3xl" aria-hidden />
        <Logo className="relative text-white" />
        <div className="relative max-w-md">
          <p className="font-display text-4xl font-semibold leading-tight">Seu centro de comando para o TRF3 2026.</p>
          <p className="mt-4 text-white/70">
            Edital verticalizado, aulas, questões comentadas, simulados no formato Vunesp, redação, flashcards e um plano de estudos que se adapta ao seu desempenho.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-white/80">
            <li>• Técnico Judiciário — Desenvolvimento de Sistemas (006)</li>
            <li>• Técnico Judiciário — Suporte Técnico (007)</li>
            <li>• Prova prevista: 31/01/2027 (Anexo VII do edital)</li>
          </ul>
        </div>
        <p className="relative text-xs text-white/50">Plataforma independente de estudos. Não possui vínculo com o TRF3 ou com a Fundação Vunesp.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Logo className="mb-8 lg:hidden" />
          {children}
        </div>
      </div>
    </div>
  );
}
