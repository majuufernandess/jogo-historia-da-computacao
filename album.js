'use strict';

/* ===== ÁLBUM: 3 páginas com efeito de virar ===== */

const telaAlbumEl   = document.getElementById('tela-album');
const elLivro       = document.getElementById('livro');
const elIndicador   = document.getElementById('album-indicador');
const btnPagAnt     = document.getElementById('btn-pag-ant');
const btnPagProx    = document.getElementById('btn-pag-prox');

function lerLista(chave) {
  try { return JSON.parse(localStorage.getItem(chave) || '[]'); } catch (e) { return []; }
}

const CHAVE_FASES = 'hc-fases-completas';

function fasesCompletas() { return lerLista(CHAVE_FASES); }

/* chamada quando o jogador termina uma fase: libera a página dela no álbum */
function marcarFaseCompleta(n) {
  try {
    const l = fasesCompletas();
    if (!l.includes(n)) { l.push(n); localStorage.setItem(CHAVE_FASES, JSON.stringify(l)); }
  } catch (e) { /* armazenamento indisponível */ }
}

/* a página só mostra as figurinhas depois que a fase dela foi concluída */
function paginasDoAlbum() {
  const feitas = fasesCompletas();
  return [
    {
      fase: 1, titulo: 'MÁQUINAS', cols: 4, ar: '352 / 446', ok: feitas.includes(1),
      itens: CARTAS_LINHA.map(c => ({ info: 'm:' + c.id, img: `png/maquinas/${IMAGENS_CARTAS[c.id]}`, alt: `${c.nome} (${c.ano})` }))
    },
    {
      fase: 2, titulo: 'PERSONALIDADES', cols: 5, ar: '235 / 336', ok: feitas.includes(2),
      itens: imagensFigurinhas.map((src, i) => ({ info: 'p:' + i, img: src, alt: `Personagem ${i + 1}` }))
    },
    {
      fase: 3, titulo: 'LINGUAGENS', cols: 4, ar: '348 / 418', ok: feitas.includes(3),
      itens: LINGUAGENS.map(l => ({ info: 'l:' + l.id, img: `png/memoria/figurinha-${l.id}.png`, alt: `${l.nome} (${l.ano})` }))
    }
  ];
}

let paginaAtual = 0;
let totalPaginas = 3;

function montarAlbum() {
  const paginas = paginasDoAlbum();
  totalPaginas = paginas.length;
  elLivro.innerHTML = '';
  paginas.forEach((p, i) => {
    const sec = document.createElement('section');
    sec.className = 'pagina';
    sec.setAttribute('aria-label', `Página ${i + 1}: ${p.titulo}`);
    const feitos = p.ok ? p.itens.length : 0;
    sec.innerHTML = `<div class="pagina__topo"><div class="pagina__titulos"><h3 class="pagina__titulo">${p.titulo}</h3>${p.ok ? '<span class="pagina__dica">▶ CLIQUE NA IMAGEM</span>' : ''}</div><span class="pagina__contagem">${feitos} / ${p.itens.length}</span></div>`;
    if (!p.ok) sec.innerHTML += `<p class="pagina__aviso">COMPLETE A FASE ${p.fase} PARA DESBLOQUEAR AS FIGURINHAS</p>`;
    const grade = document.createElement('div');
    grade.className = 'pagina__grade';
    grade.style.setProperty('--cols', p.cols);
    p.itens.forEach(it => {
      const slot = document.createElement('div');
      slot.style.setProperty('--ar', p.ar);
      if (p.ok) {
        slot.className = 'album-slot album-slot--aberto';
        slot.dataset.info = it.info;
        slot.tabIndex = 0;
        slot.setAttribute('role', 'button');
        slot.setAttribute('aria-label', `Ver detalhes: ${it.alt}`);
        slot.innerHTML = `<img src="${it.img}" alt="${it.alt}" draggable="false">`;
      } else {
        slot.className = 'album-slot album-slot--vazio';
        slot.innerHTML = '<span aria-hidden="true">?</span>';
        slot.setAttribute('aria-label', 'Figurinha ainda não desbloqueada');
      }
      grade.appendChild(slot);
    });
    sec.appendChild(grade);
    elLivro.appendChild(sec);
  });
}

function atualizarPaginas() {
  const paginas = [...elLivro.children];
  paginas.forEach((pg, i) => {
    const passada = i < paginaAtual;
    pg.classList.toggle('passada', passada);
    pg.style.zIndex = passada ? String(paginas.length + i) : String(paginas.length - i);
    pg.setAttribute('aria-hidden', String(i !== paginaAtual));
  });
  elIndicador.textContent = `${paginaAtual + 1} / ${totalPaginas}`;
  btnPagAnt.disabled = paginaAtual === 0;
  btnPagProx.disabled = paginaAtual === totalPaginas - 1;
}

function virarPagina(delta) {
  const nova = Math.min(totalPaginas - 1, Math.max(0, paginaAtual + delta));
  if (nova === paginaAtual) return;
  paginaAtual = nova;
  Som.tocar('clique');
  atualizarPaginas();
}

function abrirAlbum(pagina = 0) {
  montarAlbum();
  paginaAtual = Math.min(totalPaginas - 1, Math.max(0, pagina));
  atualizarPaginas();
  mostrarTela(telaAlbumEl, document.getElementById('album-titulo'));
}

btnPagAnt.addEventListener('click', () => virarPagina(-1));
btnPagProx.addEventListener('click', () => virarPagina(1));

document.addEventListener('keydown', (e) => {
  if (telaAtual !== telaAlbumEl || !elDetalhe.hidden) return;
  if (e.key === 'ArrowRight') virarPagina(1);
  if (e.key === 'ArrowLeft') virarPagina(-1);
});

/* arrastar/deslizar para virar */
let inicioToque = null;
elLivro.addEventListener('pointerdown', (e) => { inicioToque = { x: e.clientX, y: e.clientY }; });
elLivro.addEventListener('pointerup', (e) => {
  if (!inicioToque) return;
  const dx = e.clientX - inicioToque.x, dy = e.clientY - inicioToque.y;
  inicioToque = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) virarPagina(dx < 0 ? 1 : -1);
});
elLivro.addEventListener('pointercancel', () => { inicioToque = null; });


/* ===== detalhes da figurinha ===== */
const elDetalhe = document.getElementById('album-detalhe');
const elDetImg  = document.getElementById('detalhe-img');
let slotAberto = null;

function abrirDetalhe(slot) {
  const info = INFO_ALBUM[slot.dataset.info];
  if (!info) return;
  slotAberto = slot;
  elDetImg.src = slot.querySelector('img').src;
  elDetImg.alt = info.nome;
  document.getElementById('detalhe-nome').textContent = info.nome;
  document.getElementById('detalhe-meta').textContent = info.meta;
  document.getElementById('detalhe-historia').textContent = info.historia;
  const lista = document.getElementById('detalhe-lista');
  lista.innerHTML = '';
  info.destaques.forEach(t => { const li = document.createElement('li'); li.textContent = t; lista.appendChild(li); });
  elDetalhe.hidden = false;
  elDetalhe.querySelector('.detalhe-painel').scrollTop = 0;
  Som.tocar('clique');
  document.getElementById('btn-detalhe-fechar').focus({ preventScroll: true });
}

function fecharDetalhe() {
  if (elDetalhe.hidden) return;
  elDetalhe.hidden = true;
  Som.tocar('voltar');
  if (slotAberto) slotAberto.focus({ preventScroll: true });
  slotAberto = null;
}

elLivro.addEventListener('click', (e) => {
  const slot = e.target.closest('.album-slot--aberto');
  if (slot) abrirDetalhe(slot);
});
elLivro.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('album-slot--aberto')) {
    e.preventDefault();
    abrirDetalhe(e.target);
  }
});
document.getElementById('btn-detalhe-fechar').addEventListener('click', fecharDetalhe);
elDetalhe.addEventListener('click', (e) => { if (e.target === elDetalhe) fecharDetalhe(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharDetalhe(); });
