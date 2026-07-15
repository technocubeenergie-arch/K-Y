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

    // Perspective : donne au jeu l'effet "vu depuis derrière la balle",
    // comme une route qui s'éloigne vers l'horizon, plutôt qu'une vue du
    // dessus bien plate. Les tuiles lointaines paraissent petites et se
    // resserrent vers le centre de l'écran, puis grandissent en
    // s'approchant de la ligne d'impact. Voir render/camera.js.
    perspective: {
      // Hauteur de la ligne d'horizon : le point où tout devient
      // minuscule, au loin.
      horizonY: 90,
      // "Force" de la perspective : une valeur plus petite rapproche
      // l'horizon et rend l'effet plus prononcé ; plus grande, plus doux.
      focalDepth: 260,
    },

    // La balle
    ball: {
      radius: 18,
      color: '#ffffff',
      // Vitesse de déplacement latéral au clavier (px / seconde).
      keyboardSpeed: 200,
      // Hauteur du saut visuel entre deux tuiles (en pixels).
      bounceHeight: 128,
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

    // Défilement : vitesse constante (px/seconde) à laquelle le monde
    // avance vers le joueur. Une seule valeur, utilisée quelle que soit
    // la façon dont les tuiles ont été programmées dans le temps (tempo
    // fixe du niveau d'entraînement, OU horaires réels détectés dans une
    // musique importée, voir level/levelSequencer.js) : c'est ce qui
    // permet à la caméra (render/camera.js) de rester la même dans les
    // deux cas.
    scroll: {
      speed: 125,
    },

    // Détection de rythme pour les musiques importées (voir
    // audio/beatDetector.js) : transforme un fichier audio en horaires
    // de tuiles, sans que la musique ait été composée pour le jeu.
    beatDetection: {
      // Taille d'une tranche d'analyse, en échantillons audio.
      windowSize: 1024,
      // Écart minimum entre deux tuiles générées (temps de réaction).
      minIntervalSeconds: 0.45,
      // Un "coup" doit dépasser la moyenne locale de ce facteur pour
      // compter : plus haut = moins de tuiles, seulement les coups forts.
      sensitivity: 1.4,
      // Fenêtre (secondes) utilisée pour calculer cette moyenne locale.
      localWindowSeconds: 1.0,
      // Limite le nombre de tuiles générées, même pour un long morceau
      // (le niveau de test reste comparable en longueur à l'entraînement).
      maxTiles: 60,
    },

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
