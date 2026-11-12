/**
 * Laboratório prático (autoral). Tipos:
 *  - SQL: executado NO NAVEGADOR com sql.js (SQLite compilado para WebAssembly) — nada roda no servidor.
 *    O resultado da consulta do estudante é comparado ao resultado da consulta de referência.
 *  - CENARIO / CHAMADO / COMANDO / CODIGO: atividades guiadas em etapas, com feedback por alternativa.
 */
type Step = { question: string; options: string[]; correct: number; feedback: string };
export type LabSeed = {
  slug: string;
  specialty: "DEV" | "SUP";
  topic: string;
  kind: "SQL" | "CODIGO" | "COMANDO" | "CENARIO" | "CHAMADO";
  title: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  payload: { schema?: string; expectedSql?: string; orderMatters?: boolean; steps?: Step[] };
  solution: string;
};

const SCHEMA_PROCESSOS = `
CREATE TABLE vara (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cidade TEXT NOT NULL);
CREATE TABLE processo (id INTEGER PRIMARY KEY, numero TEXT NOT NULL, vara_id INTEGER REFERENCES vara(id), classe TEXT, valor_causa REAL, ano INTEGER);
CREATE TABLE parte (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, tipo TEXT);
CREATE TABLE processo_parte (processo_id INTEGER REFERENCES processo(id), parte_id INTEGER REFERENCES parte(id), polo TEXT);
INSERT INTO vara VALUES (1,'1ª Vara Federal','São Paulo'),(2,'2ª Vara Federal','São Paulo'),(3,'1ª Vara Federal','Campo Grande'),(4,'Vara Federal','Bauru');
INSERT INTO processo VALUES
 (1,'5000001-10.2026.4.03.6100',1,'Mandado de Segurança',15000,2026),
 (2,'5000002-20.2026.4.03.6100',1,'Procedimento Comum',230000,2026),
 (3,'5000003-30.2025.4.03.6100',2,'Execução Fiscal',98000,2025),
 (4,'5000004-40.2026.4.03.6000',3,'Procedimento Comum',5000,2026),
 (5,'5000005-50.2024.4.03.6100',2,'Mandado de Segurança',70000,2024),
 (6,'5000006-60.2026.4.03.6100',2,'Procedimento Comum',120000,2026),
 (7,'5000007-70.2026.4.03.6000',3,'Execução Fiscal',450000,2026);
INSERT INTO parte VALUES (1,'União','PJ'),(2,'Maria Souza','PF'),(3,'Empresa Alfa Ltda.','PJ'),(4,'João Lima','PF'),(5,'INSS','PJ');
INSERT INTO processo_parte VALUES (1,2,'ATIVO'),(1,1,'PASSIVO'),(2,3,'ATIVO'),(2,1,'PASSIVO'),(3,1,'ATIVO'),(3,3,'PASSIVO'),(4,4,'ATIVO'),(4,5,'PASSIVO'),(5,4,'ATIVO'),(5,1,'PASSIVO'),(6,2,'ATIVO'),(6,5,'PASSIVO'),(7,1,'ATIVO'),(7,3,'PASSIVO');
`;

export const LABS: LabSeed[] = [
  // ─────────────── DEV — SQL ───────────────
  {
    slug: "sql-processos-2026",
    specialty: "DEV",
    topic: "dev-sql",
    kind: "SQL",
    title: "SELECT com filtro: processos de 2026",
    difficulty: 1,
    prompt: "Liste o **número** e a **classe** de todos os processos do ano de **2026**, ordenados pelo número.",
    payload: { schema: SCHEMA_PROCESSOS, expectedSql: "SELECT numero, classe FROM processo WHERE ano = 2026 ORDER BY numero;", orderMatters: true },
    solution: "SELECT numero, classe FROM processo WHERE ano = 2026 ORDER BY numero;",
  },
  {
    slug: "sql-join-varas",
    specialty: "DEV",
    topic: "dev-sql",
    kind: "SQL",
    title: "JOIN: processos por vara e cidade",
    difficulty: 2,
    prompt: "Liste o **número do processo**, o **nome da vara** e a **cidade** de todos os processos de **Campo Grande**.",
    payload: { schema: SCHEMA_PROCESSOS, expectedSql: "SELECT p.numero, v.nome, v.cidade FROM processo p JOIN vara v ON v.id = p.vara_id WHERE v.cidade = 'Campo Grande';" },
    solution: "SELECT p.numero, v.nome, v.cidade\nFROM processo p\nJOIN vara v ON v.id = p.vara_id\nWHERE v.cidade = 'Campo Grande';",
  },
  {
    slug: "sql-group-having",
    specialty: "DEV",
    topic: "dev-sql",
    kind: "SQL",
    title: "GROUP BY + HAVING: varas com mais de um processo",
    difficulty: 2,
    prompt: "Para cada **vara_id**, mostre a **quantidade de processos** (coluna `total`), exibindo apenas as varas com **mais de 1 processo**.",
    payload: { schema: SCHEMA_PROCESSOS, expectedSql: "SELECT vara_id, COUNT(*) AS total FROM processo GROUP BY vara_id HAVING COUNT(*) > 1;" },
    solution: "SELECT vara_id, COUNT(*) AS total\nFROM processo\nGROUP BY vara_id\nHAVING COUNT(*) > 1;",
  },
  {
    slug: "sql-left-join",
    specialty: "DEV",
    topic: "dev-sql",
    kind: "SQL",
    title: "LEFT JOIN: varas sem processos",
    difficulty: 3,
    prompt: "Liste o **nome** e a **cidade** das varas que **não possuem nenhum processo** cadastrado.",
    payload: { schema: SCHEMA_PROCESSOS, expectedSql: "SELECT v.nome, v.cidade FROM vara v LEFT JOIN processo p ON p.vara_id = v.id WHERE p.id IS NULL;" },
    solution: "SELECT v.nome, v.cidade\nFROM vara v\nLEFT JOIN processo p ON p.vara_id = v.id\nWHERE p.id IS NULL;",
  },
  {
    slug: "sql-uniao-polo-passivo",
    specialty: "DEV",
    topic: "dev-modelagem-der",
    kind: "SQL",
    title: "Tabela associativa (N:N): processos em que a União é ré",
    difficulty: 3,
    prompt: "Usando a tabela associativa `processo_parte`, liste o **número** dos processos em que a parte **'União'** está no polo **PASSIVO**.",
    payload: {
      schema: SCHEMA_PROCESSOS,
      expectedSql: "SELECT p.numero FROM processo p JOIN processo_parte pp ON pp.processo_id = p.id JOIN parte pa ON pa.id = pp.parte_id WHERE pa.nome = 'União' AND pp.polo = 'PASSIVO';",
    },
    solution: "SELECT p.numero\nFROM processo p\nJOIN processo_parte pp ON pp.processo_id = p.id\nJOIN parte pa ON pa.id = pp.parte_id\nWHERE pa.nome = 'União' AND pp.polo = 'PASSIVO';",
  },
  {
    slug: "sql-media-valor",
    specialty: "DEV",
    topic: "dev-sql",
    kind: "SQL",
    title: "Agregação: valor médio da causa por classe",
    difficulty: 2,
    prompt: "Mostre cada **classe** processual e o **valor médio da causa** (coluna `media`), ordenando da maior média para a menor.",
    payload: { schema: SCHEMA_PROCESSOS, expectedSql: "SELECT classe, AVG(valor_causa) AS media FROM processo GROUP BY classe ORDER BY media DESC;", orderMatters: true },
    solution: "SELECT classe, AVG(valor_causa) AS media\nFROM processo\nGROUP BY classe\nORDER BY media DESC;",
  },

  // ─────────────── DEV — código / arquitetura ───────────────
  {
    slug: "codigo-identificar-bug",
    specialty: "DEV",
    topic: "dev-logica",
    kind: "CODIGO",
    title: "Identificação de erro: laço que nunca termina",
    difficulty: 1,
    prompt: "Analise o código Java abaixo, que deveria somar os números de 1 a 10:\n\n```java\nint soma = 0;\nint i = 1;\nwhile (i <= 10) {\n    soma += i;\n}\nSystem.out.println(soma);\n```",
    payload: {
      steps: [
        { question: "O que acontece ao executar o código?", options: ["Imprime 55", "Imprime 10", "Entra em laço infinito", "Erro de compilação"], correct: 2, feedback: "A variável i nunca é incrementada, então a condição i <= 10 permanece verdadeira para sempre." },
        { question: "Qual correção resolve o problema?", options: ["Trocar <= por <", "Adicionar i++ dentro do laço", "Inicializar soma com 1", "Trocar while por if"], correct: 1, feedback: "Com i++ dentro do laço, o resultado impresso é 55." },
      ],
    },
    solution: "Adicionar `i++;` após `soma += i;`. Resultado: 55.",
  },
  {
    slug: "codigo-poo-polimorfismo",
    specialty: "DEV",
    topic: "dev-poo-conceitos",
    kind: "CODIGO",
    title: "Interpretação de código: polimorfismo",
    difficulty: 2,
    prompt: "```java\nabstract class Servidor { abstract String cargo(); String apresentar() { return \"Sou \" + cargo(); } }\nclass Tecnico extends Servidor { String cargo() { return \"técnico\"; } }\nclass Analista extends Servidor { String cargo() { return \"analista\"; } }\n\nServidor s = new Analista();\nSystem.out.println(s.apresentar());\n```",
    payload: {
      steps: [
        { question: "Qual é a saída?", options: ["Sou técnico", "Sou analista", "Sou null", "Erro: classe abstrata"], correct: 1, feedback: "A referência é do tipo Servidor, mas o objeto é Analista; cargo() é resolvido em tempo de execução (ligação dinâmica)." },
        { question: "Qual conceito explica esse comportamento?", options: ["Encapsulamento", "Sobrecarga", "Polimorfismo por sobrescrita", "Composição"], correct: 2, feedback: "A subclasse sobrescreve o método abstrato e a JVM escolhe a implementação do objeto concreto." },
        { question: "A linha `new Servidor()` compilaria?", options: ["Sim", "Não, pois Servidor é abstrata"], correct: 1, feedback: "Classes abstratas não podem ser instanciadas diretamente." },
      ],
    },
    solution: "Saída: \"Sou analista\" — polimorfismo de subtipo com classe abstrata.",
  },
  {
    slug: "api-rest-design",
    specialty: "DEV",
    topic: "dev-rest",
    kind: "CENARIO",
    title: "Projeto de API REST para processos",
    difficulty: 2,
    prompt: "Você precisa expor uma API para consulta e cadastro de processos em um sistema do tribunal.",
    payload: {
      steps: [
        { question: "Qual rota e método são mais adequados para cadastrar um novo processo?", options: ["GET /criarProcesso", "POST /processos", "PUT /processos/novo", "DELETE /processos"], correct: 1, feedback: "Em REST, recursos são substantivos no plural; POST na coleção cria um novo recurso." },
        { question: "Cadastro bem-sucedido deve retornar qual status?", options: ["200 OK", "201 Created (com header Location)", "204 No Content", "302 Found"], correct: 1, feedback: "201 indica que um novo recurso foi criado; o header Location aponta para ele." },
        { question: "Um usuário autenticado sem perfil de cadastro tenta o POST. Status?", options: ["401", "403", "404", "500"], correct: 1, feedback: "403 Forbidden: autenticado, mas sem permissão." },
        { question: "Como documentar a API para outros sistemas da PDPJ?", options: ["Planilha manual", "Especificação OpenAPI exibida no Swagger UI", "Comentários no código", "E-mail para as equipes"], correct: 1, feedback: "OpenAPI é o padrão de mercado para descrever contratos de APIs HTTP." },
      ],
    },
    solution: "POST /processos → 201 Created; autorização → 403; documentação via OpenAPI/Swagger.",
  },
  {
    slug: "git-fluxo-hotfix",
    specialty: "DEV",
    topic: "dev-git",
    kind: "COMANDO",
    title: "Git: corrigindo um bug em produção (Gitflow)",
    difficulty: 2,
    prompt: "Um erro crítico foi encontrado na versão em produção (branch `main`). A equipe usa Gitflow.",
    payload: {
      steps: [
        { question: "De qual branch criar a correção?", options: ["develop", "main", "feature/atual", "release/2.0"], correct: 1, feedback: "Hotfixes partem da branch de produção (main/master)." },
        { question: "Qual comando cria e muda para a nova branch?", options: ["git checkout -b hotfix/corrige-login main", "git merge hotfix", "git push hotfix", "git stash hotfix"], correct: 0, feedback: "git checkout -b (ou git switch -c) cria a branch a partir de main." },
        { question: "Concluída a correção, onde fazer o merge?", options: ["Somente em main", "Somente em develop", "Em main e em develop", "Em nenhuma; apaga-se a branch"], correct: 2, feedback: "A correção vai para produção (main, com tag) e também para develop, para não se perder." },
      ],
    },
    solution: "git checkout -b hotfix/x main → commit → merge em main (tag) e em develop.",
  },
  {
    slug: "seguranca-sql-injection",
    specialty: "DEV",
    topic: "dev-owasp",
    kind: "CODIGO",
    title: "Desenvolvimento seguro: SQL Injection",
    difficulty: 2,
    prompt: "```java\nString sql = \"SELECT * FROM usuario WHERE login = '\" + login + \"' AND senha = '\" + senha + \"'\";\nStatement st = conn.createStatement();\nResultSet rs = st.executeQuery(sql);\n```",
    payload: {
      steps: [
        { question: "Qual vulnerabilidade está presente?", options: ["XSS", "SQL Injection", "CSRF", "Clickjacking"], correct: 1, feedback: "A concatenação de entrada do usuário na consulta permite injetar SQL (ex.: login = ' OR '1'='1)." },
        { question: "Qual a correção adequada?", options: ["Usar PreparedStatement com parâmetros (?)", "Remover aspas da senha", "Usar HTTPS", "Converter o login para maiúsculas"], correct: 0, feedback: "Parâmetros vinculados separam código e dados." },
        { question: "Outro problema grave do código?", options: ["Nenhum", "Comparar senha em texto puro no banco — senhas devem ser armazenadas com hash forte (bcrypt/Argon2)", "Usar ResultSet", "Usar Java"], correct: 1, feedback: "OWASP A02 (falhas criptográficas): nunca armazene senhas em texto claro." },
      ],
    },
    solution: "PreparedStatement + hash de senha (bcrypt/Argon2) + mensagens de erro genéricas.",
  },
  {
    slug: "docker-compose-app",
    specialty: "DEV",
    topic: "dev-docker",
    kind: "COMANDO",
    title: "Docker: publicando a aplicação",
    difficulty: 2,
    prompt: "A imagem `trf3/consulta:1.0` expõe a porta 8080 (EXPOSE 8080), mas ao rodar `docker run trf3/consulta:1.0` o navegador não acessa http://localhost:8080.",
    payload: {
      steps: [
        { question: "Por que não acessa?", options: ["EXPOSE não publica a porta no host", "A imagem está corrompida", "Docker não suporta a porta 8080", "Falta o Kubernetes"], correct: 0, feedback: "EXPOSE apenas documenta; é preciso publicar a porta." },
        { question: "Comando correto?", options: ["docker run -p 8080:8080 trf3/consulta:1.0", "docker run --expose trf3/consulta:1.0", "docker build -p 8080", "docker push -p 8080"], correct: 0, feedback: "-p host:contêiner publica a porta." },
        { question: "Para subir app + PostgreSQL juntos de forma declarativa, usa-se:", options: ["docker-compose.yml com os dois serviços", "Dois Dockerfiles na mesma pasta", "git compose", "kubectl run"], correct: 0, feedback: "O Compose descreve serviços, redes e volumes em um único arquivo." },
      ],
    },
    solution: "docker run -p 8080:8080 ... ou docker compose up com serviço app + db.",
  },

  // ─────────────── SUP — troubleshooting, comandos, chamados ───────────────
  {
    slug: "sup-sem-internet-apipa",
    specialty: "SUP",
    topic: "sup-ferramentas-diagnostico",
    kind: "CENARIO",
    title: "Troubleshooting: estação sem acesso à rede",
    difficulty: 2,
    prompt: "Usuário relata que não acessa nenhum sistema. Você executa `ipconfig` e obtém:\n\n```\nAdaptador Ethernet:\n   Endereço IPv4. . . . . . . : 169.254.73.12\n   Máscara de Sub-rede . . . . : 255.255.0.0\n   Gateway Padrão. . . . . . . :\n```",
    payload: {
      steps: [
        { question: "O que o endereço indica?", options: ["IP público", "APIPA — o DHCP não respondeu", "IP fixo configurado pela TI", "Falha de DNS apenas"], correct: 1, feedback: "169.254.0.0/16 é autoconfiguração quando não há resposta DHCP." },
        { question: "Primeira verificação física?", options: ["Trocar o HD", "Verificar cabo de rede/LEDs da placa e da porta do switch", "Reinstalar o Office", "Formatar a máquina"], correct: 1, feedback: "Camada 1 primeiro: cabo, conector, porta do switch." },
        { question: "Com o cabo ok, qual comando tenta obter novo IP?", options: ["ipconfig /renew", "ipconfig /flushdns", "netstat -ano", "tracert 8.8.8.8"], correct: 0, feedback: "ipconfig /release e /renew solicitam nova concessão DHCP." },
        { question: "Se outros usuários do mesmo andar estiverem com o mesmo problema, a hipótese mais provável é:", options: ["Problema no perfil do usuário", "Escopo DHCP esgotado ou falha no servidor/relay DHCP ou no switch", "Vírus no navegador", "Monitor com defeito"], correct: 1, feedback: "Impacto coletivo sugere causa na infraestrutura: escalone ao 2º nível de redes com as evidências." },
      ],
    },
    solution: "APIPA → verificar camada física → ipconfig /renew → se coletivo, escalonar (DHCP/switch).",
  },
  {
    slug: "sup-dns-nslookup",
    specialty: "SUP",
    topic: "sup-ferramentas-diagnostico",
    kind: "CENARIO",
    title: "Troubleshooting: acessa por IP, mas não por nome",
    difficulty: 2,
    prompt: "O usuário abre o sistema digitando o IP do servidor, mas `http://sistema.intranet` não carrega. `ping 10.0.0.25` responde normalmente.",
    payload: {
      steps: [
        { question: "Qual camada/serviço é o suspeito?", options: ["Cabeamento", "Resolução de nomes (DNS)", "Fonte de alimentação", "Placa de vídeo"], correct: 1, feedback: "Se por IP funciona, a conectividade existe; falha está na resolução de nome." },
        { question: "Qual comando testa a resolução?", options: ["nslookup sistema.intranet", "chkdsk", "gpupdate", "net user"], correct: 0, feedback: "nslookup mostra qual servidor DNS respondeu e qual IP foi retornado." },
        { question: "O nslookup retorna um IP antigo. Ação na estação?", options: ["ipconfig /flushdns", "Trocar o mouse", "Desinstalar o navegador", "Reiniciar o switch"], correct: 0, feedback: "Limpa o cache do resolvedor; se persistir, verifique o registro no servidor DNS." },
      ],
    },
    solution: "DNS: nslookup → ipconfig /flushdns → verificar registro A no servidor DNS.",
  },
  {
    slug: "sup-linux-comandos",
    specialty: "SUP",
    topic: "sup-linux-basico",
    kind: "COMANDO",
    title: "Linux: criação de usuário e permissões",
    difficulty: 2,
    prompt: "Em um servidor Ubuntu, você precisa criar o usuário `ana`, instalar o pacote `htop` e permitir que apenas o dono execute o script `backup.sh`.",
    payload: {
      steps: [
        { question: "Criar usuário com diretório pessoal:", options: ["sudo useradd -m ana", "net user ana /add", "mkdir /home/ana", "sudo chmod ana"], correct: 0, feedback: "useradd -m cria /home/ana; depois defina a senha com sudo passwd ana." },
        { question: "Instalar o htop:", options: ["sudo apt install htop", "sudo yum install htop", "pip install htop", "npm install htop"], correct: 0, feedback: "Em Debian/Ubuntu use apt (após sudo apt update)." },
        { question: "Permissão rwx------ para o script:", options: ["chmod 700 backup.sh", "chmod 777 backup.sh", "chmod 644 backup.sh", "chmod 755 backup.sh"], correct: 0, feedback: "7 = rwx para o dono; 0 para grupo e outros." },
        { question: "Verificar as permissões resultantes:", options: ["ls -l backup.sh", "cat backup.sh", "pwd", "whoami"], correct: 0, feedback: "ls -l exibe permissões, dono, grupo e tamanho." },
      ],
    },
    solution: "sudo useradd -m ana && sudo passwd ana; sudo apt update && sudo apt install htop; chmod 700 backup.sh; ls -l.",
  },
  {
    slug: "sup-ad-ingresso-dominio",
    specialty: "SUP",
    topic: "sup-active-directory",
    kind: "CENARIO",
    title: "Active Directory: estação não ingressa no domínio",
    difficulty: 3,
    prompt: "Ao tentar ingressar a estação no domínio `jf3r.local`, aparece: \"Não foi possível contatar um controlador de domínio\". A estação navega normalmente na Internet. `ipconfig /all` mostra DNS = 8.8.8.8.",
    payload: {
      steps: [
        { question: "Causa mais provável?", options: ["Senha do usuário expirada", "DNS público não resolve os registros SRV do domínio interno", "Licença do Office", "Placa de vídeo"], correct: 1, feedback: "O cliente localiza o DC via DNS interno (registros SRV _ldap._tcp)." },
        { question: "Correção:", options: ["Configurar o DNS da estação para o servidor DNS interno (DC)", "Desativar o firewall definitivamente", "Trocar o cabo", "Reinstalar o Windows"], correct: 0, feedback: "Idealmente o DHCP já deve entregar o DNS interno." },
        { question: "Após o ingresso, como validar a aplicação das GPOs?", options: ["gpupdate /force e gpresult /r", "ping -t", "sfc /scannow", "diskpart"], correct: 0, feedback: "gpresult /r lista as GPOs aplicadas ao computador e ao usuário." },
      ],
    },
    solution: "Apontar DNS para o DC → ingressar → gpupdate /force → gpresult /r.",
  },
  {
    slug: "sup-impressora-fila",
    specialty: "SUP",
    topic: "sup-impressao-rede",
    kind: "CHAMADO",
    title: "Chamado: impressora de rede não imprime",
    difficulty: 1,
    prompt: "**Chamado #2026-1182** — \"Mandei imprimir 3 vezes o despacho e nada sai. A fila mostra os documentos com erro.\" (Usuária da 2ª Vara, impressora laser compartilhada pelo servidor de impressão.)",
    payload: {
      steps: [
        { question: "Como classificar o chamado no ITIL?", options: ["Requisição de serviço", "Incidente", "Problema", "Mudança"], correct: 1, feedback: "Interrupção não planejada de um serviço = incidente." },
        { question: "Primeira verificação:", options: ["Se outros usuários conseguem imprimir na mesma impressora e o status no equipamento (papel, toner, erro no painel)", "Formatar a estação", "Trocar a impressora imediatamente", "Encerrar o chamado"], correct: 0, feedback: "Defina o escopo (individual × coletivo) e verifique o equipamento." },
        { question: "Todos estão afetados e a impressora não exibe erros. Ação no servidor de impressão:", options: ["Reiniciar o serviço Spooler e limpar trabalhos travados", "Desligar o servidor de arquivos", "Apagar a conta da usuária", "Trocar o toner"], correct: 0, feedback: "Spooler travado é causa comum de filas com erro." },
        { question: "Antes de encerrar o chamado:", options: ["Confirmar com a usuária que a impressão funcionou e registrar a solução", "Encerrar sem contato", "Pedir que abra novo chamado", "Nada"], correct: 0, feedback: "Encerramento envolve validação com o usuário e documentação." },
      ],
    },
    solution: "Incidente → escopo → spooler → validação com usuária → registro na base de conhecimento.",
  },
  {
    slug: "sup-phishing-resposta",
    specialty: "SUP",
    topic: "sup-malwares",
    kind: "CHAMADO",
    title: "Chamado: usuário clicou em link suspeito",
    difficulty: 2,
    prompt: "**Chamado urgente** — \"Recebi um e-mail do 'suporte' pedindo para validar minha senha. Cliquei no link e digitei minha senha. Depois desconfiei.\"",
    payload: {
      steps: [
        { question: "Primeira ação prioritária:", options: ["Redefinir imediatamente a senha do usuário e encerrar sessões ativas", "Esperar para ver se algo acontece", "Desinstalar o navegador", "Apagar o e-mail e encerrar"], correct: 0, feedback: "Credencial comprometida deve ser invalidada imediatamente (e, se houver MFA, revisar fatores)." },
        { question: "Em seguida:", options: ["Acionar a equipe de segurança/resposta a incidentes conforme protocolo (ENSEC-PJ) e preservar o e-mail como evidência", "Divulgar o caso nas redes sociais", "Formatar o servidor de e-mail", "Nada"], correct: 0, feedback: "A Portaria CNJ nº 162/2021 prevê protocolos de gestão de incidentes." },
        { question: "Verificação na estação:", options: ["Executar varredura completa com antivírus/EDR e checar alertas", "Desativar o EDR", "Apagar os logs", "Desligar o monitor"], correct: 0, feedback: "O link pode ter baixado malware; o EDR ajuda a investigar." },
      ],
    },
    solution: "Redefinir senha/sessões → acionar segurança e preservar evidências → varredura EDR → orientar o usuário.",
  },
  {
    slug: "sup-raid-falha",
    specialty: "SUP",
    topic: "sup-raid",
    kind: "CENARIO",
    title: "Hardware: falha de disco em RAID 5",
    difficulty: 2,
    prompt: "Um servidor de arquivos com RAID 5 de 4 discos emite alerta: \"Array degradado — disco 2 com falha\". Os usuários continuam acessando os arquivos.",
    payload: {
      steps: [
        { question: "Por que os arquivos continuam acessíveis?", options: ["RAID 5 tolera a falha de 1 disco usando a paridade distribuída", "Os dados estão no RAID 0", "O servidor ignorou o erro", "Há cópia na RAM"], correct: 0, feedback: "Com 1 disco a menos, os dados são reconstruídos pela paridade." },
        { question: "Risco atual:", options: ["Nenhum", "Uma nova falha antes da reconstrução causa perda do array", "Perda de desempenho apenas na impressora", "Vírus"], correct: 1, feedback: "Em modo degradado não há mais redundância." },
        { question: "Ação recomendada:", options: ["Verificar o backup e substituir o disco defeituoso para iniciar a reconstrução (rebuild)", "Remover outro disco para testar", "Converter para RAID 0", "Desligar o alerta"], correct: 0, feedback: "Garanta backup recente; substitua por disco compatível; acompanhe o rebuild." },
      ],
    },
    solution: "RAID 5 degradado: verificar backup → substituir disco → rebuild → monitorar.",
  },
  {
    slug: "sup-sla-priorizacao",
    specialty: "SUP",
    topic: "sup-incidentes-requisicoes",
    kind: "CHAMADO",
    title: "Service Desk: priorização de chamados",
    difficulty: 2,
    prompt: "Três chamados chegam ao mesmo tempo:\n\n1. Sistema de processo eletrônico fora do ar para toda a Seção Judiciária.\n2. Servidor pede instalação de software padrão para a próxima semana.\n3. Monitor de um usuário com pixel queimado, sem impedir o trabalho.",
    payload: {
      steps: [
        { question: "Qual tem maior prioridade?", options: ["1", "2", "3"], correct: 0, feedback: "Impacto alto (muitos usuários) e urgência alta (serviço crítico parado)." },
        { question: "O chamado 2 é:", options: ["Incidente", "Requisição de serviço", "Problema", "Evento"], correct: 1, feedback: "Pedido padronizado do catálogo de serviços." },
        { question: "Se o chamado 1 se repetir várias vezes no mês, deve-se abrir:", options: ["Um registro de problema para investigar a causa raiz", "Nada", "Uma requisição de software", "Um novo SLA"], correct: 0, feedback: "Gerenciamento de problemas busca a causa raiz de incidentes recorrentes." },
      ],
    },
    solution: "1 (alta) > 3 (baixa, incidente) ; 2 é requisição. Recorrência → problema.",
  },
  {
    slug: "sup-bitlocker-recuperacao",
    specialty: "SUP",
    topic: "sup-bitlocker",
    kind: "CHAMADO",
    title: "Chamado: notebook pedindo chave do BitLocker",
    difficulty: 2,
    prompt: "Após atualização de BIOS, o notebook de um servidor exibe a tela de recuperação do BitLocker pedindo a chave de 48 dígitos.",
    payload: {
      steps: [
        { question: "Onde buscar a chave em ambiente corporativo?", options: ["No objeto do computador no Active Directory / Entra ID ou na ferramenta de gestão usada pela organização", "Na internet", "Pedir para o usuário adivinhar", "Formatar o disco"], correct: 0, feedback: "Chaves de recuperação devem ser custodiadas centralmente." },
        { question: "Antes de informar a chave ao usuário:", options: ["Confirmar a identidade do solicitante conforme o procedimento", "Enviar por e-mail sem verificar", "Publicar no Teams", "Nada"], correct: 0, feedback: "Evita engenharia social e protege os dados (LGPD)." },
        { question: "Por que a atualização de BIOS disparou a recuperação?", options: ["Mudanças medidas pelo TPM na cadeia de inicialização", "Vírus certamente", "Falta de toner", "Problema no Teams"], correct: 0, feedback: "Recomenda-se suspender o BitLocker antes de atualizar firmware." },
      ],
    },
    solution: "Recuperar a chave do AD/Entra → verificar identidade → orientar suspensão do BitLocker em futuras atualizações de firmware.",
  },
];
