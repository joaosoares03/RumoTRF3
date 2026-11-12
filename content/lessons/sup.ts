import type { LessonSeed } from "./types";

export const LESSONS_SUP: LessonSeed[] = [
  {
    slug: "organizacao-de-computadores",
    topic: "sup-organizacao-computadores",
    title: "Organização de computadores: placa-mãe, processador, memórias e barramentos",
    minutes: 30,
    summary: "CPU (ULA, UC, registradores), multi-core × threads (SMT). Hierarquia de memória: registradores > cache L1/L2/L3 > RAM > armazenamento. RAM volátil (DDR4/DDR5, dual channel); ROM/flash do firmware (BIOS/UEFI). Barramentos: PCIe (lanes x1/x4/x16), SATA, USB. Chipset intermedia comunicação.",
    content: `## Componentes

- **Placa-mãe:** interliga tudo. Contém soquete do processador, slots de memória, slots **PCIe**, conectores **SATA/M.2**, **chipset** e o firmware (**BIOS/UEFI**).
- **Processador (CPU):** **ULA** (operações aritméticas e lógicas), **unidade de controle**, **registradores** e **caches**. Ciclo **busca → decodificação → execução**.
- **Multi-core:** vários núcleos físicos executando em paralelo. **SMT/Hyper-Threading:** cada núcleo físico expõe 2 threads lógicas (não dobra o desempenho).

## Hierarquia de memória

| Nível | Velocidade | Capacidade | Volátil? |
|---|---|---|---|
| Registradores | máxima | bytes | sim |
| Cache L1 / L2 / L3 | muito alta | KB–MB | sim |
| RAM (DDR4/DDR5) | alta | GB | sim |
| SSD/HD | menor | TB | não |

- **ROM/flash** guarda o firmware (UEFI), **não volátil**.
- **Dual channel:** módulos idênticos em pares de slots corretos aumentam a largura de banda.
- Falta de RAM → uso intenso de **memória virtual** (arquivo de paginação) → lentidão.

## Barramentos e interfaces

- **PCI Express:** serial, ponto a ponto, em *lanes* (x1, x4, x8, x16). Placas de vídeo usam x16; SSD NVMe usa x4.
- **SATA III:** até 6 Gbit/s (HDs e SSDs SATA).
- **USB:** 2.0 (480 Mbit/s), 3.x (5–20 Gbit/s), USB-C é o conector.

## Firmware

- **UEFI** substituiu a BIOS legada: suporta discos **GPT** (> 2 TB), **Secure Boot**, interface gráfica.
- **POST:** autoteste na inicialização; códigos de bipes/LEDs indicam falhas (consulte o manual do fabricante).

## Resumo

Saiba a função de cada componente, a hierarquia de memória e as interfaces PCIe/SATA/USB.`,
  },
  {
    slug: "armazenamento-e-raid",
    topic: "sup-raid",
    title: "Armazenamento (HD, SSD SATA/NVMe, SAS) e RAID",
    minutes: 30,
    summary: "HD mecânico (SATA/SAS, rpm, latência). SSD flash sem partes móveis; M.2 é formato (SATA ou NVMe/PCIe). SAS: corporativo, full-duplex, dual-port. RAID 0 (striping, sem redundância), 1 (espelho, 50%), 5 (paridade, n−1, tolera 1, mín. 3), 6 (dupla paridade, n−2, tolera 2, mín. 4), 10 (espelho+striping, 50%, mín. 4). RAID não é backup.",
    content: `## Discos

| Tipo | Interface | Características |
|---|---|---|
| HD | SATA | mecânico, barato por TB, 5.400/7.200 rpm |
| HD | **SAS** | corporativo, 10k/15k rpm, **full-duplex**, **porta dupla** |
| SSD | SATA | flash, sem partes móveis, limitado a ~600 MB/s pela interface |
| SSD | **NVMe (PCIe)** | múltiplas filas, baixa latência, GB/s |

- **M.2 é um formato físico**: pode ser SATA ou NVMe — verifique a chave (B/M) e o suporte da placa.
- Controladoras SAS geralmente aceitam discos SATA; o inverso não.
- SSDs usam **TRIM** e têm vida útil medida em TBW; não desfragmente SSD.

## RAID

| Nível | Técnica | Mín. discos | Capacidade útil | Tolera |
|---|---|---|---|---|
| **0** | striping | 2 | 100% | **nenhuma falha** |
| **1** | espelhamento | 2 | 50% | 1 disco |
| **5** | striping + paridade distribuída | 3 | (n − 1) × disco | 1 disco |
| **6** | dupla paridade | 4 | (n − 2) × disco | 2 discos |
| **10** | espelhamento + striping | 4 | 50% | 1 por par espelhado |

> Exemplo: RAID 5 com 4 × 2 TB → 6 TB úteis.

- **Array degradado:** ainda funciona, mas sem redundância — substitua o disco e acompanhe o **rebuild**.
- **Hot spare:** disco reserva que entra automaticamente.
- **RAID não é backup:** não protege contra exclusão acidental, ransomware ou incêndio. Regra **3-2-1** de backup: 3 cópias, 2 mídias, 1 fora do local.

## Resumo

Memorize a tabela de RAID (capacidade e tolerância), diferencie formato M.2 de protocolo NVMe e lembre: RAID ≠ backup.`,
  },
  {
    slug: "windows-administracao-local",
    topic: "sup-windows-10-11",
    title: "Windows 10/11: instalação, usuários locais, eventos, UAC e Windows Update",
    minutes: 35,
    summary: "Win11 exige TPM 2.0, UEFI/Secure Boot, 4 GB RAM, 64 GB. Contas locais: lusrmgr.msc, net user /add, net localgroup administradores. eventvwr.msc (Aplicativo, Segurança, Sistema). UAC: elevação sob demanda. Windows Update, WSUS, Windows Update for Business. Ferramentas: msconfig, services.msc, devmgmt.msc, sfc /scannow, DISM, chkdsk.",
    content: `## Instalação

- **Windows 11 — requisitos:** CPU 64 bits compatível (≥ 1 GHz, 2 núcleos), **4 GB RAM**, **64 GB**, firmware **UEFI com Secure Boot**, **TPM 2.0**, DirectX 12.
- Mídia: Ferramenta de Criação de Mídia (pendrive) ou imagem corporativa (WDS/MDT, Autopilot/Intune).
- Partições GPT: EFI, MSR, Windows, Recuperação.

## Usuários e grupos locais

\`\`\`bat
net user joao Senha@123 /add
net localgroup Administradores joao /add
net user joao /active:no
\`\`\`

Interfaces: **lusrmgr.msc** (Pro/Enterprise), Configurações > Contas, \`netplwiz\`.

## Registros de eventos

**eventvwr.msc** → Logs do Windows: **Aplicativo**, **Segurança** (logon, auditoria), **Instalação**, **Sistema** (drivers, serviços). Níveis: Informação, Aviso, Erro, Crítico. Filtre por ID de evento e origem.

## UAC (Controle de Conta de Usuário)

Mesmo administradores trabalham com **token padrão**; ações privilegiadas pedem **elevação** (consentimento ou credenciais). Não desative o UAC — ele limita o impacto de malware.

## Windows Update

- Atualizações de qualidade (mensais, "Patch Tuesday") e de recursos.
- Em empresas: **WSUS** (aprovação centralizada), **Windows Update for Business**, **Intune**.
- Problemas: \`services.msc\` (serviço Windows Update), solução de problemas integrada, limpar \`SoftwareDistribution\`.

## Caixa de ferramentas do técnico

| Ferramenta | Uso |
|---|---|
| \`sfc /scannow\` | verifica/repara arquivos do sistema |
| \`DISM /Online /Cleanup-Image /RestoreHealth\` | repara a imagem do Windows |
| \`chkdsk C: /f\` | corrige erros do sistema de arquivos |
| \`msconfig\` / Gerenciador de Tarefas > Inicializar | programas de inicialização |
| \`devmgmt.msc\` | drivers |
| \`services.msc\` | serviços |
| \`compmgmt.msc\` | gerenciamento do computador |

## Resumo

Requisitos do Win11, comandos de usuários, logs no Visualizador de Eventos, papel do UAC e gestão corporativa de atualizações.`,
  },
  {
    slug: "windows-server-ad-dns-dhcp",
    topic: "sup-active-directory",
    title: "Windows Server, Active Directory, GPO, DNS e DHCP",
    minutes: 40,
    summary: "Server Manager: adicionar funções e recursos. AD DS: domínio, floresta, OUs, controladores de domínio; depende de DNS (registros SRV). Tarefas: criar usuário (dsa.msc/New-ADUser), redefinir senha, desbloquear conta, ingressar no domínio. GPO: LSDOU, gpupdate /force, gpresult /r. DHCP: DORA, escopo, reservas, APIPA. DNS: A, AAAA, CNAME, MX, PTR, SRV; zonas direta e reversa.",
    content: `## Server Manager

Console para **adicionar funções e recursos** (AD DS, DNS, DHCP, Serviços de Impressão, IIS, RDS) e monitorar servidores.

## Active Directory Domain Services

- **Domínio:** limite administrativo e de autenticação (ex.: \`jf3r.local\`). **Floresta:** conjunto de domínios. **OU:** contêiner para organizar objetos e vincular GPOs.
- **Controlador de domínio (DC):** autentica (Kerberos) e replica o AD.
- O AD **depende do DNS**: estações localizam DCs pelos registros **SRV**.

### Tarefas operacionais

| Tarefa | Como |
|---|---|
| Criar usuário | Usuários e Computadores do AD (\`dsa.msc\`) ou \`New-ADUser\` |
| Redefinir senha / desbloquear | \`dsa.msc\` → Redefinir senha (marcar "alterar no próximo logon") |
| Ingressar computador | Configurações > Sistema > Sobre > Domínio, ou \`Add-Computer -DomainName jf3r.local\` (DNS da estação apontando para o DNS interno!) |
| Verificar políticas | \`gpresult /r\`, \`gpresult /h relatorio.html\` |
| Forçar políticas | \`gpupdate /force\` |

## GPO (Group Policy Objects)

- Gerenciadas no **GPMC** (\`gpmc.msc\`). Configurações de **Computador** (aplicadas na inicialização) e de **Usuário** (no logon).
- Ordem **LSDOU**: Local → Site → Domínio → OU (a última aplicada prevalece). Exceções: **Enforced** e **Bloquear herança**.
- Filtragem por grupos de segurança e filtros WMI.

## DHCP

- Processo **DORA**: Discover → Offer → Request → Acknowledge (UDP 67/68).
- **Escopo** (faixa), **exclusões**, **reservas** (IP fixo por MAC), **opções** (gateway 003, DNS 006, domínio 015), **duração da concessão**.
- Sem resposta DHCP → **APIPA 169.254.x.x**. Em outra sub-rede, é preciso **DHCP relay** (ip helper) no roteador.

## DNS

| Registro | Função |
|---|---|
| A / AAAA | nome → IPv4 / IPv6 |
| CNAME | apelido |
| MX | servidor de e-mail |
| PTR | reverso (IP → nome) |
| SRV | localização de serviços (AD, SIP) |
| NS / SOA | autoridade da zona |

Zonas **direta** e **reversa**; zonas **integradas ao AD** replicam com o AD. Cliente: \`ipconfig /displaydns\`, \`ipconfig /flushdns\`, \`nslookup\`.

## Resumo

AD depende de DNS; GPO segue LSDOU; DHCP segue DORA e falha em APIPA; saiba os registros DNS.`,
  },
  {
    slug: "linux-ubuntu-debian-basico",
    topic: "sup-linux-basico",
    title: "Linux (Ubuntu/Debian): terminal, arquivos, usuários e pacotes",
    minutes: 35,
    summary: "Navegação: pwd, ls -la, cd. Arquivos: cp -r, mv, rm -r, mkdir -p, touch, cat, less, head/tail -f, grep, find. Permissões rwx (r=4, w=2, x=1): chmod 754, chown usuario:grupo. Usuários: useradd -m / adduser, passwd, usermod -aG sudo, /etc/passwd e /etc/shadow. Pacotes: apt update, apt upgrade, apt install, apt remove/purge, dpkg -i.",
    content: `## Estrutura de diretórios

\`/\` raiz · \`/home\` usuários · \`/etc\` configurações · \`/var/log\` logs · \`/usr/bin\` programas · \`/tmp\` temporários · \`/root\` home do root.

## Comandos essenciais

\`\`\`bash
pwd                      # diretório atual
ls -la                   # lista com detalhes e ocultos
cd /var/log              # navegar
mkdir -p projetos/2026   # cria diretórios (com pais)
cp -r origem destino     # copia diretório
mv antigo.txt novo.txt   # move/renomeia
rm -r pasta              # remove diretório (cuidado!)
cat arquivo; less arquivo; tail -f /var/log/syslog
grep -i "erro" /var/log/syslog
find / -name "*.conf" 2>/dev/null
df -h; du -sh *; free -h; top / htop
ip a; ping -c 4 8.8.8.8
\`\`\`

## Permissões

\`-rwxr-xr--\` → tipo, **dono** (rwx), **grupo** (r-x), **outros** (r--).

| Letra | Valor |
|---|---|
| r | 4 |
| w | 2 |
| x | 1 |

\`chmod 754 script.sh\` · \`chmod u+x script.sh\` · \`chown ana:ti relatorio.txt\`.

## Usuários e grupos

\`\`\`bash
sudo useradd -m -s /bin/bash ana   # cria com home e shell
sudo passwd ana                    # define senha
sudo adduser ana                   # alternativa interativa (Debian/Ubuntu)
sudo usermod -aG sudo ana          # adiciona ao grupo sudo
sudo deluser ana                   # remove
id ana; groups ana
\`\`\`

Arquivos: \`/etc/passwd\` (contas), \`/etc/shadow\` (hashes de senha), \`/etc/group\`.

## Pacotes (APT)

\`\`\`bash
sudo apt update          # atualiza a LISTA de pacotes
sudo apt upgrade         # atualiza os pacotes instalados
sudo apt install htop
sudo apt remove htop     # remove (mantém configs)
sudo apt purge htop      # remove com configurações
apt search nginx; apt show nginx
sudo dpkg -i pacote.deb  # instala .deb local
\`\`\`

## Resumo

Navegação, manipulação de arquivos, notação octal de permissões, criação de usuários e o par \`apt update\` × \`apt upgrade\`.`,
  },
  {
    slug: "m365-teams-onedrive-certificados",
    topic: "sup-office",
    title: "Microsoft 365, Teams, OneDrive/SharePoint, navegadores e certificados ICP-Brasil",
    minutes: 35,
    summary: "Outlook: .ost (cache Exchange) × .pst; perfis; modo cache. Excel: referências relativas/absolutas, PROCV/PROCX. Teams: arquivos de canal no SharePoint; de chat no OneDrive. OneDrive: Arquivos Sob Demanda, ícones de status, compartilhamento por link com permissões. Navegadores: Ctrl+Shift+Del, extensões, proxy do sistema, certificados. ICP-Brasil: A1 (arquivo) × A3 (token/smart card), drivers/middleware, cadeia de certificados.",
    content: `## Microsoft 365 Apps

- **Word/Excel/PowerPoint:** reparo rápido/online em Configurações > Aplicativos; modo de segurança (\`winword /safe\`) para isolar suplementos.
- **Excel:** referências **relativas** (A1), **absolutas** (\$A\$1) e **mistas** (A\$1, \$A1); funções PROCV/PROCX, SE, SOMASE, CONT.SE.
- **Outlook:** perfis de e-mail (Painel de Controle > Email); modo **cache do Exchange** gera o **.ost**; **.pst** guarda arquivos de dados pessoais/arquivamento. Problemas de sincronização → recriar o perfil ou o .ost.

## Teams, SharePoint e OneDrive

- Cada **equipe** do Teams tem um **site do SharePoint**; cada **canal padrão** é uma pasta na biblioteca de documentos. Canais **privados/compartilhados** têm sites próprios.
- Arquivos enviados em **chats** ficam no **OneDrive** de quem enviou.
- **Reuniões:** agendadas pelo Outlook/Teams; gravações armazenadas no OneDrive/SharePoint.
- **OneDrive — Arquivos Sob Demanda:** ☁ somente online · ✔ disponível localmente · ● sempre manter neste dispositivo.
- **Compartilhamento:** link para "qualquer pessoa", "pessoas da organização" ou "pessoas específicas"; permissões de **exibição** ou **edição**. Problemas de sincronização: pausar/retomar, verificar caminho muito longo e caracteres inválidos, redefinir o OneDrive.

## Navegadores (Edge e Chrome)

- **Ctrl + Shift + Del:** limpar cache, cookies e histórico. **Ctrl + F5:** recarregar ignorando cache.
- **Extensões:** desative para isolar problemas (teste em janela anônima/InPrivate).
- **Proxy:** ambos usam, em regra, as configurações de proxy do Windows (ou PAC/WPAD definidos por GPO).
- **Certificados:** erro "conexão não é particular" → data/hora do sistema, cadeia de certificação ausente ou inspeção TLS do proxy.

## Certificação digital ICP-Brasil

| Tipo | Armazenamento | Observação |
|---|---|---|
| **A1** | arquivo no computador (repositório do SO/navegador) | pode ser exportado (.pfx) |
| **A3** | **hardware criptográfico**: token USB ou smart card | chave privada não sai do dispositivo |

Para uso no PJe e em sistemas judiciais: instalar o **driver/middleware** do token ou leitora, a **cadeia de certificados** da AC (raiz ICP-Brasil) e, quando exigido, o assinador/aplicativo indicado pelo sistema. Problemas comuns: PIN bloqueado (usar PUK), certificado expirado, driver incompatível.

## Videoconferência

Verifique permissões de microfone/câmera (Windows e navegador), dispositivo padrão selecionado no app, largura de banda e atualizações do cliente.

## Resumo

Saiba onde os arquivos do Teams ficam, os estados do OneDrive, diferenças .ost/.pst e A1/A3 e o roteiro de diagnóstico de navegadores.`,
  },
  {
    slug: "redes-osi-tcpip-ipv4",
    topic: "sup-osi",
    title: "Redes: OSI, TCP/IP, IPv4, sub-redes e NAT",
    minutes: 40,
    summary: "OSI 7 camadas (Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação); TCP/IP 4 camadas. Equipamentos: hub (1), switch (2), roteador (3). TCP (conexão, handshake SYN/SYN-ACK/ACK, confiável) × UDP. Portas: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3389 RDP. IPv4 32 bits; CIDR; hosts = 2^h − 2. Privados RFC 1918. NAT/PAT.",
    content: `## Modelos de referência

| OSI | TCP/IP | Exemplos | Equipamento |
|---|---|---|---|
| 7 Aplicação | Aplicação | HTTP, DNS, SMTP | — |
| 6 Apresentação | Aplicação | TLS, codificação | — |
| 5 Sessão | Aplicação | — | — |
| 4 Transporte | Transporte | **TCP, UDP** | firewall de estado |
| 3 Rede | Internet | **IP, ICMP** | **roteador** |
| 2 Enlace | Acesso à rede | Ethernet, Wi-Fi, ARP, MAC | **switch** |
| 1 Física | Acesso à rede | cabos, sinais | hub, repetidor |

## TCP × UDP

- **TCP:** orientado à conexão (**SYN → SYN-ACK → ACK**), confiável, ordenado, controle de fluxo/congestionamento.
- **UDP:** sem conexão, sem garantia, menor overhead (DNS, DHCP, VoIP, streaming).

### Portas que caem

20/21 FTP · 22 SSH · 23 Telnet · 25 SMTP · **53 DNS** · **67/68 DHCP** · **80 HTTP** · 110 POP3 · 143 IMAP · **443 HTTPS** · 445 SMB · 587 SMTP submissão · 993 IMAPS · **3389 RDP**.

## IPv4

- 32 bits em 4 octetos. Máscara define rede/host. Notação **CIDR**: /24 = 255.255.255.0.
- **Hosts utilizáveis = 2^(bits de host) − 2** (rede e broadcast).

| Prefixo | Máscara | Hosts |
|---|---|---|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /30 | 255.255.255.252 | 2 |

> 192.168.10.64/26 → rede .64, hosts .65–.126, broadcast .127.

- **Privados (RFC 1918):** 10.0.0.0/8 · 172.16.0.0/12 (até 172.31.255.255) · 192.168.0.0/16.
- **Especiais:** 127.0.0.0/8 loopback · 169.254.0.0/16 APIPA · 0.0.0.0.

## NAT

Traduz endereços privados para públicos. **PAT/NAT overload** usa portas para que vários hosts compartilhem um IP público. **Port forwarding** publica um serviço interno.

## Resumo

Mapeie protocolo → camada → equipamento, decore as portas e faça cálculos de sub-rede com 2^h − 2.`,
  },
  {
    slug: "diagnostico-de-conectividade",
    topic: "sup-ferramentas-diagnostico",
    title: "Diagnóstico de conectividade: ping, tracert, nslookup, ipconfig e netstat",
    minutes: 30,
    summary: "Roteiro de baixo para cima: física → IP (ipconfig) → gateway (ping) → internet por IP → DNS (nslookup). ipconfig /all, /release, /renew, /flushdns, /displaydns. ping (ICMP echo; -t contínuo; -n contagem). tracert/traceroute (TTL). nslookup (servidor e resposta DNS). netstat -ano (conexões + PID), -r (rotas). Linux: ip a, ip route, ss -tulpn, dig.",
    content: `## Roteiro de diagnóstico (de baixo para cima)

1. **Físico:** cabo, LED da placa e da porta do switch, Wi-Fi conectado.
2. **Configuração IP:** \`ipconfig /all\` → IP válido? (169.254 = APIPA), máscara, gateway, DNS.
3. **Gateway:** \`ping 192.168.1.1\`.
4. **Fora da rede por IP:** \`ping 8.8.8.8\` (se ICMP for permitido).
5. **DNS:** \`nslookup www.trf3.jus.br\` → se por IP funciona e por nome não, o problema é DNS.
6. **Caminho:** \`tracert destino\` → em qual salto para.
7. **Aplicação/porta:** \`netstat -ano\`, \`Test-NetConnection host -Port 443\` (PowerShell).

## ipconfig (Windows)

| Comando | Função |
|---|---|
| \`ipconfig\` / \`/all\` | configuração resumida / completa (MAC, DHCP, DNS) |
| \`/release\` + \`/renew\` | libera e renova a concessão DHCP |
| \`/flushdns\` | limpa o cache do resolvedor DNS |
| \`/displaydns\` | exibe o cache DNS |

## ping

Usa **ICMP Echo Request/Reply**. \`ping -t\` (contínuo), \`ping -n 10\` (10 pacotes), \`ping -a IP\` (resolve nome). Linux: \`ping -c 4\`. Ausência de resposta pode ser **firewall**, não necessariamente falha.

## tracert / traceroute

Envia pacotes com **TTL** crescente; cada roteador que zera o TTL devolve **ICMP Time Exceeded**, revelando os saltos. Asteriscos = salto que não responde (pode ser filtro).

## nslookup

\`\`\`
nslookup sistema.intranet
nslookup -type=mx trf3.jus.br
nslookup www.exemplo.com 8.8.8.8   (consulta um servidor específico)
\`\`\`

## netstat

- \`netstat -ano\` → conexões e portas em escuta com **PID** (cruze com o Gerenciador de Tarefas).
- \`netstat -r\` → tabela de rotas (equivale a \`route print\`).
- Estados: LISTENING, ESTABLISHED, TIME_WAIT, SYN_SENT.

## Equivalentes no Linux

\`ip a\` (ifconfig), \`ip route\`, \`ss -tulpn\` (netstat), \`dig\`/\`host\` (nslookup), \`traceroute\`, \`resolvectl flush-caches\`.

## Resumo

Siga o roteiro em camadas e escolha a ferramenta pelo sintoma: sem IP (ipconfig), sem rota (ping/tracert), sem nome (nslookup), porta/processo (netstat).`,
  },
  {
    slug: "wifi-vpn-impressao-cabeamento",
    topic: "sup-wifi",
    title: "Redes sem fio, VPN, impressão em rede e cabeamento estruturado",
    minutes: 30,
    summary: "802.11n (Wi-Fi 4, 2,4/5 GHz), 802.11ac (Wi-Fi 5, 5 GHz), 802.11ax (Wi-Fi 6, 2,4/5 GHz; 6E: 6 GHz). Segurança: WPA2/WPA3 Personal (senha) × Enterprise (802.1X/RADIUS). VPN IPSec (camada 3; UDP 500/4500) × SSL/TLS (443). Impressão: servidor de impressão, drivers, spooler, porta TCP/IP padrão (9100). Cabeamento: Cat5e 1 Gbps; Cat6 10 Gbps ~55 m; Cat6A 10 Gbps 100 m; Cat7 blindado; canal máx. 100 m; T568A/B.",
    content: `## Redes sem fio

| Padrão | Geração | Faixas |
|---|---|---|
| 802.11n | Wi-Fi 4 | 2,4 e 5 GHz |
| 802.11ac | Wi-Fi 5 | 5 GHz |
| 802.11ax | Wi-Fi 6 / 6E | 2,4 e 5 GHz (6E: + 6 GHz) |

- 2,4 GHz: maior alcance, mais interferência (canais 1, 6, 11 sem sobreposição). 5 GHz: maior velocidade, menor alcance.
- **Segurança:** WEP e WPA (TKIP) são obsoletos. Use **WPA2-AES** ou **WPA3**.
  - **Personal (PSK/SAE):** senha compartilhada.
  - **Enterprise:** autenticação individual via **802.1X + RADIUS** (integrável ao AD); permite revogar acessos por usuário.
- Diagnóstico: \`netsh wlan show interfaces\`, esquecer a rede e reconectar, atualizar driver.

## VPN

| | IPSec | SSL/TLS |
|---|---|---|
| Camada | Rede (3) | Transporte/Aplicação |
| Portas | UDP 500 (IKE), 4500 (NAT-T), ESP | TCP/UDP 443 |
| Cliente | nativo do SO ou dedicado | cliente leve ou navegador |

Problemas comuns: credenciais/MFA, certificado expirado, **horário do sistema errado**, portas bloqueadas na rede de origem, **conflito de faixa IP** entre a rede doméstica e a corporativa.

## Impressão em rede

- **Servidor de impressão** (função do Windows Server): centraliza **drivers**, **filas** e permissões; publica impressoras no AD/GPO.
- Porta TCP/IP padrão (RAW 9100) ou IPP. Fila travada → reiniciar o **Spooler**.

## Cabeamento estruturado

| Categoria | Desempenho típico |
|---|---|
| Cat5e | 1 Gbit/s, 100 MHz |
| Cat6 | 1 Gbit/s; 10 Gbit/s até ~55 m; 250 MHz |
| Cat6A | 10 Gbit/s até 100 m; 500 MHz |
| Cat7 | blindado (S/FTP), 600 MHz |

- **Canal máximo: 100 m** (90 m de enlace permanente + 10 m de cordões).
- Conector **RJ-45**; padrões de crimpagem **T568A** e **T568B** (iguais nas duas pontas = cabo direto).
- Subsistemas: entrada, sala de equipamentos, backbone, cabeamento horizontal, área de trabalho.

## Resumo

Associe padrões Wi-Fi às gerações, Personal × Enterprise, IPSec × SSL e decore os 100 m do canal.`,
  },
  {
    slug: "seguranca-suporte",
    topic: "sup-malwares",
    title: "Segurança no suporte: CID, malwares, antivírus/EDR, Firewall, BitLocker e LGPD",
    minutes: 35,
    summary: "CID + autenticidade e não repúdio. Malwares: vírus (hospedeiro), worm (autopropagação), trojan, ransomware, spyware/keylogger, rootkit, botnet. Engenharia social e phishing (spear, smishing, vishing). Antivírus (assinatura/heurística) × EDR (comportamento, telemetria, resposta, isolamento). Firewall do Windows: perfis Domínio/Privado/Público, regras de entrada/saída. BitLocker: TPM, chave de recuperação 48 dígitos. LGPD no atendimento: necessidade, identidade, sigilo.",
    content: `## Princípios

**Confidencialidade** (acesso só a autorizados) · **Integridade** (sem alteração indevida) · **Disponibilidade** (acessível quando necessário). Complementares: **autenticidade** e **irretratabilidade (não repúdio)**.

## Ameaças

| Ameaça | Característica |
|---|---|
| Vírus | infecta arquivos hospedeiros; precisa ser executado |
| Worm | **propaga-se sozinho** pela rede explorando vulnerabilidades |
| Cavalo de Troia | aparenta ser legítimo, executa ações ocultas |
| **Ransomware** | criptografa dados e exige resgate |
| Spyware / keylogger | espiona / captura teclas |
| Rootkit | esconde a presença do invasor |
| Bot / botnet | máquina controlada remotamente |
| **Phishing** | fraude por e-mail/site falso para obter dados (spear phishing: direcionado; smishing: SMS; vishing: voz) |
| Engenharia social | manipulação psicológica (urgência, autoridade) |

**Sinais de phishing:** remetente estranho, urgência, links com domínio diferente (passe o mouse), anexos inesperados, pedido de senha. A TI **nunca** pede senha por e-mail.

## Antivírus × EDR

- **Antivírus:** assinaturas + heurística; bloqueia arquivos maliciosos conhecidos.
- **EDR:** monitora **comportamento** continuamente, coleta telemetria, permite **investigação** e **resposta** (isolar a máquina, matar processo). O técnico deve verificar se o **agente está ativo e atualizado** — nunca desativá-lo para "resolver lentidão".

## Firewall do Windows Defender

- Perfis **Domínio, Privado e Público** (o mais restritivo).
- Regras de **entrada** e **saída** por programa, porta, protocolo e endereço. Console: \`wf.msc\`; PowerShell: \`New-NetFirewallRule\`.

## BitLocker

- Criptografa **volumes inteiros**; usa o **TPM** para proteger a chave (opcionalmente com PIN).
- **Chave de recuperação de 48 dígitos** — custodiada no AD/Entra ID ou ferramenta corporativa.
- Suspenda o BitLocker antes de atualizar BIOS/UEFI para evitar a tela de recuperação.
- Edições Pro/Enterprise/Education (a Home tem "criptografia do dispositivo").

## LGPD no atendimento

- **Confirme a identidade** antes de redefinir senhas ou informar dados.
- **Necessidade:** acesse e solicite apenas o dado indispensável ao chamado.
- Não compartilhe dados pessoais em canais inadequados; registre o atendimento.
- Incidentes de segurança devem ser comunicados conforme os protocolos internos (ENSEC-PJ).

## Resumo

Diferencie vírus/worm/ransomware, reconheça phishing, saiba o papel do EDR, perfis do firewall, TPM e chave do BitLocker, e aplique a LGPD no atendimento.`,
  },
  {
    slug: "itil4-service-desk",
    topic: "sup-itil-service-desk",
    title: "ITIL 4 e Service Desk: incidentes, requisições, SLA e ferramentas ITSM",
    minutes: 35,
    summary: "ITIL 4: sistema de valor de serviço, cadeia de valor, 7 princípios orientadores, 34 práticas. Service Desk = SPOC. Incidente (interrupção não planejada) × requisição (pedido pré-definido) × problema (causa). Ciclo do chamado: registro, categorização, priorização (impacto × urgência), diagnóstico, escalonamento (funcional/hierárquico), resolução, encerramento. SLA (cliente), OLA (interno), UC (terceiros). GLPI, OTRS, Jira SM. CMDB/ativos.",
    content: `## ITIL 4 em uma página

- **Sistema de Valor de Serviço (SVS):** princípios orientadores, governança, **cadeia de valor de serviço**, práticas e melhoria contínua.
- **Cadeia de valor:** planejar, melhorar, engajar, desenho e transição, obter/construir, entregar e suportar.
- **4 dimensões:** organizações e pessoas; informação e tecnologia; parceiros e fornecedores; fluxos de valor e processos.
- **7 princípios orientadores:** foco no valor · começar de onde você está · progredir iterativamente com feedback · colaborar e promover visibilidade · pensar e trabalhar holisticamente · manter simples e prático · otimizar e automatizar.

## Central de Serviços (Service Desk)

**Ponto único de contato (SPOC)** entre o provedor e os usuários: captura incidentes e requisições, por múltiplos canais (telefone, portal, chat, e-mail), com foco em **empatia** e experiência do usuário.

## Conceitos

| Termo | Definição | Exemplo |
|---|---|---|
| **Incidente** | interrupção não planejada ou redução da qualidade de um serviço | impressora da vara parou |
| **Requisição de serviço** | pedido pré-definido, parte da entrega normal | redefinir senha, instalar software padrão |
| **Problema** | causa, real ou potencial, de um ou mais incidentes | falha recorrente do switch do 3º andar |
| **Erro conhecido** | problema com causa analisada (com ou sem solução definitiva) | — |
| **Solução de contorno** | reduz o impacto sem resolver a causa | reiniciar o serviço |

## Ciclo de vida do chamado

1. **Registro** (canal, solicitante, descrição, evidências).
2. **Categorização** (serviço, tipo, item de configuração).
3. **Priorização** = **impacto × urgência**.
4. Diagnóstico inicial (base de conhecimento).
5. **Escalonamento:** **funcional** (para equipe mais especializada — 2º/3º nível) ou **hierárquico** (para gestores).
6. Resolução e recuperação.
7. **Encerramento:** confirmar com o usuário, documentar a solução, pesquisa de satisfação.

## Acordos de nível

- **SLA:** entre provedor e **cliente** (ex.: incidente crítico atendido em 30 min e resolvido em 4 h).
- **OLA:** entre o provedor e **equipes internas**.
- **UC (contrato de apoio):** com **fornecedores externos**.

## Ferramentas ITSM

**GLPI** (open source, chamados + inventário), **OTRS** (e o fork comunitário Znuny), **Jira Service Management** (Atlassian). Recursos: portal de autoatendimento, catálogo de serviços, SLA com alertas, base de conhecimento, relatórios.

## Técnicas de atendimento

Escuta ativa, linguagem clara sem jargões, confirmar entendimento, gerenciar expectativas (prazos realistas), registrar tudo, nunca culpar o usuário.

## Inventário e ativos

**Gestão de ativos de TI** (ciclo de vida: aquisição → uso → descarte) e **gerenciamento de configuração** (**CMDB** com itens de configuração e relacionamentos). Agentes de inventário (ex.: GLPI Agent) coletam hardware e software automaticamente.

## Resumo

Diferencie incidente/requisição/problema, prioridade = impacto × urgência, escalonamento funcional × hierárquico e SLA/OLA/UC.`,
  },
];
