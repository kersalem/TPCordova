var modele = {};

// Le modele contient ici une seule classe : Partie
modele.Partie = function (nomJoueur, victoire, defaite, nul) {
    // atributs
    this.nomJoueur = nomJoueur;
    if (victoire === 0 && defaite === 0 && nul === 0) {
        this.nbVictoires = 0;
        this.nbDefaites = 0;
        this.nbNuls = 0;
    } else {
        (victoire === 1)? this.nbVictoires = this.nbVictoires++ : null;
        (defaite === 1)? this.nbDefaites = this.nbDefaites++ : null;
        (nul === 1)? this.nbNuls = this.nbNuls++ : null;
    }
};

modele.Partie.morpion = new Array();

// Méthodes
modele.Partie.prototype = {

    init: function () {
        modele.Partie.morpion[0] = new Array(" "," "," ");
        modele.Partie.morpion[1] = new Array(" "," "," ");
        modele.Partie.morpion[2] = new Array(" "," "," ");
    },

    nouveauCoup: function (coupJoueur, personneQuiJoue) { // détermine le résulat d'un nouveau coup et sauvegarde le score
        // var mainMachine = Math.floor(Math.random() * 3);
        // var resultat;
        var victoire = false;
        var coupValid = false;

        // Remplir tableaux
        if(coupJoueur <= 3) {
            // Si case A n'est pas vide
            if(modele.Partie.morpion[0][coupJoueur - 1]  === " ") {
                modele.Partie.morpion[0][coupJoueur - 1] = personneQuiJoue;
                coupValid = true;

                // ligne

                if (modele.Partie.morpion[0].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        } else if(coupJoueur <= 6) {
            if(modele.Partie.morpion[1][coupJoueur - 4]  === " ") {
                modele.Partie.morpion[1][coupJoueur - 4] = personneQuiJoue;
                coupValid = true;
                // ligne

                if (modele.Partie.morpion[1].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        } else {
            console.log('-7', modele.Partie.morpion[0][coupJoueur - 7])
            if(modele.Partie.morpion[2][coupJoueur - 7]  === " ") {
                modele.Partie.morpion[2][coupJoueur - 7] = personneQuiJoue;
                coupValid = true;

                // ligne
                if (modele.Partie.morpion[2].every((current) => current === personneQuiJoue)) {
                    victoire = true;
                }
            }
        }

        // colonnes et diago
        if(coupValid) {
            // Colonne
            /*console.log('-1', modele.Partie.morpion[0][coupJoueur - 1])
            console.log('-4', modele.Partie.morpion[0][coupJoueur - 4])
            console.log('-7', modele.Partie.morpion[0][coupJoueur - 7])
            if (modele.Partie.morpion[0][coupJoueur - 1] === personneQuiJoue &&
                modele.Partie.morpion[1][coupJoueur - 4] === personneQuiJoue &&
                modele.Partie.morpion[2][coupJoueur - 7] === personneQuiJoue) {
                victoire = true;
                console;log('je rentre ici victoire par colonne premeir test')
            }*/

            // première colonne
            if (modele.Partie.morpion[0][0] === personneQuiJoue &&
                modele.Partie.morpion[1][0] === personneQuiJoue &&
                modele.Partie.morpion[2][0] === personneQuiJoue) {
                console.log('colonne une')
                victoire = true;
            }
            // Seconde colonne
            if (modele.Partie.morpion[0][1] === personneQuiJoue &&
                modele.Partie.morpion[1][1] === personneQuiJoue &&
                modele.Partie.morpion[2][1] === personneQuiJoue) {
                console.log('colonne 2')
                victoire = true;
            }
            // Troisieme colonne
            if (modele.Partie.morpion[0][2] === personneQuiJoue &&
                modele.Partie.morpion[1][2] === personneQuiJoue &&
                modele.Partie.morpion[2][2] === personneQuiJoue) {
                console.log('colonne 3')
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
                    modele.Partie(modele.Partie.nomJoueur, 0, 0, 1);
                    modele.Partie(modele.Partie.nomJoueur2, 0, 0, 1);
                    resultat = "Match Nul";
                } else {
                    modele.Partie.personneQuiJoue = ( modele.Partie.personneQuiJoue === modele.Partie.nomJoueur)?
                        modele.Partie.nomJoueur2 : modele.Partie.nomJoueur;
                    resultat = "Partie Continue";
                }
            } else {
                if (modele.Partie.personneQuiJoue === modele.Partie.nomJoueur) {
                    modele.Partie(modele.Partie.nomJoueur, 1);
                    modele.Partie(modele.Partie.nomJoueur2, 0, 1);
                    resultat = "Victoire de " + modele.Partie.nomJoueur;
                } else {
                    modele.Partie(modele.Partie.nomJoueur, 0, 1);
                    modele.Partie(modele.Partie.nomJoueur2, 1);
                    resultat = "Victoire de " + modele.Partie.nomJoueur2;
                }
                resultat = "Victoire de " + modele.Partie.nomJoueur;
            }
        }

        /*if (coupJoueur === 1 || coupJoueur === 5 || coupJoueur === 9) {
                if (modele.Partie.morpion[0][0] === personneQuiJoue &&
                    modele.Partie.morpion[1][1] === personneQuiJoue &&
                    modele.Partie.morpion[2][2] === personneQuiJoue) {
                    victoire = true;
                }
            }
            if (coupJoueur === 3 || coupJoueur === 5 || coupJoueur === 7) {
                if (modele.Partie.morpion[0][2] === personneQuiJoue &&
                    modele.Partie.morpion[1][1] === personneQuiJoue &&
                    modele.Partie.morpion[2][0] === personneQuiJoue) {
                    victoire = true;
                }
            }*/

/*        if (mainMachine === coupJoueur) {
            this.nbNuls++;
            resultat = {mainMachine: mainMachine, message: "Match Nul"};
        } else if ((coupJoueur === modele.Partie.CISEAU && mainMachine === modele.Partie.FEUILLE) ||
            (coupJoueur === modele.Partie.FEUILLE && mainMachine === modele.Partie.PIERRE) ||
            (coupJoueur === modele.Partie.PIERRE && mainMachine === modele.Partie.CISEAU)) {
            this.nbVictoires++;
            resultat = {mainMachine: mainMachine, message: "Victoire"};
        } else {
            this.nbDefaites++;
            resultat = {mainMachine: mainMachine, message: "Défaite"};
        }*/
        console.log('victoire', victoire);
        return resultat;
    },
};

// Objet dao pour gérer la Persistance des parties dans le local storage.
// On stocke des paires (nomJoeur, partie).
modele.dao = {

    savePartie: function(partie) { // sauvegarde la partie au format JSON dans le local storage
        window.localStorage.setItem(partie.nomJoueur, JSON.stringify(partie));
    },

    loadPartie: function(nomJoueur) { // charge la partie d'un joueur, si elle existe, depuis le local storage
        var partie = window.localStorage.getItem(nomJoueur);
        if (partie === null) { // s'il n'y a pas de partie au nom de ce joueur, on en crée une nouvelle
            return new modele.Partie(nomJoueur,0,0,0);
        }
        else { // sinon on convertit la partie au format JSON en objet JS de la classe Partie
            partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
            Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
            return partie;
        }
    }
}

//////// classe image
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
                console.log("Erreur Insertion : " + err.message);
                errorCB.call(this);
            }
        );
    };
};


///////  Méthode pour capturer une image avec le téléphone encodée en Base64
modele.takePicture = function (successCB, errorCB, joueur) {
    console.log('je rentre ici modele ' + joueur);
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturée au format Base64, sans en-tête MIME
            // On appelle successCB en lui transmettant une entité Image
            successCB.call(this, new modele.Image(0, imageData, joueur));
        },
        function (err) {
            console.log("Erreur Capture image : " + err.message);
            errorCB.call(this);
        },
        {quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            cameraDirection: navigator.camera.Direction.FRONT }
        // qualité encodage 50%, format base64 (et JPEG par défaut)
    );
};