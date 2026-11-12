import { SignupForm } from "@/components/auth-forms";

export const metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Crie sua conta</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Leva menos de um minuto. Depois, vamos montar seu plano até a prova.</p>
      <SignupForm />
    </>
  );
}
