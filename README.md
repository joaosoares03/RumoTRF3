# Rumo TRF3 — plataforma de estudos para o concurso TRF3 2026

Plataforma web pessoal para a preparação ao concurso do **Tribunal Regional Federal da 3ª Região (Edital nº 01/2026, banca Fundação Vunesp)**, cargos de **Técnico Judiciário – Apoio Especializado**:

- **006 — Desenvolvimento de Sistemas de Informação**
- **007 — Suporte Técnico**

Inclui edital verticalizado completo, aulas autorais, banco de questões comentadas, simulados no formato da prova (24 + 36 questões, pesos 1 e 2, redação, 4h30), módulo de redação, flashcards com repetição espaçada (SM-2), planejador adaptativo, laboratório prático de TI, desempenho, biblioteca de links verificados, caderno digital, modo foco e painel administrativo.

> Plataforma independente. Não tem vínculo com o TRF3 nem com a Fundação Vunesp. As questões são **autorais de treinamento**, não oficiais.

---

## Como rodar no seu computador (Windows) — passo a passo

### 1. Instale o Node.js
Baixe o **Node.js 20 ou mais novo** (versão LTS) em https://nodejs.org e instale com as opções padrão.
Para conferir, abra o **PowerShell** e digite `node -v` — deve aparecer algo como `v22.x` ou `v24.x`.

### 2. Abra a pasta do projeto no terminal
No Explorador de Arquivos, abra a pasta `plataforma-trf3`, clique na barra de endereço, digite `powershell` e tecle Enter.

> **Atenção à pasta:** os comandos abaixo devem ser executados dentro de `plataforma-trf3` (não na pasta `Estudos`). Se o terminal estiver em `Estudos`, digite `cd plataforma-trf3` antes. Para facilitar, a pasta `Estudos` também tem atalhos: `npm run dev` funciona de lá, e o arquivo **`Iniciar plataforma.bat`** inicia tudo com duplo clique.

### 3. Instale as dependências (só na primeira vez)
```bash
npm install
```

### 4. Configure o banco e o conteúdo (só na primeira vez)
```bash
npm run setup
```
Isso cria o arquivo `.env`, o banco SQLite local (`prisma/dev.db`) e carrega todo o conteúdo (edital, aulas, questões, flashcards, laboratório, temas de redação e biblioteca). Não é preciso instalar banco de dados.

### 5. Inicie a plataforma
```bash
npm run dev
```
Abra **http://localhost:3000** no navegador.

### 6. Crie sua conta
Clique em **Criar conta**. A **primeira conta criada vira administradora** (para escolher outra, preencha `ADMIN_EMAILS` no `.env`). Em seguida responda à configuração inicial (especialidade, horas por dia, dias da semana, nível, disciplinas difíceis, assuntos já dominados, ciclo × cronograma fixo) e o plano até a prova é gerado automaticamente.

Para usar de novo depois: abra o terminal na pasta e rode só `npm run dev`.

---

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | inicia em modo desenvolvimento (http://localhost:3000) |
| `npm run build` e `npm start` | versão otimizada (produção) |
| `npm run setup` | configuração inicial completa |
| `npm run db:seed` | recarrega o conteúdo (idempotente, não apaga seu progresso) |
| `npm run db:reset` | **apaga o banco** (todas as contas e progresso) e recria do zero — pare o `npm run dev` antes |
| `npm run links:check` | verifica os links da biblioteca (requer internet) |
| `npm run content:validate` | valida o conteúdo em `content/` |
| `npm run content:coverage` | gera relatórios de cobertura e lacunas em `docs/relatorios/` |
| `npm run content:import -- arquivo.json` | importa recursos, questões ou aulas em lote |
| `npm run backup` | copia o banco local para `backups/` |
| `npm test` | testes unitários (Vitest) |
| `npm run test:e2e` | testes de ponta a ponta (Playwright; rode `npx playwright install chromium` antes) |
| `npm run typecheck` | checagem de tipos TypeScript |

---

## Funcionalidades

| Área | Destaques |
|---|---|
| **Painel** | contagem regressiva, meta diária, tempo hoje/semana, progresso do edital e por disciplina, questões e acertos, revisões, simulados, sequência, tarefas do dia, sugestão do próximo conteúdo, gráfico de 14 dias, calendário, alertas oficiais |
| **Edital verticalizado** | 176 assuntos com texto fiel e referência do edital, % estudado, questões, acerto, domínio, última/próxima revisão, prioridade, status e detecção de lacunas |
| **Disciplinas e aulas** | disciplina → módulo → assunto → subassunto; 52 aulas autorais com sumário, destaques, anotações, favoritos, exportação, resumo e exercícios de fixação |
| **Questões** | filtros (disciplina, assunto, dificuldade, inéditas/respondidas/erradas/favoritas/sinalizadas, origem), modo cronometrado, comentário por alternativa, caderno de erros, histórico, anotações |
| **Simulados** | completo (24+36+redação, 4h30), rápido, por disciplina, por assunto e personalizado; navegação, marcação, em branco, salvamento automático, correção pelo Cap. 10, relatório de erros, comparação |
| **Redação** | 8 temas autorais, editor com autossalvamento, linhas estimadas, cronômetro, critérios oficiais, checklist, autoavaliação, conectivos, exercícios por parte do texto, análise local e análise opcional por IA (estimativa não oficial) |
| **Flashcards** | SM-2, lacunas, código/comandos, cartões pessoais, erros viram cartões, estatísticas de retenção |
| **Planejador / Agenda** | plano até a prova (ciclo ou fixo), teoria + questões + revisões (1/7/15/30 dias) + redação + simulados, semana final de revisão, adaptação pela taxa de erro, replanejamento de atrasadas, arrastar e soltar, metas semanais, planejado × executado; agenda dia/semana/mês |
| **Laboratório de TI** | SQL executado no navegador (WebAssembly, isolado), código, Git, Docker, API; troubleshooting de rede/DNS/DHCP/AD/Linux/RAID, chamados ITIL |
| **Desempenho** | indicadores separados por especialidade, evolução semanal, acerto e tempo por disciplina, assuntos com mais erros, gerais × específicos, simulados, metas, consistência, recomendações, conquistas, exportação CSV/PDF |
| **Outros** | busca global, biblioteca verificada, caderno digital, modo foco (Pomodoro), notificações, central do concurso, comparador de especialidades, backup/exclusão de conta, painel administrativo com importação e verificação de links |

---

## Tecnologias
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 (SQLite local / PostgreSQL em produção) · Zod · Recharts · react-markdown · sql.js · bcryptjs · Vitest · Playwright. SDK oficial da Anthropic apenas para a análise opcional de redação.

**Decisões:** autenticação própria com sessões em banco (simples, sem serviços pagos); SQLite para rodar sem instalar nada no Windows; componentes de interface próprios no estilo shadcn/ui (sem dependência do CLI); conteúdo versionado em `content/` e carregado por seed idempotente.

## Estrutura
```
content/        conteúdo autoral e estrutura do edital (fonte de verdade do seed)
prisma/         schema, migrações versionadas e seed
scripts/        setup, verificação de links, importação, cobertura, backup, PostgreSQL
src/app/        páginas (App Router) e Server Actions
src/components/ componentes de interface
src/lib/        regras de negócio (planejador, SM-2, pontuação, redação, estatísticas, segurança)
tests/ e2e/     testes unitários e de ponta a ponta
docs/           análise do edital, algoritmos, segurança, conteúdo, deploy e relatórios
```

## Documentação
- `PROGRESSO.md` — status, cobertura, testes, lacunas e próximos passos
- `docs/EDITAL.md` — análise dos documentos oficiais e da referência visual
- `docs/ALGORITMOS.md` — SM-2, planejador, pontuação, métricas
- `docs/CONTEUDO.md` — origem do conteúdo, regras de qualidade e pipeline de atualização
- `docs/SEGURANCA.md` — segurança, LGPD, backup
- `docs/DEPLOY.md` — publicação (Vercel + Neon/Supabase)

## Integrações que exigem credenciais (todas opcionais)
- **Análise de redação por IA:** `ANTHROPIC_API_KEY` no `.env` (modelo configurável em `ANTHROPIC_MODEL`). Sem ela, a análise local gratuita continua funcionando.
- **Banco PostgreSQL em produção:** `DATABASE_URL` de um provedor (Neon/Supabase têm plano gratuito).

## Problemas comuns no Windows
- **"EPERM: operation not permitted ... query_engine"**: pare o `npm run dev` antes de rodar comandos do Prisma (o servidor trava a DLL).
- **Pasta no OneDrive:** funciona, mas a sincronização pode deixar a instalação lenta; se preferir, mova o projeto para uma pasta fora do OneDrive.
- **Porta 3000 ocupada:** `npx next dev -p 3001`.
