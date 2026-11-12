import { requireUser } from "@/lib/auth";
import { getDisciplines, getExam, getPrefs } from "@/lib/data";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/shell";

export const metadata = { title: "Configuração inicial" };

export default async function OnboardingPage() {
  const user = await requireUser();
  const [prefs, disciplines, exam] = await Promise.all([getPrefs(user.id), getDisciplines(["DEV", "SUP"]), getExam()]);
  const data = disciplines.map((d) => ({
    slug: d.slug,
    name: d.name,
    kind: d.kind,
    specialty: d.specialty?.key ?? null,
    topics: d.modules.flatMap((m) => m.topics.map((t) => ({ id: t.id, title: t.title }))),
  }));
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">
        <OnboardingWizard name={user.name.split(" ")[0]} disciplines={data} examDate={exam.examDate.toISOString()} already={!!prefs.onboardedAt} />
      </main>
    </div>
  );
}
