import { q } from "./helpers";

/** Questões autorais — Conhecimentos Específicos, cargo 006 (Desenvolvimento de Sistemas de Informação). */
export const QUESTIONS_DEV = [
  // ───────── Fundamentos de programação e estruturas de dados ─────────
  q("DEV-001", "dev-complexidade", 1, "A busca binária em um vetor ordenado de n elementos possui, no pior caso, complexidade de tempo:", [
    ["O(1)", "Tempo constante só ocorreria com acesso direto por índice conhecido."],
    ["O(log n)", "Correta: a cada passo o intervalo de busca é dividido pela metade."],
    ["O(n)", "Complexidade da busca sequencial."],
    ["O(n log n)", "Complexidade típica de ordenações eficientes (merge sort)."],
    ["O(n²)", "Complexidade de ordenações simples no pior caso (bubble sort)."],
  ], 1, "Como o espaço de busca cai pela metade a cada comparação, são necessárias no máximo ⌊log₂ n⌋ + 1 comparações.", "Cormen et al. Algoritmos: Teoria e Prática — busca binária."),

  q("DEV-002", "dev-estruturas-dados", 1, "Em uma pilha inicialmente vazia são executadas as operações: push(10), push(20), push(30), pop(), push(40), pop(), pop(). O elemento que permanece na pilha é:", [
    ["10", "Correta: após push 10,20,30 → pop remove 30 → push 40 → pop remove 40 → pop remove 20; resta 10."],
    ["20", "O 20 é removido pelo último pop."],
    ["30", "O 30 é o primeiro removido."],
    ["40", "O 40 é removido logo após ser inserido."],
    ["A pilha fica vazia.", "Foram 4 inserções e 3 remoções; resta um elemento."],
  ], 0, "Pilha segue LIFO (Last In, First Out): o último elemento inserido é o primeiro removido.", "Estruturas de dados — pilhas (LIFO)."),

  q("DEV-003", "dev-estruturas-dados", 1, "A estrutura de dados em que o primeiro elemento inserido é o primeiro a ser removido, usada, por exemplo, para filas de impressão, é a:", [
    ["pilha", "Pilha é LIFO."],
    ["fila", "Correta: fila é FIFO (First In, First Out)."],
    ["árvore binária", "Árvores organizam dados hierarquicamente."],
    ["tabela hash", "Tabelas hash mapeiam chaves a posições."],
    ["grafo", "Grafos representam relações entre vértices."],
  ], 1, "Filas seguem a política FIFO: inserção no final (enqueue) e remoção no início (dequeue).", "Estruturas de dados — filas (FIFO)."),

  q("DEV-004", "dev-estruturas-dados", 2, "Sobre tabelas de espalhamento (hash), é correto afirmar:", [
    ["A busca é sempre O(log n), independentemente da função hash.", "Em média a busca é O(1); O(log n) é típico de árvores balanceadas."],
    ["Colisões são impossíveis quando a tabela tem tamanho primo.", "Tamanho primo reduz, mas não elimina colisões."],
    ["Em média, inserção e busca têm custo O(1), podendo degradar para O(n) quando há muitas colisões.", "Correta: o desempenho depende da qualidade da função hash e do fator de carga."],
    ["Os elementos ficam armazenados em ordem crescente de chave.", "Tabelas hash não preservam ordem."],
    ["Encadeamento separado é uma técnica para ordenar as chaves.", "Encadeamento é técnica de tratamento de colisões."],
  ], 2, "Tratamento de colisões: encadeamento separado ou endereçamento aberto (sondagem linear/quadrática, hash duplo).", "Cormen et al. — tabelas de espalhamento."),

  q("DEV-005", "dev-estruturas-dados", 2, "Em uma árvore binária de busca, o percurso que visita os nós em ordem crescente de chave é o:", [
    ["pré-ordem (raiz, esquerda, direita)", "Visita a raiz antes das subárvores."],
    ["em ordem (esquerda, raiz, direita)", "Correta: o percurso in-order de uma BST produz as chaves ordenadas."],
    ["pós-ordem (esquerda, direita, raiz)", "Visita a raiz por último."],
    ["em largura (nível a nível)", "Visita por níveis, sem garantir ordenação."],
    ["aleatório", "Não é um percurso definido."],
  ], 1, "Na BST, chaves menores ficam à esquerda e maiores à direita; o percurso em ordem as visita ordenadamente.", "Estruturas de dados — árvores binárias de busca."),

  q("DEV-006", "dev-logica", 1, "Considere a função recursiva em pseudocódigo:\n\n```\nfuncao f(n)\n  se n <= 1 entao retorne 1\n  retorne n * f(n - 1)\n```\n\nO valor retornado por f(4) é:", [
    ["4", "Seria o retorno se não houvesse recursão."],
    ["10", "Seria a soma 4+3+2+1."],
    ["16", "Seria 4²."],
    ["24", "Correta: 4 × 3 × 2 × 1 = 24 (fatorial)."],
    ["120", "Seria f(5)."],
  ], 3, "A função calcula o fatorial: f(4) = 4·f(3) = 4·3·f(2) = 4·3·2·f(1) = 24.", "Lógica de programação — recursão."),

  q("DEV-007", "dev-poo-conceitos", 1, "Em Programação Orientada a Objetos, a capacidade de uma subclasse fornecer implementação própria para um método herdado, de modo que a chamada correta seja decidida em tempo de execução, caracteriza o(a):", [
    ["encapsulamento", "Encapsulamento é ocultar o estado interno e expor uma interface."],
    ["polimorfismo (por sobrescrita)", "Correta: sobrescrita (override) com ligação dinâmica."],
    ["abstração", "Abstração é modelar apenas características essenciais."],
    ["sobrecarga de construtores", "Sobrecarga é polimorfismo estático, resolvido em compilação."],
    ["composição", "Composição é relação \"tem-um\" entre objetos."],
  ], 1, "Polimorfismo de subtipo: uma referência do tipo da superclasse executa a implementação do objeto concreto (dynamic dispatch).", "Conceitos de POO — polimorfismo."),

  q("DEV-008", "dev-poo-conceitos", 1, "Sobre classes abstratas, é correto afirmar:", [
    ["Podem ser instanciadas diretamente com o operador new.", "Classes abstratas não podem ser instanciadas."],
    ["Não podem conter métodos concretos.", "Podem ter métodos concretos e abstratos."],
    ["Não podem ser instanciadas e podem declarar métodos abstratos que devem ser implementados pelas subclasses concretas.", "Correta."],
    ["São equivalentes a interfaces em todas as linguagens.", "Diferem, por exemplo, quanto a estado e herança múltipla."],
    ["Impedem a herança.", "Existem justamente para serem herdadas."],
  ], 2, "Classe abstrata define comportamento comum e contratos parciais; subclasses concretas implementam os métodos abstratos.", "Conceitos de POO — abstração."),

  // ───────── Linguagens ─────────
  q("DEV-009", "dev-java", 2, "Considere o trecho em Java:\n\n```java\nString a = new String(\"trf3\");\nString b = new String(\"trf3\");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\n```\n\nA saída é:", [
    ["true e true", "== compara referências; são dois objetos distintos."],
    ["false e true", "Correta: == compara referências (objetos diferentes) e equals compara conteúdo."],
    ["true e false", "equals compara conteúdo, que é igual."],
    ["false e false", "equals retorna true para conteúdos iguais."],
    ["Erro de compilação", "O código é válido."],
  ], 1, "Em Java, == em objetos compara identidade (referência); equals (sobrescrito em String) compara o conteúdo.", "Java SE API — String.equals; JLS, operadores de igualdade."),

  q("DEV-010", "dev-java", 2, "A partir do Java 8, as interfaces passaram a permitir:", [
    ["atributos de instância mutáveis.", "Atributos de interface continuam sendo constantes (public static final)."],
    ["métodos default e métodos estáticos com implementação.", "Correta: Java 8 introduziu default methods e static methods em interfaces."],
    ["construtores.", "Interfaces não possuem construtores."],
    ["herança múltipla de classes.", "Java não permite herança múltipla de classes."],
    ["modificador private em atributos de instância.", "Interfaces não têm atributos de instância."],
  ], 1, "Default methods permitem evoluir interfaces sem quebrar implementações existentes (ex.: Collection.stream()).", "Java Language Specification — interfaces (Java SE 8+)."),

  q("DEV-011", "dev-csharp", 2, "Em C#, a instrução `using (var conexao = new SqlConnection(cs)) { ... }` garante que:", [
    ["o namespace System.Data seja importado.", "A diretiva using de namespace é outra construção."],
    ["o método Dispose do objeto seja chamado ao final do bloco, mesmo se ocorrer exceção.", "Correta: a instrução using funciona como try/finally para objetos IDisposable."],
    ["a conexão seja compartilhada entre threads.", "Não trata de concorrência."],
    ["a variável seja global.", "O escopo da variável é o próprio bloco."],
    ["o objeto não seja coletado pelo garbage collector.", "Não impede a coleta; apenas libera recursos de forma determinística."],
  ], 1, "A instrução using garante a liberação de recursos não gerenciados (conexões, arquivos) de objetos que implementam IDisposable.", "Microsoft Learn — instrução using (C#)."),

  q("DEV-012", "dev-php", 2, "Assinale o recurso introduzido na versão 8.0 da linguagem PHP.", [
    ["Namespaces", "Introduzidos no PHP 5.3."],
    ["Traits", "Introduzidas no PHP 5.4."],
    ["Operador nullsafe (?->) e expressão match", "Correta: ambos chegaram no PHP 8.0, junto com named arguments, union types e JIT."],
    ["Generators (yield)", "Introduzidos no PHP 5.5."],
    ["Sintaxe curta de arrays []", "Introduzida no PHP 5.4."],
  ], 2, "PHP 8.0 trouxe: named arguments, union types, match, nullsafe operator, constructor property promotion, attributes e JIT.", "php.net — PHP 8.0 Release Announcement."),

  q("DEV-013", "dev-python", 1, "Qual é o resultado da expressão Python `[x * 2 for x in range(3)]`?", [
    ["[2, 4, 6]", "range(3) começa em 0."],
    ["[0, 2, 4]", "Correta: range(3) gera 0, 1, 2; multiplicados por 2 resultam 0, 2, 4."],
    ["[0, 1, 2, 0, 1, 2]", "Isso seria list(range(3)) * 2."],
    ["[0, 2, 4, 6]", "range(3) não inclui o 3."],
    ["Erro de sintaxe", "List comprehension é sintaxe válida."],
  ], 1, "List comprehension cria listas a partir de iteráveis: [expressão for item in iterável if condição].", "Python Docs — List Comprehensions."),

  q("DEV-014", "dev-python", 1, "Em Python, o tipo de dado sequencial IMUTÁVEL é:", [
    ["list", "Listas são mutáveis."],
    ["dict", "Dicionários são mutáveis."],
    ["set", "Conjuntos (set) são mutáveis."],
    ["tuple", "Correta: tuplas são imutáveis."],
    ["bytearray", "bytearray é mutável."],
  ], 3, "Tipos imutáveis: int, float, str, tuple, frozenset, bytes. Mutáveis: list, dict, set, bytearray.", "Python Docs — Data model / Built-in Types."),

  q("DEV-015", "dev-javascript", 3, "Considere o código JavaScript:\n\n```js\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);\n```\n\nA ordem de impressão é:", [
    ["1, 2, 3, 4", "setTimeout e then são assíncronos."],
    ["1, 4, 2, 3", "Microtarefas (Promises) executam antes de macrotarefas (timers)."],
    ["1, 4, 3, 2", "Correta: código síncrono (1, 4), depois a fila de microtarefas (3) e, por fim, a de macrotarefas (2)."],
    ["1, 3, 4, 2", "O then só executa após o término do código síncrono."],
    ["4, 3, 2, 1", "O código síncrono executa em ordem."],
  ], 2, "Event loop: pilha síncrona → microtask queue (Promises) → macrotask queue (setTimeout).", "MDN Web Docs — Event loop; Using microtasks."),

  q("DEV-016", "dev-javascript", 1, "Em JavaScript, a diferença entre os operadores `==` e `===` é que:", [
    ["=== compara apenas tipos.", "Compara valor e tipo."],
    ["== não realiza conversão de tipos.", "== realiza coerção de tipos."],
    ["=== compara valor e tipo, sem coerção; == aplica coerção de tipos antes de comparar.", "Correta: por isso 0 == \"0\" é true e 0 === \"0\" é false."],
    ["São equivalentes desde o ES6.", "Continuam diferentes."],
    ["=== só pode ser usado com números.", "Funciona com quaisquer tipos."],
  ], 2, "Recomenda-se usar === (igualdade estrita) para evitar resultados inesperados da coerção.", "MDN Web Docs — Equality comparisons and sameness."),

  q("DEV-017", "dev-typescript", 2, "Em TypeScript, sobre o tipo `unknown`, é correto afirmar que:", [
    ["desativa a checagem de tipos, assim como any.", "unknown é a alternativa segura ao any."],
    ["exige estreitamento (narrowing) — por exemplo, com typeof — antes de usar operações específicas do valor.", "Correta."],
    ["só pode receber valores null.", "Aceita qualquer valor."],
    ["é convertido em string na compilação.", "Tipos são apagados na compilação."],
    ["é equivalente a never.", "never representa ausência de valor possível."],
  ], 1, "unknown aceita qualquer valor, mas o compilador impede seu uso até que o tipo seja verificado.", "TypeScript Handbook — unknown."),

  // ───────── Frameworks ─────────
  q("DEV-018", "dev-spring-boot", 2, "No Spring Boot, a anotação `@SpringBootApplication` combina:", [
    ["@Entity, @Table e @Id", "São anotações JPA."],
    ["@Configuration, @EnableAutoConfiguration e @ComponentScan", "Correta."],
    ["@RestController, @RequestMapping e @ResponseBody", "São anotações do Spring MVC."],
    ["@Service, @Repository e @Component", "São estereótipos de componentes."],
    ["@Transactional, @Async e @Scheduled", "São anotações de comportamento."],
  ], 1, "@SpringBootApplication habilita configuração Java, autoconfiguração baseada no classpath e varredura de componentes no pacote da classe.", "Spring Boot Reference Documentation — Using the @SpringBootApplication Annotation."),

  q("DEV-019", "dev-spring-framework", 2, "No Spring Framework, o escopo padrão de um bean é:", [
    ["prototype", "Cria nova instância a cada solicitação; não é o padrão."],
    ["request", "Válido apenas em contexto web."],
    ["session", "Válido apenas em contexto web."],
    ["singleton", "Correta: uma única instância por contêiner IoC."],
    ["application", "Escopo web associado ao ServletContext."],
  ], 3, "Por padrão, o contêiner cria uma única instância compartilhada de cada bean (singleton).", "Spring Framework Reference — Bean Scopes."),

  q("DEV-020", "dev-django", 2, "O Django segue o padrão arquitetural MTV. Nesse padrão:", [
    ["a View é o arquivo HTML apresentado ao usuário.", "Em Django, o HTML fica no Template."],
    ["o Model define os dados, o Template a apresentação e a View a lógica que processa a requisição e devolve a resposta.", "Correta."],
    ["o Template acessa diretamente o banco de dados.", "O acesso a dados ocorre via Models/ORM."],
    ["não há separação entre dados e apresentação.", "MTV separa as responsabilidades."],
    ["o Controller é escrito pelo desenvolvedor em cada app.", "O framework faz o papel de controller (URLconf)."],
  ], 1, "Em Django: Model (dados/ORM), Template (apresentação) e View (lógica). O roteamento (urls.py) e o próprio framework atuam como controller.", "Django Documentation — FAQ: Django appears to be a MVC framework…"),

  q("DEV-021", "dev-nodejs", 1, "Sobre o Node.js, é correto afirmar que:", [
    ["executa JavaScript apenas no navegador.", "Node.js executa JavaScript no servidor."],
    ["utiliza modelo de E/S não bloqueante orientado a eventos, com um event loop principal.", "Correta."],
    ["cria uma nova thread do sistema operacional para cada requisição HTTP.", "Esse é o modelo de servidores tradicionais; Node usa event loop."],
    ["não possui gerenciador de pacotes.", "Usa npm (entre outros)."],
    ["só permite programação síncrona.", "É fortemente assíncrono."],
  ], 1, "Node.js usa o motor V8 e a biblioteca libuv para E/S assíncrona, adequado a aplicações com muitas operações de rede.", "Node.js Docs — About Node.js; The Node.js Event Loop."),

  q("DEV-022", "dev-react", 2, "Em um componente React, `useEffect(() => { carregarDados(); }, [])` faz com que `carregarDados`:", [
    ["execute a cada renderização.", "Isso ocorreria sem o array de dependências."],
    ["execute apenas uma vez, após a montagem do componente.", "Correta: array de dependências vazio."],
    ["execute antes da primeira renderização.", "Efeitos executam após a renderização."],
    ["nunca execute.", "O efeito executa após a montagem."],
    ["execute somente quando o componente for desmontado.", "Isso seria a função de limpeza retornada pelo efeito."],
  ], 1, "O array de dependências controla quando o efeito reexecuta; vazio = apenas após a montagem (em produção).", "react.dev — useEffect."),

  q("DEV-023", "dev-angular", 2, "Em Angular, a sintaxe `[(ngModel)]=\"nome\"` em um campo de formulário implementa:", [
    ["interpolação", "Interpolação usa {{ }}."],
    ["property binding unidirecional", "Usa apenas [propriedade]."],
    ["event binding", "Usa apenas (evento)."],
    ["two-way data binding", "Correta: combina property binding e event binding (\"banana in a box\")."],
    ["injeção de dependência", "DI é feita via construtor/inject()."],
  ], 3, "[( )] sincroniza o valor da view com a propriedade do componente nos dois sentidos.", "angular.dev — Two-way binding."),

  q("DEV-024", "dev-vue", 2, "Em Vue.js, a diferença entre as diretivas `v-if` e `v-show` é que:", [
    ["v-show remove o elemento do DOM quando falso.", "v-show apenas altera display: none."],
    ["v-if renderiza o elemento condicionalmente (cria/destrói), enquanto v-show mantém o elemento no DOM alternando a propriedade CSS display.", "Correta."],
    ["ambas são idênticas.", "Têm custos e comportamentos diferentes."],
    ["v-if não aceita expressões.", "Aceita expressões JavaScript."],
    ["v-show funciona com <template>.", "v-show não funciona em <template>."],
  ], 1, "v-if tem maior custo de alternância; v-show tem maior custo inicial. Use v-show para alternâncias frequentes.", "Vue.js Guide — Conditional Rendering (v-if vs. v-show)."),

  q("DEV-025", "dev-html5", 1, "Assinale o elemento considerado obsoleto (não conforme) no HTML5.", [
    ["<nav>", "Elemento semântico do HTML5."],
    ["<article>", "Elemento semântico do HTML5."],
    ["<section>", "Elemento semântico do HTML5."],
    ["<font>", "Correta: elemento de apresentação obsoleto; a estilização deve ser feita com CSS."],
    ["<main>", "Elemento semântico do HTML5."],
  ], 3, "O HTML5 privilegia semântica; elementos puramente visuais como <font> e <center> são obsoletos.", "HTML Living Standard (WHATWG) — Obsolete features."),

  q("DEV-026", "dev-css3", 2, "Com `box-sizing: border-box`, a largura (width) declarada de um elemento:", [
    ["inclui apenas o conteúdo.", "Esse é o comportamento de content-box (padrão)."],
    ["inclui conteúdo, padding e borda.", "Correta."],
    ["inclui conteúdo, padding, borda e margem.", "A margem nunca entra no cálculo de width."],
    ["é ignorada pelo navegador.", "A largura é respeitada."],
    ["inclui apenas a borda.", "Não corresponde ao modelo de caixa."],
  ], 1, "border-box facilita layouts: padding e border são subtraídos da largura declarada.", "MDN Web Docs — box-sizing."),

  // ───────── ORM e APIs ─────────
  q("DEV-027", "dev-jpa", 3, "Segundo a especificação JPA, o tipo de carregamento (fetch) padrão das associações @ManyToOne e @OneToMany é, respectivamente:", [
    ["LAZY e LAZY", "@ManyToOne é EAGER por padrão."],
    ["EAGER e LAZY", "Correta: associações *ToOne são EAGER; *ToMany são LAZY."],
    ["LAZY e EAGER", "Inverte os padrões."],
    ["EAGER e EAGER", "@OneToMany é LAZY por padrão."],
    ["Não há padrão definido.", "A especificação define os padrões."],
  ], 1, "Padrões: @OneToOne e @ManyToOne → EAGER; @OneToMany e @ManyToMany → LAZY. Recomenda-se avaliar LAZY também em *ToOne por desempenho.", "Jakarta Persistence Specification — Fetch defaults."),

  q("DEV-028", "dev-hibernate", 2, "No Hibernate, o cache de primeiro nível:", [
    ["é compartilhado entre todas as sessões da aplicação.", "Esse é o cache de segundo nível."],
    ["está associado à Session (EntityManager) e é habilitado por padrão.", "Correta."],
    ["precisa de provedor externo como Ehcache para funcionar.", "Provedores externos são usados no cache de segundo nível."],
    ["armazena resultados de consultas HQL entre execuções do servidor.", "Seria o query cache, opcional."],
    ["não pode ser limpo.", "Pode ser limpo com clear() ou evict()."],
  ], 1, "O cache L1 garante que, dentro da mesma sessão, a mesma entidade seja carregada uma única vez (identidade).", "Hibernate ORM User Guide — Caching."),

  q("DEV-029", "dev-ef-core", 2, "No Entity Framework Core, o comando da CLI que cria uma nova migração a partir das alterações no modelo é:", [
    ["dotnet ef database drop", "Remove o banco de dados."],
    ["dotnet ef migrations add NomeDaMigracao", "Correta."],
    ["dotnet build --migrate", "Opção inexistente."],
    ["dotnet ef dbcontext scaffold", "Faz engenharia reversa de um banco existente."],
    ["dotnet run migrations", "Comando inexistente."],
  ], 1, "Fluxo típico: dotnet ef migrations add X → dotnet ef database update.", "Microsoft Learn — EF Core Migrations Overview."),

  q("DEV-030", "dev-doctrine", 2, "O Doctrine ORM, utilizado em PHP, implementa principalmente o padrão:", [
    ["Active Record", "Padrão usado pelo Eloquent (Laravel)."],
    ["Data Mapper, com o EntityManager responsável pela persistência", "Correta."],
    ["Singleton", "Não é padrão de persistência."],
    ["Observer", "Não é padrão de persistência."],
    ["Table Module", "Não é o padrão adotado."],
  ], 1, "No Data Mapper as entidades são objetos simples; a persistência fica a cargo do EntityManager e da Unit of Work.", "Doctrine ORM Documentation — Getting Started / Architecture."),

  q("DEV-031", "dev-rest", 1, "Em uma API RESTful, o método HTTP que NÃO é idempotente é:", [
    ["GET", "Idempotente e seguro."],
    ["PUT", "Idempotente: repetir a mesma requisição produz o mesmo estado."],
    ["DELETE", "Idempotente."],
    ["POST", "Correta: requisições repetidas podem criar múltiplos recursos."],
    ["HEAD", "Idempotente e seguro."],
  ], 3, "RFC 9110: GET, HEAD, OPTIONS, TRACE, PUT e DELETE são idempotentes; POST e PATCH, em geral, não.", "RFC 9110 — HTTP Semantics, seção 9.2.2."),

  q("DEV-032", "dev-rest", 2, "Um cliente autenticado tenta acessar um recurso para o qual não possui permissão. O código de status HTTP mais adequado é:", [
    ["200 OK", "Indica sucesso."],
    ["201 Created", "Indica criação de recurso."],
    ["401 Unauthorized", "Indica ausência/invalidade de autenticação."],
    ["403 Forbidden", "Correta: o servidor entendeu a requisição, mas recusa autorizá-la."],
    ["500 Internal Server Error", "Indica erro no servidor."],
  ], 3, "401 = credenciais ausentes/inválidas; 403 = identidade conhecida, mas sem permissão.", "RFC 9110 — 401 e 403."),

  q("DEV-033", "dev-graphql", 2, "Sobre GraphQL, é correto afirmar:", [
    ["Cada recurso possui um endpoint diferente, como no REST.", "Em geral há um único endpoint."],
    ["O cliente especifica na consulta exatamente os campos de que precisa, e operações de escrita são feitas por mutations.", "Correta."],
    ["Só funciona com bancos de dados de grafos.", "É independente da fonte de dados."],
    ["Não possui sistema de tipos.", "Possui schema fortemente tipado (SDL)."],
    ["Substitui obrigatoriamente o protocolo HTTP.", "Normalmente trafega sobre HTTP."],
  ], 1, "GraphQL evita over-fetching e under-fetching; tipos de operação: query, mutation e subscription.", "graphql.org — Learn."),

  q("DEV-034", "dev-openapi", 1, "A OpenAPI Specification (antiga Swagger Specification) é:", [
    ["um framework de testes de carga.", "Não é ferramenta de carga."],
    ["um formato padronizado, em YAML ou JSON, para descrever APIs HTTP, utilizado por ferramentas como Swagger UI para gerar documentação interativa.", "Correta."],
    ["um protocolo de mensageria assíncrona.", "Não é protocolo de mensageria."],
    ["um servidor de aplicação Java.", "Não é servidor."],
    ["uma linguagem de consulta a bancos de dados.", "Não é linguagem de consulta."],
  ], 1, "A OpenAPI descreve endpoints, parâmetros, esquemas e autenticação, permitindo gerar documentação, clientes e mocks.", "OpenAPI Initiative — OpenAPI Specification."),

  // ───────── PJe / PDPJ ─────────
  q("DEV-035", "dev-jsf", 3, "O ciclo de vida de uma requisição JSF (JavaServer Faces) começa pela fase:", [
    ["Render Response", "É a última fase."],
    ["Restore View", "Correta: a árvore de componentes é restaurada ou criada."],
    ["Invoke Application", "É a quinta fase."],
    ["Process Validations", "É a terceira fase."],
    ["Update Model Values", "É a quarta fase."],
  ], 1, "Fases: Restore View → Apply Request Values → Process Validations → Update Model Values → Invoke Application → Render Response.", "Jakarta Faces Specification — Request Processing Lifecycle."),

  q("DEV-036", "dev-primefaces", 2, "No contexto do desenvolvimento do PJe, a tecnologia PrimeFaces é:", [
    ["um servidor de aplicação Jakarta EE.", "Servidores são WildFly, Payara etc."],
    ["uma biblioteca de componentes de interface para JSF, com suporte a AJAX (ex.: atributo update em p:commandButton).", "Correta."],
    ["um ORM para Java.", "ORMs são Hibernate, EclipseLink."],
    ["uma ferramenta de build.", "Ferramentas de build são Maven e Gradle."],
    ["um framework JavaScript independente do Java.", "É usado em aplicações JSF."],
  ], 1, "PrimeFaces fornece dezenas de componentes ricos (DataTable, Dialog, Calendar) e integração AJAX para JSF.", "PrimeFaces Documentation."),

  q("DEV-037", "dev-maven", 2, "No Maven, a execução de `mvn install`:", [
    ["publica o artefato em repositório remoto.", "Isso é a fase deploy."],
    ["executa as fases anteriores do ciclo (validate, compile, test, package, verify) e copia o artefato para o repositório local (~/.m2).", "Correta."],
    ["apenas compila o código-fonte.", "Seria mvn compile."],
    ["remove o diretório target.", "Seria mvn clean."],
    ["cria um novo projeto a partir de um arquétipo.", "Seria mvn archetype:generate."],
  ], 1, "Executar uma fase executa todas as fases anteriores do ciclo de vida default.", "Apache Maven — Introduction to the Build Lifecycle."),

  q("DEV-038", "dev-tomcat", 2, "Sobre servidores de aplicação, é correto afirmar:", [
    ["O Apache Tomcat é um servidor Jakarta EE completo, equivalente ao WildFly.", "Tomcat implementa principalmente Servlet, JSP, EL e WebSocket."],
    ["O WildFly (base do JBoss EAP) é um servidor de aplicação Jakarta EE, enquanto o Tomcat é essencialmente um contêiner de servlets.", "Correta."],
    ["O Nginx é um servidor de aplicação Java.", "Nginx é servidor web/proxy reverso."],
    ["O JBoss EAP não suporta EJB.", "Suporta a plataforma Jakarta EE."],
    ["O Tomcat não pode executar aplicações Spring Boot.", "Spring Boot usa Tomcat embarcado por padrão."],
  ], 1, "Escolha do servidor depende das APIs Jakarta EE necessárias (EJB, JMS, JTA etc.).", "Documentações Apache Tomcat e WildFly."),

  q("DEV-039", "dev-nginx", 2, "No Nginx, a diretiva usada para encaminhar requisições a um servidor de aplicação (proxy reverso) é:", [
    ["root", "Define diretório de arquivos estáticos."],
    ["proxy_pass", "Correta."],
    ["listen", "Define porta/endereço de escuta."],
    ["server_name", "Define nomes de host do bloco server."],
    ["include", "Inclui outros arquivos de configuração."],
  ], 1, "Ex.: location /api { proxy_pass http://backend:8080; } — com upstream é possível balancear carga.", "nginx.org — ngx_http_proxy_module."),

  q("DEV-040", "dev-eureka", 2, "Na arquitetura de microsserviços com Spring Cloud Netflix, o Eureka cumpre o papel de:", [
    ["API Gateway", "Papel do Zuul/Spring Cloud Gateway."],
    ["Circuit breaker", "Papel do Hystrix/Resilience4j."],
    ["Service registry (registro e descoberta de serviços)", "Correta."],
    ["Broker de mensagens", "Papel de RabbitMQ/Kafka."],
    ["Servidor de identidade", "Papel do Keycloak."],
  ], 2, "Instâncias se registram no Eureka Server e clientes consultam o registro para localizar serviços dinamicamente.", "Spring Cloud Netflix — Service Discovery: Eureka."),

  q("DEV-041", "dev-zuul", 2, "O Zuul, no ecossistema Netflix/Spring Cloud, é um:", [
    ["banco de dados em memória.", "Seria o Redis."],
    ["API Gateway, ponto de entrada único que roteia requisições aos microsserviços e aplica filtros.", "Correta."],
    ["orquestrador de contêineres.", "Seria o Kubernetes."],
    ["motor de workflow.", "Seria o jBPM."],
    ["service registry.", "Seria o Eureka."],
  ], 1, "Gateways concentram roteamento, autenticação, rate limiting e logs na borda do sistema.", "Spring Cloud Netflix — Router and Filter: Zuul."),

  q("DEV-042", "dev-hystrix", 2, "No padrão circuit breaker implementado pelo Hystrix, quando a taxa de falhas ultrapassa o limite configurado, o circuito:", [
    ["fecha, permitindo todas as chamadas.", "Fechado é o estado normal."],
    ["abre, e as chamadas passam a falhar rapidamente (fail fast), podendo acionar um fallback.", "Correta."],
    ["reinicia o microsserviço remoto.", "Não reinicia serviços."],
    ["duplica as instâncias automaticamente.", "Não faz escalonamento."],
    ["armazena as requisições para reenvio posterior.", "Não é fila de mensagens."],
  ], 1, "Estados: fechado (normal), aberto (falha rápida) e semiaberto (testa recuperação).", "Netflix Hystrix Wiki — How it Works."),

  q("DEV-043", "dev-envers", 2, "O Hibernate Envers (usado, por exemplo, via Spring Data Envers) tem como finalidade:", [
    ["gerar telas CRUD automaticamente.", "Não gera interfaces."],
    ["auditar e versionar entidades, registrando o histórico de revisões em tabelas de auditoria.", "Correta."],
    ["balancear carga entre bancos.", "Não é balanceador."],
    ["criptografar colunas sensíveis.", "Não é ferramenta de criptografia."],
    ["substituir o Flyway nas migrações.", "Não trata de migrações de esquema."],
  ], 1, "Entidades anotadas com @Audited têm cada alteração registrada (tabelas *_AUD e REVINFO), permitindo consultar versões anteriores.", "Hibernate ORM User Guide — Envers."),

  q("DEV-044", "dev-rabbitmq", 2, "No RabbitMQ (protocolo AMQP 0-9-1), o tipo de exchange que entrega a mensagem a TODAS as filas a ele vinculadas, ignorando a routing key, é:", [
    ["direct", "Entrega conforme correspondência exata da routing key."],
    ["topic", "Entrega conforme padrões da routing key."],
    ["fanout", "Correta: broadcast para todas as filas vinculadas."],
    ["headers", "Roteia pelos cabeçalhos da mensagem."],
    ["default", "Exchange direct sem nome."],
  ], 2, "Tipos de exchange: direct, fanout, topic e headers.", "RabbitMQ Docs — AMQP 0-9-1 Model Explained."),

  q("DEV-045", "dev-kafka", 3, "No Apache Kafka, a ordem das mensagens é garantida:", [
    ["em todo o tópico, independentemente das partições.", "Não há ordenação global entre partições."],
    ["apenas dentro de cada partição.", "Correta."],
    ["somente quando há um único consumidor no cluster.", "A garantia é por partição."],
    ["nunca, pois Kafka é um sistema sem ordenação.", "Há ordenação por partição (offsets)."],
    ["apenas para mensagens sem chave.", "Mensagens com a mesma chave vão para a mesma partição, preservando sua ordem."],
  ], 1, "Em um grupo de consumidores, cada partição é consumida por um único consumidor, preservando a ordem dos offsets.", "Apache Kafka Documentation — Introduction / Design."),

  q("DEV-046", "dev-redis", 1, "O Redis, quando utilizado como cache em memória, permite definir tempo de expiração para chaves por meio do comando:", [
    ["EXPIRE", "Correta: define o TTL da chave em segundos."],
    ["COMMIT", "Comando inexistente no Redis."],
    ["DROP", "Comando SQL, não do Redis."],
    ["VACUUM", "Comando de manutenção do PostgreSQL."],
    ["TRUNCATE", "Comando SQL."],
  ], 0, "Também é possível usar SET chave valor EX segundos. O TTL restante é consultado com TTL chave.", "Redis Docs — EXPIRE."),

  q("DEV-047", "dev-keycloak-sso", 2, "O Keycloak é uma solução de gerenciamento de identidade e acesso que:", [
    ["implementa protocolos como OpenID Connect, OAuth 2.0 e SAML 2.0, permitindo Single Sign-On entre aplicações.", "Correta."],
    ["armazena exclusivamente arquivos estáticos.", "Não é servidor de arquivos."],
    ["substitui o banco de dados relacional da aplicação.", "Não é SGBD."],
    ["só funciona com aplicações PHP.", "É agnóstico de linguagem."],
    ["dispensa o uso de tokens.", "Emite tokens (ex.: JWT de acesso e de ID)."],
  ], 0, "No Keycloak, realms agrupam usuários, clientes e papéis; aplicações delegam a autenticação e recebem tokens.", "Keycloak Documentation — Server Administration Guide."),

  // ───────── Engenharia de software ─────────
  q("DEV-048", "dev-solid", 2, "O princípio SOLID segundo o qual \"módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações\" é o:", [
    ["Single Responsibility Principle", "Trata de ter um único motivo para mudar."],
    ["Open/Closed Principle", "Trata de estar aberto para extensão e fechado para modificação."],
    ["Liskov Substitution Principle", "Trata da substituibilidade de subtipos."],
    ["Interface Segregation Principle", "Trata de interfaces específicas para cada cliente."],
    ["Dependency Inversion Principle", "Correta."],
  ], 4, "DIP favorece injeção de dependência e desacoplamento por meio de interfaces.", "Martin, R. C. Agile Software Development: Principles, Patterns, and Practices."),

  q("DEV-049", "dev-design-patterns", 2, "O padrão de projeto que define uma dependência um-para-muitos entre objetos, de modo que, quando um objeto muda de estado, todos os seus dependentes são notificados, é o:", [
    ["Singleton", "Garante instância única."],
    ["Observer", "Correta."],
    ["Adapter", "Converte interfaces incompatíveis."],
    ["Factory Method", "Delega a criação de objetos a subclasses."],
    ["Decorator", "Adiciona responsabilidades dinamicamente."],
  ], 1, "Observer é comportamental e base de mecanismos de eventos e programação reativa.", "Gamma et al. Padrões de Projeto (GoF)."),

  q("DEV-050", "dev-clean-architecture", 2, "Na Clean Architecture, a \"regra da dependência\" estabelece que:", [
    ["as camadas internas devem conhecer detalhes de frameworks e banco de dados.", "É o oposto da regra."],
    ["as dependências do código-fonte devem apontar apenas para dentro, em direção às regras de negócio (entidades e casos de uso).", "Correta."],
    ["a interface do usuário é o núcleo da aplicação.", "A UI é detalhe externo."],
    ["o banco de dados define as entidades de domínio.", "O banco é detalhe de infraestrutura."],
    ["não deve haver interfaces entre camadas.", "Interfaces (portas) são usadas para inverter dependências."],
  ], 1, "Círculos concêntricos: entidades → casos de uso → adaptadores de interface → frameworks e drivers.", "Martin, R. C. Arquitetura Limpa."),

  q("DEV-051", "dev-clean-code", 1, "Segundo as práticas de Clean Code, é recomendável que funções:", [
    ["sejam longas para reduzir o número de chamadas.", "Funções devem ser pequenas."],
    ["sejam pequenas, façam uma única coisa e tenham nomes que revelem sua intenção.", "Correta."],
    ["usem comentários para explicar nomes obscuros.", "Prefira nomes claros a comentários compensatórios."],
    ["recebam o maior número possível de parâmetros booleanos.", "Parâmetros booleanos (flags) indicam que a função faz mais de uma coisa."],
    ["misturem níveis de abstração.", "Deve-se manter um único nível de abstração por função."],
  ], 1, "Código limpo é legível, simples, testável e expressa intenção.", "Martin, R. C. Código Limpo."),

  q("DEV-052", "dev-bpmn", 2, "Na notação BPMN 2.0, o elemento representado por um losango com um \"X\" interno, que direciona o fluxo para exatamente um dos caminhos possíveis, é o:", [
    ["gateway paralelo", "Representado por losango com \"+\"."],
    ["gateway exclusivo", "Correta."],
    ["evento de início", "Representado por círculo de borda simples."],
    ["subprocesso", "Retângulo arredondado com \"+\"."],
    ["gateway inclusivo", "Representado por losango com círculo."],
  ], 1, "Gateway exclusivo (XOR): apenas um caminho é seguido, conforme as condições.", "OMG — BPMN 2.0 Specification."),

  q("DEV-053", "dev-jbpm", 2, "No contexto de modelagem e automação de processos de negócio, o jBPM é:", [
    ["um sistema gerenciador de banco de dados.", "Não é SGBD."],
    ["uma suíte de gerenciamento de processos de negócio, em Java, capaz de executar processos modelados em BPMN 2.0.", "Correta."],
    ["um gerenciador de pacotes JavaScript.", "Não é gerenciador de pacotes."],
    ["um servidor de e-mail.", "Não é servidor de e-mail."],
    ["uma ferramenta de versionamento.", "Não é ferramenta de versionamento."],
  ], 1, "O jBPM integra o ecossistema KIE e permite automatizar workflows com tarefas humanas e regras.", "jBPM Documentation."),

  q("DEV-054", "dev-git", 1, "No Git, o comando que salva temporariamente alterações não commitadas, limpando o diretório de trabalho para que possam ser recuperadas depois, é:", [
    ["git reset --hard", "Descarta as alterações."],
    ["git stash", "Correta: recupere com git stash pop ou apply."],
    ["git clone", "Copia um repositório remoto."],
    ["git tag", "Cria rótulos para commits."],
    ["git fetch", "Baixa objetos e referências do remoto."],
  ], 1, "git stash empilha as alterações; git stash list mostra a pilha.", "Pro Git — Git Tools: Stashing and Cleaning."),

  q("DEV-055", "dev-git", 2, "No modelo Gitflow, uma branch de hotfix é criada a partir da branch:", [
    ["develop, e mesclada apenas em develop.", "Hotfix corrige produção."],
    ["main/master, e ao final mesclada em main/master e em develop.", "Correta."],
    ["feature, e mesclada em release.", "Não corresponde ao fluxo."],
    ["release, e descartada após o deploy.", "Não corresponde ao fluxo."],
    ["main/master, e mesclada apenas em feature.", "Não corresponde ao fluxo."],
  ], 1, "Gitflow: main (produção), develop (integração), feature/*, release/* e hotfix/*.", "Driessen, V. A successful Git branching model (2010)."),

  q("DEV-056", "dev-cicd", 2, "A diferença entre Entrega Contínua (Continuous Delivery) e Implantação Contínua (Continuous Deployment) é que:", [
    ["na Entrega Contínua não há testes automatizados.", "Ambas dependem de testes automatizados."],
    ["na Implantação Contínua toda alteração aprovada no pipeline vai automaticamente para produção, enquanto na Entrega Contínua o software está sempre pronto, mas a liberação em produção depende de decisão manual.", "Correta."],
    ["são sinônimos.", "Diferem quanto à automação da liberação em produção."],
    ["a Implantação Contínua dispensa controle de versão.", "Controle de versão é pré-requisito."],
    ["a Entrega Contínua só se aplica a aplicações móveis.", "Aplica-se a qualquer software."],
  ], 1, "CI integra e testa continuamente; CD (delivery) mantém o software liberável; CD (deployment) libera automaticamente.", "Humble, J.; Farley, D. Entrega Contínua."),

  q("DEV-057", "dev-docker", 2, "Em um Dockerfile, a instrução EXPOSE 8080:", [
    ["publica automaticamente a porta 8080 no host.", "A publicação exige -p/--publish ou ports no compose."],
    ["documenta que o contêiner escuta na porta 8080, sem publicá-la no host.", "Correta."],
    ["abre a porta no firewall do sistema operacional.", "Não altera firewall."],
    ["define a variável de ambiente PORT.", "Variáveis são definidas com ENV."],
    ["impede o uso de outras portas.", "Não impede."],
  ], 1, "Para publicar: docker run -p 8080:8080 imagem.", "Docker Docs — Dockerfile reference: EXPOSE."),

  q("DEV-058", "dev-kubernetes", 2, "No Kubernetes, a menor unidade implantável, que agrupa um ou mais contêineres que compartilham rede e armazenamento, é o:", [
    ["Node", "Node é a máquina do cluster."],
    ["Pod", "Correta."],
    ["Service", "Service expõe um conjunto de Pods."],
    ["Namespace", "Namespace isola recursos logicamente."],
    ["Deployment", "Deployment gerencia ReplicaSets/Pods."],
  ], 1, "Pods são efêmeros; Deployments garantem o número desejado de réplicas e atualizações graduais.", "kubernetes.io — Pods."),

  // ───────── Banco de dados ─────────
  q("DEV-059", "dev-sql", 1, "Assinale o comando SQL classificado como DDL (Data Definition Language).", [
    ["SELECT", "Consulta (DQL/DML)."],
    ["INSERT", "Comando DML (inserção de dados)."],
    ["UPDATE", "Comando DML (alteração de dados)."],
    ["ALTER TABLE", "Correta: altera a estrutura do objeto."],
    ["DELETE", "Comando DML (remoção de linhas)."],
  ], 3, "DDL: CREATE, ALTER, DROP, TRUNCATE. DML: INSERT, UPDATE, DELETE (e SELECT, em muitas classificações).", "ISO/IEC 9075 (SQL) — classificação de comandos."),

  q("DEV-060", "dev-sql", 2, "Na consulta abaixo, a cláusula que filtra os GRUPOS resultantes da agregação é:\n\n```sql\nSELECT vara, COUNT(*) AS total\nFROM processos\nWHERE ano = 2026\nGROUP BY vara\nHAVING COUNT(*) > 100;\n```", [
    ["WHERE", "WHERE filtra linhas antes do agrupamento."],
    ["GROUP BY", "Define os grupos, não os filtra."],
    ["HAVING", "Correta: filtra grupos após a agregação."],
    ["SELECT", "Define as colunas projetadas."],
    ["FROM", "Define a origem dos dados."],
  ], 2, "Ordem lógica: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.", "Documentação PostgreSQL — SELECT (GROUP BY / HAVING)."),

  q("DEV-061", "dev-sql", 2, "O resultado de `A LEFT JOIN B ON A.id = B.a_id` contém:", [
    ["somente as linhas com correspondência em ambas as tabelas.", "Isso é INNER JOIN."],
    ["todas as linhas de A e, quando não houver correspondência em B, as colunas de B com NULL.", "Correta."],
    ["todas as linhas de B, apenas.", "Isso seria RIGHT JOIN."],
    ["o produto cartesiano de A e B.", "Isso é CROSS JOIN."],
    ["apenas as linhas de A sem correspondência em B.", "Seria LEFT JOIN com WHERE B.a_id IS NULL."],
  ], 1, "LEFT (OUTER) JOIN preserva todas as linhas da tabela à esquerda.", "Documentação PostgreSQL — Joined tables."),

  q("DEV-062", "dev-modelagem-der", 2, "Na passagem do modelo conceitual (DER) para o lógico relacional, um relacionamento de cardinalidade N:N entre as entidades Processo e Parte é normalmente implementado por meio de:", [
    ["chave estrangeira em Processo apontando para Parte.", "Representa 1:N, não N:N."],
    ["uma tabela associativa contendo as chaves estrangeiras de Processo e de Parte.", "Correta."],
    ["um atributo multivalorado em Parte.", "Viola a 1ª Forma Normal."],
    ["fusão das duas tabelas.", "Cria redundância e anomalias."],
    ["um índice único em Parte.", "Índices não representam relacionamentos."],
  ], 1, "A tabela associativa (ex.: processo_parte) pode ter atributos próprios (ex.: polo ativo/passivo).", "Heuser, C. A. Projeto de Banco de Dados."),

  q("DEV-063", "dev-modelagem-der", 3, "Uma tabela está na 3ª Forma Normal quando está na 2ª FN e:", [
    ["todos os atributos são multivalorados.", "Atributos multivalorados violam a 1ª FN."],
    ["não há dependências transitivas de atributos não chave em relação à chave primária.", "Correta."],
    ["não há chave primária.", "Toda relação deve ter chave."],
    ["possui apenas uma coluna.", "Não é requisito."],
    ["todas as dependências são parciais.", "Dependências parciais violam a 2ª FN."],
  ], 1, "1FN: valores atômicos; 2FN: sem dependência parcial da chave composta; 3FN: sem dependência transitiva.", "Elmasri & Navathe. Sistemas de Banco de Dados."),

  q("DEV-064", "dev-postgresql", 2, "No PostgreSQL, o tipo de dado JSONB, em comparação ao JSON:", [
    ["armazena o texto exatamente como recebido, preservando espaços e chaves duplicadas.", "Esse é o comportamento do tipo json."],
    ["armazena os dados em formato binário decomposto, permitindo indexação (por exemplo, com índices GIN) e consultas mais eficientes.", "Correta."],
    ["não permite consultas por chave.", "Possui operadores como ->, ->> e @>."],
    ["só aceita arrays.", "Aceita qualquer valor JSON."],
    ["é exclusivo do SQL Server.", "É tipo nativo do PostgreSQL."],
  ], 1, "jsonb tem ingestão um pouco mais lenta, mas processamento e indexação muito mais eficientes.", "PostgreSQL Documentation — JSON Types."),

  q("DEV-065", "dev-sqlserver", 2, "No SQL Server (T-SQL), a cláusula usada para limitar a quantidade de linhas retornadas por um SELECT é:", [
    ["LIMIT", "Usada em PostgreSQL e MySQL."],
    ["TOP", "Correta: SELECT TOP (10) ..."],
    ["ROWNUM", "Pseudocoluna do Oracle."],
    ["FETCH ALL", "Não limita linhas."],
    ["MAXROWS", "Não existe em T-SQL."],
  ], 1, "Além de TOP, o SQL Server aceita OFFSET ... FETCH NEXT n ROWS ONLY com ORDER BY.", "Microsoft Learn — TOP (Transact-SQL)."),

  q("DEV-066", "dev-flyway", 2, "No Flyway, uma migração versionada segue, por padrão, a convenção de nome:", [
    ["migration_001.sql", "Não segue o padrão do Flyway."],
    ["V1__criar_tabela_processo.sql", "Correta: prefixo V, versão, dois sublinhados e descrição."],
    ["R1_criar_tabela.sql", "R__ indica migração repetível (sem versão)."],
    ["1-create.sql", "Não segue o padrão."],
    ["create_table_V1.ddl", "Não segue o padrão."],
  ], 1, "O Flyway registra as migrações aplicadas na tabela flyway_schema_history, com checksum.", "Flyway Documentation — Migrations / Naming."),

  q("DEV-067", "dev-data-warehouse", 2, "No modelo dimensional (esquema estrela), a tabela que armazena as métricas numéricas do negócio, relacionadas às dimensões por chaves estrangeiras, é a tabela:", [
    ["de dimensão", "Armazena atributos descritivos."],
    ["fato", "Correta."],
    ["de staging", "Área temporária do ETL."],
    ["de auditoria", "Não pertence ao modelo dimensional."],
    ["de lookup", "Tabelas auxiliares de consulta."],
  ], 1, "Fatos: medidas (ex.: quantidade de processos distribuídos); Dimensões: contexto (tempo, vara, classe processual).", "Kimball, R. The Data Warehouse Toolkit."),

  q("DEV-068", "dev-olap", 2, "Em ferramentas OLAP, a operação que aumenta o nível de detalhe da análise (por exemplo, de ano para mês) é:", [
    ["roll-up", "Agrega, reduzindo o detalhe."],
    ["drill-down", "Correta."],
    ["slice", "Fixa um valor de uma dimensão."],
    ["pivot", "Rotaciona os eixos da visualização."],
    ["dice", "Seleciona um subcubo com várias dimensões."],
  ], 1, "Drill-down desce na hierarquia; roll-up (drill-up) sobe na hierarquia.", "Inmon/Kimball — operações OLAP."),

  q("DEV-069", "dev-etl", 1, "No contexto de Business Intelligence, a sigla ETL refere-se a:", [
    ["Execução, Teste e Liberação.", "Não se refere a ciclo de software."],
    ["Extração, Transformação e Carga dos dados das fontes para o Data Warehouse.", "Correta."],
    ["Entidade, Tabela e Linha.", "Não é o significado."],
    ["Evento, Tarefa e Lógica.", "Não é o significado."],
    ["Encriptação, Transmissão e Log.", "Não é o significado."],
  ], 1, "No ELT, a transformação ocorre após a carga, no próprio repositório de destino.", "Kimball, R. The Data Warehouse ETL Toolkit."),

  // ───────── Segurança, UX e acessibilidade ─────────
  q("DEV-070", "dev-owasp", 2, "Na lista OWASP Top 10 de 2021, a categoria que ocupa a primeira posição (A01:2021) é:", [
    ["Injeção", "Ficou em A03:2021."],
    ["Quebra de controle de acesso (Broken Access Control)", "Correta."],
    ["Falhas criptográficas", "Ficou em A02:2021."],
    ["Design inseguro", "Ficou em A04:2021."],
    ["Componentes vulneráveis e desatualizados", "Ficou em A06:2021."],
  ], 1, "Broken Access Control subiu da 5ª posição (2017) para a 1ª em 2021.", "OWASP Top 10:2021."),

  q("DEV-071", "dev-owasp", 1, "A medida mais eficaz para prevenir SQL Injection em uma aplicação é:", [
    ["ocultar mensagens de erro do banco.", "Ajuda, mas não previne a injeção."],
    ["usar consultas parametrizadas (prepared statements) ou ORM com parâmetros vinculados.", "Correta."],
    ["concatenar strings com aspas duplas.", "Concatenação é a origem do problema."],
    ["usar HTTPS.", "Protege o transporte, não a consulta."],
    ["aumentar o timeout do banco.", "Sem relação com injeção."],
  ], 1, "Parâmetros vinculados separam código SQL de dados. Complementos: validação de entrada e menor privilégio.", "OWASP Cheat Sheet Series — SQL Injection Prevention."),

  q("DEV-072", "dev-privacy-by-design", 2, "Entre os princípios do Privacy by Design, aquele que estabelece que os dados pessoais devem ser automaticamente protegidos, sem exigir ação do usuário, é o da:", [
    ["privacidade como configuração padrão (privacy by default).", "Correta."],
    ["soma zero entre privacidade e segurança.", "O princípio é de soma positiva."],
    ["reatividade.", "O princípio é ser proativo, não reativo."],
    ["opacidade.", "O princípio é visibilidade e transparência."],
    ["coleta máxima de dados.", "Contraria a minimização."],
  ], 0, "Os 7 princípios (Ann Cavoukian): proativo; privacidade por padrão; incorporada ao design; funcionalidade total; segurança ponta a ponta; visibilidade e transparência; respeito ao usuário. A LGPD também prevê privacidade desde a concepção (art. 46, § 2º).", "Cavoukian, A. Privacy by Design: The 7 Foundational Principles; LGPD, art. 46, § 2º."),

  q("DEV-073", "dev-ux-ui", 1, "Entre as 10 heurísticas de usabilidade de Jakob Nielsen, \"o sistema deve sempre manter os usuários informados sobre o que está acontecendo, por meio de feedback adequado em tempo razoável\" corresponde a:", [
    ["visibilidade do status do sistema.", "Correta."],
    ["controle e liberdade do usuário.", "Trata de desfazer/refazer e saídas de emergência."],
    ["prevenção de erros.", "Trata de evitar que erros ocorram."],
    ["estética e design minimalista.", "Trata de evitar informação irrelevante."],
    ["flexibilidade e eficiência de uso.", "Trata de atalhos para usuários experientes."],
  ], 0, "Exemplos: barras de progresso, indicadores de carregamento e mensagens de confirmação.", "Nielsen Norman Group — 10 Usability Heuristics for User Interface Design."),

  q("DEV-074", "dev-wcag", 1, "As Diretrizes de Acessibilidade para Conteúdo Web (WCAG) organizam-se em quatro princípios, segundo os quais o conteúdo deve ser:", [
    ["rápido, seguro, bonito e barato.", "Não são princípios da WCAG."],
    ["perceptível, operável, compreensível e robusto.", "Correta (POUR)."],
    ["responsivo, semântico, validado e indexável.", "Não são os princípios da WCAG."],
    ["público, gratuito, aberto e livre.", "Não são os princípios da WCAG."],
    ["textual, visual, sonoro e tátil.", "Não são os princípios da WCAG."],
  ], 1, "Cada critério de sucesso tem nível de conformidade A, AA ou AAA.", "W3C — WCAG 2.2."),

  q("DEV-075", "dev-emag", 1, "O eMAG (Modelo de Acessibilidade em Governo Eletrônico) é:", [
    ["um framework JavaScript do governo federal.", "Não é framework."],
    ["uma versão especializada das diretrizes internacionais WCAG, voltada aos sítios e portais do governo brasileiro.", "Correta."],
    ["uma lei que substitui a WCAG no Brasil.", "É modelo/recomendação alinhado à WCAG."],
    ["um sistema de autenticação.", "Não trata de autenticação."],
    ["um padrão de interoperabilidade de dados.", "Interoperabilidade é tratada pela e-PING."],
  ], 1, "O eMAG adapta as recomendações da WCAG à realidade brasileira, com recomendações agrupadas por seções.", "gov.br — eMAG: Modelo de Acessibilidade em Governo Eletrônico."),

  // ───────── Normativos ─────────
  q("DEV-076", "dev-norm-res-335", 2, "A Resolução CNJ nº 335/2020:", [
    ["extinguiu o PJe e determinou a adoção de sistemas próprios por cada tribunal.", "O PJe foi mantido como sistema prioritário."],
    ["instituiu política pública para a governança e a gestão de processo judicial eletrônico e criou a Plataforma Digital do Poder Judiciário Brasileiro (PDPJ-Br).", "Correta."],
    ["regulamentou exclusivamente o teletrabalho de servidores.", "Não trata de teletrabalho."],
    ["instituiu a Estratégia Nacional de Segurança Cibernética.", "Matéria da Resolução CNJ nº 396/2021."],
    ["aprovou o MoReq-Jus.", "Matéria da Resolução CNJ nº 522/2023."],
  ], 1, "A PDPJ-Br integra os sistemas dos tribunais em modelo colaborativo, com microsserviços e soluções compartilhadas.", "Resolução CNJ nº 335/2020."),

  q("DEV-077", "dev-norm-ensec", 2, "A Estratégia Nacional de Segurança Cibernética do Poder Judiciário (ENSEC-PJ) foi instituída pela:", [
    ["Resolução CNJ nº 335/2020.", "Trata da PDPJ-Br."],
    ["Resolução CNJ nº 396/2021.", "Correta; a Portaria CNJ nº 162/2021 aprova protocolos e manuais relacionados."],
    ["Lei nº 13.709/2018.", "É a LGPD."],
    ["Resolução CNJ nº 522/2023.", "Trata do MoReq-Jus."],
    ["Portaria CNJ nº 131/2021.", "Trata do Grupo Revisor de Código-Fonte."],
  ], 1, "A ENSEC-PJ define diretrizes de governança, gestão de riscos e resposta a incidentes cibernéticos nos tribunais.", "Resolução CNJ nº 396/2021; Portaria CNJ nº 162/2021."),

  q("DEV-078", "dev-norm-lgpd", 2, "Conforme a LGPD, o dado anonimizado:", [
    ["é sempre considerado dado pessoal sensível.", "Não é dado pessoal, salvo se revertido."],
    ["não é considerado dado pessoal, salvo quando o processo de anonimização puder ser revertido com esforços razoáveis.", "Correta: art. 12."],
    ["deve ser excluído imediatamente após a coleta.", "Não há essa obrigação."],
    ["só pode ser tratado com consentimento expresso.", "Por não ser dado pessoal, não se sujeita à LGPD."],
    ["equivale ao dado pseudonimizado.", "Pseudonimização mantém possibilidade de associação com informação adicional (art. 13, § 4º)."],
  ], 1, "Anonimização: o dado perde a possibilidade de associação, direta ou indireta, a um indivíduo.", "Lei nº 13.709/2018, arts. 5º, III e XI, 12 e 13."),
];
