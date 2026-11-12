import { LoginForm } from "@/components/auth-forms";

export const metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Bem-vindo(a) de volta</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Entre para continuar sua preparação.</p>
      <LoginForm next={next} />
    </>
  );
}
