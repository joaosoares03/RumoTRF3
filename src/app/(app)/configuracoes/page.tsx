import Link from "next/link";
import { Download } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDisciplines, getPrefs } from "@/lib/data";
import { updateSettingsAction } from "@/app/actions/prefs";
import { ChangePasswordForm, DeleteAccountForm } from "@/components/account-forms";
import { Button, ButtonLink, Card, CardBody, CardHeader, Field, Notice, PageHeader, inputClass } from "@/components/ui";
import { parseJson } from "@/lib/utils";

export const metadata = { title: "Configurações" };

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function ConfigPage({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  const days = parseJson<number[]>(prefs.studyDays, []);
  const difficult = parseJson<string[]>(prefs.difficultDisciplines, []);
  const disciplines = await getDisciplines(["DEV", "SUP"]);
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Configurações" description={`Conta: ${user.name} · ${user.email}`} actions={<ButtonLink href="/onboarding" variant="secondary">Refazer configuração inicial</ButtonLink>} />
      {salvo && <Notice tone="success" className="mb-4">Configurações salvas.</Notice>}
      <div className="space-y-6">
        <Card>
          <CardHeader title="Plano de estudos e preferências" />
          <CardBody>
            <form action={updateSettingsAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Especialidades no plano">
                <select name="specialtyMode" defaultValue={prefs.specialtyMode} className={inputClass}>
                  <option value="DEV">006 — Desenvolvimento de Sistemas</option>
                  <option value="SUP">007 — Suporte Técnico</option>
                  <option value="AMBAS">As duas</option>
                </select>
              </Field>
              <Field label="Minutos por dia"><input name="dailyMinutes" type="number" min={30} max={720} defaultValue={prefs.dailyMinutes} className={inputClass} /></Field>
              <div className="sm:col-span-2">
                <div className="mb-1.5 text-sm font-medium">Dias de estudo</div>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d, i) => (
                    <label key={d} className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
                      <input type="checkbox" name="studyDays" value={i} defaultChecked={days.includes(i)} className="accent-[var(--accent)]" /> {d}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="Organização">
                <select name="planMode" defaultValue={prefs.planMode} className={inputClass}><option value="CICLO">Ciclo de estudos</option><option value="FIXO">Cronograma fixo</option></select>
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Pomodoro: foco (min)"><input name="pomodoroFocus" type="number" min={10} max={90} defaultValue={prefs.pomodoroFocus} className={inputClass} /></Field>
                <Field label="Pausa (min)"><input name="pomodoroBreak" type="number" min={3} max={30} defaultValue={prefs.pomodoroBreak} className={inputClass} /></Field>
              </div>
              <div className="sm:col-span-2">
                <div className="mb-1.5 text-sm font-medium">Disciplinas difíceis (recebem mais tempo)</div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {disciplines.map((d) => (
                    <label key={d.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" name="difficultDisciplines" value={d.slug} defaultChecked={difficult.includes(d.slug)} className="accent-[var(--accent)]" /> {d.name}</label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="notificationsEnabled" defaultChecked={prefs.notificationsEnabled} className="accent-[var(--accent)]" /> Receber notificações</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="regenerate" className="accent-[var(--accent)]" /> Regenerar o plano a partir de hoje</label>
              <div className="sm:col-span-2"><Button>Salvar</Button></div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Exportação e backup dos seus dados" subtitle="Você é titular dos seus dados (LGPD). Exporte quando quiser." />
          <CardBody className="flex flex-wrap gap-2">
            <ButtonLink href="/api/export?tipo=backup" variant="secondary"><Download className="size-4" /> Backup completo (JSON)</ButtonLink>
            <ButtonLink href="/api/export?tipo=respostas" variant="outline">Respostas (CSV)</ButtonLink>
            <ButtonLink href="/api/export?tipo=sessoes" variant="outline">Sessões (CSV)</ButtonLink>
            <ButtonLink href="/api/export?tipo=tarefas" variant="outline">Tarefas (CSV)</ButtonLink>
            <ButtonLink href="/api/export?tipo=anotacoes" variant="outline">Caderno (Markdown)</ButtonLink>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Privacidade" />
          <CardBody className="space-y-2 text-sm text-muted">
            <p>Seus dados de estudo são acessíveis apenas pela sua conta. Senhas são armazenadas com hash bcrypt; a sessão usa cookie httpOnly. Não há rastreadores nem compartilhamento com terceiros.</p>
            <p>A análise de redação por IA é opcional e só envia o texto da redação ao provedor (Anthropic) quando você a solicita e a chave de API estiver configurada pelo administrador. Detalhes técnicos no arquivo docs/SEGURANCA.md do projeto. <Link href="/concurso" className="text-accent">Informações oficiais do concurso</Link>.</p>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card><CardHeader title="Alterar senha" /><CardBody><ChangePasswordForm /></CardBody></Card>
          <Card><CardHeader title="Excluir conta" /><CardBody><DeleteAccountForm /></CardBody></Card>
        </div>
      </div>
    </div>
  );
}
