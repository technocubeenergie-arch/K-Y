/*
 * levelData.js
 * ------------------------------------------------------------
 * Role: LA recette du niveau d'entraînement : où sont les tuiles ?
 *
 * Pour rester simple à lire (et à modifier !) même sans savoir
 * programmer, le chemin des tuiles est écrit avec des LETTRES :
 *
 *   FL = tout à gauche      L = un peu à gauche
 *   C  = au centre          R  = un peu à droite
 *   FR = tout à droite
 *
 * Le tableau PATTERN ci-dessous est le "chemin" que la balle doit
 * suivre. On peut le modifier (ajouter/enlever des lettres) pour
 * changer le niveau, sans toucher au reste du jeu.
 *
 * Si le motif est plus court que ce qu'il faut pour remplir la
 * durée du niveau, il est simplement répété depuis le début.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // Position latérale (fraction de la largeur du terrain, 0 = bord
  // gauche, 1 = bord droit) associée à chaque lettre.
  const LANE_POSITIONS = {
    FL: 0.18,
    L: 0.32,
    C: 0.5,
    R: 0.68,
    FR: 0.82,
  };

  // Le chemin du niveau d'entraînement : simple pour bien démarrer,
  // avec un peu de zigzag pour que ce soit amusant.
  const PATTERN = [
    'C', 'C', 'C',
    'L', 'L', 'C', 'R', 'R', 'C',
    'L', 'C', 'R', 'C',
    'FL', 'L', 'C', 'R', 'FR',
    'C', 'C',
    'L', 'R', 'L', 'R',
    'FL', 'FR', 'FL', 'FR',
    'C', 'L', 'C', 'R', 'C',
  ];

  // Les "plaques glissantes" (voir docs/GAMEPLAY.md) : certaines tuiles
  // du motif ci-dessus, une fois touchées, font ROULER la balle toute
  // seule vers la gauche ou la droite, au lieu de la laisser où le
  // joueur l'a posée. Indépendant du chemin latéral (PATTERN) : on
  // indique juste, ICI, quels indices DU MOTIF (0 = la 1ère lettre du
  // motif, 1 = la 2e...) sont glissants, et dans quel sens. Absent de
  // cette liste = tuile normale.
  const SLIPPERY_PATTERN = {
    6: 'right', // le 'R' à l'index 6 du motif
    20: 'left', // le 'L' à l'index 20 du motif
  };

  function resolvePositions(requiredHopCount) {
    const positions = [];
    for (let i = 0; i < requiredHopCount; i++) {
      const symbol = PATTERN[i % PATTERN.length];
      positions.push(LANE_POSITIONS[symbol]);
    }
    return positions;
  }

  function resolveSlides(requiredHopCount) {
    const slides = [];
    for (let i = 0; i < requiredHopCount; i++) {
      const patternIndex = i % PATTERN.length;
      slides.push(SLIPPERY_PATTERN[patternIndex] || null);
    }
    return slides;
  }

  TH.Levels = TH.Levels || {};
  TH.Levels.training = {
    id: 'training',
    name: "Niveau d'entraînement",
    resolvePositions,
    resolveSlides,
    // Toutes les positions latérales possibles (FL/L/C/R/FR) : sert à
    // placer les "fausses tuiles" sur les positions NON choisies à
    // chaque horaire (voir level/levelSequencer.js et docs/GAMEPLAY.md).
    laneFractions: Object.values(LANE_POSITIONS),
  };
})(window.TH = window.TH || {});
