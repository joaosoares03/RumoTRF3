import type { LessonSeed } from "./types";

export const LESSONS_DEV: LessonSeed[] = [
  {
    slug: "complexidade-de-algoritmos",
    topic: "dev-complexidade",
    title: "Complexidade de algoritmos e notação Big-O",
    minutes: 25,
    summary: "Big-O descreve o crescimento do custo no pior caso. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Busca binária O(log n); sequencial O(n); bubble/insertion O(n²); merge O(n log n); quicksort O(n log n) médio e O(n²) pior; hash O(1) médio.",
    content: `## Para começar

A **complexidade** mede como o tempo (ou memória) de um algoritmo cresce conforme o tamanho da entrada **n** aumenta. A notação **Big-O** descreve um **limite superior** — normalmente usado para o **pior caso**.

## Classes mais comuns

| Notação | Nome | Exemplo |
|---|---|---|
| O(1) | constante | acessar \`vetor[i]\` |
| O(log n) | logarítmica | busca binária |
| O(n) | linear | busca sequencial |
| O(n log n) | linearítmica | merge sort, heap sort |
| O(n²) | quadrática | bubble sort, dois laços aninhados |
| O(2ⁿ) | exponencial | força bruta em subconjuntos |

## Como calcular

1. Conte as operações dominantes (laços).
2. Laços **aninhados** multiplicam; laços **em sequência** somam (e fica o maior termo).
3. Despreze constantes e termos menores: 3n² + 5n + 2 → **O(n²)**.

\`\`\`java
for (int i = 0; i < n; i++)        // n vezes
  for (int j = 0; j < n; j++)      // n vezes
    soma += m[i][j];               // → O(n²)
\`\`\`

## Algoritmos de ordenação

| Algoritmo | Melhor | Médio | Pior | Estável? |
|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | O(n²) | sim |
| Insertion sort | O(n) | O(n²) | O(n²) | sim |
| Selection sort | O(n²) | O(n²) | O(n²) | não |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | sim |
| Quicksort | O(n log n) | O(n log n) | O(n²) | não |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | não |

## Pegadinhas

- Busca binária **exige vetor ordenado**.
- Quicksort é rápido na média, mas tem pior caso quadrático (pivô ruim).
- Big-O (limite superior), Ω (inferior) e Θ (justo) não são sinônimos.

## Resumo

Identifique os laços, multiplique os aninhados, fique com o termo dominante e memorize a tabela de ordenação.`,
  },
  {
    slug: "estruturas-de-dados-fundamentais",
    topic: "dev-estruturas-dados",
    title: "Estruturas de dados: vetores, listas, pilhas, filas, árvores e hash",
    minutes: 35,
    summary: "Vetor: acesso O(1), inserção no meio O(n). Lista encadeada: inserção O(1) com referência, acesso O(n). Pilha LIFO, fila FIFO. BST: busca O(log n) se balanceada, O(n) se degenerada; in-order = ordenado. Hash: O(1) médio, colisões por encadeamento ou endereçamento aberto.",
    content: `## Vetores e matrizes

Blocos **contíguos** de memória com acesso por índice em **O(1)**. Inserir/remover no meio exige deslocar elementos: **O(n)**. Matrizes são vetores de vetores (\`m[linha][coluna]\`).

## Listas encadeadas

Cada nó guarda o valor e a referência para o próximo (simplesmente encadeada) ou também para o anterior (duplamente encadeada). Inserção/remoção **O(1)** quando se tem a referência do nó; acesso por posição **O(n)**.

## Pilha (LIFO)

Operações **push** (empilhar) e **pop** (desempilhar) no topo. Usos: pilha de chamadas de função, desfazer (Ctrl+Z), avaliação de expressões, verificação de parênteses balanceados.

## Fila (FIFO)

**enqueue** no fim e **dequeue** no início. Usos: filas de impressão, mensageria, escalonamento de processos, busca em largura. Variações: **fila de prioridade** (heap) e **deque**.

## Árvores

- **Árvore binária:** cada nó tem até 2 filhos.
- **Árvore binária de busca (BST):** esquerda < nó < direita. Busca O(log n) se **balanceada**; O(n) se degenerar em lista.
- **Balanceadas:** AVL, rubro-negra; **B-trees/B+trees** são usadas em índices de bancos de dados.
- **Percursos:** pré-ordem (R-E-D), **em ordem (E-R-D → ordenado na BST)**, pós-ordem (E-D-R), em largura (por níveis).

## Tabelas de espalhamento (hash)

Uma **função hash** converte a chave em uma posição do vetor. Inserção e busca **O(1) em média**. **Colisões** (chaves diferentes, mesma posição) são tratadas por:

- **encadeamento separado** (lista em cada posição);
- **endereçamento aberto** (sondagem linear, quadrática, hash duplo).

O **fator de carga** (n/m) influencia o desempenho; ao crescer, faz-se **rehash**.

## Exemplo — verificar parênteses com pilha

\`\`\`python
def balanceado(expr):
    pilha = []
    pares = {')': '(', ']': '[', '}': '{'}
    for c in expr:
        if c in '([{':
            pilha.append(c)
        elif c in pares:
            if not pilha or pilha.pop() != pares[c]:
                return False
    return not pilha
\`\`\`

## Resumo

Escolha a estrutura pela operação mais frequente: acesso por índice (vetor), inserções frequentes (lista), último-primeiro (pilha), ordem de chegada (fila), dados ordenados (árvore), busca por chave (hash).`,
  },
  {
    slug: "poo-pilares",
    topic: "dev-poo-conceitos",
    title: "Programação Orientada a Objetos: os quatro pilares",
    minutes: 30,
    summary: "Classe = molde; objeto = instância. Atributos (estado) e métodos (comportamento). Encapsulamento (private + interface pública), herança (é-um), polimorfismo (sobrescrita dinâmica e sobrecarga estática), abstração (classes abstratas e interfaces). Prefira composição a herança quando não houver relação é-um.",
    content: `## Conceitos básicos

- **Classe:** modelo que define atributos e métodos.
- **Objeto:** instância concreta de uma classe, com estado próprio.
- **Atributos:** dados (estado). **Métodos:** comportamentos.
- **Construtor:** método especial que inicializa o objeto.

## Os quatro pilares

### 1. Encapsulamento
Ocultar o estado interno e expor apenas uma interface controlada.

\`\`\`java
public class Conta {
    private double saldo;                // estado protegido
    public void depositar(double v) {    // interface pública com validação
        if (v <= 0) throw new IllegalArgumentException("valor inválido");
        saldo += v;
    }
    public double getSaldo() { return saldo; }
}
\`\`\`

### 2. Herança
Relação **"é-um"**: a subclasse reaproveita e especializa a superclasse (\`class Tecnico extends Servidor\`). Java e C# têm herança **simples** de classes e múltipla de interfaces.

### 3. Polimorfismo
- **De sobrescrita (dinâmico):** a subclasse redefine um método; a JVM escolhe a implementação em tempo de execução (\`@Override\`).
- **De sobrecarga (estático):** mesmo nome, parâmetros diferentes, resolvido em compilação.

### 4. Abstração
Modelar apenas o essencial. **Classes abstratas** não podem ser instanciadas e podem ter métodos abstratos; **interfaces** definem contratos.

## Associação, agregação e composição

- **Associação:** um objeto usa outro.
- **Agregação:** "tem-um" com ciclo de vida independente (Departamento tem Servidores).
- **Composição:** "tem-um" forte; a parte não existe sem o todo (Pedido e ItensDoPedido).

## Pegadinhas

- Modificadores de acesso Java: \`private\` < (default/pacote) < \`protected\` < \`public\`.
- \`final\` em classe impede herança; em método impede sobrescrita.
- Sobrecarga **não** depende do tipo de retorno.

## Resumo

Encapsule o estado, herde apenas quando houver "é-um", use polimorfismo para eliminar condicionais por tipo e abstraia contratos com interfaces.`,
  },
  {
    slug: "java-essencial",
    topic: "dev-java",
    title: "Java essencial para concursos",
    minutes: 35,
    summary: "JDK (desenvolvimento) ⊃ JRE ⊃ JVM. Tipos primitivos × wrappers; String imutável; == compara referência, equals compara conteúdo. Collections: List (ArrayList/LinkedList), Set (HashSet/TreeSet), Map (HashMap/TreeMap). Exceções checked × unchecked. Java 8: lambdas, Streams, Optional, default methods.",
    content: `## Plataforma

- **JVM** executa bytecode (\`.class\`) — "write once, run anywhere".
- **JRE** = JVM + bibliotecas. **JDK** = JRE + ferramentas (\`javac\`, \`jar\`, \`javadoc\`).

## Tipos

- **Primitivos:** \`byte, short, int, long, float, double, char, boolean\`.
- **Wrappers:** \`Integer, Double...\` (autoboxing/unboxing).
- **String** é **imutável**; para concatenação intensa use \`StringBuilder\`.

\`\`\`java
String a = new String("x"), b = new String("x");
a == b;        // false (referências diferentes)
a.equals(b);   // true  (conteúdo igual)
\`\`\`

## Coleções (java.util)

| Interface | Implementações | Característica |
|---|---|---|
| List | ArrayList, LinkedList | ordenada por índice, aceita duplicados |
| Set | HashSet, LinkedHashSet, TreeSet | sem duplicados (TreeSet ordenado) |
| Map | HashMap, LinkedHashMap, TreeMap | chave → valor |
| Queue/Deque | ArrayDeque, PriorityQueue | filas |

## Exceções

- **Checked** (verificadas): herdam de \`Exception\` (não de RuntimeException) — exigem \`try/catch\` ou \`throws\` (ex.: \`IOException\`).
- **Unchecked:** \`RuntimeException\` e subclasses (\`NullPointerException\`, \`IllegalArgumentException\`).
- **try-with-resources** fecha automaticamente objetos \`AutoCloseable\`.

## Java 8+

\`\`\`java
List<String> nomes = servidores.stream()
    .filter(s -> s.getCargo().equals("Técnico"))
    .map(Servidor::getNome)
    .sorted()
    .collect(Collectors.toList());
\`\`\`

Também: \`Optional\`, **métodos default** em interfaces, nova API de datas (\`java.time\`). Versões recentes trouxeram \`var\` (10), **records** (16), **sealed classes** (17) e **virtual threads** (21).

## Resumo

Saiba diferenciar JDK/JRE/JVM, == de equals, as coleções, exceções verificadas e os recursos do Java 8.`,
  },
  {
    slug: "javascript-typescript-essencial",
    topic: "dev-javascript",
    title: "JavaScript e TypeScript: o que mais cai",
    minutes: 35,
    summary: "var (função, hoisting) × let/const (bloco). === sem coerção. typeof null === 'object'. Closures. Event loop: síncrono → microtarefas (Promise) → macrotarefas (setTimeout). async/await sobre Promises. TypeScript: tipagem estática estrutural, interfaces, generics, unknown × any, tipos apagados na compilação.",
    content: `## Escopo e declarações

| | var | let | const |
|---|---|---|---|
| Escopo | função | bloco | bloco |
| Hoisting | sim (inicia undefined) | sim, mas na "zona morta temporal" | idem |
| Reatribuição | sim | sim | não (mas objetos continuam mutáveis) |

## Igualdade e tipos

- \`===\` compara valor e tipo; \`==\` faz **coerção**: \`0 == "0"\` → true.
- \`typeof null\` → \`"object"\` (comportamento histórico).
- Valores *falsy*: \`false, 0, -0, 0n, "", null, undefined, NaN\`.

## Funções e closures

Uma **closure** é uma função que "lembra" do escopo onde foi criada:

\`\`\`js
function contador() {
  let n = 0;
  return () => ++n;
}
const c = contador(); c(); c(); // 2
\`\`\`

Arrow functions **não** têm \`this\` próprio.

## Assincronismo e event loop

\`\`\`js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
\`\`\`

Ordem: **pilha síncrona → microtarefas (Promises, queueMicrotask) → macrotarefas (setTimeout, I/O)**. \`async/await\` é açúcar sintático sobre Promises.

## TypeScript

- Superconjunto do JS com **tipagem estática** verificada em compilação; os tipos são **apagados** no JS gerado.
- Tipagem **estrutural** (duck typing): o que importa é a forma do objeto.
- \`interface\` e \`type\`, **generics** (\`Array<T>\`), *union types* (\`string | number\`), *literal types*.
- \`any\` desliga a checagem; \`unknown\` exige *narrowing* antes do uso; \`never\` representa o impossível.

\`\`\`ts
function tamanho(x: unknown) {
  if (typeof x === "string") return x.length; // narrowing
  return 0;
}
\`\`\`

## Resumo

Domine escopo, igualdade estrita, closures, event loop e os tipos especiais do TypeScript.`,
  },
  {
    slug: "spring-boot-e-ecossistema",
    topic: "dev-spring-boot",
    title: "Spring Framework e Spring Boot",
    minutes: 30,
    summary: "IoC/DI: o contêiner cria e injeta beans (preferir injeção por construtor). Estereótipos @Component, @Service, @Repository, @Controller/@RestController. Escopo padrão singleton. Spring Boot: autoconfiguração, starters, servidor embarcado (Tomcat), application.properties/yml, Actuator. @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan.",
    content: `## Inversão de Controle e Injeção de Dependências

No Spring, o **contêiner IoC** cria os objetos (**beans**) e injeta suas dependências — a classe não instancia o que usa.

\`\`\`java
@Service
public class ProcessoService {
    private final ProcessoRepository repo;
    public ProcessoService(ProcessoRepository repo) { // injeção por construtor (recomendada)
        this.repo = repo;
    }
}
\`\`\`

- Estereótipos: \`@Component\`, \`@Service\`, \`@Repository\` (traduz exceções de persistência), \`@Controller\`, \`@RestController\` (= @Controller + @ResponseBody).
- Escopos: **singleton (padrão)**, prototype e, na web, request, session, application.
- \`@Configuration\` + \`@Bean\` para declarar beans manualmente.

## Spring Boot

- **Autoconfiguração** com base nas dependências do classpath.
- **Starters** (\`spring-boot-starter-web\`, \`-data-jpa\`, \`-security\`).
- **Servidor embarcado** (Tomcat por padrão) → \`java -jar app.jar\`.
- Configuração externa em \`application.properties\`/\`application.yml\` e **profiles** (\`dev\`, \`prod\`).
- **Actuator**: endpoints de saúde e métricas (\`/actuator/health\`).

\`\`\`java
@RestController
@RequestMapping("/processos")
class ProcessoController {
    @GetMapping("/{id}")
    ResponseEntity<ProcessoDTO> buscar(@PathVariable Long id) { ... }

    @PostMapping
    ResponseEntity<ProcessoDTO> criar(@RequestBody @Valid NovoProcesso dto) { ... } // 201 Created
}
\`\`\`

## Spring Data JPA

Interfaces como \`JpaRepository<Processo, Long>\` geram implementações automaticamente; consultas derivadas do nome do método (\`findByNumero\`).

## Spring Cloud

Ferramentas para sistemas distribuídos: **service discovery** (Eureka), **gateway** (Zuul/Spring Cloud Gateway), **circuit breaker** (Hystrix/Resilience4j), **config server**. Usado na PDPJ-Br.

## Resumo

IoC/DI, estereótipos, escopo singleton, autoconfiguração, starters e o papel do Spring Cloud em microsserviços.`,
  },
  {
    slug: "apis-rest-graphql-openapi",
    topic: "dev-rest",
    title: "APIs RESTful, GraphQL e OpenAPI",
    minutes: 30,
    summary: "REST: recursos (substantivos), métodos HTTP com semântica, stateless, representações (JSON), HATEOAS. Idempotentes: GET, PUT, DELETE, HEAD, OPTIONS. Status: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500. GraphQL: endpoint único, query/mutation/subscription, schema tipado. OpenAPI descreve contratos; Swagger UI documenta.",
    content: `## REST

Estilo arquitetural (Roy Fielding, 2000) com restrições: **cliente-servidor, stateless, cache, interface uniforme, sistema em camadas** e (opcional) código sob demanda.

| Operação | Método | Rota | Sucesso |
|---|---|---|---|
| Listar | GET | /processos | 200 |
| Detalhar | GET | /processos/{id} | 200 / 404 |
| Criar | POST | /processos | **201** + Location |
| Substituir | PUT | /processos/{id} | 200 / 204 |
| Atualizar parcial | PATCH | /processos/{id} | 200 / 204 |
| Remover | DELETE | /processos/{id} | 204 |

- **Seguros** (não alteram estado): GET, HEAD, OPTIONS.
- **Idempotentes**: os seguros + **PUT e DELETE**. POST não é.

### Códigos de status

2xx sucesso · 3xx redirecionamento · **4xx erro do cliente** (400 inválido, **401 não autenticado, 403 sem permissão**, 404 não encontrado, 409 conflito, 422 entidade não processável, 429 muitas requisições) · **5xx erro do servidor** (500, 502, 503).

### Maturidade de Richardson

Nível 0 (um endpoint, RPC) → 1 (recursos) → 2 (verbos HTTP) → 3 (**HATEOAS**: links nas respostas).

## GraphQL

- **Um endpoint**; o cliente declara exatamente os campos desejados (evita *over/under-fetching*).
- Operações: **query** (leitura), **mutation** (escrita), **subscription** (tempo real).
- **Schema** fortemente tipado (SDL) e *resolvers* no servidor.

\`\`\`graphql
query {
  processo(id: 10) { numero classe partes { nome polo } }
}
\`\`\`

## OpenAPI / Swagger

A **OpenAPI Specification** (antiga Swagger Specification) descreve APIs HTTP em **YAML ou JSON**: caminhos, parâmetros, esquemas, respostas e segurança. O **Swagger UI** gera documentação interativa; o **Swagger Codegen/OpenAPI Generator** gera clientes e servidores.

## Resumo

Recursos no plural, verbos com semântica correta, status adequados (201, 401 × 403), GraphQL com endpoint único e OpenAPI como contrato.`,
  },
  {
    slug: "pje-pdpj-microsservicos",
    topic: "dev-microsservicos-conceitos",
    title: "Ecossistema PJe/PDPJ-Br: microsserviços, mensageria e identidade",
    minutes: 35,
    summary: "PDPJ-Br (Res. CNJ 335/2020): plataforma colaborativa em microsserviços. Eureka = registry; Zuul = API gateway; Hystrix = circuit breaker (fechado/aberto/semiaberto); Envers = auditoria de entidades. RabbitMQ (AMQP, exchanges direct/fanout/topic/headers), Kafka (log distribuído, ordem por partição), Redis (cache, TTL). Keycloak: OIDC/OAuth2/SAML, realms, SSO.",
    content: `## Contexto

A **Resolução CNJ nº 335/2020** instituiu a **Plataforma Digital do Poder Judiciário Brasileiro (PDPJ-Br)**: um modelo colaborativo em que tribunais desenvolvem e compartilham **microsserviços**, mantendo o **PJe** como sistema de processo eletrônico prioritário do CNJ. O PJe legado usa **JSF/PrimeFaces**, **Maven** e servidores como **WildFly/JBoss**; os novos módulos usam **Spring Boot/Spring Cloud** e **Angular**.

## Monólito × microsserviços

| Monólito | Microsserviços |
|---|---|
| uma unidade de implantação | serviços pequenos, implantados independentemente |
| escala o todo | escala cada serviço |
| uma base tecnológica | poliglota |
| chamadas locais | chamadas de rede (latência, falhas parciais) |

## Componentes Spring Cloud / Netflix OSS

- **Eureka (service registry):** serviços se registram; clientes descobrem instâncias dinamicamente.
- **Zuul (API Gateway):** ponto de entrada único; roteamento, filtros, autenticação na borda.
- **Hystrix (circuit breaker):** evita falhas em cascata. Estados **fechado** (normal) → **aberto** (falha rápida + *fallback*) → **semiaberto** (testa recuperação). Está em modo de manutenção; o sucessor recomendado é o Resilience4j.
- **Envers (Hibernate/Spring Data Envers):** auditoria e versionamento de entidades (\`@Audited\`, tabelas *_AUD*).

## Mensageria e cache

- **AMQP** é o protocolo; **RabbitMQ** é um broker que o implementa. *Producer → exchange → (binding) → queue → consumer*. Exchanges: **direct** (chave exata), **fanout** (todas as filas), **topic** (padrões \`*\`/\`#\`), **headers**.
- **Apache Kafka:** log distribuído e persistente; **tópicos** divididos em **partições**; ordem garantida **por partição**; consumidores em **grupos** (cada partição → um consumidor do grupo).
- **Redis:** banco chave-valor em memória; cache com **TTL** (\`EXPIRE\`, \`SET ... EX\`), estruturas (strings, hashes, listas, sets, sorted sets), pub/sub.

## Identidade: Keycloak e SSO

**Keycloak** é um servidor open source de IAM com **OpenID Connect, OAuth 2.0 e SAML 2.0**. Organiza-se em **realms** (usuários, *clients*, papéis). Com **SSO**, o usuário autentica uma vez e acessa vários sistemas integrados à PDPJ-Br, que recebem **tokens** (JWT) para autorização.

## Resumo

Associe cada componente ao seu papel (registry, gateway, circuit breaker, auditoria, broker, cache, IAM) e saiba por que a PDPJ adota microsserviços.`,
  },
  {
    slug: "engenharia-clean-solid-patterns",
    topic: "dev-solid",
    title: "Clean Code, SOLID, Clean Architecture e Design Patterns",
    minutes: 35,
    summary: "SOLID: SRP (um motivo para mudar), OCP (aberto p/ extensão, fechado p/ modificação), LSP (subtipos substituíveis), ISP (interfaces específicas), DIP (depender de abstrações). Clean Architecture: regra da dependência para dentro. GoF: criacionais (Singleton, Factory Method, Abstract Factory, Builder, Prototype), estruturais (Adapter, Decorator, Facade, Proxy, Composite...), comportamentais (Observer, Strategy, Command, Template Method, State...).",
    content: `## Clean Code (Robert C. Martin)

- **Nomes que revelam intenção** (\`diasAteAProva\`, não \`d\`).
- **Funções pequenas** que fazem **uma coisa**, com poucos parâmetros (evite *flags* booleanas).
- Comentários não compensam código ruim; prefira código autoexplicativo.
- Trate erros com exceções, não com códigos de retorno; não retorne \`null\` sem necessidade.
- **Regra do escoteiro:** deixe o código melhor do que encontrou. Testes limpos (F.I.R.S.T.).

## SOLID

| Princípio | Ideia | Sinal de violação |
|---|---|---|
| **S**RP | uma classe, um motivo para mudar | classe "Deus" que valida, persiste e envia e-mail |
| **O**CP | estender sem modificar | \`if/else\` por tipo crescendo a cada novo caso |
| **L**SP | subtipos substituem o tipo base sem quebrar | subclasse que lança exceção em método herdado |
| **I**SP | interfaces específicas por cliente | classe obrigada a implementar métodos que não usa |
| **D**IP | depender de abstrações | serviço instanciando diretamente o repositório concreto |

## Clean Architecture

Camadas concêntricas: **Entidades → Casos de uso → Adaptadores de interface → Frameworks e drivers**. **Regra da dependência:** o código-fonte só depende **para dentro**. Banco, web e frameworks são **detalhes**; interfaces (portas) invertem as dependências. Relacionadas: arquitetura hexagonal (*ports and adapters*) e *onion architecture*.

## Design Patterns (GoF)

- **Criacionais:** Singleton (instância única), Factory Method, Abstract Factory, Builder, Prototype.
- **Estruturais:** Adapter (converte interfaces), Decorator (adiciona responsabilidades), Facade (interface simplificada), Proxy (substituto/controle de acesso), Composite (árvore parte-todo), Bridge, Flyweight.
- **Comportamentais:** Observer (notifica dependentes), Strategy (algoritmos intercambiáveis), Command (encapsula requisição), Template Method (esqueleto com passos variáveis), State, Chain of Responsibility, Iterator, Mediator, Memento, Visitor, Interpreter.

\`\`\`java
interface CalculoCustas { BigDecimal calcular(Processo p); }      // Strategy
class CustasJusticaFederal implements CalculoCustas { ... }
class ServicoCustas {
    private final CalculoCustas estrategia;                         // DIP + OCP
    ServicoCustas(CalculoCustas e) { this.estrategia = e; }
}
\`\`\`

## Resumo

Associe cada letra do SOLID a um sintoma, lembre a regra da dependência e saiba classificar os padrões GoF nas três famílias.`,
  },
  {
    slug: "git-cicd-docker-kubernetes",
    topic: "dev-docker",
    title: "Git/Gitflow, CI/CD, Docker e Kubernetes",
    minutes: 35,
    summary: "Git: working dir → staging (add) → repositório (commit) → remoto (push). merge × rebase; stash; cherry-pick. Gitflow: main, develop, feature, release, hotfix. CI integra e testa; CD delivery (pronto p/ produção, liberação manual) × deployment (automático). Docker: imagem (camadas, Dockerfile) × contêiner; EXPOSE documenta; -p publica; compose. Kubernetes: Pod, ReplicaSet, Deployment, Service, Ingress, ConfigMap/Secret.",
    content: `## Git

\`\`\`bash
git clone <url>                 # copia o repositório
git switch -c feature/login     # cria e muda de branch
git add arquivo && git commit -m "mensagem"
git pull --rebase && git push
git stash / git stash pop       # guarda e recupera alterações não commitadas
git cherry-pick <hash>          # aplica um commit específico
git revert <hash>               # cria commit que desfaz outro (seguro em branch compartilhada)
\`\`\`

- **merge** preserva o histórico com um commit de junção; **rebase** reescreve o histórico de forma linear (não use em branches públicas).
- \`reset --hard\` descarta alterações — cuidado.

### Gitflow

\`main\` (produção, com *tags*) · \`develop\` (integração) · \`feature/*\` (saem e voltam para develop) · \`release/*\` (estabilização; vão para main e develop) · \`hotfix/*\` (saem de **main** e voltam para **main e develop**). O GitLab Flow e o *trunk-based development* são alternativas mais enxutas.

## CI/CD

- **Integração Contínua:** commits frequentes + build e **testes automatizados** a cada integração.
- **Entrega Contínua:** o software está sempre **pronto** para produção; a liberação é uma decisão (manual).
- **Implantação Contínua:** cada mudança aprovada no pipeline vai **automaticamente** para produção.
- Ferramentas: GitLab CI (\`.gitlab-ci.yml\`), Jenkins, GitHub Actions.

## Docker

- **Imagem:** modelo imutável em **camadas**, construída a partir de um **Dockerfile**. **Contêiner:** instância em execução da imagem.

\`\`\`dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080                  # documenta a porta (não publica)
ENTRYPOINT ["java","-jar","app.jar"]
\`\`\`

\`docker build -t app:1.0 .\` · \`docker run -d -p 8080:8080 app:1.0\` · \`docker ps\` · \`docker logs\`. O **docker-compose.yml** declara vários serviços (app + banco), redes e volumes: \`docker compose up -d\`.

## Kubernetes

Orquestrador de contêineres. **Pod** (menor unidade, 1+ contêineres) · **ReplicaSet** (nº de réplicas) · **Deployment** (atualizações graduais, *rollback*) · **Service** (IP/DNS estável e balanceamento) · **Ingress** (HTTP externo) · **ConfigMap/Secret** (configuração) · **Namespace** (isolamento). Comando: \`kubectl apply -f deployment.yaml\`.

## Resumo

Saiba o fluxo do Git e do Gitflow (hotfix!), diferencie as duas "CDs", imagem × contêiner, EXPOSE × -p e os objetos básicos do Kubernetes.`,
  },
  {
    slug: "sql-e-modelagem-relacional",
    topic: "dev-sql",
    title: "Modelagem relacional e SQL (DDL e DML)",
    minutes: 40,
    summary: "DER: entidades, atributos, relacionamentos e cardinalidades (1:1, 1:N, N:N → tabela associativa). Chaves primária, estrangeira, candidata. Normalização 1FN/2FN/3FN. DDL: CREATE/ALTER/DROP/TRUNCATE. DML: INSERT/UPDATE/DELETE/SELECT. Ordem lógica: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. JOINs: INNER, LEFT, RIGHT, FULL, CROSS.",
    content: `## Modelagem conceitual (DER)

- **Entidade** (Processo, Parte, Vara), **atributo** (número, nome), **relacionamento** (Processo *pertence a* Vara).
- **Cardinalidades:** 1:1, 1:N e **N:N**.

## Do conceitual ao lógico

| Relacionamento | Implementação |
|---|---|
| 1:N | chave estrangeira no lado N (processo.vara_id) |
| N:N | **tabela associativa** (processo_parte) com as duas FKs |
| 1:1 | FK com restrição UNIQUE em um dos lados |

Chaves: **primária** (identifica a linha), **estrangeira** (integridade referencial), **candidata** (poderia ser PK), **surrogate** (artificial, ex.: id autoincremento).

## Normalização

- **1FN:** valores atômicos, sem grupos repetidos.
- **2FN:** 1FN + nenhum atributo depende de **parte** da chave composta.
- **3FN:** 2FN + nenhum atributo não chave depende de outro não chave (**sem dependência transitiva**).
- **FNBC:** todo determinante é chave candidata.

## SQL

\`\`\`sql
-- DDL
CREATE TABLE vara (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL);
ALTER TABLE processo ADD COLUMN ano INT;
DROP TABLE temporaria;

-- DML
INSERT INTO vara (nome) VALUES ('1ª Vara Federal');
UPDATE processo SET classe = 'Execução Fiscal' WHERE id = 3;
DELETE FROM processo WHERE ano < 2000;

-- Consulta com agregação
SELECT v.cidade, COUNT(*) AS total
FROM processo p
JOIN vara v ON v.id = p.vara_id
WHERE p.ano = 2026
GROUP BY v.cidade
HAVING COUNT(*) > 1
ORDER BY total DESC;
\`\`\`

**Ordem lógica de execução:** FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/TOP.

### JOINs

- **INNER:** só correspondências. **LEFT:** todas da esquerda (+ NULL). **RIGHT:** todas da direita. **FULL:** todas de ambas. **CROSS:** produto cartesiano.

### Outros pontos

- \`TRUNCATE\` (DDL) remove todas as linhas sem registrar linha a linha; \`DELETE\` (DML) aceita \`WHERE\`.
- \`DCL\`: GRANT/REVOKE. \`TCL\`: COMMIT/ROLLBACK/SAVEPOINT.
- Transações **ACID**: atomicidade, consistência, isolamento, durabilidade.

## PostgreSQL × SQL Server (diferenças cobradas)

| | PostgreSQL | SQL Server |
|---|---|---|
| Limitar linhas | \`LIMIT n OFFSET m\` | \`TOP (n)\` / \`OFFSET ... FETCH\` |
| Autoincremento | \`SERIAL\` / \`GENERATED AS IDENTITY\` | \`IDENTITY(1,1)\` |
| JSON | \`json\` e **\`jsonb\`** (indexável com GIN) | funções JSON sobre \`nvarchar\` |
| Linguagem procedural | PL/pgSQL | T-SQL |

## Resumo

Modele N:N com tabela associativa, normalize até a 3FN e domine a ordem lógica do SELECT — pratique no **Laboratório SQL** da plataforma.`,
  },
  {
    slug: "owasp-privacy-acessibilidade",
    topic: "dev-owasp",
    title: "Desenvolvimento seguro (OWASP Top 10), Privacy by Design, UX/UI e acessibilidade",
    minutes: 35,
    summary: "OWASP Top 10:2021: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection (inclui XSS), A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable and Outdated Components, A07 Identification and Authentication Failures, A08 Software and Data Integrity Failures, A09 Security Logging and Monitoring Failures, A10 SSRF. Privacy by Design: 7 princípios. Nielsen: 10 heurísticas. WCAG: POUR, níveis A/AA/AAA. eMAG: WCAG adaptada ao governo brasileiro.",
    content: `## OWASP Top 10 (2021)

| Posição | Categoria | Mitigação típica |
|---|---|---|
| A01 | **Quebra de controle de acesso** | negar por padrão, checar autorização no servidor em cada requisição |
| A02 | Falhas criptográficas | TLS, hash de senha (bcrypt/Argon2), não usar algoritmos fracos |
| A03 | **Injeção** (SQL, comandos, **XSS**) | consultas parametrizadas, escape/encoding de saída, validação |
| A04 | Design inseguro | modelagem de ameaças, padrões seguros |
| A05 | Configuração incorreta | *hardening*, remover padrões, headers de segurança |
| A06 | Componentes vulneráveis/desatualizados | inventário e atualização de dependências |
| A07 | Falhas de identificação e autenticação | MFA, limitação de tentativas, sessões seguras |
| A08 | Falhas de integridade de software e dados | assinatura, pipelines confiáveis |
| A09 | Falhas de log e monitoramento | registrar e alertar eventos de segurança |
| A10 | SSRF | validar/whitelist de URLs de saída |

\`\`\`java
// ✘ vulnerável
"SELECT * FROM usuario WHERE login = '" + login + "'";
// ✔ parametrizado
PreparedStatement ps = conn.prepareStatement("SELECT * FROM usuario WHERE login = ?");
ps.setString(1, login);
\`\`\`

## Privacy by Design (Ann Cavoukian) — 7 princípios

1. Proativo, não reativo; preventivo, não corretivo. 2. **Privacidade como padrão** (*by default*). 3. Privacidade incorporada ao design. 4. Funcionalidade total — soma positiva, não soma zero. 5. Segurança de ponta a ponta (ciclo de vida completo). 6. Visibilidade e transparência. 7. Respeito à privacidade do usuário.

A LGPD (art. 46, § 2º) exige medidas de segurança **desde a fase de concepção** do produto ou serviço.

## UX e UI

- **UX** (experiência): utilidade, facilidade, satisfação na jornada completa. **UI** (interface): elementos visuais e de interação.
- **10 heurísticas de Nielsen:** visibilidade do status do sistema; correspondência com o mundo real; controle e liberdade; consistência e padrões; prevenção de erros; reconhecer em vez de lembrar; flexibilidade e eficiência; estética minimalista; ajudar a reconhecer, diagnosticar e recuperar erros; ajuda e documentação.

## Acessibilidade na Web

- **WCAG (W3C):** princípios **POUR** — perceptível, operável, compreensível, robusto; níveis **A, AA, AAA**. Exemplos: texto alternativo em imagens, contraste mínimo (AA: 4,5:1 para texto normal), navegação por teclado, foco visível, rótulos em formulários.
- **eMAG:** versão especializada da WCAG para o governo brasileiro, com recomendações organizadas por seções (marcação, comportamento, conteúdo/informação, apresentação/design, multimídia, formulários).

## Resumo

Saiba o Top 10 na ordem (A01, A02, A03!), a correção do SQL Injection, os 7 princípios do Privacy by Design, as heurísticas de Nielsen e o POUR da WCAG.`,
  },
];
