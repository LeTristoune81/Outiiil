/**
 * Dock — Outiiil (Traceur/Carte retirés, bouton Update injecté de façon robuste)
 */

// Icône du bouton "Mise à jour" (ton image dans /images)
const IMG_UPDATE = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/update.png";

// URL RAW de ton userscript 
const OUTIIIL_UPDATE_URL = "https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiilv2.user.js";

function o_openUpdate() {
    if (typeof GM_openInTab === "function") GM_openInTab(OUTIIIL_UPDATE_URL, { active: true, insert: true });
    else window.open(OUTIIIL_UPDATE_URL, "_blank");
}

/**
* Classe pour la gestion des différents outils globals à fourmizzz.
*
* @class Outil
* @constructor
* @extends Boite
*/
class Dock {
    constructor() {
        // Barre : Ponte, Chasse, Combat, (Update injecté après), Préférence
        this._html = `<div id="o_toolbarOutiiil" class="${
            monProfil.parametre["dockPosition"].valeur == "1" ? "o_toolbarBas" : "o_toolbarDroite"
        }" ${monProfil.parametre["dockVisible"].valeur == 1 ? "" : "style='display:none'"}>

            <div id="o_toolbarItem1" class="o_toolbarItem" title="Ponte">
                <span id="o_itemPonte" style="background-image:url(${IMG_SPRITE_MENU})"></span>
            </div>

            <div id="o_toolbarItem2" class="o_toolbarItem" title="Chasse">
                <span id="o_itemChasse" style="background-image:url(${IMG_SPRITE_MENU})"></span>
            </div>

            <div id="o_toolbarItem3" class="o_toolbarItem" title="Combat">
                <span id="o_itemCombat" style="background-image:url(${IMG_SPRITE_MENU})"></span>
            </div>

            <div id="o_toolbarItem6" class="o_toolbarItem" title="Préférence">
                <span id="o_itemParametre" style="background-image:url(${IMG_SPRITE_MENU})"></span>
            </div>
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

        // 1) Retire Traceur/Carte si un ancien HTML subsiste
        const $toolbar = $("#o_toolbarOutiiil");
        $toolbar.find('.o_toolbarItem[title="Traceur"], .o_toolbarItem[title="Carte"], #o_itemTraceur, #o_itemMap')
                .closest(".o_toolbarItem").remove();

        // 2) Injection robuste du bouton "Mettre à jour" (si absent)
        if (!$toolbar.find("#o_itemUpdate").length) {
            const $updateBtn = $(`
                <div id="o_toolbarItem5" class="o_toolbarItem" title="Mettre à jour">
                  <span id="o_itemUpdate"
                        style="display:inline-block;width:28px;height:28px;
                               background-image:url(${IMG_UPDATE});
                               background-size:contain;background-position:center;background-repeat:no-repeat;"></span>
                </div>`);
            // Essaye d’insérer avant "Préférence", sinon ajoute à la fin
            const $pref = $toolbar.find("#o_toolbarItem6");
            if ($pref.length) $pref.before($updateBtn);
            else $toolbar.append($updateBtn);
        }

        // 3) Tooltips
        const tooltipOptsDroite = {
            tooltipClass : "warning-tooltip",
            content : function(){return $(this).prop("title");},
            position : {my : "left+10 center", at : "right center"},
            hide : {effect: "fade", duration: 10}
        };
        const tooltipOptsBas = {
            tooltipClass : "warning-tooltip",
            content : function(){return $(this).prop("title");},
            position : {my : "center top", at : "center bottom+10"},
            hide : {effect: "fade", duration: 10}
        };
        if (monProfil.parametre["dockPosition"].valeur == "1") {
            $(".o_toolbarBas .o_toolbarItem").tooltip(tooltipOptsBas);
        } else {
            $(".o_toolbarDroite .o_toolbarItem").tooltip(tooltipOptsDroite);
        }

        // 4) Dock masqué : afficher au survol
        if (monProfil.parametre["dockVisible"].valeur == "0") {
            $(document).mousemove((e) => {
                if (monProfil.parametre["dockPosition"].valeur == "1") { // boite en bas
                    if ($(window).height() - e.pageY < 60) $toolbar.slideDown(500);
                    else $toolbar.slideUp(500);
                } else { // boite à droite
                    if ($(window).width() - e.pageX < 60) $toolbar.show("slide", {direction:"right"}, 500);
                    else $toolbar.hide("slide", {direction:"right"}, 500);
                }
            });
        }

        // 5) Clics — délégués (couvre les éléments injectés)
        $toolbar.on("click", ".o_toolbarItem", (e) => {
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
