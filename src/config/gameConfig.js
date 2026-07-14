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
      keyboardSpeed: 170,
    },

    // Les tuiles
    tile: {
      width: 120,
      height: 22,
      color: '#22d3ee',
      hitColor: '#4ade80',
      missColor: '#f87171',
      // Couleur d'une tuile touchée pile au centre (voir "étoiles" plus bas).
      perfectColor: '#facc15',

      // Une tuile est considérée "touchée" si la balle est à moins de
      // (hitZoneRatio × demi-largeur de la tuile) du centre. Ratio de 1 =
      // toute la tuile compte : on ne rate QUE si on atterrit carrément à
      // côté (voir docs/BUGS.md, BUG-006 — une valeur plus petite créait
      // une bande invisible sur la tuile où on perdait sans comprendre
      // pourquoi, ce qui est une mauvaise expérience de jeu).
      hitZoneRatio: 1,
      // Une tuile touchée est en plus "parfaite" (zone jaune) si la balle
      // est à moins de (perfectZoneRatio × demi-largeur de la tuile) du
      // centre. 0,25 × 60px = 15px de tolérance de chaque côté (zone
      // volontairement étroite : c'est le bonus qui doit être difficile
      // à obtenir, pas la survie).
      perfectZoneRatio: 0.25,

      // Dessine, directement sur chaque tuile pas encore atteinte, la
      // zone jaune ci-dessus — pour voir à l'avance où viser le bonus
      // étoile. Le reste de la tuile (en bleu) est déjà sûr par défaut,
      // inutile de le souligner en plus.
      perfectZonePreviewColor: 'rgba(250, 204, 21, 0.6)',
    },

    // Distance verticale (en pixels du monde) entre deux tuiles.
    // Choisie pour que l'espacement "colle" au tempo (voir levelSequencer.js).
    tileSpacing: 150,

    // Étoiles : la monnaie du jeu, gagnée en atterrissant pile au centre
    // d'une tuile. Prévue pour être dépensée plus tard dans une boutique
    // (voir docs/FUTURE_INTEGRATIONS.md) — pas encore implémentée.
    stars: {
      perfectReward: 1,
    },

    storage: {
      // Clés utilisées dans le stockage local (voir localStore.js)
      highscoreKey: 'tilesHop.trainingLevel.highscore',
      starsKey: 'tilesHop.wallet.stars',
    },
  };
})(window.TH = window.TH || {});
