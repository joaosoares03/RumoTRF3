# PROGRESSO — Rumo TRF3

Atualizado em 11/11/2026.

## Funcionalidades concluídas (implementadas e exercitadas)
- [x] Análise do Edital 01/2026, da retificação 02/2026 e da página da Vunesp (`docs/EDITAL.md`)
- [x] Estrutura completa do Anexo VI para 006 e 007: 5 disciplinas gerais compartilhadas + 7 específicas por especialidade, 176 assuntos com texto fiel e referência de página
- [x] Cadastro, login, sessões seguras, rotas protegidas, perfil administrador
- [x] Onboarding (especialidade/ambas, horas, dias, nível, difíceis, dominados, objetivo, ciclo × fixo) com geração automática do plano
- [x] Painel com indicadores reais (sem números fictícios)
- [x] Edital verticalizado com progresso, domínio, revisões, prioridade, status e lacunas de conteúdo
- [x] Disciplinas → módulos → assuntos → subassuntos; página de assunto com aulas, materiais, questões, flashcards, laboratório e anotações
- [x] Leitor de aulas: sumário, destaques com anotação, favoritos, conclusão, tempo de leitura, exportação, exercícios de fixação
- [x] Questões: filtros, inéditas/erradas/favoritas/sinalizadas, cronometrado, comentários por alternativa, caderno de erros, histórico, anotações
- [x] Simulados completo/rápido/disciplina/assunto/personalizado com cronômetro, navegação, marcação, branco, autossalvamento e retomada, correção pelo Cap. 10, relatório de erros e comparação
- [x] Redação: temas autorais, editor, autossalvamento, linhas, cronômetro, critérios, checklist, autoavaliação, conectivos, exercícios, análise local; análise por IA opcional (estimativa não oficial)
- [x] Flashcards SM-2 (básico, lacuna, código), cartões pessoais, erros → cartões, retenção
- [x] Planejador adaptativo (peso do edital + dificuldade + taxa de erro), revisões 1/7/15/30, redação semanal, simulados quinzenais, semana final, replanejamento, arrastar e soltar, metas semanais, planejado × executado; agenda dia/semana/mês
- [x] Laboratório: 6 exercícios SQL executados no navegador (sql.js) + 15 cenários/chamados/código
- [x] Desempenho: por especialidade, semanal, disciplina, tempo, erros, gerais × específicos, simulados, metas, consistência, recomendações, conquistas; CSV e PDF (impressão)
- [x] Biblioteca com 118 links verificados; busca global; caderno digital; modo foco (Pomodoro); notificações; central do concurso; comparador
- [x] Configurações, exportação/backup JSON, troca de senha, exclusão de conta (LGPD)
- [x] Painel admin: cobertura/lacunas, verificação de links (com oEmbed para vídeos), publicação, questões/aulas, importação em lote com detecção de duplicados, versões do edital, data da prova, histórico
- [x] Tema claro/escuro, layout responsivo (verificado sem rolagem horizontal em 375 px), acessibilidade básica (rótulos, foco visível, navegação por teclado no planejador e nos flashcards, `prefers-reduced-motion`)

## Em desenvolvimento / pendências
- [ ] Videoaulas: nenhuma cadastrada (exigem verificação de título/canal; fluxo pronto no painel via oEmbed)
- [ ] Materiais verificados para assuntos de Língua Portuguesa/RLM (não há documentação oficial por tópico; considerar materiais educacionais abertos)
- [ ] Textos oficiais não verificados: Portaria PRES nº 4.657/2026 e Resolução PRES nº 426/2021 (site do TRF3 não acessível pelo verificador), Portaria CNJ nº 116/2012, Resoluções CJF nº 147/2011 e nº 709/2021, Manual de Redação da Presidência (URL oficial não respondeu)
- [ ] Questões oficiais de provas anteriores: não importadas (exigem fonte e licença compatíveis)
- [ ] Recuperação de senha por e-mail (exige SMTP)
- [ ] Busca insensível a acentos (hoje: SQLite `LIKE`)

## Fontes consultadas
- Edital nº 01/2026 e Edital nº 02/2026 (trf3.jus.br), página do concurso na Vunesp
- Planalto (leis e decretos citados no edital), atos do CNJ (atos.cnj.jus.br, IDs conferidos), ANPD, UNICEF Brasil (DUDH), ONU Brasil (ODS), CERT.br, eMAG
- Documentações oficiais: MDN, TypeScript, Python, dev.java, Microsoft Learn, php.net, Spring, Django, Node.js, React, Angular, Vue, Hibernate, Jakarta EE, EF Core, Doctrine, GraphQL, OpenAPI, Maven, WildFly, Tomcat, Nginx, Hystrix, RabbitMQ, Kafka, Redis, Keycloak, OMG BPMN, jBPM, Git, Docker, Kubernetes, PostgreSQL, Flyway, OWASP, W3C WCAG, Ubuntu, Debian Handbook, ITI, RFC Editor, GLPI, Atlassian
- Relatório completo: `docs/relatorios/links.md`

## Cobertura de conteúdo por especialidade (medida no banco — `npm run content:coverage`)
| Escopo | Assuntos | Com aula | Com material verificado | Com questões | Completos* |
|---|---|---|---|---|---|
| Gerais (compartilhados) | 61 | 95% | 41% | 51% | 26% |
| Específicos 006 — Desenvolvimento | 73 | 97% | 93% | 89% | 79% |
| Específicos 007 — Suporte | 42 | 100% | 57% | 90% | 52% |
| **Edital 006 completo** | 134 | 96% | 69% | 72% | 55% |
| **Edital 007 completo** | 103 | 97% | 48% | 67% | 37% |

\* aula + material verificado + questões. "Com aula" inclui assuntos explicados em aulas de módulo (relação registrada em `content/lessons/index.ts`). Lacunas exatas por assunto: `docs/relatorios/lacunas.md`.

## Links não verificados
| Recurso | Motivo |
|---|---|
| Manual de Redação da Presidência da República | sem resposta dos servidores do Planalto (www4) e 404 no gov.br |
| PrimeFaces — showcase | HTTP 403 para clientes automatizados |

## Testes realizados
- **Unitários (Vitest):** 28 testes — SM-2, pontuação e mínimos do edital, planejador (dias, carga, dominados, revisões, pesos, adaptação por erro, semana final, replanejamento), análise de redação, validação de questões (inclusive todo o acervo), estrutura do edital, utilidades. Resultado: **28/28 aprovados**.
- **Validação de conteúdo:** `npm run content:validate` — 185 questões, 52 aulas, 117 flashcards, 21 laboratórios, 120 recursos: sem erros.
- **Typecheck:** `tsc --noEmit` sem erros.
- **Fumaça (todas as rotas autenticadas):** 42 rotas → HTTP 200, sem erro de renderização.
- **Fluxos manuais no navegador:** cadastro → onboarding → plano; resposta de questão com gabarito; simulado completo (60 questões, retomada após reinício do servidor, finalização e nota conferida manualmente); redação com autossalvamento e análise local; laboratório SQL; flashcard SM-2; planejador; layout mobile.
- **Build de produção:** `next build` concluído com sucesso (33 rotas).
- **E2E (Playwright):** **11/11 aprovados** em banco isolado (`prisma/e2e.db`, porta 3100): cadastro → onboarding → plano gerado; rota protegida exige login; edital verticalizado; questão com gabarito comentado e histórico; simulado rápido corrigido pelas regras do edital; redação com autossalvamento; flashcard com SM-2; usuário comum sem acesso ao painel admin; backup só com os dados do próprio usuário (sem hash de senha); login sem rolagem horizontal em desktop e mobile.

## Erros conhecidos
- `npm run db:reset` é bloqueado pelo Prisma quando executado por um agente de IA (exige confirmação explícita do usuário); rodado manualmente no terminal funciona.
- O primeiro simulado de teste perdeu a redação por um bug de recarregamento do servidor de desenvolvimento (corrigido: o Next passou a ignorar mudanças em `prisma/`).
- Em PostgreSQL, filtros de texto são sensíveis a maiúsculas (ver `docs/DEPLOY.md`).
- O limitador de tentativas de login é em memória.

## Próximas tarefas
1. Cadastrar videoaulas verificadas (oEmbed) para os assuntos de maior peso.
2. Ampliar o banco de questões nos assuntos sem questões (ver `docs/relatorios/lacunas.md`), priorizando Gerais.
3. Verificar manualmente os atos do TRF3/CJF e cadastrá-los na biblioteca.
4. Publicar em produção (Vercel + Neon) seguindo `docs/DEPLOY.md`.
5. Enviar capturas de tela da referência visual para refinar o design, se desejado.
