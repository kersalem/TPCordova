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
        } else { // Tableau 3
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
// On stocke des paires (nomJoeur, partie).
modele.dao = {

    saveJoueur: function(joueur) { // sauvegarde nom et photo joueur au format JSON dans le local storage
        window.localStorage.setItem(joueur.nom, JSON.stringify(joueur));
    },
    savePartie: function(partie) { // sauvegarde la partie au format JSON dans le local storage
        console.log('partie = ', partie);
        window.localStorage.setItem(partie.id, JSON.stringify(partie));
    },

    loadPartie: function(joueur, joueur2) { // charge la partie des 2  joueurs, si elle existe, depuis le local storage
        var partieJoueur = window.localStorage.getItem(joueur.nom);
        console.log('partieJoueur===', partieJoueur);
        var partieJoueur2 = window.localStorage.getItem(joueur2.nom);
        var partie = window.localStorage.getItem(joueur.nom + joueur2.nom);

        if (partieJoueur === null || partieJoueur2 === null) { // s'il n'y a pas de partie au nom de ce joueur, on en crée une nouvelle
            // Défini id pour une partie
            var id = joueur.nom + joueur2.nom;
            return new modele.Partie(id, joueur, joueur2, 0, 0, 0, 0, 0, 0);
        }
        else { // sinon on convertit la partie au format JSON en objet JS de la classe Partie
            partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
            Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
            return partie;
        }
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