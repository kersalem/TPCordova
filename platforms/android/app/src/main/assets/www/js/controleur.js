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

    $("img").each(function() {
        var src = "images/img-blanche.jpg";
        $(this).attr("src", src);
    });
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrôleur par page, qui porte le nom de la page
//  et contient les callbacks des événements associés à cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        $("#nomJoueur").val("");
        $("#nomJoueur2").val("");
    },

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur = $("#nomJoueur").val();
        var nomJoueur2 = $("#nomJoueur2").val();

        var photoJoueur = $("#cameraImage").attr("src");
        var photoJoueur2 =  $("#cameraImage2").attr("src");

        modele.Partie.nomJoueur = nomJoueur;
        modele.Partie.nomJoueur2 = nomJoueur2;
        modele.Partie.photoJoueur = photoJoueur;
        modele.Partie.photoJoueur2 = photoJoueur2;

        if (nomJoueur === "") {
            alert("Entrez un nom de joueur svp");
        } else {
          /*  modele.dao.savePhoto(controleur.session.photo);
            controleur.session.partieEnCours = modele.dao.insert(photo);*/

            // On utilise le modèle pour créer une nouvelle partie
            // controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur); // charge la partie du joueur depuis le localstorage
            // On "propage" le nom du joueur sur toutes les vues
            $('span[data-role="nomJoueur"]').each(function () {
                $(this).html(nomJoueur);
            });
            $('span[data-role="nomJoueur2"]').each(function () {
                $(this).html(nomJoueur2);
            });

            /*$("img").each(function() {
                $(this).css("background-color: white, width: 150px; height: 150px;");
            });*/


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
        $("button[id^=joueur2]").prop('disabled', false).show();
        // on cache toutes les réponses de la machine
        $("img[id^=machine]").hide();
        // on cache la div resultat
        $("#resultat").hide();
    },

    jouer: function (id) {

        var personneQuiJoue = modele.Partie.nomJoueur;
        controleur.vueJeu.nouveauCoup(personneQuiJoue, id);
        // on interroge le modèle pour voir le résultat du nouveau coup
        // var resultat = controleur.session.partieEnCours.nouveauCoup(coupJoueur);
        // le score a changé => on sauvegarde la partie en cours
       //  modele.dao.savePartie(controleur.session.partieEnCours);
        // on désactive le bouton cliqué par le joueur et on cache les autres boutons
/*        switch (coupJoueur) {
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
        }*/
        // on affiche le coup joué par la machine
        /*switch (resultat.mainMachine) {
            case modele.Partie.CISEAU :
                $("#machineCiseau").show();
                break;
            case modele.Partie.FEUILLE :
                $("#machineFeuille").show();
                break;
            case modele.Partie.PIERRE :
                $("#machinePierre").show();
        }*/
        // on affiche le résultat
        // var couleur = resultat.message === "Victoire" ? "green" : (resultat.message === "Défaite" ? "red" : "orange");
       // $("#texteResultat").html(resultat.message).css("color", couleur);
        // $("#resultat").show();
    },

    nouveauCoup: function (joueur, id) {
        // controleur.vueJeu.init();
        $(id).attr('src', function() {
            console.log('(modele.Partie.nomJoueur === joueur', modele.Partie.nomJoueur === joueur);

            var src = ((modele.Partie.nomJoueur === joueur) ?
                modele.Partie.photoJoueur :  modele.Partie.photoJoueur2);
            $(this).attr("src", src);
            console.log('joueur', joueur);
            console.log('src', src);
        })

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

controleur.cameraController= {
    takePicture2: function () {
        // Appel méthode du modèle permettant de prendre une photo
        console.log('je rentre ici 1')
        window.modele.takePicture2(

            // Appel méthode du modèle permettant de prendre une photo
            function(uneImage2) {
                console.log('je rentre ici 2')
                // on récupère un objet Image
                $("#cameraImage2").attr("src", uneImage2.getBase64());
            },
            // erreurCB : on affiche un message approprié
            function () {
                console.log('je rentre ici 7');

                plugins.toast.showShortCenter("Impossible de prendre une photo");
            }
        );
    },

    takePicture: function () {
        // Appel méthode du modèle permettant de prendre une photo
        console.log('je rentre ici 1')
        window.modele.takePicture(

            // Appel méthode du modèle permettant de prendre une photo
            function(uneImage) {
                console.log('je rentre ici 2')
                // on récupère un objet Image
                $("#cameraImage").attr("src", uneImage.getBase64());
            },
            // erreurCB : on affiche un message approprié
            function () {
                console.log('je rentre ici 7');

                plugins.toast.showShortCenter("Impossible de prendre une photo");
            }
        );
    }
};

/// Controlleur camera


// Pour réinitialiser le champ cameraImage à l'affichage de la page camera
$(document).on("pagebeforeshow", "#camera",
    function () {
        $("#cameraImage").attr("src", "");
    }
);

$(document).on("pagebeforeshow", "#camera",
    function () {
        $("#cameraImage2").attr("src", "");
    }
);