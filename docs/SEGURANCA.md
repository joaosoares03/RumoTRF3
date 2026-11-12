# Segurança, privacidade e backup

## Autenticação e sessões
- Senhas com **bcrypt** (custo 12); nunca armazenadas nem registradas em texto.
- Sessão: token aleatório de 256 bits em **cookie httpOnly**, `SameSite=Lax`, `Secure` em produção; no banco fica apenas o **hash SHA-256** do token. Validade de 30 dias; logout apaga a sessão.
- Troca de senha encerra todas as sessões.
- Limite de tentativas de login (8 por e-mail / 30 por IP a cada 15 min) e de cadastro. Mensagem genérica de erro (não revela se o e-mail existe).
- Rotas protegidas por `middleware.ts` (sem cookie → login) **e** validação da sessão no servidor (`requireUser`) em todas as páginas e ações.

## Controle de acesso
- Todos os dados de estudo são filtrados pelo `userId` da sessão; ações verificam a posse do registro antes de alterar/excluir.
- Painel administrativo e ações administrativas exigem `role = ADMIN` (`requireAdmin`). O primeiro usuário cadastrado vira administrador, ou os e-mails de `ADMIN_EMAILS`.
- O gabarito e os comentários das questões **só saem do servidor depois da resposta** (o navegador não recebe `isCorrect` antes).

## Entradas e saídas
- Validação no servidor com **Zod** (cadastro, onboarding, tarefas, flashcards, notas, importações, versões do edital).
- **SQL injection:** acesso ao banco apenas via Prisma (consultas parametrizadas).
- **XSS:** React escapa o conteúdo; Markdown renderizado com `react-markdown` **sem HTML bruto**.
- Exportação CSV protege contra injeção de fórmulas em planilhas.
- Cabeçalhos: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`; `X-Powered-By` removido.
- Server Actions do Next.js têm verificação de origem (proteção CSRF).
- O laboratório SQL roda **no navegador** (sql.js/WebAssembly, banco em memória descartável) — nenhum código do usuário é executado no servidor.

## Segredos
- `.env` está no `.gitignore`; use `.env.example` como modelo. `ANTHROPIC_API_KEY` é opcional e só é lida no servidor.

## LGPD
- Dados mínimos: nome, e-mail e dados de estudo. Sem rastreadores ou compartilhamento.
- O titular pode **exportar** tudo (Configurações → Backup JSON) e **excluir a conta** com todos os dados (exclusão em cascata).
- A análise por IA é opcional; quando usada, envia apenas o texto da redação ao provedor configurado.

## Backup e recuperação
- **SQLite (local):** `npm run backup` copia `prisma/dev.db` para `backups/dev-AAAAMMDDHHMM.db`. Para restaurar: pare o servidor e copie o arquivo de volta para `prisma/dev.db`.
- **PostgreSQL (produção):** use os backups automáticos do provedor (Neon/Supabase) e/ou `pg_dump "$DATABASE_URL" -Fc -f backup.dump`; restauração com `pg_restore`.
- Cada usuário pode baixar o próprio backup JSON a qualquer momento.

## Pontos de atenção conhecidos
- O limitador de tentativas é em memória (reinicia com o servidor; em várias instâncias, use um armazenamento compartilhado).
- Não há verificação de e-mail nem recuperação de senha por e-mail (exigiria um serviço SMTP). Um administrador pode recriar a conta se necessário.
