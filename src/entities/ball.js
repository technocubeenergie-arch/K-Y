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

      // Chute après un échec (voir core/engine.js, `_fail`) : la balle ne
      // disparaît plus instantanément, elle tombe visiblement avant que
      // l'écran d'échec ne s'affiche (demandé par Ylonna : "il faudrait
      // que l'on voie la balle tomber"). En plus de tomber (Y), elle
      // continue latéralement (X) dans la direction où elle a raté —
      // pour bien se voir tomber EN DEHORS de la tuile ou du tapis
      // glissant, pas juste couler tout droit dessus (précisé par
      // Ylonna après un premier essai : "faut voir la balle tomber en
      // dehors de la plaque glissante").
      this.isFalling = false;
      this.fallVelocity = 0;
      this.fallOffsetY = 0;
      this.fallOffsetX = 0;
      this.fallDriftDirection = 1;
    }

    reset(config) {
      this.x = config.canvas.width / 2;
      this.targetX = this.x;
      this.squash = 1;
      this.isAlive = true;
      this.isFalling = false;
      this.fallVelocity = 0;
      this.fallOffsetY = 0;
      this.fallOffsetX = 0;
      this.fallDriftDirection = 1;
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

    // Démarre la chute (voir core/engine.js, `_fail`) : la balle sort du
    // contrôle du joueur et de son rebond habituel, elle tombe sous
    // l'effet de la gravité jusqu'à sortir de l'écran, en continuant du
    // côté où elle a raté (`driftDirection` : -1 = vers la gauche, +1 =
    // vers la droite — voir core/engine.js, `_fail`, qui la déduit du
    // côté où la balle se trouvait par rapport à la tuile ou au tapis).
    startFalling(driftDirection) {
      this.isAlive = false;
      this.isFalling = true;
      this.fallVelocity = 0;
      this.fallOffsetY = 0;
      this.fallOffsetX = 0;
      this.fallDriftDirection = driftDirection || 1;
    }

    // gravity : accélération verticale en px/s² (voir
    // config.ball.fallGravity). driftSpeed : vitesse latérale constante
    // en px/s (voir config.ball.fallDriftSpeed), appliquée dans
    // `fallDriftDirection`.
    updateFall(dt, gravity, driftSpeed) {
      this.fallVelocity += gravity * dt;
      this.fallOffsetY += this.fallVelocity * dt;
      this.fallOffsetX += driftSpeed * this.fallDriftDirection * dt;
    }

    updateSquash(dt) {
      // Revient doucement à sa taille normale après un impact.
      this.squash = TH.MathUtils.lerp(this.squash, 1, Math.min(1, dt * 10));
    }
  }

  TH.Ball = Ball;
})(window.TH = window.TH || {});
