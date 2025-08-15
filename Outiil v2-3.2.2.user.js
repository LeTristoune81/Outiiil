// ==UserScript==
// @name         Outiil v2
// @namespace    https://github.com/LeTristoune81/Outiiil
// @version      2.3.2
// @author       Hraesvelg, modifié par White & LeTristoune81
// @description  Outiil nettoyé : Historique & traceur Discord supprimés. Boite.js & Chasse.js chargés correctement.
// @match        http://*.fourmizzz.fr/*
// @match        https://*.fourmizzz.fr/*
// @icon         https://www.google.com/s2/favicons?domain=fourmizzz.fr
// @run-at       document-end
// @noframes
//
// == Auto-update ==
// (pense à nommer le fichier du dépôt exactement "Outiil v2-2.3.2.user.js")
// @downloadURL  https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.2.user.js
// @updateURL    https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.2.user.js
//
// == Grants ==
/* liste large pour compat modules éventuels */
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      *
//
// == Dépendances (IMPORTANT: dans ce bloc !) ==
// @require      https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Boite.js
// @require      https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Chasse.js
// ==/UserScript==

(function() {
  'use strict';

  const VERSION = '2.3.2';
  const href = location.href;

  // === Debug overlay (toggleable) ===
  function showDebug(status) {
    try {
      const id = 'outiiil-debug-panel';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;background:#111;color:#fff;padding:8px 10px;border-radius:6px;font:12px/1.35 Arial,Helvetica,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.35)';
        el.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <strong>Outiil v${VERSION}</strong>
            <span id="outiiil-debug-status"></span>
            <button id="outiiil-debug-close" style="margin-left:8px;cursor:pointer;background:#333;color:#fff;border:1px solid #444;border-radius:4px;padding:2px 6px;">×</button>
          </div>
          <div id="outiiil-debug-detail" style="margin-top:6px;max-width:380px;word-break:break-word;"></div>
        `;
        document.body.appendChild(el);
        el.querySelector('#outiiil-debug-close').onclick = () => el.remove();
      }
      const s = el.querySelector('#outiiil-debug-status');
      const d = el.querySelector('#outiiil-debug-detail');
      s.textContent = status.headline || '';
      d.innerHTML = status.detail || '';
    } catch (e) {
      console.log('[Outiil]', e);
    }
  }

  function log(...args) {
    console.log('[Outiil v' + VERSION + ']', ...args);
  }

  function ready(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  function injectBaseStyles() {
    const css = `
      .outiiil-mini { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.35; }
      .outiiil-btn { cursor: pointer; padding: 4px 8px; border: 1px solid #bbb; border-radius: 4px; background: #f7f7f7; }
      .outiiil-btn:hover { background: #eee; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Espace global minimal si des modules l’attendent
  window.Outiiil = window.Outiiil || {};

  function initBoite() {
    try {
      if (typeof window.OutiiilBoiteInit === 'function') {
        window.OutiiilBoiteInit();
        log('Boîte initialisée');
        return 'ok';
      }
      return 'noexport';
    } catch (e) {
      console.error('[Outiil] Erreur init Boîte', e);
      return 'error';
    }
  }

  function initChasse() {
    try {
      if (typeof window.OutiiilChasseInit === 'function') {
        window.OutiiilChasseInit();
        log('Chasse initialisée');
        return 'ok';
      }
      // si la chasse s’auto-exécute, on ne force rien
      return 'noexport';
    } catch (e) {
      console.error('[Outiil] Erreur init Chasse', e);
      return 'error';
    }
  }

  function route() {
    const results = [];

    // Boîte partout (si souhaité)
    results.push(['Boîte', initBoite()]);

    // Pages chasse
    if (/Chasse\.php|TerrainChasse\.php/i.test(href)) {
      results.push(['Chasse', initChasse()]);
    }

    // Rapport debug
    const detail = results.map(([name, res]) => {
      let txt = name + ' : ';
      if (res === 'ok') txt += '✅ initialisée';
      else if (res === 'noexport') txt += 'ℹ️ pas de fonction d’init exposée (peut être auto-exécutée)';
      else txt += '❌ erreur (voir console)';
      return txt;
    }).join('<br>');

    showDebug({
      headline: 'Chargé',
      detail:
        'URL: ' + href +
        '<br>Modules: <br>' + detail +
        '<br>Existance fonctions: ' +
        'BoiteInit=' + (typeof window.OutiiilBoiteInit) + ', ' +
        'ChasseInit=' + (typeof window.OutiiilChasseInit)
    });
  }

  ready(() => {
    injectBaseStyles();
    showDebug({ headline: 'Démarrage…', detail: 'Chargement des modules…' });
    route();
  });
})();
