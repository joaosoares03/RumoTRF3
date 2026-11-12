"use client";

import { useActionState } from "react";
import { changePassword, deleteAccount, type AccountState } from "@/app/actions/account";
import { Button, Field, Notice, inputClass } from "./ui";

export function ChangePasswordForm() {
  const [s, action, pending] = useActionState<AccountState, FormData>(changePassword, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field label="Senha atual"><input name="current" type="password" required autoComplete="current-password" className={inputClass} /></Field>
      <Field label="Nova senha" hint="8+ caracteres com letras e números. Todas as sessões serão encerradas."><input name="next" type="password" required autoComplete="new-password" className={inputClass} /></Field>
      {s?.error && <Notice tone="danger">{s.error}</Notice>}
      <Button variant="secondary" disabled={pending}>Alterar senha</Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [s, action, pending] = useActionState<AccountState, FormData>(deleteAccount, undefined);
  return (
    <form action={action} className="space-y-3">
      <Notice tone="danger">Exclui permanentemente sua conta e TODOS os dados de estudo (progresso, respostas, redações, anotações). Não pode ser desfeito — exporte um backup antes.</Notice>
      <Field label='Digite "EXCLUIR"'><input name="confirm" required className={inputClass} /></Field>
      <Field label="Senha"><input name="password" type="password" required autoComplete="current-password" className={inputClass} /></Field>
      {s?.error && <Notice tone="danger">{s.error}</Notice>}
      <Button variant="danger" disabled={pending}>Excluir minha conta</Button>
    </form>
  );
}
