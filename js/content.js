// content.js — SAFE TEMP VERSION (no syntax errors), repo: LeTristoune81/Outiiil
// This file replaces the corrupted one that had "..." ellipses.
// You can refine names/costs later; arrays are sized to match the rest of the code.

'use strict';

// Root for assets (served by jsDelivr from your repo)
const OUTIIL_ROOT = 'https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/';

// Version tag
const VERSION = "2.2-core-fix";

// ---- IMAGES (map all IMG_* used in the code to real files in /images) ----
const IMG_OUTIIIL       = OUTIIL_ROOT + 'images/outiiil.png';
const IMG_RADAR         = OUTIIL_ROOT + 'images/radar.png';
const IMG_SPRITE_MENU   = OUTIIL_ROOT + 'images/sprite_menu.png';
const IMG_ACTUALISER    = OUTIIL_ROOT + 'images/actualize_on_01.png';
const IMG_UPDATE        = OUTIIL_ROOT + 'images/actualize_on_01.png';
const IMG_CROIX         = OUTIIL_ROOT + 'images/croix.png';
const IMG_COPIER        = OUTIIL_ROOT + 'images/copy.png';
const IMG_COPY          = OUTIIL_ROOT + 'images/copy.png';
const IMG_CRAYON        = OUTIIL_ROOT + 'images/crayon.gif';
const IMG_DOWN          = OUTIIL_ROOT + 'images/down.png';
const IMG_UP            = OUTIIL_ROOT + 'images/up.png';
const IMG_HISTORIQUE    = OUTIIL_ROOT + 'images/historique.png';
const IMG_LIVRAISON     = OUTIIL_ROOT + 'images/livraison.png';
const IMG_CHANGE        = OUTIIL_ROOT + 'images/change.png';
const IMG_UTILITY       = OUTIIL_ROOT + 'images/utility.png';
const IMG_UTILITAIRE    = OUTIIL_ROOT + 'images/utilitaire.png';
// Fallbacks for icons that are not present in /images: use sprite/utility to avoid 404
const IMG_ATT           = OUTIIL_ROOT + 'images/utility.png';
const IMG_DEF           = OUTIIL_ROOT + 'images/utility.png';
const IMG_GAUCHE        = OUTIIL_ROOT + 'images/sprite_menu.png';
const IMG_DROITE        = OUTIIL_ROOT + 'images/sprite_menu.png';
const IMG_FLECHE        = OUTIIL_ROOT + 'images/sprite_menu.png';
const IMG_MAT           = OUTIIL_ROOT + 'images/utility.png';
const IMG_POMME         = OUTIIL_ROOT + 'images/utility.png';
const IMG_VIE           = OUTIIL_ROOT + 'images/utility.png';

// ---- DATA ARRAYS (sized to match usage in other modules) ----

// Constructions: code expects 13 entries (indexes 0..12)
const CONSTRUCTION = [
  "Champignonnière", "Entrepôt de Nourriture", "Entrepôt de Matériaux",
  "Laboratoire", "Pépinière", "Nurserie", "Reine",
  "Aire de chasse", "Poste de Commandement", "Salle des Trophées",
  "Fosse", "Couveuse", "Loge Impériale"
];

// Recherches: code maps evolutions 13..22 -> 10 items
const RECHERCHE = [
  "Technique de ponte", "Bouclier", "Attaque", "Chasse",
  "Vitesse de chasse", "Vitesse d'attaque", "Génétique",
  "Acide", "Poison", "Camouflage"
];

// Unités: code utilise 1..14 (garde l’index 0 vide)
const NOM_UNITE = [
  "", "Ouvrière", "Jeune Soldate", "Soldate", "Protectrice",
  "Archer", "Guerrière", "Tank", "Tireuse", "Éclaireuse",
  "Soigneuse", "Championne", "Majeure", "Broyeuse", "Coureuse"
];

// Coûts: placeholders cohérents en taille; ajuste plus tard si besoin
const COUT_CONSTUCTION = Array(CONSTRUCTION.length).fill(0);
// Deux tableaux de 10 éléments chacun (POM/BOI) pour RECHERCHE
const COUT_RECHERCHE_POM = Array(RECHERCHE.length).fill(0);
const COUT_RECHERCHE_BOI = Array(RECHERCHE.length).fill(0);
// Unités : 15 éléments (index 0 inutilisé)
const COUT_UNITE = Array(NOM_UNITE.length).fill(0);

// ---- Bootstrap minimal ----
(function initOutiiilContent(){
  // Expose minimal namespace if not existing yet
  if (typeof window.Outiiil !== 'object') {
    window.Outiiil = { version: VERSION, root: OUTIIL_ROOT };
  } else {
    window.Outiiil.version = window.Outiiil.version || VERSION;
    window.Outiiil.root = window.Outiiil.root || OUTIIL_ROOT;
  }
  try {
    // Simple sanity
    if (CONSTRUCTION.length !== 13 || RECHERCHE.length !== 10 || NOM_UNITE.length !== 15) {
      console.warn('[Outiiil content] tailles inattendues',
        { CONSTRUCTION: CONSTRUCTION.length, RECHERCHE: RECHERCHE.length, NOM_UNITE: NOM_UNITE.length });
    }
    console.log('[Outiiil content] chargé OK — v%s', VERSION);
  } catch(e) {
    console.error('[Outiiil content] init error', e);
  }
})();
