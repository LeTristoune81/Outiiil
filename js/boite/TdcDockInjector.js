/* Outiiil — Injecteur bouton "Parser TDC" (icône radar) dans le dock
   - Ne modifie pas Dock.js
   - Attend que #o_toolbarOutiiil soit présent
   - Réinjection si le dock est régénéré
*/
(function(){
  'use strict';

  var IMG_RADAR = "images/radar.png"; // mets l’image ici (ou remplace par une URL CDN)

  function hasjQuery(){ return typeof window.$ === 'function'; }

  function findToolbar(){
    return document.getElementById('o_toolbarOutiiil');
  }

  function makeButton(){
    var wrap = document.createElement('div');
    wrap.className = 'o_toolbarItem';
    wrap.title = 'Parser TDC';

    var span = document.createElement('span');
    span.id = 'o_itemTDC';
    span.style.display = 'inline-block';
    span.style.width = '28px';
    span.style.height = '28px';
    span.style.backgroundImage = 'url("'+IMG_RADAR+'")';
    span.style.backgroundSize = 'contain';
    span.style.backgroundPosition = 'center';
    span.style.backgroundRepeat = 'no-repeat';

    wrap.appendChild(span);
    return wrap;
  }

  function injectOnce(toolbar){
    if (!toolbar) return false;
    if (toolbar.querySelector('#o_itemTDC')) return true; // déjà injecté

    var pref = toolbar.querySelector('#o_toolbarItem6'); // “Préférence”
    var btn = makeButton();

    if (pref && pref.parentElement === toolbar) {
      toolbar.insertBefore(btn, pref);
    } else {
      toolbar.appendChild(btn);
    }

    // Clic → toggle du parseur
    btn.addEventListener('click', function(e){
      e.preventDefault();
      if (window.OutiiilTDC && typeof window.OutiiilTDC.toggle === 'function') {
        window.OutiiilTDC.toggle();
      } else {
        console.warn('[Outiiil] window.OutiiilTDC introuvable.');
        alert("Le parseur TDC n'est pas chargé (ParseurTDC.js).");
      }
    });

    // Tooltip (si jQuery UI dispo)
    if (hasjQuery()) {
      try {
        var $ = window.$;
        var $btn = $(btn);
        var dockBas = false;
        try { dockBas = (window.monProfil && window.monProfil.parametre && window.monProfil.parametre["dockPosition"].valeur == "1"); } catch(e){}
        var opts = dockBas
          ? { tooltipClass:"warning-tooltip", content:function(){return $(this).prop("title");}, position:{my:"center top", at:"center bottom+10"}, hide:{effect:"fade", duration:10} }
          : { tooltipClass:"warning-tooltip", content:function(){return $(this).prop("title");}, position:{my:"left+10 center", at:"right center"}, hide:{effect:"fade", duration:10} };
        $btn.tooltip(opts);
      } catch(e){ /* silencieux */ }
    }
    return true;
  }

  // Injection initiale (attend le dock)
  function boot(){
    var tries = 0, maxTries = 200; // ~20s
    var iv = setInterval(function(){
      var bar = findToolbar();
      if (bar && injectOnce(bar)) {
        clearInterval(iv);
        // Observe les changements du DOM pour réinjecter si besoin
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
