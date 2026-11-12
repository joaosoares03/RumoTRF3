import { LESSONS_GERAIS } from "./gerais";
import { LESSONS_DEV } from "./dev";
import { LESSONS_SUP } from "./sup";
import { LESSONS_EXTRA } from "./extra";
export type { LessonSeed } from "./types";

export const LESSONS = [...LESSONS_GERAIS, ...LESSONS_DEV, ...LESSONS_SUP, ...LESSONS_EXTRA];

/**
 * Assuntos ADICIONAIS do edital efetivamente tratados no texto de cada aula (além do assunto principal).
 * Só inclua um assunto aqui se a aula realmente o explica — isso entra na medição de cobertura.
 */
export const LESSON_COVERS: Record<string, string[]> = {
  "argumentacao-e-falacias": ["lp-raciocinio-analitico", "lp-senso-critico", "lp-comunicacao-argumentos"],
  "lgpd-essencial": ["dev-norm-lgpd", "sup-norm-lgpd", "sup-lgpd-atendimento"],
  "improbidade-anticorrupcao": ["etica-anticorrupcao"],
  "direitos-pcd-acessibilidade": ["dh-convencao", "dh-res-cnj-401", "dh-normas-acessibilidade", "dh-prioridade", "dh-apoio-integracao"],
  "sustentabilidade-judiciario": ["sust-ods", "sust-contratacoes", "sust-pnmc", "sust-res-cnj-433", "sust-res-cjf-709", "dh-agenda-2030"],
  "javascript-typescript-essencial": ["dev-typescript"],
  "spring-boot-e-ecossistema": ["dev-spring-framework", "dev-spring-cloud-eco"],
  "apis-rest-graphql-openapi": ["dev-graphql", "dev-openapi"],
  "pje-pdpj-microsservicos": ["dev-eureka", "dev-zuul", "dev-hystrix", "dev-envers", "dev-rabbitmq", "dev-kafka", "dev-amqp", "dev-redis", "dev-keycloak-sso"],
  "engenharia-clean-solid-patterns": ["dev-clean-code", "dev-clean-architecture", "dev-design-patterns"],
  "git-cicd-docker-kubernetes": ["dev-git", "dev-cicd", "dev-kubernetes"],
  "sql-e-modelagem-relacional": ["dev-modelagem-der", "dev-postgresql", "dev-sqlserver"],
  "owasp-privacy-acessibilidade": ["dev-privacy-by-design", "dev-ux-ui", "dev-wcag", "dev-emag"],
  "armazenamento-e-raid": ["sup-dispositivos-armazenamento"],
  "windows-server-ad-dns-dhcp": ["sup-windows-server-dns-dhcp"],
  "m365-teams-onedrive-certificados": ["sup-teams", "sup-onedrive-sharepoint", "sup-navegadores", "sup-icp-brasil", "sup-videoconferencia"],
  "redes-osi-tcpip-ipv4": ["sup-tcpip", "sup-ipv4-nat"],
  "wifi-vpn-impressao-cabeamento": ["sup-vpn", "sup-impressao-rede", "sup-cabeamento"],
  "seguranca-suporte": ["sup-cid", "sup-antivirus-edr", "sup-firewall-windows", "sup-bitlocker", "sup-lgpd-atendimento"],
  "itil4-service-desk": ["sup-incidentes-requisicoes", "sup-sla", "sup-itsm-ferramentas", "sup-tecnicas-atendimento", "sup-inventario"],
  "interpretacao-e-semantica": ["lp-contexto-historico", "lp-denotacao-conotacao", "lp-discurso", "lp-intertextualidade", "lp-figuras", "lp-sinonimia"],
  "ortografia-acentuacao-pontuacao": ["lp-ortografia-acentuacao"],
  "morfologia-pronomes-verbos": ["lp-pronomes", "lp-formacao-palavras", "lp-flexao", "lp-vozes-verbo", "lp-tempos-modos"],
  "periodo-composto-coesao": ["lp-conectivos", "lp-coesao-coerencia", "lp-reescrita"],
  "estruturas-logicas-e-sequencias": ["rlm-logica-situacoes"],
  "etica-integridade-servico-publico": ["etica-moral-cidadania", "etica-contexto-publico", "etica-res-cnj-410", "etica-assedio"],
  "processo-administrativo-e-lai": ["etica-lai"],
  "teoria-direitos-fundamentais": ["dh-dh-df", "dh-dudh"],
  "python-csharp-php": ["dev-csharp", "dev-php"],
  "front-end-html-css-frameworks": ["dev-html5", "dev-css3", "dev-angular", "dev-vue", "dev-pje-angular"],
  "orm-jpa-hibernate-ef-doctrine": ["dev-hibernate", "dev-ef-core", "dev-doctrine"],
  "pje-jsf-primefaces-maven-servidores": ["dev-primefaces", "dev-maven", "dev-wildfly", "dev-tomcat", "dev-nginx"],
  "bpmn-e-jbpm": ["dev-jbpm"],
  "flyway-e-business-intelligence": ["dev-data-warehouse", "dev-etl", "dev-olap"],
  "normativos-cnj-ti": ["dev-norm-res-522", "dev-norm-port-252-253", "dev-norm-port-131", "dev-norm-ensec", "sup-norm-res-335", "sup-norm-res-522", "sup-norm-ensec"],
  "perifericos-moveis-drivers-rds": ["sup-moveis-intune", "sup-diagnostico-falhas", "sup-drivers", "sup-rds"],
};
