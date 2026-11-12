# Conteúdo: origem, qualidade e como ampliar

## O que existe (medido — ver `docs/relatorios/cobertura.md`)
| Tipo | Quantidade | Origem |
|---|---|---|
| Estrutura do edital | 19 disciplinas, 176 assuntos | Anexo VI do Edital 01/2026 (texto fiel) |
| Aulas | 52 aulas autorais (cobrem ~96% dos assuntos, contando assuntos tratados em aulas de módulo) | autoral |
| Questões | 185 (42 gerais, 78 DEV, 65 SUP), 5 alternativas comentadas cada | **autorais de treinamento** — não são questões oficiais |
| Flashcards | 117 oficiais + os gerados a partir de erros | autoral |
| Laboratório | 21 atividades (6 SQL no navegador + 15 cenários/chamados/código) | autoral |
| Temas de redação | 8 | autorais (não são temas de provas anteriores) |
| Biblioteca | 120 links públicos (118 verificados automaticamente em 11/11/2026) | fontes oficiais e complementares |

## Regras de qualidade aplicadas
- **Nenhum link é exibido como verificado sem verificação real** (HTTP 2xx + texto esperado na página). Os 2 links não confirmados (Manual de Redação da Presidência e showcase do PrimeFaces) ficam "em revisão" e não aparecem para estudantes.
- **Nenhum vídeo foi cadastrado**: títulos, canais e durações de vídeos só podem entrar após conferência (o painel admin confere pelo oEmbed do YouTube). Essa é uma lacuna declarada.
- Questões passam por validação automática (5 alternativas distintas, exatamente 1 correta, justificativa por alternativa, gabarito fundamentado e referência) no seed, na importação e no teste `tests/core.test.ts`.
- Atos não verificados (Portaria PRES nº 4.657/2026, Resolução PRES nº 426/2021, Portaria CNJ nº 116/2012, Resolução CJF nº 147/2011 e nº 709/2021) **não têm o conteúdo detalhado** nas aulas; os alunos são orientados a ler o texto oficial.

## Pipeline de atualização (sem alterar código)
1. **Matriz do edital** → `content/edital.ts` (seed cria disciplinas/módulos/assuntos).
2. **Lacunas** → `npm run content:coverage` gera `docs/relatorios/lacunas.md` (assuntos sem aula, material verificado ou questões); o painel admin mostra o mesmo.
3. **Pesquisar recursos** → manualmente (ou com apoio de IA/pesquisa), preferindo APIs e páginas oficiais.
4. **Importar** → Painel admin › Importação em lote (JSON) ou `npm run content:import -- arquivo.json`.
5. **Validar URLs e metadados** → `npm run links:check -- --only-pending` ou "Verificar agora" no painel (vídeos: oEmbed).
6. **Classificar** → cada recurso é associado a slugs de assuntos.
7. **Duplicados** → bloqueados por URL normalizada, título normalizado e (questões) enunciado idêntico.
8. **Revisão** → tudo entra como "em revisão"/rascunho.
9. **Publicar** → só recursos VERIFICADOS podem ser publicados.
10. **Links quebrados** → rode `npm run links:check` periodicamente; recursos que falham saem de "publicado" automaticamente.
11. **Histórico** → `ContentChangeLog` registra importações, verificações e mudanças de status (aba Histórico do painel).

## Formatos de importação
Veja exemplos na aba "Importação em lote" do painel. Resumo:
- **Recursos:** `title, url (https), type, provider, language, category, topics[], expect` (texto que deve existir na página).
- **Questões:** `code, topic, difficulty, statement, alternatives[5]{text, correct, why}, explanation, reference, origin` (`OFICIAL` exige `board` e `year` e só deve ser usado com licença compatível).
- **Aulas:** `slug, topic, title, minutes, summary, content` (Markdown). Mesmo slug = nova versão.

## Como adicionar conteúdo autoral pelo código
Edite os arquivos em `content/` e rode `npm run content:validate` e `npm run db:seed` (idempotente).
