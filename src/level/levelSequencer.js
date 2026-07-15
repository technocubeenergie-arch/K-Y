/*
 * levelSequencer.js
 * ------------------------------------------------------------
 * Role: transforme la "recette" d'un niveau (levelData.js, des
 * lettres FL/L/C/R/FR) en une vraie liste d'objets Tile, placées dans
 * le temps et dans l'espace, à partir des horaires réels détectés
 * dans la musique du niveau (voir audio/beatDetector.js).
 *
 * Chaque tuile obtient un `expectedTime` (l'horaire, en secondes,
 * auquel elle doit être atteinte) et un `worldY` (sa position dans le
 * "monde", calculée avec la vitesse de défilement constante
 * `config.scroll.speed`). C'est `core/engine.js` qui lit ces horaires
 * tuile par tuile, sans jamais supposer un intervalle fixe entre deux
 * d'entre elles — les tuiles suivent le rythme réel du morceau, pas
 * un tempo régulier décidé à l'avance.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // `beatTimes` : les horaires (secondes, triés du plus tôt au plus
  // tard) des "coups" détectés dans la musique. La position latérale
  // (quelle lettre FL/L/C/R/FR) est décidée par `levelDef` : l'analyse
  // audio ne peut donner QUE le rythme, pas où placer la balle.
  function buildSequence(beatTimes, levelDef, config) {
    const scrollSpeed = config.scroll.speed;
    const xFractions = levelDef.resolvePositions(beatTimes.length);

    const tiles = beatTimes.map((expectedTime, index) => {
      const worldY = scrollSpeed * expectedTime;
      return new TH.Tile(index, worldY, xFractions[index], expectedTime);
    });

    const lastTile = tiles[tiles.length - 1];

    return {
      tiles,
      totalDurationSeconds: lastTile ? lastTile.expectedTime : 0,
      scrollSpeed,
    };
  }

  TH.LevelSequencer = { buildSequence };
})(window.TH = window.TH || {});
