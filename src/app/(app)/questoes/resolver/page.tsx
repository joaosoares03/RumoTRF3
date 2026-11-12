import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPrefs, scopeOf } from "@/lib/data";
import { buildQuestionWhere, loadPlayerQuestions, type QuestionFilters } from "@/lib/questions";
import { QuestionPlayer } from "@/components/question-player";
import { ButtonLink, PageHeader } from "@/components/ui";

export const metadata = { title: "Resolver questões" };

export default async function ResolverPage({ searchParams }: { searchParams: Promise<QuestionFilters & { modo?: string; s?: string }> }) {
  const sp = await searchParams;
  // semente na URL: recarregar a página mantém a mesma lista sorteada
  if (!sp.s) {
    const qs = new URLSearchParams(Object.entries(sp).filter(([, v]) => typeof v === "string" && v) as [string, string][]);
    qs.set("s", String(Math.floor(Math.random() * 1e9)));
    redirect(`/questoes/resolver?${qs.toString()}`);
  }
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const where = await buildQuestionWhere(user.id, [active], sp);
  const qtd = Number(sp.qtd) || 20;
  const questions = await loadPlayerQuestions(user.id, where, qtd, Number(sp.s) || 1);
  const mode = sp.modo === "CRONOMETRADO" ? "CRONOMETRADO" : sp.situacao === "erradas" ? "REVISAO" : "PRATICA";
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={mode === "REVISAO" ? "Revisão dos erros" : mode === "CRONOMETRADO" ? "Treino por tempo" : "Resolver questões"}
        description={`${questions.length} questão(ões) selecionadas aleatoriamente com os filtros escolhidos.`}
        actions={<ButtonLink href="/questoes" variant="secondary">Alterar filtros</ButtonLink>}
      />
      <QuestionPlayer questions={questions} mode={mode} timeLimitMin={mode === "CRONOMETRADO" ? questions.length * 3 : undefined} />
    </div>
  );
}
