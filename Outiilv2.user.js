// ==UserScript==
// @name         Outiil v2 (loader dynamique)
// @version      2.3.1
// @author       Hraesvelg, modifié par White
// @description  Outiil avec chargeur dynamique (hot-reload silencieux de tous les modules)
// @match        http://*.fourmizzz.fr/*
// @downloadURL  https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiilv2.user.js
// @updateURL    https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiilv2.user.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// ==/UserScript==

/* ====== LOADER DYNAMIQUE OUTIIIL (remplace tous les @require) ====== */
(function(){
  const CDN = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main";
  const RAW = "https://raw.githubusercontent.com/LeTristoune81/Outiiil/main";

  // 1) Librairies tierces (ordre important)
  const OUTIIL_LIBS = [
    `${CDN}/js/lib/clipboard_1.7.1.js`,
    `${CDN}/js/lib/datatables_1.10.16.js`,
    `${CDN}/js/lib/globalize_0.1.1.js`,
    `${CDN}/js/lib/globalize-locale-fr.js`,
    `${CDN}/js/lib/highcharts_6.0.7.js`,
    `${CDN}/js/lib/highcharts-data.js`,
    `${CDN}/js/lib/highcharts-more.js`,
    `${CDN}/js/lib/highcharts-stock.js`,
    `${CDN}/js/lib/moment_2.19.1.js`,
    `${CDN}/js/lib/moment-duration-format.js`,
    `${CDN}/js/lib/moment-locale-fr.js`,
    `${CDN}/js/lib/numeral_2.0.6.js`,
    `${CDN}/js/lib/numeral-locale-fr.js`,
  ];

  // 2) Classes (modèles / utils)
  const OUTIIL_CLASSES = [
    `${CDN}/js/class/Alliance.js`,
    `${CDN}/js/class/Armee.js`,
    `${CDN}/js/class/Chasse.js`,
    `${CDN}/js/class/Combat.js`,
    `${CDN}/js/class/Commande.js`,
    `${CDN}/js/class/Convoi.js`,
    `${CDN}/js/class/Joueur.js`,
    `${CDN}/js/class/Parametre.js`,
    `${CDN}/js/class/Traceur.js`,
    `${CDN}/js/class/TraceurAlliance.js`,
    `${CDN}/js/class/TraceurJoueur.js`,
    `${CDN}/js/class/Utils.js`,
  ];

  // 3) Boîtes (UI communes)
  const OUTIIL_BOITES = [
    `${CDN}/js/boite/Boite.js`,
    `${CDN}/js/boite/Chasse.js`,
    `${CDN}/js/boite/Combat.js`,
    `${CDN}/js/boite/Commande.js`,
    `${CDN}/js/boite/ComptePlus.js`,
    `${CDN}/js/boite/Dock.js`,         // ton Dock (Traceur/Carte retirés dans le dépôt)
    `${CDN}/js/boite/Map.js`,
    `${CDN}/js/boite/Parametres.js`,
    `${CDN}/js/boite/Ponte.js`,
    `${CDN}/js/boite/Radar.js`,
    `${CDN}/js/boite/Rang.js`,
    `${CDN}/js/boite/Rapport.js`,
    `${CDN}/js/boite/Traceur.js`,
  ];

  // 4) Pages (routing)
  const OUTIIL_PAGES = [
    `${CDN}/js/page/Alliance.js`,
    `${RAW}/js/page/Armee.js`,         // tu utilisais déjà RAW ici
    `${CDN}/js/page/Attaquer.js`,
    `${CDN}/js/page/Chat.js`,
    `${CDN}/js/page/Commerce.js`,
    `${CDN}/js/page/Construction.js`,
    `${CDN}/js/page/Description.js`,
    `${CDN}/js/page/Forum.js`,
    `${CDN}/js/page/Laboratoire.js`,
    `${CDN}/js/page/Messagerie.js`,
    `${CDN}/js/page/Profil.js`,
    `${CDN}/js/page/Reine.js`,
    `${CDN}/js/page/Ressource.js`,
  ];

  // GET via GM_xhr (anti-cache + sandbox)
  function gmGet(url){
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url + (url.includes("?") ? "&" : "?") + "_=" + Date.now(),
        onload: r => resolve(r.responseText || ""),
        onerror: e => reject(e)
      });
    });
  }

  // Évalue le code dans le sandbox TM (évite CSP inline)
  function evalInSandbox(code, url){
    try { (0, eval)(code + "\n//# sourceURL=" + url); }
    catch(e){ console.error("[Outiil] Eval error:", url, e); }
  }

  async function loadList(urls){
    for (const u of urls){
      const code = await gmGet(u);
      evalInSandbox(code, u);
    }
  }

  // Charge tout Outiiil dans l'ordre
  async function outiilLoadAll(){
    if (window.__OUTIIL_LOADED__) return;
    await loadList(OUTIIL_LIBS);
    await loadList(OUTIIL_CLASSES);
    await loadList(OUTIIL_BOITES);
    await loadList(OUTIIL_PAGES);
    window.__OUTIIL_LOADED__ = true;
    console.log("[Outiil] Modules chargés (loader dynamique).");
  }

  // Hot-reload silencieux (re-télécharge tout ; option: reload page)
  async function outiilHotReload({reload=true} = {}){
    window.__OUTIIL_LOADED__ = false;
    await outiilLoadAll();
    console.log("[Outiil] Hot-reload effectué.");
    if (reload) location.reload();
  }

  // Expose pour bouton/menu/init
  window.outiilLoadAll   = outiilLoadAll;
  window.outiilHotReload = outiilHotReload;

  // Menu Tampermonkey (invisible côté page)
  if (typeof GM_registerMenuCommand === "function"){
    GM_registerMenuCommand("Outiil — Hot-reload", () => outiilHotReload({reload:true}));
    GM_registerMenuCommand("Outiil — Ouvrir le script RAW", () =>
      GM_openInTab("https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiilv2.user.js", {active:true, insert:true}));
  }
})();
/* =================== FIN LOADER =================== */


/* ========================== CONSTANTES ========================== */
const VERSION = "2.3.1";
const CONSTRUCTION = ["Champignonnière", "Entrepôt de Nourriture", "Entrepôt de Matériaux", "Couveuse", "Solarium", "Laboratoire", "Salle d'analyse", "Salle de combat", "Caserne", "Dôme", "Loge Impériale", "Etable à pucerons", "Etable à cochenilles"];
const RECHERCHE = ["Technique de ponte", "Bouclier Thoracique", "Armes", "Architecture", "Communication avec les animaux", "Vitesse de chasse", "Vitesse d'attaque", "Génétique", "Acide", "Poison"];
const COUT_CONSTUCTION = [90, 600, 600, 600, 2000, 1400, 1400, 300, 800, 3500, 5000, 1500, 10000];
const COUT_RECHERCHE_POM = [120, 200, 300, 100, 200, 4000, 3000, 3000, 100000, 40000000];
const COUT_RECHERCHE_BOI = [120, 300, 200, 200, 500, 2500, 1000, 10000, 300000, 15000000];
const NOM_UNITE = ["Ouvrière", "Jeune Soldate Naine", "Soldate Naine", "Naine d’Elite", "Jeune Soldate", "Soldate", "Concierge", "Concierge d’élite", "Artilleuse", "Artilleuse d’élite", "Soldate d’élite", "Tank", "Tank d’élite", "Tueuse", "Tueuse d’élite"];
const NOM_UNITES = ["Ouvrières", "Jeunes Soldates Naines", "Soldates Naines", "Naines d’Elites", "Jeunes Soldates", "Soldates", "Concierges", "Concierges d’élites", "Artilleuses", "Artilleuses d’élites", "Soldates d’élites", "Tanks", "Tanks d’élites", "Tueuses", "Tueuses d’élites"];
const NOM_RAC_UNITE = ["Ouvrière", "JSN", "SN", "NE", "JS", "S", "C", "CE", "A", "AE", "SE", "Tk", "TkE", "Tu", "TuE"];
const TEMPS_UNITE = [60, 300, 450, 570, 740, 1000, 1410, 1410, 1440, 1520, 1450, 1860, 1860, 2740, 2740];
const COUT_UNITE = [5, 16, 20, 26, 30, 36, 70, 100, 30, 34, 44, 100, 150, 80, 90];
const VIE_UNITE = [-1, 8, 10, 13, 16, 20, 30, 40, 10, 12, 27, 35, 50, 50, 55];
const ATT_UNITE = [-1, 3, 5, 7, 10, 15, 1, 1, 30, 35, 24, 55, 80, 50, 55];
const DEF_UNITE = [-1, 2, 4, 6, 9, 14, 25, 35, 15, 18, 23, 1, 1, 50, 55];
const RATIO_CHASSE = [1, 2, 3, 4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];
const PERTE_MIN_CHASSE = [0.103971824, 0.066805442, 0.036854146, 0.014477073, 0.010067247, 0.008361713, 0.00751662, 0.007060666, 0.006692853, 0.006402339, 0.006090569, 0.0057788, 0.005080623];
const PERTE_MOY_CHASSE = [0.14183641, 0.089382202, 0.065595625, 0.037509208, 0.024982573, 0.018532185, 0.014281932, 0.011725921, 0.010437083, 0.009834768, 0.009339662, 0.008844556, 0.008502895];
const PERTE_MAX_CHASSE = [0.33333334, 0.176739357, 0.113191158, 0.08245817, 0.051342954, 0.036955988, 0.03395735, 0.032083615, 0.026461955, 0.024588162, 0.021774264, 0.018960366, 0.017190797];
const ORDRE_UNITE_CHASSE = [10, 3, 4, 1, 12, 7, 5, 13, 11, 9, 8, 6, 2];
const ORDRE_XP_CHASSE = [10, 3, 4, 1, 12, 7, 5];
const REPLIQUE_CHASSE = [0, 0, 0, 0.016, 0.093, 0.345, 0.577777778, 0.753, 0.837, 0.874, 0.937, 0.96, 0.989];
// Smiley / images chat & messagerie (listes complètes depuis ton script)
const LISTESMILEY1 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img src='images/smiley/ant_pouce.gif' onclick='addRaccourciSmiley("message","ant_pouce")'>
       <img src='images/smiley/ant_smile.gif' onclick='addRaccourciSmiley("message","ant_smile")'>
       <img src='images/smiley/ant_biggrin.gif' onclick='addRaccourciSmiley("message","ant_biggrin")'>
       <img src='images/smiley/ant_laugh.gif' onclick='addRaccourciSmiley("message","ant_laugh")'>
       <img src='images/smiley/ant_tongue.gif' onclick='addRaccourciSmiley("message","ant_tongue")'>
       <img src='images/smiley/ant_bye.gif' onclick='addRaccourciSmiley("message","ant_bye")'>
       <img src='images/smiley/ant_cool.gif' onclick='addRaccourciSmiley("message","ant_cool")'>
       <img src='images/smiley/ant_interest.gif' onclick='addRaccourciSmiley("message","ant_interest")'>
       <img src='images/smiley/ant_angel.gif' onclick='addRaccourciSmiley("message","ant_angel")'>
       <img src='images/smiley/ant_smug.gif' onclick='addRaccourciSmiley("message","ant_smug")'>
       <img src='images/smiley/ant_nudgewink.gif' onclick='addRaccourciSmiley("message","ant_nudgewink")'>
       <img src='images/smiley/ant_blink.gif' onclick='addRaccourciSmiley("message","ant_blink")'>
       <img src='images/smiley/ant_unsure.gif' onclick='addRaccourciSmiley("message","ant_unsure")'>
       <img src='images/smiley/ant_shy.gif' onclick='addRaccourciSmiley("message","ant_shy")'>
       <img src='images/smiley/ant_oh.gif' onclick='addRaccourciSmiley("message","ant_oh")'>
       <img src='images/smiley/ant_sleep.gif' onclick='addRaccourciSmiley("message","ant_sleep")'>
       <img src='images/smiley/ant_sad.gif' onclick='addRaccourciSmiley("message","ant_sad")'>
       <img src='images/smiley/ant_mad.gif' onclick='addRaccourciSmiley("message","ant_mad")'>
       <img src='images/smiley/ant_doctor.gif' onclick='addRaccourciSmiley("message","ant_doctor")'>`;
const LISTESMILEY2 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img onclick='addRaccourciSmiley("message","doctor")' src='images/smiley/doctor.gif'>
       <img onclick='addRaccourciSmiley("message","borg")' src='images/smiley/borg.gif'>
       <img onclick='addRaccourciSmiley("message","pirate")' src='images/smiley/pirate.gif'>
       <img onclick='addRaccourciSmiley("message","sick2")' src='images/smiley/sick2.gif'>
       <img onclick='addRaccourciSmiley("message","asian")' src='images/smiley/asian.gif'>
       <img onclick='addRaccourciSmiley("message","dunce")' src='images/smiley/dunce.gif'>
       <img onclick='addRaccourciSmiley("message","canadian")' src='images/smiley/canadian.gif'>
       <img onclick='addRaccourciSmiley("message","captain")' src='images/smiley/captain.gif'>
       <img onclick='addRaccourciSmiley("message","police")' src='images/smiley/police.gif'>
       <img onclick='addRaccourciSmiley("message","santa")' src='images/smiley/santa.gif'>
       <img onclick='addRaccourciSmiley("message","cook")' src='images/smiley/cook.gif'>
       <img onclick='addRaccourciSmiley("message","farmer")' src='images/smiley/farmer.gif'>
       <img onclick='addRaccourciSmiley("message","smurf")' src='images/smiley/smurf.gif'>
       <img onclick='addRaccourciSmiley("message","gangster")' src='images/smiley/gangster.gif'>
       <img onclick='addRaccourciSmiley("message","king")' src='images/smiley/king.gif'>
       <img onclick='addRaccourciSmiley("message","king2")' src='images/smiley/king2.gif'>
       <img onclick='addRaccourciSmiley("message","pixie")' src='images/smiley/pixie.gif'>
       <img onclick='addRaccourciSmiley("message","pirate2")' src='images/smiley/pirate2.gif'>
       <img onclick='addRaccourciSmiley("message","pirate3")' src='images/smiley/pirate3.gif'>
       <img onclick='addRaccourciSmiley("message","warrior")' src='images/smiley/warrior.gif'>
       <img onclick='addRaccourciSmiley("message","card")' src='images/smiley/card.gif'>
       <img onclick='addRaccourciSmiley("message","egypt")' src='images/smiley/egypt.gif'>
       <img onclick='addRaccourciSmiley("message","fool")' src='images/smiley/fool.gif'>
       <img onclick='addRaccourciSmiley("message","hat")' src='images/smiley/hat.gif'>`;
const LISTESMILEY3 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img onclick='addRaccourciSmiley("message","dead")' src='images/smiley/dead.gif'>
       <img onclick='addRaccourciSmiley("message","inv")' src='images/smiley/inv.gif'>
       <img onclick='addRaccourciSmiley("message","stretcher")' src='images/smiley/stretcher.gif'>
       <img onclick='addRaccourciSmiley("message","blue")' src='images/smiley/blue.gif'>
       <img onclick='addRaccourciSmiley("message","sick")' src='images/smiley/sick.gif'>
       <img onclick='addRaccourciSmiley("message","love")' src='images/smiley/love.gif'>
       <img onclick='addRaccourciSmiley("message","cupid")' src='images/smiley/cupid.gif'>
       <img onclick='addRaccourciSmiley("message","diablo")' src='images/smiley/diablo.gif'>
       <img onclick='addRaccourciSmiley("message","crossbones")' src='images/smiley/crossbones.gif'>
       <img onclick='addRaccourciSmiley("message","fish")' src='images/smiley/fish.gif'>
       <img onclick='addRaccourciSmiley("message","cupid2")' src='images/smiley/cupid2.gif'>
       <img onclick='addRaccourciSmiley("message","construction")' src='images/smiley/construction.gif'>
       <img onclick='addRaccourciSmiley("message","flower")' src='images/smiley/flower.gif'>
       <img onclick='addRaccourciSmiley("message","drinks")' src='images/smiley/drinks.gif'>
       <img onclick='addRaccourciSmiley("message","burp")' src='images/smiley/burp.gif'>
       <img onclick='addRaccourciSmiley("message","rain")' src='images/smiley/rain.gif'>
       <img onclick='addRaccourciSmiley("message","surf")' src='images/smiley/surf.gif'>
       <img onclick='addRaccourciSmiley("message","baloon")' src='images/smiley/baloon.gif'>
       <img onclick='addRaccourciSmiley("message","sleep2")' src='images/smiley/sleep2.gif'>
       <img onclick='addRaccourciSmiley("message","rip")' src='images/smiley/rip.gif'>
       <img onclick='addRaccourciSmiley("message","scooter")' src='images/smiley/scooter.gif'>
       <img onclick='addRaccourciSmiley("message","moto")' src='images/smiley/moto.gif'>`;
const LISTESMILEY4 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img onclick='addRaccourciSmiley("message","whip")' src='images/smiley/whip.gif'>
      <img onclick='addRaccourciSmiley("message","shades")' src='images/smiley/shades.gif'>
      <img onclick='addRaccourciSmiley("message","kiss")' src='images/smiley/kiss.gif'>
      <img onclick='addRaccourciSmiley("message","boxer")' src='images/smiley/boxer.gif'>
      <img onclick='addRaccourciSmiley("message","gun")' src='images/smiley/gun.gif'>
      <img onclick='addRaccourciSmiley("message","bross")' src='images/smiley/bross.gif'>
      <img onclick='addRaccourciSmiley("message","whistling")' src='images/smiley/whistling.gif'>
      <img onclick='addRaccourciSmiley("message","showoff")' src='images/smiley/showoff.gif'>
      <img onclick='addRaccourciSmiley("message","noel_vache")' src='images/smiley/noel_vache.gif'>
      <img onclick='addRaccourciSmiley("message","app")' src='images/smiley/app.gif'>
      <img onclick='addRaccourciSmiley("message","book")' src='images/smiley/book.gif'>
      <img onclick='addRaccourciSmiley("message","cake")' src='images/smiley/cake.gif'>
      <img onclick='addRaccourciSmiley("message","dance")' src='images/smiley/dance.gif'>
      <img onclick='addRaccourciSmiley("message","harhar")' src='images/smiley/harhar.gif'>
      <img onclick='addRaccourciSmiley("message","juggle")' src='images/smiley/juggle.gif'>
      <img onclick='addRaccourciSmiley("message","worthy")' src='images/smiley/worthy.gif'>
      <img onclick='addRaccourciSmiley("message","fishing")' src='images/smiley/fishing.gif'>
      <img onclick='addRaccourciSmiley("message","stereo")' src='images/smiley/stereo.gif'>
      <img onclick='addRaccourciSmiley("message","music")' src='images/smiley/music.gif'>
      <img onclick='addRaccourciSmiley("message","prison")' src='images/smiley/prison.gif'>
      <img onclick='addRaccourciSmiley("message","piece")' src='images/smiley/piece.gif'>`;
const LISTESMILEY5 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img onclick='addRaccourciSmiley("message","noel_etoile")' src='images/smiley/noel_etoile.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman10")' src='images/smiley/noel_snowman10.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman11")' src='images/smiley/noel_snowman11.gif'>
       <img onclick='addRaccourciSmiley("message","noel_cadeau3")' src='images/smiley/noel_cadeau3.gif'>
       <img onclick='addRaccourciSmiley("message","noel_vache")' src='images/smiley/noel_vache.gif'>
       <img onclick='addRaccourciSmiley("message","santa")' src='images/smiley/santa.gif'>
       <img onclick='addRaccourciSmiley("message","noel_pere")' src='images/smiley/noel_pere.gif'>
       <img onclick='addRaccourciSmiley("message","noel_santa")' src='images/smiley/noel_santa.gif'>
       <img onclick='addRaccourciSmiley("message","noel_bougie")' src='images/smiley/noel_bougie.gif'>
       <img onclick='addRaccourciSmiley("message","noel_chien2")' src='images/smiley/noel_chien2.gif'>
       <img onclick='addRaccourciSmiley("message","noel_chapeau")' src='images/smiley/noel_chapeau.gif'>
       <img onclick='addRaccourciSmiley("message","noel_cadeau")' src='images/smiley/noel_cadeau.gif'>
       <img onclick='addRaccourciSmiley("message","noel_sapin3")' src='images/smiley/noel_sapin3.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman4")' src='images/smiley/noel_snowman4.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman3")' src='images/smiley/noel_snowman3.gif'>
       <img onclick='addRaccourciSmiley("message","noel_chaussette")' src='images/smiley/noel_chaussette.gif'>
       <img onclick='addRaccourciSmiley("message","noel_flocon")' src='images/smiley/noel_flocon.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman5")' src='images/smiley/noel_snowman5.gif'>
       <img onclick='addRaccourciSmiley("message","noel_sapin2")' src='images/smiley/noel_sapin2.gif'>
       <img onclick='addRaccourciSmiley("message","noel_snowman8")' src='images/smiley/noel_snowman8.gif'>
       <img onclick='addRaccourciSmiley("message","noel_bonnet")' src='images/smiley/noel_bonnet.gif'>
       <img onclick='addRaccourciSmiley("message","noel_renne")' src='images/smiley/noel_renne.gif'>
       <img onclick='addRaccourciSmiley("message","noel_renne3")' src='images/smiley/noel_renne3.gif'>`;
const LISTESMILEY6 = `<img src='images/carte/rien.gif' width='1' height='39'>
      <img src='images/smiley/dollar.gif' onclick='addRaccourciSmiley("message","dollar")'>
       <img src='images/smiley/ninja.gif' onclick='addRaccourciSmiley("message","ninja")'>
       <img src='images/smiley/bat.gif' onclick='addRaccourciSmiley("message","bat")'>
       <img src='images/smiley/whistles.gif' onclick='addRaccourciSmiley("message","whistles")'>
       <img src='images/smiley/showoff2.gif' onclick='addRaccourciSmiley("message","showoff2")'>
       <img src='images/smiley/barbarian.gif' onclick='addRaccourciSmiley("message","barbarian")'>
       <img src='images/smiley/magi.gif' onclick='addRaccourciSmiley("message","magi")'>
       <img src='images/smiley/prof.gif' onclick='addRaccourciSmiley("message","prof")'>
       <img src='images/smiley/witch.gif' onclick='addRaccourciSmiley("message","witch")'>
       <img src='images/smiley/pirate4.gif' onclick='addRaccourciSmiley("message","pirate4")'>
       <img src='images/smiley/bicycle.gif' onclick='addRaccourciSmiley("message","bicycle")'>
       <img src='images/smiley/scooter2.gif' onclick='addRaccourciSmiley("message","scooter2")'>
       <img src='images/smiley/police2.gif' onclick='addRaccourciSmiley("message","police2")'>
       <img src='images/smiley/dragon.gif' onclick='addRaccourciSmiley("message","dragon")'>
       <img src='images/smiley/panic.gif' onclick='addRaccourciSmiley("message","panic")'>
       <img src='images/smiley/dog.gif' onclick='addRaccourciSmiley("message","dog")'>
       <img src='images/smiley/plane.gif' onclick='addRaccourciSmiley("message","plane")'>`;

// Images diverses / sprites
const IMG_FLECHE = "<img src='images/icone/fleche-bas-claire.png' style='vertical-align:1px;' alt='changer' height='8'>";
const IMG_POMME = "<img src='images/icone/icone_pomme.gif' alt='Nourriture' class='o_vAlign' height='18' title='Consommation Journalière' />";
const IMG_MAT = "<img src='images/icone/icone_bois.gif' alt='Materiaux' height='18'/>";
const IMG_VIE = "<img src='images/icone/icone_coeur.gif' class='o_vAlign' height='18' width='18'/>";
const IMG_ATT = "<img src='images/icone/icone_degat_attaque.gif'  alt='Dégâts en attaque :' class='o_vAlign'height='18' title='Dégâts en attaque :' />";
const IMG_DEF = "<img src='images/icone/icone_degat_defense.gif' alt='Dégâts en défense :' class='o_vAlign' height='18' title='Dégâts en défense :' />";
const IMG_GAUCHE = "<img src='images/bouton/fleche-champs-gauche.gif' width='9' height='15' class='o_vAlign'/>";
const IMG_DROITE = "<img src='images/bouton/fleche-champs-droite.gif' width='9' height='15' class='o_vAlign'/>";
const IMG_COPY = "<img src='images/icone/feuille.gif' class='cliquable' title='Copier/Coller une armée' style='position:relative;top:3px' width='14' height='17'>";

// ==== sprites & images hébergées (Manitas)
const IMG_CHANGE = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/change.png";
const IMG_ACTUALISER = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/actualize_on_01.png";
const IMG_CRAYON = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/crayon.png";
const IMG_CROIX = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/croix.png";
const IMG_COPIER = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/copy.png";
const IMG_HISTORIQUE = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/historique.png";
const IMG_LIVRAISON = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/livraison.png";
const IMG_RADAR = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/radar.png";
const IMG_SPRITE_MENU = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/sprite_menu.png";
const IMG_UTILITY = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/utility.png";
const IMG_DOWN = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/down.png";
const IMG_UP = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/up.png";
const IMG_OUTIIIL = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/outiiil.png";

var cssFiles = [
  "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/css/outiiil.css",
  "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/css/toasts.css",
  "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/css/datatables.css"
];

// charge CSS
function loadcssfile(filename) {
  var el = document.createElement("link"),
      Head0 = document.getElementsByTagName('head')[0];
  el.setAttribute("rel", "stylesheet");
  el.setAttribute("type", "text/css");
  el.setAttribute("href", filename);
  Head0.appendChild(el);
}
loadcssfile(cssFiles[0]);
loadcssfile(cssFiles[1]);
loadcssfile(cssFiles[2]);

const TOAST_ERROR = { heading: "Erreur", hideAfter: 3500, showHideTransition: "slide", position: { top: 30, right: 100 }, icon: "error" };
const TOAST_SUCCESS = { heading: "Succès", hideAfter: 3500, showHideTransition: "slide", position: { top: 30, right: 100 }, icon: "success" };
const TOAST_WARNING = { heading: "Attention", hideAfter: 3500, showHideTransition: "slide", position: { top: 30, right: 100 }, icon: "warning" };
const TOAST_INFO = { heading: "Information", hideAfter: 3500, showHideTransition: "slide", position: { top: 30, right: 100 }, icon: "info" };

const EVOLUTION = [...CONSTRUCTION, ...RECHERCHE, "Nourriture", "Materiaux"];
const EFFET = ["", "Blind", "Bounce", "Clip", "Drop", "Explode", "Fade", "Fold", "Highlight", "Puff", "Pulsate", "Scale", "Shake", "Size", "Slide"];
const METHODE_FLOOD = ["Standard", "Optimisée", "Uniforme", "Dégressive"];
const LIEU = { TERRAIN: 0, DOME: 1, LOGE: 2 };
const LIBELLE_LIEU = ["Terrain de Chasse", "fourmilière", "Loge Impériale"];
const ETAT_COMMANDE = { "Nouvelle": 0, "En attente": 1, "En cours": 2, "Annulée": 3, "Terminée": 4, "Supprimée": 5 };
const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MOIS_RAC_FR = ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const JOUR_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DATEPICKER_OPTION = {
  closeText: 'Fermer', prevText: 'Précédent', nextText: 'Suivant', currentText: 'Aujourd\'hui',
  monthNames: MOIS_FR, monthNamesShort: MOIS_RAC_FR, dayNames: JOUR_FR,
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  weekHeader: 'Sem.', dateFormat: 'dd-mm-yy',
  firstDay: '1', changeYear: true, changeMonth: true
};

/* ========================== BOOT / INIT ========================== */
var monProfil = null;

(async function OUTIIL_BOOT(){
  // 1) attendre DOM prêt
  await new Promise(resolve => {
    if (document.readyState === "complete" || document.readyState === "interactive") resolve();
    else document.addEventListener("DOMContentLoaded", resolve, { once:true });
  });

  // 2) charger dynamiquement les modules
  await window.outiilLoadAll();

  // 3) attendre jQuery (si la page le fournit)
  await new Promise(resolve => {
    if (window.jQuery) return resolve();
    const t0 = Date.now();
    const it = setInterval(() => {
      if (window.jQuery || Date.now() - t0 > 5000) { clearInterval(it); resolve(); }
    }, 50);
  });

  // si l'utilisateur est identifié
  if ($(".boite_connexion_titre:first").text() != "Connexion") {
    // Thème jquery UI + locales
    $("head").append("<link rel='stylesheet' href='http://code.jquery.com/ui/1.12.1/themes/humanity/jquery-ui.min.css'/>");
    if (typeof numeral !== "undefined") numeral.locale("fr");
    if (typeof moment  !== "undefined") moment.locale("fr");
    if (typeof Highcharts !== "undefined") {
      Highcharts.setOptions({ lang: { months: MOIS_FR, shortMonths: MOIS_RAC_FR, weekdays: JOUR_FR, decimalPoint: ',', thousandsSep: ' ' } });
    }

    // DataTables sorts
    if ($.fn.dataTable && $.fn.dataTable.ext) {
      $.fn.dataTable.ext.type.order["quantite-grade-pre"] = (d) => { return parseInt(String(d).replace(/\s/g, '')) || 0; };
      $.fn.dataTable.ext.type.order["moment-D MMM YYYY-pre"] = (d) => { return moment(String(d).replace('.', ''), "D MMM YYYY", "fr", true).unix(); };
      $.fn.dataTable.ext.type.order["time-unformat-pre"] = (d) => { return (window.Utils && Utils.timeToInt) ? Utils.timeToInt(d) : 0; };
    }

    // Profil joueur
    monProfil = new Joueur({ pseudo: $("#pseudo").text() });
    monProfil.getParametre();

    // Charger données & afficher outils
    Promise.all([monProfil.getConstruction(), monProfil.getLaboratoire(), monProfil.getProfilCourant()]).then((values) => {
      if (values[0]) monProfil.chargerConstruction(values[0]);
      if (values[1]) monProfil.chargerRecherche(values[1]);
      if (values[2]) monProfil.chargerProfil(values[2]);

      // Dock
      let boite = new Dock();
      boite.afficher();

      // Garde-fou : retirer Traceur/Carte si un vieux Dock les remet
      $(function(){
        $("#o_toolbarOutiiil")
          .find('.o_toolbarItem[title="Traceur"], .o_toolbarItem[title="Carte"], #o_itemTraceur, #o_itemMap')
          .closest(".o_toolbarItem").remove();
      });

      // Compte Plus
      let boiteComptePlus = new BoiteComptePlus();
      boiteComptePlus.afficher();

      // Radar
      let boiteRadar = new BoiteRadar();
      boiteRadar.afficher();

      // Traceur auto si clé
      if (monProfil.parametre["cleTraceur"] && monProfil.parametre["cleTraceur"].valeur) {
        let traceur1 = new TraceurJoueur(monProfil.parametre["etatTraceurJoueur"].valeur, monProfil.parametre["intervalleTraceurJoueur"].valeur, monProfil.parametre["nbPageTraceurJoueur"].valeur);
        traceur1.tracer();
        let traceur2 = new TraceurAlliance(monProfil.parametre["etatTraceurAlliance"].valeur, monProfil.parametre["intervalleTraceurAlliance"].valeur);
        traceur2.tracer();
      }

      // Routing
      let uri = location.pathname, page = null;
      switch (true) {
        case (uri == "/Reine.php"):
          page = new PageReine(boiteComptePlus);
          if (!Utils.comptePlus) page.plus();
          break;
        case (uri == "/construction.php"):
          page = new PageConstruction(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/laboratoire.php"):
          page = new PageLaboratoire(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/Ressources.php"):
          page = new PageRessource(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/Armee.php"):
          page = new PageArmee(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/commerce.php"):
          page = new PageCommerce(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/messagerie.php"):
          page = new PageMessagerie();
          page.executer();
          break;
        case (uri == "/alliance.php" && location.search == ""):
        case (uri == "/chat.php"):
          page = new PageChat();
          page.executer();
          break;
        case (location.href.indexOf("/alliance.php?forum_menu") > 0):
          page = new PageForum();
          page.executer();
          break;
        case (location.href.indexOf("/alliance.php?Membres") > 0):
          page = new PageAlliance();
          page.executer();
          break;
        case (location.href.indexOf("/Membre.php?Pseudo") > 0):
        case (uri == "/Membre.php"):
          page = new PageProfil(boiteRadar);
          page.executer();
          break;
        case (uri == "/classementAlliance.php" && Utils.extractUrlParams()["alliance"] != "" && Utils.extractUrlParams()["alliance"] != undefined):
          page = new PageDescription(boiteRadar);
          page.executer();
          break;
        case (location.href.indexOf("/ennemie.php?Attaquer") > 0):
        case (location.href.indexOf("/ennemie.php?annuler") > 0):
          page = new PageAttaquer(boiteComptePlus);
          page.executer();
          break;
        case (uri == "/ennemie.php" && location.search == ""):
          // Affichage des temps de trajet
          $("#tabEnnemie tr:eq(0) th:eq(5)").after("<th class='centre'>Temps</th>");
          $("#tabEnnemie tr:gt(0)").each((i, elt) => {
            let distance = parseInt($(elt).find("td:eq(5)").text());
            $(elt).find("td:eq(5)").after(`<td class='centre'>${Utils.intToTime(Math.ceil(Math.pow(0.9, monProfil.niveauRecherche[6]) * 637200 * (1 - Math.exp(-(distance / 350)))))}</td>`);
          });
          break;
        default:
          break;
      }
    });

    // suppression du bouton “Replacer l’armée”
    $(function(){ $('#o_replaceArmee').remove(); });
  }
})();
