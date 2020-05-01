////////////////////////////////////////////////////////////////////////////////
// On définit un objet controleur qui va contenir les controleurs de nos pages
////////////////////////////////////////////////////////////////////////////////

var controleur = {};

////////////////////////////////////////////////////////////////////////////////
// Session : variables qui représentent l'état de l'application
////////////////////////////////////////////////////////////////////////////////

controleur.session = {
    partieEnCours: null, // La partie en train d'être jouée
};

////////////////////////////////////////////////////////////////////////////////
// initialise : exécuté au démarrage de l'application (voir fichier index.js)
////////////////////////////////////////////////////////////////////////////////

controleur.init = function () {
    // On duplique Header et Footer sur chaque page (sauf la première !)
    $('div[data-role="page"]').each(function (i) {
        if (i > 0)
            $(this).html($('#shifumiHeader').html() + $(this).html() + $('#shifumiFooter').html());
    });
    // On afficher la page d'accueil
    $.mobile.changePage("#vueAccueil");
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrôleur par page, qui porte le nom de la page
//  et contient les callbacks des événements associés à cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        $("#nomJoueur").val("");
    },

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur = $("#nomJoueur").val();
        if (nomJoueur === "") {
            alert("Entrez un nom de joueur svp");
        } else {
            // On utilise le modèle pour créer une nouvelle partie
            controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur); // charge la partie du joueur depuis le localstorage
            // On "propage" le nom du joueur sur toutes les vues
            $('span[data-role="nomJoueur"]').each(function () {
                $(this).html(nomJoueur);
            });
            // Et on passe à une autre vue
            $.mobile.changePage("#vueJeu");
        }
    }
};
// On définit ici la callback exécutée au chargement de la vue Accueil
$(document).on("pagebeforeshow", "#vueAccueil", function () {
    controleur.vueAccueil.init();
});

////////////////////////////////////////////////////////////////////////////////
controleur.vueJeu = {

    init: function () {
        // on active et on montre tous les boutons du joueur
        $("button[id^=joueur]").prop('disabled', false).show();
        // on cache toutes les réponses de la machine
        $("img[id^=machine]").hide();
        // on cache la div resultat
        $("#resultat").hide();
    },

    jouer: function (coupJoueur) {
        // on interroge le modèle pour voir le résultat du nouveau coup
        var resultat = controleur.session.partieEnCours.nouveauCoup(coupJoueur);
        // le score a changé => on sauvegarde la partie en cours
        modele.dao.savePartie(controleur.session.partieEnCours);
        // on désactive le bouton cliqué par le joueur et on cache les autres boutons
        switch (coupJoueur) {
            case modele.Partie.CISEAU :
                $("#joueurCiseau").prop('disabled', true);
                $("#joueurFeuille").hide();
                $("#joueurPierre").hide();
                break;
            case modele.Partie.FEUILLE :
                $("#joueurFeuille").prop('disabled', true);
                $("#joueurCiseau").hide();
                $("#joueurPierre").hide();
                break;
            case modele.Partie.PIERRE :
                $("#joueurPierre").prop('disabled', true);
                $("#joueurCiseau").hide();
                $("#joueurFeuille").hide();
        }
        // on affiche le coup joué par la machine
        switch (resultat.mainMachine) {
            case modele.Partie.CISEAU :
                $("#machineCiseau").show();
                break;
            case modele.Partie.FEUILLE :
                $("#machineFeuille").show();
                break;
            case modele.Partie.PIERRE :
                $("#machinePierre").show();
        }
        // on affiche le résultat
        var couleur = resultat.message === "Victoire" ? "green" : (resultat.message === "Défaite" ? "red" : "orange");
        $("#texteResultat").html(resultat.message).css("color", couleur);
        $("#resultat").show();
    },

    nouveauCoup: function () {
        controleur.vueJeu.init();
    },

    finPartie: function () {
        $.mobile.changePage("#vueFin");
    }
};

// On définit ici la callback exécutée au chargement de la vue Jeu
$(document).on("pagebeforeshow", "#vueJeu", function () {
    controleur.vueJeu.init();
});

////////////////////////////////////////////////////////////////////////////////
controleur.vueFin = {
    init: function () {
        $("#nbVictoires").html(controleur.session.partieEnCours.nbVictoires);
        $("#nbNuls").html(controleur.session.partieEnCours.nbNuls);
        $("#nbDefaites").html(controleur.session.partieEnCours.nbDefaites);
    },

    retourJeu: function () {
        $.mobile.changePage("#vueJeu");
    },

    retourAccueil: function () {
        $.mobile.changePage("#vueAccueil");
    }
};

// On définit ici la callback exécutée au chargement de la vue Fin
$(document).on("pagebeforeshow", "#vueFin", function () {
    controleur.vueFin.init();
});

/// Controlleur camera
controleur.cameraController= {
    takePicture: function () {

        modele.takePicture(

            function(uneImage) {

                $("#cameraImage").attr("src", uneImage.getBase64().show);
                uneImage.insert(
                    function () { plugins.toast.showShortCenter("Image enregistrée");},
                    function () { plugins.toast.showShortCenter("Image non enregistrée");}
                 );
            },

            function () { plugins.toast.showShortCenter("Impossible de prendre une photo"); }
        );
    }
};

$(document).on("pagebeforeshow", "#camera",
    function () {
        $("#cameraImage").attr("src", "").hide();
    }
);