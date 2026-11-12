"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, signupAction, type FormState } from "@/app/actions/auth";
import { Button, Field, inputClass, Notice } from "./ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="E-mail">
        <input name="email" type="email" autoComplete="email" required className={inputClass} placeholder="voce@exemplo.com" />
      </Field>
      <Field label="Senha">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      {state?.error && <Notice tone="danger">{state.error}</Notice>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-accent hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signupAction, undefined);
  const fe = state?.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4">
      <Field label="Nome" error={fe.name}>
        <input name="name" autoComplete="name" required className={inputClass} placeholder="Como quer ser chamado(a)" />
      </Field>
      <Field label="E-mail" error={fe.email}>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Field label="Senha" error={fe.password} hint="Mínimo de 8 caracteres, com letras e números.">
        <input name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
      </Field>
      {state?.error && <Notice tone="danger">{state.error}</Notice>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
      <p className="text-xs text-muted">
        Seus dados de estudo ficam apenas neste sistema e não são compartilhados com terceiros (LGPD). Você pode exportá-los ou excluí-los em Configurações.
      </p>
      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
