/*
 * levelSequencer.js
 * ------------------------------------------------------------
 * Role: transforme la "recette" d'un niveau (levelData.js, des
 * lettres FL/L/C/R/FR) en une vraie liste d'objets Tile, placés
 * dans le temps et dans l'espace.
 *
 * Deux façons de construire cette liste :
 *  - `buildSequence` : un tempo régulier fixé à l'avance
 *    (gameConfig.js), pour le niveau d'entraînement. Une tuile = un
 *    temps musical, à intervalle constant.
 *  - `buildSequenceFromBeatTimes` : les horaires viennent d'une VRAIE
 *    musique importée, déjà analysée par `audio/beatDetector.js`. Les
 *    tuiles suivent alors le rythme réel du morceau, pas régulier.
 *
 * Dans les deux cas, chaque tuile obtient un `expectedTime` (l'horaire
 * auquel elle doit être atteinte) et un `worldY` (sa position dans le
 * "monde", calculée avec la même vitesse de défilement pour que la
 * caméra n'ait jamais besoin de savoir laquelle des deux méthodes a
 * été utilisée). Voir `core/engine.js`, qui lit ces horaires tuile par
 * tuile, sans jamais supposer un intervalle fixe entre deux d'entre
 * elles.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  function buildTilesFromTimes(times, xFractions, config) {
    const scrollSpeed = config.scroll.speed;
    return times.map((expectedTime, index) => {
      const worldY = scrollSpeed * expectedTime;
      return new TH.Tile(index, worldY, xFractions[index], expectedTime);
    });
  }

  // Niveau d'entraînement : tempo régulier, décidé dans gameConfig.js.
  function buildSequence(levelDef, config) {
    const beatInterval = 60 / config.music.bpm;
    const hopInterval = beatInterval * config.music.hopBeats;
    const requiredHopCount = Math.round(
      config.music.targetDurationSeconds / hopInterval
    );

    const xFractions = levelDef.resolvePositions(requiredHopCount);
    const times = xFractions.map((_, index) => index * hopInterval);
    const tiles = buildTilesFromTimes(times, xFractions, config);

    return {
      tiles,
      hopInterval,
      beatInterval,
      requiredHopCount,
      totalDurationSeconds: requiredHopCount * hopInterval,
      scrollSpeed: config.scroll.speed,
    };
  }

  // Niveau généré à partir d'une musique importée : les horaires
  // viennent des "coups" détectés dans le morceau (beatTimes, en
  // secondes, triés du plus tôt au plus tard). La position latérale
  // (quelle lettre FL/L/C/R/FR) reste décidée par le même tracé que le
  // niveau d'entraînement, faute de mieux : l'analyse audio ne peut
  // donner QUE le rythme, pas où placer la balle.
  function buildSequenceFromBeatTimes(beatTimes, levelDef, config) {
    const xFractions = levelDef.resolvePositions(beatTimes.length);
    const tiles = buildTilesFromTimes(beatTimes, xFractions, config);
    const lastTile = tiles[tiles.length - 1];

    return {
      tiles,
      hopInterval: undefined, // pas d'intervalle fixe : voir chaque tile.expectedTime
      beatInterval: undefined,
      requiredHopCount: tiles.length,
      totalDurationSeconds: lastTile ? lastTile.expectedTime : 0,
      scrollSpeed: config.scroll.speed,
    };
  }

  TH.LevelSequencer = { buildSequence, buildSequenceFromBeatTimes };
})(window.TH = window.TH || {});
