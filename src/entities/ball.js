/*
 * ball.js
 * ------------------------------------------------------------
 * Role: la balle du joueur.
 *
 * Deux choses complètement séparées à l'intérieur :
 *  1) La position X : contrôlée par le joueur (souris/doigt/clavier).
 *  2) Le petit rebond visuel : une animation automatique qui suit
 *     le rythme de la musique, juste pour donner l'impression que
 *     la balle "saute" en cadence. Elle n'affecte jamais le X.
 *
 * La balle ne sait pas ce qu'est une tuile : elle ne fait que
 * suivre le doigt du joueur et sautiller en rythme. La détection
 * de collision se fait ailleurs (engine.js).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Ball {
    constructor(config) {
      this.radius = config.ball.radius;
      this.x = config.canvas.width / 2;
      this.targetX = this.x;
      this._minX = this.radius;
      this._maxX = config.canvas.width - this.radius;

      // Amplitude du rebond visuel (en pixels), 0 = balle immobile
      this.bounceHeight = config.ball.bounceHeight;
      this.squash = 1; // 1 = taille normale, <1 = écrasée à l'impact
      this.isAlive = true;
    }

    reset(config) {
      this.x = config.canvas.width / 2;
      this.targetX = this.x;
      this.squash = 1;
      this.isAlive = true;
    }

    setTargetX(x) {
      this.targetX = TH.MathUtils.clamp(x, this._minX, this._maxX);
    }

    nudgeTargetX(deltaX) {
      this.setTargetX(this.targetX + deltaX);
    }

    // Suivi direct de la cible : un contrôle précis et immédiat,
    // comme dans Tiles Hop (on lit tout de suite où va la balle).
    update() {
      this.x = this.targetX;
    }

    // phase01: position dans le cycle de saut courant, de 0 à 1.
    getBounceOffsetY(phase01) {
      if (!this.isAlive) return 0;
      // Trajectoire en arc (parabole) : 0 en haut et en bas du cycle,
      // maximum au milieu du saut.
      const arc = 1 - Math.pow(phase01 * 2 - 1, 2);
      return -arc * this.bounceHeight;
    }

    playImpactSquash() {
      this.squash = 0.72;
    }

    updateSquash(dt) {
      // Revient doucement à sa taille normale après un impact.
      this.squash = TH.MathUtils.lerp(this.squash, 1, Math.min(1, dt * 10));
    }
  }

  TH.Ball = Ball;
})(window.TH = window.TH || {});
