import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPrefs, scopeOf } from "@/lib/data";
import { AppShell } from "@/components/shell";
import { SpecialtySwitcher } from "@/components/specialty-switcher";
import { logoutAction } from "@/app/actions/auth";
import { setActiveSpecialty } from "@/app/actions/prefs";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const prefs = await getPrefs(user.id);
  if (!prefs.onboardedAt) redirect("/onboarding");
  const { prepared, active } = scopeOf(prefs);
  const unread = await db.notification.count({ where: { userId: user.id, readAt: null } });

  return (
    <AppShell
      user={{ name: user.name, role: user.role }}
      switcher={<SpecialtySwitcher action={setActiveSpecialty} active={active} prepared={prepared} />}
      unread={unread}
      logout={logoutAction}
    >
      {children}
    </AppShell>
  );
}
