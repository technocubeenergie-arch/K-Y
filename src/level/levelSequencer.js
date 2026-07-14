/*
 * levelSequencer.js
 * ------------------------------------------------------------
 * Role: transforme la "recette" d'un niveau (levelData.js, des
 * lettres FL/L/C/R/FR) en une vraie liste d'objets Tile, placés
 * dans le temps et dans l'espace.
 *
 * C'est ici qu'on calcule, à partir du tempo de la musique
 * (gameConfig.js), à quel moment précis chaque tuile doit arriver
 * sous la balle. C'est ce calcul qui garantit que "le rythme de
 * la musique structure l'action" : une tuile = un temps musical.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  function buildSequence(levelDef, config) {
    const beatInterval = 60 / config.music.bpm;
    const hopInterval = beatInterval * config.music.hopBeats;
    const requiredHopCount = Math.round(
      config.music.targetDurationSeconds / hopInterval
    );

    const positions = levelDef.resolvePositions(requiredHopCount);

    const tiles = positions.map((xFraction, index) => {
      const worldY = index * config.tileSpacing;
      return new TH.Tile(index, worldY, xFraction);
    });

    return {
      tiles,
      hopInterval,
      beatInterval,
      requiredHopCount,
      totalDurationSeconds: requiredHopCount * hopInterval,
      scrollSpeed: config.tileSpacing / hopInterval, // px / seconde
    };
  }

  TH.LevelSequencer = { buildSequence };
})(window.TH = window.TH || {});
