/**
* Classe pour la gestion des différents outils globals à fourmizzz.
*
* @class Outil
* @constructor
* @extends Boite
*/

// Icône du bouton "Mise à jour" (mets ton image dans images/update.png)
const IMG_UPDATE = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/update.png";

// URL d’update du userscript (ton @updateURL / @downloadURL)
const OUTIIIL_UPDATE_URL = "https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiil%20v2-2.2.1.user.js";

// Ouvre l’URL d’update dans un nouvel onglet (Tampermonkey détectera la mise à jour)
function o_openUpdate() {
    if (typeof GM_openInTab === "function") GM_openInTab(OUTIIIL_UPDATE_URL, { active: true, insert: true });
    else window.open(OUTIIIL_UPDATE_URL, "_blank");
}

class Dock {
    constructor() {
        // HTML de la barre (sans Traceur ni Carte, + bouton “Mettre à jour”)
        this._html = `<div id="o_toolbarOutiiil" class="${monProfil.parametre["dockPosition"].valeur == "1" ? "o_toolbarBas" : "o_toolbarDroite"}" ${monProfil.parametre["dockVisible"].valeur == 1 ? "" : "style='display:none'"}>
            <div id="o_toolbarItem1" class="o_toolbarItem" title="Ponte"><span id="o_itemPonte" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem2" class="o_toolbarItem" title="Chasse"><span id="o_itemChasse" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem3" class="o_toolbarItem" title="Combat"><span id="o_itemCombat" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem5" class="o_toolbarItem" title="Mettre à jour">
                <span id="o_itemUpdate" style="background-image: url(${IMG_UPDATE}); background-size: contain; background-position: center; background-repeat: no-repeat;"/>
            </div>
            <div id="o_toolbarItem6" class="o_toolbarItem" title="Préférence"><span id="o_itemParametre" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
        </div>`;

        // Boîtes actives uniquement
        this._boitePonte = new BoitePonte();
        this._boiteChasse = new BoiteChasse();
        this._boiteCombat = new BoiteCombat();
        this._boiteParametre = new BoiteParametre();
    }

    /**
    * Affiche la boite.
    */
    afficher() {
        $("body").append(this._html);

        // Sécurité : retirer “Traceur” & “Carte” même si un ancien HTML subsiste
        $("#o_toolbarOutiiil")
          .find('.o_toolbarItem[title="Traceur"], .o_toolbarItem[title="Carte"], #o_itemTraceur, #o_itemMap')
          .closest(".o_toolbarItem")
          .remove();

        $(".o_toolbarDroite .o_toolbarItem").tooltip({
            tooltipClass : "warning-tooltip",
            content : function(){return $(this).prop("title");},
            position : {my : "left+10 center", at : "right center"},
            hide : {effect: "fade", duration: 10}
        });
        $(".o_toolbarBas .o_toolbarItem").tooltip({
            tooltipClass : "warning-tooltip",
            content : function(){return $(this).prop("title");},
            position : {my : "center top", at : "center bottom+10"},
            hide : {effect: "fade", duration: 10}
        });

        // Affichage au survol si dock masqué
        if (monProfil.parametre["dockVisible"].valeur == "0") {
            $(document).mousemove((e) => {
                if (monProfil.parametre["dockPosition"].valeur == "1") { // boite en bas
                    if ($(window).height() - e.pageY < 60)
                        $("#o_toolbarOutiiil").slideDown(500);
                    else
                        $("#o_toolbarOutiiil").slideUp(500);
                } else { // boite à droite
                    if ($(window).width() - e.pageX < 60)
                        $("#o_toolbarOutiiil").show("slide", {direction : "right"}, 500);
                    else
                        $("#o_toolbarOutiiil").hide("slide", {direction : "right"}, 500);
                }
            });
        }

        // Clic sur un item
        $(".o_toolbarItem").click((e) => {
            switch($(e.currentTarget).find("span").attr("id")){
                case "o_itemPonte":      this._boitePonte.afficher(); break;
                case "o_itemChasse":     this._boiteChasse.afficher(); break;
                case "o_itemCombat":     this._boiteCombat.afficher(); break;
                case "o_itemUpdate":     o_openUpdate(); break;
                case "o_itemParametre":  this._boiteParametre.afficher(); break;
                default: break;
            }
        });
    }
}
