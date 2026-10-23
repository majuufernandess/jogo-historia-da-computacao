'use strict';

/* Textos do álbum: nome, linha de resumo, história e informações importantes de cada figurinha. */
const INFO_ALBUM = {
  /* ---------- MÁQUINAS ---------- */
  'm:abaco': {
    nome: 'Ábaco',
    meta: 'c. 3000 a.C. • Mesopotâmia (data aproximada)',
    historia: 'O ábaco é uma das ferramentas de cálculo mais antigas da humanidade. Povos como sumérios, chineses, romanos e japoneses usaram versões dele para comerciar e fazer contas. As contas deslizam em hastes, e cada haste representa unidades, dezenas, centenas e assim por diante.',
    destaques: ['Um dos primeiros instrumentos de cálculo', 'Não é automático: quem calcula é a pessoa', 'Ainda é usado para ensinar matemática']
  },
  'm:pascalina': {
    nome: 'Pascalina',
    meta: '1642 • Blaise Pascal, França',
    historia: 'Blaise Pascal inventou essa calculadora mecânica ainda jovem, para ajudar o pai, que trabalhava com cobrança de impostos e passava horas somando números. Ela funcionava com rodas dentadas numeradas: ao girar uma roda até o fim, ela fazia a seguinte avançar.',
    destaques: ['Uma das primeiras calculadoras mecânicas', 'Somava e subtraía com engrenagens', 'O nome da linguagem Pascal homenageia seu inventor']
  },
  'm:analitica': {
    nome: 'Máquina Analítica',
    meta: '1837 • Charles Babbage, Inglaterra',
    historia: 'Charles Babbage projetou uma máquina capaz de executar qualquer cálculo que lhe fosse programado. Ela teria uma parte para processar (o "moinho") e outra para guardar dados (o "armazém"), e seria controlada por cartões perfurados. Nunca foi terminada em vida, mas suas ideias são muito parecidas com as dos computadores de hoje.',
    destaques: ['Projeto precursor do computador moderno', 'Usaria cartões perfurados como programa', 'Ada Lovelace escreveu um programa para ela']
  },
  'm:z3': {
    nome: 'Z3',
    meta: '1941 • Konrad Zuse, Alemanha',
    historia: 'O engenheiro alemão Konrad Zuse construiu o Z3 com relés eletromecânicos. Ele é considerado o primeiro computador programável totalmente automático que funcionou, e já usava o sistema binário (0 e 1). O original foi destruído em um bombardeio em Berlim, em 1943.',
    destaques: ['Primeiro computador programável automático funcional', 'Usava relés e o sistema binário', 'O original foi destruído durante a guerra']
  },
  'm:colossus': {
    nome: 'Colossus',
    meta: '1943 • Tommy Flowers, Reino Unido',
    historia: 'O Colossus foi construído em segredo durante a Segunda Guerra Mundial, em Bletchley Park, para ajudar a decifrar mensagens alemãs protegidas pela cifra Lorenz. Funcionava com válvulas eletrônicas, que o deixavam muito mais rápido do que máquinas feitas de peças mecânicas.',
    destaques: ['Ajudou os Aliados a ler mensagens secretas', 'Usava válvulas eletrônicas', 'Sua existência foi mantida em segredo por décadas']
  },
  'm:eniac': {
    nome: 'ENIAC',
    meta: '1946 • Mauchly e Eckert, Estados Unidos',
    historia: 'O ENIAC foi apresentado ao público em 1946, na Universidade da Pensilvânia. Era um gigante com cerca de 17 mil válvulas e pesava aproximadamente 27 toneladas. Foi criado para calcular trajetórias de artilharia, e um grupo de mulheres matemáticas foi quem o programou, ligando cabos e ajustando chaves.',
    destaques: ['Um dos primeiros computadores eletrônicos de uso geral', 'Cerca de 17 mil válvulas e 27 toneladas', 'Programado por mulheres pioneiras']
  },
  'm:ibmpc': {
    nome: 'IBM PC',
    meta: '1981 • IBM, Estados Unidos',
    historia: 'Em 1981 a IBM lançou o Personal Computer, o "PC". Ele usava um processador Intel e o sistema MS-DOS, da Microsoft. Como sua arquitetura era aberta, outras empresas puderam fabricar computadores compatíveis, e isso fez os PCs se espalharem por casas e escritórios.',
    destaques: ['Popularizou o computador pessoal', 'Processador Intel e sistema MS-DOS', 'Arquitetura aberta gerou os "PCs compatíveis"']
  },
  'm:mac': {
    nome: 'Macintosh',
    meta: '1984 • Apple, Estados Unidos',
    historia: 'O Macintosh, lançado pela Apple em 1984, mostrou ao grande público uma forma nova de usar o computador: janelas, ícones e um mouse, em vez de digitar comandos. Seu lançamento ficou famoso por um comercial exibido durante a final do campeonato de futebol americano.',
    destaques: ['Popularizou a interface gráfica e o mouse', 'Lançado pela Apple em janeiro de 1984', 'Computador compacto, com tela integrada']
  },

  /* ---------- PERSONALIDADES ---------- */
  'p:0': {
    nome: 'Ada Lovelace',
    meta: '1815–1852 • Matemática, Inglaterra',
    historia: 'Ada Lovelace, filha do poeta Lord Byron, estudou matemática e conheceu Charles Babbage. Em 1843 publicou notas sobre a Máquina Analítica que incluíam um passo a passo para calcular números de Bernoulli, considerado o primeiro programa de computador da história. Ela também imaginou que máquinas poderiam trabalhar com música e símbolos, não só com números.',
    destaques: ['Considerada a primeira programadora', 'Escreveu um algoritmo para a Máquina Analítica', 'Previu usos do computador além dos cálculos']
  },
  'p:1': {
    nome: 'Charles Babbage',
    meta: '1791–1871 • Matemático e inventor, Inglaterra',
    historia: 'Charles Babbage é chamado de "pai do computador" por suas ideias à frente do tempo. Ele projetou a Máquina Diferencial, para calcular tabelas matemáticas, e depois a Máquina Analítica, programável por cartões perfurados e com memória. Os projetos não foram concluídos em sua época, em parte por falta de recursos e das técnicas de fabricação da época.',
    destaques: ['Projetou a Máquina Diferencial e a Analítica', 'Ideias de memória, processador e programa', 'Trabalhou com Ada Lovelace']
  },
  'p:2': {
    nome: 'Alan Turing',
    meta: '1912–1954 • Matemático, Reino Unido',
    historia: 'Em 1936, Alan Turing descreveu a "máquina de Turing", um modelo teórico que define o que é possível calcular e ajudou a criar as bases da computação. Na Segunda Guerra Mundial, trabalhou em Bletchley Park para quebrar mensagens da máquina Enigma. Em 1950 propôs o "Teste de Turing", uma forma de discutir se uma máquina pode pensar.',
    destaques: ['Criou o modelo teórico da máquina de Turing', 'Ajudou a decifrar a Enigma na guerra', 'Propôs o Teste de Turing sobre inteligência artificial']
  },
  'p:3': {
    nome: 'Grace Hopper',
    meta: '1906–1992 • Cientista da computação e almirante, Estados Unidos',
    historia: 'Grace Hopper foi matemática e oficial da Marinha dos Estados Unidos. Ela criou um dos primeiros compiladores, programa que traduz instruções escritas de forma mais humana para a linguagem da máquina. Suas ideias influenciaram o COBOL. Também ajudou a popularizar o termo "bug" para erros de computador, depois de um inseto ser encontrado preso em um computador em 1947.',
    destaques: ['Criou um dos primeiros compiladores', 'Influenciou a criação do COBOL', 'Ajudou a popularizar o termo "bug"']
  },
  'p:4': {
    nome: 'Katherine Johnson',
    meta: '1918–2020 • Matemática da NASA, Estados Unidos',
    historia: 'Katherine Johnson calculou trajetórias de voos espaciais para a NASA. Seus cálculos foram usados na missão de Alan Shepard, em 1961, e o astronauta John Glenn pediu que ela conferisse os números do computador antes de sua órbita em torno da Terra, em 1962. Em 2015 recebeu a Medalha Presidencial da Liberdade.',
    destaques: ['Calculou trajetórias de missões espaciais', 'Conferiu os cálculos da órbita de John Glenn', 'Medalha Presidencial da Liberdade em 2015']
  },
  'p:5': {
    nome: 'Tim Berners-Lee',
    meta: 'Nascido em 1955 • Cientista da computação, Reino Unido',
    historia: 'Em 1989, trabalhando no laboratório CERN, Tim Berners-Lee propôs um sistema para ligar documentos por links: a World Wide Web. Ele criou o HTML, o protocolo HTTP e os endereços (URLs), além do primeiro navegador e servidor. A Web é diferente da internet: a internet é a rede, e a Web é um serviço que funciona nela.',
    destaques: ['Criou a World Wide Web em 1989', 'Criou HTML, HTTP e URLs', 'Web e internet não são a mesma coisa']
  },
  'p:6': {
    nome: 'Steve Wozniak',
    meta: 'Nascido em 1950 • Engenheiro, Estados Unidos',
    historia: 'Steve Wozniak, o "Woz", projetou os primeiros computadores da Apple. Em 1976 fundou a empresa com Steve Jobs, e o Apple II, lançado em 1977, tornou-se um dos primeiros computadores pessoais de grande sucesso, usado em casas e escolas. Wozniak ficou conhecido pela habilidade de criar projetos simples e eficientes.',
    destaques: ['Cofundador da Apple, em 1976', 'Projetou o Apple I e o Apple II', 'O Apple II popularizou o computador pessoal']
  },
  'p:7': {
    nome: 'Margaret Hamilton',
    meta: 'Nascida em 1936 • Cientista da computação, Estados Unidos',
    historia: 'Margaret Hamilton liderou, no MIT, a equipe que criou o software de voo do programa Apollo. Durante o pouso da Apollo 11, em 1969, o computador de bordo mostrou alarmes de sobrecarga, mas o software foi feito para dar prioridade às tarefas mais importantes e o pouso continuou. Ela ajudou a difundir a expressão "engenharia de software".',
    destaques: ['Liderou o software de voo da Apollo', 'O programa lidou com os alarmes no pouso na Lua', 'Ajudou a difundir "engenharia de software"']
  },
  'p:8': {
    nome: 'Dennis Ritchie',
    meta: '1941–2011 • Cientista da computação, Estados Unidos',
    historia: 'Dennis Ritchie trabalhou nos Laboratórios Bell e criou a linguagem C no início dos anos 1970. Junto com Ken Thompson, também desenvolveu o sistema operacional Unix, reescrito em C. Essas criações influenciaram muitos sistemas e linguagens usados até hoje. Em 1983 recebeu o Prêmio Turing.',
    destaques: ['Criou a linguagem C', 'Coautor do sistema Unix', 'Prêmio Turing em 1983']
  },
  'p:9': {
    nome: 'Linus Torvalds',
    meta: 'Nascido em 1969 • Engenheiro de software, Finlândia',
    historia: 'Em 1991, ainda estudante, Linus Torvalds começou a criar o kernel Linux, o núcleo de um sistema operacional livre, aberto à colaboração de qualquer pessoa. O Linux hoje está em servidores, celulares Android e supercomputadores. Em 2005 ele também criou o Git, sistema de controle de versões. O mascote do Linux é o pinguim Tux.',
    destaques: ['Criou o kernel Linux em 1991', 'Software livre, com ajuda de muitas pessoas', 'Também criou o Git, em 2005']
  },

  /* ---------- LINGUAGENS ---------- */
  'l:fortran': {
    nome: 'Fortran',
    meta: '1957 • John Backus e equipe da IBM',
    historia: 'O nome vem de "FORmula TRANslation". O Fortran foi a primeira linguagem de alto nível amplamente usada: em vez de escrever instruções difíceis para a máquina, os cientistas podiam escrever fórmulas parecidas com as da matemática. Ainda é usado em simulações científicas e previsões do tempo.',
    destaques: ['Primeira linguagem de alto nível muito usada', 'Criada para ciência e engenharia', 'Segue em uso em simulações']
  },
  'l:lisp': {
    nome: 'Lisp',
    meta: '1958 • John McCarthy, MIT',
    historia: 'O nome vem de "LISt Processing". Criada por John McCarthy, o Lisp trabalha com listas e usa muito a recursão. Foi muito usada nas primeiras pesquisas de inteligência artificial e trouxe ideias como a coleta automática de memória, hoje comuns em várias linguagens.',
    destaques: ['Uma das linguagens mais antigas ainda em uso', 'Muito usada em pesquisas de IA', 'Introduziu a coleta automática de memória']
  },
  'l:cobol': {
    nome: 'COBOL',
    meta: '1959 • Comitê CODASYL, com influência de Grace Hopper',
    historia: 'O nome vem de "COmmon Business-Oriented Language". Foi feita para empresas e governos, com comandos parecidos com frases em inglês, para que fosse fácil de ler. Grace Hopper influenciou sua criação. Décadas depois, ainda roda em muitos sistemas de bancos e do governo.',
    destaques: ['Pensada para negócios e administração', 'Escrita quase como frases em inglês', 'Ainda usada em sistemas bancários']
  },
  'l:basic': {
    nome: 'BASIC',
    meta: '1964 • John Kemeny e Thomas Kurtz, Dartmouth',
    historia: 'BASIC significa "Beginner\'s All-purpose Symbolic Instruction Code". Foi criada para que estudantes de qualquer área aprendessem a programar. Nos anos 1970 e 1980 chegou aos primeiros computadores pessoais e levou a programação para dentro de casa. A Microsoft começou, em 1975, fazendo um BASIC para o computador Altair.',
    destaques: ['Feita para iniciantes', 'Presente nos primeiros computadores pessoais', 'Foi o primeiro produto da Microsoft']
  },
  'l:pascal': {
    nome: 'Pascal',
    meta: '1970 • Niklaus Wirth, Suíça',
    historia: 'Niklaus Wirth criou o Pascal para ensinar programação de forma organizada, com o estilo chamado de programação estruturada. O nome é uma homenagem ao matemático Blaise Pascal, inventor da Pascalina. Foi muito usada em escolas e universidades e deu origem a ferramentas como o Delphi.',
    destaques: ['Criada para ensinar programação estruturada', 'Nome em homenagem a Blaise Pascal', 'Base do Delphi']
  },
  'l:c': {
    nome: 'C',
    meta: '1972 • Dennis Ritchie, Laboratórios Bell',
    historia: 'Dennis Ritchie criou o C nos Laboratórios Bell. A linguagem foi usada para reescrever o sistema Unix, e isso mostrou que um sistema operacional podia ser feito em uma linguagem de alto nível. Por ser rápida e próxima da máquina, o C está por trás de muitos sistemas operacionais e influenciou C++, Java e C#.',
    destaques: ['Criada por Dennis Ritchie', 'Usada para reescrever o Unix', 'Influenciou C++, Java e C#']
  },
  'l:cpp': {
    nome: 'C++',
    meta: '1983 • Bjarne Stroustrup, Laboratórios Bell',
    historia: 'Bjarne Stroustrup começou o projeto em 1979 com o nome "C com Classes" e o chamou de C++ em 1983. Ele manteve a velocidade do C e acrescentou a orientação a objetos, que organiza programas em "objetos". O C++ é muito usado em jogos, navegadores e programas que precisam de alto desempenho.',
    destaques: ['Evolução do C, com orientação a objetos', 'Usada em jogos e programas rápidos', 'O "++" lembra o operador de incremento do C']
  },
  'l:python': {
    nome: 'Python',
    meta: '1991 • Guido van Rossum, Países Baixos',
    historia: 'Guido van Rossum criou o Python com foco em um código simples e fácil de ler. O nome não vem da cobra, e sim do grupo de comédia britânico Monty Python. Hoje é uma das linguagens mais populares, usada em análise de dados, inteligência artificial, sites e para quem está aprendendo a programar.',
    destaques: ['Sintaxe simples e legível', 'Nome inspirado no grupo Monty Python', 'Muito usada em IA e ciência de dados']
  }
};
