/* Outiiil — Parseur Traceur TDC (ASCII Toolzzz, en-têtes centrés, Net vert/rouge)
 * Intégration Outiiil : pas de bouton Dock ici ; API globale window.OutiiilTDC.{open,close,toggle,fill,parse}
 */
(function(){
'use strict';

/* ==================== Réglages ==================== */
const COLOR_POS  = '#008000';   // vert
const COLOR_NEG  = '#8B0000';   // rouge
const COLOR_DOTS = '#AAAAAA';   // points gris

/* ==================== UI (panneau uniquement) ==================== */
const host=document.createElement('div');
Object.assign(host.style,{position:'fixed',inset:'auto 18px 18px auto',zIndex:999999,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif'});
document.body.appendChild(host);
const shadow=host.attachShadow({mode:'open'});
shadow.innerHTML=`
<style>
:host{all:initial}
.panel{position:fixed;right:18px;bottom:18px;width:1000px;max-height:90vh;overflow:hidden;background:#111723;color:#e7ecf3;border:1px solid #1b2332;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.35);display:none;font-size:15px}
.show{display:block}
.hdr{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0f182b;border-bottom:1px solid #1b2332}
.title{font-size:16px;font-weight:700}
.muted{color:#9db0c9;font-size:12px}
.x{margin-left:auto;cursor:pointer;padding:6px 10px;border-radius:8px;border:1px solid #1b2332}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px}
textarea{width:100%;min-height:280px;background:#0a1220;color:#e7ecf3;border:1px solid #1b2332;border-radius:12px;padding:10px;font-family:ui-monospace,SFMono-Regular,Consolas,Menlo,monospace;line-height:1.45;font-size:15px}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pill{padding:6px 10px;border-radius:999px;border:1px solid #1b2332;background:#0c1526;color:#9db0c9;font-size:12px}
.btn2{all:unset;cursor:pointer;padding:8px 12px;border-radius:10px;background:#0e1727;border:1px solid #1b2332;color:#e7ecf3}
.tabs{display:flex;gap:8px;padding:0 10px 8px 10px;flex-wrap:wrap}
.tab{padding:8px 12px;border:1px solid #1b2332;border-radius:10px;background:#0c1526;color:#9db0c9;cursor:pointer;font-size:14px}
.tab.active{background:#122138;color:#e7ecf3}
.scroll{max-height:38vh;overflow:auto;border:1px solid #1b2332;border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:15px}
th,td{border-bottom:1px solid #1b2332;padding:6px 8px;text-align:left}
th{position:sticky;top:0;background:#0f182b;z-index:1}
.r{text-align:right;font-variant-numeric:tabular-nums}
.mono{font-family:ui-monospace,SFMono-Regular,Consolas,Menlo,monospace}
kbd{background:#0c1526;border:1px solid #1b2332;border-radius:6px;padding:1px 5px;font-size:11px}
.footer{padding:8px 10px;color:#9db0c9;font-size:11px;border-top:1px solid #1b2332;display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
/* poignée de redimensionnement */
.resizer{position:absolute;right:6px;bottom:6px;width:14px;height:14px;cursor:nwse-resize;opacity:.9}
.resizer::before,.resizer::after{content:"";position:absolute;border-color:#1b2332;border-style:solid;opacity:.8}
.resizer::before{right:0;bottom:0;border-width:0 2px 2px 0;width:12px;height:12px;border-radius:0 0 2px 0}
.resizer::after{right:3px;bottom:3px;border-width:0 2px 2px 0;width:9px;height:9px;border-radius:0 0 2px 0}
</style>

<div id="panel" class="panel">
  <div class="hdr">
    <div class="title">Parseur Traceur TDC — Discord → ASCII</div>
    <div id="status" class="muted"></div>
    <div id="close" class="x" title="Fermer (Alt+T)">✕</div>
  </div>

  <div class="grid">
    <div>
      <div class="row" style="justify-content:space-between;margin-bottom:6px">
        <span class="pill">Colle ici tes lignes Discord (gros pavé OK)</span>
        <button id="sample" class="btn2">Exemple</button>
      </div>
      <textarea id="raw" placeholder="— 17/08/2025 08:42
Christheall(TRID): +47 420 282 tdc | 274 610 833 => 322 031 115
eholo(LHDC): -47 420 282 tdc | 237 101 410 => 189 681 128
APP
— Hier à 03:47
..."></textarea>
      <div class="row" style="margin-top:8px">
        <button id="analyze" class="btn2">Analyser</button>
        <button id="clear" class="btn2">Vider</button>
        <span class="muted">Raccourci : <kbd>Alt</kbd>+<kbd>T</kbd></span>
      </div>
    </div>

    <div>
      <div class="tabs">
        <div class="tab active" data-tab="tx">Transactions</div>
        <div class="tab" data-tab="agg">Joueurs</div>
        <div class="tab" data-tab="alli">Alliances</div>
        <div class="tab" data-tab="ups">UPs</div>
        <div class="tab" data-tab="orph">Orphelines</div>
      </div>

      <div class="row" style="padding:0 10px 6px 10px">
        <input id="fPlayer" type="text" placeholder="Filtrer par joueur (contient)"/>
        <input id="fAlly" type="text" placeholder="Filtrer par alliance (contient)"/>
        <select id="fAllyQuick"><option value="">— Alliances détectées —</option></select>
        <button id="fClear" class="btn2">Effacer filtres</button>
      </div>

      <div id="panel-tx">
        <div class="row" style="padding:0 10px 6px 10px">
          <button id="copyTx" class="btn2" disabled>Copier ASCII (transactions)</button>
        </div>
        <div class="scroll"><table id="tblTx"></table></div>
      </div>

      <div id="panel-agg" style="display:none">
        <div class="row" style="padding:0 10px 6px 10px">
          <button id="copyAgg" class="btn2" disabled>Copier ASCII (joueurs)</button>
        </div>
        <div class="scroll"><table id="tblAgg"></table></div>
      </div>

      <div id="panel-alli" style="display:none">
        <div class="row" style="padding:0 10px 6px 10px">
          <button id="copyAlli" class="btn2" disabled>Copier ASCII (alliances)</button>
        </div>
        <div class="scroll"><table id="tblAlli"></table></div>
      </div>

      <div id="panel-ups" style="display:none">
        <div class="row" style="padding:0 10px 6px 10px">
          <button id="copyUps" class="btn2" disabled>Copier ASCII (UPs)</button>
        </div>
        <div class="scroll"><table id="tblUps"></table></div>
      </div>

      <div id="panel-orph" style="display:none">
        <div class="row" style="padding:0 10px 6px 10px">
          <button id="copyOrph" class="btn2" disabled>Copier ASCII (orphelines)</button>
        </div>
        <div class="scroll"><table id="tblOrph"></table></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>Export Toolzzz : en-têtes centrés, points gris, Net vert/rouge.</span>
    <span class="muted">Tout hors-ligne • Format FR supporté.</span>
  </div>

  <div id="resizerBR" class="resizer" title="Redimensionner"></div>
</div>
`;

const $=(s)=>shadow.querySelector(s);
const fmt=new Intl.NumberFormat('fr-FR');

/* === Ajuste la hauteur utile du tableau visible === */
function updateScrollHeights(){
  const panel = $('#panel');
  if (!panel || !panel.classList.contains('show')) return;
  const rectP = panel.getBoundingClientRect();

  // section visible à droite
  const panels = ['tx','agg','alli','ups','orph'].map(k=>$('#panel-'+k));
  const shown = panels.find(p => p && p.style.display !== 'none');
  if(!shown) return;

  const sc = shown.querySelector('.scroll');
  if(!sc) return;

  const top = sc.getBoundingClientRect().top - rectP.top;
  const avail = Math.max(120, rectP.height - top - 12);
  sc.style.maxHeight = avail + 'px';
}

/* toggle avec recalage du scroll quand on ouvre */
let toggle = ()=>{
  const p=$('#panel');
  const vis=p.classList.toggle('show');
  if(vis) requestAnimationFrame(updateScrollHeights);
};

$('#close').addEventListener('click',toggle);
window.addEventListener('keydown',(e)=>{ if(e.altKey && (e.key==='t'||e.key==='T')){ e.preventDefault(); toggle(); }});

/* ===== Fenêtre déplaçable + position persistée (drag) + redimensionnable ===== */
(() => {
  const POS_KEY = 'OutiiilTDC:pos';
  const SIZ_KEY = 'OutiiilTDC:size';

  const root = (typeof shadow !== 'undefined' && shadow && typeof shadow.querySelector === 'function') ? shadow : document;
  const panelEl  = root.querySelector('#panel');
  const headerEl = root.querySelector('.hdr');
  const resEl    = root.querySelector('#resizerBR');
  if (!panelEl || !headerEl || !resEl) return;

  headerEl.style.cursor = 'move';

  function clampIntoViewport() {
    const rect = panelEl.getBoundingClientRect();
    const W = window.innerWidth, H = window.innerHeight;
    const maxL = Math.max(0, W - rect.width);
    const maxT = Math.max(0, H - rect.height);
    if (panelEl.style.left) {
      let L = Math.min(Math.max(0, parseInt(panelEl.style.left || '0', 10)), maxL);
      let T = Math.min(Math.max(0, parseInt(panelEl.style.top  || '0', 10)), maxT);
      panelEl.style.left = L + 'px';
      panelEl.style.top  = T + 'px';
      savePos();
    }
  }
  function loadPos() {
    try {
      const s = localStorage.getItem(POS_KEY);
      if (!s) return false;
      const { left, top } = JSON.parse(s) || {};
      if (Number.isFinite(left) && Number.isFinite(top)) {
        panelEl.style.right  = 'auto';
        panelEl.style.bottom = 'auto';
        panelEl.style.left   = left + 'px';
        panelEl.style.top    = top  + 'px';
        clampIntoViewport();
        return true;
      }
    } catch(e) {}
    return false;
  }
  function savePos() {
    const L = parseInt(panelEl.style.left, 10);
    const T = parseInt(panelEl.style.top, 10);
    if (Number.isFinite(L) && Number.isFinite(T)) {
      localStorage.setItem(POS_KEY, JSON.stringify({ left: L, top: T }));
    }
  }
  function resetPosBottomRight() {
    localStorage.removeItem(POS_KEY);
    panelEl.style.left = '';
    panelEl.style.top  = '';
    panelEl.style.right  = '18px';
    panelEl.style.bottom = '18px';
  }

  // ---- Taille persistée
  function loadSize(){
    try{
      const s = localStorage.getItem(SIZ_KEY);
      if(!s) return false;
      const {w,h} = JSON.parse(s)||{};
      if(Number.isFinite(w)) panelEl.style.width  = w+'px';
      if(Number.isFinite(h)) panelEl.style.height = h+'px';
      return true;
    }catch(e){ return false; }
  }
  function saveSize(w,h){
    const curW = Math.round(parseFloat(panelEl.style.width)  || panelEl.getBoundingClientRect().width);
    const curH = Math.round(parseFloat(panelEl.style.height) || panelEl.getBoundingClientRect().height);
    localStorage.setItem(SIZ_KEY, JSON.stringify({w:curW, h:curH}));
  }

  // ---- Drag position
  let dragging = false, offsetX = 0, offsetY = 0;
  headerEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    const r = panelEl.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;
    panelEl.style.right  = 'auto';
    panelEl.style.bottom = 'auto';
    headerEl.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    let left = e.clientX - offsetX;
    let top  = e.clientY - offsetY;
    const W = window.innerWidth, H = window.innerHeight;
    left = Math.max(0, Math.min(left, W - panelEl.offsetWidth));
    top  = Math.max(0, Math.min(top,  H - panelEl.offsetHeight));
    panelEl.style.left = left + 'px';
    panelEl.style.top  = top  + 'px';
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    headerEl.style.cursor = 'move';
    savePos();
  });
  headerEl.addEventListener('dblclick', (e) => { e.preventDefault(); resetPosBottomRight(); });

  // ---- Resize (poignée bas-droite)
  let resizing=false, sx=0, sy=0, sw=0, sh=0;
  resEl.addEventListener('mousedown', (e)=>{
    if(e.button!==0) return;
    e.preventDefault();
    const r = panelEl.getBoundingClientRect();
    resizing = true;
    sx = e.clientX; sy = e.clientY; sw = r.width; sh = r.height;
    document.body.style.userSelect='none';
  });
  window.addEventListener('mousemove', (e)=>{
    if(!resizing) return;
    // limites raisonnables
    const maxW = Math.min(window.innerWidth - 36, 1600);
    const maxH = Math.min(window.innerHeight - 36, 1200);
    let w = sw + (e.clientX - sx);
    let h = sh + (e.clientY - sy);
    w = Math.max(520, Math.min(w, maxW));
    h = Math.max(280, Math.min(h, maxH));
    panelEl.style.width  = w + 'px';
    panelEl.style.height = h + 'px';
    clampIntoViewport();
    updateScrollHeights();
  });
  window.addEventListener('mouseup', ()=>{
    if(!resizing) return;
    resizing=false;
    document.body.style.userSelect='';
    saveSize();
  });

  // Recalage si la fenêtre change de taille
  window.addEventListener('resize', ()=>{ clampIntoViewport(); updateScrollHeights(); });

  // Au chargement : taille puis position, puis calcule la zone scroll si panel visible
  loadSize();
  loadPos();
  requestAnimationFrame(updateScrollHeights);
})();

/* ==================== Events ==================== */
function setStatus(m){$('#status').textContent=m;}
function clearTables(){['tblTx','tblAgg','tblAlli','tblUps','tblOrph'].forEach(id=>$('#'+id).innerHTML='');}
function disableCopy(){['copyTx','copyAgg','copyAlli','copyUps','copyOrph'].forEach(id=>$('#'+id).disabled=true);}
function enableCopy(){['copyTx','copyAgg','copyAlli','copyUps','copyOrph'].forEach(id=>$('#'+id).disabled=false);}

$('#clear').addEventListener('click',()=>{$('#raw').value=''; setStatus(''); clearTables(); disableCopy();});
$('#sample').addEventListener('click',()=>$('#raw').value=SAMPLE.trim());
shadow.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    shadow.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const k=tab.dataset.tab;
    ['tx','agg','alli','ups','orph'].forEach(x=>{$(`#panel-${x}`).style.display=(x===k?'block':'none');});
    requestAnimationFrame(updateScrollHeights);
  });
});
const filters={player:'',ally:''};
$('#fPlayer').addEventListener('input',e=>{filters.player=norm(e.target.value); renderAll(state,true);});
$('#fAlly').addEventListener('input',e=>{filters.ally=norm(e.target.value); renderAll(state,true);});
$('#fAllyQuick').addEventListener('change',e=>{ $('#fAlly').value=e.target.value; filters.ally=norm(e.target.value); renderAll(state,true);});
$('#fClear').addEventListener('click',()=>{filters.player='';filters.ally='';$('#fPlayer').value='';$('#fAlly').value='';$('#fAllyQuick').value='';renderAll(state,true);});
$('#analyze').addEventListener('click',()=>{
  const txt=$('#raw').value;
  if(!txt.trim()){ setStatus('Colle du texte à analyser.'); return; }
  try{ renderAll(parseAll(txt)); requestAnimationFrame(updateScrollHeights); }catch(err){ setStatus('Erreur: '+(err?.message||err)); console.error(err); }
});
$('#copyTx').addEventListener('click',()=>copyToClipboard(wrapCode(buildAsciiTx(view.tx))));
$('#copyAgg').addEventListener('click',()=>copyToClipboard(wrapCode(buildAsciiAgg(view.agg))));
$('#copyAlli').addEventListener('click',()=>copyToClipboard(wrapCode(buildAsciiAlli(view.alli))));
$('#copyUps').addEventListener('click',()=>copyToClipboard(wrapCode(buildAsciiUps(view.ups))));
$('#copyOrph').addEventListener('click',()=>copyToClipboard(wrapCode(buildAsciiOrph(view.orph))));

/* ==================== Parsing ==================== */
function parseAll(text){
  const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const blocks=[]; let current=null;

  // dates / balises
  const reDate1=/^(?:—\s*)?(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})$/;   // 17/08/2025 08:42
  const reHier=/^(?:—\s*)?Hier\s+à\s+(\d{2}:\d{2})$/i;                // Hier à 01:57
  const reAuj=/^(?:—\s*)?Aujourd(?:'|’)?hui\s+à\s+(\d{2}:\d{2})$/i;   // Aujourd’hui à 05:25
  const reTimeOnly=/^(?:—\s*)?(\d{2}:\d{2})$/;                        // 05:25
  const reNoise=/^(Fourmizzz\s+S1|APP)$/i;

  // joueur / action (+ espaces fines, NBSP, en-dash, accents/pluriels)
  const rePlayer=new RegExp(
    '^([^()]+)\\(' +
    '([A-Za-zÀ-ÖØ-öø-ÿ0-9\\-]+)' +
    '\\):\\s*' +
    '([+\\-–]\\s*\\d[\\d\\s\\u00A0\\u202F]*)\\s+' +
    '(' +
      'tdc|TDC|' +
      'fourmiliere|fourmilière|' +
      'technologie|technologies' +
    ')' +
    '\\s*\\|\\s*' +
    '(\\d[\\d\\s\\u00A0\\u202F]*)\\s*=>\\s*(\\d[\\d\\s\\u00A0\\u202F]*)' +
    '$','i'
  );

  for(const raw of lines){
    if(reNoise.test(raw)) continue;
    let m;

    // Date explicite => telle quelle
    if(m=raw.match(reDate1)){
      const d=m[1], t=m[2];
      const tsMs = frToMs(d, t);
      current={tsLabel:raw.replace(/^—\s*/,''), ts:tsMs, entries:[]};
      blocks.push(current);
      continue;
    }

    // Hier à HH:MM => J-1 par rapport à AUJOURD'HUI
    if(m=raw.match(reHier)){
      const resolved = shiftDate(todayFR(), -1);
      const tsMs = frToMs(resolved, m[1]);
      current={tsLabel:raw.replace(/^—\s*/,''), ts:tsMs, entries:[]};
      blocks.push(current);
      continue;
    }

    // Aujourd'hui à HH:MM => aujourd'hui
    if(m=raw.match(reAuj)){
      const tsMs = frToMs(todayFR(), m[1]);
      current={tsLabel:raw.replace(/^—\s*/,''), ts:tsMs, entries:[]};
      blocks.push(current);
      continue;
    }

    // HH:MM seul => aujourd'hui
    if(m=raw.match(reTimeOnly)){
      const tsMs = frToMs(todayFR(), m[1]);
      current={tsLabel:raw.replace(/^—\s*/,''), ts:tsMs, entries:[]};
      blocks.push(current);
      continue;
    }

    // Ligne joueur
    if(m=raw.match(rePlayer)){
      if(!current){
        const base = todayFR();
        const tsMs = frToMs(base, '00:00');
        current={tsLabel:`${base} 00:00`, ts:tsMs, entries:[]};
        blocks.push(current);
      }
      const name=m[1].trim(),
            ally=m[2].trim(),
            signAmt=num(m[3]),
            kind=normKind(m[4]),
            before=num(m[5]),
            after=num(m[6]);
      current.entries.push({name,ally,signAmt,kind,before,after,raw});
      continue;
    }
  }

  const tx=[], orph=[], ups=[];
  blocks.forEach((b,idx)=>{
    const gains=[], losses=[], others=[];
    for(const e of b.entries){
      if(e.kind==='tdc'){ (e.signAmt>0?gains:losses).push(e); }
      else others.push(e);
    }
    others.forEach(u=>ups.push({ts:b.ts, tsLabel:b.tsLabel, player:u.name, ally:u.ally, type:u.kind, delta:Math.abs(u.signAmt), before:u.before, after:u.after}));
    const usedLoss=new Set(), usedGain=new Set();

    for(let gi=0; gi<gains.length; gi++){
      const g=gains[gi], amt=Math.abs(g.signAmt); let match=-1;
      for(let li=0; li<losses.length; li++){ if(usedLoss.has(li)) continue; const l=losses[li]; if(Math.abs(l.signAmt)===amt){ match=li; break; } }
      if(match>=0){ const l=losses[match]; usedLoss.add(match); usedGain.add(gi);
        tx.push({ts:b.ts, tsLabel:b.tsLabel, amount:amt,
          winner:g.name, wAlly:g.ally, wBefore:g.before, wAfter:g.after,
          loser:l.name, lAlly:l.ally, lBefore:l.before, lAfter:l.after,
          block:idx, status:'apparié'}); }
    }
    gains.forEach((g,gi)=>{ if(!usedGain.has(gi)) orph.push({ts:b.ts, tsLabel:b.tsLabel, who:g.name, ally:g.ally, signAmt:g.signAmt, before:g.before, after:g.after, kind:'tdc', block:idx}); });
    losses.forEach((l,li)=>{ if(!usedLoss.has(li)) orph.push({ts:b.ts, tsLabel:b.tsLabel, who:l.name, ally:l.ally, signAmt:l.signAmt, before:l.before, after:l.after, kind:'tdc', block:idx}); });
  });

  const aggMap=new Map();
  function touchP(player,ally){ const k=player+'|'+ally; if(!aggMap.has(k)) aggMap.set(k,{player,ally,gain:0,loss:0,first:null,last:null}); return aggMap.get(k);}
  tx.forEach(t=>{ const w=touchP(t.winner,t.wAlly), l=touchP(t.loser,t.lAlly); w.gain+=t.amount; w.first=minDate(w.first,t.ts); w.last=maxDate(w.last,t.ts); l.loss+=t.amount; l.first=minDate(l.first,t.ts); l.last=maxDate(l.last,t.ts);});
  const agg=[...aggMap.values()].map(a=>({...a,net:a.gain-a.loss})).sort((x,y)=>y.net-x.net||x.player.localeCompare(y.player));

  const alliMap=new Map();
  function touchA(a){ if(!alliMap.has(a)) alliMap.set(a,{alliance:a,gain:0,loss:0,net:0,wins:0,defeats:0}); return alliMap.get(a); }
  tx.forEach(t=>{ const AW=touchA(t.wAlly); AW.gain+=t.amount; AW.wins++; const AL=touchA(t.lAlly); AL.loss+=t.amount; AL.defeats++;});
  alliMap.forEach(v=>v.net=v.gain-v.loss);
  const alli=[...alliMap.values()].sort((a,b)=>b.net-a.net||a.alliance.localeCompare(b.alliance));

  const distinct=[...new Set(alli.map(a=>a.alliance))].sort((a,b)=>a.localeCompare(b));
  const sel=$('#fAllyQuick'); sel.innerHTML='<option value="">— Alliances détectées —</option>'+distinct.map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('');

  return {tx,agg,alli,ups,orph};
}

/* ==================== Aperçu tables ==================== */
const state={tx:[],agg:[],alli:[],ups:[],orph:[]};
const view ={tx:[],agg:[],alli:[],ups:[],orph:[]};

function renderAll(res,onlyFilter=false){
  if(!onlyFilter) Object.assign(state,res);
  const fP=filters.player, fA=filters.ally, match=(s,q)=>!q||norm(s).includes(q);
  view.tx   = state.tx  .filter(t => (match(t.winner,fP)||match(t.loser,fP)) && (!fA||match(t.wAlly,fA)||match(t.lAlly,fA)));
  view.agg  = state.agg .filter(a =>  match(a.player,fP) && (!fA||match(a.ally,fA)));
  view.ups  = state.ups .filter(u =>  match(u.player,fP) && (!fA||match(u.ally,fA)));
  view.orph = state.orph.filter(o =>  match(o.who,fP)    && (!fA||match(o.ally,fA)));
  view.alli = state.alli.filter(a => !fA || match(a.alliance,fA));

  fillTx(); fillAgg(); fillAlli(); fillUps(); fillOrph();
  setStatus(`Transactions: ${fmt.format(view.tx.length)} · Orphelines: ${fmt.format(view.orph.length)} · UPs: ${fmt.format(view.ups.length)} · Alliances: ${fmt.format(view.alli.length)}`);
  enableCopy();
}
const htmlNet = (n)=> `<span style="color:${n>0?COLOR_POS:n<0?COLOR_NEG:'#e7ecf3'}">${fmt.format(n)}</span>`;

function fillTx(){ const t=$('#tblTx'); t.innerHTML=`
<thead><tr>
<th>Date/Heure</th><th>Gagnant</th><th>Alliance</th><th class="r">Avant</th><th class="r">Après</th>
<th>Perdant</th><th>Alliance</th><th class="r">Avant</th><th class="r">Après</th>
<th class="r">Montant</th><th>Statut</th>
</tr></thead><tbody></tbody>`; const tb=t.querySelector('tbody');
view.tx.forEach(x=>tb.insertAdjacentHTML('beforeend',`<tr>
<td class="mono">${dispDate(x.ts)}</td>
<td>${esc(x.winner)}</td><td>${esc(x.wAlly)}</td>
<td class="r mono">${fmt.format(x.wBefore)}</td><td class="r mono">${fmt.format(x.wAfter)}</td>
<td>${esc(x.loser)}</td><td>${esc(x.lAlly)}</td>
<td class="r mono">${fmt.format(x.lBefore)}</td><td class="r mono">${fmt.format(x.lAfter)}</td>
<td class="r mono">${fmt.format(x.amount)}</td>
<td>apparié</td>
</tr>`));
}
function fillAgg(){ const t=$('#tblAgg'); t.innerHTML=`
<thead><tr>
<th>Joueur</th><th>Alliance</th><th class="r">Gains</th><th class="r">Pertes</th><th class="r">Net</th>
<th>Première</th><th>Dernière</th>
</tr></thead><tbody></tbody>`; const tb=t.querySelector('tbody');
view.agg.forEach(a=>tb.insertAdjacentHTML('beforeend',`<tr>
<td>${esc(a.player)}</td><td>${esc(a.ally)}</td>
<td class="r mono">${fmt.format(a.gain)}</td>
<td class="r mono">${fmt.format(a.loss)}</td>
<td class="r mono">${htmlNet(a.net)}</td>
<td class="mono">${a.first?dispDate(a.first):''}</td>
<td class="mono">${a.last?dispDate(a.last):''}</td>
</tr>`));
}
function fillAlli(){ const t=$('#tblAlli'); t.innerHTML=`
<thead><tr>
<th>Alliance</th><th class="r">Gains</th><th class="r">Pertes</th><th class="r">Net</th><th class="r">#Victoires</th><th class="r">#Défaites</th>
</tr></thead><tbody></tbody>`; const tb=t.querySelector('tbody');
view.alli.forEach(a=>tb.insertAdjacentHTML('beforeend',`<tr>
<td>${esc(a.alliance)}</td>
<td class="r mono">${fmt.format(a.gain)}</td>
<td class="r mono">${fmt.format(a.loss)}</td>
<td class="r mono">${htmlNet(a.net)}</td>
<td class="r mono">${fmt.format(a.wins)}</td>
<td class="r mono">${fmt.format(a.defeats)}</td>
</tr>`));
}
function fillUps(){ const t=$('#tblUps'); t.innerHTML=`
<thead><tr>
<th>Date/Heure</th><th>Joueur</th><th>Alliance</th><th>Type</th><th class="r">+1</th><th class="r">Avant</th><th class="r">Après</th>
</tr></thead><tbody></tbody>`; const tb=t.querySelector('tbody');
view.ups.forEach(u=>tb.insertAdjacentHTML('beforeend',`<tr>
<td class="mono">${dispDate(u.ts)}</td>
<td>${esc(u.player)}</td><td>${esc(u.ally)}</td>
<td>${esc(u.type)}</td>
<td class="r mono">${fmt.format(u.delta)}</td>
<td class="r mono">${fmt.format(u.before)}</td>
<td class="r mono">${fmt.format(u.after)}</td>
</tr>`));
}
function fillOrph(){ const t=$('#tblOrph'); t.innerHTML=`
<thead><tr>
<th>Date/Heure</th><th>Joueur</th><th>Alliance</th><th class="r">Avant</th><th class="r">Après</th><th class="r">Montant</th>
</tr></thead><tbody></tbody>`; const tb=t.querySelector('tbody');
view.orph.forEach(o=>tb.insertAdjacentHTML('beforeend',`<tr>
<td class="mono">${dispDate(o.ts)}</td>
<td>${esc(o.who)}</td><td>${esc(o.ally)}</td>
<td class="r mono">${fmt.format(o.before)}</td>
<td class="r mono">${fmt.format(o.after)}</td>
<td class="r mono">${fmt.format(Math.abs(o.signAmt))}</td>
</tr>`));
}

/* ==================== Export ASCII façon Toolzzz ==================== */
function stripTags(s){ return String(s).replace(/\[(\/)?[^\]]+\]/g,''); }
function visibleLen(s){ return stripTags(s).length; }
function len(s){ return visibleLen(s); }
const DOTC = (n)=> n>0 ? `[color=${COLOR_DOTS}]${'.'.repeat(n)}[/color]` : '';
function centerDots(s, w){
  s = stripTags(s);
  const pad = Math.max(0, w - s.length);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return DOTC(left) + s + DOTC(right);
}
function rightDots(s, w){ const plain = stripTags(s); return DOTC(Math.max(0, w - plain.length)) + s; }
function leftDots (s, w){ const plain = stripTags(s); return s + DOTC(Math.max(0, w - plain.length)); }
const bbNet = (n)=> n>0 ? `[color=${COLOR_POS}]${fmt.format(n)}[/color]`
                        : n<0 ? `[color=${COLOR_NEG}]${fmt.format(n)}[/color]`
                              : fmt.format(n);

function asciiBox(headers, rows, aligns){
  const widths = headers.map((h,i)=> Math.max(len(h), ...rows.map(r=>len(r[i]??''))));
  const makeLine = (cells)=> '|' + cells.join('|') + '|';

  const hdrCells = headers.map((h,i)=> ' ' + centerDots(h, widths[i]) + ' ');
  const hdrLine  = makeLine(hdrCells);
  const totalVis = visibleLen(hdrLine);
  const border   = '|' + '-'.repeat(totalVis - 2) + '|';

  const body = rows.map(r=>{
    const cells = r.map((c,i)=> ' ' + (aligns[i]==='right' ? rightDots(c,widths[i]) : leftDots(c,widths[i])) + ' ');
    return makeLine(cells);
  });

  return [border, hdrLine, border, ...body, border].join('\n');
}
function wrapCode(s){ return `[code][b]\n${s}\n[/b][/code]`; }

/* ---- Générateurs ---- */
function buildAsciiAlli(list){
  const H=['Alliance','Gains','Pertes','Net','#Victoires','#Défaites'];
  const A=['left','right','right','right','right','right'];
  const R=list.map(a=>[
    a.alliance, fmt.format(a.gain), fmt.format(a.loss), bbNet(a.net), String(a.wins), String(a.defeats)
  ]);
  return asciiBox(H,R,A);
}
function buildAsciiAgg(list){
  const H=['Joueur','Alliance','Gains','Pertes','Net','Première','Dernière'];
  const A=['left','left','right','right','right','left','left'];
  const R=list.map(a=>[
    a.player, a.ally, fmt.format(a.gain), fmt.format(a.loss), bbNet(a.net),
    a.first?dispDate(a.first):'', a.last?dispDate(a.last):''
  ]);
  return asciiBox(H,R,A);
}
function buildAsciiTx(list){
  const H=['Date/Heure','Gagnant','Alliance','Perdant','Alliance','Montant'];
  const A=['left','left','left','left','left','right'];
  const R=list.map(t=>[dispDate(t.ts), t.winner, t.wAlly, t.loser, t.lAlly, fmt.format(t.amount)]);
  return asciiBox(H,R,A);
}
function buildAsciiUps(list){
  const H=['Date/Heure','Joueur','Alliance','Type','Avant','Après'];
  const A=['left','left','left','left','right','right'];
  const R=list.map(u=>[dispDate(u.ts), u.player, u.ally, u.type, fmt.format(u.before), fmt.format(u.after)]);
  return asciiBox(H,R,A);
}
function buildAsciiOrph(list){
  const H=['Date/Heure','Joueur','Alliance','Avant','Après','Montant'];
  const A=['left','left','left','right','right','right'];
  const R=list.map(o=>[dispDate(o.ts), o.who, o.ally, fmt.format(o.before), fmt.format(o.after), fmt.format(Math.abs(o.signAmt))]);
  return asciiBox(H,R,A);
}

/* ==================== Helpers ==================== */
// date du jour au format FR
function todayFR(){
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
// J+dd à partir d'une date FR (LOCAL)
function shiftDate(fr,dd){
  const [d,m,y]=fr.split('/').map(n=>+n);
  const dt=new Date(y,m-1,d);
  dt.setDate(dt.getDate()+dd);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
}
// FR "dd/mm/yyyy" + "HH:MM" -> timestamp (ms) LOCAL
function frToMs(frDate, hhmm){
  const [d,m,y]=frDate.split('/').map(Number);
  const [H,M]=hhmm.split(':').map(Number);
  return new Date(y,m-1,d,H,M,0,0).getTime();
}
// timestamp (ms) -> "dd/mm/yyyy HH:MM"
function dispDate(ms){
  const d=new Date(ms);
  const dd=String(d.getDate()).padStart(2,'0');
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const yy=d.getFullYear();
  const HH=String(d.getHours()).padStart(2,'0');
  const MM=String(d.getMinutes()).padStart(2,'0');
  return `${dd}/${mm}/${yy} ${HH}:${MM}`;
}
// nombre robuste (garde le signe, gère NBSP \u00A0 et fines \u202F, normalise en-dash)
function num(s){
  const raw=String(s).replace(/[\u00A0\u202F\s]+/g,'');
  const m=raw.match(/^([+\-–]?)(\d.*)$/);
  if(!m) return Number(raw.replace(/[^\d]/g,''));
  const sign=(m[1]==='–')?'-':m[1];
  return Number(sign + m[2].replace(/[^\d]/g,''));
}
function esc(s){return String(s).replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function minDate(a,b){ if(a==null) return b; return Math.min(a,b); }
function maxDate(a,b){ if(a==null) return b; return Math.max(a,b); }
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
async function copyToClipboard(text){
  try{await navigator.clipboard.writeText(text); setStatus('ASCII copié ✅');}
  catch{const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); setStatus('ASCII copié (fallback) ✅');}
}
// normalise le type
function normKind(k){
  if (/tdc/i.test(k)) return 'tdc';
  if (/fourmi/i.test(k)) return 'fourmiliere';
  return 'technologie';
}

/* ==================== API Outiiil ==================== */
window.OutiiilTDC = (function(){
  const api = {};
  api.open   = ()=>{ $('#panel').classList.add('show'); requestAnimationFrame(updateScrollHeights); };
  api.close  = ()=>{ $('#panel').classList.remove('show'); };
  api.toggle = ()=>{ toggle(); };
  api.fill   = (txt)=>{ $('#raw').value = txt||''; };
  api.parse  = ()=>{ $('#analyze').click(); };
  return api;
})();

/* ==================== Données exemple ==================== */
const SAMPLE=`
— 17/08/2025 08:42
Christheall(TRID): +47 420 282 tdc | 274 610 833 => 322 031 115
eholo(LHDC): -47 420 282 tdc | 237 101 410 => 189 681 128
APP
— Hier à 03:47
Christheall(TRID): +7 674 044 730 tdc | 19 994 459 168 => 27 668 503 898
mamandepatateetdragon(NOIR): -7 674 044 730 tdc | 38 370 223 653 => 30 696 178 923
— 08:12
panoupanou(-FADA): +1 fourmilière | 447 => 448
— Aujourd’hui à 05:25
lyse-mo(-FADA): +1 technologie | 241 => 242
`;

})();
