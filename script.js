'use strict';

const telaInicial = document.getElementById('tela-inicial');
const telaJogo    = document.getElementById('tela-jogo');
const telaFases   = document.getElementById('tela-fases');
const btnCasa     = document.getElementById('btn-casa');
const telaAlbum   = document.getElementById('tela-album');
const btnAlbum    = document.getElementById('btn-album');
const btnAlbumVoltar = document.getElementById('btn-album-voltar');
const avisoFase   = document.getElementById('aviso-fase');
const btnJogar    = document.getElementById('btn-jogar');
const btnVoltar   = document.getElementById('btn-voltar');
const telaVitoria = document.getElementById('tela-vitoria');
const btnAvancar = document.getElementById('btn-avancar');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
const btnMenuFinal = document.getElementById('btn-menu-final');

const DURACAO_TRANSICAO = 350;

let telaAtual = telaInicial;
let trocando = false;

function mostrarTela(proxima, focoEm) {
  if (trocando || proxima === telaAtual) return;
  trocando = true;

  const anterior = telaAtual;
  anterior.classList.add('saindo');

  setTimeout(() => {
    anterior.hidden = true;
    anterior.classList.remove('saindo');

    proxima.hidden = false;
    proxima.classList.add('entrando');
    telaAtual = proxima;

    (focoEm || proxima).focus({ preventScroll: true });

    setTimeout(() => {
      proxima.classList.remove('entrando');
      trocando = false;
    }, DURACAO_TRANSICAO + 150);
  }, DURACAO_TRANSICAO);
}

function iniciarJogo() {
  reiniciarQuiz();
  mostrarTela(telaJogo, document.getElementById('texto-pergunta'));
}

function abrirMapa() {
  avisoFase.textContent = '';
  mostrarTela(telaFases, document.getElementById('btn-fase-1'));
}

function voltarAoMenu() {
  mostrarTela(telaInicial, btnJogar);
}

function escolherFase(n) {
  if (n === 1) { avisoFase.textContent = ''; abrirIntroFase1(); return; }
  if (n === 2) { avisoFase.textContent = ''; abrirIntroFase2(); return; }
  avisoFase.textContent = ''; abrirIntroFase3();
}

btnJogar.addEventListener('click', abrirMapa);
btnCasa.addEventListener('click', voltarAoMenu);
btnAlbum.addEventListener('click', () => abrirAlbum(0));
btnAlbumVoltar.addEventListener('click', abrirMapa);
document.querySelectorAll('.btn-fase').forEach(b =>
  b.addEventListener('click', () => escolherFase(Number(b.dataset.fase))));
btnVoltar.addEventListener('click', abrirMapa);
btnAvancar.addEventListener('click', avancarPergunta);
btnJogarNovamente.addEventListener('click', iniciarJogo);
btnMenuFinal.addEventListener('click', abrirMapa);

window.addEventListener('load', () => btnJogar.focus({ preventScroll: true }));


const Som = (() => {

  const CHAVE_EFEITOS  = 'hc-efeitos-ligados';
  const CHAVE_MUSICA   = 'hc-musica-ligada';
  const VOLUME_EFEITOS = 0.12;   // volume dos cliques (0 a 1)
  const VOLUME_MUSICA  = 0.6;    // volume geral da trilha (0 a 1)
  const BPM            = 128;    // velocidade da música
  const PASSO          = 60 / BPM / 4;   // duração de uma semicolcheia (s)
  const AGENDA_ADIANTADA = 0.25; // quanto à frente a música é agendada (s)

  function ler(chave) {
    try { return localStorage.getItem(chave) !== '0'; } catch (e) { return true; }
  }

  function salvar(chave, valor) {
    try { localStorage.setItem(chave, valor ? '1' : '0'); } catch (e) { /* ignora */ }
  }

  let efeitosLigados = ler(CHAVE_EFEITOS);
  let musicaLigada   = ler(CHAVE_MUSICA);

  let ctx = null;
  let ganhoMusica = null;   
  let bufferRuido = null;   
  let timer = null;         
  let proximoPasso = 0;
  let proximoTempo = 0;

  function obterContexto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;                      
      ctx = new AC();

      ganhoMusica = ctx.createGain();
      ganhoMusica.gain.value = 0;
      ganhoMusica.connect(ctx.destination);

      bufferRuido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const dados = bufferRuido.getChannelData(0);
      for (let i = 0; i < dados.length; i++) dados[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  const mtof = (midi) => 440 * Math.pow(2, (midi - 69) / 12);  

  function tom(destino, tipo, freq, t, duracao, volume) {
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t);
    ganho.gain.setValueAtTime(0.0001, t);
    ganho.gain.exponentialRampToValueAtTime(volume, t + 0.008);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
    osc.connect(ganho).connect(destino);
    osc.start(t);
    osc.stop(t + duracao + 0.02);
  }

  function ruido(t, duracao, volume, tipoFiltro, freqFiltro) {
    const fonte = ctx.createBufferSource();
    fonte.buffer = bufferRuido;
    const filtro = ctx.createBiquadFilter();
    filtro.type = tipoFiltro;
    filtro.frequency.value = freqFiltro;
    const ganho = ctx.createGain();
    ganho.gain.setValueAtTime(volume, t);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
    fonte.connect(filtro).connect(ganho).connect(ganhoMusica);
    fonte.start(t);
    fonte.stop(t + duracao + 0.02);
  }

  function bumbo(t) {
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    ganho.gain.setValueAtTime(0.2, t);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(ganho).connect(ganhoMusica);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  const EFEITOS = {
    clique:  [[660, 0, 0.07], [880, 0.07, 0.09]],
    iniciar: [[523, 0, 0.09], [659, 0.09, 0.09], [784, 0.18, 0.09], [1047, 0.27, 0.18]],
    voltar:  [[784, 0, 0.07], [523, 0.07, 0.10]],
    ligar:   [[880, 0, 0.06], [1175, 0.06, 0.10]],
    acerto:  [[784, 0, 0.08], [988, 0.08, 0.08], [1319, 0.16, 0.16]],
    erro:    [[220, 0, 0.12], [165, 0.12, 0.18]]
  };

  function tocar(nome = 'clique') {
    if (!efeitosLigados) return;                  
    if (!obterContexto()) return;
    const t0 = ctx.currentTime;
    (EFEITOS[nome] || EFEITOS.clique).forEach(([freq, inicio, dur]) =>
      tom(ctx.destination, 'square', freq, t0 + inicio, dur, VOLUME_EFEITOS));
  }

  const ACORDES = [
    { baixo: 50, arp: [62, 65, 69, 74] },   // Dm
    { baixo: 46, arp: [58, 62, 65, 70] },   // Sib
    { baixo: 53, arp: [65, 69, 72, 77] },   // Fá
    { baixo: 48, arp: [60, 64, 67, 72] },   // Dó
    { baixo: 50, arp: [62, 65, 69, 74] },   // Dm
    { baixo: 46, arp: [58, 62, 65, 70] },   // Sib
    { baixo: 48, arp: [60, 64, 67, 72] },   // Dó
    { baixo: 45, arp: [57, 61, 64, 69] }    // Lá
  ];

  const ARP = [0, 1, 2, 3, 2, 1, 2, 1];    

  const MELODIA = [
    [[0, 74, 2], [2, 77, 2], [4, 81, 4], [8, 79, 2], [10, 77, 2], [12, 74, 4]],
    [[0, 74, 2], [2, 77, 2], [4, 82, 4], [8, 81, 2], [10, 77, 2], [12, 74, 4]],
    [[0, 77, 2], [2, 81, 2], [4, 84, 4], [8, 81, 2], [10, 77, 2], [12, 72, 4]],
    [[0, 79, 2], [2, 76, 2], [4, 72, 4], [8, 76, 2], [10, 79, 4], [14, 76, 2]],
    [[0, 81, 4], [4, 86, 4], [8, 84, 2], [10, 81, 2], [12, 77, 4]],
    [[0, 82, 4], [4, 86, 4], [8, 84, 2], [10, 82, 2], [12, 77, 4]],
    [[0, 84, 4], [4, 79, 2], [6, 84, 2], [8, 88, 4], [12, 86, 2], [14, 84, 2]],
    [[0, 85, 4], [4, 81, 4], [8, 85, 2], [10, 88, 2], [12, 86, 4]]
  ];

  const TOTAL_PASSOS = ACORDES.length * 16;

  
  function agendarPasso(passo, t) {
    const barra = Math.floor(passo / 16);
    const s = passo % 16;
    const acorde = ACORDES[barra];

    if (s % 2 === 0) {
      tom(ganhoMusica, 'triangle', mtof(acorde.baixo + (s % 4 === 2 ? 12 : 0)), t, PASSO * 1.8, 0.22);
    }
 
    tom(ganhoMusica, 'square', mtof(acorde.arp[ARP[s % 8]]), t, PASSO * 0.8, 0.03);

    MELODIA[barra].forEach(([inicio, nota, dur]) => {
      if (inicio === s) tom(ganhoMusica, 'square', mtof(nota), t, PASSO * dur * 0.95, 0.07);
    });


    if (s === 0 || s === 8) bumbo(t);
    if (s === 4 || s === 12) ruido(t, 0.09, 0.12, 'highpass', 1500);   
    if (s % 2 === 0) ruido(t, 0.03, 0.05, 'highpass', 7000);          
  }

  function agendador() {
    while (proximoTempo < ctx.currentTime + AGENDA_ADIANTADA) {
      agendarPasso(proximoPasso, proximoTempo);
      proximoTempo += PASSO;
      proximoPasso = (proximoPasso + 1) % TOTAL_PASSOS;
    }
  }

  function iniciarMusica() {
    if (timer) return;                           
    if (!obterContexto()) return;
    proximoPasso = 0;
    proximoTempo = ctx.currentTime + 0.1;
    ganhoMusica.gain.cancelScheduledValues(ctx.currentTime);
    ganhoMusica.gain.setTargetAtTime(VOLUME_MUSICA, ctx.currentTime, 0.05);
    timer = setInterval(agendador, 50);
    agendador();
  }

  function pararMusica() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    if (ctx) {
      ganhoMusica.gain.cancelScheduledValues(ctx.currentTime);
      ganhoMusica.gain.setTargetAtTime(0, ctx.currentTime, 0.04);  
    }
  }

  function alternarEfeitos() {
    efeitosLigados = !efeitosLigados;
    salvar(CHAVE_EFEITOS, efeitosLigados);
    if (efeitosLigados) tocar('ligar');           
    return efeitosLigados;
  }

  function alternarMusica() {
    musicaLigada = !musicaLigada;
    salvar(CHAVE_MUSICA, musicaLigada);
    if (musicaLigada) iniciarMusica(); else pararMusica();
    return musicaLigada;
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return {
    tocar, iniciarMusica, alternarEfeitos, alternarMusica,
    efeitosLigados: () => efeitosLigados,
    musicaLigada: () => musicaLigada
  };
})();

const btnSom    = document.getElementById('btn-som');
const btnMusica = document.getElementById('btn-musica');

function aplicarEstado(botao, ligado, textoLigado, textoDesligado) {
  const texto = ligado ? textoLigado : textoDesligado;
  botao.setAttribute('aria-pressed', String(ligado));
  botao.setAttribute('aria-label', texto);
  botao.title = texto;                       
}

function atualizarBotoesSom() {
  aplicarEstado(btnSom, Som.efeitosLigados(),
    'Efeitos sonoros ligados. Clique para desligar',
    'Efeitos sonoros desligados. Clique para ligar');
  aplicarEstado(btnMusica, Som.musicaLigada(),
    'Música ligada. Clique para desligar',
    'Música desligada. Clique para ligar');
}

btnSom.addEventListener('click', () => { Som.alternarEfeitos(); atualizarBotoesSom(); });
btnMusica.addEventListener('click', () => { Som.alternarMusica(); atualizarBotoesSom(); });
atualizarBotoesSom();

btnJogar.addEventListener('click',  () => Som.tocar('iniciar'));
btnVoltar.addEventListener('click', () => Som.tocar('voltar'));
btnCasa.addEventListener('click',   () => Som.tocar('voltar'));
btnAlbum.addEventListener('click',  () => Som.tocar('iniciar'));
btnAlbumVoltar.addEventListener('click', () => Som.tocar('voltar'));
document.querySelectorAll('.btn-fase').forEach(b => b.addEventListener('click', () => Som.tocar('iniciar')));

function primeiraInteracao(evento) {
  if (evento.target.closest && evento.target.closest('.btn-som')) return;
  document.removeEventListener('click', primeiraInteracao);
  document.removeEventListener('keydown', primeiraInteracao);
  if (Som.musicaLigada()) Som.iniciarMusica();
}
document.addEventListener('click', primeiraInteracao);
document.addEventListener('keydown', primeiraInteracao);

const perguntas = [
 {p:"Qual instrumento antigo é usado para fazer cálculos com contas deslizantes?", o:["Ábaco","Mouse","Impressora","Monitor"], c:0, explicacao:"Isso! O ábaco é um instrumento de cálculo muito antigo."},
 {p:"Quem é frequentemente chamada de primeira programadora da história?", o:["Grace Hopper","Ada Lovelace","Hedy Lamarr","Katherine Johnson"], c:1, explicacao:"Ada Lovelace escreveu um algoritmo para a máquina analítica de Charles Babbage."},
 {p:"Quem projetou a Máquina Analítica, uma precursora conceitual do computador?", o:["Charles Babbage","Alan Turing","Bill Gates","Tim Berners-Lee"], c:0, explicacao:"Charles Babbage idealizou a Máquina Analítica no século XIX."},
 {p:"Qual máquina eletromecânica foi usada para ajudar a decifrar códigos na Segunda Guerra Mundial?", o:["ENIAC","Colossus","UNIVAC","Apple I"], c:1, explicacao:"O Colossus foi desenvolvido para auxiliar a criptoanálise durante a guerra."},
 {p:"Qual computador é um exemplo famoso da primeira geração, usando válvulas?", o:["ENIAC","IBM PC","Macintosh","Notebook moderno"], c:0, explicacao:"O ENIAC utilizava milhares de válvulas eletrônicas."},
 {p:"Qual componente substituiu as válvulas na segunda geração de computadores?", o:["Transistor","Microprocessador","Cartão SD","Tela sensível ao toque"], c:0, explicacao:"Os transistores eram menores e mais eficientes que as válvulas."},
 {p:"O circuito integrado ficou especialmente associado a qual geração?", o:["Primeira","Segunda","Terceira","Quinta apenas"], c:2, explicacao:"A terceira geração é marcada pelo uso de circuitos integrados."},
 {p:"O que tornou os computadores pessoais mais viáveis a partir da quarta geração?", o:["Microprocessadores","Válvulas maiores","Ábacos eletrônicos","Máquinas a vapor"], c:0, explicacao:"O microprocessador reuniu funções centrais de processamento em um chip."},
 {p:"Quem propôs um modelo teórico fundamental para a computação e ajudou a decifrar códigos nazistas?", o:["Alan Turing","Steve Jobs","Konrad Zuse","Mark Zuckerberg"], c:0, explicacao:"Alan Turing contribuiu profundamente para a teoria da computação e a criptoanálise."},
 {p:"Quem cofundou a Microsoft com Paul Allen?", o:["Steve Wozniak","Bill Gates","Dennis Ritchie","Linus Torvalds"], c:1, explicacao:"Bill Gates e Paul Allen fundaram a Microsoft."},
 {p:"Quem cofundou a Apple com Steve Jobs e ajudou a projetar computadores pessoais?", o:["Steve Wozniak","Tim Berners-Lee","John von Neumann","Blaise Pascal"], c:0, explicacao:"Steve Wozniak foi um importante engenheiro e cofundador da Apple."},
 {p:"Quem criou a World Wide Web, sistema que facilitou a navegação entre páginas na internet?", o:["Vint Cerf","Tim Berners-Lee","Larry Page","Ada Lovelace"], c:1, explicacao:"Tim Berners-Lee propôs a World Wide Web em 1989."},
 {p:"Qual linguagem é conhecida por ter sido criada por Dennis Ritchie?", o:["Python","C","JavaScript","Ruby"], c:1, explicacao:"Dennis Ritchie criou a linguagem C, muito influente no desenvolvimento de sistemas."},
 {p:"Qual sistema operacional livre tem o nome associado a Linus Torvalds?", o:["Windows","macOS","Linux","MS-DOS"], c:2, explicacao:"Linus Torvalds iniciou o desenvolvimento do kernel Linux."},
 {p:"Qual destas tecnologias é essencial para os computadores atuais?", o:["Circuitos integrados e microprocessadores","Somente engrenagens","Válvulas de vidro em todos os aparelhos","Réguas de cálculo"], c:0, explicacao:"Os circuitos integrados e microprocessadores são fundamentais na computação moderna."},
  {p:"Qual dispositivo foi inventado por Blaise Pascal para ajudar a realizar cálculos matemáticos?", o:["Pascalina","Ábaco romano","ENIAC","Máquina de Turing"], c:0, explicacao:"A Pascalina foi uma calculadora mecânica criada por Blaise Pascal no século XVII."},
 {p:"Quem desenvolveu uma máquina de calcular chamada Stepped Reckoner?", o:["Charles Babbage","Gottfried Wilhelm Leibniz","Alan Turing","Bill Gates"], c:1, explicacao:"Gottfried Wilhelm Leibniz desenvolveu uma máquina mecânica capaz de realizar operações como multiplicação e divisão."},
 {p:"Qual matemática trabalhou com Charles Babbage e escreveu um algoritmo para a Máquina Analítica?", o:["Grace Hopper","Katherine Johnson","Ada Lovelace","Margaret Hamilton"], c:2, explicacao:"Ada Lovelace descreveu um algoritmo para a Máquina Analítica, sendo reconhecida como pioneira da programação."},
 {p:"Quem criou uma das primeiras máquinas programáveis funcionais, chamada Z3?", o:["Konrad Zuse","John von Neumann","Steve Jobs","Dennis Ritchie"], c:0, explicacao:"Konrad Zuse construiu o Z3, apresentado em 1941, considerado um marco inicial dos computadores programáveis."},
 {p:"Qual foi a principal função do computador Colossus durante a Segunda Guerra Mundial?", o:["Criar jogos eletrônicos","Decifrar mensagens criptografadas","Controlar redes sociais","Editar documentos"], c:1, explicacao:"O Colossus foi desenvolvido para ajudar a analisar mensagens criptografadas alemãs durante a Segunda Guerra Mundial."},
 {p:"Qual era uma das principais limitações dos computadores da primeira geração?", o:["Não conseguiam realizar cálculos","Eram pequenos demais","Consumiam muita energia e produziam calor","Funcionavam exclusivamente com internet"], c:2, explicacao:"Os computadores da primeira geração utilizavam válvulas eletrônicas, que consumiam muita energia e geravam bastante calor."},
 {p:"Qual empresa lançou o computador pessoal IBM PC em 1981?", o:["Apple","IBM","Microsoft","Intel"], c:1, explicacao:"A IBM lançou o IBM PC em 1981, contribuindo para a popularização dos computadores pessoais."},
 {p:"Qual empresa desenvolveu o microprocessador Intel 4004, lançado em 1971?", o:["Intel","Apple","IBM","Microsoft"], c:0, explicacao:"A Intel lançou o 4004 em 1971, um dos primeiros microprocessadores comerciais de uso geral."},
 {p:"Qual foi uma das principais contribuições de John von Neumann para a computação?", o:["A criação da World Wide Web","A arquitetura de computador com programa armazenado","A criação do mouse óptico","O desenvolvimento do Linux"], c:1, explicacao:"A arquitetura associada a von Neumann utiliza uma memória para armazenar instruções e dados do programa."},
 {p:"Quem liderou a equipe de software de voo da missão Apollo 11 no MIT?", o:["Margaret Hamilton","Ada Lovelace","Grace Hopper","Hedy Lamarr"], c:0, explicacao:"Margaret Hamilton liderou a equipe responsável pelo desenvolvimento do software de voo das missões Apollo no MIT."},
 {p:"Quem ficou conhecida por popularizar o termo 'bug' na programação?", o:["Grace Hopper","Ada Lovelace","Katherine Johnson","Radia Perlman"], c:0, explicacao:"Grace Hopper ajudou a popularizar o uso do termo 'bug' na computação após o registro de uma mariposa encontrada em um computador. O termo já era usado antes desse episódio."},
 {p:"Qual linguagem de programação foi criada por Guido van Rossum?", o:["C++","Java","Python","Pascal"], c:2, explicacao:"Guido van Rossum criou Python, uma linguagem conhecida por sua sintaxe relativamente simples e legível."},
 {p:"Qual empresa lançou o Macintosh em 1984?", o:["Microsoft","Apple","IBM","Intel"], c:1, explicacao:"A Apple lançou o Macintosh em 1984, destacando a interface gráfica e o uso do mouse."},
 {p:"Qual dispositivo permite controlar o ponteiro na interface gráfica de um computador?", o:["Scanner","Mouse","Roteador","Processador"], c:1, explicacao:"O mouse permite movimentar o ponteiro e interagir com elementos da interface gráfica."},

 {p:"Quem é associado à criação do primeiro mouse de computador demonstrado publicamente em 1968?", o:["Douglas Engelbart","Tim Berners-Lee","Linus Torvalds","Steve Jobs"], c:0, explicacao:"Douglas Engelbart liderou o desenvolvimento do mouse e apresentou o dispositivo em uma demonstração histórica em 1968."}
];

function embaralharPerguntas(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
}

embaralharPerguntas(perguntas);

const imagensFigurinhas = [
    "figurinhas/personagem1.jpeg",
    "figurinhas/personagem2.jpeg",
    "figurinhas/personagem3.jpeg",
    "figurinhas/personagem4.jpeg",
    "figurinhas/personagem5.jpeg",
    "figurinhas/personagem6.jpeg",
    "figurinhas/personagem7.jpeg",
    "figurinhas/personagem8.jpeg",
    "figurinhas/personagem9.jpeg",
    "figurinhas/personagem10.jpeg"
];

let indicePergunta = 0, acertosCiclo = 0, totalCorretas = 0, figurinhas = [], respondida = false;
const elPergunta = document.getElementById('texto-pergunta');
const elOpcoes = document.getElementById('opcoes-resposta');
const elFeedback = document.getElementById('feedback-resposta');
const elNumero = document.getElementById('numero-pergunta');
const elContador = document.getElementById('contador-figurinhas');
const elAcertos = document.getElementById('contador-acertos');
const elBarra = document.getElementById('barra-progresso');
const elRecompensa = document.getElementById('recompensa');
const elImagemFigurinha = document.getElementById('figurinha');
const elNomeFigurinha = document.getElementById('nome-figurinha');

function reiniciarQuiz() {
  indicePergunta = 0; acertosCiclo = 0; totalCorretas = 0; figurinhas = [];
  carregarPergunta();
}
function carregarPergunta() {
  respondida = false;
  const q = perguntas[indicePergunta % perguntas.length];
  elNumero.textContent = `PERGUNTA ${indicePergunta + 1}`;
  elPergunta.textContent = q.p;
  elOpcoes.innerHTML = '';
  elFeedback.textContent = '';
  elFeedback.className = 'feedback-resposta';
  elRecompensa.hidden = true;
  btnAvancar.disabled = true;
  btnAvancar.textContent = 'AVANÇAR ▶';
  q.o.forEach((opcao, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opcao-resposta'; b.textContent = `${String.fromCharCode(65+i)}. ${opcao}`;
    b.addEventListener('click', () => selecionarResposta(i, b));
    elOpcoes.appendChild(b);
  });
  atualizarProgresso();
}
function selecionarResposta(escolha, botao) {
  if (respondida) return;
  respondida = true;
  const q = perguntas[indicePergunta % perguntas.length];
  [...elOpcoes.children].forEach((b, i) => {
    b.disabled = true;
    if (i === q.c) b.classList.add('correta');
  });
  if (escolha === q.c) {
    acertosCiclo++; totalCorretas++;
    elFeedback.textContent = '✓ RESPOSTA CORRETA! ' + q.explicacao;
    elFeedback.classList.add('feedback-correto');
    Som.tocar('ligar');
  } else {
    botao.classList.add('incorreta');
    elFeedback.textContent = '✗ NÃO FOI DESSA VEZ! ' + q.explicacao;
    elFeedback.classList.add('feedback-errado');
    Som.tocar('voltar');
  }
  let desbloqueou = false;
  if (acertosCiclo >= 2) {
    acertosCiclo = 0;

    const n = figurinhas.length;
    figurinhas.push(n);
    try {
      const salvas = JSON.parse(localStorage.getItem('hc-figurinhas-quiz') || '[]');
      if (!salvas.includes(n)) { salvas.push(n); localStorage.setItem('hc-figurinhas-quiz', JSON.stringify(salvas)); }
    } catch (e) { /* armazenamento indisponível */ }

    elRecompensa.hidden = false;
  elImagemFigurinha.style.display = 'block';
  elImagemFigurinha.alt = `Personagem ${n + 1}`;

  elImagemFigurinha.onerror = () => {
    console.error(
        'Não foi possível carregar a imagem:',
        elImagemFigurinha.src
    );
    elImagemFigurinha.alt = 'Imagem não encontrada. Confira o caminho do arquivo.';
};

elImagemFigurinha.src = imagensFigurinhas[n];

    elNomeFigurinha.textContent = `Personagem histórico ${n + 1}`;
    elFeedback.textContent += ' ✨ Você conquistou uma figurinha!';
}
  atualizarProgresso();
  btnAvancar.disabled = false;
  btnAvancar.textContent = figurinhas.length >= 10 ? 'VER VITÓRIA ★' : 'AVANÇAR ▶';
}
function atualizarProgresso() {
  elContador.textContent = `${figurinhas.length} / 10`;
  elAcertos.textContent = `Acertos neste ciclo: ${acertosCiclo} / 2 para a próxima figurinha`;
  elBarra.style.width = `${acertosCiclo * 50}%`;
}
function avancarPergunta() {
  if (!respondida) return;
  if (figurinhas.length >= 10) { mostrarVitoria(); return; }
  indicePergunta++;
  carregarPergunta();
}
function mostrarVitoria() {
    marcarFaseCompleta(2);
    const grade = document.getElementById('colecao-final');
    grade.innerHTML = '';

    figurinhas.forEach((n) => {
        const card = document.createElement('div');
        card.className = 'figurinha-final';

        const img = document.createElement('img');
        img.src = imagensFigurinhas[n];
        img.alt = `Personagem ${n + 1}`;

        img.onerror = () => {
            console.error('Não foi possível carregar a imagem:', img.src);
            img.alt = 'Imagem não encontrada';
        };

        const nome = document.createElement('span');
        nome.textContent = `Personagem ${n + 1}`;

        card.append(img, nome);
        grade.appendChild(card);
    });

    mostrarTela(telaVitoria, document.getElementById('vitoria-titulo'));
}
