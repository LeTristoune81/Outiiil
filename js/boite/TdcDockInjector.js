/* Outiiil — Injecteur bouton "Parser TDC" dans le dock (sprite)
   - N'altère pas Dock.js
   - Utilise sprite_menu.png + position exacte fournie
*/
(function(){
  'use strict';

  // === CONFIG ===
  // 1) Sprite du dock (reprend la constante si dispo, sinon fallback local)
  var SPRITE_URL =
    (typeof window.IMG_SPRITE_MENU !== 'undefined' && window.IMG_SPRITE_MENU)
      ? window.IMG_SPRITE_MENU
      : 'images/sprite_menu.png';

  // 2) Position exacte dans le sprite (ta valeur)
  var SPRITE_POSITION = "-0px -240px";  // ✅ ton offset

  // === Helpers ===
  function findToolbar(){ return document.getElementById('o_toolbarOutiiil'); }
  function firstIconSpan(){
    var s = document.querySelector('#o_toolbarOutiiil .o_toolbarItem span');
    if (!s) s = document.querySelector('.o_toolbarItem span');
    return s;
  }
  function detectTileSize(){
    // copie width/height/background-size d’une icône existante
    var ref = firstIconSpan();
    var w = 28, h = 28, bgs = '';
    if (ref) {
      var cs = getComputedStyle(ref);
      w = parseInt(cs.width, 10) || w;
      h = parseInt(cs.height, 10) || h;
      bgs = cs.backgroundSize; // si défini, on le recopie
    }
    return {w:w, h:h, bgs:bgs};
  }

  function makeButton(){
    var wrap = document.createElement('div');
    wrap.className = 'o_toolbarItem';
    wrap.title = 'Parser TDC';

    var span = document.createElement('span');
    span.id = 'o_itemTDC';
    wrap.appendChild(span);

    var ref = detectTileSize();
    span.style.display = 'inline-block';
    span.style.width   = ref.w + 'px';
    span.style.height  = ref.h + 'px';
    span.style.backgroundImage    = 'url("'+SPRITE_URL+'")';
    span.style.backgroundRepeat   = 'no-repeat';
    // position précise fournie
    span.style.backgroundPosition = SPRITE_POSITION;
    if (ref.bgs && ref.bgs !== 'auto' && ref.bgs !== 'auto auto') {
      span.style.backgroundSize = ref.bgs;
    }
    return wrap;
  }

  function injectOnce(toolbar){
    if (!toolbar) return false;
    if (toolbar.querySelector('#o_itemTDC')) return true; // déjà injecté

    var btn = makeButton();
    var pref = toolbar.querySelector('#o_toolbarItem6'); // “Préférence”
    if (pref && pref.parentElement === toolbar) {
      toolbar.insertBefore(btn, pref);
    } else {
      toolbar.appendChild(btn);
    }

    btn.addEventListener('click', function(e){
      e.preventDefault();
      if (window.OutiiilTDC && typeof window.OutiiilTDC.toggle === 'function') {
        window.OutiiilTDC.toggle();
      } else {
        console.warn('[Outiiil] window.OutiiilTDC introuvable.');
        alert("Le parseur TDC n'est pas chargé (ParseurTDC.js).");
      }
    });

    return true;
  }

  function boot(){
    var tries = 0, maxTries = 200; // ~20s
    var iv = setInterval(function(){
      var bar = findToolbar();
      if (bar && injectOnce(bar)) {
        clearInterval(iv);
        var mo = new MutationObserver(function(){
          var b = findToolbar();
          if (b) injectOnce(b);
        });
        mo.observe(document.body, {childList:true, subtree:true});
      }
      if (++tries > maxTries) clearInterval(iv);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
