"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Informe um título").max(200),
  content: z.string().max(50000),
  disciplineId: z.string().optional(),
  topicId: z.string().optional(),
  pinned: z.boolean(),
});

export async function saveNote(formData: FormData) {
  const user = await requireUser();
  const d = schema.parse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    content: formData.get("content") ?? "",
    disciplineId: formData.get("disciplineId") || undefined,
    topicId: formData.get("topicId") || undefined,
    pinned: formData.get("pinned") === "on",
  });
  let disciplineId = d.disciplineId ?? null;
  if (d.topicId) {
    const t = await db.topic.findUniqueOrThrow({ where: { id: d.topicId }, include: { module: true } });
    disciplineId = disciplineId ?? t.module.disciplineId;
  }
  const data = { title: d.title, content: d.content, disciplineId, topicId: d.topicId ?? null, pinned: d.pinned };
  let id = d.id;
  if (id) {
    const n = await db.note.findFirst({ where: { id, userId: user.id } });
    if (!n) throw new Error("Anotação não encontrada");
    await db.note.update({ where: { id }, data });
  } else {
    id = (await db.note.create({ data: { ...data, userId: user.id } })).id;
  }
  revalidatePath("/caderno");
  redirect(`/caderno?nota=${id}&salvo=1`);
}

export async function deleteNote(formData: FormData) {
  const user = await requireUser();
  await db.note.deleteMany({ where: { id: String(formData.get("id")), userId: user.id } });
  revalidatePath("/caderno");
  redirect("/caderno");
}
