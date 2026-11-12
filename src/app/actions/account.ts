"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser, destroySession, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export type AccountState = { error?: string; ok?: string } | undefined;

export async function changePassword(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const check = z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/).safeParse(next);
  if (!check.success) return { error: "A nova senha deve ter 8+ caracteres, com letras e números." };
  const u = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  if (!(await verifyPassword(current, u.passwordHash))) return { error: "Senha atual incorreta." };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  // encerra as outras sessões
  await db.session.deleteMany({ where: { userId: user.id } });
  await destroySession();
  redirect("/login");
}

/** Exclusão definitiva da conta e de todos os dados de estudo (direito do titular — LGPD, art. 18). */
export async function deleteAccount(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await requireUser();
  if (formData.get("confirm") !== "EXCLUIR") return { error: 'Digite EXCLUIR para confirmar.' };
  const u = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  if (!(await verifyPassword(String(formData.get("password") ?? ""), u.passwordHash))) return { error: "Senha incorreta." };
  await destroySession();
  await db.user.delete({ where: { id: user.id } }); // cascata remove todos os dados do usuário
  redirect("/cadastro");
}
