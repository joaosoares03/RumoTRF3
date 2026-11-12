"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, hashPassword, rateLimit, verifyPassword } from "@/lib/auth";
import { loginSchema, signupSchema } from "@/lib/validation";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

export async function signupAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    const fe: Record<string, string> = {};
    for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
    return { fieldErrors: fe };
  }
  const { name, email, password } = parsed.data;
  const h = await headers();
  if (!rateLimit(`signup:${h.get("x-forwarded-for") ?? "local"}`, 10)) return { error: "Muitas tentativas. Aguarde alguns minutos." };
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return { fieldErrors: { email: "Este e-mail já está cadastrado." } };

  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const isFirst = (await db.user.count()) === 0;
  const role = adminEmails.includes(email) || (adminEmails.length === 0 && isFirst) ? "ADMIN" : "USER";

  const user = await db.user.create({ data: { name, email, passwordHash: await hashPassword(password), role, preferences: { create: {} } } });
  await createSession(user.id, h.get("user-agent"));
  redirect("/onboarding");
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Informe e-mail e senha válidos." };
  const { email, password } = parsed.data;
  const h = await headers();
  if (!rateLimit(`login:${email}`) || !rateLimit(`login-ip:${h.get("x-forwarded-for") ?? "local"}`, 30)) {
    return { error: "Muitas tentativas de login. Aguarde 15 minutos." };
  }
  const user = await db.user.findUnique({ where: { email } });
  // Mensagem genérica para não revelar se o e-mail existe.
  if (!user || !(await verifyPassword(password, user.passwordHash))) return { error: "E-mail ou senha incorretos." };
  await createSession(user.id, h.get("user-agent"));
  const prefs = await db.userPreferences.findUnique({ where: { userId: user.id } });
  redirect(prefs?.onboardedAt ? safeNext(formData.get("next")) : "/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
