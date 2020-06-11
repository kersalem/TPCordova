var modele = {};

// Le modele contient ici une seule classe : Partie
modele.Partie = function (id, joueur, joueur2, nbV, nbD, nbN, nbV2, nbD2, nbN2) {
    // attributs
    this.id = id;
    this.nomJoueur = joueur.nom;
    this.photoJoueur = joueur.photo;
    this.nbVictoires = nbV;
    this.nbDefaites = nbD;
    this.nbNuls = nbN;
    this.nomJoueur2 = joueur2.nom;
    this.photoJoueur2 = joueur2.photo;
    this.nbVictoires2 = nbV2;
    this.nbDefaites2 = nbD2;
    this.nbNuls2 = nbN2;
};

modele.Partie.morpion = new Array();

// Création objet joueur pour retrouver la photo si joueur enregistré dans localstorage
modele.Partie.joueur = {
    nom: String,
    photo: String
};

modele.Partie.joueur2 = {
    nom: String,
    photo: String
};

// Var globales
modele.Partie.resultat = "";

// Méthodes
modele.Partie.prototype = {

    init: function () {
        // Init de la grille de morpion
        modele.Partie.morpion[0] = new Array(" "," "," ");
        modele.Partie.morpion[1] = new Array(" "," "," ");
        modele.Partie.morpion[2] = new Array(" "," "," ");
    },

    nouveauCoup: function (coupJoueur, personneQuiJoue) { // détermine le résulat d'un nouveau coup et sauvegarde le score
        var victoire = false;
        var coupValid = false; // Empêche de recliquer sur une case déjà prise
        var colonne;

        // Remplir tableaux avec photos et victoire si ligne complétée par un même joueur
        // Tableau 1
        if(coupJoueur <= 3) {
            // Si case A n'est pas vide
            if(modele.Partie.morpion[0][coupJoueur - 1]  === " ") {
                modele.Partie.morpion[0][coupJoueur - 1] = personneQuiJoue;
                coupValid = true;
                colonne = coupJoueur - 1;

                // Tester victoire ligne 1
                if (modele.Partie.morpion[0].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        } else if(coupJoueur <= 6) { // Tableau 2
            if(modele.Partie.morpion[1][coupJoueur - 4]  === " ") {
                modele.Partie.morpion[1][coupJoueur - 4] = personneQuiJoue;
                coupValid = true;
                colonne = coupJoueur - 4;

                // ligne 2 victoire
                if (modele.Partie.morpion[1].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        } else { // remplir tableau 3
            if(modele.Partie.morpion[2][coupJoueur - 7]  === " ") {
                modele.Partie.morpion[2][coupJoueur - 7] = personneQuiJoue;
                coupValid = true;
                colonne = coupJoueur - 7;

                // ligne 3 victoire
                if (modele.Partie.morpion[2].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        }

        // Tester victoire par colonne et diagonale
        if(coupValid) {
            // Tester victoire Colonnes
            if (modele.Partie.morpion[0][colonne] === personneQuiJoue &&
                modele.Partie.morpion[1][colonne] === personneQuiJoue &&
                modele.Partie.morpion[2][colonne] === personneQuiJoue) {
                victoire = true;
            }

            // Diagonales
            if (coupJoueur === 5) {
                if ((modele.Partie.morpion[0][0] === personneQuiJoue &&
                    modele.Partie.morpion[1][1] === personneQuiJoue &&
                    modele.Partie.morpion[2][2] === personneQuiJoue) ||
                    (modele.Partie.morpion[0][2] === personneQuiJoue &&
                        modele.Partie.morpion[1][1] === personneQuiJoue &&
                        modele.Partie.morpion[2][0] === personneQuiJoue)) {
                    victoire = true;
                }
            } else if (coupJoueur === 1 || coupJoueur === 9) {
                if (modele.Partie.morpion[0][0] === personneQuiJoue &&
                    modele.Partie.morpion[1][1] === personneQuiJoue &&
                    modele.Partie.morpion[2][2] === personneQuiJoue) {
                    victoire = true;
                }
            } else if (coupJoueur === 3 || coupJoueur === 7) {
                if (modele.Partie.morpion[0][2] === personneQuiJoue &&
                    modele.Partie.morpion[1][1] === personneQuiJoue &&
                    modele.Partie.morpion[2][0] === personneQuiJoue) {
                    victoire = true;
                }
            }

            if(!victoire) {
                if (modele.Partie.morpion[0].every((current) => current !== " ") &&
                    modele.Partie.morpion[1].every((current) => current !== " ") &&
                    modele.Partie.morpion[2].every((current) => current !== " ")) {
                    this.nbNuls++;
                    this.nbNuls2++;
                    resultat = "Match Nul";
                } else {
                    modele.Partie.personneQuiJoue = (modele.Partie.personneQuiJoue === modele.Partie.joueur.nom)?
                        modele.Partie.joueur2.nom : modele.Partie.joueur.nom;
                    resultat = "Partie Continue";
                }
            } else {
                if (modele.Partie.personneQuiJoue === modele.Partie.joueur.nom) {
                    this.nbVictoires++;
                    this.nbDefaites2++;
                    resultat = "Victoire de " + modele.Partie.joueur.nom;
                } else {
                    this.nbVictoires2++;
                    this.nbDefaites++;
                    resultat = "Victoire de " + modele.Partie.joueur2.nom;
                }
            }
        }
        return resultat;
    },
};

// Objet dao pour gérer la Persistance des parties dans le local storage.
// On stocke des paires (nomJoueur, partie).
modele.dao = {

    savePartie: function(partie) { // sauvegarde la partie au format JSON dans le local storage
        console.log('partie', partie);
        console.log('window.localStorage modele', window.localStorage);
        // sauvegardes des joueurs
        window.localStorage.setItem(partie.nomJoueur, JSON.stringify(modele.Partie.joueur));
        window.localStorage.setItem(partie.nomJoueur2, JSON.stringify(modele.Partie.joueur2));
        // sauvegarde partie
        window.localStorage.setItem(partie.id, JSON.stringify(partie));
    },

    loadPartie: function(joueur, joueur2) { // charge la partie des 2 joueurs, si elle existe, depuis le local storage
        var partieJoueur = window.localStorage.getItem(joueur.nom); // récupération du joueur 1
        console.log('partieJoueur===', modele.Partie.joueur);
        var partieJoueur2 = window.localStorage.getItem(joueur2.nom); // récupération du joueur 2
        console.log('partieJoueur2===', modele.Partie.joueur2);
        var partie;
        var id = joueur.nom + joueur2.nom;  // Défini id pour une partie
        // si joueur 1 ou 2 n'existe pas on crée une nouvelle partie
        if (partieJoueur === null || partieJoueur2 === null) {
            partie = new modele.Partie(id, joueur, joueur2, 0, 0, 0, 0, 0, 0);
        } else { // les 2 joueurs existent
            partie = window.localStorage.getItem(id); // on récup la partie qui a comme id la var id

            console.log('partie===', partie);

            if (partie === null) { // si partie n'existe pas
                var partie2 = window.localStorage.getItem(joueur2.nom + joueur.nom); // on regarde si l'id est inversé
                if (partie2 === null) { // il n'y a pas de partie entre les 2 joueurs
                    partie = new modele.Partie(id, joueur, joueur2, 0, 0, 0, 0, 0, 0); // on crée une nvelle partie
                } else { // la partie existe entre les 2 joueurs avec joueurs inversés
                    partie2 = JSON.parse(partie2); // convertit la chaine JSON en objet JS
                    console.log('partie2===', partie2);
                    // On reprend la partie existante et on inverse les valeurs
                    partie = new modele.Partie(partie2.id, joueur2, joueur, partie2.nbVictoires2, partie2.nbDefaites2, partie2.nbNuls2, partie2.nbVictoires, partie2.nbDefaites, partie2.nbNuls);
                    console.log('partie===', partie);
                    Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
                }
            } else { // Une partie existe entre les 2 joueurs
                partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
                Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
            }
        }

        return partie;
    },

    // Charger photo si joueur existe dans localstorage
    loadJoueur: function(nom) {
        var joueur = null;
        for (var i = 0; i < window.localStorage.length; i++) {
            if (window.localStorage.key(i) === nom) {
                joueur = window.localStorage.getItem(nom);
            }
        }
        return joueur;
    }
};

// classe image
modele.Image = function (id, imageData, joueur) {
    // Attributs
    this.id = id;

    this.photoJoueur = (joueur)? modele.photoJoueur : modele.photoJoueur2;

    // this.imageData = imageData; // l'image Base64
    this.photoJoueur = imageData;

    // Méthode pour obtenir l'image au format Base64 (décompressé) avec en-tête MIME
    this.getBase64 = function () {
        return "data:image/jpeg;base64," + this.photoJoueur;
    },

    // Méthode pour insérer une nouvelle image en BD
    this.insert = function (successCB, errorCB) {
        var self=this; // pour pouvoir accéder à l'objet Image dans le succesCB de la requête insert
        model.db.executeSql("INSERT INTO photos (imagedata) VALUES (?)",[this.photoJoueur],
            function (res) {
                self.id=res.insertId; // on met à jour l'id de l'Image après insertion en BD
                successCB.call(this);
            },
            function (err) {
                errorCB.call(this);
            }
        );
    };
};

// Méthode pour capturer une image avec le téléphone encodée en Base64
modele.takePicture = function (successCB, errorCB, joueur) {
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturée au format Base64, sans en-tête MIME
            // On appelle successCB en lui transmettant une entité Image
            successCB.call(this, new modele.Image(0, imageData, joueur));
        },
        function (err) {
            errorCB.call(this);
        },
        {quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            cameraDirection: navigator.camera.Direction.FRONT }
    );
};