/*
 * renderer.js
 * ------------------------------------------------------------
 * Role: DESSINER l'état du jeu sur le canvas, image après image.
 * Ce module ne décide jamais des règles (touché/raté, score...) :
 * il se contente de lire l'état préparé par engine.js et de le
 * peindre à l'écran. Si on veut changer les couleurs ou les
 * formes plus tard (vrais dessins), c'est ici et seulement ici.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Renderer {
    constructor(ctx, config, camera) {
      this.ctx = ctx;
      this.config = config;
      this.camera = camera;
    }

    render(engine) {
      const { ctx, config } = this;
      const t = engine.getElapsedSeconds();

      this._drawBackground();
      this._drawHitLine();
      this._drawTiles(engine.sequence.tiles, t);
      this._drawBall(engine);
    }

    _drawBackground() {
      const { ctx, config } = this;
      const gradient = ctx.createLinearGradient(0, 0, 0, config.canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);

      // Deux lignes de guidage verticales, juste pour donner un repère
      // de profondeur (sensation de "couloir" qui défile).
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(config.canvas.width * 0.1, 0);
      ctx.lineTo(config.canvas.width * 0.1, config.canvas.height);
      ctx.moveTo(config.canvas.width * 0.9, 0);
      ctx.lineTo(config.canvas.width * 0.9, config.canvas.height);
      ctx.stroke();
    }

    _drawHitLine() {
      const { ctx, config } = this;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, config.hitLine.y);
      ctx.lineTo(config.canvas.width, config.hitLine.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    _tileColor(state) {
      const { config } = this;
      if (state === 'hit') return config.tile.hitColor;
      if (state === 'missed') return config.tile.missColor;
      return config.tile.color;
    }

    _drawTiles(tiles, t) {
      const { ctx, config, camera } = this;

      for (const tile of tiles) {
        const screenY = camera.worldToScreenY(tile.worldY, t);
        if (screenY < -config.tile.height || screenY > config.canvas.height + config.tile.height) {
          continue; // hors écran : inutile de dessiner
        }

        const centerX = tile.getCenterX(config.canvas.width, config.tile.width);
        ctx.fillStyle = this._tileColor(tile.state);
        ctx.beginPath();
        ctx.roundRect(
          centerX - config.tile.width / 2,
          screenY - config.tile.height / 2,
          config.tile.width,
          config.tile.height,
          6
        );
        ctx.fill();
      }
    }

    _drawBall(engine) {
      const { ctx, config } = this;
      const ball = engine.ball;
      if (!ball.isAlive) return;

      const bouncePhase = engine.getBouncePhase();
      const offsetY = ball.getBounceOffsetY(bouncePhase);
      const y = config.hitLine.y + offsetY;

      ctx.save();
      ctx.translate(ball.x, y);
      ctx.scale(1 / ball.squash, ball.squash);
      ctx.fillStyle = config.ball.color;
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  TH.Renderer = Renderer;
})(window.TH = window.TH || {});
