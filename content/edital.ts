/**
 * Estrutura programática oficial — Concurso TRF3 2026 (Fundação Vunesp)
 * Fonte: Edital nº 01/2026 (DOU, Seção 3, 26/10/2026), Anexo VI — Conteúdo Programático, p. 51–55,
 * com as retificações do Edital nº 02/2026 (DOU, Seção 3, 04/11/2026), que não alteraram o Anexo VI.
 *
 * Hierarquia: Disciplina (bloco do edital) → Módulo (agrupamento do bloco) → Assunto (item do edital)
 * → Subassunto (enumeração literal contida no próprio item do edital).
 * Os textos de "title" são fiéis ao edital; "excerpt" guarda o trecho literal do qual o assunto foi extraído.
 */

export type TopicSeed = { slug: string; title: string; excerpt?: string; subtopics?: string[] };
export type ModuleSeed = { slug: string; name: string; topics: TopicSeed[] };
export type DisciplineSeed = {
  slug: string;
  name: string;
  kind: "GERAL" | "ESPECIFICA";
  specialty: null | "DEV" | "SUP";
  color: string;
  editalRef: string;
  editalText: string;
  modules: ModuleSeed[];
};

const REF_GERAIS = "Edital nº 01/2026, Anexo VI, p. 51–52 (Conhecimentos Gerais — cargos de TI)";
const REF_DEV = "Edital nº 01/2026, Anexo VI, p. 54–55 (Técnico Judiciário — Desenvolvimento de Sistemas de Informação)";
const REF_SUP = "Edital nº 01/2026, Anexo VI, p. 55 (Técnico Judiciário — Suporte Técnico)";

export const EDITAL_DISCIPLINES: DisciplineSeed[] = [
  // ═══════════════════════════ CONHECIMENTOS GERAIS (compartilhados) ═══════════════════════════
  {
    slug: "lingua-portuguesa",
    name: "Língua Portuguesa e Raciocínio Analítico",
    kind: "GERAL",
    specialty: null,
    color: "#e0605a",
    editalRef: REF_GERAIS,
    editalText:
      "Redação Oficial. Ortografia e acentuação. Emprego do sinal indicativo de crase. Compreensão e interpretação de textos de gêneros variados. Relação do texto com seu contexto histórico. Denotação e conotação. Discurso direto, discurso indireto e discurso indireto livre. Intertextualidade. Figuras de linguagem. Morfossintaxe. Elementos estruturais e processos de formação de palavras. Sinonímia e antonímia. Pontuação. Pronomes. Concordância nominal e concordância verbal. Flexão nominal e flexão verbal. Vozes do verbo. Correlação de tempos e modos verbais. Regência nominal e regência verbal. Coordenação e subordinação. Conectivos. Coesão e coerência. Redação (confronto e reconhecimento de frases corretas e incorretas; organização e reorganização de orações e períodos; equivalência e transformação de estruturas). Raciocínio analítico e argumentação. Uso do senso crítico na argumentação. Tipos de argumentos: falaciosos e apelativos. Comunicação eficiente de argumentos.",
    modules: [
      {
        slug: "lp-norma-escrita",
        name: "Ortografia, acentuação, crase e pontuação",
        topics: [
          { slug: "lp-ortografia-acentuacao", title: "Ortografia e acentuação" },
          { slug: "lp-crase", title: "Emprego do sinal indicativo de crase" },
          { slug: "lp-pontuacao", title: "Pontuação" },
        ],
      },
      {
        slug: "lp-leitura",
        name: "Leitura, interpretação e semântica",
        topics: [
          { slug: "lp-interpretacao", title: "Compreensão e interpretação de textos de gêneros variados" },
          { slug: "lp-contexto-historico", title: "Relação do texto com seu contexto histórico" },
          { slug: "lp-denotacao-conotacao", title: "Denotação e conotação" },
          { slug: "lp-discurso", title: "Discurso direto, discurso indireto e discurso indireto livre", subtopics: ["Discurso direto", "Discurso indireto", "Discurso indireto livre"] },
          { slug: "lp-intertextualidade", title: "Intertextualidade" },
          { slug: "lp-figuras", title: "Figuras de linguagem" },
          { slug: "lp-sinonimia", title: "Sinonímia e antonímia" },
        ],
      },
      {
        slug: "lp-morfologia",
        name: "Morfologia e morfossintaxe",
        topics: [
          { slug: "lp-morfossintaxe", title: "Morfossintaxe" },
          { slug: "lp-formacao-palavras", title: "Elementos estruturais e processos de formação de palavras", subtopics: ["Elementos estruturais das palavras", "Processos de formação de palavras"] },
          { slug: "lp-pronomes", title: "Pronomes" },
          { slug: "lp-flexao", title: "Flexão nominal e flexão verbal", subtopics: ["Flexão nominal", "Flexão verbal"] },
          { slug: "lp-vozes-verbo", title: "Vozes do verbo" },
          { slug: "lp-tempos-modos", title: "Correlação de tempos e modos verbais" },
        ],
      },
      {
        slug: "lp-sintaxe",
        name: "Sintaxe, coesão e coerência",
        topics: [
          { slug: "lp-concordancia", title: "Concordância nominal e concordância verbal", subtopics: ["Concordância nominal", "Concordância verbal"] },
          { slug: "lp-regencia", title: "Regência nominal e regência verbal", subtopics: ["Regência nominal", "Regência verbal"] },
          { slug: "lp-coordenacao-subordinacao", title: "Coordenação e subordinação", subtopics: ["Coordenação", "Subordinação"] },
          { slug: "lp-conectivos", title: "Conectivos" },
          { slug: "lp-coesao-coerencia", title: "Coesão e coerência", subtopics: ["Coesão", "Coerência"] },
        ],
      },
      {
        slug: "lp-redacao",
        name: "Redação oficial e reescrita",
        topics: [
          { slug: "lp-redacao-oficial", title: "Redação Oficial" },
          {
            slug: "lp-reescrita",
            title: "Redação (confronto e reconhecimento de frases corretas e incorretas; organização e reorganização de orações e períodos; equivalência e transformação de estruturas)",
            subtopics: [
              "Confronto e reconhecimento de frases corretas e incorretas",
              "Organização e reorganização de orações e períodos",
              "Equivalência e transformação de estruturas",
            ],
          },
        ],
      },
      {
        slug: "lp-argumentacao",
        name: "Raciocínio analítico e argumentação",
        topics: [
          { slug: "lp-raciocinio-analitico", title: "Raciocínio analítico e argumentação" },
          { slug: "lp-senso-critico", title: "Uso do senso crítico na argumentação" },
          { slug: "lp-tipos-argumentos", title: "Tipos de argumentos: falaciosos e apelativos", subtopics: ["Argumentos falaciosos", "Argumentos apelativos"] },
          { slug: "lp-comunicacao-argumentos", title: "Comunicação eficiente de argumentos" },
        ],
      },
    ],
  },
  {
    slug: "raciocinio-logico",
    name: "Raciocínio Lógico-Matemático",
    kind: "GERAL",
    specialty: null,
    color: "#f59e0b",
    editalRef: REF_GERAIS,
    editalText:
      "Estrutura lógica de relações arbitrárias entre pessoas, lugares, objetos ou eventos fictícios; deduzir novas informações das relações fornecidas e avaliar as condições usadas para estabelecer a estrutura daquelas relações. Compreensão e elaboração da lógica das situações por meio de: raciocínio verbal, raciocínio matemático, raciocínio sequencial, orientação espacial e temporal, formação de conceitos, discriminação de elementos. Compreensão do processo lógico que, a partir de um conjunto de hipóteses, conduz, de forma válida, a conclusões determinadas. Noções básicas de proporcionalidade e porcentagem: problemas envolvendo regra de três simples, cálculos de porcentagem, acréscimos e descontos.",
    modules: [
      {
        slug: "rlm-estruturas",
        name: "Estruturas lógicas e relações",
        topics: [
          {
            slug: "rlm-relacoes-arbitrarias",
            title: "Estrutura lógica de relações arbitrárias entre pessoas, lugares, objetos ou eventos fictícios",
            excerpt: "Estrutura lógica de relações arbitrárias entre pessoas, lugares, objetos ou eventos fictícios; deduzir novas informações das relações fornecidas e avaliar as condições usadas para estabelecer a estrutura daquelas relações.",
            subtopics: ["Deduzir novas informações das relações fornecidas", "Avaliar as condições usadas para estabelecer a estrutura daquelas relações"],
          },
        ],
      },
      {
        slug: "rlm-situacoes",
        name: "Lógica das situações",
        topics: [
          {
            slug: "rlm-logica-situacoes",
            title: "Compreensão e elaboração da lógica das situações",
            excerpt: "Compreensão e elaboração da lógica das situações por meio de: raciocínio verbal, raciocínio matemático, raciocínio sequencial, orientação espacial e temporal, formação de conceitos, discriminação de elementos.",
            subtopics: ["Raciocínio verbal", "Raciocínio matemático", "Raciocínio sequencial", "Orientação espacial e temporal", "Formação de conceitos", "Discriminação de elementos"],
          },
        ],
      },
      {
        slug: "rlm-deducao",
        name: "Lógica dedutiva",
        topics: [
          {
            slug: "rlm-processo-logico",
            title: "Compreensão do processo lógico que, a partir de um conjunto de hipóteses, conduz, de forma válida, a conclusões determinadas",
          },
        ],
      },
      {
        slug: "rlm-proporcionalidade",
        name: "Proporcionalidade e porcentagem",
        topics: [
          {
            slug: "rlm-proporcao-porcentagem",
            title: "Noções básicas de proporcionalidade e porcentagem",
            excerpt: "Noções básicas de proporcionalidade e porcentagem: problemas envolvendo regra de três simples, cálculos de porcentagem, acréscimos e descontos.",
            subtopics: ["Regra de três simples", "Cálculos de porcentagem", "Acréscimos e descontos"],
          },
        ],
      },
    ],
  },
  {
    slug: "etica-integridade",
    name: "Ética no Serviço Público e Integridade",
    kind: "GERAL",
    specialty: null,
    color: "#10b981",
    editalRef: REF_GERAIS,
    editalText:
      "Fundamentos: Ética e integridade: conceito, princípios, valores. Ética, moral, democracia e exercício da cidadania. Ética no contexto público. Regime Disciplinar Federal: Lei nº 8.112/1990 e suas alterações (deveres, proibições, acumulação, responsabilidades, penalidades). Combate à Corrupção e Improbidade: Lei nº 8.429/1992 (atos de improbidade administrativa), com as alterações da Lei nº 14.230/2021. Lei nº 12.846/2013 (Lei Anticorrupção). Processo Administrativo: Lei nº 9.784/1999 (conceitos, princípios, direitos e deveres dos administrados). Normas Deontológicas e Integridade na Justiça Federal da 3ª Região: Código de Conduta da Justiça Federal (Resolução CJF nº 147/2011), atuação e composição do Comitê Gestor do Código de Conduta da JF3R (Portaria CNJ nº 116/2012 e Portaria PRES nº 4.657/2026). Diretrizes dos Sistemas de Integridade do Poder Judiciário (Resolução CNJ nº 410/2021) e Governança Colaborativa no âmbito da JF3R (Resolução PRES nº 426/2021). Ambiente de Trabalho: Política de Prevenção e Enfrentamento do Assédio e da Discriminação (Resolução CNJ nº 351/2020) e as Comissões locais de Prevenção e Enfrentamento do Assédio no TRF3 e Seções Judiciárias vinculadas. Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 e alterações). Lei de Acesso à Informação (Lei nº 12.527/2011 e alterações).",
    modules: [
      {
        slug: "etica-fundamentos",
        name: "Fundamentos",
        topics: [
          { slug: "etica-conceitos", title: "Ética e integridade: conceito, princípios, valores", subtopics: ["Conceito", "Princípios", "Valores"] },
          { slug: "etica-moral-cidadania", title: "Ética, moral, democracia e exercício da cidadania" },
          { slug: "etica-contexto-publico", title: "Ética no contexto público" },
        ],
      },
      {
        slug: "etica-regime-disciplinar",
        name: "Regime Disciplinar Federal",
        topics: [
          {
            slug: "etica-lei-8112",
            title: "Lei nº 8.112/1990 e suas alterações (deveres, proibições, acumulação, responsabilidades, penalidades)",
            subtopics: ["Deveres", "Proibições", "Acumulação", "Responsabilidades", "Penalidades"],
          },
        ],
      },
      {
        slug: "etica-corrupcao",
        name: "Combate à Corrupção e Improbidade",
        topics: [
          { slug: "etica-improbidade", title: "Lei nº 8.429/1992 (atos de improbidade administrativa), com as alterações da Lei nº 14.230/2021" },
          { slug: "etica-anticorrupcao", title: "Lei nº 12.846/2013 (Lei Anticorrupção)" },
        ],
      },
      {
        slug: "etica-processo-adm",
        name: "Processo Administrativo",
        topics: [
          {
            slug: "etica-lei-9784",
            title: "Lei nº 9.784/1999 (conceitos, princípios, direitos e deveres dos administrados)",
            subtopics: ["Conceitos", "Princípios", "Direitos dos administrados", "Deveres dos administrados"],
          },
        ],
      },
      {
        slug: "etica-jf3r",
        name: "Normas Deontológicas e Integridade na Justiça Federal da 3ª Região",
        topics: [
          { slug: "etica-codigo-conduta-cjf", title: "Código de Conduta da Justiça Federal (Resolução CJF nº 147/2011)" },
          { slug: "etica-comite-gestor", title: "Atuação e composição do Comitê Gestor do Código de Conduta da JF3R (Portaria CNJ nº 116/2012 e Portaria PRES nº 4.657/2026)" },
          { slug: "etica-res-cnj-410", title: "Diretrizes dos Sistemas de Integridade do Poder Judiciário (Resolução CNJ nº 410/2021)" },
          { slug: "etica-governanca-colaborativa", title: "Governança Colaborativa no âmbito da JF3R (Resolução PRES nº 426/2021)" },
        ],
      },
      {
        slug: "etica-ambiente-trabalho",
        name: "Ambiente de Trabalho",
        topics: [
          {
            slug: "etica-assedio",
            title: "Política de Prevenção e Enfrentamento do Assédio e da Discriminação (Resolução CNJ nº 351/2020) e as Comissões locais de Prevenção e Enfrentamento do Assédio no TRF3 e Seções Judiciárias vinculadas",
          },
        ],
      },
      {
        slug: "etica-dados-transparencia",
        name: "Proteção de dados e acesso à informação",
        topics: [
          { slug: "etica-lgpd", title: "Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 e alterações)" },
          { slug: "etica-lai", title: "Lei de Acesso à Informação (Lei nº 12.527/2011 e alterações)" },
        ],
      },
    ],
  },
  {
    slug: "direitos-humanos",
    name: "Noções de Direitos Humanos e Fundamentais e de Acessibilidade",
    kind: "GERAL",
    specialty: null,
    color: "#8b5cf6",
    editalRef: REF_GERAIS,
    editalText:
      "Teoria geral dos direitos fundamentais. Direitos Humanos e Direitos Fundamentais. Declaração Universal dos Direitos Humanos. Agenda 2030 da ONU. Decreto nº 6.949/2009 (Convenção Internacional sobre os Direitos das Pessoas com Deficiência). Resolução CNJ nº 401/2021; Inclusão, direitos e garantias legais e constitucionais das pessoas com deficiência (Lei nº 13.146/2015; Lei nº 11.126/2005 e Constituição Federal). Normas gerais e critérios básicos para a promoção da acessibilidade das pessoas com deficiência ou com mobilidade reduzida (Lei nº 10.098/2000; Lei nº 10.048/2000; Lei nº 7.853/1989; Decreto nº 5.296/2004). Prioridade de atendimento às pessoas com deficiência (Lei nº 10.048/2000; Lei nº 14.364/2022; Decreto nº 5.296/2004). Normas de apoio às pessoas com deficiência e sua integração social (Lei nº 7.853/1989 e Decreto nº 3.298/1999).",
    modules: [
      {
        slug: "dh-teoria",
        name: "Teoria dos direitos humanos e fundamentais",
        topics: [
          { slug: "dh-teoria-geral", title: "Teoria geral dos direitos fundamentais" },
          { slug: "dh-dh-df", title: "Direitos Humanos e Direitos Fundamentais" },
          { slug: "dh-dudh", title: "Declaração Universal dos Direitos Humanos" },
          { slug: "dh-agenda-2030", title: "Agenda 2030 da ONU" },
        ],
      },
      {
        slug: "dh-pcd",
        name: "Direitos das pessoas com deficiência",
        topics: [
          { slug: "dh-convencao", title: "Decreto nº 6.949/2009 (Convenção Internacional sobre os Direitos das Pessoas com Deficiência)" },
          { slug: "dh-res-cnj-401", title: "Resolução CNJ nº 401/2021" },
          {
            slug: "dh-lbi",
            title: "Inclusão, direitos e garantias legais e constitucionais das pessoas com deficiência (Lei nº 13.146/2015; Lei nº 11.126/2005 e Constituição Federal)",
            subtopics: ["Lei nº 13.146/2015 (Estatuto da Pessoa com Deficiência)", "Lei nº 11.126/2005 (cão-guia)", "Constituição Federal"],
          },
        ],
      },
      {
        slug: "dh-acessibilidade",
        name: "Acessibilidade e atendimento prioritário",
        topics: [
          {
            slug: "dh-normas-acessibilidade",
            title: "Normas gerais e critérios básicos para a promoção da acessibilidade das pessoas com deficiência ou com mobilidade reduzida (Lei nº 10.098/2000; Lei nº 10.048/2000; Lei nº 7.853/1989; Decreto nº 5.296/2004)",
            subtopics: ["Lei nº 10.098/2000", "Lei nº 10.048/2000", "Lei nº 7.853/1989", "Decreto nº 5.296/2004"],
          },
          {
            slug: "dh-prioridade",
            title: "Prioridade de atendimento às pessoas com deficiência (Lei nº 10.048/2000; Lei nº 14.364/2022; Decreto nº 5.296/2004)",
            subtopics: ["Lei nº 10.048/2000", "Lei nº 14.364/2022", "Decreto nº 5.296/2004"],
          },
          {
            slug: "dh-apoio-integracao",
            title: "Normas de apoio às pessoas com deficiência e sua integração social (Lei nº 7.853/1989 e Decreto nº 3.298/1999)",
            subtopics: ["Lei nº 7.853/1989", "Decreto nº 3.298/1999"],
          },
        ],
      },
    ],
  },
  {
    slug: "sustentabilidade",
    name: "Sustentabilidade e Meio Ambiente",
    kind: "GERAL",
    specialty: null,
    color: "#22c55e",
    editalRef: REF_GERAIS,
    editalText:
      "Noções de sustentabilidade: o princípio do desenvolvimento sustentável na CF/88; Objetivos de Desenvolvimento Sustentável – ONU; contratações sustentáveis na Lei nº 14.133/2021. Política Nacional sobre Mudança do Clima (Lei nº 12.187/2009). Resolução nº 433/2021, do Conselho Nacional de Justiça (Política Nacional do Poder Judiciário para o Clima e Meio Ambiente). Resolução nº 709/2021 do Conselho da Justiça Federal (Política de Sustentabilidade da Justiça Federal).",
    modules: [
      {
        slug: "sust-nocoes",
        name: "Noções de sustentabilidade",
        topics: [
          { slug: "sust-cf88", title: "O princípio do desenvolvimento sustentável na CF/88" },
          { slug: "sust-ods", title: "Objetivos de Desenvolvimento Sustentável – ONU" },
          { slug: "sust-contratacoes", title: "Contratações sustentáveis na Lei nº 14.133/2021" },
        ],
      },
      {
        slug: "sust-politicas",
        name: "Políticas climáticas e de sustentabilidade",
        topics: [
          { slug: "sust-pnmc", title: "Política Nacional sobre Mudança do Clima (Lei nº 12.187/2009)" },
          { slug: "sust-res-cnj-433", title: "Resolução nº 433/2021, do Conselho Nacional de Justiça (Política Nacional do Poder Judiciário para o Clima e Meio Ambiente)" },
          { slug: "sust-res-cjf-709", title: "Resolução nº 709/2021 do Conselho da Justiça Federal (Política de Sustentabilidade da Justiça Federal)" },
        ],
      },
    ],
  },

  // ═══════════════════════════ ESPECÍFICOS — 006 DESENVOLVIMENTO DE SISTEMAS ═══════════════════════════
  {
    slug: "dev-programacao",
    name: "Fundamentos de Programação e Estruturas de Dados",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#3b82f6",
    editalRef: REF_DEV,
    editalText:
      "Algoritmos e lógica de programação. Complexidade de algoritmos. Estruturas de dados: vetores, matrizes, listas, pilhas, filas, árvores e tabelas de espalhamento (hash). Programação Orientada a Objetos (POO): conceitos, classes, objetos, atributos, métodos, herança, polimorfismo, encapsulamento e abstração.",
    modules: [
      {
        slug: "dev-algoritmos",
        name: "Algoritmos",
        topics: [
          { slug: "dev-logica", title: "Algoritmos e lógica de programação" },
          { slug: "dev-complexidade", title: "Complexidade de algoritmos" },
        ],
      },
      {
        slug: "dev-estruturas",
        name: "Estruturas de dados",
        topics: [
          {
            slug: "dev-estruturas-dados",
            title: "Estruturas de dados: vetores, matrizes, listas, pilhas, filas, árvores e tabelas de espalhamento (hash)",
            subtopics: ["Vetores", "Matrizes", "Listas", "Pilhas", "Filas", "Árvores", "Tabelas de espalhamento (hash)"],
          },
        ],
      },
      {
        slug: "dev-poo",
        name: "Programação Orientada a Objetos",
        topics: [
          {
            slug: "dev-poo-conceitos",
            title: "Programação Orientada a Objetos (POO): conceitos, classes, objetos, atributos, métodos, herança, polimorfismo, encapsulamento e abstração",
            subtopics: ["Conceitos", "Classes", "Objetos", "Atributos", "Métodos", "Herança", "Polimorfismo", "Encapsulamento", "Abstração"],
          },
        ],
      },
    ],
  },
  {
    slug: "dev-linguagens",
    name: "Linguagens, Frameworks e Tecnologias de Mercado",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#06b6d4",
    editalRef: REF_DEV,
    editalText:
      "Linguagens de programação corporativas: Java, C#, PHP 8, Python, JavaScript e TypeScript. Frameworks Back-end: Spring Boot, Spring Framework, Django, Node.js. Frameworks Front-end e Web: Angular, Vue.js, React.js, HTML5 e CSS3. Integração e persistência de dados (Mapeamento Objeto-Relacional): Hibernate, JPA (Java Persistence API), Entity Framework Core (.NET) e Doctrine (PHP). APIs e Interoperabilidade: desenvolvimento de APIs RESTful, GraphQL e documentação com Swagger/OpenAPI.",
    modules: [
      {
        slug: "dev-linguagens-corporativas",
        name: "Linguagens de programação corporativas",
        topics: [
          { slug: "dev-java", title: "Java" },
          { slug: "dev-csharp", title: "C#" },
          { slug: "dev-php", title: "PHP 8" },
          { slug: "dev-python", title: "Python" },
          { slug: "dev-javascript", title: "JavaScript" },
          { slug: "dev-typescript", title: "TypeScript" },
        ].map((t) => ({ ...t, excerpt: "Linguagens de programação corporativas: Java, C#, PHP 8, Python, JavaScript e TypeScript." })),
      },
      {
        slug: "dev-backend",
        name: "Frameworks Back-end",
        topics: [
          { slug: "dev-spring-boot", title: "Spring Boot" },
          { slug: "dev-spring-framework", title: "Spring Framework" },
          { slug: "dev-django", title: "Django" },
          { slug: "dev-nodejs", title: "Node.js" },
        ].map((t) => ({ ...t, excerpt: "Frameworks Back-end: Spring Boot, Spring Framework, Django, Node.js." })),
      },
      {
        slug: "dev-frontend",
        name: "Frameworks Front-end e Web",
        topics: [
          { slug: "dev-angular", title: "Angular" },
          { slug: "dev-vue", title: "Vue.js" },
          { slug: "dev-react", title: "React.js" },
          { slug: "dev-html5", title: "HTML5" },
          { slug: "dev-css3", title: "CSS3" },
        ].map((t) => ({ ...t, excerpt: "Frameworks Front-end e Web: Angular, Vue.js, React.js, HTML5 e CSS3." })),
      },
      {
        slug: "dev-orm",
        name: "Integração e persistência de dados (Mapeamento Objeto-Relacional)",
        topics: [
          { slug: "dev-hibernate", title: "Hibernate" },
          { slug: "dev-jpa", title: "JPA (Java Persistence API)" },
          { slug: "dev-ef-core", title: "Entity Framework Core (.NET)" },
          { slug: "dev-doctrine", title: "Doctrine (PHP)" },
        ].map((t) => ({ ...t, excerpt: "Integração e persistência de dados (Mapeamento Objeto-Relacional): Hibernate, JPA (Java Persistence API), Entity Framework Core (.NET) e Doctrine (PHP)." })),
      },
      {
        slug: "dev-apis",
        name: "APIs e Interoperabilidade",
        topics: [
          { slug: "dev-rest", title: "Desenvolvimento de APIs RESTful" },
          { slug: "dev-graphql", title: "GraphQL" },
          { slug: "dev-openapi", title: "Documentação com Swagger/OpenAPI" },
        ].map((t) => ({ ...t, excerpt: "APIs e Interoperabilidade: desenvolvimento de APIs RESTful, GraphQL e documentação com Swagger/OpenAPI." })),
      },
    ],
  },
  {
    slug: "dev-pje-pdpj",
    name: "Tecnologias do Ecossistema PJe e PDPJ-Br",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#a855f7",
    editalRef: REF_DEV,
    editalText:
      "Desenvolvimento no PJe: PrimeFaces, Maven, JSF (JavaServer Faces), Angular e ecossistema SpringBoot/SpringCloud. Servidores de Aplicação e Middleware: WildFly/JBoss EAP, Apache Tomcat, Nginx. Arquitetura de Microsserviços na PDPJ: conceitos operacionais e componentes integrados - SpringCloud, Eureka (service registry), Zuul (API Gateway), Hystrix (circuit breaker) e Data Envers. Mensageria e Cache: RabbitMQ, Apache Kafka e protocolo AMQP. Redis (utilizado como cache em memória). Gerenciamento de Identidade: Keycloak e Single Sign-On (SSO) integrados à PDPJ-Br.",
    modules: [
      {
        slug: "dev-pje",
        name: "Desenvolvimento no PJe",
        topics: [
          { slug: "dev-primefaces", title: "PrimeFaces" },
          { slug: "dev-maven", title: "Maven" },
          { slug: "dev-jsf", title: "JSF (JavaServer Faces)" },
          { slug: "dev-pje-angular", title: "Angular (no contexto do PJe)" },
          { slug: "dev-spring-cloud-eco", title: "Ecossistema SpringBoot/SpringCloud" },
        ].map((t) => ({ ...t, excerpt: "Desenvolvimento no PJe: PrimeFaces, Maven, JSF (JavaServer Faces), Angular e ecossistema SpringBoot/SpringCloud." })),
      },
      {
        slug: "dev-servidores",
        name: "Servidores de Aplicação e Middleware",
        topics: [
          { slug: "dev-wildfly", title: "WildFly/JBoss EAP" },
          { slug: "dev-tomcat", title: "Apache Tomcat" },
          { slug: "dev-nginx", title: "Nginx" },
        ].map((t) => ({ ...t, excerpt: "Servidores de Aplicação e Middleware: WildFly/JBoss EAP, Apache Tomcat, Nginx." })),
      },
      {
        slug: "dev-microsservicos",
        name: "Arquitetura de Microsserviços na PDPJ",
        topics: [
          { slug: "dev-microsservicos-conceitos", title: "Conceitos operacionais de microsserviços e componentes integrados (SpringCloud)" },
          { slug: "dev-eureka", title: "Eureka (service registry)" },
          { slug: "dev-zuul", title: "Zuul (API Gateway)" },
          { slug: "dev-hystrix", title: "Hystrix (circuit breaker)" },
          { slug: "dev-envers", title: "Data Envers" },
        ].map((t) => ({ ...t, excerpt: "Arquitetura de Microsserviços na PDPJ: conceitos operacionais e componentes integrados - SpringCloud, Eureka (service registry), Zuul (API Gateway), Hystrix (circuit breaker) e Data Envers." })),
      },
      {
        slug: "dev-mensageria",
        name: "Mensageria e Cache",
        topics: [
          { slug: "dev-rabbitmq", title: "RabbitMQ" },
          { slug: "dev-kafka", title: "Apache Kafka" },
          { slug: "dev-amqp", title: "Protocolo AMQP" },
          { slug: "dev-redis", title: "Redis (utilizado como cache em memória)" },
        ].map((t) => ({ ...t, excerpt: "Mensageria e Cache: RabbitMQ, Apache Kafka e protocolo AMQP. Redis (utilizado como cache em memória)." })),
      },
      {
        slug: "dev-identidade",
        name: "Gerenciamento de Identidade",
        topics: [
          { slug: "dev-keycloak-sso", title: "Keycloak e Single Sign-On (SSO) integrados à PDPJ-Br", subtopics: ["Keycloak", "Single Sign-On (SSO)"] },
        ],
      },
    ],
  },
  {
    slug: "dev-engenharia",
    name: "Engenharia e Arquitetura de Software Aplicada",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#14b8a6",
    editalRef: REF_DEV,
    editalText:
      "Práticas de codificação limpa: Clean Code. Princípios SOLID, Clean Architecture e padrões de projeto (Design Patterns). Modelagem de Processos de Negócio: notação BPMN 2.0 e motores de workflow (jBPM). Controle de versão distribuído com Git e fluxos de trabalho (GitLab/Gitflow). Automação de Infraestrutura e esteiras: CI/CD (Integração Contínua e Entrega Contínua). Gerenciamento de contêineres: Docker (imagens, Dockerfile, docker-compose) e Kubernetes.",
    modules: [
      {
        slug: "dev-codigo-limpo",
        name: "Codificação limpa e arquitetura",
        topics: [
          { slug: "dev-clean-code", title: "Práticas de codificação limpa: Clean Code" },
          { slug: "dev-solid", title: "Princípios SOLID" },
          { slug: "dev-clean-architecture", title: "Clean Architecture" },
          { slug: "dev-design-patterns", title: "Padrões de projeto (Design Patterns)" },
        ],
      },
      {
        slug: "dev-bpm",
        name: "Modelagem de Processos de Negócio",
        topics: [
          { slug: "dev-bpmn", title: "Notação BPMN 2.0" },
          { slug: "dev-jbpm", title: "Motores de workflow (jBPM)" },
        ],
      },
      {
        slug: "dev-devops",
        name: "Versionamento, CI/CD e contêineres",
        topics: [
          { slug: "dev-git", title: "Controle de versão distribuído com Git e fluxos de trabalho (GitLab/Gitflow)", subtopics: ["Git", "GitLab", "Gitflow"] },
          { slug: "dev-cicd", title: "Automação de Infraestrutura e esteiras: CI/CD (Integração Contínua e Entrega Contínua)", subtopics: ["Integração Contínua", "Entrega Contínua"] },
          { slug: "dev-docker", title: "Gerenciamento de contêineres: Docker (imagens, Dockerfile, docker-compose)", subtopics: ["Imagens", "Dockerfile", "docker-compose"] },
          { slug: "dev-kubernetes", title: "Kubernetes" },
        ],
      },
    ],
  },
  {
    slug: "dev-banco-dados",
    name: "Banco de Dados",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#f97316",
    editalRef: REF_DEV,
    editalText:
      "Modelagem relacional e Diagramas de Entidade-Relacionamento (DER). Linguagem de Consulta Estruturada (SQL ANSI): comandos DDL e DML. Bancos de dados relacionais na Justiça Federal: PostgreSQL e SQL Server. Versionamento de banco de dados: Flyway. Noções de Business Intelligence: Data Warehouse, processos de ETL e ferramentas OLAP.",
    modules: [
      {
        slug: "dev-bd-modelagem",
        name: "Modelagem e SQL",
        topics: [
          { slug: "dev-modelagem-der", title: "Modelagem relacional e Diagramas de Entidade-Relacionamento (DER)" },
          { slug: "dev-sql", title: "Linguagem de Consulta Estruturada (SQL ANSI): comandos DDL e DML", subtopics: ["Comandos DDL", "Comandos DML"] },
        ],
      },
      {
        slug: "dev-bd-sgbd",
        name: "SGBDs e versionamento",
        topics: [
          { slug: "dev-postgresql", title: "Bancos de dados relacionais na Justiça Federal: PostgreSQL" },
          { slug: "dev-sqlserver", title: "Bancos de dados relacionais na Justiça Federal: SQL Server" },
          { slug: "dev-flyway", title: "Versionamento de banco de dados: Flyway" },
        ],
      },
      {
        slug: "dev-bi",
        name: "Noções de Business Intelligence",
        topics: [
          { slug: "dev-data-warehouse", title: "Data Warehouse" },
          { slug: "dev-etl", title: "Processos de ETL" },
          { slug: "dev-olap", title: "Ferramentas OLAP" },
        ].map((t) => ({ ...t, excerpt: "Noções de Business Intelligence: Data Warehouse, processos de ETL e ferramentas OLAP." })),
      },
    ],
  },
  {
    slug: "dev-seguranca-ux",
    name: "Segurança da Informação, Usabilidade e Acessibilidade",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#ef4444",
    editalRef: REF_DEV,
    editalText:
      "Práticas de desenvolvimento seguro e mitigação de vulnerabilidades OWASP Top 10. Conceitos de Privacy by Design aplicados à engenharia de software. Usabilidade de software: princípios fundamentais de UX (User Experience) e UI (User Interface). Acessibilidade na Web: Diretrizes de Acessibilidade para Conteúdo Web (WCAG) e Modelo de Acessibilidade em Governo Eletrônico (eMAG).",
    modules: [
      {
        slug: "dev-desenvolvimento-seguro",
        name: "Desenvolvimento seguro e privacidade",
        topics: [
          { slug: "dev-owasp", title: "Práticas de desenvolvimento seguro e mitigação de vulnerabilidades OWASP Top 10" },
          { slug: "dev-privacy-by-design", title: "Conceitos de Privacy by Design aplicados à engenharia de software" },
        ],
      },
      {
        slug: "dev-ux-acessibilidade",
        name: "Usabilidade e acessibilidade",
        topics: [
          { slug: "dev-ux-ui", title: "Usabilidade de software: princípios fundamentais de UX (User Experience) e UI (User Interface)", subtopics: ["UX (User Experience)", "UI (User Interface)"] },
          { slug: "dev-wcag", title: "Acessibilidade na Web: Diretrizes de Acessibilidade para Conteúdo Web (WCAG)" },
          { slug: "dev-emag", title: "Modelo de Acessibilidade em Governo Eletrônico (eMAG)" },
        ],
      },
    ],
  },
  {
    slug: "dev-normativos",
    name: "Normativos Transversais Obrigatórios do Poder Judiciário (Desenvolvimento)",
    kind: "ESPECIFICA",
    specialty: "DEV",
    color: "#64748b",
    editalRef: REF_DEV,
    editalText:
      "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD). Resolução CNJ nº 335/2020: Política Pública para a Governança e a Gestão de Processo Judicial Eletrônico (PJe) e da PDPJ-Br. Resolução CNJ nº 522/2023: Modelo de Requisitos para Sistemas Informatizados de Gestão de Processos e Documentos do Poder Judiciário. Portaria CNJ nº 252/2020 (Modelo de Governança) e Portaria CNJ nº 253/2020 (Diretrizes Técnicas da PDPJ-Br). Portaria CNJ nº 131/2021: Grupo Revisor de Código-Fonte das soluções da PDPJ-Br e do PJe. Resolução CNJ nº 396/2021 e Portaria CNJ nº 162/2021: Estratégia Nacional de Segurança Cibernética.",
    modules: [
      {
        slug: "dev-norm-cnj",
        name: "Normativos do CNJ e LGPD",
        topics: [
          { slug: "dev-norm-lgpd", title: "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD)" },
          { slug: "dev-norm-res-335", title: "Resolução CNJ nº 335/2020: Política Pública para a Governança e a Gestão de Processo Judicial Eletrônico (PJe) e da PDPJ-Br" },
          { slug: "dev-norm-res-522", title: "Resolução CNJ nº 522/2023: Modelo de Requisitos para Sistemas Informatizados de Gestão de Processos e Documentos do Poder Judiciário" },
          { slug: "dev-norm-port-252-253", title: "Portaria CNJ nº 252/2020 (Modelo de Governança) e Portaria CNJ nº 253/2020 (Diretrizes Técnicas da PDPJ-Br)", subtopics: ["Portaria CNJ nº 252/2020 (Modelo de Governança)", "Portaria CNJ nº 253/2020 (Diretrizes Técnicas da PDPJ-Br)"] },
          { slug: "dev-norm-port-131", title: "Portaria CNJ nº 131/2021: Grupo Revisor de Código-Fonte das soluções da PDPJ-Br e do PJe" },
          { slug: "dev-norm-ensec", title: "Resolução CNJ nº 396/2021 e Portaria CNJ nº 162/2021: Estratégia Nacional de Segurança Cibernética", subtopics: ["Resolução CNJ nº 396/2021", "Portaria CNJ nº 162/2021"] },
        ],
      },
    ],
  },

  // ═══════════════════════════ ESPECÍFICOS — 007 SUPORTE TÉCNICO ═══════════════════════════
  {
    slug: "sup-hardware",
    name: "Hardware e Arquitetura de Computadores",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#3b82f6",
    editalRef: REF_SUP,
    editalText:
      "Organização de computadores: placa-mãe, processadores (multi-core), memórias (RAM, cache, ROM) e barramentos. Dispositivos de armazenamento: HDs (SATA/SAS) e SSDs (SATA/NVMe M.2). Conceitos básicos de RAID. Periféricos: impressoras laser e jato de tinta (configuração e filas), monitores, scanners e headsets. Dispositivos móveis (iOS e Android) e noções de gerenciamento com Microsoft Intune. Diagnóstico de falhas e substituição física de componentes.",
    modules: [
      {
        slug: "sup-organizacao",
        name: "Organização de computadores",
        topics: [
          {
            slug: "sup-organizacao-computadores",
            title: "Organização de computadores: placa-mãe, processadores (multi-core), memórias (RAM, cache, ROM) e barramentos",
            subtopics: ["Placa-mãe", "Processadores (multi-core)", "Memórias (RAM, cache, ROM)", "Barramentos"],
          },
        ],
      },
      {
        slug: "sup-armazenamento",
        name: "Armazenamento e RAID",
        topics: [
          { slug: "sup-dispositivos-armazenamento", title: "Dispositivos de armazenamento: HDs (SATA/SAS) e SSDs (SATA/NVMe M.2)", subtopics: ["HDs (SATA/SAS)", "SSDs (SATA/NVMe M.2)"] },
          { slug: "sup-raid", title: "Conceitos básicos de RAID" },
        ],
      },
      {
        slug: "sup-perifericos",
        name: "Periféricos e dispositivos móveis",
        topics: [
          {
            slug: "sup-perifericos-itens",
            title: "Periféricos: impressoras laser e jato de tinta (configuração e filas), monitores, scanners e headsets",
            subtopics: ["Impressoras laser e jato de tinta (configuração e filas)", "Monitores", "Scanners", "Headsets"],
          },
          { slug: "sup-moveis-intune", title: "Dispositivos móveis (iOS e Android) e noções de gerenciamento com Microsoft Intune", subtopics: ["iOS", "Android", "Microsoft Intune"] },
        ],
      },
      {
        slug: "sup-diagnostico",
        name: "Manutenção",
        topics: [{ slug: "sup-diagnostico-falhas", title: "Diagnóstico de falhas e substituição física de componentes" }],
      },
    ],
  },
  {
    slug: "sup-sistemas-operacionais",
    name: "Sistemas Operacionais e Administração Local",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#0ea5e9",
    editalRef: REF_SUP,
    editalText:
      "Microsoft Windows 10 e Windows 11: instalação, gerenciamento de usuários locais, registros de eventos, UAC e Windows Update. Noções operacionais de Windows Server: uso do Server Manager e serviços básicos de DNS/DHCP. Administração operacional de Active Directory: criação de usuários, reset de senhas, ingresso de computadores no domínio e validação de GPOs. Linux (Ubuntu/Debian): comandos básicos de terminal, manipulação de arquivos, criação de usuários e instalação de pacotes (apt). Instalação de drivers de dispositivos. Noções de Virtualização de Desktops via Remote Desktop Services (RDS).",
    modules: [
      {
        slug: "sup-windows",
        name: "Windows 10 e 11",
        topics: [
          {
            slug: "sup-windows-10-11",
            title: "Microsoft Windows 10 e Windows 11: instalação, gerenciamento de usuários locais, registros de eventos, UAC e Windows Update",
            subtopics: ["Instalação", "Gerenciamento de usuários locais", "Registros de eventos", "UAC", "Windows Update"],
          },
        ],
      },
      {
        slug: "sup-windows-server",
        name: "Windows Server e Active Directory",
        topics: [
          { slug: "sup-windows-server-dns-dhcp", title: "Noções operacionais de Windows Server: uso do Server Manager e serviços básicos de DNS/DHCP", subtopics: ["Server Manager", "DNS", "DHCP"] },
          {
            slug: "sup-active-directory",
            title: "Administração operacional de Active Directory: criação de usuários, reset de senhas, ingresso de computadores no domínio e validação de GPOs",
            subtopics: ["Criação de usuários", "Reset de senhas", "Ingresso de computadores no domínio", "Validação de GPOs"],
          },
        ],
      },
      {
        slug: "sup-linux",
        name: "Linux",
        topics: [
          {
            slug: "sup-linux-basico",
            title: "Linux (Ubuntu/Debian): comandos básicos de terminal, manipulação de arquivos, criação de usuários e instalação de pacotes (apt)",
            subtopics: ["Comandos básicos de terminal", "Manipulação de arquivos", "Criação de usuários", "Instalação de pacotes (apt)"],
          },
        ],
      },
      {
        slug: "sup-drivers-rds",
        name: "Drivers e virtualização de desktops",
        topics: [
          { slug: "sup-drivers", title: "Instalação de drivers de dispositivos" },
          { slug: "sup-rds", title: "Noções de Virtualização de Desktops via Remote Desktop Services (RDS)" },
        ],
      },
    ],
  },
  {
    slug: "sup-produtividade",
    name: "Ferramentas de Produtividade e Colaboração",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#8b5cf6",
    editalRef: REF_SUP,
    editalText:
      "Suite Microsoft 365: Word, Excel, PowerPoint e Outlook (configuração e resolução de problemas). Microsoft Teams: canais, reuniões e integração com SharePoint e OneDrive. Sincronização e permissões no OneDrive/SharePoint. Navegadores de internet (Edge e Chrome): limpeza de cache, extensões, configurações de proxy e certificados de segurança. Certificação digital: instalação e uso de tokens e smart cards padrão ICP-Brasil. Suporte a ferramentas de videoconferência.",
    modules: [
      {
        slug: "sup-m365",
        name: "Microsoft 365",
        topics: [
          { slug: "sup-office", title: "Suite Microsoft 365: Word, Excel, PowerPoint e Outlook (configuração e resolução de problemas)", subtopics: ["Word", "Excel", "PowerPoint", "Outlook"] },
          { slug: "sup-teams", title: "Microsoft Teams: canais, reuniões e integração com SharePoint e OneDrive", subtopics: ["Canais", "Reuniões", "Integração com SharePoint e OneDrive"] },
          { slug: "sup-onedrive-sharepoint", title: "Sincronização e permissões no OneDrive/SharePoint", subtopics: ["Sincronização", "Permissões"] },
        ],
      },
      {
        slug: "sup-navegadores-certificados",
        name: "Navegadores e certificação digital",
        topics: [
          {
            slug: "sup-navegadores",
            title: "Navegadores de internet (Edge e Chrome): limpeza de cache, extensões, configurações de proxy e certificados de segurança",
            subtopics: ["Limpeza de cache", "Extensões", "Configurações de proxy", "Certificados de segurança"],
          },
          { slug: "sup-icp-brasil", title: "Certificação digital: instalação e uso de tokens e smart cards padrão ICP-Brasil", subtopics: ["Tokens", "Smart cards"] },
          { slug: "sup-videoconferencia", title: "Suporte a ferramentas de videoconferência" },
        ],
      },
    ],
  },
  {
    slug: "sup-redes",
    name: "Redes de Computadores Aplicadas ao Suporte",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#14b8a6",
    editalRef: REF_SUP,
    editalText:
      "Conceitos básicos: modelo OSI, pilhas TCP/IP, endereçamento IPv4 e NAT. Diagnóstico de conectividade local: uso prático de ping, traceroute, nslookup, ipconfig e netstat. Configuração e conexão em redes sem fio (padrões 802.11n/ac/ax) e autenticação. Configuração e suporte a clientes VPN (SSL e IPSec). Impressão em rede e servidores de impressão. Noções básicas de cabeamento estruturado (categorias Cat5e a Cat7 e conexões físicas).",
    modules: [
      {
        slug: "sup-redes-conceitos",
        name: "Conceitos básicos",
        topics: [
          { slug: "sup-osi", title: "Modelo OSI" },
          { slug: "sup-tcpip", title: "Pilhas TCP/IP" },
          { slug: "sup-ipv4-nat", title: "Endereçamento IPv4 e NAT", subtopics: ["Endereçamento IPv4", "NAT"] },
        ].map((t) => ({ ...t, excerpt: "Conceitos básicos: modelo OSI, pilhas TCP/IP, endereçamento IPv4 e NAT." })),
      },
      {
        slug: "sup-redes-diagnostico",
        name: "Diagnóstico de conectividade",
        topics: [
          {
            slug: "sup-ferramentas-diagnostico",
            title: "Diagnóstico de conectividade local: uso prático de ping, traceroute, nslookup, ipconfig e netstat",
            subtopics: ["ping", "traceroute", "nslookup", "ipconfig", "netstat"],
          },
        ],
      },
      {
        slug: "sup-redes-acesso",
        name: "Redes sem fio, VPN, impressão e cabeamento",
        topics: [
          { slug: "sup-wifi", title: "Configuração e conexão em redes sem fio (padrões 802.11n/ac/ax) e autenticação", subtopics: ["802.11n", "802.11ac", "802.11ax", "Autenticação"] },
          { slug: "sup-vpn", title: "Configuração e suporte a clientes VPN (SSL e IPSec)", subtopics: ["VPN SSL", "VPN IPSec"] },
          { slug: "sup-impressao-rede", title: "Impressão em rede e servidores de impressão" },
          { slug: "sup-cabeamento", title: "Noções básicas de cabeamento estruturado (categorias Cat5e a Cat7 e conexões físicas)", subtopics: ["Categorias Cat5e a Cat7", "Conexões físicas"] },
        ],
      },
    ],
  },
  {
    slug: "sup-seguranca",
    name: "Segurança da Informação e Proteção de Dados",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#ef4444",
    editalRef: REF_SUP,
    editalText:
      "Conceitos básicos de confidencialidade, integridade e disponibilidade. Reconhecimento e prevenção de malwares e fraudes: phishing, ransomware, vírus, worms e engenharia social. Operação de antivírus corporativo e agentes EDR. Configuração do Firewall do Windows. Criptografia de disco local com BitLocker. Noções básicas da Lei Geral de Proteção de Dados (LGPD) no atendimento ao usuário.",
    modules: [
      {
        slug: "sup-seg-conceitos",
        name: "Conceitos e ameaças",
        topics: [
          { slug: "sup-cid", title: "Conceitos básicos de confidencialidade, integridade e disponibilidade" },
          {
            slug: "sup-malwares",
            title: "Reconhecimento e prevenção de malwares e fraudes: phishing, ransomware, vírus, worms e engenharia social",
            subtopics: ["Phishing", "Ransomware", "Vírus", "Worms", "Engenharia social"],
          },
        ],
      },
      {
        slug: "sup-seg-ferramentas",
        name: "Ferramentas de proteção",
        topics: [
          { slug: "sup-antivirus-edr", title: "Operação de antivírus corporativo e agentes EDR" },
          { slug: "sup-firewall-windows", title: "Configuração do Firewall do Windows" },
          { slug: "sup-bitlocker", title: "Criptografia de disco local com BitLocker" },
          { slug: "sup-lgpd-atendimento", title: "Noções básicas da Lei Geral de Proteção de Dados (LGPD) no atendimento ao usuário" },
        ],
      },
    ],
  },
  {
    slug: "sup-service-desk",
    name: "Serviços de Atendimento (Service Desk) e ITIL",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#f59e0b",
    editalRef: REF_SUP,
    editalText:
      "Framework ITIL v4 aplicado ao suporte: função da Central de Serviços (Service Desk). Gerenciamento de Incidentes e Gerenciamento de Requisições de Serviço: ciclo de vida do chamado (registro, categorização, priorização, escalonamento e encerramento). Conceitos de Acordo de Nível de Serviço (SLA). Uso de ferramentas de ITSM (Jira Service Management, GLPI ou OTRS). Técnicas de atendimento e comunicação com o usuário. Noções operacionais de inventário e controle de ativos de TI.",
    modules: [
      {
        slug: "sup-itil",
        name: "ITIL 4 e Central de Serviços",
        topics: [
          { slug: "sup-itil-service-desk", title: "Framework ITIL v4 aplicado ao suporte: função da Central de Serviços (Service Desk)" },
          {
            slug: "sup-incidentes-requisicoes",
            title: "Gerenciamento de Incidentes e Gerenciamento de Requisições de Serviço: ciclo de vida do chamado (registro, categorização, priorização, escalonamento e encerramento)",
            subtopics: ["Registro", "Categorização", "Priorização", "Escalonamento", "Encerramento"],
          },
          { slug: "sup-sla", title: "Conceitos de Acordo de Nível de Serviço (SLA)" },
        ],
      },
      {
        slug: "sup-itsm-pratica",
        name: "Ferramentas e práticas de atendimento",
        topics: [
          { slug: "sup-itsm-ferramentas", title: "Uso de ferramentas de ITSM (Jira Service Management, GLPI ou OTRS)", subtopics: ["Jira Service Management", "GLPI", "OTRS"] },
          { slug: "sup-tecnicas-atendimento", title: "Técnicas de atendimento e comunicação com o usuário" },
          { slug: "sup-inventario", title: "Noções operacionais de inventário e controle de ativos de TI" },
        ],
      },
    ],
  },
  {
    slug: "sup-normativos",
    name: "Normativos Transversais Obrigatórios do Poder Judiciário (Suporte)",
    kind: "ESPECIFICA",
    specialty: "SUP",
    color: "#64748b",
    editalRef: REF_SUP,
    editalText:
      "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD). Resolução CNJ nº 335/2020 (Política Pública para a Governança e a Gestão da PDPJ-Br e do PJe). Resolução CNJ nº 522/2023 (Modelo de Requisitos para Sistemas Informatizados do Poder Judiciário). Resolução CNJ nº 396/2021 e Portaria CNJ nº 162/2021 (Estratégia Nacional de Segurança Cibernética do Poder Judiciário – ENSEC-PJ).",
    modules: [
      {
        slug: "sup-norm-cnj",
        name: "Normativos do CNJ e LGPD",
        topics: [
          { slug: "sup-norm-lgpd", title: "Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD)" },
          { slug: "sup-norm-res-335", title: "Resolução CNJ nº 335/2020 (Política Pública para a Governança e a Gestão da PDPJ-Br e do PJe)" },
          { slug: "sup-norm-res-522", title: "Resolução CNJ nº 522/2023 (Modelo de Requisitos para Sistemas Informatizados do Poder Judiciário)" },
          {
            slug: "sup-norm-ensec",
            title: "Resolução CNJ nº 396/2021 e Portaria CNJ nº 162/2021 (Estratégia Nacional de Segurança Cibernética do Poder Judiciário – ENSEC-PJ)",
            subtopics: ["Resolução CNJ nº 396/2021", "Portaria CNJ nº 162/2021"],
          },
        ],
      },
    ],
  },
];

/** Dados oficiais do concurso extraídos do Edital nº 01/2026 e da retificação nº 02/2026. */
export const EXAM_INFO = {
  code: "TRF3-2026",
  name: "Concurso Público TRF3 2026 — Servidores (Justiça Federal da 3ª Região)",
  board: "Fundação Vunesp",
  examDate: "2027-01-31T09:00:00-03:00",
  notes:
    "Prova objetiva + discursiva aplicadas em 31/01/2027 (data prevista no Anexo VII; cronograma sujeito a alterações). Duração total: 4h30.",
  specialties: [
    {
      key: "DEV",
      code: "006",
      slug: "desenvolvimento-de-sistemas",
      name: "Técnico Judiciário – Área Apoio Especializado – Especialidade Desenvolvimento de Sistemas de Informação",
      shortName: "Desenvolvimento de Sistemas",
      vacancies: 5,
      vacancyNotes: "Anexo III (TRF3 – São Paulo/Capital e Campo Grande): 5 vagas — 2 ampla concorrência, 1 PcD, 2 negros ou pardos.",
      duties:
        "Realizar atividades relacionadas à execução de tarefas que envolvam suporte técnico e administrativo em desenvolvimento, implantação e manutenção de sistemas informatizados.",
    },
    {
      key: "SUP",
      code: "007",
      slug: "suporte-tecnico",
      name: "Técnico Judiciário – Área Apoio Especializado – Especialidade Suporte Técnico",
      shortName: "Suporte Técnico",
      vacancies: 4,
      vacancyNotes: "Anexo III (TRF3 – São Paulo/Capital e Campo Grande): 4 vagas — 2 ampla concorrência, 2 negros ou pardos.",
      duties:
        "Realizar atividades relacionadas à execução de tarefas que envolvam suporte técnico e administrativo em desenvolvimento, implantação, manutenção de tecnologias de rede, banco de dados, sistemas operacionais, segurança da informação, tecnologias de colaboração, internet, telecomunicações e microinformática.",
    },
  ],
  versions: [
    {
      number: "01/2026",
      title: "Edital de Abertura de Inscrições nº 01/2026",
      url: "https://www.trf3.jus.br/documentos/sege/RING_-_Concursos/2026/Editais/Edital_01_2026_completo.pdf",
      publishedAt: "2026-10-26",
      summary: "Abertura das inscrições. Anexo I (atribuições), Cap. 8–13 (provas e julgamento), Anexo VI (conteúdo programático), Anexo VII (cronograma).",
    },
    {
      number: "02/2026",
      title: "Edital de Retificação nº 02/2026",
      url: "https://www.trf3.jus.br/documentos/sege/RING_-_Concursos/2026/Editais/Edital_2_2026_completo.pdf",
      publishedAt: "2026-11-04",
      summary:
        "Retifica itens 3.23, 3.5.2 e 3.5.3 (pagamento via PagTesouro até 24/11/2026, 21h59), título do Cap. 5 (candidatos negros), item 5.2.1 (inclui alínea c), item 8.1 (peso da prova discursiva passa a ser 1) e item 15.1 (recursos). Demais itens inalterados.",
    },
  ],
  milestones: [
    { item: 1, title: "Período de inscrições", start: "2026-11-04", end: "2026-11-23" },
    { item: 2, title: "Solicitação de isenção da taxa de inscrição", start: "2026-11-04", end: "2026-11-05" },
    { item: 4, title: "Resultado da solicitação de isenção", start: "2026-11-12" },
    { item: 5, title: "Recurso contra resultado da isenção", start: "2026-11-13", end: "2026-11-16" },
    { item: 6, title: "Resultado dos recursos de isenção", start: "2026-11-19" },
    { item: 7, title: "Vencimento do pagamento da inscrição (até 21h59)", start: "2026-11-24" },
    { item: 8, title: "Resultado das condições especiais / PcD / jurado / cotas / voluntário / sabatista", start: "2026-12-09" },
    { item: 9, title: "Recurso contra resultados do item 8", start: "2026-12-10", end: "2026-12-11" },
    { item: 10, title: "Análise dos recursos do item 9", start: "2026-12-21" },
    { item: 11, title: "Publicação da convocação para as provas", start: "2027-01-21" },
    { item: 12, title: "Aplicação das provas (objetiva e discursiva)", start: "2027-01-31" },
    { item: 13, title: "Gabarito da prova objetiva", start: "2027-02-01" },
    { item: 14, title: "Recurso contra o gabarito", start: "2027-02-02", end: "2027-02-03" },
    { item: 15, title: "Análise de recursos do gabarito e nota da prova objetiva", start: "2027-02-26" },
    { item: 16, title: "Recurso contra a nota da prova objetiva", start: "2027-03-01", end: "2027-03-02" },
    { item: 17, title: "Análise dos recursos contra a nota da prova objetiva", start: "2027-03-22" },
  ],
  updates: [
    {
      title: "Edital de Retificação nº 02/2026 publicado",
      summary: "Peso da prova discursiva – redação passa a 1 (item 8.1); pagamento via PagTesouro até 24/11/2026; ajustes nos capítulos 3, 5 e 15.",
      url: "https://www.trf3.jus.br/sege/concurso-servidores/2026/editais",
      publishedAt: "2026-11-04",
    },
    {
      title: "Edital de Abertura nº 01/2026 publicado",
      summary: "Inscrições de 04/11 a 23/11/2026 no site da Vunesp. Prova prevista para 31/01/2027.",
      url: "https://www.vunesp.com.br/TRFT2601",
      publishedAt: "2026-10-26",
    },
  ],
};

/** Regras oficiais de avaliação (Edital 01/2026, Cap. 8, 9.51–9.54, 10, 12, 13; item 8.1 retificado pelo Edital 02/2026). */
export const EXAM_RULES = {
  totalQuestions: 60,
  geraisQuestions: 24,
  especificosQuestions: 36,
  alternatives: 5,
  pesoGerais: 1,
  pesoEspecificos: 2,
  pesoRedacao: 1,
  durationMinutes: 270,
  habilitacao: {
    amplaConcorrencia: { minAcertosGerais: 12, minAcertosEspecificos: 18, minMediaPonderada: 6.0, minRedacao: 5.0 },
    cotasPcd: { minAcertosGerais: 10, minAcertosEspecificos: 15, minMediaPonderada: 4.8, minRedacao: 4.0 },
  },
  redacao: {
    tipo: "Texto dissertativo-argumentativo (em prosa), norma-padrão, a partir de textos auxiliares (item 9.51).",
    criterios: [
      { key: "A", nome: "Tema", descricao: "Atendimento ao tema proposto. Fuga completa ao tema = nota 0 total." },
      { key: "B", nome: "Estrutura (gênero/tipo de texto e coerência)", descricao: "Tese clara, macroestrutura (introdução, desenvolvimento e conclusão), objetividade, autonomia do texto, repertório pertinente e argumentos desenvolvidos." },
      { key: "C", nome: "Língua (modalidade e registro)", descricao: "Concordância, regência, ortografia, acentuação, pontuação, precisão vocabular e formalidade." },
      { key: "D", nome: "Coesão", descricao: "Recursos coesivos (anáforas, catáforas, substituições, conjunções), paragrafação adequada, sem monobloco nem repetição excessiva." },
    ],
    notaZero: [
      "Fugir ao tema e/ou gênero propostos",
      "Apresentar nome, rubrica, assinatura, sinal, iniciais ou marcas que identifiquem o candidato",
      "Estar em branco",
      "Texto não articulado verbalmente (apenas desenhos, números e/ou palavras soltas)",
      "Escrita em outra língua que não a portuguesa",
      "Predominantemente ilegível",
      "Texto definitivo fora do espaço reservado",
      "7 linhas ou menos (sem contar o título)",
      "Menos de 8 linhas autorais contínuas ou predominância de cópia/plágio",
      "Idêntica ou muito semelhante a outra(s) redação(ões)",
      "Formas propositais de anulação (impropérios, trechos jocosos, recusa explícita)",
    ],
    observacoes: [
      "Redações com 20 linhas ou menos não alcançam a nota máxima nos critérios C e D; com 15 linhas ou menos perdem 1 ponto em C e D (9.54.4).",
      "O título não é considerado na avaliação (9.54.3).",
      "Não é necessário elaborar proposta de intervenção (9.54.6).",
      "Repertório só vale se concatenado com o tema e a tese (9.54.7).",
      "Uso de 1ª pessoa do singular e de 2ª pessoa pode ser penalizado; evite referências diretas à proposta (\"como afirma o texto I\").",
      "Cada redação é avaliada por dois examinadores independentes (9.54.1).",
    ],
  },
  sources: [
    "Edital nº 01/2026, itens 8.1, 8.2, 9.51–9.54, 10.1–10.5, 12.1–12.2, 13.2–13.3",
    "Edital nº 02/2026 (retificação do item 8.1: peso 1 para a prova discursiva)",
  ],
};
