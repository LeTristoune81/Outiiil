/* Outiiil — Injecteur bouton "Parser TDC" (sprite, clone complet)
   - N'altère pas Dock.js
   - Clone l'icône d'un bouton existant (image, taille, background-size)
   - Applique ta position: -0px -240px
*/
(function(){
  'use strict';

  // Position exacte dans le sprite (fournie)
  var SPRITE_POSITION = "-0px -240px";

  function findToolbar(){ return document.getElementById('o_toolbarOutiiil'); }

  // trouve une icône de référence qui a déjà le bon sprite chargé
  function findRefIcon(){
    // essaie des IDs connus
    var ids = ['#o_itemPonte', '#o_itemChasse', '#o_itemCombat', '#o_itemParametre'];
    for (var i=0;i<ids.length;i++){
      var el = document.querySelector(ids[i]);
      if (el) return el;
    }
    // sinon, le premier span d'item avec un background défini
    var spans = document.querySelectorAll('#o_toolbarOutiiil .o_toolbarItem span, .o_toolbarItem span');
    for (var j=0;j<spans.length;j++){
      var cs = getComputedStyle(spans[j]);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return spans[j];
    }
    return null;
  }

  function readBackground(el){
    var cs = getComputedStyle(el);
    // ex: url("https://.../sprite_menu.png")
    var bg = cs.backgroundImage && cs.backgroundImage !== 'none' ? cs.backgroundImage : '';
    var w  = parseInt(cs.width, 10)  || 28;
    var h  = parseInt(cs.height, 10) || 28;
    var bgs = cs.backgroundSize; // peut être "auto auto" ou une valeur (on la recopie telle quelle)
    return {bg:bg,w:w,h:h,bgs:bgs};
  }

  function makeButton(refSpan){
    var wrap = document.createElement('div');
    wrap.className = 'o_toolbarItem';
    wrap.title = 'Parser TDC';

    var span = document.createElement('span');
    span.id = 'o_itemTDC';
    wrap.appendChild(span);

    // clone image + taille depuis la ref
    var ref = readBackground(refSpan);
    if (ref.bg) span.style.backgroundImage = ref.bg;
    span.style.display = 'inline-block';
    span.style.width   = ref.w + 'px';
    span.style.height  = ref.h + 'px';
    span.style.backgroundRepeat   = 'no-repeat';
    span.style.backgroundPosition = SPRITE_POSITION;
    if (ref.bgs && ref.bgs !== 'auto' && ref.bgs !== 'auto auto') {
      span.style.backgroundSize = ref.bgs;
    }
    return wrap;
  }

  function injectOnce(toolbar){
    if (!toolbar) return false;
    if (toolbar.querySelector('#o_itemTDC')) return true; // déjà présent

    var ref = findRefIcon();
    if (!ref) return false; // attend qu'une icône du dock soit prête (sprite chargé)

    var btn = makeButton(ref);
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
      if (!bar){ if(++tries > maxTries) clearInterval(iv); return; }

      // attend qu'au moins une icône ait un background-image résolu
      var ok = injectOnce(bar);
      if (ok){
        clearInterval(iv);
        // réinjection si le dock change
        var mo = new MutationObserver(function(){
          var b = findToolbar();
          if (b) injectOnce(b);
        });
        mo.observe(document.body, {childList:true, subtree:true});
      } else {
        if(++tries > maxTries) clearInterval(iv);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
