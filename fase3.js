'use strict';

/* ===== FASE 3: JOGO DA MEMÓRIA (linguagens de programação) ===== */

const LINGUAGENS = [
  { id: 'fortran', nome: 'Fortran', ano: 1957 },
  { id: 'lisp',    nome: 'Lisp',    ano: 1958 },
  { id: 'cobol',   nome: 'COBOL',   ano: 1959 },
  { id: 'basic',   nome: 'BASIC',   ano: 1964 },
  { id: 'pascal',  nome: 'Pascal',  ano: 1970 },
  { id: 'c',       nome: 'C',       ano: 1972 },
  { id: 'cpp',     nome: 'C++',     ano: 1983 },
  { id: 'python',  nome: 'Python',  ano: 1991 }
];

const CHAVE_FIG_MEMORIA = 'hc-figurinhas-memoria';

const telaFase3Intro = document.getElementById('tela-fase3-intro');
const telaFase3      = document.getElementById('tela-fase3');
const telaFase3Final = document.getElementById('tela-fase3-final');
const elTabuleiro    = document.getElementById('tabuleiro');
const elFeedbackMem  = document.getElementById('feedback-memoria');
const elContPares    = document.getElementById('contador-pares');
const elDestaque     = document.getElementById('destaque-memoria');
const elDestaqueImg  = document.getElementById('destaque-img');
const elDestaqueTxt  = document.getElementById('destaque-texto');
const btnDestaqueOk  = document.getElementById('btn-destaque-ok');
const elColecaoMem   = document.getElementById('colecao-memoria');

/* verso das cartas */
const VERSO_IMG = '<img src="png/memoria/verso.png" alt="" draggable="false">';

function salvarFigurinhaMemoria(id) {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_FIG_MEMORIA) || '[]');
    if (!lista.includes(id)) { lista.push(id); localStorage.setItem(CHAVE_FIG_MEMORIA, JSON.stringify(lista)); }
  } catch (e) { /* armazenamento indisponível: o jogo segue normalmente */ }
}

let primeira = null;
let bloqueado = false;
let paresAchados = 0;
let ultimoPar = null;
let timerMemorizar = null;
const TEMPO_MEMORIZAR = 3000;   // frente das cartas visível no início (ms)

function embaralharMem(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function montarFase3() {
  elTabuleiro.innerHTML = '';
  elDestaque.hidden = true;
  clearTimeout(timerMemorizar);
  primeira = null; bloqueado = true; paresAchados = 0; ultimoPar = null;
  elContPares.textContent = `0 / ${LINGUAGENS.length}`;
  elFeedbackMem.className = 'feedback-resposta';
  elFeedbackMem.textContent = 'Memorize as cartas!';

  const cartas = [];
  LINGUAGENS.forEach(l => {
    cartas.push({ l, tipo: 'logo', img: `png/memoria/logo-${l.id}.png`, desc: `${l.nome}, logo` });
    cartas.push({ l, tipo: 'ano',  img: `png/memoria/ano-${l.id}.png`,  desc: `Código de exemplo, ano ${l.ano}` });
  });

  embaralharMem(cartas).forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mcarta virada';
    b.dataset.id = c.l.id;
    b.dataset.tipo = c.tipo;
    b.setAttribute('aria-label', `Carta ${i + 1}, virada para baixo`);
    b.innerHTML = `<span class="mcarta__in"><span class="mcarta__verso">${VERSO_IMG}</span><span class="mcarta__frente"><img src="${c.img}" alt="${c.desc}" draggable="false"></span></span>`;
    elTabuleiro.appendChild(b);
  });

  /* mostra a frente das cartas por 3 segundos (contados depois que a tela aparece) e então vira todas */
  timerMemorizar = setTimeout(() => {
    elTabuleiro.querySelectorAll('.mcarta').forEach(c => c.classList.remove('virada'));
    elFeedbackMem.textContent = 'Vire duas cartas e encontre o par!';
    bloqueado = false;
  }, DURACAO_TRANSICAO * 2 + TEMPO_MEMORIZAR);
}

elTabuleiro.addEventListener('click', (e) => {
  const carta = e.target.closest('.mcarta');
  if (!carta || bloqueado || carta.classList.contains('virada') || carta.classList.contains('par')) return;

  carta.classList.add('virada');
  Som.tocar('clique');

  if (!primeira) { primeira = carta; return; }

  const a = primeira, b = carta;
  primeira = null;
  bloqueado = true;

  if (a.dataset.id === b.dataset.id && a.dataset.tipo !== b.dataset.tipo) {
    setTimeout(() => acertouPar(a, b), 650);
  } else {
    elFeedbackMem.className = 'feedback-resposta feedback-errado';
    elFeedbackMem.textContent = 'Não é um par. Tente de novo!';
    setTimeout(() => {
      [a, b].forEach(c => { c.classList.remove('erro'); void c.offsetWidth; c.classList.add('erro'); });
      Som.tocar('erro');
    }, 450);
    setTimeout(() => {
      [a, b].forEach(c => c.classList.remove('virada', 'erro'));
      bloqueado = false;
    }, 1300);
  }
});

function acertouPar(a, b) {
  [a, b].forEach(c => c.classList.add('par'));
  paresAchados++;
  elContPares.textContent = `${paresAchados} / ${LINGUAGENS.length}`;
  const l = LINGUAGENS.find(x => x.id === a.dataset.id);
  ultimoPar = l;
  salvarFigurinhaMemoria(l.id);
  Som.tocar('acerto');

  elFeedbackMem.className = 'feedback-resposta feedback-correto';
  elFeedbackMem.textContent = `PAR! ${l.nome} (${l.ano})`;
  elDestaqueImg.src = `png/memoria/figurinha-${l.id}.png`;
  elDestaqueImg.alt = `Figurinha: ${l.nome}, ${l.ano}`;
  elDestaqueTxt.textContent = `${l.nome} — criada em ${l.ano}`;
  elDestaque.hidden = false;
  btnDestaqueOk.focus({ preventScroll: true });
}

function fecharDestaque() {
  if (elDestaque.hidden) return;
  elDestaque.hidden = true;
  bloqueado = false;
  if (paresAchados === LINGUAGENS.length) {
    mostrarFinalFase3();
  } else {
    const prox = elTabuleiro.querySelector('.mcarta:not(.par)');
    if (prox) prox.focus({ preventScroll: true });
  }
}

btnDestaqueOk.addEventListener('click', () => { Som.tocar('clique'); fecharDestaque(); });
elDestaque.addEventListener('click', (e) => { if (e.target === elDestaque) fecharDestaque(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharDestaque(); });

function mostrarFinalFase3() {
  marcarFaseCompleta(3);
  elColecaoMem.innerHTML = '';
  LINGUAGENS.forEach(l => {
    const card = document.createElement('div');
    card.className = 'figurinha-final';
    const img = document.createElement('img');
    img.src = `png/memoria/figurinha-${l.id}.png`;
    img.alt = `${l.nome}, ${l.ano}`;
    card.appendChild(img);
    elColecaoMem.appendChild(card);
  });
  mostrarTela(telaFase3Final, document.getElementById('final3-titulo'));
}

function abrirIntroFase3() {
  mostrarTela(telaFase3Intro, document.getElementById('btn-intro3-comecar'));
}
function comecarFase3() {
  montarFase3();
  mostrarTela(telaFase3, document.getElementById('memoria-titulo'));
}

document.getElementById('btn-intro3-comecar').addEventListener('click', () => { Som.tocar('iniciar'); comecarFase3(); });
document.getElementById('btn-intro3-voltar').addEventListener('click',  () => { Som.tocar('voltar'); abrirMapa(); });
document.getElementById('btn-memoria-voltar').addEventListener('click', () => { Som.tocar('voltar'); abrirMapa(); });
document.getElementById('btn-memoria-final-mapa').addEventListener('click', () => { Som.tocar('voltar'); abrirMapa(); });
document.getElementById('btn-memoria-novamente').addEventListener('click', () => { Som.tocar('iniciar'); comecarFase3(); });

document.getElementById('btn-memoria-album').addEventListener('click', () => { Som.tocar('iniciar'); abrirAlbum(2); });
