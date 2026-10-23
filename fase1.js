'use strict';

/* ===== FASE 1: LINHA DO TEMPO ===== */

const telaFase1Intro = document.getElementById('tela-fase1-intro');
const telaFase1      = document.getElementById('tela-fase1');
const elLinhaSlots        = document.getElementById('linha-slots');
const elLinhaBandeja      = document.getElementById('bandeja');
const elFeedbackLinha     = document.getElementById('feedback-linha');
const elContCartas   = document.getElementById('contador-cartas');
const telaFase1Final = document.getElementById('tela-fase1-final');
const elColecaoLinha = document.getElementById('colecao-linha');

/* Já em ordem cronológica: a posição no vetor é o lugar certo na linha do tempo. */
const CARTAS_LINHA = [
  { id: 'abaco',     nome: 'ÁBACO',            ano: 'c. 3000 a.C.', fato: 'Instrumento de cálculo com contas deslizantes.',
    arte: [['#f6d77b','M1 2h14v1h-14z M1 13h14v1h-14z M1 2h1v12h-1z M14 2h1v12h-1z'],['#efe2ff','M2 5h12v1h-12z M2 8h12v1h-12z M2 11h12v1h-12z'],['#ff9bbd','M3 4h2v2h-2z M5 4h2v2h-2z M7 4h2v2h-2z M12 4h2v2h-2z M3 7h2v2h-2z M10 7h2v2h-2z M12 7h2v2h-2z M3 10h2v2h-2z M5 10h2v2h-2z M10 10h2v2h-2z']] },
  { id: 'pascalina', nome: 'PASCALINA',        ano: '1642', fato: 'Calculadora mecânica criada por Blaise Pascal.',
    arte: [['#c9a6f5','M3 3h10v2h-10z'],['#f6d77b','M2 5h12v8h-12z'],['#4a2285','M4 7h3v3h-3z M9 7h3v3h-3z M4 11h8v1h-8z'],['#efe2ff','M5 8h1v1h-1z M10 8h1v1h-1z']] },
  { id: 'analitica', nome: 'MÁQ. ANALÍTICA',   ano: '1837', fato: 'Projeto de Charles Babbage, precursor do computador.',
    arte: [['#f6d77b','M5 5h6v6h-6z M7 3h2v10h-2z M3 7h10v2h-10z'],['#4a2285','M7 7h2v2h-2z'],['#ff9bbd','M12 10h2v5h-2z M11 11h4v3h-4z'],['#4a2285','M12 12h2v1h-2z']] },
  { id: 'z3',        nome: 'Z3',               ano: '1941', fato: 'Primeiro computador programável funcional, de Konrad Zuse.',
    arte: [['#efe2ff','M2 2h12v4h-12z'],['#4a2285','M3 3h1v1h-1z M5 4h1v1h-1z M7 3h1v1h-1z M9 4h1v1h-1z M11 3h1v1h-1z M13 4h1v1h-1z'],['#c9a6f5','M2 8h3v3h-3z M6 8h3v3h-3z M10 8h3v3h-3z M2 12h3v2h-3z M6 12h3v2h-3z M10 12h3v2h-3z']] },
  { id: 'colossus',  nome: 'COLOSSUS',         ano: '1943', fato: 'Ajudou a decifrar mensagens na Segunda Guerra Mundial.',
    arte: [['#efe2ff','M3 3h3v8h-3z M7 3h3v8h-3z M11 3h3v8h-3z'],['#f6d77b','M4 5h1v5h-1z M8 5h1v5h-1z M12 5h1v5h-1z'],['#4a2285','M3 11h3v2h-3z M7 11h3v2h-3z M11 11h3v2h-3z'],['#c9a6f5','M2 13h13v1h-13z']] },
  { id: 'eniac',     nome: 'ENIAC',            ano: '1946', fato: 'Um dos primeiros computadores eletrônicos, movido a válvulas.',
    arte: [['#c9a6f5','M1 2h14v12h-14z'],['#4a2285','M2 3h12v10h-12z'],['#f6d77b','M3 4h2v2h-2z M9 4h2v2h-2z M6 7h2v2h-2z M12 7h2v2h-2z M3 10h2v2h-2z M9 10h2v2h-2z'],['#ff9bbd','M6 4h2v2h-2z M12 4h2v2h-2z M3 7h2v2h-2z M9 7h2v2h-2z M6 10h2v2h-2z M12 10h2v2h-2z']] },
  { id: 'ibmpc',     nome: 'IBM PC',           ano: '1981', fato: 'Ajudou a popularizar os computadores pessoais.',
    arte: [['#c9a6f5','M2 2h12v8h-12z'],['#4a2285','M3 3h10v6h-10z'],['#75e0ad','M4 4h3v1h-3z M4 6h5v1h-5z M10 6h1v1h-1z'],['#efe2ff','M1 11h14v3h-14z'],['#4a2285','M10 12h4v1h-4z']] },
  { id: 'mac',       nome: 'MACINTOSH',        ano: '1984', fato: 'Popularizou a interface gráfica e o mouse.',
    arte: [['#efe2ff','M3 1h10v13h-10z'],['#4a2285','M5 3h6v6h-6z'],['#75e0ad','M6 5h1v1h-1z M9 5h1v1h-1z M6 7h1v1h-1z M7 8h2v1h-2z M9 7h1v1h-1z'],['#9c5ee0','M6 11h4v1h-4z'],['#c9a6f5','M2 14h12v1h-12z']] }
];

const IMAGENS_CARTAS = {
  abaco: 'abaco.png', pascalina: 'pascalina.png', analitica: 'maquina-analitica.png', z3: 'z3.png',
  colossus: 'colossus.png', eniac: 'eniac.png', ibmpc: 'ibm-pc.png', mac: 'macintoch.png'
};

const CHAVE_CARTAS = 'hc-cartas-linha-tempo';

function svgCarta(c) {
  const g = c.arte.map(([cor, d]) => `<path fill="${cor}" d="${d}"/>`).join('');
  return `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${g}</svg>`;
}

function salvarCarta(id) {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_CARTAS) || '[]');
    if (!lista.includes(id)) { lista.push(id); localStorage.setItem(CHAVE_CARTAS, JSON.stringify(lista)); }
  } catch (e) { /* armazenamento indisponível: o jogo segue normalmente */ }
}

let selecionada = null;
let desbloqueadas = 0;
let ignorarClique = false;
let arrasto = null;

function embaralharCartas(lista) {
  const a = lista.slice();
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((c, i) => c === lista[i]));
  return a;
}

function montarFase1() {
  elLinhaSlots.innerHTML = '';
  elLinhaBandeja.innerHTML = '';
  elFeedbackLinha.textContent = 'Arraste cada carta para o lugar certo!';
  elFeedbackLinha.className = 'feedback-resposta';
  selecionada = null;
  desbloqueadas = 0;
  elContCartas.textContent = `0 / ${CARTAS_LINHA.length}`;

  CARTAS_LINHA.forEach((_, i) => {
    const s = document.createElement('div');
    s.className = 'slot';
    s.dataset.i = i;
    s.tabIndex = 0;
    s.setAttribute('role', 'button');
    s.setAttribute('aria-label', `Posição ${i + 1} da linha do tempo`);
    s.innerHTML = `<span class="slot__num">${i + 1}</span>`;
    elLinhaSlots.appendChild(s);
  });

  embaralharCartas(CARTAS_LINHA).forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'carta';
    b.dataset.id = c.id;
    b.dataset.ordem = CARTAS_LINHA.indexOf(c);
    b.innerHTML = `<img class="carta__img" src="png/maquinas/${IMAGENS_CARTAS[c.id]}" alt="${c.nome}" draggable="false">`;
    b.setAttribute('aria-label', c.nome);
    elLinhaBandeja.appendChild(b);
  });
}

function selecionarCarta(carta) {
  if (selecionada) selecionada.classList.remove('selecionada');
  if (selecionada === carta) { selecionada = null; return; }
  selecionada = carta;
  carta.classList.add('selecionada');
}

function tentarColocar(carta, slot) {
  if (slot.classList.contains('cheio')) return;
  const pos = Number(slot.dataset.i);
  const ordem = Number(carta.dataset.ordem);
  const dados = CARTAS_LINHA[ordem];

  if (pos === ordem) {
    if (selecionada) selecionada.classList.remove('selecionada');
    selecionada = null;
    carta.classList.remove('selecionada', 'arrastando');
    carta.classList.add('desbloqueada');
    slot.classList.add('cheio');
    slot.appendChild(carta);
    carta.tabIndex = -1;
    carta.disabled = true;
    desbloqueadas++;
    elContCartas.textContent = `${desbloqueadas} / ${CARTAS_LINHA.length}`;
    elFeedbackLinha.className = 'feedback-resposta feedback-correto';
    elFeedbackLinha.textContent = `CARTA DESBLOQUEADA! ${dados.nome} (${dados.ano}): ${dados.fato}`;
    salvarCarta(dados.id);
    Som.tocar('acerto');
    if (desbloqueadas === CARTAS_LINHA.length) {
      setTimeout(mostrarFinalFase1, 1400);
    }
  } else {
    const dica = ordem < pos ? 'Essa máquina é mais ANTIGA que isso!' : 'Essa máquina é mais NOVA que isso!';
    elFeedbackLinha.className = 'feedback-resposta feedback-errado';
    elFeedbackLinha.textContent = `Ops! ${dica} Tente outro lugar.`;
    [carta, slot].forEach(el => { el.classList.remove('errou'); void el.offsetWidth; el.classList.add('errou'); setTimeout(() => el.classList.remove('errou'), 450); });
    Som.tocar('erro');
  }
}

/* clique: seleciona a carta (ou posiciona a carta selecionada no slot tocado) */
elLinhaBandeja.addEventListener('click', (e) => {
  const carta = e.target.closest('.carta');
  if (!carta) return;
  if (ignorarClique) { ignorarClique = false; return; }
  selecionarCarta(carta);
});

elLinhaSlots.addEventListener('click', (e) => {
  const slot = e.target.closest('.slot');
  if (slot && selecionada) tentarColocar(selecionada, slot);
});

elLinhaSlots.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('slot')) {
    e.preventDefault();
    if (selecionada) tentarColocar(selecionada, e.target);
  }
});

/* arrastar com mouse ou dedo */
elLinhaBandeja.addEventListener('pointerdown', (e) => {
  const carta = e.target.closest('.carta');
  if (!carta || arrasto || (e.pointerType === 'mouse' && e.button !== 0)) return;
  arrasto = { carta, x0: e.clientX, y0: e.clientY, fantasma: null, id: e.pointerId };
  try { carta.setPointerCapture(e.pointerId); } catch (_) {}
});

elLinhaBandeja.addEventListener('pointermove', (e) => {
  if (!arrasto || e.pointerId !== arrasto.id) return;
  if (!arrasto.fantasma) {
    if (Math.hypot(e.clientX - arrasto.x0, e.clientY - arrasto.y0) < 8) return;
    const r = arrasto.carta.getBoundingClientRect();
    const f = arrasto.carta.cloneNode(true);
    f.classList.add('fantasma');
    f.classList.remove('selecionada');
    f.style.width = r.width + 'px';
    f.style.height = r.height + 'px';
    document.body.appendChild(f);
    arrasto.fantasma = f;
    arrasto.w = r.width; arrasto.h = r.height;
    arrasto.carta.classList.add('arrastando');
  }
  arrasto.fantasma.style.left = (e.clientX - arrasto.w / 2) + 'px';
  arrasto.fantasma.style.top  = (e.clientY - arrasto.h / 2) + 'px';
  const alvo = document.elementFromPoint(e.clientX, e.clientY);
  elLinhaSlots.querySelectorAll('.slot.alvo').forEach(s => s.classList.remove('alvo'));
  const s = alvo && alvo.closest ? alvo.closest('.slot') : null;
  if (s && !s.classList.contains('cheio')) s.classList.add('alvo');
});

function terminarArrasto(e, soltou) {
  if (!arrasto || e.pointerId !== arrasto.id) return;
  const { carta, fantasma } = arrasto;
  arrasto = null;
  elLinhaSlots.querySelectorAll('.slot.alvo').forEach(s => s.classList.remove('alvo'));
  if (fantasma) {
    fantasma.remove();
    carta.classList.remove('arrastando');
    ignorarClique = true;
    setTimeout(() => { ignorarClique = false; }, 0);
    if (soltou) {
      const alvo = document.elementFromPoint(e.clientX, e.clientY);
      const slot = alvo && alvo.closest ? alvo.closest('.slot') : null;
      if (slot) tentarColocar(carta, slot);
    }
  }
}
elLinhaBandeja.addEventListener('pointerup',     (e) => terminarArrasto(e, true));
elLinhaBandeja.addEventListener('pointercancel', (e) => terminarArrasto(e, false));

function mostrarFinalFase1() {
  marcarFaseCompleta(1);
  elColecaoLinha.innerHTML = '';
  CARTAS_LINHA.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'figurinha-final';
    const img = document.createElement('img');
    img.src = `png/maquinas/${IMAGENS_CARTAS[c.id]}`;
    img.alt = c.nome;
    card.appendChild(img);
    elColecaoLinha.appendChild(card);
  });
  mostrarTela(telaFase1Final, document.getElementById('final1-titulo'));
}

/* navegação */
function abrirIntroFase1() {
  mostrarTela(telaFase1Intro, document.getElementById('btn-intro1-comecar'));
}
function comecarFase1() {
  montarFase1();
  mostrarTela(telaFase1, document.getElementById('linha-titulo'));
}

document.getElementById('btn-intro1-comecar').addEventListener('click', () => { Som.tocar('iniciar'); comecarFase1(); });
document.getElementById('btn-intro1-voltar').addEventListener('click',  () => { Som.tocar('voltar'); abrirMapa(); });
document.getElementById('btn-linha-voltar').addEventListener('click',   () => { Som.tocar('voltar'); abrirMapa(); });
document.getElementById('btn-linha-novamente').addEventListener('click', () => { Som.tocar('iniciar'); comecarFase1(); });
document.getElementById('btn-linha-final-mapa').addEventListener('click', () => { Som.tocar('voltar'); abrirMapa(); });

/* ===== FASE 2: explicação antes do quiz ===== */
const telaFase2Intro = document.getElementById('tela-fase2-intro');
function abrirIntroFase2() {
  mostrarTela(telaFase2Intro, document.getElementById('btn-intro2-comecar'));
}
document.getElementById('btn-intro2-comecar').addEventListener('click', () => { Som.tocar('iniciar'); iniciarJogo(); });
document.getElementById('btn-intro2-voltar').addEventListener('click',  () => { Som.tocar('voltar'); abrirMapa(); });
