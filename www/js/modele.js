var modele = {};

// Le modele contient ici une seule classe : Partie
modele.Partie = function (nomJoueur, nomJoueur2, photoJoueur, photoJoueur2) {
    // atributs
    this.nomJoueur = nomJoueur;
    this.nomJoueur2 = nomJoueur2;
    this.photoJoueur = photoJoueur;
    this.photoJoueur2 = photoJoueur2;
    this.nbVictoires = 0;
    this.nbDefaites = 0;
    this.nbNuls = 0;
}

// constantes de classe
modele.Partie.CISEAU = 0;
modele.Partie.FEUILLE = 1;
modele.Partie.PIERRE = 2;

/*modele.Partie.case1 = 0;
modele.Partie.case2 = 1;
modele.Partie.case3 = 2;
modele.Partie.case4 = 3;
modele.Partie.case5 = 4;
modele.Partie.case6 = 5;
modele.Partie.case7 = 6;
modele.Partie.case8 = 7;
modele.Partie.case9 = 8;*/

// Méthodes
modele.Partie.prototype = {
    nouveauCoup: function (coupJoueur) { // détermine le résulat d'un nouveau coup et sauvegarde le score
        var mainMachine = Math.floor(Math.random() * 3);
        var resultat;
        if (mainMachine === coupJoueur) {
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
        }
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
modele.Image = function (id, imageData) {
// Attributs
    this.id = id;
    // this.imageData = imageData; // l'image Base64
    modele.photoJoueur = imageData;

    // Méthode pour obtenir l'image au format Base64 (décompressé) avec en-tête MIME
    this.getBase64 = function () {
        return "data:image/jpeg;base64," + modele.photoJoueur;
    },

        // Méthode pour insérer une nouvelle image en BD
        this.insert = function (successCB, errorCB) {
            var self=this; // pour pouvoir accéder à l'objet Image dans le succesCB de la requête insert
            model.db.executeSql("INSERT INTO photos (imagedata) VALUES (?)",[modele.photoJoueur],
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

modele.Image2 = function (id, imageData) {
// Attributs
    this.id = id;
    // this.imageData = imageData; // l'image Base64
    modele.photoJoueur2 = imageData;
    // Méthode pour obtenir l'image au format Base64 (décompressé) avec en-tête MIME
    this.getBase64 = function () {
        return "data:image2/jpeg;base64," + modele.photoJoueur2;
    },

        // Méthode pour insérer une nouvelle image en BD
        this.insert = function (successCB, errorCB) {
            var self=this; // pour pouvoir accéder à l'objet Image dans le succesCB de la requête insert
            model.db.executeSql("INSERT INTO photos (imagedata) VALUES (?)",[modele.photoJoueur2],
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
modele.takePicture = function (successCB, errorCB) {
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturée au format Base64, sans en-tête MIME
            // On appelle successCB en lui transmettant une entité Image
            successCB.call(this, new modele.Image(0,imageData));
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

modele.takePicture2 = function (successCB, errorCB) {
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturée au format Base64, sans en-tête MIME
            // On appelle successCB en lui transmettant une entité Image
            successCB.call(this, new modele.Image2(0,imageData));
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

$('#cameraImage').on({

})