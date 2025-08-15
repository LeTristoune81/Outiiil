// ==UserScript==
// @name         Outiil v2
// @namespace    https://github.com/LeTristoune81/Outiiil
// @version      2.3.1
// @author       Hraesvelg, modifié par White & LeTristoune81
// @description  Outiil nettoyé : Historique & traceur Discord supprimés. Charge Boite.js et Chasse.js.
// @match        http://*.fourmizzz.fr/*
// @match        https://*.fourmizzz.fr/*
// @icon         https://www.google.com/s2/favicons?domain=fourmizzz.fr
// @run-at       document-end
// @noframes
//
// == Gestion des mises à jour ==
// @downloadURL  https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.user.js
// @updateURL    https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.user.js
//
// == Grants (modules potentiels) ==
/* Tampermonkey nécessite d’énumérer les APIs GM utilisées par tes modules @require */
//
// eslint-disable-next-line
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
// ==/UserScript==

// == Dépendances ==
// !! IMPORTANT : 2 slashes exactement, pas 3 !!
// (Laisse ces chemins si tes fichiers existent bien à ces URLs sur GitHub / jsDelivr)
// @require      https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Boite.js
// @require      https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Chasse.js

/* ********************************************************************
 *  Outiil v2 – build 2.3.1
 *  - Suppression Historique & traceur Discord
 *  - @require corrigés (// et non ///)
 *  - Grants ajoutés pour compatibilité modules
 ******************************************************************** */

(function() {
  'use strict';

  const href = location.href;

  function log(...args) {
    console.log('[Outiil v2.3.1]', ...args);
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

  // Appels optionnels si tes modules exposent des inits. Sinon ils s’auto-exécutent et ça ne gêne pas.
  function initBoite() {
    try {
      if (typeof window.OutiiilBoiteInit === 'function') {
        window.OutiiilBoiteInit();
        log('Boîte initialisée');
      } else {
        log('Boîte chargée (pas de OutiiilBoiteInit exposé)');
      }
    } catch (e) {
      console.error('[Outiil] Erreur init Boîte', e);
    }
  }

  function initChasse() {
    try {
      if (typeof window.OutiiilChasseInit === 'function') {
        window.OutiiilChasseInit();
        log('Chasse initialisée');
      } else {
        if (/Chasse\.php|TerrainChasse\.php/i.test(href)) {
          log('Chasse chargée (pas de OutiiilChasseInit exposé)');
        }
      }
    } catch (e) {
      console.error('[Outiil] Erreur init Chasse', e);
    }
  }

  function route() {
    initBoite();
    if (/Chasse\.php|TerrainChasse\.php/i.test(href)) {
      initChasse();
    }
  }

  ready(() => {
    injectBaseStyles();
    route();
  });
})();
