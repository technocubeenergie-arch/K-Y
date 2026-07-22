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
  function buildDecoys(realTile, edgeLanes, realXFraction, config) {
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

  // Repère les longs "vides" entre deux tuiles consécutives (voir
  // docs/GAMEPLAY.md) : au lieu de laisser un simple trou dans le
  // rythme, une plateforme de liaison vient combler l'espace, sur la
  // même position latérale que la tuile qui précède le vide (là où se
  // trouve la balle au moment où le vide commence). Renvoyé à part de
  // `tiles` : ce n'est pas une tuile à toucher/rater, juste un élément
  // visuel + un signal pour ne pas faire rebondir la balle pendant la
  // traversée (voir core/engine.js, `isOnBridge`).
  function buildBridges(tiles, config) {
    const bridges = [];
    for (let i = 1; i < tiles.length; i++) {
      const previousTile = tiles[i - 1];
      const nextTile = tiles[i];
      const gap = nextTile.expectedTime - previousTile.expectedTime;
      if (gap < config.bridge.minGapSeconds) continue;

      bridges.push({
        startTime: previousTile.expectedTime,
        endTime: nextTile.expectedTime,
        startWorldY: previousTile.worldY,
        endWorldY: nextTile.worldY,
        xFraction: previousTile.xFraction,
      });
    }
    return bridges;
  }

  // Comme `buildBridges` (juste au-dessus), mais à partir de tapis
  // glissants posés À LA MAIN (voir `explicitLongPlates` ci-dessous),
  // au lieu de les déduire des écarts entre tuiles. `longPlates` :
  // horaires bruts (secondes, à vitesse normale, AVANT compression par
  // `speedMultiplier`) — on leur applique ici EXACTEMENT le même calcul
  // qu'aux tuiles (`timeOffset + temps / speedMultiplier`), pour rester
  // au même rythme que la musique accélérée.
  function buildExplicitBridges(longPlates, tiles, config, speedMultiplier, timeOffset) {
    const scrollSpeed = config.scroll.speed;
    return longPlates.map((plate) => {
      const startTime = timeOffset + plate.start / speedMultiplier;
      const endTime = timeOffset + plate.end / speedMultiplier;

      // La plateforme suit la position latérale de la tuile qui la
      // précède (là où se trouve la balle quand le tapis commence) —
      // même logique que `buildBridges`.
      let precedingTile = tiles[0];
      for (const tile of tiles) {
        if (tile.expectedTime > startTime) break;
        precedingTile = tile;
      }

      return {
        startTime,
        endTime,
        startWorldY: scrollSpeed * startTime,
        endWorldY: scrollSpeed * endTime,
        xFraction: precedingTile ? precedingTile.xFraction : 0.5,
      };
    });
  }

  // `beatTimes` : les horaires (secondes, triés du plus tôt au plus
  // tard) des "coups" détectés dans la musique, à vitesse normale. La
  // position latérale (quelle lettre FL/L/C/R/FR) est décidée par
  // `levelDef` : l'analyse audio ne peut donner QUE le rythme, pas où
  // placer la balle.
  //
  // `speedMultiplier` (voir config.levels.speedMultipliers) : pour un
  // niveau plus rapide, la musique est rejouée plus vite (voir
  // audio/audioManager.js, `scheduleLevels`) — un coup entendu à
  // l'origine à l'instant T est alors entendu à l'instant T /
  // speedMultiplier. On applique EXACTEMENT le même calcul ici, pour
  // que les tuiles restent en rythme avec la musique accélérée (sinon
  // elles resteraient aux horaires d'origine, alors que la musique,
  // elle, serait déjà passée).
  //
  // `timeOffset` : à combien de secondes, DANS LA PARTIE ENTIÈRE (pas
  // juste ce niveau), ce niveau commence. Une partie enchaîne plusieurs
  // niveaux sur UNE SEULE horloge qui ne repart jamais à zéro (voir
  // docs/GAMEPLAY.md, "aucune coupure entre deux niveaux") : le niveau 2
  // ne recommence pas son propre temps à 0, il continue exactement là
  // où le niveau 1 s'est arrêté.
  //
  // `explicitLongPlates` (optionnel) : des tapis glissants posés À LA
  // MAIN (voir tools/beatmap-editor/, docs/BEATMAP_EDITOR.md), au lieu
  // de laisser `buildBridges` les déduire automatiquement des écarts.
  // Fourni tel quel par `main.js` (issu de `TH.BeatmapData.merged.longPlates`).
  function buildSequence(beatTimes, levelDef, config, speedMultiplier = 1, timeOffset = 0, explicitLongPlates = null) {
    const scrollSpeed = config.scroll.speed;
    const compressedBeatTimes = beatTimes.map((time) => timeOffset + time / speedMultiplier);
    const xFractions = levelDef.resolvePositions(beatTimes.length);

    const sortedFractions = [...levelDef.laneFractions].sort((a, b) => a - b);
    const leftLanes = sortedFractions.slice(0, config.tile.decoyCount);
    const rightLanes = sortedFractions.slice(-config.tile.decoyCount);

    // Même un tirage bien réparti (50/50) peut, par pur hasard, aligner
    // plusieurs fois le même bord d'affilée (repéré en jeu : jusqu'à 8
    // fois de suite) — statistiquement normal, mais ça donne
    // l'impression que "c'est toujours le même côté". On force donc
    // explicitement un changement de bord au-delà de
    // `decoyMaxSameSideStreak` occurrences consécutives.
    let lastSide = null;
    let sameSideStreak = 0;

    const tiles = compressedBeatTimes.map((expectedTime, index) => {
      const worldY = scrollSpeed * expectedTime;
      const tile = new TH.Tile(index, worldY, xFractions[index], expectedTime);
      const showDecoys = config.tile.decoyCount > 0 && pseudoRandom01(index, 0) < config.tile.decoyFrequency;

      if (showDecoys) {
        // Si la vraie tuile est déjà sur une des positions du bord
        // choisi, il ne resterait qu'une seule fausse tuile, collée et
        // chevauchant la vraie (un petit bout qui dépasse, repéré par
        // Ylonna en jeu) — jamais le bloc net attendu de l'autre côté.
        // On considère donc un bord "sûr" seulement s'il ne contient
        // PAS la position de la vraie tuile.
        const realOnLeftLanes = leftLanes.includes(xFractions[index]);
        const realOnRightLanes = rightLanes.includes(xFractions[index]);

        let side = null;
        if (!realOnLeftLanes && !realOnRightLanes) {
          // Les deux bords sont sûrs (vraie tuile ailleurs, par ex. au
          // centre) : on choisit librement, avec l'anti-répétition.
          const drawnSide = pseudoRandom01(index, 999331) < 0.5 ? 'left' : 'right';
          const mustSwitch = drawnSide === lastSide && sameSideStreak >= config.tile.decoyMaxSameSideStreak;
          side = mustSwitch ? (drawnSide === 'left' ? 'right' : 'left') : drawnSide;
        } else if (!realOnLeftLanes) {
          side = 'left';
        } else if (!realOnRightLanes) {
          side = 'right';
        }
        // Si les deux bords sont "dangereux" (decoyCount très grand),
        // `side` reste `null` : aucune fausse tuile cette fois, plutôt
        // qu'un chevauchement.

        if (side) {
          tile.decoys = buildDecoys(tile, side === 'left' ? leftLanes : rightLanes, xFractions[index], config);
          sameSideStreak = side === lastSide ? sameSideStreak + 1 : 1;
          lastSide = side;
        }
      }

      return tile;
    });

    const bridges = explicitLongPlates
      ? buildExplicitBridges(explicitLongPlates, tiles, config, speedMultiplier, timeOffset)
      : buildBridges(tiles, config);

    // Une tuile tapée pile au même moment qu'un tapis glissant tapé à
    // la main ferait atterrir/rebondir la balle dessus, alors qu'elle
    // est censée rouler en continu sur le tapis (voir `isOnBridge`,
    // core/engine.js) — on la retire. Seulement pour les tapis
    // EXPLICITES : les tapis automatiques (`buildBridges`) sont déduits
    // des écarts ENTRE deux tuiles, donc ne recouvrent jamais une tuile
    // par construction.
    const finalTiles = explicitLongPlates
      ? tiles.filter((tile) => !bridges.some((bridge) => tile.expectedTime >= bridge.startTime && tile.expectedTime <= bridge.endTime))
      : tiles;
    const lastTile = finalTiles[finalTiles.length - 1];

    return {
      tiles: finalTiles,
      bridges,
      totalDurationSeconds: lastTile ? lastTile.expectedTime : 0,
      scrollSpeed,
    };
  }

  // Assemble plusieurs niveaux (chacun construit par `buildSequence`
  // avec son propre `timeOffset`, voir plus haut) en UNE SEULE séquence
  // continue : c'est ce qui permet à `core/engine.js` de traiter toute
  // la partie comme un unique chemin de tuiles, sans jamais redémarrer
  // l'horloge ni reconstruire quoi que ce soit à un changement de
  // niveau (voir docs/GAMEPLAY.md).
  //
  // Les plateformes de liaison de chaque niveau (déjà calculées par
  // `buildSequence`, automatiquement via `buildBridges` OU à la main
  // via `buildExplicitBridges`, voir `explicitLongPlates` plus haut)
  // sont simplement mises bout à bout ici, pas recalculées : chaque
  // niveau garde ainsi la source de plateformes qu'on lui a donnée. Un
  // éventuel écart entre la dernière tuile d'un niveau et la première
  // du suivant n'est donc plus comblé automatiquement — compromis
  // accepté pour respecter fidèlement un rythme posé à la main.
  //
  // `levelTileStartIndex[i]` : l'indice, dans le tableau `tiles` final,
  // de la première tuile du niveau i — sert à `core/engine.js` pour
  // savoir dans quel niveau on se trouve à un instant donné (HUD), et à
  // placer le bandeau "NIVEAU X" juste avant (voir `levelBanners`
  // ci-dessous).
  function combineLevelSequences(sequences, config) {
    const tiles = [];
    const bridges = [];
    const levelTileStartIndex = [];

    for (const sequence of sequences) {
      levelTileStartIndex.push(tiles.length);
      for (const tile of sequence.tiles) {
        tile.index = tiles.length;
        tiles.push(tile);
      }
      bridges.push(...sequence.bridges);
    }

    // Un bandeau par niveau, sauf le premier (pas besoin d'annoncer le
    // tout début de la partie) : positionné juste avant la première
    // tuile de ce niveau, pour arriver sur le chemin avant elle — voir
    // render/renderer.js, config.levels.bannerLeadSeconds.
    const levelBanners = [];
    for (let i = 1; i < levelTileStartIndex.length; i++) {
      const firstTileOfLevel = tiles[levelTileStartIndex[i]];
      if (!firstTileOfLevel) continue;
      levelBanners.push({
        text: 'NIVEAU ' + (i + 1),
        worldY: firstTileOfLevel.worldY - config.scroll.speed * config.levels.bannerLeadSeconds,
      });
    }

    const lastTile = tiles[tiles.length - 1];

    return {
      tiles,
      bridges,
      levelTileStartIndex,
      levelBanners,
      totalDurationSeconds: lastTile ? lastTile.expectedTime : 0,
      scrollSpeed: config.scroll.speed,
    };
  }

  TH.LevelSequencer = { buildSequence, combineLevelSequences };
})(window.TH = window.TH || {});
