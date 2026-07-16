/*
 * ball.js
 * ------------------------------------------------------------
 * Role: la balle du joueur.
 *
 * Trois choses complètement séparées à l'intérieur :
 *  1) La position X : contrôlée par le joueur (souris/doigt/clavier).
 *  2) Le petit rebond visuel : une animation automatique qui suit
 *     le rythme de la musique, juste pour donner l'impression que
 *     la balle "saute" en cadence. Elle n'affecte jamais le X.
 *  3) Le "roulement" (voir `startSliding`) : après une plaque
 *     glissante, la balle dérive TOUTE SEULE sur le côté, en plus de
 *     ce que fait le joueur, jusqu'à la prochaine tuile.
 *
 * La balle ne sait pas ce qu'est une tuile (ni une plaque glissante) :
 * elle ne fait que suivre le doigt du joueur, sautiller en rythme, et
 * dériver quand on le lui demande. La détection de collision et la
 * décision de faire rouler la balle se font ailleurs (engine.js).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Ball {
    constructor(config) {
      this.radius = config.ball.radius;
      this.x = config.canvas.width / 2;
      this.targetX = this.x;

      // La balle ne doit jamais pouvoir sortir de la zone où une tuile
      // peut exister : on reprend exactement la même formule que
      // `tile.getCenterX` (une tuile, même complètement à gauche ou à
      // droite, garde son centre entre `tileWidth/2` et
      // `canvasWidth - tileWidth/2`). Sans cette limite, le joueur
      // pouvait déplacer la balle au-delà de la tuile la plus excentrée
      // (jusqu'aux bords du canvas), dans une zone où aucune tuile
      // n'apparaît jamais.
      const tileMargin = config.tile.width / 2;
      this._minX = tileMargin;
      this._maxX = config.canvas.width - tileMargin;

      // Amplitude du rebond visuel (en pixels), 0 = balle immobile
      this.bounceHeight = config.ball.bounceHeight;
      this.squash = 1; // 1 = taille normale, <1 = écrasée à l'impact
      this.isAlive = true;

      // Vitesse de "roulement" involontaire (px/seconde), déclenchée
      // par une plaque glissante (voir `startSliding`). 0 = pas de
      // roulement en cours.
      this.slideVelocity = 0;
    }

    reset(config) {
      this.x = config.canvas.width / 2;
      this.targetX = this.x;
      this.squash = 1;
      this.isAlive = true;
      this.slideVelocity = 0;
    }

    setTargetX(x) {
      this.targetX = TH.MathUtils.clamp(x, this._minX, this._maxX);
    }

    nudgeTargetX(deltaX) {
      this.setTargetX(this.targetX + deltaX);
    }

    // Appelé par engine.js à chaque tuile touchée : `direction` vaut
    // 'left', 'right' (plaque glissante) ou null (tuile normale, ça
    // arrête un roulement en cours — on est de nouveau sur une tuile
    // qui tient en place).
    startSliding(direction, speed) {
      if (direction === 'left') this.slideVelocity = -speed;
      else if (direction === 'right') this.slideVelocity = speed;
      else this.slideVelocity = 0;
    }

    // Suivi direct de la cible : un contrôle précis et immédiat,
    // comme dans Tiles Hop (on lit tout de suite où va la balle) — SAUF
    // le roulement d'une plaque glissante, qui pousse la cible tout
    // seul, en plus de ce que fait le joueur (souris/doigt/clavier).
    update(dt) {
      if (this.slideVelocity !== 0) {
        this.targetX = TH.MathUtils.clamp(this.targetX + this.slideVelocity * dt, this._minX, this._maxX);
      }
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
