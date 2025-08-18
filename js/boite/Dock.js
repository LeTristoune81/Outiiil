/**
* Classe pour la gestion des différents outils globals à fourmizzz.
*
* @class Outil
* @constructor
* @extends Boite
*/
class Dock
{
    constructor()
    {
        /**
        * HTML de la barre d’outils (sans Traceur et Carte)
        */
        this._html = `<div id="o_toolbarOutiiil" class="${monProfil.parametre["dockPosition"].valeur == "1" ? "o_toolbarBas" : "o_toolbarDroite"}" ${monProfil.parametre["dockVisible"].valeur == 1 ? "" : "style='display:none'"}>
            <div id="o_toolbarItem1" class="o_toolbarItem" title="Ponte"><span id="o_itemPonte" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem2" class="o_toolbarItem" title="Chasse"><span id="o_itemChasse" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem3" class="o_toolbarItem" title="Combat"><span id="o_itemCombat" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            <div id="o_toolbarItem6" class="o_toolbarItem" title="Préférence"><span id="o_itemParametre" style="background-image: url(${IMG_SPRITE_MENU})"/></div>
            </div>`;
        /**
        * Boîtes actives
        */
        this._boitePonte = new BoitePonte();
        this._boiteChasse = new BoiteChasse();
        this._boiteCombat = new BoiteCombat();
        this._boiteParametre = new BoiteParametre();
    }

	/**
    * Affiche la boite.
    *
    * @private
    * @method afficher
    */
	afficher()
	{
        $("body").append(this._html);
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

        if(monProfil.parametre["dockVisible"].valeur == "0"){
            $(document).mousemove((e) => {
                if(monProfil.parametre["dockPosition"].valeur == "1"){ // boite en bas
                    if($(window).height() - e.pageY < 60)
                        $("#o_toolbarOutiiil").slideDown(500);
                    else
                        $("#o_toolbarOutiiil").slideUp(500);
                }else{ // boite à droite
                    if($(window).width() - e.pageX < 60)
                        $("#o_toolbarOutiiil").show("slide", {direction : "right"}, 500);
                    else
                        $("#o_toolbarOutiiil").hide("slide", {direction : "right"}, 500);
                }
            });
        }

        // clic sur un item de la boîte
        $(".o_toolbarItem").click((e) => {
            switch($(e.currentTarget).find("span").attr("id")){
                case "o_itemPonte" :
                    this._boitePonte.afficher();
                    break;
                case "o_itemChasse" :
                    this._boiteChasse.afficher();
                    break;
                case "o_itemCombat" :
                    this._boiteCombat.afficher();
                    break;
                case "o_itemParametre" :
                    this._boiteParametre.afficher();
                    break;
                default :
                    break;
            }
        });
	}
}
