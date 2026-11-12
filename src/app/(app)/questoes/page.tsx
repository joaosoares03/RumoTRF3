import Link from "next/link";
import { BookX, History, Play, Star, Flag } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDisciplines, getPrefs, scopeOf } from "@/lib/data";
import { scopeWhere } from "@/lib/questions";
import { questionTotals } from "@/lib/stats";
import { Button, ButtonLink, Card, CardBody, CardHeader, Field, Notice, PageHeader, Progress, StatCard, inputClass } from "@/components/ui";

export const metadata = { title: "Questões" };

export default async function QuestoesPage() {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const { active } = scopeOf(prefs);
  const [disciplines, totals, inScope, answeredDistinct, favs, flags] = await Promise.all([
    getDisciplines([active]),
    questionTotals(user.id, [active]),
    db.question.count({ where: scopeWhere([active]) }),
    db.question.count({ where: { AND: [scopeWhere([active]), { answers: { some: { userId: user.id } } }] } }),
    db.questionUserState.count({ where: { userId: user.id, favorite: true } }),
    db.questionUserState.count({ where: { userId: user.id, flagged: true } }),
  ]);
  const perDisc = await Promise.all(
    disciplines.map(async (d) => {
      const [count, ans, cor] = await Promise.all([
        db.question.count({ where: { status: "PUBLICADO", topic: { module: { disciplineId: d.id } } } }),
        db.answer.count({ where: { userId: user.id, question: { topic: { module: { disciplineId: d.id } } } } }),
        db.answer.count({ where: { userId: user.id, isCorrect: true, question: { topic: { module: { disciplineId: d.id } } } } }),
      ]);
      return { d, count, ans, cor };
    }),
  );

  return (
    <div>
      <PageHeader
        title="Banco de questões"
        description="Questões autorais de treinamento no estilo da banca, com cinco alternativas e comentário de cada uma. Não são questões oficiais da Vunesp — a importação de questões oficiais é feita no painel administrativo quando houver licença compatível."
        actions={
          <>
            <ButtonLink href="/questoes/caderno-de-erros" variant="secondary">
              <BookX className="size-4" /> Caderno de erros
            </ButtonLink>
            <ButtonLink href="/questoes/historico" variant="ghost">
              <History className="size-4" /> Histórico
            </ButtonLink>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Disponíveis" value={inScope} hint={active === "DEV" ? "gerais + 006" : "gerais + 007"} />
        <StatCard label="Já resolvidas" value={answeredDistinct} hint={`${inScope - answeredDistinct} inéditas`} />
        <StatCard label="Respostas" value={totals.answered} hint={totals.answered ? `${totals.rate.toLocaleString("pt-BR")}% de acerto` : "—"} />
        <StatCard label="Favoritas" value={favs} icon={<Star className="size-4" />} tone="amber" />
        <StatCard label="Sinalizadas" value={flags} icon={<Flag className="size-4" />} tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader title="Montar lista de questões" subtitle="Escolha os filtros e comece a resolver" icon={<Play className="size-4" />} />
          <CardBody>
            <form action="/questoes/resolver" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Disciplina">
                <select name="disciplina" className={inputClass}>
                  <option value="">Todas ({active === "DEV" ? "gerais + 006" : "gerais + 007"})</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Assunto">
                <select name="assunto" className={inputClass}>
                  <option value="">Todos</option>
                  {disciplines.map((d) => (
                    <optgroup key={d.id} label={d.name}>
                      {d.modules.flatMap((m) =>
                        m.topics.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title.length > 90 ? t.title.slice(0, 87) + "…" : t.title}
                          </option>
                        )),
                      )}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Dificuldade">
                <select name="dificuldade" className={inputClass}>
                  <option value="">Todas</option>
                  <option value="1">Fácil</option>
                  <option value="2">Média</option>
                  <option value="3">Difícil</option>
                </select>
              </Field>
              <Field label="Situação">
                <select name="situacao" className={inputClass}>
                  <option value="">Todas</option>
                  <option value="ineditas">Inéditas (nunca respondidas)</option>
                  <option value="respondidas">Já respondidas</option>
                  <option value="erradas">Somente as que errei</option>
                  <option value="favoritas">Favoritas</option>
                  <option value="sinalizadas">Sinalizadas para revisão</option>
                </select>
              </Field>
              <Field label="Origem / banca" hint="Metadados de banca e ano só aparecem em questões oficiais importadas com fonte.">
                <select name="origem" className={inputClass}>
                  <option value="">Todas</option>
                  <option value="AUTORAL">Autorais (treinamento)</option>
                  <option value="OFICIAL">Oficiais importadas</option>
                </select>
              </Field>
              <Field label="Quantidade">
                <select name="qtd" defaultValue="20" className={inputClass}>
                  {[5, 10, 20, 30, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} questões
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Modo" hint="No modo cronometrado, use ~3 min por questão (60 questões em ~3h, reservando 1h30 para a redação).">
                <select name="modo" className={inputClass}>
                  <option value="PRATICA">Prática (correção imediata)</option>
                  <option value="CRONOMETRADO">Treino por tempo (3 min/questão)</option>
                </select>
              </Field>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <Play className="size-4" /> Começar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Desempenho por disciplina" subtitle="Acertos reais nas suas respostas" />
          <CardBody className="space-y-4">
            {perDisc.map(({ d, count, ans, cor }) => (
              <div key={d.id}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <Link href={`/questoes/resolver?disciplina=${d.id}`} className="truncate hover:text-accent">
                    {d.name}
                  </Link>
                  <span className="shrink-0 text-xs text-muted">{ans ? `${Math.round((cor / ans) * 100)}% · ${ans} resp.` : `${count} questões`}</span>
                </div>
                <Progress value={ans ? (cor / ans) * 100 : 0} color={d.color} />
              </div>
            ))}
            {totals.answered === 0 && <Notice>Nenhuma resposta ainda — as barras mostram a sua taxa de acerto real assim que você começar.</Notice>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
