import { expect, test, type Page } from "@playwright/test";

// Conta de teste criada apenas no banco isolado de E2E (prisma/e2e.db).
const EMAIL = `e2e.${Date.now()}@exemplo.com`;
const SENHA = "SenhaE2e2026";

async function signupAndOnboard(page: Page) {
  await page.goto("/cadastro");
  await page.getByPlaceholder("Como quer ser chamado(a)").fill("Pessoa E2E");
  await page.locator('input[name="email"]').fill(EMAIL);
  await page.locator('input[name="password"]').fill(SENHA);
  await page.getByRole("button", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/onboarding/);
  await page.getByText("As duas", { exact: true }).click();
  await page.getByRole("button", { name: /6\. Objetivo/ }).click();
  await page.getByRole("button", { name: "Gerar meu plano de estudos" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 120_000 });
}

test.describe.serial("Fluxo principal", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test("cadastro, onboarding e plano gerado", async () => {
    await signupAndOnboard(page);
    await expect(page.getByText("Plano gerado!")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Faltam \d+ dias/ })).toBeVisible();
    await page.goto("/planejador");
    await expect(page.getByText("Planejado na semana")).toBeVisible();
  });

  test("rota protegida exige login", async ({ browser }) => {
    const anon = await browser.newPage();
    await anon.goto("/dashboard");
    await expect(anon).toHaveURL(/login/);
    await anon.close();
  });

  test("edital verticalizado lista os assuntos oficiais", async () => {
    await page.goto("/edital");
    await expect(page.getByText("Emprego do sinal indicativo de crase").first()).toBeVisible();
    await expect(page.getByText(/Edital nº 01\/2026, Anexo VI/).first()).toBeVisible();
  });

  test("responder questão mostra gabarito comentado e registra no histórico", async () => {
    await page.goto("/questoes/resolver?qtd=1");
    await expect(page).toHaveURL(/s=\d+/);
    await page.locator("label").filter({ has: page.locator('input[type="radio"]') }).first().click();
    await page.getByRole("button", { name: "Responder" }).click();
    await expect(page.getByText("Gabarito comentado")).toBeVisible();
    await page.goto("/questoes/historico");
    await expect(page.locator("tbody tr")).toHaveCount(1);
  });

  test("simulado rápido é corrigido pelas regras do edital", async () => {
    await page.goto("/simulados");
    await page.getByRole("button", { name: "Iniciar", exact: true }).first().click();
    await expect(page).toHaveURL(/simulados\/[a-z0-9]+$/);
    await expect(page.getByText("0/20 respondidas")).toBeVisible();
    await page.getByRole("radio").first().click();
    await expect(page.getByText("1/20 respondidas")).toBeVisible();
    await expect(page.getByText("progresso salvo")).toBeVisible();
    await page.getByRole("button", { name: "Finalizar" }).click();
    await page.getByRole("button", { name: "Sim, finalizar e corrigir" }).click();
    await expect(page).toHaveURL(/resultado/, { timeout: 60_000 });
    await expect(page.getByText("Nota objetiva", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Mínimos do edital/).first()).toBeVisible();
  });

  test("redação salva rascunho automaticamente", async () => {
    await page.goto("/redacao");
    await page.getByRole("button", { name: "Redação livre" }).click();
    await expect(page).toHaveURL(/redacao\/[a-z0-9]+$/);
    const url = page.url();
    await page.getByLabel("Texto da redação").fill("A tecnologia transforma o serviço público. Contudo, exige responsabilidade.\n\nPortanto, é preciso equilíbrio.");
    await expect(page.getByText(/Rascunho salvo/)).toBeVisible({ timeout: 15_000 });
    await page.goto(url);
    await expect(page.getByLabel("Texto da redação")).toHaveValue(/tecnologia transforma/);
  });

  test("flashcard é revisado com SM-2", async () => {
    await page.goto("/flashcards/revisar");
    await page.getByRole("button", { name: /Mostrar resposta/ }).click();
    await page.getByRole("button", { name: /^Bom/ }).click();
    await expect(page.getByText(/Próxima revisão em 1 dia/)).toBeVisible();
  });

  test("usuário comum não acessa o painel administrativo", async ({ browser }) => {
    // o primeiro usuário do banco E2E é administrador; um segundo usuário não pode acessar /admin
    const other = await browser.newPage();
    await other.goto("/cadastro");
    await other.getByPlaceholder("Como quer ser chamado(a)").fill("Outra Pessoa");
    await other.locator('input[name="email"]').fill(`outra.${Date.now()}@exemplo.com`);
    await other.locator('input[name="password"]').fill(SENHA);
    await other.getByRole("button", { name: "Criar conta" }).click();
    await expect(other).toHaveURL(/onboarding/);
    await other.goto("/admin");
    await expect(other).not.toHaveURL(/\/admin/);
    await other.close();
  });

  test("exportação de backup retorna apenas os dados do usuário", async () => {
    const res = await page.request.get("/api/export?tipo=backup");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.dados.email).toBe(EMAIL);
    expect(JSON.stringify(json)).not.toContain("passwordHash");
  });
});
