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

  // Construit les "fausses tuiles" d'une tuile réelle : des tuiles
  // visuelles, sans conséquence sur les règles du jeu, regroupées sur
  // UN SEUL bord (gauche ou droite), au même horaire que la vraie —
  // pas étalées sur toute la largeur. Elles ne sont jamais ajoutées à
  // `tiles` (voir plus bas) : `core/engine.js` ne les voit donc
  // jamais, et n'a pas besoin de savoir qu'elles existent — atterrir
  // dessus revient simplement à ne pas être aligné avec la vraie
  // tuile, ce que le moteur détecte déjà (voir docs/GAMEPLAY.md).
  function buildDecoys(realTile, realXFraction, laneFractions, config, useLeftEdge) {
    const sortedFractions = [...laneFractions].sort((a, b) => a - b);
    const edgeLanes = useLeftEdge
      ? sortedFractions.slice(0, config.tile.decoyCount)
      : sortedFractions.slice(-config.tile.decoyCount);

    return edgeLanes
      .filter((fraction) => fraction !== realXFraction)
      .map((fraction) => new TH.Tile(realTile.index, realTile.worldY, fraction, realTile.expectedTime));
  }

  // Décide si LA tuile d'indice `index` reçoit des fausses tuiles, et
  // de quel côté, sans utiliser Math.random() : un même morceau doit
  // toujours générer exactement le même niveau (rejouer, tester).
  // Ce "hash" entier (mélange de bits classique, inspiré de MurmurHash)
  // transforme un nombre entier en une valeur entre 0 et 1 qui paraît
  // irrégulière mais reste identique à chaque calcul — et surtout, ne
  // produit pas de longues séries répétées d'affilée pour des entiers
  // qui se suivent (contrairement à une formule à base de Math.sin,
  // qui y était sujette : testé en jeu, jusqu'à 7 fausses tuiles de
  // suite du même côté). `salt` sert à obtenir deux décisions
  // indépendantes ("apparaît ou non" / "quel bord") à partir du même
  // `index`.
  function pseudoRandom01(seed, salt) {
    let x = (seed + salt) | 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
    x = x ^ (x >>> 16);
    return (x >>> 0) / 4294967296;
  }

  // `beatTimes` : les horaires (secondes, triés du plus tôt au plus
  // tard) des "coups" détectés dans la musique. La position latérale
  // (quelle lettre FL/L/C/R/FR) est décidée par `levelDef` : l'analyse
  // audio ne peut donner QUE le rythme, pas où placer la balle.
  function buildSequence(beatTimes, levelDef, config) {
    const scrollSpeed = config.scroll.speed;
    const xFractions = levelDef.resolvePositions(beatTimes.length);

    // Même un tirage bien réparti (50/50) peut, par pur hasard, aligner
    // plusieurs fois le même bord d'affilée (repéré en jeu : jusqu'à 8
    // fois de suite) — statistiquement normal, mais ça donne
    // l'impression que "c'est toujours le même côté". On force donc
    // explicitement un changement de bord au-delà de
    // `decoyMaxSameSideStreak` occurrences consécutives.
    let lastSide = null;
    let sameSideStreak = 0;

    const tiles = beatTimes.map((expectedTime, index) => {
      const worldY = scrollSpeed * expectedTime;
      const tile = new TH.Tile(index, worldY, xFractions[index], expectedTime);
      const showDecoys = config.tile.decoyCount > 0 && pseudoRandom01(index, 0) < config.tile.decoyFrequency;

      if (showDecoys) {
        const drawnSide = pseudoRandom01(index, 999331) < 0.5 ? 'left' : 'right';
        const mustSwitch = drawnSide === lastSide && sameSideStreak >= config.tile.decoyMaxSameSideStreak;
        const side = mustSwitch ? (drawnSide === 'left' ? 'right' : 'left') : drawnSide;

        tile.decoys = buildDecoys(tile, xFractions[index], levelDef.laneFractions, config, side === 'left');

        sameSideStreak = side === lastSide ? sameSideStreak + 1 : 1;
        lastSide = side;
      }

      return tile;
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
