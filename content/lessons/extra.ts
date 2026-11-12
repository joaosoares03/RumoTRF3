import type { LessonSeed } from "./types";

/** Segundo lote de aulas autorais (cobertura dos assuntos ainda sem aula). */
export const LESSONS_EXTRA: LessonSeed[] = [
  {
    slug: "interpretacao-e-semantica",
    topic: "lp-interpretacao",
    title: "Interpretação de textos, semântica e figuras de linguagem",
    minutes: 30,
    summary: "Compreender = o que o texto diz; interpretar = o que se pode inferir dele. Cuidado com extrapolação, redução e contradição. Denotação (sentido literal) × conotação (figurado). Discurso direto, indireto e indireto livre. Intertextualidade: paráfrase, paródia, citação, alusão. Figuras: metáfora, metonímia, hipérbole, ironia, eufemismo, antítese, paradoxo, prosopopeia. Sinônimos/antônimos dependem do contexto.",
    content: `## Para começar

Na Vunesp, a maioria das questões de interpretação pede que você **reconheça o que o texto afirma ou permite concluir**. Duas operações diferentes:

- **Compreensão:** localizar a informação explícita.
- **Interpretação:** inferir o que está implícito, sem ultrapassar o texto.

### Os três erros clássicos das alternativas

1. **Extrapolação:** vai além do que o texto autoriza ("sempre", "todos", "jamais").
2. **Redução:** toma uma parte pelo todo do argumento.
3. **Contradição:** afirma o oposto do texto.

## Gêneros e contexto histórico

Identifique **gênero** (notícia, crônica, artigo de opinião, charge, tira, poema), **finalidade** e **contexto de produção**: o que era "inovação" num texto de 1990 pode soar banal hoje. A questão pode pedir a relação entre uma referência do texto e a época em que foi escrito.

## Denotação e conotação

- **Denotação:** sentido literal, de dicionário — *"o servidor desligou a máquina"*.
- **Conotação:** sentido figurado, expressivo — *"o projeto morreu na gaveta"*.

## Discurso direto, indireto e indireto livre

- **Direto:** reproduz a fala com marcas (travessão, aspas, verbo *dicendi*).
- **Indireto:** o narrador relata a fala, com conectivo (*que, se*) e ajustes de pessoa, tempo e advérbios.
- **Indireto livre:** a fala ou o pensamento da personagem aparece "misturado" à narração, sem verbo *dicendi*.

## Intertextualidade

Relação entre textos: **citação**, **paráfrase** (reescrita fiel), **paródia** (retomada com subversão, frequentemente humorística), **alusão** e **epígrafe**.

## Figuras de linguagem mais cobradas

| Figura | Definição | Exemplo |
|---|---|---|
| Metáfora | comparação implícita | "A rede é uma teia de dependências." |
| Comparação | com conectivo | "Lento como uma tartaruga." |
| Metonímia | contiguidade (autor/obra, parte/todo) | "Leu Machado." |
| Hipérbole | exagero | "Já disse isso um milhão de vezes." |
| Eufemismo | suavização | "Ele nos deixou." |
| Ironia | diz o contrário do que pensa | "Que pontualidade, chegou só duas horas atrasado!" |
| Antítese | ideias opostas | "Riso e choro." |
| Paradoxo | ideias opostas no mesmo ser | "Um silêncio ensurdecedor." |
| Prosopopeia | atributos humanos a seres inanimados | "O sistema reclamou da carga." |

## Sinonímia e antonímia

A equivalência de sentido **depende do contexto**: *"o juiz **deferiu** o pedido"* → *acolheu*; não *adiou*. Em questões de substituição, teste a troca na frase e verifique se o sentido e a correção se mantêm.

## Resumo

Volte sempre ao texto, desconfie de generalizações, identifique a figura pelo mecanismo (semelhança, contiguidade, exagero, oposição) e confirme sinônimos no contexto.`,
  },
  {
    slug: "ortografia-acentuacao-pontuacao",
    topic: "lp-pontuacao",
    title: "Ortografia, acentuação e pontuação",
    minutes: 25,
    summary: "Acento: proparoxítonas sempre; paroxítonas terminadas em l, n, r, x, ps, ã(s), ão(s), i(s), u(s), um/uns, ditongo; oxítonas em a(s), e(s), o(s), em/ens. Novo Acordo: sem acento em ditongos abertos ei/oi de paroxítonas (ideia, heroico), sem trema, sem acento diferencial em pelo/para. Vírgula: separa adjuntos deslocados, apostos, vocativos, orações explicativas e coordenadas assindéticas; nunca entre sujeito e verbo ou verbo e complemento.",
    content: `## Acentuação gráfica — regras centrais

| Tipo | Regra | Exemplos |
|---|---|---|
| Proparoxítonas | **todas** acentuadas | público, técnico, lógica |
| Paroxítonas | terminadas em l, n, r, x, ps, ã(s), ão(s), i(s), us, um/uns, ditongo oral | útil, hífen, caráter, tórax, bíceps, órfã, órgão, júri, vírus, álbum, história |
| Oxítonas | terminadas em a(s), e(s), o(s), em, ens | sofá, você, após, também, parabéns |
| Monossílabos tônicos | terminados em a(s), e(s), o(s) | já, pé, nós |
| Hiatos i/u | tônicos, sozinhos na sílaba ou com s | saída, baú, país (mas *rainha*, *juiz*) |

### Novo Acordo Ortográfico (em vigor)

- **Sem acento** nos ditongos abertos **ei/oi** de paroxítonas: *ideia, assembleia, heroico, jiboia* (oxítonas mantêm: *papéis, herói*).
- **Sem trema:** *frequente, linguiça* (exceto nomes estrangeiros).
- **Sem acento** em *voo, enjoo, leem, veem, creem*.
- Acento diferencial **eliminado** em *para* (verbo), *pelo*, *polo*; **mantido** em *pôde* (passado) e *pôr* (verbo); facultativo em *fôrma*.
- Mantidos: *têm/vêm* (plural) e *contém/contêm*.

## Pontuação — a vírgula

**Use vírgula para:**

1. Isolar **adjunto adverbial deslocado** (obrigatória se longo): *Na última semana de janeiro, ocorrerá a prova.*
2. Isolar **aposto explicativo** e **vocativo**: *Ana, técnica do TRF3, ...* · *Senhores, atenção.*
3. Isolar **orações adjetivas explicativas**: *Os técnicos, que são concursados, ...*
4. Separar **orações coordenadas assindéticas** e as adversativas/conclusivas: *Estudou, porém não revisou.*
5. Isolar **conjunções deslocadas**: *O sistema, contudo, falhou.*
6. Marcar **elipse do verbo**: *Ana estudou redes; Bruno, banco de dados.*

**Não use vírgula:**

- entre **sujeito e verbo**: ✘ *Os servidores do setor, participaram.*
- entre **verbo e complemento**: ✘ *Informou, aos usuários que...*
- antes de **oração adjetiva restritiva**: *Os técnicos que faltaram serão convocados.*

## Outros sinais

- **Ponto e vírgula:** separa itens longos de enumeração ou orações já com vírgulas.
- **Dois-pontos:** anuncia enumeração, explicação, citação.
- **Travessão:** intercalação enfática ou fala em discurso direto.

## Resumo

Memorize as terminações das paroxítonas, as mudanças do Novo Acordo e a regra de ouro da vírgula: nada separa sujeito, verbo e complemento na ordem direta.`,
  },
  {
    slug: "morfologia-pronomes-verbos",
    topic: "lp-morfossintaxe",
    title: "Morfossintaxe: classes de palavras, pronomes, flexão, vozes e tempos verbais",
    minutes: 35,
    summary: "Morfossintaxe = classe (morfologia) + função (sintaxe) da palavra. Pronomes pessoais retos (sujeito) × oblíquos (complemento); colocação: próclise com palavra atrativa (não, que, advérbio, pronome indefinido), ênclise no início da frase, mesóclise com futuro. Formação: derivação (prefixal, sufixal, parassintética, regressiva, imprópria) e composição (justaposição, aglutinação). Vozes: ativa, passiva (analítica/sintética), reflexiva. Correlação: se + imperfeito do subjuntivo → futuro do pretérito.",
    content: `## Morfossintaxe

Analisar uma palavra **morfossintaticamente** é dizer sua **classe** (substantivo, verbo, pronome...) e sua **função** na oração (sujeito, objeto, adjunto...). Ex.: em *"Os técnicos **rapidamente** resolveram"*, *rapidamente* é **advérbio** (classe) e **adjunto adverbial de modo** (função).

### Classes que mudam de valor

- **Que:** pronome relativo (*o sistema **que** caiu*), conjunção integrante (*disse **que** viria*), conjunção causal etc.
- **Se:** conjunção condicional/integrante, pronome apassivador, índice de indeterminação do sujeito, pronome reflexivo.
- **Como:** conjunção comparativa, causal, conformativa; advérbio interrogativo.

## Pronomes

- **Pessoais retos** (eu, tu, ele...) → sujeito. **Oblíquos átonos** (me, te, o, a, lhe, se, nos...) → complementos: *o/a* = objeto direto; *lhe* = objeto indireto.
- **Tratamento:** verbo na 3ª pessoa (*Vossa Excelência **decidiu***).
- **Relativos:** *que, quem, o qual, cujo* (sem artigo depois: *o servidor **cujo** cargo*), *onde* (só lugar físico).
- **Colocação pronominal:**
  - **Próclise** com palavras atrativas: negação, pronomes relativos/indefinidos, advérbios, conjunções subordinativas — *Não **o** vi.*
  - **Ênclise** no início da oração e com imperativo afirmativo — *Entregue-**lhe** o ofício.* (Não se inicia frase com oblíquo átono na norma-padrão.)
  - **Mesóclise** com futuro do presente/pretérito sem atrativo — *Encaminhar-**se**-á.*

## Formação de palavras

| Processo | Exemplo |
|---|---|
| Derivação prefixal | **in**feliz |
| Derivação sufixal | feliz**mente** |
| Prefixal e sufixal | **in**feliz**mente** |
| Parassintética | **en**triste**cer** (sem um dos afixos a palavra não existe) |
| Regressiva | combater → combate |
| Imprópria | o **não** (advérbio → substantivo) |
| Composição por justaposição | guarda-chuva, girassol |
| Composição por aglutinação | planalto (plano + alto), fidalgo |

## Flexão

- **Nominal:** gênero, número e grau (*cidadãos*, *mal/mau*, superlativo *celebérrimo*).
- **Verbal:** pessoa, número, tempo, modo e voz. Atenção aos irregulares (*ver/vir*: *se eu vir* — futuro do subjuntivo de *ver*; *se eu vier* — de *vir*) e aos derivados (*intervir* conjuga como *vir*: *ele interveio*).

## Vozes do verbo

- **Ativa:** sujeito agente — *O técnico configurou o servidor.*
- **Passiva analítica:** *O servidor foi configurado pelo técnico.*
- **Passiva sintética:** *Configurou-se o servidor.* / *Configuraram-se os servidores.*
- **Reflexiva:** *O candidato preparou-se.*

## Correlação de tempos e modos

| Estrutura | Correlação correta |
|---|---|
| Se + imperfeito do subjuntivo | futuro do pretérito: *Se **estudasse**, **passaria**.* |
| Quando/se + futuro do subjuntivo | futuro do presente: *Quando **chegar**, **avisarei**.* |
| Pretérito perfeito na principal | imperfeito do subjuntivo na subordinada: *Pediu que **revisasse**.* |

## Resumo

Classe + função, colocação pronominal pelas palavras atrativas, os processos de formação e as correlações verbais resolvem a maioria das questões de morfossintaxe.`,
  },
  {
    slug: "periodo-composto-coesao",
    topic: "lp-coordenacao-subordinacao",
    title: "Período composto, conectivos, coesão, coerência e reescrita",
    minutes: 30,
    summary: "Coordenadas: aditivas, adversativas, alternativas, conclusivas, explicativas. Subordinadas substantivas (função de substantivo), adjetivas (restritivas sem vírgula / explicativas com vírgula) e adverbiais (causal, concessiva, condicional, conformativa, consecutiva, comparativa, final, temporal, proporcional). Coesão: referencial (pronomes, sinônimos, elipse) e sequencial (conectivos). Coerência: lógica e não contradição. Reescrita: manter sentido e correção.",
    content: `## Coordenação

Orações independentes sintaticamente:

| Tipo | Conectivos | Ideia |
|---|---|---|
| Aditiva | e, nem, não só... mas também | soma |
| Adversativa | mas, porém, contudo, todavia, entretanto | oposição |
| Alternativa | ou, ora... ora, quer... quer | alternância |
| Conclusiva | logo, portanto, por isso, pois (posposto) | conclusão |
| Explicativa | pois (anteposto), porque, que | justificativa |

## Subordinação

**Substantivas** exercem função de substantivo: *É necessário **que todos se inscrevam*** (subjetiva).

**Adjetivas**:
- **Restritiva** (sem vírgula) limita: *Os candidatos **que faltaram** serão eliminados.*
- **Explicativa** (com vírgulas) generaliza: *Os candidatos, **que estudaram**, foram bem.*

**Adverbiais** — o tipo é definido pela relação de sentido:

| Relação | Conectivos |
|---|---|
| Causa | porque, visto que, já que, uma vez que |
| Concessão | embora, ainda que, mesmo que, conquanto |
| Condição | se, caso, desde que, contanto que |
| Conformidade | conforme, segundo, consoante |
| Consequência | tão... que, de modo que |
| Finalidade | para que, a fim de que |
| Tempo | quando, enquanto, assim que |
| Proporção | à medida que, à proporção que |
| Comparação | como, mais... (do) que |

## Coesão e coerência

- **Coesão referencial:** retomar termos com pronomes, sinônimos, hiperônimos ou elipse — evita repetição.
- **Coesão sequencial:** conectivos explicitam a relação lógica entre orações e parágrafos.
- **Coerência:** o texto faz sentido, sem contradições, com progressão de ideias.

## Reescrita — o que a banca verifica

Ao trocar um conectivo ou reorganizar um período, a nova versão deve:

1. **manter o sentido** (a relação lógica não pode mudar: *embora* ≠ *porque*);
2. **manter a correção** (modo verbal: *embora* exige subjuntivo — *embora **seja***; pontuação; concordância).

> Original: *O sistema é seguro, **mas** exige atualização.* → Reescrita: ***Embora** o sistema seja seguro, exige atualização.* (✔ mantém a oposição/concessão e usa subjuntivo)

## Resumo

Identifique a relação de sentido antes de escolher o conectivo; diferencie restritivas e explicativas pela vírgula; na reescrita, confira sentido + correção.`,
  },
  {
    slug: "estruturas-logicas-e-sequencias",
    topic: "rlm-relacoes-arbitrarias",
    title: "Estruturas lógicas, associações e lógica das situações",
    minutes: 30,
    summary: "Problemas de associação: monte tabela pessoa × atributo e elimine com as pistas, começando pelas afirmativas. Sequências: procure diferenças, razões, padrões alternados ou posições. Orientação espacial/temporal: desenhe; calendário (dias da semana repetem a cada 7 dias). Verdades e mentiras: suponha e teste contradições.",
    content: `## Problemas de associação (relações arbitrárias)

Ex.: três servidores, três setores, três cidades. Método:

1. Monte uma **tabela** com as pessoas nas linhas e os atributos nas colunas.
2. Marque primeiro as **afirmações positivas** ("Bruno trabalha no Desenvolvimento") — elas eliminam linha e coluna inteiras.
3. Aplique as negativas ("Ana não trabalha no Suporte").
4. Se sobrar só uma possibilidade, confirme; se houver dúvida, **teste hipóteses** e descarte as que geram contradição.

| | Protocolo | Suporte | Desenvolvimento |
|---|---|---|---|
| Ana | ✔ | ✘ | ✘ |
| Bruno | ✘ | ✘ | ✔ |
| Carla | ✘ | ✔ | ✘ |

## Lógica das situações

- **Raciocínio sequencial:** analise diferenças (2, 6, 12, 20 → +4, +6, +8), razões (3, 6, 12 → ×2), alternâncias (A, C, B, D...) e posições no alfabeto.
- **Raciocínio verbal:** analogias ("médico está para hospital assim como professor está para escola").
- **Orientação espacial:** desenhe as posições (fila, mesa redonda, andares). Em mesa circular, "à direita" depende do sentido de quem está sentado.
- **Orientação temporal/calendário:** os dias da semana se repetem a cada **7 dias**; 30 dias após uma segunda-feira = segunda + 2 dias = quarta.
- **Formação de conceitos / discriminação de elementos:** identificar o elemento que não pertence ao grupo e o critério que une os demais.

## Verdades e mentiras

Suponha que determinada pessoa diz a verdade e verifique se as demais afirmações ficam consistentes. Se surgir contradição, a hipótese é falsa.

## Resumo

Tabela + eliminação para associações; padrão numérico ou de posição para sequências; desenho para orientação espacial; hipótese e contradição para verdades e mentiras.`,
  },
  {
    slug: "etica-integridade-servico-publico",
    topic: "etica-conceitos",
    title: "Ética, moral, integridade e ambiente de trabalho no serviço público",
    minutes: 25,
    summary: "Ética = reflexão sobre valores; moral = normas de conduta de um grupo. Integridade pública: alinhamento consistente a valores e normas para priorizar o interesse público. Princípios do art. 37 da CF (LIMPE). Sistemas de integridade do Judiciário (Res. CNJ 410/2021). Assédio moral, sexual e discriminação (Res. CNJ 351/2020): prevenção, acolhimento e comissões. Código de Conduta da JF: Res. CJF 147/2011.",
    content: `## Ética, moral e cidadania

- **Moral:** conjunto de normas e costumes que orientam a conduta de um grupo em determinado tempo.
- **Ética:** reflexão crítica sobre esses valores — por que agir de certo modo.
- **Cidadania e democracia:** o servidor atua em nome do Estado democrático; sua conduta deve respeitar direitos, igualdade e transparência.

## Ética no contexto público

Os princípios do **art. 37 da Constituição** (**L**egalidade, **I**mpessoalidade, **M**oralidade, **P**ublicidade e **E**ficiência — "LIMPE") orientam toda a atuação administrativa. A ética pública exige:

- agir com **impessoalidade** (sem favorecimentos);
- evitar **conflito de interesses**;
- **transparência** e prestação de contas;
- **urbanidade** no atendimento e respeito à dignidade.

## Integridade

**Integridade pública** é o alinhamento consistente a valores, princípios e normas éticas para sustentar e priorizar o interesse público sobre interesses privados. Um sistema de integridade combina prevenção, detecção e resposta: códigos de conduta, gestão de riscos, canais de denúncia, transparência e responsabilização.

No Judiciário, a **Resolução CNJ nº 410/2021** dispõe sobre **normas gerais e diretrizes para a instituição de sistemas de integridade** nos tribunais. Na Justiça Federal, o **Código de Conduta** foi instituído pela **Resolução CJF nº 147/2011**.

> Para a JF3R, o edital também cita a Portaria CNJ nº 116/2012, a Portaria PRES nº 4.657/2026 e a Resolução PRES nº 426/2021. Leia os textos oficiais no site do TRF3 — esta aula não detalha esses atos porque seus textos ainda não foram verificados pela plataforma.

## Ambiente de trabalho: assédio e discriminação

A **Resolução CNJ nº 351/2020** instituiu a **Política de Prevenção e Enfrentamento do Assédio Moral, do Assédio Sexual e da Discriminação** no Poder Judiciário. Pontos-chave:

- alcança magistrados, servidores, estagiários, terceirizados e demais colaboradores;
- prevê ações de **prevenção** (capacitação, campanhas), **acolhimento** das pessoas afetadas e **apuração** responsável;
- determina a criação de **Comissões de Prevenção e Enfrentamento do Assédio** nos tribunais (no TRF3 e nas Seções Judiciárias vinculadas).

## Resumo

Diferencie ética e moral, conheça o LIMPE e saiba qual norma trata de cada tema: Res. CNJ 410/2021 (integridade), Res. CJF 147/2011 (Código de Conduta da JF) e Res. CNJ 351/2020 (assédio e discriminação).`,
  },
  {
    slug: "processo-administrativo-e-lai",
    topic: "etica-lei-9784",
    title: "Processo administrativo federal (Lei 9.784/1999) e Lei de Acesso à Informação",
    minutes: 30,
    summary: "Lei 9.784: princípios (legalidade, finalidade, motivação, razoabilidade, proporcionalidade, moralidade, ampla defesa, contraditório, segurança jurídica, interesse público, eficiência); direitos do administrado (ciência, vista, cópias, formular alegações, assistência de advogado facultativa); deveres (verdade, lealdade, boa-fé). Recurso: 10 dias; decisão em 30. Anulação: 5 anos para atos favoráveis (salvo má-fé). LAI: transparência ativa e passiva; resposta em até 20 + 10 dias; sigilo 25/15/5 anos.",
    content: `## Lei nº 9.784/1999 — processo administrativo federal

Aplica-se à Administração Pública Federal, inclusive aos **órgãos dos Poderes Legislativo e Judiciário da União quando no desempenho de função administrativa** (art. 1º, § 1º).

### Princípios (art. 2º)

Legalidade, finalidade, motivação, razoabilidade, proporcionalidade, moralidade, ampla defesa, contraditório, segurança jurídica, interesse público e eficiência. O parágrafo único traz critérios como atuação conforme a lei e o Direito, **objetividade** no atendimento do interesse público, **divulgação oficial** dos atos, adequação entre meios e fins, **gratuidade** (ressalvadas as previsões legais) e impulsão de ofício.

### Direitos do administrado (art. 3º)

Ser tratado com respeito; ter **ciência** da tramitação, **vista** dos autos e obter **cópias**; formular alegações e apresentar documentos antes da decisão; fazer-se assistir **facultativamente** por advogado, salvo quando obrigatória por lei.

### Deveres do administrado (art. 4º)

Expor os fatos conforme a **verdade**; proceder com **lealdade, urbanidade e boa-fé**; não agir de modo temerário; prestar as informações solicitadas.

### Prazos e pontos frequentes

- **Recurso:** em regra **10 dias** (art. 59); decisão em até **30 dias**, prorrogáveis por igual período.
- O recurso é dirigido à autoridade que proferiu a decisão, que pode **reconsiderar em 5 dias**; se não o fizer, encaminha à autoridade superior (art. 56, § 1º).
- **Anulação de atos favoráveis:** decai em **5 anos**, salvo comprovada má-fé (art. 54).
- **Motivação obrigatória** em atos que neguem, limitem ou afetem direitos, imponham sanções, decidam recursos etc. (art. 50).
- **Prioridade de tramitação** (art. 69-A): pessoa com 60 anos ou mais, pessoa com deficiência e portadores de doenças graves, entre outros.

## Lei nº 12.527/2011 — Acesso à Informação (LAI)

- **Regra:** publicidade; **exceção:** sigilo.
- **Transparência ativa:** divulgação espontânea em sites (estrutura, despesas, licitações...). **Transparência passiva:** resposta a pedidos.
- Pedido **sem necessidade de justificar** o motivo.
- **Prazo de resposta:** imediato ou até **20 dias**, prorrogáveis por **10** com justificativa.
- **Classificação de sigilo:** ultrassecreta **25 anos**, secreta **15**, reservada **5**.
- Informações pessoais relativas à intimidade, vida privada, honra e imagem têm acesso restrito por até **100 anos** (art. 31).

## Resumo

Na 9.784, memorize princípios, direitos/deveres e prazos (10, 30, 5 dias de reconsideração, 5 anos de decadência). Na LAI: 20 + 10 dias e 25/15/5 anos.`,
  },
  {
    slug: "teoria-direitos-fundamentais",
    topic: "dh-teoria-geral",
    title: "Teoria geral dos direitos fundamentais e Declaração Universal",
    minutes: 25,
    summary: "Direitos humanos (plano internacional) × fundamentais (positivados na Constituição). Gerações/dimensões: 1ª liberdade (civis e políticos), 2ª igualdade (sociais, econômicos, culturais), 3ª fraternidade (difusos, meio ambiente, paz). Características: universalidade, historicidade, inalienabilidade, imprescritibilidade, irrenunciabilidade, indivisibilidade, relatividade. Eficácia vertical e horizontal. DUDH 1948: dignidade, igualdade, liberdade; documento base do sistema global.",
    content: `## Direitos humanos × direitos fundamentais

- **Direitos humanos:** reconhecidos no plano **internacional** (tratados, declarações), inerentes a toda pessoa.
- **Direitos fundamentais:** direitos humanos **positivados na Constituição** de um Estado (no Brasil, especialmente o Título II da CF/88).

## Dimensões (gerações)

| Dimensão | Valor | Exemplos |
|---|---|---|
| 1ª | **Liberdade** | vida, liberdade de expressão, propriedade, voto (direitos civis e políticos) — exigem abstenção do Estado |
| 2ª | **Igualdade** | saúde, educação, trabalho, previdência (direitos sociais, econômicos e culturais) — exigem prestações |
| 3ª | **Fraternidade/solidariedade** | meio ambiente equilibrado, paz, desenvolvimento, direitos do consumidor (difusos e coletivos) |

O termo **dimensões** é preferido porque os direitos se **somam**, não se substituem.

## Características

Universalidade · historicidade · **inalienabilidade** · **imprescritibilidade** · **irrenunciabilidade** · indivisibilidade e interdependência · **relatividade** (podem sofrer limitações quando colidem com outros direitos, resolvidas por ponderação) · vedação ao retrocesso.

## Eficácia

- **Vertical:** nas relações entre Estado e indivíduo.
- **Horizontal:** também nas relações entre particulares.
- **Aplicabilidade imediata** das normas definidoras de direitos e garantias fundamentais (art. 5º, § 1º, CF).
- Tratados de direitos humanos aprovados com rito de emenda têm **status constitucional** (art. 5º, § 3º); os demais, **supralegal** (entendimento do STF).

## Declaração Universal dos Direitos Humanos (1948)

Adotada pela **Assembleia Geral da ONU em 10/12/1948**. Afirma que todos nascem **livres e iguais em dignidade e direitos** (art. 1º) e reúne direitos civis, políticos, econômicos, sociais e culturais. Formalmente é uma **resolução** (não um tratado), mas tornou-se referência de todo o sistema global, desdobrada nos Pactos de 1966 (Direitos Civis e Políticos; Direitos Econômicos, Sociais e Culturais).

## Resumo

Diferencie os planos (internacional × constitucional), associe cada dimensão ao seu valor, memorize as características e a data/autoria da DUDH.`,
  },
  {
    slug: "logica-de-programacao",
    topic: "dev-logica",
    title: "Algoritmos e lógica de programação",
    minutes: 30,
    summary: "Algoritmo = sequência finita e não ambígua de passos. Estruturas: sequencial, condicional (se/senão, escolha-caso), repetição (enquanto, faça-enquanto, para). Variáveis, tipos, operadores (aritméticos, relacionais, lógicos; precedência). Modularização: funções, parâmetros por valor/referência, recursão (caso base!). Teste de mesa para rastrear valores.",
    content: `## Conceito

Um **algoritmo** é uma sequência **finita**, **ordenada** e **não ambígua** de instruções para resolver um problema. Pode ser representado em linguagem natural, **pseudocódigo** (Portugol), **fluxograma** ou código.

## Elementos básicos

- **Variáveis e constantes**, com **tipos** (inteiro, real, caractere, lógico).
- **Operadores:**
  - aritméticos: \`+ - * /\`, \`div\` (divisão inteira), \`mod\`/\`%\` (resto);
  - relacionais: \`= ≠ > < ≥ ≤\`;
  - lógicos: **E**, **OU**, **NÃO** (precedência: NÃO > E > OU).

## Estruturas de controle

\`\`\`
// Condicional
se (nota >= 6) entao
    escreva("Habilitado")
senao
    escreva("Não habilitado")
fimse

// Repetição com teste no início (pode executar 0 vezes)
enquanto (i <= 10) faca
    soma <- soma + i
    i <- i + 1
fimenquanto

// Repetição com teste no fim (executa ao menos 1 vez)
repita
    leia(opcao)
ate (opcao = 0)

// Repetição contada
para i de 1 ate 5 faca
    escreva(i * i)
fimpara
\`\`\`

## Modularização

- **Funções** retornam valor; **procedimentos** não.
- Passagem **por valor** (cópia) × **por referência** (altera a variável original).
- **Recursão:** a função chama a si mesma; precisa de **caso base** para terminar, senão ocorre estouro de pilha (*stack overflow*).

\`\`\`python
def fib(n):
    if n <= 1:          # caso base
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

## Teste de mesa

Técnica de executar o algoritmo "no papel", anotando o valor das variáveis a cada passo — indispensável nas questões de "qual a saída do código".

| i | soma |
|---|---|
| 1 | 1 |
| 2 | 3 |
| 3 | 6 |

## Pegadinhas

- Laço com condição que nunca se torna falsa → **laço infinito** (ex.: esquecer \`i++\`).
- Divisão inteira: \`7 div 2 = 3\`; \`7 mod 2 = 1\`.
- Curto-circuito: em \`A E B\`, se A é falso, B nem é avaliado (na maioria das linguagens).

## Resumo

Domine as três estruturas (sequência, decisão, repetição), a precedência dos operadores lógicos, recursão com caso base e o teste de mesa. Pratique no Laboratório.`,
  },
  {
    slug: "python-csharp-php",
    topic: "dev-python",
    title: "Python, C# e PHP 8: panorama comparado",
    minutes: 35,
    summary: "Python: tipagem dinâmica e forte, indentação define blocos, list/dict comprehension, tuplas imutáveis, def/class, self, exceções try/except/finally. C#: .NET, tipagem estática, propriedades {get; set;}, LINQ, async/await, using/IDisposable, tipos valor (struct) × referência (class). PHP 8: named arguments, union types, match, nullsafe ?->, constructor promotion, attributes, JIT; tipagem gradual (declare(strict_types=1)).",
    content: `## Python

- **Tipagem dinâmica e forte**: \`"1" + 1\` gera \`TypeError\`.
- **Indentação** define os blocos.
- Tipos: \`int, float, str, bool, list\` (mutável), \`tuple\` (imutável), \`dict\`, \`set\`.

\`\`\`python
pares = [x for x in range(10) if x % 2 == 0]   # list comprehension
idades = {"ana": 30, "bia": 25}
for nome, idade in idades.items():
    print(f"{nome}: {idade}")

class Servidor:
    def __init__(self, nome):        # construtor
        self.nome = nome             # atributo de instância
    def __str__(self):
        return f"Servidor({self.nome})"

try:
    valor = int("abc")
except ValueError as e:
    print("inválido", e)
finally:
    print("sempre executa")
\`\`\`

- \`is\` compara identidade; \`==\` compara valor.
- Argumento padrão mutável (\`def f(x=[])\`) é compartilhado entre chamadas — armadilha clássica.

## C# (.NET)

- **Tipagem estática**, compilado para IL e executado pelo CLR.
- **Propriedades**: \`public string Nome { get; set; }\`.
- **Tipos valor** (\`struct\`, \`int\`) × **referência** (\`class\`, \`string\` — imutável).
- **LINQ** para consultas em coleções; **async/await** para assincronia.
- \`using (var x = ...)\` chama \`Dispose()\` ao fim do bloco (IDisposable).

\`\`\`csharp
var tecnicos = servidores
    .Where(s => s.Cargo == "Técnico")
    .OrderBy(s => s.Nome)
    .Select(s => s.Nome)
    .ToList();
\`\`\`

- \`interface\`, \`abstract class\`, herança simples de classes; \`sealed\` impede herança; \`virtual\`/\`override\` para polimorfismo.

## PHP 8

Novidades da versão 8.0: **named arguments**, **union types** (\`int|string\`), expressão **match**, operador **nullsafe** \`?->\`, **constructor property promotion**, **attributes** (\`#[Route]\`), **JIT**. Versões 8.1+ trouxeram **enums**, **readonly properties** e *fibers*.

\`\`\`php
<?php
declare(strict_types=1);

final class Processo {
    public function __construct(
        private string $numero,       // constructor promotion
        private ?Vara $vara = null,
    ) {}

    public function cidade(): ?string {
        return $this->vara?->cidade;  // nullsafe
    }
}

$status = match ($codigo) {
    200 => 'ok',
    404 => 'não encontrado',
    default => 'erro',
};
\`\`\`

- Composer gerencia dependências; PSR-4 para autoload; frameworks como Laravel e Symfony (que usa **Doctrine**).

## Resumo

Python (dinâmico, comprehensions, tuplas imutáveis), C# (estático, propriedades, LINQ, using) e PHP 8 (match, nullsafe, named args, union types). Questões costumam pedir a saída de pequenos trechos — pratique o teste de mesa.`,
  },
  {
    slug: "front-end-html-css-frameworks",
    topic: "dev-react",
    title: "Front-end: HTML5, CSS3, React, Angular e Vue",
    minutes: 35,
    summary: "HTML5: semântica (header, nav, main, article, section, aside, footer), formulários (type=email/date/number, required), áudio/vídeo, canvas, localStorage. CSS3: seletores e especificidade (inline > id > classe > elemento), box model, flexbox, grid, media queries. React: componentes, JSX, props, estado (useState), efeitos (useEffect), virtual DOM, fluxo unidirecional. Angular: TypeScript, componentes com @Component, módulos/standalone, DI, data binding ({{ }}, [prop], (evento), [(ngModel)]), RxJS. Vue: SFC, reatividade, v-if/v-show/v-for/v-model.",
    content: `## HTML5

- **Elementos semânticos:** \`header, nav, main, article, section, aside, footer, figure\` — melhoram acessibilidade e SEO.
- **Formulários:** tipos \`email, url, number, date, tel\`, atributos \`required, pattern, placeholder\`.
- **APIs:** \`<audio>\`, \`<video>\`, \`<canvas>\`, Web Storage (\`localStorage\`, \`sessionStorage\`), geolocalização.
- Elementos de apresentação (\`<font>\`, \`<center>\`) são **obsoletos** — use CSS.

## CSS3

- **Especificidade:** estilo inline > \`#id\` > \`.classe\`/atributo/pseudoclasse > elemento. \`!important\` sobrepõe (evite).
- **Box model:** conteúdo + padding + border + margin; \`box-sizing: border-box\` inclui padding e borda na largura.
- **Flexbox** (uma dimensão): \`display:flex; justify-content; align-items; gap\`.
- **Grid** (duas dimensões): \`display:grid; grid-template-columns: repeat(3, 1fr)\`.
- **Responsividade:** \`@media (max-width: 768px) { ... }\`, unidades relativas (\`rem\`, \`%\`, \`vw\`).

## React

- Biblioteca de UI baseada em **componentes** e **JSX**.
- **Props** (entrada, somente leitura) e **estado** (\`useState\`); **fluxo de dados unidirecional**.
- \`useEffect\` para efeitos colaterais; array de dependências controla a reexecução.
- **Virtual DOM** + reconciliação; listas exigem \`key\` estável.

\`\`\`jsx
function Contador() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>Cliques: {n}</button>;
}
\`\`\`

## Angular

- Framework completo em **TypeScript** (Google), usado no front-end do PJe/PDPJ.
- **Componentes** (\`@Component\`), **serviços** com **injeção de dependência**, roteamento, formulários (template-driven e reativos), **RxJS** (Observables).
- **Data binding:** interpolação \`{{ valor }}\`, property binding \`[disabled]="x"\`, event binding \`(click)="salvar()"\`, two-way \`[(ngModel)]\`.
- **Diretivas** estruturais (\`*ngIf\`, \`*ngFor\` ou a nova sintaxe \`@if\`, \`@for\`) e de atributo.
- **Angular CLI**: \`ng new\`, \`ng generate component\`, \`ng serve\`.

## Vue.js

- Framework progressivo; **Single File Components** (\`.vue\` com template, script e style).
- **Reatividade** (\`ref\`, \`reactive\` na Composition API).
- Diretivas: \`v-if\` (renderização condicional real) × \`v-show\` (alterna \`display\`), \`v-for\`, \`v-bind\` (\`:\`), \`v-on\` (\`@\`), \`v-model\` (two-way).

## Resumo

HTML semântico, especificidade e box model no CSS, hooks e fluxo unidirecional no React, binding e DI no Angular, diretivas e reatividade no Vue.`,
  },
  {
    slug: "orm-jpa-hibernate-ef-doctrine",
    topic: "dev-jpa",
    title: "Mapeamento objeto-relacional: JPA, Hibernate, EF Core e Doctrine",
    minutes: 30,
    summary: "ORM mapeia classes ↔ tabelas. JPA é especificação (Jakarta Persistence); Hibernate é implementação. Anotações @Entity, @Id, @GeneratedValue, @OneToMany/@ManyToOne, @JoinColumn. EntityManager: persist, find, merge, remove; estados new/managed/detached/removed. Fetch: *ToOne EAGER, *ToMany LAZY; problema N+1 (use JOIN FETCH). JPQL consulta entidades. EF Core: DbContext, DbSet, LINQ, migrations. Doctrine: Data Mapper + EntityManager + Unit of Work.",
    content: `## Conceito

**ORM (Object-Relational Mapping)** traduz objetos da aplicação em linhas de tabelas e vice-versa, reduzindo SQL repetitivo. O desafio é o **descompasso de impedância** (herança, coleções e identidade de objetos não existem diretamente no modelo relacional).

## JPA × Hibernate

- **JPA (Jakarta Persistence API):** **especificação** — define anotações, \`EntityManager\` e JPQL.
- **Hibernate:** **implementação** (provedor) mais usada da JPA, com recursos extras (Envers, cache de 2º nível).

\`\`\`java
@Entity
@Table(name = "processo")
public class Processo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)       // padrão seria EAGER
    @JoinColumn(name = "vara_id")
    private Vara vara;

    @OneToMany(mappedBy = "processo", cascade = CascadeType.ALL)
    private List<Movimento> movimentos;      // LAZY por padrão
}
\`\`\`

### Ciclo de vida da entidade

**new/transient** → \`persist()\` → **managed** → (fim da transação/contexto) → **detached** → \`merge()\` → managed; \`remove()\` → **removed**.

### Consultas

- **JPQL** consulta **entidades**, não tabelas: \`SELECT p FROM Processo p WHERE p.vara.cidade = :cidade\`.
- **Problema N+1:** carregar uma lista e, depois, cada associação lazy em uma consulta separada. Solução: \`JOIN FETCH\`, *entity graphs* ou *batch fetching*.
- Cache de **1º nível** (por EntityManager/Session, sempre ativo) e de **2º nível** (opcional, compartilhado).

## Entity Framework Core (.NET)

- \`DbContext\` representa a sessão; \`DbSet<T>\` representa as tabelas.
- Consultas com **LINQ**; **Migrations**: \`dotnet ef migrations add Nome\` → \`dotnet ef database update\`.
- Abordagens *code-first* (mais comum) e *database-first* (scaffold).

## Doctrine (PHP)

- Padrão **Data Mapper**: entidades são objetos simples; o **EntityManager** e a **Unit of Work** cuidam da persistência (\`persist()\` + \`flush()\`).
- Consultas com **DQL** ou QueryBuilder; mapeamento por **attributes** (PHP 8) ou XML.
- Contraste: o Eloquent (Laravel) segue **Active Record** (o próprio objeto sabe se salvar).

## Resumo

JPA é especificação e Hibernate implementação; conheça anotações, estados da entidade, fetch padrão e o N+1. EF Core usa DbContext + migrations; Doctrine é Data Mapper com Unit of Work.`,
  },
  {
    slug: "pje-jsf-primefaces-maven-servidores",
    topic: "dev-jsf",
    title: "Stack do PJe: JSF, PrimeFaces, Maven e servidores de aplicação",
    minutes: 30,
    summary: "JSF: framework MVC de componentes do Jakarta EE; Facelets (.xhtml); managed beans/CDI (@Named, escopos Request/View/Session/Application); ciclo de vida de 6 fases. PrimeFaces: biblioteca de componentes JSF com AJAX (update, process). Maven: pom.xml, coordenadas groupId:artifactId:version, ciclo validate→compile→test→package→verify→install→deploy, escopos compile/provided/runtime/test. WildFly/JBoss EAP (Jakarta EE completo), Tomcat (contêiner de servlets), Nginx (servidor web/proxy reverso/balanceador).",
    content: `## JSF — Jakarta Faces

Framework **orientado a componentes** do Jakarta EE, base da interface do PJe legado.

- Páginas **Facelets** (\`.xhtml\`) com componentes \`h:\`/\`f:\`.
- **Beans** CDI (\`@Named\`) com escopos \`@RequestScoped\`, \`@ViewScoped\`, \`@SessionScoped\`, \`@ApplicationScoped\`.
- **Expression Language**: \`#{processoBean.numero}\`.

### Ciclo de vida (6 fases)

1. **Restore View** — restaura/cria a árvore de componentes;
2. **Apply Request Values** — lê os valores enviados;
3. **Process Validations** — conversores e validadores;
4. **Update Model Values** — atualiza o bean;
5. **Invoke Application** — executa a ação;
6. **Render Response** — gera o HTML.

\`immediate="true"\` antecipa o processamento de um componente para a fase 2.

## PrimeFaces

Biblioteca de componentes ricos para JSF (\`p:dataTable\`, \`p:dialog\`, \`p:calendar\`...) com **AJAX** declarativo:

\`\`\`xml
<p:commandButton value="Salvar" action="#{processoBean.salvar}"
                 process="@form" update="mensagens tabela" />
\`\`\`

\`process\` define o que é enviado/processado; \`update\` define o que é re-renderizado.

## Maven

- **pom.xml** descreve o projeto e dependências por coordenadas **groupId:artifactId:version**.
- **Ciclo default:** validate → compile → test → package → verify → **install** (repositório local \`~/.m2\`) → **deploy** (repositório remoto). Executar uma fase executa as anteriores.
- **Escopos:** \`compile\` (padrão), \`provided\` (fornecida pelo servidor, ex.: Servlet API), \`runtime\`, \`test\`.
- Projetos **multimódulo** com POM pai; empacotamentos \`jar\`, \`war\`, \`ear\`.

## Servidores de aplicação e middleware

| Software | Papel |
|---|---|
| **WildFly / JBoss EAP** | servidor de aplicação **Jakarta EE completo** (EJB, JMS, JTA, CDI...). JBoss EAP é a versão com suporte comercial da Red Hat, baseada no WildFly |
| **Apache Tomcat** | **contêiner de servlets** (Servlet, JSP, EL, WebSocket); embarcado por padrão no Spring Boot |
| **Nginx** | servidor web de alto desempenho, **proxy reverso**, balanceador de carga (\`upstream\`), terminação TLS e cache |

\`\`\`nginx
upstream backend { server 10.0.0.11:8080; server 10.0.0.12:8080; }
server {
  listen 443 ssl;
  location / { proxy_pass http://backend; }
}
\`\`\`

## Resumo

Saiba as 6 fases do JSF, \`process\`/\`update\` do PrimeFaces, o ciclo e os escopos do Maven e o papel de cada servidor (EE completo × servlets × proxy).`,
  },
  {
    slug: "bpmn-e-jbpm",
    topic: "dev-bpmn",
    title: "Modelagem de processos: BPMN 2.0 e jBPM",
    minutes: 25,
    summary: "BPMN 2.0 (OMG): eventos (círculos: início, intermediário, fim), atividades (retângulos arredondados: tarefa, subprocesso), gateways (losangos: exclusivo X, paralelo +, inclusivo O, baseado em eventos), fluxos de sequência (linha cheia) e de mensagem (tracejada entre pools), pools e lanes, artefatos e objetos de dados. jBPM: motor de workflow Java (KIE) que executa BPMN 2.0, com tarefas humanas e integração com regras (Drools).",
    content: `## BPMN 2.0

**Business Process Model and Notation**, mantido pela **OMG**, padroniza diagramas de processos de negócio compreensíveis por analistas e executáveis por motores de workflow.

### Elementos de fluxo

| Elemento | Forma | Exemplos |
|---|---|---|
| **Eventos** | círculo | início (borda fina), intermediário (borda dupla), fim (borda grossa); gatilhos: mensagem, timer, erro, sinal |
| **Atividades** | retângulo arredondado | tarefa (usuário, serviço, script, manual), subprocesso (com "+") |
| **Gateways** | losango | **exclusivo (X)**: um caminho; **paralelo (+)**: todos os caminhos; **inclusivo (O)**: um ou mais; baseado em eventos |

### Conectores

- **Fluxo de sequência** (linha cheia): ordem das atividades **dentro** de um pool.
- **Fluxo de mensagem** (linha tracejada): comunicação **entre pools** (participantes diferentes).
- **Associação** (pontilhada): liga artefatos a elementos.

### Raias

- **Pool:** participante (ex.: Tribunal, Cidadão).
- **Lane:** subdivisão de responsabilidades dentro do pool (ex.: Secretaria, Gabinete).

### Exemplo (descrição)

Petição recebida (evento de início de mensagem) → *Autuar* (tarefa de usuário) → gateway exclusivo "Documentação completa?" → **sim**: *Distribuir* → fim; **não**: *Intimar para complementar* → evento de timer (15 dias) → volta à análise.

## jBPM

- Suíte **open source** de BPM em **Java**, parte do ecossistema **KIE** (com Drools para regras de negócio).
- Executa processos modelados em **BPMN 2.0**; suporta **tarefas humanas**, persistência do estado do processo, eventos e integração com sistemas por serviços.
- Usado para automatizar fluxos de trabalho processuais e administrativos.

## Resumo

Associe forma → tipo (círculo evento, retângulo atividade, losango gateway), diferencie gateways X/+/O e fluxo de sequência × de mensagem. jBPM é o motor Java que executa BPMN.`,
  },
  {
    slug: "flyway-e-business-intelligence",
    topic: "dev-flyway",
    title: "Versionamento de banco com Flyway e noções de BI (DW, ETL, OLAP)",
    minutes: 30,
    summary: "Flyway: migrações versionadas V<versão>__<descricao>.sql aplicadas em ordem, registradas em flyway_schema_history com checksum; repetíveis R__; comandos migrate, info, validate, baseline, repair (clean é destrutivo). BI: Data Warehouse (orientado a assunto, integrado, não volátil, variante no tempo — Inmon); modelagem dimensional (Kimball): fato + dimensões, esquema estrela e floco de neve; ETL × ELT; OLAP: drill-down, roll-up, slice, dice, pivot; MOLAP, ROLAP, HOLAP.",
    content: `## Flyway

Ferramenta de **versionamento de esquema** de banco: cada alteração vira um script versionado, aplicado em ordem e rastreado.

- **Migração versionada:** \`V1__criar_tabela_processo.sql\`, \`V2__adicionar_coluna_ano.sql\` (prefixo **V**, versão, **dois sublinhados**, descrição).
- **Migração repetível:** \`R__atualizar_views.sql\` — reaplicada sempre que o conteúdo (checksum) muda.
- Histórico na tabela **\`flyway_schema_history\`** com versão, descrição, data e **checksum**.

| Comando | Função |
|---|---|
| \`migrate\` | aplica as migrações pendentes |
| \`info\` | mostra o estado |
| \`validate\` | confere checksums × arquivos |
| \`baseline\` | marca um banco existente como ponto de partida |
| \`repair\` | corrige o histórico (ex.: checksums) |
| \`clean\` | **apaga todos os objetos** — nunca em produção |

> Regra de ouro: **nunca altere** uma migração já aplicada; crie uma nova.

## Business Intelligence

### Data Warehouse

Repositório **orientado a assunto, integrado, não volátil e variante no tempo** (definição de Inmon), otimizado para análise, não para transações (OLTP).

- **Data Mart:** subconjunto departamental do DW.
- Abordagens: **Inmon** (top-down, DW corporativo normalizado) × **Kimball** (bottom-up, modelagem dimensional e *data marts* integrados por dimensões conformadas).

### Modelagem dimensional

- **Tabela fato:** métricas numéricas (quantidade de processos, valor da causa) e chaves estrangeiras para dimensões.
- **Dimensões:** contexto descritivo (tempo, vara, classe processual, parte).
- **Esquema estrela:** dimensões desnormalizadas ligadas à fato. **Floco de neve:** dimensões normalizadas em sub-tabelas.
- **Granularidade:** nível de detalhe de cada linha da fato (ex.: um processo por dia).

### ETL × ELT

- **ETL:** **E**xtrair das fontes → **T**ransformar (limpeza, padronização, integração) em área de *staging* → **C**arregar no DW.
- **ELT:** carrega primeiro e transforma dentro do repositório de destino.

### OLAP

| Operação | Efeito |
|---|---|
| **Drill-down** | aumenta o detalhe (ano → mês) |
| **Roll-up** | agrega (mês → ano) |
| **Slice** | fixa um valor de uma dimensão (só 2026) |
| **Dice** | seleciona um subcubo por várias dimensões |
| **Pivot** | rotaciona os eixos |

Arquiteturas: **MOLAP** (cubo multidimensional), **ROLAP** (sobre banco relacional), **HOLAP** (híbrida).

## Resumo

Flyway: \`V1__desc.sql\`, histórico com checksum, nunca editar migração aplicada. BI: fato × dimensão, estrela × floco de neve, ETL × ELT e as operações OLAP.`,
  },
  {
    slug: "normativos-cnj-ti",
    topic: "dev-norm-res-335",
    title: "Normativos do CNJ para TI: PDPJ-Br, PJe, MoReq-Jus e ENSEC-PJ",
    minutes: 30,
    summary: "Res. CNJ 335/2020: política de governança e gestão do processo judicial eletrônico; cria a PDPJ-Br; PJe segue como sistema prioritário; modelo colaborativo em microsserviços. Port. CNJ 252/2020: modelo de governança da PDPJ-Br. Port. CNJ 253/2020: diretrizes técnicas da PDPJ-Br. Port. CNJ 131/2021: Grupo Revisor de Código-Fonte da PDPJ-Br e do PJe. Res. CNJ 522/2023: MoReq-Jus. Res. CNJ 396/2021: ENSEC-PJ; Port. CNJ 162/2021: protocolos e manuais da ENSEC-PJ.",
    content: `## Por que esses normativos caem

Eles definem **como os sistemas judiciais devem ser construídos, integrados e protegidos** — o dia a dia do técnico de TI do TRF3. Leia os textos oficiais (links verificados na biblioteca); abaixo, o que cada um estabelece em linhas gerais.

## Resolução CNJ nº 335/2020 — PDPJ-Br

- Institui **política pública para a governança e a gestão de processo judicial eletrônico**.
- Cria a **Plataforma Digital do Poder Judiciário Brasileiro (PDPJ-Br)**, integrando os tribunais em um **modelo colaborativo**: soluções desenvolvidas por um tribunal podem ser compartilhadas com os demais, preferencialmente em **microsserviços** disponibilizados na plataforma.
- Mantém o **PJe** como sistema de processo eletrônico prioritário do CNJ.

## Portarias CNJ nº 252/2020 e nº 253/2020

- **252/2020:** dispõe sobre o **modelo de governança** da PDPJ-Br (instâncias e responsabilidades na gestão da plataforma).
- **253/2020:** estabelece **diretrizes técnicas** para a PDPJ-Br — padrões de arquitetura, integração e desenvolvimento das soluções que compõem a plataforma.

## Portaria CNJ nº 131/2021

Institui o **Grupo Revisor de Código-Fonte** das soluções da PDPJ-Br e do PJe, responsável pela revisão do código submetido à plataforma (qualidade, padrões e segurança).

## Resolução CNJ nº 522/2023 — MoReq-Jus

Estabelece o **Modelo de Requisitos para Sistemas Informatizados de Gestão de Processos e Documentos do Poder Judiciário (MoReq-Jus)**: requisitos de **gestão documental**, preservação, segurança, auditoria e interoperabilidade que os sistemas judiciais devem atender.

## Resolução CNJ nº 396/2021 e Portaria CNJ nº 162/2021 — ENSEC-PJ

- A **Resolução 396/2021** institui a **Estratégia Nacional de Segurança Cibernética do Poder Judiciário (ENSEC-PJ)**, com diretrizes de governança, gestão de riscos, prevenção e resposta a incidentes cibernéticos nos tribunais.
- A **Portaria 162/2021** **aprova protocolos e manuais** previstos na ENSEC-PJ (por exemplo, para prevenção de incidentes, gestão de crises cibernéticas e investigação de ilícitos cibernéticos).

## Relação com o trabalho técnico

| Situação | Normativo de referência |
|---|---|
| Desenvolver um microsserviço para a plataforma nacional | Res. 335/2020 e Port. 253/2020 |
| Submeter código para a PDPJ-Br | Port. 131/2021 |
| Projetar retenção e preservação de documentos | Res. 522/2023 |
| Responder a um ataque de ransomware | Res. 396/2021 e Port. 162/2021 |
| Tratar dados pessoais de partes | LGPD (Lei 13.709/2018) |

## Resumo

Associe número → tema: **335** PDPJ-Br/PJe · **252** governança · **253** diretrizes técnicas · **131** revisão de código · **522** MoReq-Jus · **396 + 162** ENSEC-PJ.`,
  },
  {
    slug: "perifericos-moveis-drivers-rds",
    topic: "sup-perifericos-itens",
    title: "Periféricos, dispositivos móveis (Intune), drivers, RDS e diagnóstico de falhas",
    minutes: 30,
    summary: "Impressoras laser (toner, cilindro, fusor) × jato de tinta (cartuchos, cabeçote); filas e spooler. Monitores (resolução, conexões HDMI/DisplayPort), scanners (TWAIN/WIA), headsets (padrão de áudio, permissões). Intune: MDM/MAM, inscrição, conformidade, distribuição de apps, apagamento remoto. Drivers: Gerenciador de Dispositivos, reverter driver, assinatura. RDS: área de trabalho e RemoteApp via RDP (3389). Diagnóstico: isolar, testar por substituição, ESD.",
    content: `## Impressoras

| | Laser | Jato de tinta |
|---|---|---|
| Insumo | **toner** (pó) | **cartuchos** de tinta |
| Componentes | cilindro fotossensível, laser, **fusor** (calor e pressão) | cabeçote de impressão |
| Falhas típicas | toner que borra → **fusor**; manchas repetitivas → cilindro | falhas de linhas → cabeçote entupido (limpeza) |

- **Filas de impressão** são gerenciadas pelo serviço **Spooler** (Windows); trabalhos travados → reiniciar o serviço e limpar a pasta *spool\\PRINTERS*.
- Impressoras de rede: porta TCP/IP padrão, servidor de impressão com drivers centralizados.

## Monitores, scanners e headsets

- **Monitores:** resolução nativa, taxa de atualização, conexões **HDMI, DisplayPort**, USB-C; tela preta → cabo, entrada selecionada, driver de vídeo.
- **Scanners:** drivers **TWAIN/WIA**; digitalização para PDF pesquisável (OCR).
- **Headsets:** dispositivo padrão de entrada/saída no Windows e no aplicativo de videoconferência, **permissões de microfone** (Windows e navegador).

## Dispositivos móveis e Microsoft Intune

- **iOS e Android** corporativos são gerenciados por **MDM** (gerenciamento do dispositivo) e/ou **MAM** (proteção de aplicativos e dados).
- **Microsoft Intune** (nuvem): inscrição de dispositivos, **políticas de conformidade** (senha, criptografia, versão do SO), perfis de configuração (Wi-Fi, VPN, e-mail), distribuição de apps, **apagamento remoto** (completo ou só dos dados corporativos).

## Drivers

- **Gerenciador de Dispositivos** (\`devmgmt.msc\`): ícone de alerta = driver ausente ou com erro; ações: **atualizar**, **reverter**, **desinstalar**.
- Prefira drivers do fabricante/Windows Update e **assinados digitalmente**.
- \`pnputil /enum-drivers\` lista drivers instalados.

## Remote Desktop Services (RDS)

- Função do Windows Server para publicar **áreas de trabalho** e aplicativos (**RemoteApp**) a usuários remotos.
- Protocolo **RDP**, porta **TCP 3389**; componentes: Host de Sessão, Agente de Conexão, Acesso via Web, Gateway (RDP sobre HTTPS) e licenciamento.

## Diagnóstico de falhas e substituição de componentes

1. **Coletar sintomas** (quando começou, mensagens, bipes/LEDs do POST).
2. **Isolar**: hardware × software; um componente por vez.
3. **Testar por substituição** com peça conhecida como boa.
4. **Segurança**: desligar, desconectar da tomada, **pulseira antiestática (ESD)**.
5. **Documentar** no chamado e atualizar o inventário de ativos.

| Sintoma | Suspeita comum |
|---|---|
| Liga sem vídeo e com bipes | memória RAM mal encaixada/defeituosa |
| Desliga sozinho sob carga | superaquecimento (pasta térmica, ventoinha) ou fonte |
| Lentidão com disco 100% | HD com setores defeituosos — verificar SMART/\`chkdsk\` |

## Resumo

Saiba as peças da impressora laser, o papel do Spooler, recursos do Intune, gerenciamento de drivers, componentes do RDS e o roteiro de diagnóstico com cuidado contra ESD.`,
  },
];
