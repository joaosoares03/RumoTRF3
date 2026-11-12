import { q } from "./helpers";

/** Questões autorais — Conhecimentos Específicos, cargo 007 (Suporte Técnico). */
export const QUESTIONS_SUP = [
  // ───────── Hardware ─────────
  q("SUP-001", "sup-organizacao-computadores", 1, "Na hierarquia de memória de um computador, a memória mais rápida e de menor capacidade, localizada dentro do processador, é:", [
    ["a memória RAM.", "Mais lenta e de maior capacidade que a cache."],
    ["o SSD.", "Armazenamento secundário, muito mais lento."],
    ["a memória cache L1.", "Correta: fica no núcleo do processador, com latência mínima."],
    ["a memória ROM.", "Armazena firmware; não é a mais rápida."],
    ["o HD.", "Armazenamento secundário mecânico, o mais lento da lista."],
  ], 2, "Ordem típica (mais rápida → mais lenta): registradores, cache L1, L2, L3, RAM, SSD, HD.", "Stallings, W. Arquitetura e Organização de Computadores — hierarquia de memória."),

  q("SUP-002", "sup-organizacao-computadores", 1, "Sobre memórias, é correto afirmar:", [
    ["A RAM é não volátil e mantém os dados sem energia.", "A RAM é volátil."],
    ["A ROM é volátil e perde o firmware ao desligar.", "A ROM é não volátil."],
    ["A RAM é volátil; a ROM (e variações como flash do firmware) é não volátil.", "Correta."],
    ["A cache é um tipo de armazenamento secundário.", "A cache é memória primária de alta velocidade."],
    ["A memória virtual elimina a necessidade de RAM.", "Ela complementa a RAM usando o disco."],
  ], 2, "Volátil: perde o conteúdo sem energia (RAM, cache). Não volátil: mantém (ROM, flash, SSD, HD).", "Stallings — tipos de memória."),

  q("SUP-003", "sup-organizacao-computadores", 2, "Em processadores multi-core, é correto afirmar que:", [
    ["todos os núcleos compartilham um único pipeline de execução.", "Cada núcleo tem suas unidades de execução."],
    ["cada núcleo é capaz de executar instruções de forma independente, permitindo paralelismo real entre threads.", "Correta."],
    ["o número de núcleos é sempre igual ao número de soquetes da placa-mãe.", "Um soquete pode abrigar vários núcleos."],
    ["Hyper-Threading cria núcleos físicos adicionais.", "Cria processadores lógicos (threads), não núcleos físicos."],
    ["aplicações de uma única thread ficam automaticamente mais rápidas na proporção do número de núcleos.", "Ganho depende de a aplicação ser paralelizável."],
  ], 1, "Núcleos físicos executam em paralelo; SMT/Hyper-Threading expõe mais de uma thread por núcleo físico.", "Stallings — processadores multicore."),

  q("SUP-004", "sup-dispositivos-armazenamento", 2, "Um SSD NVMe M.2 apresenta, em geral, desempenho superior ao de um SSD SATA porque:", [
    ["utiliza discos magnéticos de maior rotação.", "SSDs não têm partes móveis."],
    ["comunica-se pelo barramento PCI Express com o protocolo NVMe, com mais filas e menor latência que o AHCI/SATA.", "Correta."],
    ["usa cabo SATA de 6 Gbit/s.", "Esse é o limite da interface SATA III."],
    ["dispensa controlador.", "Todo SSD possui controlador."],
    ["armazena dados na memória RAM.", "Usa memória flash NAND não volátil."],
  ], 1, "O formato M.2 pode ser SATA ou NVMe; o ganho de desempenho vem do NVMe sobre PCIe.", "NVM Express — especificação; documentação de fabricantes."),

  q("SUP-005", "sup-dispositivos-armazenamento", 2, "Comparando discos SAS e SATA, é correto afirmar que:", [
    ["SATA é voltado a servidores críticos e suporta porta dupla.", "Porta dupla é característica do SAS."],
    ["SAS é comum em ambientes corporativos/servidores, com recursos como comunicação full-duplex e suporte a porta dupla (dual-port).", "Correta."],
    ["SAS e SATA usam conectores e controladoras idênticos e totalmente intercambiáveis.", "Controladoras SAS aceitam discos SATA, mas o inverso não."],
    ["SATA é sempre mais rápido que SAS.", "Discos SAS costumam oferecer maior desempenho e confiabilidade."],
    ["SAS só existe em SSDs.", "Existem HDs e SSDs SAS."],
  ], 1, "Controladoras SAS geralmente aceitam discos SATA; controladoras SATA não aceitam discos SAS.", "Documentação técnica SCSI Trade Association / fabricantes."),

  q("SUP-006", "sup-raid", 2, "Um arranjo RAID 5 com 4 discos de 2 TB cada oferece capacidade útil aproximada de:", [
    ["2 TB", "Seria o caso de RAID 1 com 2 discos."],
    ["4 TB", "Seria o caso de RAID 10 com 4 discos."],
    ["6 TB", "Correta: (n − 1) × capacidade = 3 × 2 TB."],
    ["8 TB", "Seria RAID 0 (sem redundância)."],
    ["1 TB", "Sem relação com o cálculo."],
  ], 2, "RAID 5: paridade distribuída, mínimo 3 discos, tolera a falha de 1 disco; capacidade útil = (n − 1) × menor disco.", "Patterson, Gibson & Katz (1988) — níveis de RAID."),

  q("SUP-007", "sup-raid", 1, "O nível de RAID que apenas distribui os dados entre os discos (striping), aumentando o desempenho, mas SEM qualquer redundância, é o:", [
    ["RAID 0", "Correta: a falha de um disco compromete todo o arranjo."],
    ["RAID 1", "Espelhamento."],
    ["RAID 5", "Striping com paridade distribuída."],
    ["RAID 6", "Striping com dupla paridade."],
    ["RAID 10", "Espelhamento + striping."],
  ], 0, "RAID não substitui backup: protege contra falha de disco, não contra exclusão acidental ou ransomware.", "Níveis de RAID — conceitos básicos."),

  q("SUP-008", "sup-perifericos-itens", 2, "Um usuário relata que as folhas impressas em uma impressora laser saem com o toner borrando ao ser tocado com o dedo. O componente mais provavelmente defeituoso é:", [
    ["o cabeçote de impressão.", "Componente de impressoras jato de tinta."],
    ["a unidade fusora (fusor).", "Correta: o fusor aplica calor e pressão para fixar o toner ao papel."],
    ["o cartucho de tinta colorida.", "Impressoras laser usam toner, não tinta."],
    ["o cabo USB.", "Problemas de comunicação não causam borrões."],
    ["o spooler de impressão.", "O spooler gerencia a fila, não a fixação física."],
  ], 1, "Etapas da impressão laser: carga, exposição (laser), revelação, transferência, fusão e limpeza.", "Manuais de serviço de impressoras laser — processo eletrofotográfico."),

  q("SUP-009", "sup-perifericos-itens", 1, "Em uma estação Windows, vários trabalhos de impressão ficam presos na fila e não são liberados. Uma ação adequada de primeiro nível é:", [
    ["formatar o computador.", "Medida desproporcional."],
    ["reiniciar o serviço Spooler de Impressão (Print Spooler), limpando a fila travada.", "Correta: ex.: net stop spooler, limpar a pasta de spool e net start spooler."],
    ["substituir o toner.", "Toner não trava a fila."],
    ["desativar o Windows Update.", "Sem relação."],
    ["trocar o cabo de rede do servidor de arquivos.", "Sem relação direta."],
  ], 1, "Os arquivos de spool ficam em %SystemRoot%\\System32\\spool\\PRINTERS.", "Microsoft Learn — solução de problemas do spooler de impressão."),

  q("SUP-010", "sup-moveis-intune", 2, "O Microsoft Intune é uma solução:", [
    ["de antivírus exclusivo para servidores Linux.", "Não é antivírus para Linux."],
    ["baseada em nuvem para gerenciamento de dispositivos móveis e computadores (MDM/MAM), permitindo aplicar políticas de conformidade e configurar dispositivos iOS, Android e Windows.", "Correta."],
    ["de backup de bancos de dados SQL Server.", "Não é ferramenta de backup."],
    ["de virtualização de servidores.", "Virtualização é papel de Hyper-V/VMware."],
    ["de edição de documentos.", "Edição é feita no Microsoft 365 Apps."],
  ], 1, "Intune gerencia inscrição de dispositivos, políticas de conformidade, distribuição de apps e proteção de dados corporativos.", "Microsoft Learn — Microsoft Intune overview."),

  q("SUP-011", "sup-diagnostico-falhas", 1, "Antes de substituir fisicamente um módulo de memória RAM em um desktop, o técnico deve, por boa prática:", [
    ["manter o computador ligado para testar o novo módulo a quente.", "Memória não é hot-swap em desktops."],
    ["desligar o equipamento, desconectar da energia e usar pulseira antiestática aterrada para evitar descargas eletrostáticas.", "Correta."],
    ["tocar diretamente os contatos dourados do módulo.", "Pode danificá-los por ESD e oxidação."],
    ["aplicar pasta térmica nos slots de memória.", "Pasta térmica é usada entre processador e dissipador."],
    ["formatar o disco rígido.", "Sem relação."],
  ], 1, "ESD (descarga eletrostática) pode danificar componentes sem sinais visíveis.", "Boas práticas de manutenção de hardware (CompTIA A+)."),

  // ───────── Sistemas operacionais ─────────
  q("SUP-012", "sup-windows-10-11", 1, "No Windows 10/11, o recurso que solicita confirmação ou credenciais administrativas antes de permitir alterações que exigem privilégios elevados é o:", [
    ["BitLocker", "Criptografia de disco."],
    ["UAC (Controle de Conta de Usuário)", "Correta."],
    ["Windows Hello", "Autenticação biométrica/PIN."],
    ["Visualizador de Eventos", "Exibe logs."],
    ["Windows Update", "Atualizações."],
  ], 1, "Com o UAC, mesmo administradores executam com token padrão até a elevação ser aprovada.", "Microsoft Learn — User Account Control."),

  q("SUP-013", "sup-windows-10-11", 1, "Para investigar falhas registradas pelo sistema operacional e por aplicativos no Windows, o técnico deve utilizar o:", [
    ["Visualizador de Eventos (eventvwr.msc)", "Correta: logs de Aplicativo, Segurança e Sistema."],
    ["Bloco de Notas", "Não reúne logs do sistema."],
    ["Paint", "Sem relação."],
    ["Desfragmentador", "Otimiza unidades."],
    ["Teclado Virtual", "Recurso de acessibilidade."],
  ], 0, "Os logs do Windows incluem Aplicativo, Segurança, Instalação, Sistema e Eventos Encaminhados.", "Microsoft Learn — Event Viewer."),

  q("SUP-014", "sup-windows-10-11", 2, "No prompt de comando do Windows, executado como administrador, o comando que cria a conta local \"joao\" com senha definida é:", [
    ["net user joao Senha@123 /add", "Correta."],
    ["useradd joao", "Comando Linux."],
    ["adduser joao", "Comando Linux (Debian/Ubuntu)."],
    ["net share joao /add", "Cria compartilhamentos, não usuários."],
    ["ipconfig /user joao", "Opção inexistente."],
  ], 0, "Ferramentas gráficas equivalentes: lusrmgr.msc (Usuários e Grupos Locais) e Configurações > Contas.", "Microsoft Learn — net user."),

  q("SUP-015", "sup-windows-10-11", 2, "Entre os requisitos mínimos de hardware para instalar o Windows 11, inclui-se:", [
    ["TPM (Trusted Platform Module) versão 2.0.", "Correta."],
    ["processador de 32 bits.", "O Windows 11 é apenas 64 bits."],
    ["2 GB de RAM.", "O mínimo é 4 GB."],
    ["16 GB de armazenamento.", "O mínimo é 64 GB."],
    ["BIOS legado sem UEFI.", "Exige firmware UEFI com capacidade de Inicialização Segura."],
  ], 0, "Requisitos: processador compatível de 64 bits (1 GHz, 2+ núcleos), 4 GB de RAM, 64 GB de armazenamento, UEFI/Secure Boot e TPM 2.0.", "Microsoft — Especificações e requisitos do sistema do Windows 11."),

  q("SUP-016", "sup-windows-10-11", 2, "Em um ambiente corporativo, a solução da Microsoft que permite ao administrador aprovar e distribuir de forma centralizada as atualizações do Windows Update para as estações da rede é o:", [
    ["WSUS (Windows Server Update Services)", "Correta."],
    ["DHCP", "Distribui endereços IP."],
    ["IIS", "Servidor web."],
    ["RDS", "Serviços de Área de Trabalho Remota."],
    ["DFS", "Sistema de arquivos distribuído."],
  ], 0, "Outras opções modernas: Windows Update for Business e Intune.", "Microsoft Learn — Windows Server Update Services."),

  q("SUP-017", "sup-active-directory", 2, "Um técnico não consegue ingressar uma estação no domínio do Active Directory, recebendo erro de que o controlador de domínio não foi encontrado. A verificação mais relevante é se:", [
    ["o papel de parede está configurado.", "Sem relação."],
    ["a estação está usando como servidor DNS um servidor que resolva os registros do domínio (em geral, o controlador de domínio/DNS interno).", "Correta: o AD depende do DNS (registros SRV) para localizar controladores."],
    ["o navegador padrão é o Edge.", "Sem relação."],
    ["a impressora está compartilhada.", "Sem relação."],
    ["o BitLocker está ativo.", "Sem relação direta com o ingresso."],
  ], 1, "Clientes localizam DCs por registros SRV (_ldap._tcp.dc._msdcs.dominio). DNS público não resolve o domínio interno.", "Microsoft Learn — Troubleshoot domain join errors."),

  q("SUP-018", "sup-active-directory", 2, "Para verificar quais Objetos de Política de Grupo (GPOs) foram efetivamente aplicados a um usuário e computador, o técnico pode executar:", [
    ["gpresult /r", "Correta: exibe o Conjunto Resultante de Políticas (RSoP)."],
    ["ping -t", "Teste de conectividade contínuo."],
    ["chkdsk /f", "Verifica o sistema de arquivos."],
    ["sfc /scannow", "Verifica arquivos do sistema."],
    ["tracert", "Rota até o destino."],
  ], 0, "gpupdate /force força a reaplicação das políticas; gpresult /h relatorio.html gera relatório detalhado.", "Microsoft Learn — gpresult; gpupdate."),

  q("SUP-019", "sup-active-directory", 3, "A ordem de processamento das GPOs no Active Directory, sem considerar opções como Enforced ou bloqueio de herança, é:", [
    ["Domínio, Site, Local, OU.", "Ordem incorreta."],
    ["Local, Site, Domínio, Unidade Organizacional (LSDOU) — a última aplicada prevalece em caso de conflito.", "Correta."],
    ["OU, Domínio, Site, Local.", "Ordem invertida."],
    ["Site, Local, OU, Domínio.", "Ordem incorreta."],
    ["Não há ordem; todas são aplicadas simultaneamente.", "Há ordem definida."],
  ], 1, "Por isso uma GPO vinculada à OU pode sobrescrever uma configuração definida no domínio.", "Microsoft Learn — Group Policy processing."),

  q("SUP-020", "sup-windows-server-dns-dhcp", 1, "O processo de concessão de endereço IP pelo DHCP segue, em ordem, as mensagens:", [
    ["Request, Offer, Discover, Acknowledge.", "Ordem incorreta."],
    ["Discover, Offer, Request, Acknowledge (DORA).", "Correta."],
    ["Offer, Discover, Acknowledge, Request.", "Ordem incorreta."],
    ["Discover, Request, Offer, Acknowledge.", "Ordem incorreta."],
    ["Hello, Offer, Accept, Close.", "Mensagens inexistentes no DHCP."],
  ], 1, "O cliente descobre servidores (Discover), recebe ofertas (Offer), solicita (Request) e recebe a confirmação (ACK).", "RFC 2131 — DHCP."),

  q("SUP-021", "sup-windows-server-dns-dhcp", 1, "Uma estação Windows configurada para obter IP automaticamente apresenta o endereço 169.254.20.15. Isso indica, mais provavelmente, que:", [
    ["a estação recebeu IP público válido.", "169.254.0.0/16 é faixa de link-local."],
    ["a estação não obteve resposta de um servidor DHCP e atribuiu a si mesma um endereço APIPA.", "Correta."],
    ["o DNS está funcionando corretamente.", "Não há relação direta."],
    ["a estação está no domínio.", "Não indica ingresso no domínio."],
    ["o endereço foi configurado manualmente pelo administrador.", "APIPA é atribuição automática na falha do DHCP."],
  ], 1, "Verifique cabo/Wi-Fi, VLAN, escopo DHCP esgotado e o serviço DHCP; depois ipconfig /renew.", "Microsoft Learn — APIPA."),

  q("SUP-022", "sup-windows-server-dns-dhcp", 2, "No DNS, o tipo de registro utilizado para resolução reversa (de endereço IP para nome) é o:", [
    ["A", "Nome → IPv4."],
    ["AAAA", "Nome → IPv6."],
    ["MX", "Servidor de e-mail do domínio."],
    ["PTR", "Correta."],
    ["CNAME", "Alias para outro nome."],
  ], 3, "Zonas reversas usam in-addr.arpa (IPv4) e ip6.arpa (IPv6).", "RFC 1035 — Domain Names."),

  q("SUP-023", "sup-linux-basico", 2, "No Linux, após o comando `chmod 754 relatorio.sh`, as permissões do arquivo ficam:", [
    ["rwxr-xr--", "Correta: 7 = rwx (dono), 5 = r-x (grupo), 4 = r-- (outros)."],
    ["rwxrwxr--", "Seria 774."],
    ["rw-r-xr--", "Seria 654."],
    ["r-xr-xr-x", "Seria 555."],
    ["rwxr--r-x", "Seria 745."],
  ], 0, "Notação octal: r = 4, w = 2, x = 1, para dono, grupo e outros.", "GNU Coreutils — chmod."),

  q("SUP-024", "sup-linux-basico", 1, "Em uma distribuição Debian/Ubuntu, o comando que atualiza a lista de pacotes disponíveis nos repositórios configurados é:", [
    ["sudo apt update", "Correta."],
    ["sudo apt upgrade", "Instala as versões mais novas dos pacotes já instalados."],
    ["sudo apt remove", "Remove pacotes."],
    ["sudo yum update", "Gerenciador de distribuições baseadas em Red Hat."],
    ["sudo apt clean", "Limpa o cache de pacotes baixados."],
  ], 0, "Fluxo comum: sudo apt update && sudo apt upgrade; instalar: sudo apt install pacote.", "Debian Reference / Ubuntu Server Guide — apt."),

  q("SUP-025", "sup-linux-basico", 1, "No terminal Linux, o comando que exibe o caminho completo do diretório atual é:", [
    ["ls", "Lista o conteúdo do diretório."],
    ["cd", "Muda de diretório."],
    ["pwd", "Correta: print working directory."],
    ["mkdir", "Cria diretório."],
    ["whoami", "Exibe o usuário atual."],
  ], 2, "Outros comandos básicos: cp, mv, rm, cat, less, grep, find, chmod, chown.", "GNU Coreutils — pwd."),

  q("SUP-026", "sup-linux-basico", 2, "No Linux, para criar o usuário \"maria\" já com o diretório pessoal (home), utiliza-se:", [
    ["useradd -m maria", "Correta: -m cria o diretório /home/maria."],
    ["mkdir maria", "Apenas cria um diretório."],
    ["chmod +user maria", "Sintaxe inválida."],
    ["passwd -c maria", "passwd define senha; -c não cria usuário."],
    ["net user maria /add", "Comando do Windows."],
  ], 0, "Em seguida, defina a senha com passwd maria. No Debian/Ubuntu, adduser é um script interativo mais amigável.", "man useradd (shadow-utils)."),

  q("SUP-027", "sup-drivers", 1, "No Windows, a ferramenta usada para verificar dispositivos sem driver (indicados com ícone de alerta) e atualizar ou reverter drivers é o:", [
    ["Gerenciador de Dispositivos (devmgmt.msc)", "Correta."],
    ["Gerenciador de Tarefas", "Gerencia processos e desempenho."],
    ["Editor de Registro", "Edição direta do registro, não indicada para drivers."],
    ["Painel de Fontes", "Gerencia fontes tipográficas."],
    ["Monitor de Recursos", "Monitora uso de recursos."],
  ], 0, "A opção \"Reverter driver\" restaura a versão anterior quando uma atualização causa problemas.", "Microsoft Learn — Device Manager."),

  q("SUP-028", "sup-rds", 2, "O protocolo usado pelos Serviços de Área de Trabalho Remota (RDS) do Windows e a porta padrão associada são:", [
    ["SSH, porta TCP 22.", "SSH é usado principalmente em Linux."],
    ["RDP, porta TCP 3389.", "Correta."],
    ["HTTP, porta TCP 80.", "Protocolo web."],
    ["SMB, porta TCP 445.", "Compartilhamento de arquivos."],
    ["Telnet, porta TCP 23.", "Protocolo inseguro de terminal remoto."],
  ], 1, "O RDS permite publicar áreas de trabalho e aplicativos (RemoteApp) para os usuários.", "Microsoft Learn — Remote Desktop Services."),

  // ───────── Produtividade e colaboração ─────────
  q("SUP-029", "sup-office", 2, "No Excel, a fórmula `=A1*$B$1`, digitada em C1, é copiada para C2. A fórmula resultante em C2 é:", [
    ["=A1*$B$1", "A referência relativa A1 se ajusta."],
    ["=A2*$B$2", "$B$1 é absoluta e não muda."],
    ["=A2*$B$1", "Correta: A1 (relativa) vira A2; $B$1 (absoluta) permanece."],
    ["=B2*$B$1", "Copiar para baixo não altera a coluna."],
    ["=A2*B1", "O cifrão é preservado na cópia."],
  ], 2, "O $ fixa a coluna e/ou a linha: $B$1 (absoluta), B$1 (linha fixa), $B1 (coluna fixa).", "Suporte Microsoft — referências relativas, absolutas e mistas."),

  q("SUP-030", "sup-office", 2, "No Outlook conectado a uma conta Exchange/Microsoft 365, o arquivo local que armazena uma cópia sincronizada da caixa de correio para uso offline é o:", [
    [".pst", "Arquivo de dados pessoal, usado em arquivamento e contas POP."],
    [".ost", "Correta: Offline Storage Table, cache sincronizado com o servidor."],
    [".docx", "Documento do Word."],
    [".msi", "Pacote de instalação."],
    [".csv", "Arquivo de texto delimitado."],
  ], 1, "Se o .ost corromper, ele pode ser recriado a partir do servidor; .pst não é recriado automaticamente.", "Suporte Microsoft — Introdução aos arquivos de dados do Outlook (.pst e .ost)."),

  q("SUP-031", "sup-teams", 2, "No Microsoft Teams, os arquivos compartilhados em um canal padrão de uma equipe ficam armazenados:", [
    ["no OneDrive pessoal de quem enviou.", "É o caso de arquivos enviados em chats privados."],
    ["no site do SharePoint associado à equipe.", "Correta."],
    ["apenas no computador local do usuário.", "Ficam na nuvem."],
    ["na caixa de correio do Exchange.", "Não é o local de arquivos de canais."],
    ["no servidor de impressão.", "Sem relação."],
  ], 1, "Cada equipe do Teams tem um site do SharePoint; cada canal padrão corresponde a uma pasta na biblioteca de documentos.", "Microsoft Learn — How SharePoint Online and OneDrive interact with Microsoft Teams."),

  q("SUP-032", "sup-onedrive-sharepoint", 2, "O recurso \"Arquivos Sob Demanda\" do OneDrive permite:", [
    ["acessar todos os arquivos na nuvem pelo Explorador de Arquivos sem baixá-los integralmente, ocupando espaço local apenas quando abertos ou marcados para manter no dispositivo.", "Correta."],
    ["criptografar o disco local.", "Função do BitLocker."],
    ["impedir o compartilhamento externo.", "Configuração de compartilhamento é outra funcionalidade."],
    ["converter arquivos em PDF automaticamente.", "Não é função do recurso."],
    ["sincronizar caixas de e-mail.", "Não é função do OneDrive."],
  ], 0, "Estados: somente online (nuvem), disponível localmente e sempre manter neste dispositivo.", "Suporte Microsoft — Economizar espaço em disco com os Arquivos Sob Demanda do OneDrive."),

  q("SUP-033", "sup-navegadores", 1, "Nos navegadores Microsoft Edge e Google Chrome para Windows, o atalho que abre diretamente a janela de limpeza de dados de navegação (cache, cookies, histórico) é:", [
    ["Ctrl + Shift + Delete", "Correta."],
    ["Ctrl + Alt + Delete", "Abre a tela de segurança do Windows."],
    ["Alt + F4", "Fecha a janela."],
    ["Ctrl + P", "Imprimir."],
    ["F5", "Recarregar página."],
  ], 0, "Limpar cache resolve problemas de páginas desatualizadas; Ctrl + F5 recarrega ignorando o cache.", "Ajuda do Microsoft Edge / Google Chrome."),

  q("SUP-034", "sup-icp-brasil", 2, "Sobre certificados digitais ICP-Brasil, é correto afirmar:", [
    ["O certificado A3 é armazenado em arquivo no computador, podendo ser copiado livremente.", "Essa descrição é do tipo A1."],
    ["O certificado A3 tem a chave privada gerada e armazenada em hardware criptográfico, como token USB ou smart card.", "Correta."],
    ["Tokens e smart cards dispensam drivers ou middleware.", "Normalmente exigem drivers/middleware do fabricante."],
    ["O certificado A1 exige obrigatoriamente leitora de cartão.", "O A1 fica em arquivo/repositório de software."],
    ["Certificados ICP-Brasil não têm validade.", "Todo certificado tem prazo de validade."],
  ], 1, "Para uso em sistemas como o PJe, instale driver do token/leitora e a cadeia de certificados da ICP-Brasil.", "ITI — Instituto Nacional de Tecnologia da Informação: certificação digital."),

  // ───────── Redes ─────────
  q("SUP-035", "sup-osi", 1, "No modelo OSI, o roteador opera principalmente na camada:", [
    ["1 — Física", "Camada de sinais e meios."],
    ["2 — Enlace", "Camada do switch tradicional (endereços MAC)."],
    ["3 — Rede", "Correta: roteamento por endereço IP."],
    ["4 — Transporte", "Camada do TCP/UDP."],
    ["7 — Aplicação", "Camada de protocolos como HTTP e DNS."],
  ], 2, "Camadas OSI: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação.", "ISO/IEC 7498-1 — Modelo de Referência OSI."),

  q("SUP-036", "sup-tcpip", 1, "O estabelecimento de uma conexão TCP ocorre pelo three-way handshake, com a sequência de segmentos:", [
    ["SYN, SYN-ACK, ACK", "Correta."],
    ["ACK, SYN, FIN", "Sequência incorreta."],
    ["FIN, ACK, SYN", "FIN encerra conexões."],
    ["SYN, ACK, RST", "RST aborta conexões."],
    ["HELLO, OK, DONE", "Mensagens inexistentes no TCP."],
  ], 0, "O TCP é orientado à conexão e confiável; o UDP não estabelece conexão.", "RFC 9293 — Transmission Control Protocol."),

  q("SUP-037", "sup-ipv4-nat", 2, "Quantos endereços de host utilizáveis existem na sub-rede 192.168.10.0/26?", [
    ["30", "Corresponde a /27."],
    ["62", "Correta: 2^(32−26) − 2 = 64 − 2 = 62."],
    ["64", "Não descontou rede e broadcast."],
    ["126", "Corresponde a /25."],
    ["254", "Corresponde a /24."],
  ], 1, "Hosts utilizáveis = 2^(bits de host) − 2 (endereço de rede e de broadcast).", "RFC 950 / RFC 4632 — sub-redes e CIDR."),

  q("SUP-038", "sup-ipv4-nat", 2, "Assinale o endereço IPv4 que NÃO pertence às faixas privadas definidas pela RFC 1918.", [
    ["10.20.30.40", "Faixa 10.0.0.0/8 (privada)."],
    ["172.16.5.1", "Faixa 172.16.0.0/12 (privada)."],
    ["172.31.255.254", "Faixa 172.16.0.0/12 vai até 172.31.255.255 (privada)."],
    ["172.32.0.1", "Correta: está fora de 172.16.0.0–172.31.255.255; é endereço público."],
    ["192.168.100.1", "Faixa 192.168.0.0/16 (privada)."],
  ], 3, "Faixas privadas: 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16. Para acessar a Internet, usam NAT.", "RFC 1918 — Address Allocation for Private Internets."),

  q("SUP-039", "sup-ipv4-nat", 1, "A técnica que traduz endereços IP privados da rede interna para um ou mais endereços públicos, permitindo acesso à Internet, é o:", [
    ["DNS", "Resolve nomes."],
    ["NAT (Network Address Translation)", "Correta; PAT/overload usa portas para compartilhar um único IP público."],
    ["ARP", "Resolve IP em MAC na rede local."],
    ["DHCP", "Atribui endereços automaticamente."],
    ["VLAN", "Segmenta logicamente a rede de camada 2."],
  ], 1, "O NAT também oculta a topologia interna, mas não substitui um firewall.", "RFC 3022 — Traditional NAT."),

  q("SUP-040", "sup-ferramentas-diagnostico", 1, "O comando ping utiliza mensagens do protocolo:", [
    ["TCP SYN", "ping não estabelece conexão TCP."],
    ["ICMP Echo Request e Echo Reply", "Correta."],
    ["UDP na porta 53", "Porta do DNS."],
    ["HTTP GET", "Protocolo de aplicação web."],
    ["ARP Request", "ARP resolve MAC, embora possa ocorrer antes do ping."],
  ], 1, "Falha no ping não prova indisponibilidade: firewalls podem bloquear ICMP.", "RFC 792 — ICMP."),

  q("SUP-041", "sup-ferramentas-diagnostico", 2, "Um usuário consegue acessar sites pelo endereço IP, mas não pelo nome (ex.: www.trf3.jus.br). A ferramenta mais adequada para investigar a causa é:", [
    ["nslookup", "Correta: testa a resolução de nomes e o servidor DNS consultado."],
    ["chkdsk", "Verifica disco."],
    ["defrag", "Otimiza disco."],
    ["msconfig", "Configuração de inicialização."],
    ["netstat -r", "Exibe tabela de rotas."],
  ], 0, "Também ajudam: ipconfig /all (ver DNS configurado) e ipconfig /flushdns (limpar o cache do resolvedor).", "Microsoft Learn — nslookup; ipconfig."),

  q("SUP-042", "sup-ferramentas-diagnostico", 2, "No Windows, o comando que exibe as conexões de rede ativas e as portas em escuta, incluindo o PID do processo associado, é:", [
    ["netstat -ano", "Correta: -a todas, -n numérico, -o PID."],
    ["ipconfig /release", "Libera a concessão DHCP."],
    ["tracert -d", "Rota sem resolver nomes."],
    ["ping -a", "Resolve nome a partir do IP."],
    ["nslookup -type=mx", "Consulta registros MX."],
  ], 0, "Com o PID, identifique o processo no Gerenciador de Tarefas ou com tasklist /fi \"PID eq n\".", "Microsoft Learn — netstat."),

  q("SUP-043", "sup-ferramentas-diagnostico", 2, "O tracert (Windows) / traceroute (Linux) identifica os roteadores intermediários até o destino explorando o campo:", [
    ["TTL (Time To Live) do cabeçalho IP, que é decrementado a cada salto.", "Correta: cada roteador que zera o TTL devolve ICMP Time Exceeded."],
    ["checksum do TCP.", "Sem relação."],
    ["endereço MAC de destino.", "MAC muda a cada salto e não é usado para isso."],
    ["número de sequência do TCP.", "Sem relação."],
    ["tipo de registro DNS.", "Sem relação."],
  ], 0, "Útil para localizar em qual salto ocorre perda ou latência elevada.", "RFC 1393 / documentação tracert."),

  q("SUP-044", "sup-wifi", 2, "Os padrões IEEE 802.11n, 802.11ac e 802.11ax correspondem, respectivamente, às gerações comerciais:", [
    ["Wi-Fi 3, Wi-Fi 4 e Wi-Fi 5", "Numeração incorreta."],
    ["Wi-Fi 4, Wi-Fi 5 e Wi-Fi 6", "Correta."],
    ["Wi-Fi 5, Wi-Fi 6 e Wi-Fi 7", "Wi-Fi 7 é o 802.11be."],
    ["Wi-Fi 4, Wi-Fi 6 e Wi-Fi 7", "Numeração incorreta."],
    ["Todos são Wi-Fi 6.", "São gerações diferentes."],
  ], 1, "802.11ac opera em 5 GHz; 802.11n e 802.11ax operam em 2,4 e 5 GHz (Wi-Fi 6E adiciona 6 GHz).", "Wi-Fi Alliance — nomenclatura das gerações Wi-Fi."),

  q("SUP-045", "sup-wifi", 2, "Em redes sem fio corporativas, o modo WPA2/WPA3-Enterprise caracteriza-se por:", [
    ["usar uma única senha compartilhada por todos os usuários.", "Esse é o modo Personal (PSK/SAE)."],
    ["autenticar cada usuário/dispositivo individualmente via IEEE 802.1X, normalmente com servidor RADIUS.", "Correta."],
    ["dispensar criptografia.", "Usa criptografia forte."],
    ["funcionar apenas em 2,4 GHz.", "Independe da faixa."],
    ["ser equivalente ao WEP.", "WEP é obsoleto e inseguro."],
  ], 1, "Enterprise permite revogar acessos individualmente e integrar com o Active Directory.", "IEEE 802.1X; Wi-Fi Alliance — WPA3."),

  q("SUP-046", "sup-vpn", 2, "Sobre VPNs, é correto afirmar:", [
    ["IPSec opera na camada de aplicação.", "IPSec opera na camada de rede."],
    ["VPNs SSL/TLS costumam usar a porta TCP 443, o que facilita atravessar firewalls e proxies.", "Correta."],
    ["VPN dispensa autenticação do usuário.", "Autenticação é essencial."],
    ["VPN impede qualquer tipo de malware.", "VPN protege o canal, não o endpoint."],
    ["IPSec não oferece criptografia.", "IPSec oferece autenticação e criptografia (AH/ESP)."],
  ], 1, "Problemas comuns de cliente VPN: credenciais, certificado, horário do sistema, bloqueio de portas (UDP 500/4500 no IPSec) e conflito de faixas IP.", "RFC 4301 (IPSec); documentação de clientes VPN SSL."),

  q("SUP-047", "sup-cabeamento", 2, "No cabeamento estruturado, o comprimento máximo do canal horizontal (incluindo cordões de manobra) para cabos de par trançado é de:", [
    ["50 metros", "Abaixo do limite padrão."],
    ["100 metros", "Correta: 90 m de enlace permanente + até 10 m de patch cords."],
    ["185 metros", "Limite do antigo cabo coaxial fino (10BASE2)."],
    ["500 metros", "Limite do coaxial grosso (10BASE5)."],
    ["2 quilômetros", "Distância típica de fibra multimodo em alguns padrões."],
  ], 1, "Cat5e: até 1 Gbit/s; Cat6: 10 Gbit/s até ~55 m; Cat6A: 10 Gbit/s até 100 m.", "ANSI/TIA-568; ABNT NBR 14565."),

  // ───────── Segurança ─────────
  q("SUP-048", "sup-cid", 1, "Um ataque que torna o sistema de processo eletrônico indisponível para os usuários afeta diretamente o princípio da:", [
    ["confidencialidade", "Trata do acesso apenas por pessoas autorizadas."],
    ["integridade", "Trata de evitar alterações indevidas."],
    ["disponibilidade", "Correta."],
    ["irretratabilidade", "Trata de não repúdio."],
    ["autenticidade", "Trata da garantia de origem."],
  ], 2, "Tríade CID: Confidencialidade, Integridade e Disponibilidade.", "ABNT NBR ISO/IEC 27000 — conceitos."),

  q("SUP-049", "sup-malwares", 1, "O malware que criptografa os arquivos da vítima e exige pagamento para fornecer a chave de recuperação é o:", [
    ["worm", "Propaga-se sozinho pela rede."],
    ["ransomware", "Correta."],
    ["adware", "Exibe propaganda."],
    ["keylogger", "Captura o que é digitado."],
    ["rootkit", "Oculta a presença do invasor."],
  ], 1, "Defesas: backups offline/imutáveis, atualização de sistemas, EDR, menor privilégio e conscientização contra phishing.", "CERT.br — Cartilha de Segurança para Internet."),

  q("SUP-050", "sup-malwares", 2, "Diferentemente do vírus, o worm:", [
    ["precisa ser anexado a um arquivo hospedeiro e executado pelo usuário.", "Essa é característica do vírus."],
    ["propaga-se automaticamente pela rede explorando vulnerabilidades, sem depender de um arquivo hospedeiro.", "Correta."],
    ["não consome recursos de rede.", "Worms costumam consumir muitos recursos."],
    ["é sempre inofensivo.", "Pode causar grandes danos."],
    ["só infecta impressoras.", "Infecta diversos sistemas."],
  ], 1, "Manter sistemas atualizados e segmentar a rede reduz a propagação de worms.", "CERT.br — Cartilha de Segurança para Internet: códigos maliciosos."),

  q("SUP-051", "sup-malwares", 1, "Um usuário recebe e-mail supostamente do setor de TI pedindo que clique em um link e informe sua senha para \"evitar o bloqueio da conta\". Trata-se de:", [
    ["backup", "Sem relação."],
    ["phishing", "Correta: fraude que usa engenharia social para obter credenciais."],
    ["firewall", "Sem relação."],
    ["RAID", "Sem relação."],
    ["VPN", "Sem relação."],
  ], 1, "Orientação: nunca informar senha por e-mail; verificar remetente e link; reportar à equipe de segurança.", "CERT.br — Cartilha: golpes na Internet."),

  q("SUP-052", "sup-antivirus-edr", 2, "Em comparação com um antivírus tradicional baseado apenas em assinaturas, uma solução EDR (Endpoint Detection and Response):", [
    ["só detecta malwares já catalogados.", "EDR também analisa comportamento."],
    ["monitora continuamente o comportamento dos endpoints, registra telemetria e permite investigação e resposta (como isolar a máquina da rede).", "Correta."],
    ["substitui o backup.", "Não substitui backup."],
    ["dispensa atualização.", "Exige atualização de agentes e inteligência."],
    ["funciona apenas em servidores de e-mail.", "Atua em endpoints."],
  ], 1, "O agente EDR deve estar ativo e saudável; desativá-lo para \"resolver\" lentidão é prática insegura.", "MITRE / documentação de fornecedores EDR."),

  q("SUP-053", "sup-firewall-windows", 2, "O Firewall do Windows Defender aplica regras conforme o perfil de rede ativo. Os perfis existentes são:", [
    ["Doméstico, Escritório e Escola.", "Nomes não correspondem."],
    ["Domínio, Privado e Público.", "Correta."],
    ["Entrada, Saída e Interno.", "Entrada/saída são direções das regras."],
    ["Administrador, Usuário e Convidado.", "São tipos de conta."],
    ["LAN, WAN e DMZ.", "São zonas de rede, não perfis do Windows."],
  ], 1, "O perfil Público é o mais restritivo; Domínio é aplicado quando o computador autentica no controlador de domínio.", "Microsoft Learn — Windows Firewall profiles."),

  q("SUP-054", "sup-bitlocker", 2, "Sobre o BitLocker, é correto afirmar:", [
    ["É um antivírus integrado ao Windows Home.", "É criptografia de disco."],
    ["Criptografa volumes inteiros e pode usar o TPM para proteger as chaves; a chave de recuperação de 48 dígitos deve ser guardada com segurança (por exemplo, no AD ou na conta corporativa).", "Correta."],
    ["Impede a instalação de programas.", "Não é controle de aplicações."],
    ["Dispensa qualquer chave de recuperação.", "A chave de recuperação é essencial."],
    ["Criptografa apenas e-mails.", "Atua em volumes."],
  ], 1, "Disponível nas edições Pro, Enterprise e Education; a edição Home oferece \"criptografia de dispositivo\" em hardware compatível.", "Microsoft Learn — BitLocker overview."),

  q("SUP-055", "sup-lgpd-atendimento", 2, "No atendimento de Service Desk, em conformidade com a LGPD, ao receber por telefone pedido de redefinição de senha, o técnico deve:", [
    ["fornecer a senha atual do usuário para agilizar o atendimento.", "Senhas não devem ser conhecidas nem reveladas."],
    ["verificar a identidade do solicitante conforme o procedimento definido antes de executar a redefinição, registrando o chamado.", "Correta: protege contra engenharia social e garante rastreabilidade."],
    ["divulgar dados cadastrais do usuário para confirmação.", "Expor dados pessoais a quem não foi identificado viola a LGPD."],
    ["anotar a nova senha em planilha compartilhada.", "Prática insegura."],
    ["recusar o atendimento em qualquer hipótese.", "Redefinição de senha é requisição de serviço comum."],
  ], 1, "Princípios da LGPD aplicáveis: finalidade, necessidade, segurança e prevenção (art. 6º).", "Lei nº 13.709/2018, art. 6º; boas práticas de Service Desk."),

  // ───────── ITIL / Service Desk ─────────
  q("SUP-056", "sup-itil-service-desk", 1, "No ITIL 4, a prática de Central de Serviços (Service Desk) tem como propósito:", [
    ["desenvolver novos sistemas de software.", "Propósito de práticas de desenvolvimento."],
    ["capturar a demanda por resolução de incidentes e requisições de serviço, sendo o ponto único de contato entre o provedor de serviços e os usuários.", "Correta."],
    ["definir a estratégia financeira da organização.", "Propósito de outras práticas de gestão."],
    ["realizar exclusivamente atendimento presencial.", "Pode ser multicanal (telefone, portal, chat, e-mail)."],
    ["substituir o gerenciamento de problemas.", "São práticas distintas e complementares."],
  ], 1, "SPOC (Single Point of Contact): canal unificado com empatia e foco na experiência do usuário.", "AXELOS. ITIL 4 Foundation — Service desk practice."),

  q("SUP-057", "sup-incidentes-requisicoes", 2, "No ITIL 4, um pedido de usuário para instalação de um software padrão homologado é classificado como:", [
    ["incidente", "Incidente é interrupção não planejada ou redução da qualidade de um serviço."],
    ["problema", "Problema é a causa, real ou potencial, de um ou mais incidentes."],
    ["requisição de serviço", "Correta: pedido pré-definido que faz parte da entrega normal do serviço."],
    ["mudança emergencial", "Mudança emergencial trata de alterações urgentes no ambiente."],
    ["evento", "Evento é mudança de estado significativa para o gerenciamento de um item."],
  ], 2, "Exemplos de requisições: redefinição de senha, novo acesso, instalação de software padrão, fornecimento de equipamento.", "AXELOS. ITIL 4 Foundation — Service request management."),

  q("SUP-058", "sup-incidentes-requisicoes", 2, "Na priorização de incidentes, a prioridade é usualmente definida pela combinação de:", [
    ["custo e prazo.", "Não é o critério usual."],
    ["impacto e urgência.", "Correta: matriz impacto × urgência."],
    ["cargo do solicitante e horário.", "Não é critério técnico de priorização."],
    ["quantidade de técnicos e chamados abertos.", "Afeta capacidade, não prioridade."],
    ["ordem alfabética do serviço.", "Sem fundamento."],
  ], 1, "Impacto: abrangência do efeito no negócio; urgência: rapidez com que a resolução é necessária.", "AXELOS. ITIL — Incident management."),

  q("SUP-059", "sup-incidentes-requisicoes", 2, "Quando um chamado é transferido do primeiro nível para uma equipe com maior especialização técnica, ocorre escalonamento:", [
    ["hierárquico", "Envolve níveis de gestão/autoridade."],
    ["funcional", "Correta."],
    ["financeiro", "Termo não usado nesse contexto."],
    ["reverso", "Termo não usado nesse contexto."],
    ["automático por SLA expirado, obrigatoriamente", "Pode ser automático, mas a definição é de escalonamento funcional."],
  ], 1, "Escalonamento funcional = para quem tem mais conhecimento; hierárquico = para níveis de gestão.", "AXELOS. ITIL — escalation."),

  q("SUP-060", "sup-sla", 2, "O acordo firmado entre o provedor de serviços de TI e OUTRA EQUIPE INTERNA da mesma organização, que apoia o cumprimento dos SLAs, é denominado:", [
    ["SLA (Service Level Agreement)", "Firmado entre provedor e cliente."],
    ["OLA (Operational Level Agreement)", "Correta."],
    ["UC (Underpinning Contract)", "Contrato com fornecedor externo."],
    ["NDA", "Acordo de confidencialidade."],
    ["RFC", "Requisição de mudança."],
  ], 1, "SLA (com o cliente), OLA (interno) e UC/contrato de apoio (com terceiros).", "AXELOS. ITIL — Service level management."),

  q("SUP-061", "sup-itsm-ferramentas", 1, "GLPI, OTRS e Jira Service Management são exemplos de:", [
    ["sistemas operacionais de servidor.", "Não são SOs."],
    ["ferramentas de ITSM (gestão de serviços de TI) para registro e acompanhamento de chamados.", "Correta."],
    ["antivírus corporativos.", "Não são antivírus."],
    ["linguagens de programação.", "Não são linguagens."],
    ["protocolos de roteamento.", "Não são protocolos."],
  ], 1, "O GLPI é open source e também oferece inventário de ativos; o Jira Service Management é da Atlassian.", "Documentações GLPI, OTRS e Atlassian."),

  q("SUP-062", "sup-tecnicas-atendimento", 1, "Constitui boa prática de comunicação no atendimento ao usuário:", [
    ["usar jargões técnicos para demonstrar conhecimento.", "Prejudica a compreensão."],
    ["praticar escuta ativa, confirmar o entendimento do problema e informar os próximos passos e prazos em linguagem clara.", "Correta."],
    ["encerrar o chamado sem confirmação do usuário.", "O encerramento deve ser confirmado/validado."],
    ["culpar o usuário pela falha.", "Atitude inadequada."],
    ["prometer prazos que não dependem da equipe.", "Gera expectativas irreais."],
  ], 1, "Empatia, clareza e registro adequado melhoram a satisfação e a qualidade da base de conhecimento.", "ITIL 4 — Service desk; boas práticas de atendimento."),

  q("SUP-063", "sup-inventario", 2, "No contexto de controle de ativos de TI, a base que armazena informações sobre os itens de configuração (ICs) e seus relacionamentos é a:", [
    ["CMDB (Configuration Management Database)", "Correta."],
    ["DMZ", "Segmento de rede."],
    ["VLAN", "Rede local virtual."],
    ["MBR", "Registro mestre de inicialização."],
    ["BIOS", "Firmware da placa-mãe."],
  ], 0, "Ferramentas como GLPI coletam inventário automaticamente por agentes.", "AXELOS. ITIL — Service configuration management; IT asset management."),

  // ───────── Normativos ─────────
  q("SUP-064", "sup-norm-ensec", 2, "A sigla ENSEC-PJ refere-se à:", [
    ["Escola Nacional de Servidores do Poder Judiciário.", "Não corresponde."],
    ["Estratégia Nacional de Segurança Cibernética do Poder Judiciário, instituída pela Resolução CNJ nº 396/2021.", "Correta."],
    ["Estrutura Nacional de Sistemas Eletrônicos e Cadastros.", "Não corresponde."],
    ["Encarregado de Segurança da Informação do PJe.", "Não corresponde."],
    ["Estratégia Nacional de Sustentabilidade do Judiciário.", "Não corresponde."],
  ], 1, "A Portaria CNJ nº 162/2021 aprova protocolos e manuais da ENSEC-PJ (ex.: gestão de incidentes cibernéticos).", "Resolução CNJ nº 396/2021; Portaria CNJ nº 162/2021."),

  q("SUP-065", "sup-norm-res-522", 2, "A Resolução CNJ nº 522/2023 trata:", [
    ["do Modelo de Requisitos para Sistemas Informatizados de Gestão de Processos e Documentos do Poder Judiciário (MoReq-Jus).", "Correta."],
    ["da Política de Prevenção ao Assédio.", "Matéria da Resolução CNJ nº 351/2020."],
    ["da Política de Sustentabilidade da Justiça Federal.", "Matéria da Resolução CJF nº 709/2021."],
    ["exclusivamente do teletrabalho.", "Não é o objeto."],
    ["da criação do PJe.", "O PJe é anterior."],
  ], 0, "O MoReq-Jus estabelece requisitos de gestão documental, segurança, preservação e interoperabilidade para sistemas judiciais.", "Resolução CNJ nº 522/2023."),
];
