import { q } from "./helpers";

/** Questões autorais de Conhecimentos Gerais (compartilhadas entre as especialidades 006 e 007). */
export const QUESTIONS_GERAIS = [
  // ───────── Língua Portuguesa ─────────
  q("LP-001", "lp-crase", 1, "Assinale a alternativa em que o sinal indicativo de crase está empregado de acordo com a norma-padrão.", [
    ["O técnico entregou o relatório à ela no fim do expediente.", "Não ocorre crase diante de pronome pessoal reto/oblíquo tônico como \"ela\"."],
    ["O servidor dirigiu-se à Secretaria de Gestão de Pessoas.", "Correta: \"dirigir-se a\" + artigo \"a\" de \"a Secretaria\" = à."],
    ["A equipe começou à trabalhar antes do horário previsto.", "Não há crase antes de verbo no infinitivo."],
    ["As partes ficaram frente à frente durante a audiência.", "Em expressões formadas por palavras repetidas (frente a frente, cara a cara) não há crase."],
    ["O parecer referiu-se à uma norma revogada.", "Não há crase antes de artigo indefinido \"uma\"."],
  ], 1, "A crase resulta da fusão da preposição \"a\" com o artigo feminino \"a\". Só ocorre quando o termo regente exige a preposição e o termo regido admite o artigo feminino.", "Bechara, E. Moderna Gramática Portuguesa; regra geral da crase (preposição + artigo)."),

  q("LP-002", "lp-concordancia", 2, "Considerando a concordância verbal na norma-padrão, assinale a alternativa correta.", [
    ["Fazem três anos que o sistema foi implantado no tribunal.", "\"Fazer\" indicando tempo decorrido é impessoal: \"Faz três anos\"."],
    ["Haviam vários chamados abertos na central de serviços.", "\"Haver\" no sentido de existir é impessoal: \"Havia vários chamados\"."],
    ["Existiam, no setor, servidores capacitados para a tarefa.", "Correta: \"existir\" é pessoal e concorda com o sujeito \"servidores capacitados\"."],
    ["Houveram muitas reclamações sobre a lentidão da rede.", "\"Haver\" = existir permanece no singular: \"Houve muitas reclamações\"."],
    ["Devem haver alternativas viáveis para a migração.", "O auxiliar de verbo impessoal também fica no singular: \"Deve haver\"."],
  ], 2, "Verbos impessoais (haver = existir; fazer = tempo decorrido) ficam na 3ª pessoa do singular, inclusive em locuções verbais. Já \"existir\" é pessoal e concorda com o sujeito.", "Cunha, C.; Cintra, L. Nova Gramática do Português Contemporâneo — concordância com verbos impessoais."),

  q("LP-003", "lp-regencia", 2, "Assinale a alternativa em que a regência verbal está de acordo com a norma-padrão.", [
    ["Os servidores assistiram ao treinamento sobre segurança da informação.", "Correta: \"assistir\" no sentido de ver/presenciar é transitivo indireto (assistir a)."],
    ["Prefiro mais o trabalho presencial do que o remoto.", "\"Preferir\" rege a preposição \"a\" e dispensa intensificadores: \"Prefiro o trabalho presencial ao remoto\"."],
    ["É preciso obedecer o regulamento interno.", "\"Obedecer\" é transitivo indireto: \"obedecer ao regulamento\"."],
    ["O candidato aspirava o cargo de técnico judiciário.", "\"Aspirar\" no sentido de desejar exige \"a\": \"aspirava ao cargo\"."],
    ["Ele esqueceu do prazo de entrega do recurso.", "\"Esquecer\" não pronominal é transitivo direto (esqueceu o prazo); pronominal exige \"de\" (esqueceu-se do prazo)."],
  ], 0, "Verbos como assistir (ver), obedecer, aspirar (desejar) e preferir exigem preposição específica; esquecer/lembrar mudam de regência conforme sejam ou não pronominais.", "Luft, C. P. Dicionário Prático de Regência Verbal."),

  q("LP-004", "lp-pontuacao", 1, "Assinale a alternativa pontuada corretamente.", [
    ["Os técnicos do tribunal, participaram do curso de redes.", "Não se separa o sujeito do verbo por vírgula."],
    ["Os técnicos, que trabalham no TRF3 participaram do curso.", "A oração adjetiva explicativa deve vir isolada por duas vírgulas."],
    ["Os técnicos, que trabalham no TRF3, participaram do curso.", "Correta: a oração adjetiva explicativa está isolada por vírgulas."],
    ["Os técnicos que trabalham, no TRF3, participaram do curso.", "A vírgula isola indevidamente o adjunto adverbial e quebra a oração adjetiva."],
    ["Os técnicos que, trabalham no TRF3 participaram do curso.", "Vírgula entre o pronome relativo e o verbo da oração é incorreta."],
  ], 2, "Orações adjetivas explicativas vêm entre vírgulas; nunca se separa sujeito de verbo por uma única vírgula.", "Bechara, E. Moderna Gramática Portuguesa — emprego da vírgula."),

  q("LP-005", "lp-vozes-verbo", 2, "Ao transpor a frase \"O técnico instalou o novo sistema\" para a voz passiva analítica, mantendo o tempo verbal, obtém-se:", [
    ["O novo sistema foi instalado pelo técnico.", "Correta: verbo ser no pretérito perfeito (foi) + particípio, com agente da passiva."],
    ["Instalou-se o novo sistema pelo técnico.", "Voz passiva sintética não é a analítica pedida e, em regra, não traz agente expresso."],
    ["O novo sistema tinha sido instalado pelo técnico.", "Altera o tempo para o pretérito mais-que-perfeito composto."],
    ["O novo sistema é instalado pelo técnico.", "Altera o tempo para o presente."],
    ["O técnico foi instalado pelo novo sistema.", "Inverte os papéis semânticos e altera o sentido."],
  ], 0, "Na passiva analítica, o objeto direto vira sujeito paciente e o verbo \"ser\" assume o tempo do verbo original (instalou → foi instalado).", "Cunha & Cintra — vozes do verbo."),

  q("LP-006", "lp-conectivos", 1, "\"O sistema apresentou falhas durante a migração; ______, a equipe conseguiu cumprir o prazo.\" A lacuna é corretamente preenchida, preservando a relação de sentido, por:", [
    ["portanto", "Expressa conclusão, incompatível com a ideia de contraste."],
    ["contudo", "Correta: conjunção adversativa que expressa oposição entre as ideias."],
    ["porque", "Expressa causa/explicação."],
    ["assim", "Expressa conclusão/consequência."],
    ["por conseguinte", "Expressa consequência."],
  ], 1, "A segunda oração apresenta um fato contrário ao que se esperaria da primeira — relação de oposição, expressa por adversativas como contudo, porém, entretanto, todavia.", "Koch, I. V. A coesão textual."),

  q("LP-007", "lp-coesao-coerencia", 1, "Em \"Os servidores receberam os novos computadores e os configuraram em uma semana\", o pronome \"os\" em \"os configuraram\" retoma:", [
    ["os servidores", "Os servidores são o sujeito de \"configuraram\", não o objeto."],
    ["os novos computadores", "Correta: o pronome oblíquo funciona como objeto direto e retoma \"os novos computadores\"."],
    ["uma semana", "\"Uma semana\" é adjunto adverbial de tempo e vem depois do pronome."],
    ["o setor de suporte", "Termo inexistente na frase."],
    ["os chamados técnicos", "Termo inexistente na frase."],
  ], 1, "Anáfora pronominal: o pronome oblíquo átono \"os\" retoma um termo anterior que exerce função de objeto direto do verbo configurar.", "Koch, I. V. A coesão textual — coesão referencial."),

  q("LP-008", "lp-figuras", 1, "Na frase \"Durante as férias, li Machado de Assis\", ocorre a figura de linguagem denominada:", [
    ["metáfora", "Metáfora é comparação implícita por semelhança, o que não ocorre."],
    ["metonímia", "Correta: emprega-se o autor pela obra (relação de contiguidade)."],
    ["hipérbole", "Hipérbole é exagero intencional."],
    ["eufemismo", "Eufemismo suaviza expressão desagradável."],
    ["ironia", "Ironia diz o contrário do que se pensa."],
  ], 1, "Metonímia é a substituição de um termo por outro com o qual mantém relação de contiguidade (autor pela obra, continente pelo conteúdo, marca pelo produto etc.).", "Cunha & Cintra — figuras de linguagem."),

  q("LP-009", "lp-discurso", 2, "Assinale a alternativa que transpõe corretamente para o discurso indireto a frase: O diretor afirmou: \"Eu revisarei o relatório amanhã.\"", [
    ["O diretor afirmou que revisaria o relatório no dia seguinte.", "Correta: futuro do presente → futuro do pretérito; \"amanhã\" → \"no dia seguinte\"; 1ª → 3ª pessoa."],
    ["O diretor afirmou que revisarei o relatório amanhã.", "Mantém a 1ª pessoa e o tempo do discurso direto."],
    ["O diretor afirmou que revisará o relatório amanhã.", "Não ajusta o tempo verbal nem o advérbio de tempo."],
    ["O diretor afirmou que eu revisaria o relatório no dia seguinte.", "Atribui a ação a outra pessoa (eu), alterando o sentido."],
    ["O diretor afirmou: revisaria o relatório no dia seguinte.", "Mistura a estrutura do discurso direto com a do indireto."],
  ], 0, "Na passagem ao discurso indireto: pessoa (1ª → 3ª), tempo (futuro do presente → futuro do pretérito) e advérbios (amanhã → no dia seguinte) se ajustam.", "Cunha & Cintra — discurso direto, indireto e indireto livre."),

  q("LP-010", "lp-redacao-oficial", 2, "De acordo com o Manual de Redação da Presidência da República (3ª edição, 2018), é correto afirmar:", [
    ["O fecho \"Respeitosamente\" é empregado em comunicações dirigidas a autoridades de hierarquia superior, inclusive ao Presidente da República.", "Correta: para autoridades superiores usa-se \"Respeitosamente\"; para mesma hierarquia ou inferior, \"Atenciosamente\"."],
    ["O tratamento \"Ilustríssimo Senhor\" continua obrigatório nas comunicações dirigidas a particulares.", "A 3ª edição aboliu \"Ilustríssimo\" e \"Digníssimo\"."],
    ["Os pronomes de tratamento como \"Vossa Senhoria\" exigem verbo na 2ª pessoa do plural.", "Pronomes de tratamento levam o verbo para a 3ª pessoa."],
    ["Memorando e aviso permanecem como expedientes autônomos, com diagramações distintas do ofício.", "A 3ª edição unificou os expedientes no \"padrão ofício\"."],
    ["O emprego de \"Digníssimo\" é obrigatório no vocativo dirigido a magistrados.", "\"Digníssimo\" foi abolido por ser desnecessário (a dignidade é pressuposto do cargo)."],
  ], 0, "A 3ª edição do Manual simplificou os expedientes (padrão ofício), aboliu tratamentos como Ilustríssimo e Digníssimo e manteve os fechos Respeitosamente/Atenciosamente conforme a hierarquia.", "Manual de Redação da Presidência da República, 3ª ed., 2018 — capítulos de pronomes de tratamento, fechos e padrão ofício."),

  q("LP-011", "lp-formacao-palavras", 2, "A palavra \"infelizmente\" é formada pelo processo de:", [
    ["derivação parassintética", "Na parassíntese, prefixo e sufixo entram simultaneamente; aqui existem \"infeliz\" e \"felizmente\" isoladamente."],
    ["derivação prefixal e sufixal", "Correta: há prefixo (in-) e sufixo (-mente), mas cada um pode ser retirado sem a palavra deixar de existir."],
    ["composição por justaposição", "Composição une radicais, não afixos."],
    ["composição por aglutinação", "Aglutinação une radicais com perda fonética."],
    ["derivação regressiva", "Derivação regressiva reduz a palavra (ex.: combater → combate)."],
  ], 1, "Distinção clássica: na parassintética a retirada de um dos afixos gera palavra inexistente (ex.: entristecer); na prefixal e sufixal não.", "Bechara — processos de formação de palavras."),

  q("LP-012", "lp-tipos-argumentos", 2, "\"Não devemos considerar a proposta do colega sobre o backup diário, afinal ele chegou atrasado à reunião.\" O argumento apresentado é falacioso porque:", [
    ["generaliza a partir de um único caso.", "Generalização apressada parte de poucos casos para uma regra geral; não é o caso."],
    ["ataca a pessoa em vez de discutir a proposta (ad hominem).", "Correta: o atraso do colega nada diz sobre o mérito da proposta."],
    ["apela à quantidade de pessoas que concordam (ad populum).", "Não há menção à opinião da maioria."],
    ["apresenta apenas duas opções extremas (falso dilema).", "Não há redução a duas alternativas."],
    ["usa a conclusão como premissa (petição de princípio).", "Não há circularidade."],
  ], 1, "A falácia ad hominem desqualifica o autor do argumento, e não o argumento em si.", "Copi, I. Introdução à Lógica — falácias de relevância."),

  // ───────── Raciocínio Lógico-Matemático ─────────
  q("RLM-001", "rlm-proporcao-porcentagem", 1, "O preço de um equipamento sofreu aumento de 20% e, em seguida, desconto de 20% sobre o novo valor. Em relação ao preço original, o preço final é:", [
    ["igual ao original.", "Os percentuais incidem sobre bases diferentes; não se anulam."],
    ["4% menor.", "Correta: 1,20 × 0,80 = 0,96, isto é, 4% menor."],
    ["4% maior.", "O resultado é inferior ao original."],
    ["2% menor.", "O cálculo correto é o produto dos fatores: 0,96."],
    ["40% menor.", "Valor sem relação com os fatores aplicados."],
  ], 1, "Aumentos e descontos sucessivos multiplicam-se: fator final = 1,20 × 0,80 = 0,96.", "Matemática básica — fatores de aumento e desconto."),

  q("RLM-002", "rlm-proporcao-porcentagem", 1, "Em uma central de atendimento, 3 técnicos resolvem 45 chamados por dia, trabalhando no mesmo ritmo. Mantido esse ritmo, 5 técnicos resolverão por dia:", [
    ["60 chamados", "Corresponde a 4 técnicos."],
    ["65 chamados", "Não é múltiplo da produtividade individual (15)."],
    ["70 chamados", "Não é múltiplo da produtividade individual (15)."],
    ["75 chamados", "Correta: cada técnico resolve 15 chamados; 5 × 15 = 75."],
    ["90 chamados", "Corresponde a 6 técnicos."],
  ], 3, "Grandezas diretamente proporcionais (regra de três simples): 3/45 = 5/x ⇒ x = 75.", "Regra de três simples."),

  q("RLM-003", "rlm-processo-logico", 2, "A negação lógica da proposição \"Todo servidor é pontual\" é:", [
    ["Nenhum servidor é pontual.", "Essa é a contrária, não a negação."],
    ["Todo servidor não é pontual.", "Equivale a \"nenhum servidor é pontual\"."],
    ["Algum servidor não é pontual.", "Correta: basta um contraexemplo para negar um universal afirmativo."],
    ["Algum servidor é pontual.", "É compatível com a proposição original."],
    ["Se alguém é pontual, então é servidor.", "Recíproca, não negação."],
  ], 2, "A negação de \"Todo A é B\" é \"Algum A não é B\" (existe ao menos um A que não é B).", "Lógica proposicional e categórica — negação de quantificadores."),

  q("RLM-004", "rlm-processo-logico", 2, "Considere a proposição: \"Se há queda de energia, então o servidor desliga\". Uma proposição logicamente equivalente a ela é:", [
    ["Se o servidor desliga, então há queda de energia.", "Recíproca — não é equivalente."],
    ["Se não há queda de energia, então o servidor não desliga.", "Inversa — não é equivalente."],
    ["Se o servidor não desliga, então não há queda de energia.", "Correta: contrapositiva (p → q ≡ ~q → ~p)."],
    ["Há queda de energia e o servidor não desliga.", "Essa é a negação da condicional."],
    ["Não há queda de energia ou o servidor não desliga.", "A equivalência correta seria \"não há queda de energia ou o servidor desliga\"."],
  ], 2, "p → q é equivalente a ~q → ~p (contrapositiva) e a ~p ∨ q. Recíproca e inversa não são equivalentes.", "Lógica proposicional — equivalências da condicional."),

  q("RLM-005", "rlm-logica-situacoes", 1, "Na sequência 2, 6, 12, 20, 30, ..., o próximo termo é:", [
    ["36", "Diferença de 6, mas as diferenças crescem de 2 em 2."],
    ["40", "Diferença de 10 já usada."],
    ["42", "Correta: as diferenças são 4, 6, 8, 10, logo a próxima é 12 (30 + 12 = 42)."],
    ["44", "Diferença de 14 pula um passo."],
    ["48", "Sem padrão compatível."],
  ], 2, "Termos da forma n(n+1): 1·2, 2·3, 3·4, 4·5, 5·6, 6·7 = 42.", "Raciocínio sequencial."),

  q("RLM-006", "rlm-relacoes-arbitrarias", 2, "Ana, Bruno e Carla trabalham, cada um, em um setor diferente: Protocolo, Suporte e Desenvolvimento. Sabe-se que Ana não trabalha no Suporte e que Bruno trabalha no Desenvolvimento. Logo, é necessariamente verdadeiro que:", [
    ["Ana trabalha no Desenvolvimento.", "O Desenvolvimento é de Bruno."],
    ["Carla trabalha no Protocolo.", "Se Ana não é do Suporte e o Desenvolvimento é de Bruno, Ana é do Protocolo."],
    ["Carla trabalha no Suporte.", "Correta: Bruno = Desenvolvimento; Ana ≠ Suporte ⇒ Ana = Protocolo; resta Suporte para Carla."],
    ["Bruno trabalha no Protocolo.", "Contradiz a informação dada."],
    ["Ana trabalha no Suporte.", "Contradiz a informação dada."],
  ], 2, "Monte a tabela de possibilidades e elimine: Bruno fixo no Desenvolvimento; Ana sem Suporte → Protocolo; Carla → Suporte.", "Estruturas lógicas de relações arbitrárias."),

  q("RLM-007", "rlm-proporcao-porcentagem", 1, "Um monitor custa R$ 850,00 e será comprado com desconto de 12%. O valor a pagar é:", [
    ["R$ 738,00", "Corresponde a desconto de cerca de 13,2%."],
    ["R$ 748,00", "Correta: 850 × 0,88 = 748."],
    ["R$ 752,00", "Corresponde a desconto de cerca de 11,5%."],
    ["R$ 838,00", "Subtraiu 12 reais, não 12%."],
    ["R$ 102,00", "Esse é o valor do desconto, não do preço final."],
  ], 1, "Preço com desconto de i% = preço × (1 − i/100) = 850 × 0,88 = 748.", "Porcentagem — descontos."),

  q("RLM-008", "rlm-processo-logico", 3, "Considere as premissas: \"Todo técnico é concursado\" e \"Nenhum concursado é estagiário\". Pode-se concluir validamente que:", [
    ["Algum estagiário é técnico.", "Contradiz as premissas."],
    ["Nenhum técnico é estagiário.", "Correta: o conjunto dos técnicos está contido no dos concursados, que é disjunto do dos estagiários."],
    ["Todo concursado é técnico.", "Recíproca da primeira premissa, não decorre dela."],
    ["Algum concursado é estagiário.", "Contradiz a segunda premissa."],
    ["Todo estagiário é técnico.", "Contradiz as premissas."],
  ], 1, "Por diagramas de Venn: T ⊂ C e C ∩ E = ∅ ⇒ T ∩ E = ∅.", "Silogismo categórico."),

  q("RLM-009", "rlm-proporcao-porcentagem", 2, "Em um setor com 40 servidores, a razão entre o número de homens e o de mulheres é 3 para 5. O número de mulheres é:", [
    ["15", "Esse é o número de homens."],
    ["20", "Corresponde a razão 1:1."],
    ["24", "Corresponde a 3/5 de 40."],
    ["25", "Correta: 40 ÷ (3 + 5) = 5; mulheres = 5 × 5 = 25."],
    ["30", "Sem relação com a razão dada."],
  ], 3, "Divisão em partes proporcionais: total ÷ soma das partes × parte correspondente.", "Razão e proporção."),

  // ───────── Ética no Serviço Público e Integridade ─────────
  q("ETI-001", "etica-lei-8112", 1, "De acordo com o art. 127 da Lei nº 8.112/1990, NÃO constitui penalidade disciplinar:", [
    ["advertência.", "Prevista no art. 127, I."],
    ["suspensão.", "Prevista no art. 127, II."],
    ["exoneração.", "Correta: a exoneração é forma de vacância (art. 34), não penalidade."],
    ["cassação de aposentadoria ou disponibilidade.", "Prevista no art. 127, IV."],
    ["destituição de cargo em comissão.", "Prevista no art. 127, V."],
  ], 2, "Penalidades (art. 127): advertência, suspensão, demissão, cassação de aposentadoria ou disponibilidade, destituição de cargo em comissão e destituição de função comissionada.", "Lei nº 8.112/1990, arts. 34 e 127."),

  q("ETI-002", "etica-lei-8112", 2, "Segundo a Lei nº 8.112/1990, a penalidade de suspensão não poderá exceder:", [
    ["30 dias.", "Prazo inferior ao limite legal."],
    ["60 dias.", "Prazo inferior ao limite legal."],
    ["90 dias.", "Correta: art. 130 — a suspensão não pode exceder 90 dias."],
    ["120 dias.", "Prazo superior ao limite legal."],
    ["180 dias.", "180 dias é o prazo prescricional da advertência (art. 142, III)."],
  ], 2, "Art. 130: suspensão aplicada em caso de reincidência das faltas punidas com advertência e violação das demais proibições, não podendo exceder 90 dias.", "Lei nº 8.112/1990, art. 130."),

  q("ETI-003", "etica-lei-8112", 2, "Nos termos da Lei nº 8.112/1990, a ação disciplinar prescreverá, quanto à advertência, em:", [
    ["90 dias.", "Não corresponde a nenhum prazo do art. 142."],
    ["180 dias.", "Correta: art. 142, III."],
    ["1 ano.", "Não corresponde a nenhum prazo do art. 142."],
    ["2 anos.", "Prazo da suspensão (art. 142, II)."],
    ["5 anos.", "Prazo das infrações puníveis com demissão, cassação e destituição (art. 142, I)."],
  ], 1, "Art. 142: 5 anos (demissão, cassação, destituição), 2 anos (suspensão) e 180 dias (advertência), contados da data em que o fato se tornou conhecido.", "Lei nº 8.112/1990, art. 142."),

  q("ETI-004", "etica-lei-8112", 1, "Assinale a alternativa que apresenta uma PROIBIÇÃO ao servidor, conforme o art. 117 da Lei nº 8.112/1990.", [
    ["Ser leal às instituições a que servir.", "É dever (art. 116, II)."],
    ["Guardar sigilo sobre assunto da repartição.", "É dever (art. 116, VIII)."],
    ["Recusar fé a documentos públicos.", "Correta: proibição prevista no art. 117, III."],
    ["Zelar pela economia do material e pela conservação do patrimônio público.", "É dever (art. 116, VII)."],
    ["Representar contra ilegalidade, omissão ou abuso de poder.", "É dever (art. 116, XII)."],
  ], 2, "O art. 116 lista deveres; o art. 117 lista proibições. Recusar fé a documentos públicos é proibição.", "Lei nº 8.112/1990, arts. 116 e 117."),

  q("ETI-005", "etica-improbidade", 2, "Com as alterações promovidas pela Lei nº 14.230/2021 na Lei nº 8.429/1992, é correto afirmar que:", [
    ["os atos de improbidade que causam lesão ao erário admitem a modalidade culposa.", "A modalidade culposa foi suprimida pela Lei nº 14.230/2021."],
    ["a configuração de ato de improbidade exige conduta dolosa.", "Correta: art. 1º, §§ 1º a 3º — consideram-se atos de improbidade somente condutas dolosas."],
    ["o mero exercício da função, sem dolo, basta para a responsabilização.", "O art. 1º, § 3º afasta a responsabilização pelo mero exercício da função sem dolo."],
    ["a divergência interpretativa da lei configura, por si só, improbidade.", "O art. 1º, § 8º afasta a improbidade por divergência interpretativa baseada em jurisprudência."],
    ["a lei passou a aplicar-se apenas a agentes políticos.", "A lei continua aplicável a agentes públicos em geral e a particulares que concorram para o ato."],
  ], 1, "Após 2021, a improbidade exige dolo — vontade livre e consciente de alcançar o resultado ilícito tipificado nos arts. 9º, 10 e 11.", "Lei nº 8.429/1992, art. 1º, com redação da Lei nº 14.230/2021."),

  q("ETI-006", "etica-anticorrupcao", 2, "A Lei nº 12.846/2013 (Lei Anticorrupção) dispõe que as pessoas jurídicas serão responsabilizadas pelos atos lesivos nela previstos praticados em seu interesse ou benefício de forma:", [
    ["subjetiva, exigindo prova de dolo dos dirigentes.", "A lei adota responsabilização objetiva da pessoa jurídica."],
    ["objetiva, nos âmbitos administrativo e civil.", "Correta: arts. 1º e 2º da Lei nº 12.846/2013."],
    ["exclusivamente penal.", "A lei trata de responsabilização administrativa e civil."],
    ["subsidiária, apenas se os dirigentes não puderem ser punidos.", "A responsabilidade da pessoa jurídica independe da responsabilização individual (art. 3º)."],
    ["solidária apenas com os agentes públicos envolvidos.", "Não corresponde à disciplina legal."],
  ], 1, "A Lei Anticorrupção prevê responsabilização objetiva, administrativa e civil, de pessoas jurídicas por atos contra a administração pública, nacional ou estrangeira.", "Lei nº 12.846/2013, arts. 1º a 3º."),

  q("ETI-007", "etica-lei-9784", 1, "Salvo disposição legal específica, o prazo para interposição de recurso administrativo previsto na Lei nº 9.784/1999 é de:", [
    ["5 dias.", "Prazo inferior ao legal."],
    ["10 dias.", "Correta: art. 59 — 10 dias, contados da ciência ou divulgação oficial da decisão."],
    ["15 dias.", "Não corresponde ao art. 59."],
    ["30 dias.", "30 dias é o prazo para decidir o recurso (art. 59, § 1º)."],
    ["60 dias.", "Não corresponde ao art. 59."],
  ], 1, "Art. 59: 10 dias para recorrer; § 1º: o recurso deve ser decidido em até 30 dias, prorrogáveis por igual período mediante justificativa.", "Lei nº 9.784/1999, art. 59."),

  q("ETI-008", "etica-lai", 2, "Nos termos da Lei nº 12.527/2011 (LAI), o prazo máximo de restrição de acesso à informação classificada como RESERVADA é de:", [
    ["5 anos.", "Correta: art. 24, § 1º, III."],
    ["10 anos.", "Não corresponde a nenhum grau da LAI."],
    ["15 anos.", "Prazo da informação secreta."],
    ["25 anos.", "Prazo da informação ultrassecreta."],
    ["50 anos.", "Não corresponde a nenhum grau da LAI."],
  ], 0, "Art. 24, § 1º: ultrassecreta — 25 anos; secreta — 15 anos; reservada — 5 anos.", "Lei nº 12.527/2011, art. 24."),

  q("ETI-009", "etica-lgpd", 1, "Segundo a Lei nº 13.709/2018 (LGPD), NÃO é considerado dado pessoal sensível:", [
    ["dado referente à saúde.", "É sensível (art. 5º, II)."],
    ["convicção religiosa.", "É sensível (art. 5º, II)."],
    ["dado biométrico.", "É sensível (art. 5º, II)."],
    ["endereço residencial.", "Correta: é dado pessoal comum, não está no rol do art. 5º, II."],
    ["filiação a sindicato.", "É sensível (art. 5º, II)."],
  ], 3, "Dados sensíveis: origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou organização religiosa, filosófica ou política, saúde, vida sexual, dado genético ou biométrico.", "Lei nº 13.709/2018, art. 5º, II."),

  q("ETI-010", "etica-lgpd", 2, "Conforme a LGPD, a pessoa natural ou jurídica que realiza o tratamento de dados pessoais EM NOME do controlador é denominada:", [
    ["titular.", "Titular é a pessoa natural a quem os dados se referem."],
    ["encarregado.", "Encarregado é o canal de comunicação entre controlador, titulares e ANPD."],
    ["operador.", "Correta: art. 5º, VII."],
    ["agente regulador.", "Termo não definido na LGPD."],
    ["controlador conjunto.", "Controladores tomam as decisões sobre o tratamento; não agem em nome de outro."],
  ], 2, "Agentes de tratamento: controlador (decide) e operador (executa em nome do controlador). O encarregado atua como canal de comunicação.", "Lei nº 13.709/2018, art. 5º, VI a IX."),

  // ───────── Direitos Humanos e Acessibilidade ─────────
  q("DH-001", "dh-dudh", 1, "A Declaração Universal dos Direitos Humanos foi adotada e proclamada:", [
    ["pelo Conselho de Segurança da ONU, em 1945.", "Em 1945 foi assinada a Carta da ONU; a DUDH é de 1948 e da Assembleia Geral."],
    ["pela Assembleia Geral das Nações Unidas, em 10 de dezembro de 1948.", "Correta: Resolução 217 A (III) da Assembleia Geral."],
    ["pela Organização dos Estados Americanos, em 1969.", "Em 1969 foi adotada a Convenção Americana (Pacto de São José)."],
    ["pelo Tribunal Penal Internacional, em 1998.", "O Estatuto de Roma é de 1998; o TPI não proclama declarações de direitos."],
    ["pela Liga das Nações, em 1919.", "A Liga das Nações antecede a ONU e não adotou a DUDH."],
  ], 1, "A DUDH foi adotada pela Assembleia Geral da ONU em 10/12/1948, data em que se celebra o Dia dos Direitos Humanos.", "Declaração Universal dos Direitos Humanos (ONU, 1948)."),

  q("DH-002", "dh-agenda-2030", 1, "A Agenda 2030 para o Desenvolvimento Sustentável, adotada pela ONU, é composta por:", [
    ["8 objetivos e 21 metas.", "Os 8 Objetivos de Desenvolvimento do Milênio (ODM) antecederam a Agenda 2030."],
    ["10 objetivos e 100 metas.", "Não corresponde à Agenda 2030."],
    ["17 objetivos e 169 metas.", "Correta: 17 ODS desdobrados em 169 metas."],
    ["20 objetivos e 200 metas.", "Não corresponde à Agenda 2030."],
    ["5 objetivos e 50 metas.", "Os \"5 Ps\" (pessoas, planeta, prosperidade, paz e parcerias) são eixos, não objetivos."],
  ], 2, "A Agenda 2030 (2015) contém 17 Objetivos de Desenvolvimento Sustentável e 169 metas.", "ONU — Transformando Nosso Mundo: a Agenda 2030 para o Desenvolvimento Sustentável (2015)."),

  q("DH-003", "dh-convencao", 2, "A Convenção Internacional sobre os Direitos das Pessoas com Deficiência, promulgada pelo Decreto nº 6.949/2009, possui no ordenamento brasileiro status de:", [
    ["lei ordinária.", "Tratados comuns têm status de lei ordinária; não é o caso."],
    ["norma supralegal, abaixo da Constituição.", "É o status de tratados de direitos humanos aprovados sem o rito do § 3º."],
    ["emenda constitucional.", "Correta: foi aprovada pelo rito do art. 5º, § 3º, da CF (dois turnos, três quintos)."],
    ["decreto regulamentar.", "O decreto apenas promulga o tratado."],
    ["norma programática sem força vinculante.", "Tem força normativa equivalente à de emenda constitucional."],
  ], 2, "Foi o primeiro tratado internacional aprovado pelo rito do art. 5º, § 3º, da CF, ingressando com equivalência de emenda constitucional.", "CF/1988, art. 5º, § 3º; Decreto Legislativo nº 186/2008; Decreto nº 6.949/2009."),

  q("DH-004", "dh-lbi", 2, "Segundo a Lei nº 13.146/2015 (Estatuto da Pessoa com Deficiência), considera-se pessoa com deficiência aquela que tem impedimento de:", [
    ["curto prazo, exclusivamente de natureza física.", "A lei exige impedimento de longo prazo e abrange várias naturezas."],
    ["longo prazo de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas.", "Correta: conceito do art. 2º, caput."],
    ["qualquer duração, desde que atestado por laudo médico particular.", "O conceito é biopsicossocial e a avaliação, quando necessária, é biopsicossocial (art. 2º, § 1º)."],
    ["natureza exclusivamente intelectual, reconhecido judicialmente.", "Não exige reconhecimento judicial e não se limita à natureza intelectual."],
    ["longo prazo, apenas quando gerar incapacidade civil absoluta.", "A LBI afirma que a deficiência não afeta a plena capacidade civil (art. 6º)."],
  ], 1, "O Estatuto adota o modelo social/biopsicossocial: a deficiência resulta da interação entre impedimentos e barreiras.", "Lei nº 13.146/2015, arts. 2º e 6º."),

  q("DH-005", "dh-prioridade", 1, "Conforme a Lei nº 10.048/2000, NÃO está entre os beneficiários de atendimento prioritário:", [
    ["pessoas com deficiência.", "Previstas no art. 1º."],
    ["idosos com idade igual ou superior a 60 anos.", "Previstos no art. 1º."],
    ["gestantes e lactantes.", "Previstas no art. 1º."],
    ["pessoas com crianças de colo.", "Previstas no art. 1º."],
    ["estudantes universitários.", "Correta: não há previsão legal de prioridade para essa categoria."],
  ], 4, "A Lei nº 10.048/2000 garante atendimento prioritário a pessoas com deficiência, idosos (60+), gestantes, lactantes, pessoas com crianças de colo e obesos, entre outros grupos incluídos por leis posteriores.", "Lei nº 10.048/2000, art. 1º."),

  q("DH-006", "dh-lbi", 1, "A Lei nº 11.126/2005 assegura à pessoa com deficiência visual acompanhada de cão-guia o direito de:", [
    ["ingressar e permanecer com o animal em todos os meios de transporte e em estabelecimentos abertos ao público, de uso público e privados de uso coletivo.", "Correta: art. 1º da Lei nº 11.126/2005."],
    ["ingressar com o animal apenas em repartições públicas.", "O direito abrange também estabelecimentos privados de uso coletivo e transportes."],
    ["ingressar com o animal mediante pagamento de taxa adicional.", "A cobrança de valores adicionais não é admitida."],
    ["ingressar somente se houver autorização prévia do estabelecimento.", "O direito é assegurado por lei, independentemente de autorização."],
    ["ingressar com o animal apenas em transporte aéreo.", "O direito abrange todos os meios de transporte."],
  ], 0, "A lei garante ingresso e permanência com cão-guia em transportes e locais de uso coletivo, vedada qualquer discriminação.", "Lei nº 11.126/2005, art. 1º."),

  // ───────── Sustentabilidade e Meio Ambiente ─────────
  q("SUS-001", "sust-cf88", 1, "Segundo o art. 225 da Constituição Federal, o dever de defender e preservar o meio ambiente ecologicamente equilibrado para as presentes e futuras gerações é imposto:", [
    ["exclusivamente à União.", "O dever é do Poder Público (todos os entes) e da coletividade."],
    ["ao Poder Público e à coletividade.", "Correta: art. 225, caput."],
    ["apenas aos órgãos ambientais.", "O dever é amplo: Poder Público e coletividade."],
    ["às empresas poluidoras, somente.", "A responsabilidade não se restringe a poluidores."],
    ["aos Estados e Municípios, com exclusão da União.", "Todos os entes integram o Poder Público."],
  ], 1, "Art. 225: todos têm direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo, impondo-se ao Poder Público e à coletividade o dever de defendê-lo e preservá-lo.", "CF/1988, art. 225, caput."),

  q("SUS-002", "sust-contratacoes", 2, "Entre os princípios expressamente previstos no art. 5º da Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos), encontra-se o do:", [
    ["menor preço absoluto.", "Menor preço é critério de julgamento, não princípio do art. 5º."],
    ["desenvolvimento nacional sustentável.", "Correta: princípio expresso no art. 5º."],
    ["sigilo das propostas após a homologação.", "A publicidade é a regra; não há tal princípio."],
    ["preferência por fornecedores locais.", "Não é princípio do art. 5º."],
    ["pessoalidade na escolha do contratado.", "Contraria o princípio da impessoalidade."],
  ], 1, "O art. 5º inclui, entre outros, legalidade, impessoalidade, moralidade, publicidade, eficiência, planejamento, transparência, competitividade e desenvolvimento nacional sustentável.", "Lei nº 14.133/2021, art. 5º."),

  q("SUS-003", "sust-pnmc", 2, "A Lei nº 12.187/2009, que institui a Política Nacional sobre Mudança do Clima, estabeleceu como compromisso nacional voluntário a redução das emissões projetadas até 2020 entre:", [
    ["10% e 15%.", "Não corresponde ao art. 12."],
    ["20% e 25%.", "Não corresponde ao art. 12."],
    ["36,1% e 38,9%.", "Correta: art. 12 da Lei nº 12.187/2009."],
    ["50% e 60%.", "Não corresponde ao art. 12."],
    ["80% e 90%.", "Não corresponde ao art. 12."],
  ], 2, "Art. 12: o País adotou, como compromisso nacional voluntário, ações de mitigação para reduzir entre 36,1% e 38,9% suas emissões projetadas até 2020.", "Lei nº 12.187/2009, art. 12."),

  q("SUS-004", "sust-ods", 1, "O Objetivo de Desenvolvimento Sustentável (ODS) que trata de \"Paz, Justiça e Instituições Eficazes\", especialmente relacionado à atuação do Poder Judiciário, é o:", [
    ["ODS 4.", "ODS 4 trata de educação de qualidade."],
    ["ODS 10.", "ODS 10 trata da redução das desigualdades."],
    ["ODS 13.", "ODS 13 trata da ação contra a mudança global do clima."],
    ["ODS 16.", "Correta: ODS 16 — Paz, Justiça e Instituições Eficazes."],
    ["ODS 17.", "ODS 17 trata de parcerias e meios de implementação."],
  ], 3, "O ODS 16 busca promover sociedades pacíficas e inclusivas, acesso à justiça para todos e instituições eficazes, responsáveis e inclusivas.", "ONU — Agenda 2030, ODS 16."),

  q("SUS-005", "sust-ods", 1, "O ODS 13 da Agenda 2030 refere-se a:", [
    ["Água potável e saneamento.", "É o ODS 6."],
    ["Ação contra a mudança global do clima.", "Correta: ODS 13."],
    ["Vida na água.", "É o ODS 14."],
    ["Energia limpa e acessível.", "É o ODS 7."],
    ["Trabalho decente e crescimento econômico.", "É o ODS 8."],
  ], 1, "ODS 13: tomar medidas urgentes para combater a mudança do clima e seus impactos.", "ONU — Agenda 2030, ODS 13."),
];
