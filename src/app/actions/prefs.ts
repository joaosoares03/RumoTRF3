"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validation";
import { buildPlan, replanOverdue } from "@/lib/plan-service";

export async function setActiveSpecialty(formData: FormData) {
  const user = await requireUser();
  const s = formData.get("specialty") === "SUP" ? "SUP" : "DEV";
  await db.userPreferences.update({ where: { userId: user.id }, data: { activeSpecialty: s } });
  revalidatePath("/", "layout");
}

export type OnboardingState = { error?: string } | undefined;

export async function completeOnboarding(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const user = await requireUser();
  const parsed = onboardingSchema.safeParse({
    specialtyMode: formData.get("specialtyMode"),
    dailyMinutes: formData.get("dailyMinutes"),
    studyDays: formData.getAll("studyDays"),
    level: formData.get("level"),
    difficultDisciplines: formData.getAll("difficultDisciplines"),
    masteredTopics: formData.getAll("masteredTopics"),
    objective: formData.get("objective") ?? "",
    planMode: formData.get("planMode"),
    worksFullTime: formData.get("worksFullTime") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(" · ") };
  const d = parsed.data;

  // valida tópicos dominados (evita ids arbitrários)
  const valid = await db.topic.findMany({ where: { id: { in: d.masteredTopics } }, select: { id: true } });
  const mastered = valid.map((v) => v.id);

  await db.userPreferences.upsert({
    where: { userId: user.id },
    update: {
      specialtyMode: d.specialtyMode,
      activeSpecialty: d.specialtyMode === "SUP" ? "SUP" : "DEV",
      dailyMinutes: d.dailyMinutes,
      studyDays: JSON.stringify(d.studyDays.sort()),
      level: d.level,
      difficultDisciplines: JSON.stringify(d.difficultDisciplines),
      masteredTopics: JSON.stringify(mastered),
      objective: d.objective,
      planMode: d.planMode,
      worksFullTime: d.worksFullTime,
      onboardedAt: new Date(),
    },
    create: {
      userId: user.id,
      specialtyMode: d.specialtyMode,
      activeSpecialty: d.specialtyMode === "SUP" ? "SUP" : "DEV",
      dailyMinutes: d.dailyMinutes,
      studyDays: JSON.stringify(d.studyDays.sort()),
      level: d.level,
      difficultDisciplines: JSON.stringify(d.difficultDisciplines),
      masteredTopics: JSON.stringify(mastered),
      objective: d.objective,
      planMode: d.planMode,
      worksFullTime: d.worksFullTime,
      onboardedAt: new Date(),
    },
  });

  for (const topicId of mastered) {
    await db.topicProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId } },
      update: { status: "DOMINADO" },
      create: { userId: user.id, topicId, status: "DOMINADO", priority: 3 },
    });
  }

  await buildPlan(user.id);
  redirect("/dashboard?bemvindo=1");
}

export async function regeneratePlanAction() {
  const user = await requireUser();
  await buildPlan(user.id);
  revalidatePath("/planejador");
  revalidatePath("/dashboard");
  redirect("/planejador?regerado=1");
}

export async function replanOverdueAction() {
  const user = await requireUser();
  const n = await replanOverdue(user.id);
  revalidatePath("/planejador");
  revalidatePath("/dashboard");
  redirect(`/planejador?replanejadas=${n}`);
}

export async function updateSettingsAction(formData: FormData) {
  const user = await requireUser();
  const minutes = Math.max(30, Math.min(720, Number(formData.get("dailyMinutes")) || 120));
  const days = formData.getAll("studyDays").map(Number).filter((n) => n >= 0 && n <= 6);
  const mode = formData.get("specialtyMode");
  await db.userPreferences.update({
    where: { userId: user.id },
    data: {
      dailyMinutes: minutes,
      studyDays: JSON.stringify(days.length ? days.sort() : [1, 2, 3, 4, 5]),
      specialtyMode: mode === "SUP" || mode === "AMBAS" ? mode : "DEV",
      planMode: formData.get("planMode") === "FIXO" ? "FIXO" : "CICLO",
      notificationsEnabled: formData.get("notificationsEnabled") === "on",
      pomodoroFocus: Math.max(10, Math.min(90, Number(formData.get("pomodoroFocus")) || 25)),
      pomodoroBreak: Math.max(3, Math.min(30, Number(formData.get("pomodoroBreak")) || 5)),
      difficultDisciplines: JSON.stringify(formData.getAll("difficultDisciplines").map(String)),
    },
  });
  if (formData.get("regenerate") === "on") await buildPlan(user.id);
  revalidatePath("/", "layout");
  redirect("/configuracoes?salvo=1");
}
