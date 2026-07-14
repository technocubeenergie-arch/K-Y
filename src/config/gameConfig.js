/*
 * gameConfig.js
 * ------------------------------------------------------------
 * Role: TOUS les réglages du jeu, au même endroit.
 *
 * Pourquoi un fichier à part ? Comme ça, pour changer la vitesse
 * du jeu, la couleur de la balle, ou la musique, on n'a besoin
 * de fouiller que dans CE fichier. Aucun autre fichier ne doit
 * contenir de nombre "magique" écrit en dur : ils viennent tous
 * d'ici.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  TH.Config = {
    // Taille de la zone de jeu (le "canvas")
    canvas: {
      width: 400,
      height: 700,
    },

    // Musique : tempo (BPM = battements par minute) du niveau d'entraînement.
    // C'est LA valeur qui commande le rythme de tout le jeu.
    music: {
      bpm: 100,
      // Une tuile arrive toutes les `hopBeats` battements de musique.
      hopBeats: 2,
      // Durée visée du niveau d'entraînement, en secondes (~1 minute).
      targetDurationSeconds: 60,
    },

    // Ligne d'impact : hauteur (en pixels depuis le haut) à laquelle
    // la balle doit atterrir sur une tuile.
    hitLine: {
      y: 560,
    },

    // La balle
    ball: {
      radius: 18,
      color: '#ffffff',
      // Vitesse de déplacement latéral au clavier (px / seconde).
      keyboardSpeed: 260,
    },

    // Les tuiles
    tile: {
      width: 120,
      height: 22,
      color: '#22d3ee',
      hitColor: '#4ade80',
      missColor: '#f87171',
    },

    // Distance verticale (en pixels du monde) entre deux tuiles.
    // Choisie pour que l'espacement "colle" au tempo (voir levelSequencer.js).
    tileSpacing: 150,

    storage: {
      // Clé utilisée dans le stockage local (voir localStore.js)
      highscoreKey: 'tilesHop.trainingLevel.highscore',
    },
  };
})(window.TH = window.TH || {});
