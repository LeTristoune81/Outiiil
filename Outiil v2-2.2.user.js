// ==UserScript==
// @name         Outiil v2
// @namespace    https://github.com/LeTristoune81/Outiiil
// @version      2.3
// @author       Hraesvelg, modifié par LeTristoune81
// @description  Outiil de Hraesvelg hébergé par Manitas (sources originales : https://github.com/Hraesvelg/Outiiil). Version nettoyée : suppression Historique & traceur Discord.
// @match        http://*.fourmizzz.fr/*
// @match        https://*.fourmizzz.fr/*
// @icon         https://www.google.com/s2/favicons?domain=fourmizzz.fr
//
// == Gestion des mises à jour ==
// IMPORTANT : laisse ces deux lignes pointant vers la branche "main" de ton dépôt.
// Pense à renommer le fichier du dépôt en "Outiil v2-2.3.user.js" pour que l’auto-update fonctionne.
// @downloadURL  https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.user.js
// @updateURL    https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.3.user.js
//
// == Dépendances ==
// Garde uniquement les modules nécessaires. (Historique & Discord supprimés)
/// @require     https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Boite.js
/// @require     https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/js/boite/Chasse.js
//
// ==/UserScript==

/* ********************************************************************
 *  Outiil v2 – build 2.3 (nettoyée)
 *  - Suppression complète : module "Historique" (stockage, filtres 30/90/180/Tout)
 *  - Suppression complète : intégration/traceur externe (Discord, fetch externes)
 *  - Conservation : structure de base, Boîte, Chasse, hooks d’initialisation
 *
 *  Si d’autres modules (ex: UI/Autres pages) doivent rester actifs,
 *  ajoute leurs @require ici, ou intègre leur code ci-dessous.
 ******************************************************************** */

/* =========================================================
 *  Utilitaires communs légers (aucun stockage d’historique)
 * ========================================================= */

(function() {
  'use strict';

  // ---- Contexte de page
  const href = location.href;
  const host = location.host;

  // ---- Log minimal (console) — pas de stockage persistant
  function log(...args) {
    // Préfixe discret pour repérer le script en console.
    console.log('[Outiil v2.3]', ...args);
  }

  // ---- Helpers DOM
  function ready(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  // ---- Injections CSS mineures (si besoin)
  function injectBaseStyles() {
    const css = `
      .outiiil-mini {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        line-height: 1.35;
      }
      .outiiil-btn {
        cursor: pointer;
        padding: 4px 8px;
        border: 1px solid #bbb;
        border-radius: 4px;
        background: #f7f7f7;
      }
      .outiiil-btn:hover { background: #eee; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* =========================================================
   *  Hooks d’intégration avec tes modules @require
   *  (Boite.js, Chasse.js)
   *  - Aucune référence à Historique
   *  - Aucune intégration Discord / fetch externe
   * ========================================================= */

  function initBoite() {
    try {
      if (typeof window.OutiiilBoiteInit === 'function') {
        window.OutiiilBoiteInit(); // exposé par js/boite/Boite.js
        log('Boîte initialisée');
      } else {
        log('Boîte non trouvée (OutiiilBoiteInit manquant)');
      }
    } catch (e) {
      console.error('[Outiil v2.3] Erreur init Boîte', e);
    }
  }

  function initChasse() {
    try {
      if (typeof window.OutiiilChasseInit === 'function') {
        window.OutiiilChasseInit(); // exposé par js/boite/Chasse.js
        log('Chasse initialisée');
      } else {
        log('Chasse non trouvée (OutiiilChasseInit manquant)');
      }
    } catch (e) {
      console.error('[Outiil v2.3] Erreur init Chasse', e);
    }
  }

  /* =========================================================
   *  Orchestration par page
   * ========================================================= */

  function route() {
    // Exemples de dispatch simple par page (adapte si besoin)
    // NB : Pas d’historique ni d’appels Discord ici.

    // Boîte disponible partout (si c’est ce que tu veux)
    initBoite();

    // Pages de chasse
    if (/Chasse\.php/i.test(href) || /TerrainChasse\.php/i.test(href)) {
      initChasse();
    }
  }

  /* =========================================================
   *  Lancement
   * ========================================================= */

  ready(() => {
    injectBaseStyles();
    route();
  });

})();
