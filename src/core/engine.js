/*
 * engine.js
 * ------------------------------------------------------------
 * Role: LE CERVEAU du jeu. C'est le seul module qui décide :
 *  - quand une tuile est touchée ou ratée,
 *  - quand la partie est gagnée ou perdue,
 *  - ce que vaut le score.
 *
 * L'engine NE DESSINE RIEN (ça, c'est render/renderer.js) et NE
 * JOUE AUCUN SON DIRECTEMENT : il prévient juste les autres
 * modules via l'eventBus ("tile:hit", "game:over"...), qui
 * réagissent chacun de leur côté (audio, HUD, écrans).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Engine {
    constructor({ config, clock, ball, sequence, eventBus, localStore }) {
      this.config = config;
      this.clock = clock;
      this.ball = ball;
      this.sequence = sequence;
      this.events = eventBus;
      this.localStore = localStore;

      this.state = 'idle'; // idle | playing | paused | gameover | complete
      this.score = 0;
      // Étoiles gagnées PENDANT LA PARTIE EN COURS (remise à zéro à chaque
      // start()). Le total cumulé, lui, vit dans localStore (voir plus bas).
      this.runStars = 0;
      this._nextHopIndex = 0;
      // Niveau courant (0 = premier niveau), déduit de `_nextHopIndex`
      // et de `sequence.levelTileStartIndex` (voir `_levelIndexForTileIndex`
      // plus bas) — jamais remis à zéro "en dur" à un changement de
      // niveau : toute la partie est UNE SEULE séquence continue (voir
      // level/levelSequencer.js, `combineLevelSequences`), l'horloge ne
      // redémarre jamais entre deux niveaux (voir docs/GAMEPLAY.md,
      // "aucune coupure").
      this._currentLevelIndex = 0;
    }

    // `syncStartTime` (optionnel) est l'heure audio exacte à laquelle
    // la musique commence, pour que l'horloge du jeu démarre pile
    // en même temps qu'elle (voir main.js).
    // `sequenceOverride` (optionnel) remplace le niveau en cours par un
    // autre (par exemple un niveau généré à partir d'une musique
    // importée, voir main.js et level/levelSequencer.js). C'est la
    // séquence COMBINÉE de tous les niveaux de la partie (voir
    // `level/levelSequencer.js`, `combineLevelSequences`).
    start(syncStartTime, sequenceOverride) {
      if (sequenceOverride) this.sequence = sequenceOverride;

      this.state = 'playing';
      this.score = 0;
      this.runStars = 0;
      this._nextHopIndex = 0;
      this._currentLevelIndex = 0;
      this.sequence.tiles.forEach((tile) => {
        tile.state = 'pending';
        tile.isPerfect = false;
      });
      this.ball.reset(this.config);
      this.clock.start(syncStartTime);
      this.events.emit('game:start', {
        starBalance: this.localStore.getStarBalance(),
        totalTiles: this._levelTileCount(0),
        levelIndex: 0,
        totalLevels: this.sequence.levelTileStartIndex.length,
      });
    }

    togglePause() {
      if (this.state === 'playing') {
        this.state = 'paused';
        this.clock.pause();
        this.events.emit('game:pause', {});
      } else if (this.state === 'paused') {
        this.state = 'playing';
        this.clock.resume();
        this.events.emit('game:resume', {});
      }
    }

    update(dt) {
      if (this.state !== 'playing') return;

      this.ball.update();
      this.ball.updateSquash(dt);

      const t = this.clock.getElapsedSeconds();
      const tiles = this.sequence.tiles;

      while (
        this._nextHopIndex < tiles.length &&
        t >= tiles[this._nextHopIndex].expectedTime
      ) {
        this._processHop(tiles[this._nextHopIndex]);
        this._nextHopIndex++;
      }

      this._checkLevelChange();

      if (this._nextHopIndex >= tiles.length && this.state === 'playing') {
        this._complete();
      }
    }

    // Détecte qu'on vient de franchir la frontière d'un nouveau niveau
    // (voir `sequence.levelTileStartIndex`, construit par
    // `level/levelSequencer.js`, `combineLevelSequences`) — PURE
    // information pour le HUD (voir ui/hud.js) : ça ne touche JAMAIS à
    // l'horloge, à la balle, ou à l'état des tuiles. Le bandeau
    // "NIVEAU X" sur le chemin, lui, n'a même pas besoin de cet
    // événement : il est positionné une fois pour toutes dans le monde
    // (voir `sequence.levelBanners`, render/renderer.js).
    _checkLevelChange() {
      const tileIndex = Math.min(this._nextHopIndex, this.sequence.tiles.length - 1);
      if (tileIndex < 0) return;

      const newLevelIndex = this._levelIndexForTileIndex(tileIndex);
      if (newLevelIndex === this._currentLevelIndex) return;

      this._currentLevelIndex = newLevelIndex;
      this.events.emit('level:reached', {
        levelIndex: newLevelIndex,
        totalLevels: this.sequence.levelTileStartIndex.length,
        totalTiles: this._levelTileCount(newLevelIndex),
        score: this.score,
        runStars: this.runStars,
      });
    }

    // À quel niveau appartient la tuile d'indice `tileIndex`, d'après
    // `sequence.levelTileStartIndex` (l'indice de la première tuile de
    // chaque niveau, dans l'ordre).
    _levelIndexForTileIndex(tileIndex) {
      const starts = this.sequence.levelTileStartIndex;
      let level = 0;
      for (let i = 1; i < starts.length; i++) {
        if (tileIndex >= starts[i]) level = i;
      }
      return level;
    }

    // Combien de tuiles contient le niveau `levelIndex` — pour le HUD
    // (voir ui/hud.js, "X / Y tuiles de CE niveau").
    _levelTileCount(levelIndex) {
      const starts = this.sequence.levelTileStartIndex;
      const start = starts[levelIndex];
      const end = levelIndex + 1 < starts.length ? starts[levelIndex + 1] : this.sequence.tiles.length;
      return end - start;
    }

    _processHop(tile) {
      const tileCenterX = tile.getCenterX(this.config.canvas.width, this.config.tile.width);
      const halfTile = this.config.tile.width / 2;
      const distanceFromCenter = Math.abs(this.ball.x - tileCenterX);
      const hitZone = halfTile * this.config.tile.hitZoneRatio;
      const isAligned = distanceFromCenter <= hitZone;

      if (isAligned) {
        tile.state = 'hit';
        this.score += 1;
        this.ball.playImpactSquash();

        // Atterrissage "parfait" : la balle est tout près du centre de la
        // tuile, pas juste quelque part dessus. Ça rapporte une étoile.
        const perfectZone = halfTile * this.config.tile.perfectZoneRatio;
        tile.isPerfect = distanceFromCenter <= perfectZone;

        let starBalance = this.localStore.getStarBalance();
        if (tile.isPerfect) {
          this.runStars += this.config.stars.perfectReward;
          starBalance = this.localStore.addStars(this.config.stars.perfectReward);
        }

        this.events.emit('tile:hit', {
          index: tile.index,
          score: this.score,
          isPerfect: tile.isPerfect,
          runStars: this.runStars,
          starBalance,
        });
      } else {
        tile.state = 'missed';
        this.events.emit('tile:miss', { index: tile.index });
        this._fail();
      }
    }

    // Score, étoiles et record : les infos communes à la fin d'une partie,
    // qu'elle se termine par un échec ou une réussite.
    _buildRunSummaryPayload() {
      const previousHighscore = this.localStore.getHighScore();
      const isNewHighscore = this.score > previousHighscore;
      if (isNewHighscore) this.localStore.setHighScore(this.score);

      return {
        score: this.score,
        highscore: isNewHighscore ? this.score : previousHighscore,
        isNewHighscore,
        runStars: this.runStars,
        starBalance: this.localStore.getStarBalance(),
        // Niveau atteint (1-based, plus parlant qu'un index) et nombre
        // total de niveaux — utile surtout sur l'écran d'échec, pour
        // montrer jusqu'où la partie est allée (voir ui/screens.js).
        levelReached: this._currentLevelIndex + 1,
        totalLevels: this.sequence.levelTileStartIndex.length,
      };
    }

    _fail() {
      if (this.state !== 'playing') return;
      this.state = 'gameover';
      this.ball.isAlive = false;
      this.clock.pause();
      this.events.emit('game:over', this._buildRunSummaryPayload());
    }

    // Toutes les tuiles de TOUS les niveaux ont été touchées (la partie
    // entière est une seule séquence continue, voir
    // level/levelSequencer.js, combineLevelSequences) : la partie est
    // gagnée.
    _complete() {
      this.state = 'complete';
      this.clock.pause();
      this.events.emit('game:complete', this._buildRunSummaryPayload());
    }

    // Position (0 à 1) de la balle dans son saut courant, utilisée par
    // le renderer pour dessiner l'animation de rebond. Fonctionne que
    // les tuiles soient espacées régulièrement (niveau d'entraînement)
    // ou pas (niveau généré depuis une musique importée, où l'écart
    // entre deux tuiles varie) : on prend simplement le temps entre la
    // DERNIÈRE tuile passée et la PROCHAINE, quel qu'il soit.
    getBouncePhase() {
      const t = Math.max(0, this.clock.getElapsedSeconds());
      const tiles = this.sequence.tiles;
      const nextIndex = this._nextHopIndex;

      let previousTime = nextIndex > 0 ? tiles[nextIndex - 1].expectedTime : 0;
      let nextTime = nextIndex < tiles.length ? tiles[nextIndex].expectedTime : previousTime + 1;

      // Un tapis glissant TAPÉ À LA MAIN (voir `explicitLongPlates`,
      // level/levelSequencer.js) ne commence/finit pas forcément pile
      // sur une tuile, contrairement à un tapis automatique (déduit de
      // l'écart ENTRE deux tuiles, donc toujours bordé par elles). Sans
      // ce correctif, le rebond ignorait complètement le tapis : à
      // l'ENTRÉE, la phase continuait de grimper comme si de rien
      // n'était, alors que `isOnBridge()` (voir plus bas) fige déjà
      // l'affichage à 0 — un saut brutal, à une hauteur incohérente,
      // pile à l'entrée du tapis. Et à la SORTIE, le rebond serait
      // reparti de la tuile d'AVANT le tapis, comme si le temps passé
      // dessus n'existait pas — même genre de saut brutal, repéré par
      // Ylonna à chaque fin de tapis. On borne donc l'intervalle du
      // rebond par le tapis qui le précède (reprendre à 0 pile à la
      // sortie) et par celui qui le suit (s'arrêter à 0 pile à l'entrée).
      const bridges = this.sequence.bridges || [];
      for (const bridge of bridges) {
        // `t >= bridge.endTime` : ce tapis doit être VRAIMENT déjà
        // franchi (pas juste "quelque part avant la prochaine tuile")
        // pour avancer `previousTime` jusqu'à sa fin. Sans cette garde,
        // un tapis pas encore atteint (voire plusieurs d'affilée, tous
        // situés entre la même paire de tuiles) faisait quand même
        // avancer `previousTime` jusqu'à son `endTime` — un horaire
        // FUTUR par rapport à `t`. La phase, calculée comme `(t -
        // previousTime) / interval`, devenait alors négative, donc
        // ramenée à 0 par le clamp final : la balle apparaissait à
        // plat, roulant, bien AVANT même d'arriver sur ce tapis (repéré
        // par Ylonna : "la balle roule même avant d'être sur la tapie").
        if (t >= bridge.endTime && bridge.endTime > previousTime && bridge.endTime <= nextTime) {
          previousTime = Math.max(previousTime, bridge.endTime);
        }
        if (bridge.startTime > previousTime && bridge.startTime < nextTime) {
          nextTime = Math.min(nextTime, bridge.startTime);
        }
      }

      // Un plancher minuscule, juste pour éviter une division par (quasi)
      // zéro si deux horaires tombaient pile au même instant — jamais
      // pensé pour ralentir volontairement l'animation : avec un rythme
      // posé à la main, un écart réel de quelques dizaines de
      // millisecondes entre deux horaires arrive (contrairement à la
      // détection automatique, qui n'en produit jamais d'aussi courts,
      // voir `config.beatDetection.minIntervalSeconds`). Un plancher trop
      // grand (0,05s essayé au départ) ralentissait alors artificiellement
      // la phase par rapport à l'écart réel : au moment précis où
      // `nextTime` était censé être atteint (typiquement l'entrée d'un
      // tapis glissant, voir plus haut), la phase n'était pas encore à 1
      // — donc pas encore à une hauteur de 0 — d'où un saut résiduel
      // pile à l'entrée du tapis, repéré sur le tout dernier tapis du
      // morceau (accolé à 32ms de la dernière tuile).
      const interval = Math.max(0.001, nextTime - previousTime);
      return TH.MathUtils.clamp((t - previousTime) / interval, 0, 1);
    }

    // Vrai si la balle est actuellement sur une "plateforme de liaison"
    // (voir level/levelSequencer.js, docs/GAMEPLAY.md) : le renderer
    // s'en sert pour ne pas faire rebondir la balle pendant qu'elle la
    // traverse — elle roule en continu au lieu de sauter.
    isOnBridge() {
      const t = this.clock.getElapsedSeconds();
      const bridges = this.sequence.bridges || [];
      return bridges.some((bridge) => t >= bridge.startTime && t <= bridge.endTime);
    }

    getElapsedSeconds() {
      return this.clock.getElapsedSeconds();
    }

    // Pour `config.debug.showTiming` (voir render/renderer.js) : l'écart
    // exact, en secondes, entre le temps audio courant et l'horaire de
    // la prochaine tuile — un outil de développeur, voir docs/GAMEPLAY.md.
    getDebugTimingInfo() {
      const musicTime = this.clock.getElapsedSeconds();
      const nextTile = this.sequence.tiles[this._nextHopIndex] || null;
      return {
        musicTime,
        nextExpectedTime: nextTile ? nextTile.expectedTime : null,
        delta: nextTile ? musicTime - nextTile.expectedTime : null,
        offsetMs: this.clock.getOffsetMs(),
      };
    }
  }

  TH.Engine = Engine;
})(window.TH = window.TH || {});
