var modele = {};

// Le modele contient ici une seule classe : Partie
modele.Partie = function (nomJoueur) {
    // atributs
    this.nomJoueur = nomJoueur;
    this.nbVictoires = 0;
    this.nbDefaites = 0;
    this.nbNuls = 0;
}

// constantes de classe
modele.Partie.CISEAU = 0;
modele.Partie.FEUILLE = 1;
modele.Partie.PIERRE = 2;

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
