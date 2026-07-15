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

  function resolvePositions(requiredHopCount) {
    const positions = [];
    for (let i = 0; i < requiredHopCount; i++) {
      const symbol = PATTERN[i % PATTERN.length];
      positions.push(LANE_POSITIONS[symbol]);
    }
    return positions;
  }

  TH.Levels = TH.Levels || {};
  TH.Levels.training = {
    id: 'training',
    name: "Niveau d'entraînement",
    resolvePositions,
    // Toutes les positions latérales possibles (FL/L/C/R/FR) : sert à
    // placer les "fausses tuiles" sur les positions NON choisies à
    // chaque horaire (voir level/levelSequencer.js et docs/GAMEPLAY.md).
    laneFractions: Object.values(LANE_POSITIONS),
  };
})(window.TH = window.TH || {});
