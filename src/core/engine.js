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

      this.state = 'idle'; // idle | playing | paused | gameover | levelComplete | complete
      this.score = 0;
      // Étoiles gagnées PENDANT LA PARTIE EN COURS (remise à zéro à chaque
      // start()). Le total cumulé, lui, vit dans localStore (voir plus bas).
      this.runStars = 0;
      this._nextHopIndex = 0;
      // Niveau courant (0 = premier niveau) au sein d'une partie — voir
      // docs/GAMEPLAY.md, config.levels.speedMultipliers pour le nombre
      // total de niveaux. Remis à 0 uniquement par start() (un échec, à
      // n'importe quel niveau, ramène toujours au niveau 1 — voir
      // main.js).
      this.levelIndex = 0;
    }

    // `syncStartTime` (optionnel) est l'heure audio exacte à laquelle
    // la musique commence, pour que l'horloge du jeu démarre pile
    // en même temps qu'elle (voir main.js).
    // `sequenceOverride` (optionnel) remplace le niveau en cours par un
    // autre (par exemple un niveau généré à partir d'une musique
    // importée, voir main.js et level/levelSequencer.js).
    start(syncStartTime, sequenceOverride) {
      if (sequenceOverride) this.sequence = sequenceOverride;

      this.state = 'playing';
      this.score = 0;
      this.runStars = 0;
      this._nextHopIndex = 0;
      this.levelIndex = 0;
      this.sequence.tiles.forEach((tile) => {
        tile.state = 'pending';
        tile.isPerfect = false;
      });
      this.ball.reset(this.config);
      this.clock.start(syncStartTime);
      this.events.emit('game:start', {
        starBalance: this.localStore.getStarBalance(),
        totalTiles: this.sequence.tiles.length,
        levelIndex: this.levelIndex,
        totalLevels: this.config.levels.speedMultipliers.length,
      });
    }

    // Passe au niveau suivant SANS rien remettre à zéro (contrairement à
    // start()) : le score et les étoiles continuent de s'additionner sur
    // toute la partie — seul un échec (_fail) remet tout à zéro, jamais
    // la réussite d'un niveau (voir docs/GAMEPLAY.md). `sequence` est le
    // niveau suivant déjà construit par main.js (musique rejouée plus
    // vite, tuiles recalculées en conséquence — voir
    // level/levelSequencer.js).
    startNextLevel(syncStartTime, sequence) {
      this.sequence = sequence;
      this.levelIndex += 1;
      this._nextHopIndex = 0;
      this.sequence.tiles.forEach((tile) => {
        tile.state = 'pending';
        tile.isPerfect = false;
      });
      this.ball.reset(this.config);
      this.clock.start(syncStartTime);
      this.state = 'playing';
      this.events.emit('level:start', {
        totalTiles: this.sequence.tiles.length,
        levelIndex: this.levelIndex,
        totalLevels: this.config.levels.speedMultipliers.length,
        score: this.score,
        runStars: this.runStars,
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

      if (this._nextHopIndex >= tiles.length && this.state === 'playing') {
        this._complete();
      }
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
        levelReached: this.levelIndex + 1,
        totalLevels: this.config.levels.speedMultipliers.length,
      };
    }

    _fail() {
      if (this.state !== 'playing') return;
      this.state = 'gameover';
      this.ball.isAlive = false;
      this.clock.pause();
      this.events.emit('game:over', this._buildRunSummaryPayload());
    }

    // Fin des tuiles du niveau EN COURS : soit il reste des niveaux à
    // jouer (on prévient main.js, qui reconstruira le niveau suivant,
    // plus rapide, et appellera startNextLevel), soit c'était le
    // dernier — la partie entière est gagnée.
    _complete() {
      const totalLevels = this.config.levels.speedMultipliers.length;
      const isLastLevel = this.levelIndex + 1 >= totalLevels;

      this.clock.pause();

      if (!isLastLevel) {
        // État distinct de 'playing' : update() ne fait plus rien tant
        // que main.js n'a pas appelé startNextLevel avec le niveau
        // suivant (le temps, très bref, de relancer la musique plus
        // vite et reconstruire les tuiles correspondantes).
        this.state = 'levelComplete';
        this.events.emit('level:complete', {
          levelIndex: this.levelIndex,
          totalLevels,
          score: this.score,
          runStars: this.runStars,
        });
        return;
      }

      this.state = 'complete';
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

      const previousTime = nextIndex > 0 ? tiles[nextIndex - 1].expectedTime : 0;
      const nextTime = nextIndex < tiles.length ? tiles[nextIndex].expectedTime : previousTime + 1;
      const interval = Math.max(0.05, nextTime - previousTime);

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
