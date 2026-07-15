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
      keyboardSpeed: 350,
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

      // "Fausses tuiles" (voir docs/GAMEPLAY.md) : à chaque horaire, en
      // plus de la vraie tuile (colorée normalement), combien d'AUTRES
      // positions latérales affichent une tuile grise, non colorée,
      // purement visuelle (aucune conséquence si la balle passe
      // dessus : c'est déjà un "raté" comme atterrir dans le vide,
      // voir docs/GAMEPLAY.md). 0 = fonctionnalité désactivée.
      decoyCount: 4,
      decoyColor: '#334155',
    },

    // Défilement : vitesse constante (px/seconde) à laquelle le monde
    // avance vers le joueur, quel que soit l'écart entre deux tuiles
    // (voir level/levelSequencer.js et core/engine.js).
    scroll: {
      speed: 125,
    },

    // Détection de rythme (voir audio/beatDetector.js) : transforme la
    // musique du niveau (assets/levelTrackData.js) en horaires de
    // tuiles. C'est le rythme réel du morceau qui décide où sont les
    // tuiles, pas l'inverse (voir docs/GAMEPLAY.md).
    beatDetection: {
      // Taille d'une tranche d'analyse, en échantillons audio.
      windowSize: 1024,
      // Écart minimum entre deux tuiles générées (temps de réaction), ET
      // tempo le plus rapide recherché lors de la détection du pouls du
      // morceau (voir beatDetector.js, estimateTempoIntervalFrames).
      minIntervalSeconds: 0.45,
      // Tempo le plus lent recherché lors de cette même détection.
      maxIntervalSeconds: 1.4,
      // Un sursaut d'énergie, à une position de la grille rythmique
      // détectée, doit dépasser la moyenne locale de ce facteur pour
      // devenir une tuile : plus haut = moins de tuiles, seulement les
      // coups nets. Une position sans sursaut suffisant reste vide
      // (silence, vraie pause dans la musique). Comme on cherche
      // seulement à CONFIRMER un coup à un horaire déjà jugé probable
      // par la grille rythmique (pas à le repérer au hasard dans tout
      // le morceau), ce facteur peut rester modéré sans risquer de
      // tuiles parasites en plein silence.
      sensitivity: 0.6,
      // Fenêtre (secondes) utilisée pour calculer cette moyenne locale.
      localWindowSeconds: 1.0,
      // Tolérance de recherche autour de chaque position de la grille
      // (fraction du pouls détecté), pour rester juste même si le
      // morceau n'est pas joué à la mécanique près.
      toleranceRatio: 0.3,
      // Limite le nombre de tuiles générées, même pour un long morceau.
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
