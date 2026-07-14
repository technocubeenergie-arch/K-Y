/*
 * gameLoop.js
 * ------------------------------------------------------------
 * Role: LA BOUCLE DE JEU. Un jeu, c'est juste ça qui tourne en
 * boucle très vite (60 fois par seconde environ) :
 *
 *   1. mettre à jour le jeu (engine.update)
 *   2. redessiner l'écran (renderer.render)
 *   3. recommencer
 *
 * Ce fichier ne connaît pas les règles du jeu (c'est engine.js)
 * ni comment dessiner (c'est renderer.js) : il se contente de les
 * appeler au bon rythme, image après image.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class GameLoop {
    constructor(engine, renderer) {
      this.engine = engine;
      this.renderer = renderer;
      this._lastTimestamp = null;
      this._running = false;
      this._tick = this._tick.bind(this);
    }

    start() {
      if (this._running) return;
      this._running = true;
      this._lastTimestamp = null;
      requestAnimationFrame(this._tick);
    }

    stop() {
      this._running = false;
    }

    _tick(timestamp) {
      if (!this._running) return;

      if (this._lastTimestamp === null) this._lastTimestamp = timestamp;
      const dt = Math.min(0.05, (timestamp - this._lastTimestamp) / 1000);
      this._lastTimestamp = timestamp;

      this.engine.update(dt);
      this.renderer.render(this.engine);

      requestAnimationFrame(this._tick);
    }
  }

  TH.GameLoop = GameLoop;
})(window.TH = window.TH || {});
