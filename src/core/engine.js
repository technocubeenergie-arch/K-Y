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
      this._nextHopIndex = 0;
    }

    // `syncStartTime` (optionnel) est l'heure audio exacte à laquelle
    // la musique commence, pour que l'horloge du jeu démarre pile
    // en même temps qu'elle (voir main.js).
    start(syncStartTime) {
      this.state = 'playing';
      this.score = 0;
      this._nextHopIndex = 0;
      this.sequence.tiles.forEach((tile) => {
        tile.state = 'pending';
      });
      this.ball.reset(this.config);
      this.clock.start(syncStartTime);
      this.events.emit('game:start', {});
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
        t >= this._nextHopIndex * this.sequence.hopInterval
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
      const isAligned = Math.abs(this.ball.x - tileCenterX) <= halfTile;

      if (isAligned) {
        tile.state = 'hit';
        this.score += 1;
        this.ball.playImpactSquash();
        this.events.emit('tile:hit', { index: tile.index, score: this.score });
      } else {
        tile.state = 'missed';
        this.events.emit('tile:miss', { index: tile.index });
        this._fail();
      }
    }

    _fail() {
      if (this.state !== 'playing') return;
      this.state = 'gameover';
      this.ball.isAlive = false;
      this.clock.pause();

      const previousHighscore = this.localStore.getHighScore();
      const isNewHighscore = this.score > previousHighscore;
      if (isNewHighscore) this.localStore.setHighScore(this.score);

      this.events.emit('game:over', {
        score: this.score,
        highscore: isNewHighscore ? this.score : previousHighscore,
        isNewHighscore,
      });
    }

    _complete() {
      this.state = 'complete';
      this.clock.pause();

      const previousHighscore = this.localStore.getHighScore();
      const isNewHighscore = this.score > previousHighscore;
      if (isNewHighscore) this.localStore.setHighScore(this.score);

      this.events.emit('game:complete', {
        score: this.score,
        highscore: isNewHighscore ? this.score : previousHighscore,
        isNewHighscore,
      });
    }

    // Position (0 à 1) de la balle dans son cycle de saut courant,
    // utilisée par le renderer pour dessiner l'animation de rebond.
    getBouncePhase() {
      const t = Math.max(0, this.clock.getElapsedSeconds());
      const hopInterval = this.sequence.hopInterval;
      return (t % hopInterval) / hopInterval;
    }

    getElapsedSeconds() {
      return this.clock.getElapsedSeconds();
    }
  }

  TH.Engine = Engine;
})(window.TH = window.TH || {});
