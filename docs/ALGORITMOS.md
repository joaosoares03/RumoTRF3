# Algoritmos e regras de cálculo

Todas as regras abaixo estão implementadas em funções puras e cobertas por testes (`tests/core.test.ts`).

## 1. Repetição espaçada — SM-2 (`src/lib/sm2.ts`)

Algoritmo SuperMemo 2 (Piotr Woźniak, 1987). Após ver a resposta do cartão, o estudante avalia a lembrança:

| Botão | Nota SM-2 |
|---|---|
| Errei | 1 |
| Difícil | 3 |
| Bom | 4 |
| Fácil | 5 |

- Nota < 3: repetições = 0, intervalo = 1 dia, lapso +1 (o cartão também volta ao fim da fila da sessão atual).
- Nota ≥ 3: repetições + 1; intervalo = 1 dia (1ª), 6 dias (2ª), depois `round(intervalo × EF)`.
- `EF' = EF + (0,1 − (5 − q) × (0,08 + (5 − q) × 0,02))`, mínimo 1,3 (EF inicial 2,5).
- **Adaptação:** o intervalo é limitado ao número de dias até a prova (não faz sentido agendar revisão para depois dela).
- Questões respondidas incorretamente geram um **flashcard pessoal** com o gabarito, agendado para o dia seguinte.
- **Retenção (30 dias)** = % de revisões com nota ≥ 3 entre cartões já vistos (intervalo anterior ≥ 1).

## 2. Revisão de assuntos

Ao concluir teoria (aula concluída, tarefa de teoria concluída ou subassunto marcado), o assunto entra em **Em estudo** e recebe revisão para o dia seguinte. Cada revisão registrada avança o estágio: intervalos de **1, 7, 15 e 30 dias** (`TOPIC_REVIEW_INTERVALS`).

## 3. Percentual estudado e domínio (`src/lib/data-pure.ts`)

- **Percentual do assunto** = maior valor entre o status (Não iniciado 0% · Em estudo 40% · Revisando 75% · Dominado 100%) e a fração de subassuntos marcados.
- **Percentual da disciplina / do edital** = média dos assuntos.
- **Nível de domínio** (exige ≥ 5 respostas): Alto ≥ 85% de acerto · Médio ≥ 65% · Baixo < 65%.

## 4. Tempo estudado

Sessões vêm do modo foco (Pomodoro), leitura de aulas (tempo com a aba visível), resolução de questões, simulados, redação, flashcards, laboratório e tarefas concluídas (tempo declarado ao concluir). Para não contar duas vezes, os intervalos **sobrepostos são mesclados** (`mergedMinutes`).

## 5. Pontuação do simulado (`src/lib/scoring.ts`) — Edital nº 01/2026, Cap. 10

- Nota de cada prova objetiva: acertos ÷ total × 10.
- Nota objetiva = (Gerais × 1 + Específicos × 2) ÷ 3.
- Ampla concorrência: ≥ 12 acertos em Gerais, ≥ 18 em Específicos e média ≥ 6,00 (item 10.3).
- Negros/pardos, indígenas, quilombolas e PcD: ≥ 10, ≥ 15 e média ≥ 4,80 (item 10.4.1).
- Simulados com outra quantidade de questões aplicam os mesmos percentuais (50% / 40%), arredondando para cima, e isso é informado na tela.
- **Não há nota de corte nem ranking**: a plataforma não possui dados oficiais de outros candidatos.

## 6. Planejador (`src/lib/planner.ts`)

1. Dias de estudo = dias escolhidos entre hoje e a véspera da prova.
2. Peso da disciplina = peso da prova (Gerais 1, Específicos 2) × 2√(assuntos pendentes) × 1,4 (se marcada como difícil) × (1 + taxa de erro real, quando há ≥ 5 respostas).
3. **Ciclo:** sequência por *smooth weighted round-robin*. **Fixo:** cada dia da semana recebe disciplinas fixas pelo peso.
4. Cada dia: flashcards (10–15 min) → revisões vencidas (até 3) → no último dia da semana, redação e (a cada 2 semanas) simulado → blocos de **teoria (60%) + questões (40%)** do mesmo assunto.
5. **Semana final** (7 dias antes da prova): só questões das disciplinas com mais erros, revisões, simulado e redação.
6. Assuntos esgotados → **2ª passada** com questões, priorizando as disciplinas com maior taxa de erro.
7. **Replanejar atrasadas:** tarefas pendentes do passado vão para os próximos dias com folga (até 125% da carga diária).
8. **Regenerar com meu desempenho:** recalcula tudo a partir de hoje com as taxas de erro atuais, preservando tarefas concluídas e manuais.

Nenhuma probabilidade de cobrança ou estatística histórica é presumida.

## 7. Análise local de redação (`src/lib/essay.ts`)

Heurística gratuita, sem IA, ligada aos critérios do item 9.52: extensão estimada (≈ 11 palavras/linha) e regras do 9.53/9.54.4, número de parágrafos, marcas de 1ª/2ª pessoa, referências à coletânea, variedade de conectivos, repetições, períodos longos e parágrafos de um só período. **Não gera nota.**

## 8. Verificação de links (`src/lib/linkcheck.ts`)

GET com redirecionamentos e timeout de 25 s. **VERIFICADO** somente se HTTP 2xx **e** o texto esperado aparece na página. Vídeos do YouTube são conferidos pelo oEmbed (título e canal reais). Demais estados: QUEBRADO (404/410), INACESSIVEL, DIVERGENTE. Só recursos verificados são exibidos aos estudantes.
