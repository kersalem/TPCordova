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
    // window.localStorage.clear();
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
        $("#cameraImage1").attr("src", "");
        $("#cameraImage2").attr("src", "");
    },

    chargerPhoto: function(nomJoueur, cameraImage) {
        if(modele.Partie.joueur.nom === nomJoueur) {
            $("#" + cameraImage).attr("src", modele.Partie.joueur.photo);
        } else if(modele.Partie.joueur2.nom === nomJoueur) {
            $("#" + cameraImage).attr("src", modele.Partie.joueur2.photo);
        }
    },

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur = $("#nomJoueur").val();
        var nomJoueur2 = $("#nomJoueur2").val();

        var photoJoueur = $("#cameraImage1").attr("src");
        var photoJoueur2 =  $("#cameraImage2").attr("src");

        modele.Partie.id = nomJoueur + nomJoueur2;
        modele.Partie.joueur.nom = nomJoueur;
        modele.Partie.joueur2.nom = nomJoueur2;
        modele.Partie.joueur.photo = photoJoueur;
        modele.Partie.joueur2.photo = photoJoueur2;

        if (nomJoueur === "") {
            alert("Entrez un nom de joueur svp");
        } else {

            controleur.session.partieEnCours = modele.dao.loadPartie( modele.Partie.joueur,  modele.Partie.joueur2); // charge la partie du joueur depuis le localstorage

            /*  modele.dao.savePhoto(controleur.session.photo);
              controleur.session.partieEnCours = modele.dao.insert(photo);*/

            // On utilise le modèle pour créer une nouvelle partie

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
        // on active et on montre tous les boutons du joueur
        // $("button[id^=joueur]").prop('disabled', false).show();
        // $("button[id^=joueur2]").prop('disabled', false).show();
        // on cache toutes les réponses de la machine
        // $("img[id^=machine]").hide();
        for (var id = 1; id < 10; id ++ ) {
            $("#img" +id).attr('src', function() {
                var src = "images/img-blanche.jpg";
                $(this).attr("src", src);
            });
            $("#button" + id).prop("disabled", false);
        }

        modele.Partie.prototype.init();

        modele.Partie.personneQuiJoue = modele.Partie.joueur.nom;
        // controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur); // charge la partie du joueur depuis le localstorage
        // On "propage" le nom du joueur sur toutes les vues
        $('span[data-role="personneQuiJoue"]').each(function () {
            $(this).html(modele.Partie.personneQuiJoue);
        });
    },

    jouer: function (id) {
        console.log('id', id);

        var lastPersonne = modele.Partie.personneQuiJoue;
        modele.Partie.resultat = controleur.session.partieEnCours.nouveauCoup(id, modele.Partie.personneQuiJoue);

        if (lastPersonne !== modele.Partie.personneQuiJoue || (lastPersonne === modele.Partie.personneQuiJoue && modele.Partie.resultat !== "Partie Continue")) {
            controleur.vueJeu.nouveauCoup(lastPersonne, id);
        }

        console.log('resultat' + modele.Partie.resultat);

        if(modele.Partie.resultat === "Partie Continue") {
            // controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur); // charge la partie du joueur depuis le localstorage
            // On "propage" le nom du joueur sur toutes les vues
            $('span[data-role="personneQuiJoue"]').each(function () {
                $(this).html(modele.Partie.personneQuiJoue);
            });
        } else {
            // modele.dao.savePartie(controleur.session.partieEnCours);
            console.log('je rentre ici');
            setTimeout(function(){
                controleur.vueJeu.finPartie();
            }, 1000);
            // controleur.vueJeu.finPartie(); // timeout
        }
    },

    nouveauCoup: function (joueur, id) {
        // controleur.vueJeu.init();
        $("#img" +id).attr('src', function() {
            console.log('joueur', joueur);
            console.log('modele.Partie.nomJoueur', modele.Partie.joueur.nom);
            var src = ((modele.Partie.joueur.nom === joueur) ?
               modele.Partie.joueur.photo: modele.Partie.joueur2.photo);
            $(this).attr("src", src);
        });
        $("#button" + id).prop("disabled", true);
    },

    finPartie: function () {
        console.log('partieEnCours=', controleur.session.partieEnCours);
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
                $(this).attr("src", src);
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

controleur.cameraController= {

    takePicture: function (joueur) {
        // Appel méthode du modèle permettant de prendre une photo
        window.modele.takePicture(

            // Appel méthode du modèle permettant de prendre une photo
            function(uneImage) {
                console.log('je rentre ici Controlleur ' + joueur);
                // on récupère un objet Image
                $("#cameraImage" + joueur).attr("src", uneImage.getBase64());
            },
            // erreurCB : on affiche un message approprié
            function () {
                plugins.toast.showShortCenter("Impossible de prendre une photo");
            },
            joueur
        );
    }
};
