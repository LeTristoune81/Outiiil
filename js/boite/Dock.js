/**
* Dock — Outiiil (bouton Update ajouté, Traceur/Carte retirés)
*/

// Icône du bouton "Mise à jour" (image dédiée)
const IMG_UPDATE = "https://cdn.jsdelivr.net/gh/LeTristoune81/Outiiil@main/images/update.png";

// URL d’update du userscript (RAW @updateURL/@downloadURL)
const OUTIIIL_UPDATE_URL = "https://raw.githubusercontent.com/LeTristoune81/Outiiil/main/Outiilv2.user.js";

function o_openUpdate() {
    if (typeof GM_openInTab === "function") GM_openInTab(OUTIIIL_UPDATE_URL, { active: true, insert: true });
    else window.open(OUTIIIL_UPDATE_URL, "_blank");
}

class Dock {
    constructor() {
        // Barre : Ponte, Chasse, Combat, Update, Préférence
        this._html = `<div id="o_toolbarOutiiil" class="${monProfil.parametre["dockPosition"].valeur == "1" ? "o_toolbarBas" : "o_toolbarDroite"}" ${monProfil.parametre["dockVisible"].valeur == 1 ? "" : "style='display:none'"}>
            <div id="o_toolbarItem1" class="o_toolbarItem" title="Ponte">
              <span id="o_itemPonte" style="background-image: url(${IMG_SPRITE_MENU})"></span>
            </div>
            <div id="o_toolbarItem2" class="o_toolbarItem" title="Chasse">
              <span id="o_itemChasse" style="background-image: url(${IMG_SPRITE_MENU})"></span>
            </div>
            <div id="o_toolbarItem3" class="o_toolbarItem" title="Combat">
              <span id="o_itemCombat" style="background-image: url(${IMG_SPRITE_MENU})"></span>
            </div>
            <div id="o_toolbarItem5" class="o_toolbarItem" title="Mettre à jour">
              <span id="o_itemUpdate" style="
                  display:inline-block;width:28px;height:28px;
                  background-image:url(${IMG_UPDATE});
                  background-size:contain;background-position:center;background-repeat:no-repeat;"></span>
            </div>
            <div id="o_toolbarItem6" class="o_toolbarItem" title="Préférence">
              <span id="o_itemParametre" style="background-image: url(${IMG_SPRITE_MENU})"></span>
            </div>
        </div>`;

        // Boîtes actives
        this._boitePonte = new BoitePonte();
        this._boiteChasse = new BoiteChasse();
        this._boiteCombat = new BoiteCombat();
        this._boiteParametre = new BoiteParametre();
    }

    afficher() {
        $("body").append(this._html);

        // Sécurité : retire Traceur/Carte si jamais présents (cache ancien HTML)
        $("#o_toolbarOutiiil")
          .find('.o_toolbarItem[title="Traceur"], .o_toolbarItem[title="Carte"], #o_itemTraceur, #o_itemMap')
          .closest(".o_toolbarItem").remove();

        // Tooltips
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

        // Dock masqué : afficher au survol
        if (monProfil.parametre["dockVisible"].valeur == "0") {
            $(document).mousemove((e) => {
                if (monProfil.parametre["dockPosition"].valeur == "1") {
                    if ($(window).height() - e.pageY < 60) $("#o_toolbarOutiiil").slideDown(500);
                    else $("#o_toolbarOutiiil").slideUp(500);
                } else {
                    if ($(window).width() - e.pageX < 60) $("#o_toolbarOutiiil").show("slide", {direction:"right"}, 500);
                    else $("#o_toolbarOutiiil").hide("slide", {direction:"right"}, 500);
                }
            });
        }

        // Clics
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
