# Publicação (deploy)

O projeto roda localmente com **SQLite** (zero configuração). Para publicar na internet use **PostgreSQL** — SQLite em arquivo não funciona em plataformas serverless como a Vercel.

## Opção recomendada (gratuita): Vercel + Neon (ou Supabase)

1. Crie um banco PostgreSQL gratuito no **Neon** (neon.tech) ou **Supabase** e copie a *connection string* (`postgresql://...?...sslmode=require`).
2. No seu computador, coloque essa string em `DATABASE_URL` no `.env` e rode:
   ```bash
   npm run db:use-postgres
   ```
   Isso troca o provider para PostgreSQL, gera a migração inicial e carrega o conteúdo no banco remoto.
3. Coloque o projeto em um repositório Git (GitHub) **com a pasta `prisma/migrations` gerada**.
4. Na **Vercel**, importe o repositório e configure as variáveis de ambiente:
   - `DATABASE_URL` (a mesma do passo 1)
   - `ADMIN_EMAILS` (seu e-mail)
   - `ANTHROPIC_API_KEY` (opcional)
5. Build command: `prisma migrate deploy && npm run build` (o `npm run build` já roda `prisma generate`).
6. Depois do primeiro deploy, rode `npm run links:check` localmente (apontando para o mesmo banco) para verificar a biblioteca.

## Alternativas
- **Railway/Render/VPS com Node 20+:** `npm ci && npm run build && npm start` com PostgreSQL gerenciado.
- **Docker:** não incluído nesta versão.

## Observações
- Em PostgreSQL, buscas com `contains` são sensíveis a maiúsculas/minúsculas (no SQLite, não para ASCII). Ajuste para `mode: "insensitive"` se necessário.
- Rode `npm run backup` (SQLite) ou use os backups do provedor (PostgreSQL) — ver `docs/SEGURANCA.md`.
