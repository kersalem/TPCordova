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
    //window.localStorage.clear();
    // On duplique Header et Footer sur chaque page (sauf la première !)
    $('div[data-role="page"]').each(function (i) {
        if (i > 0)
            $(this).html($('#shifumiHeader').html() + $(this).html() + $('#shifumiFooter').html());
    });
    // On afficher la page d'accueil
    $.mobile.changePage("#vueAccueil");

    $("img").each(function() {
        var src = "images/trump.jpg";
        $(this).attr("src", src);
    });
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrôleur par page, qui porte le nom de la page
//  et contient les callbacks des événements associés à cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        // Vider noms et photo trump par defaut
        $("#nomJoueur").val("");
        $("#nomJoueur2").val("");
        $("#cameraImage1").attr("src", "images/trump.jpg");
        $("#cameraImage2").attr("src", "images/trump.jpg");
    },

    chargerPhoto: function(nomJoueur, cameraImage) {
        var joueur = modele.dao.loadJoueur(nomJoueur); // on récupère le joueur
        if(joueur !== null) { // si il existe alors
            joueur = JSON.parse(joueur); // convertit la chaine JSON en objet JS
            $("#" + cameraImage).attr("src", joueur.photo); // on affecte sa photo
        }
    },
    nouvellePartie: function () {

        // on récupère les informations de la vue en cours donc noms joueurs + photos
        var nomJoueur = $("#nomJoueur").val();
        var nomJoueur2 = $("#nomJoueur2").val();

        var photoJoueur = $("#cameraImage1").attr("src");
        var photoJoueur2 =  $("#cameraImage2").attr("src");

        modele.Partie.id = nomJoueur + nomJoueur2;
        modele.Partie.joueur.nom = nomJoueur;
        modele.Partie.joueur2.nom = nomJoueur2;
        modele.Partie.joueur.photo = photoJoueur;
        modele.Partie.joueur2.photo = photoJoueur2;

        // on teste les champs noms et photos et si ok on passe à la partie jeu
        if (nomJoueur === "" || nomJoueur2 === "") {
            alert("Entrez un nom de joueur svp");
        } else if (photoJoueur === "images/img-blanche.jpg" || photoJoueur2 === "images/img-blanche.jpg") {
            alert("capturer une photo svp");
        } else {
            controleur.session.partieEnCours = modele.dao.loadPartie( modele.Partie.joueur,  modele.Partie.joueur2); // charge la partie des 2 joueurs depuis le localstorage

            // Et on passe à une autre vue
            $.mobile.changePage("#vueJeu");

            controleur.vueJeu.init();
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
        // carré blanc grille morpion
        for (var id = 1; id < 10; id ++ ) {
            $("#img" +id).attr('src', function() {
                var src = "images/img-blanche.jpg";
                $(this).attr("src", src);
            });
            $("#button" + id).prop("disabled", false);
        }

        // vider tableaux
        modele.Partie.prototype.init();

        modele.Partie.personneQuiJoue = modele.Partie.joueur.nom;
        // On "propage" le nom du joueur sur toutes les vues
        $('span[data-role="personneQuiJoue"]').each(function () {
            $(this).html(modele.Partie.personneQuiJoue);
        });
    },

    jouer: function (id) {

        var lastPersonne = modele.Partie.personneQuiJoue;
        modele.Partie.resultat = controleur.session.partieEnCours.nouveauCoup(id, modele.Partie.personneQuiJoue);

        // si on a changé de joueur on fait un nvo coup ou si dernier coup avant nul ou victoire
        if (lastPersonne !== modele.Partie.personneQuiJoue || (lastPersonne === modele.Partie.personneQuiJoue && modele.Partie.resultat !== "Partie Continue")) {
            controleur.vueJeu.nouveauCoup(lastPersonne, id);
        }

        if(modele.Partie.resultat === "Partie Continue") {
            // On "propage" le nom du joueur sur toutes les vues
            $('span[data-role="personneQuiJoue"]').each(function () {
                $(this).html(modele.Partie.personneQuiJoue);
            });
        } else {
            setTimeout(function(){
                controleur.vueJeu.finPartie();
            }, 300);
        }
    },

    nouveauCoup: function (joueur, id) {
        // controleur.vueJeu.init();

        // on attribue l'image du joueur là où il a cliqué
        $("#img" +id).attr('src', function() {
            var src = ((modele.Partie.joueur.nom === joueur) ?
               modele.Partie.joueur.photo: modele.Partie.joueur2.photo);
            $(this).attr("src", src);
        });
        $("#button" + id).prop("disabled", true);
    },

    finPartie: function () {
        modele.dao.savePartie(controleur.session.partieEnCours);
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

        controleur.vueJeu.init();

        // Affichage des scores
        $("#message").html(modele.Partie.resultat);
        $("#nbVictoires").html(controleur.session.partieEnCours.nbVictoires);
        $("#nbNuls").html(controleur.session.partieEnCours.nbNuls);
        $("#nbDefaites").html(controleur.session.partieEnCours.nbDefaites);
        $("#nbVictoires2").html(controleur.session.partieEnCours.nbVictoires2);
        $("#nbNuls2").html(controleur.session.partieEnCours.nbNuls2);
        $("#nbDefaites2").html(controleur.session.partieEnCours.nbDefaites2);
        $("#nomJ").html(modele.Partie.joueur.nom);
        $("#nomJ2").html(modele.Partie.joueur2.nom);
        $("#imgGagnant").attr('src', function() {

            if(modele.Partie.resultat.startsWith("Victoire de ")) {

                var chaine = modele.Partie.resultat.split(" ", 3);
                var gagnant = chaine[2];
                var src = ((modele.Partie.joueur.nom === gagnant) ?
                   modele.Partie.joueur.photo:modele.Partie.joueur2.photo);
                $(this).attr("src", src).show();
            } else {
                $(this).attr("src", src).hide();
            }
        });
    },

    retourJeu: function () {
        $.mobile.changePage("#vueJeu");
    },

    retourAccueil: function () {
        $.mobile.changePage("#vueAccueil");
        controleur.vueAccueil.init();
    }
};

// On définit ici la callback exécutée au chargement de la vue Fin
$(document).on("pagebeforeshow", "#vueFin", function () {
    controleur.vueFin.init();
});

controleur.cameraController = {

    takePicture: function (joueur) {
        // Appel méthode du modèle permettant de prendre une photo
        window.modele.takePicture(

            // Appel méthode du modèle permettant de prendre une photo
            function(uneImage) {
                // on récupère un objet Image
                $("#cameraImage" + joueur).attr("src", uneImage.getBase64());
                plugins.toast.showShortCenter("Capture photo réussie!");

            },
            // erreurCB : on affiche un message approprié
            function () {
                plugins.toast.showShortCenter("Impossible de prendre une photo");
            },
            joueur
        );
    }
};
