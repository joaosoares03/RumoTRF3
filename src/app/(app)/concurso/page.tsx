import { ExternalLink, FileText, CalendarDays, Scale, Briefcase } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, CardBody, CardHeader, Notice, PageHeader } from "@/components/ui";
import { cn, formatDate, localDateKey } from "@/lib/utils";
import { EXAM_RULES } from "../../../../content/edital";

export const metadata = { title: "Central do concurso" };

export default async function ConcursoPage() {
  await requireUser();
  const exam = await db.exam.findFirstOrThrow({ include: { versions: { orderBy: { publishedAt: "desc" } }, milestones: { orderBy: { start: "asc" } }, specialties: true, updates: { orderBy: { publishedAt: "desc" } } } });
  const todayKey = localDateKey();
  const R = EXAM_RULES;
  return (
    <div>
      <PageHeader eyebrow={`${exam.board} · código TRFT2601`} title="Central do concurso" description={exam.name} />
      <Notice tone="warning" className="mb-6">
        Esta central resume os documentos oficiais. Em caso de divergência, prevalecem os editais publicados no DOU e no site do TRF3/Vunesp. Datas do cronograma estão sujeitas a alterações (Anexo VII).
      </Notice>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Estrutura das provas (item 8.1, retificado pelo Edital nº 02/2026)" icon={<Scale className="size-4" />} />
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted"><tr><th className="py-2">Prova</th><th>Questões</th><th>Peso</th><th>Caráter</th></tr></thead>
              <tbody>
                <tr className="border-t border-border"><td className="py-2">Objetiva — Conhecimentos Gerais</td><td>{R.geraisQuestions}</td><td>{R.pesoGerais}</td><td>Habilitatório e classificatório</td></tr>
                <tr className="border-t border-border"><td className="py-2">Objetiva — Conhecimentos Específicos</td><td>{R.especificosQuestions}</td><td>{R.pesoEspecificos}</td><td>Habilitatório e classificatório</td></tr>
                <tr className="border-t border-border"><td className="py-2">Discursiva — Redação</td><td>1</td><td>{R.pesoRedacao} <Badge tone="amber">retificado</Badge></td><td>Eliminatório e classificatório</td></tr>
              </tbody>
            </table>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              <li>Duração total: <strong>4h30</strong>; objetivas com 5 alternativas (item 8.2); redação no mesmo dia e período (item 8.3).</li>
              <li>Nota objetiva = média ponderada (Gerais peso 1, Específicos peso 2), escala 0–10 (item 10.2).</li>
              <li>Habilitação ampla concorrência: ≥ {R.habilitacao.amplaConcorrencia.minAcertosGerais} acertos em Gerais, ≥ {R.habilitacao.amplaConcorrencia.minAcertosEspecificos} em Específicos e média ≥ 6,00 (item 10.3).</li>
              <li>Negros/pardos, indígenas, quilombolas e PcD: ≥ {R.habilitacao.cotasPcd.minAcertosGerais}, ≥ {R.habilitacao.cotasPcd.minAcertosEspecificos} e média ≥ 4,80 (item 10.4.1).</li>
              <li>Redação: 0–10, habilitado com ≥ 5,00 (ou ≥ 4,00 para cotas/PcD) (itens 12.1.1 e 12.1.2.1). Corrigidas as redações dos 100 mais bem classificados na objetiva para os cargos 006 e 007, mais todos os habilitados de cotas/PcD (item 9.49).</li>
              <li>Nota final (Técnico) = nota objetiva + nota da redação (item 13.2). Desempate: idade ≥ 60, maior nota na redação, mais acertos em Específicos, depois em Gerais, jurado, maior idade e serviço voluntário em conciliação (item 13.3).</li>
            </ul>
            <p className="mt-3 text-xs text-muted">Fontes: {R.sources.join("; ")}.</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Documentos oficiais" icon={<FileText className="size-4" />} />
          <CardBody className="space-y-3">
            {exam.versions.map((v) => (
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border p-3 transition hover:border-accent">
                <div className="flex items-center gap-2 text-sm font-medium"><ExternalLink className="size-3.5" /> {v.title}</div>
                <div className="text-xs text-muted">DOU {formatDate(v.publishedAt)}</div>
                <p className="mt-1 text-xs">{v.summary}</p>
              </a>
            ))}
            {[
              ["Página de editais do TRF3", "https://www.trf3.jus.br/sege/concurso-servidores/2026/editais"],
              ["Página do concurso na Vunesp", "https://www.vunesp.com.br/TRFT2601"],
            ].map(([t, u]) => (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent"><ExternalLink className="size-3.5" />{t}</a>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Cronograma (Anexo VII)" subtitle="Datas previstas, sujeitas a alterações" icon={<CalendarDays className="size-4" />} />
          <CardBody>
            <ol className="relative space-y-3 border-l border-border pl-5">
              {exam.milestones.map((m) => {
                const past = (m.end ?? m.start).toISOString().slice(0, 10) < todayKey;
                const big = m.item === 12;
                return (
                  <li key={m.id} className={cn("relative", past && "opacity-50")}>
                    <span className={cn("absolute -left-[27px] top-1 size-3 rounded-full border-2", big ? "border-amber bg-amber" : past ? "border-border bg-surface-2" : "border-accent bg-surface")} />
                    <div className="text-xs text-muted">{formatDate(m.start, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}{m.end && ` a ${formatDate(m.end, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}`}</div>
                    <div className={cn("text-sm", big && "font-bold")}>{m.title}</div>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>

        <div className="space-y-6">
          {exam.specialties.map((s) => (
            <Card key={s.id}>
              <CardHeader title={`${s.code} · ${s.shortName}`} icon={<Briefcase className="size-4" />} />
              <CardBody className="space-y-2 pt-3 text-sm">
                <p><strong>{s.vacancies} vagas</strong> — {s.vacancyNotes}</p>
                <p className="text-muted"><strong className="text-text">Atribuições (Anexo I):</strong> {s.duties}</p>
              </CardBody>
            </Card>
          ))}
          <Card>
            <CardHeader title="Atualizações registradas" />
            <CardBody className="space-y-2 pt-3 text-sm">
              {exam.updates.map((u) => <div key={u.id}><div className="text-xs text-muted">{formatDate(u.publishedAt)}</div><div className="font-medium">{u.title}</div><div className="text-xs text-muted">{u.summary}</div></div>)}
              <p className="text-xs text-muted">Novas publicações devem ser cadastradas no painel administrativo (versões do edital).</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
