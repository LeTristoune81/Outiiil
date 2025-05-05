// URL racine où jsDelivr sert votre dépôt
const OUTIIL_ROOT = 'https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/';

/*
 * main.js
 * Hraesvelg
 **********************************************************************/

/**
 * CONSTANTES
 */
const VERSION            = "2.0.1.1";
const CONSTRUCTION       = ["Champignonnière", "Entrepôt de Nourriture", "Entrepôt de Matériaux", "Couveuse", "Solarium", "Laboratoire", "Salle d'analyse", "Salle de combat", "Caserne", "Dôme", "Loge Impériale", "Etable à pucerons", "Etable à cochenilles"];
const RECHERCHE          = ["Technique de ponte", "Bouclier Thoracique", "Armes", "Architecture", "Communication avec les animaux", "Vitesse de chasse", "Vitesse d'attaque", "Génétique", "Acide", "Poison"];
const COUT_CONSTUCTION   = [90, 600, 600, 600, 2000, 1400, 1400, 300, 800, 3500, 5000, 1500, 10000];
const COUT_RECHERCHE_POM = [120, 200, 300, 100, 200, 4000, 3000, 3000, 100000, 40000000];
const COUT_RECHERCHE_BOI = [120, 300, 200, 200, 500, 2500, 1000, 10000, 300000, 15000000];
const NOM_UNITE          = ["Ouvrière", "Jeune Soldate Naine", "Soldate Naine", "Naine d’Elite", "Jeune Soldate", "Soldate", "Concierge", "Concierge d’élite", "Artilleuse", "Artilleuse d’élite", "Soldate d’élite", "Tank", "Tank d’élite", "Tueuse", "Tueuse d’élite"];
const NOM_UNITES         = ["Ouvrières", "Jeunes Soldates Naines", "Soldates Naines", "Naines d’Elites", "Jeunes Soldates", "Soldates", "Concierges", "Concierges d’élites", "Artilleuses", "Artilleuses d’élites", "Soldates d’élites", "Tanks", "Tanks d’élites", "Tueuses", "Tueuses d’élites"];
const NOM_RAC_UNITE      = ["Ouvrière", "JSN", "SN", "NE", "JS", "S", "C", "CE", "A", "AE", "SE", "Tk", "TkE", "Tu", "TuE"];
const TEMPS_UNITE        = [60, 300, 450, 570, 740, 1000, 1410, 1410, 1440, 1520, 1450, 1860, 1860, 2740, 2740];
const COUT_UNITE         = [5, 16, 20, 26, 30, 36, 70, 100, 30, 34, 44, 100, 150, 80, 90];
const VIE_UNITE          = [-1, 8, 10, 13, 16, 20, 30, 40, 10, 12, 27, 35, 50, 50, 55];
const ATT_UNITE          = [-1, 3, 5, 7, 10, 15, 1, 1, 30, 35, 24, 55, 80, 50, 55];
const DEF_UNITE          = [-1, 2, 4, 6, 9, 14, 25, 35, 15, 18, 23, 1, 1, 50, 55];
const RATIO_CHASSE       = [1, 2, 3, 4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];
const PERTE_MIN_CHASSE   = [0.103971824, 0.066805442, 0.036854146, 0.014477073, 0.010067247, 0.008361713, 0.00751662, 0.007060666, 0.006692853, 0.006402339, 0.006090569, 0.0057788, 0.005080623];
const PERTE_MOY_CHASSE   = [0.14183641, 0.089382202, 0.065595625, 0.037509208, 0.024982573, 0.018532185, 0.014281932, 0.011725921, 0.010437083, 0.009834768, 0.009339662, 0.008844556, 0.008502895];
const PERTE_MAX_CHASSE   = [0.33333334, 0.176739357, 0.113191158, 0.08245817, 0.051342954, 0.036955988, 0.03395735, 0.032083615, 0.026461955, 0.024588162, 0.021774264, 0.018960366, 0.017190797];
const ORDRE_UNITE_CHASSE = [10, 3, 4, 1, 12, 7, 5, 13, 11, 9, 8, 6, 2];
const ORDRE_XP_CHASSE    = [10, 3, 4, 1, 12, 7, 5];
const REPLIQUE_CHASSE    = [0, 0, 0, 0.016, 0.093, 0.345, 0.577777778, 0.753, 0.837, 0.874, 0.937, 0.96, 0.989];

/**
 * LISTES SMILEYS (TOUS les src mis à jour)
 */
const LISTESMILEY1 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/ant_pouce.gif" onclick='addRaccourciSmiley("message","ant_pouce")'>
  <img src="${OUTIIL_ROOT}images/smiley/ant_smile.gif" onclick='addRaccourciSmiley("message","ant_smile")'>
  ... (et le reste identique, chaque src="images/…" devient src="${OUTIIL_ROOT}images/…")
`;

const LISTESMILEY2 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/doctor.gif" onclick='addRaccourciSmiley("message","doctor")'>
  ...  (idem)
`;

const LISTESMILEY3 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/dead.gif" onclick='addRaccourciSmiley("message","dead")'>
  ...  (idem)
`;

const LISTESMILEY4 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/whip.gif" onclick='addRaccourciSmiley("message","whip")'>
  ...  (idem)
`;

const LISTESMILEY5 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/noel_etoile.gif" onclick='addRaccourciSmiley("message","noel_etoile")'>
  ...  (idem)
`;

const LISTESMILEY6 = `
  <img src="${OUTIIL_ROOT}images/carte/rien.gif" width="1" height="39">
  <img src="${OUTIIL_ROOT}images/smiley/dollar.gif" onclick='addRaccourciSmiley("message","dollar")'>
  ...  (idem)
`;

/**
 * AUTRES ICÔNES UTILITAIRES
 */
const IMG_FLECHE      = `<img src="${OUTIIL_ROOT}images/icone/fleche-bas-claire.png" style="vertical-align:1px;" alt="changer" height="8">`;
const IMG_POMME       = `<img src="${OUTIIL_ROOT}images/icone/icone_pomme.gif" alt="Nourriture" class="o_vAlign" height="18" title="Consommation Journalière"/>`;
const IMG_MAT         = `<img src="${OUTIIL_ROOT}images/icone/icone_bois.gif" alt="Matériaux" height="18"/>`;
const IMG_VIE         = `<img src="${OUTIIL_ROOT}images/icone/icone_coeur.gif" class="o_vAlign" height="18" width="18"/>`;
const IMG_ATT         = `<img src="${OUTIIL_ROOT}images/icone/icone_degat_attaque.gif" alt="Dégâts en attaque :" class="o_vAlign" height="18" title="Dégâts en attaque :"/>`;
const IMG_DEF         = `<img src="${OUTIIL_ROOT}images/icone/icone_degat_defense.gif" alt="Dégâts en défense :" class="o_vAlign" height="18" title="Dégâts en défense :"/>`;
const IMG_GAUCHE      = `<img src="${OUTIIL_ROOT}images/bouton/fleche-champs-gauche.gif" width="9" height="15" class="o_vAlign"/>`;
const IMG_DROITE      = `<img src="${OUTIIL_ROOT}images/bouton/fleche-champs-droite.gif" width="9" height="15" class="o_vAlign"/>`;
const IMG_COPY        = `<img src="${OUTIIL_ROOT}images/icone/feuille.gif" class="cliquable" title="Copier/Coller une armée" style="position:relative;top:3px" width="14" height="17"/>`;
const IMG_CHANGE      = OUTIIL_ROOT + 'images/change.png';
const IMG_ACTUALISER  = OUTIIL_ROOT + 'images/actualize_on_01.png';
const IMG_CRAYON      = OUTIIL_ROOT + 'images/crayon.gif';
const IMG_CROIX       = OUTIIL_ROOT + 'images/croix.png';
const IMG_COPIER      = OUTIIL_ROOT + 'images/copy.png';
const IMG_HISTORIQUE  = OUTIIL_ROOT + 'images/historique.png';
const IMG_LIVRAISON   = OUTIIL_ROOT + 'images/livraison.png';
const IMG_RADAR       = OUTIIL_ROOT + 'images/radar.png';
const IMG_SPRITE_MENU = OUTIIL_ROOT + 'images/sprite_menu.png';
const IMG_UTILITY     = OUTIIL_ROOT + 'images/utility.png';
const IMG_DOWN        = OUTIIL_ROOT + 'images/down.png';
const IMG_UP          = OUTIIL_ROOT + 'images/up.png';
const IMG_OUTIIIL     = OUTIIL_ROOT + 'images/outiiil.png';

/**
 * Suite du code (init, routing, modules…) inchangée :
 */
!function() {
  if ($(".boite_connexion_titre:first").text() != "Connexion") {
    // thème jQuery UI, locales, DataTables…
    $("head").append(`<link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/humanity/jquery-ui.min.css"/>`);
    numeral.locale("fr"); moment.locale("fr");
    Highcharts.setOptions({ lang:{ months:MOIS_FR, shortMonths:MOIS_RAC_FR, weekdays:JOUR_FR, decimalPoint:',', thousandsSep:' ' } });
    $.fn.dataTable.ext.type.order["quantite-grade-pre"]   = d => parseInt(d.replace(/\s/g,'')); 
    $.fn.dataTable.ext.type.order["moment-D MMM YYYY-pre"]= d => moment(d.replace('.', ''),"D MMM YYYY","fr",true).unix();
    $.fn.dataTable.ext.type.order["time-unformat-pre"]    = d => Utils.timeToInt(d);

    // profil et paramètres
    monProfil=new Joueur({pseudo:$("#pseudo").text()});
    monProfil.getParametre();
    Promise.all([monProfil.getConstruction(),monProfil.getLaboratoire(),monProfil.getProfilCourant()]).then(vals=>{
      if(vals[0]) monProfil.chargerConstruction(vals[0]);
      if(vals[1]) monProfil.chargerRecherche(vals[1]);
      if(vals[2]) monProfil.chargerProfil(vals[2]);

      // affichage des boîtes
      let boite = new Dock(); boite.afficher();
      let boiteCompte = new BoiteComptePlus(); boiteCompte.afficher();
      let boiteRadar = new BoiteRadar(); boiteRadar.afficher();

      if(monProfil.parametre["cleTraceur"].valeur){
        new TraceurJoueur(...).tracer();
        new TraceurAlliance(...).tracer();
      }

      // routing des pages
      let uri = location.pathname, page = null;
      switch(true){
        case uri=="/Reine.php":
          page=new PageReine(boiteCompte); if(!Utils.comptePlus) page.plus(); break;
        // ... etc. inchangé ...
      }
    });
  }
}();
