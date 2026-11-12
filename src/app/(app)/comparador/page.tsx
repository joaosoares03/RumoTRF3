import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { editalProgress, questionTotals } from "@/lib/stats";
import { Badge, Card, CardBody, CardHeader, Notice, PageHeader, Progress } from "@/components/ui";

export const metadata = { title: "Comparador de especialidades" };

/** Afinidades temáticas entre específicos (não há sobreposição literal no edital, exceto nos normativos). */
const OVERLAPS = [
  { tema: "LGPD", dev: "Normativos — Lei nº 13.709/2018", sup: "Segurança — LGPD no atendimento; Normativos — Lei nº 13.709/2018" },
  { tema: "Resolução CNJ nº 335/2020 (PDPJ-Br/PJe)", dev: "Normativos e Ecossistema PJe/PDPJ-Br", sup: "Normativos" },
  { tema: "Resolução CNJ nº 522/2023 (MoReq-Jus)", dev: "Normativos", sup: "Normativos" },
  { tema: "ENSEC-PJ (Res. CNJ 396/2021 e Port. 162/2021)", dev: "Normativos", sup: "Normativos" },
  { tema: "Segurança da informação", dev: "OWASP Top 10, Privacy by Design", sup: "CID, malwares, EDR, firewall, BitLocker" },
  { tema: "Banco de dados", dev: "Modelagem, SQL, PostgreSQL, SQL Server, Flyway, BI", sup: "— (citado apenas nas atribuições do Anexo I)" },
];

export default async function ComparadorPage() {
  const user = await requireUser();
  const [dev, sup, qd, qs, specs] = await Promise.all([editalProgress(user.id, ["DEV"]), editalProgress(user.id, ["SUP"]), questionTotals(user.id, ["DEV"]), questionTotals(user.id, ["SUP"]), db.specialty.findMany({ orderBy: { code: "asc" } })]);
  const common = dev.perDiscipline.filter((d) => d.kind === "GERAL");
  const devOnly = dev.perDiscipline.filter((d) => d.kind !== "GERAL");
  const supOnly = sup.perDiscipline.filter((d) => d.kind !== "GERAL");
  const sum = (a: typeof devOnly) => a.reduce((s, d) => s + d.topics, 0);
  const avg = (a: typeof devOnly) => (sum(a) ? Math.round(a.reduce((s, d) => s + d.percent * d.topics, 0) / sum(a)) : 0);
  return (
    <div>
      <PageHeader title="Comparador de especialidades" description="Diferenças entre 006 — Desenvolvimento de Sistemas e 007 — Suporte Técnico: conteúdo comum, exclusivo e seu progresso real em cada uma." />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[{ s: specs.find((x) => x.key === "DEV")!, ed: dev, q: qd, only: devOnly }, { s: specs.find((x) => x.key === "SUP")!, ed: sup, q: qs, only: supOnly }].map(({ s, ed, q, only }) => (
          <Card key={s.id} className="p-5">
            <div className="text-xs font-semibold uppercase text-accent">Cargo {s.code}</div>
            <h2 className="font-display text-xl font-semibold">{s.shortName}</h2>
            <p className="mt-1 text-sm text-muted">{s.vacancies} vagas · {s.duties}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-muted">Edital total</div><div className="font-display text-2xl">{ed.overall}%</div></div>
              <div><div className="text-xs text-muted">Específicos</div><div className="font-display text-2xl">{avg(only)}%</div></div>
              <div><div className="text-xs text-muted">Questões</div><div className="font-display text-2xl">{q.answered}</div></div>
            </div>
            <div className="mt-2 text-xs text-muted">{only.length} disciplinas específicas · {sum(only)} assuntos exclusivos</div>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader title={`Conteúdo comum — Conhecimentos Gerais (${sum(common)} assuntos)`} subtitle="Idêntico nas duas especialidades. O progresso é único e conta para ambas." />
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {common.map((d) => (
            <Link key={d.id} href={`/disciplinas/${d.slug}`} className="block rounded-xl border border-border p-3 hover:border-accent">
              <div className="text-sm font-medium">{d.name}</div>
              <div className="mt-2 flex items-center gap-2"><Progress value={d.percent} color={d.color} /><span className="text-xs">{d.percent}%</span></div>
            </Link>
          ))}
        </CardBody>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[{ t: "Exclusivo de Desenvolvimento (006)", list: devOnly }, { t: "Exclusivo de Suporte Técnico (007)", list: supOnly }].map((g) => (
          <Card key={g.t}>
            <CardHeader title={g.t} />
            <CardBody className="space-y-3">
              {g.list.map((d) => (
                <Link key={d.id} href={`/disciplinas/${d.slug}`} className="block">
                  <div className="mb-1 flex justify-between text-sm"><span>{d.name}</span><span className="text-muted">{d.topics} assuntos · {d.percent}%</span></div>
                  <Progress value={d.percent} color={d.color} />
                </Link>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Afinidades entre os específicos" subtitle="Temas que aparecem nas duas especialidades com recortes diferentes" />
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs uppercase text-muted"><tr><th className="py-2">Tema</th><th>006 — Desenvolvimento</th><th>007 — Suporte</th></tr></thead>
            <tbody>{OVERLAPS.map((o) => <tr key={o.tema} className="border-t border-border align-top"><td className="py-2 font-medium">{o.tema}</td><td className="py-2">{o.dev}</td><td className="py-2">{o.sup}</td></tr>)}</tbody>
          </table>
          <Notice className="mt-4">Os normativos transversais são disciplinas separadas em cada especialidade (o texto do edital difere: o de Desenvolvimento inclui as Portarias CNJ nº 252, 253 e 131). Por isso o progresso nelas é registrado separadamente. <Badge>Estudar as duas</Badge> aproveita bastante conteúdo comum: LGPD, Res. 335, 522 e ENSEC-PJ.</Notice>
        </CardBody>
      </Card>
    </div>
  );
}
