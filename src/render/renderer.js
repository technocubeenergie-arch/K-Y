/*
 * renderer.js
 * ------------------------------------------------------------
 * Role: DESSINER l'état du jeu sur le canvas, image après image.
 * Ce module ne décide jamais des règles (touché/raté, score...) :
 * il se contente de lire l'état préparé par engine.js et de le
 * peindre à l'écran. Si on veut changer les couleurs, les formes,
 * ou même le style de vue (comme le passage à une perspective),
 * c'est ici et seulement ici.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // En-dessous de cette échelle, une tuile est trop petite/lointaine
  // pour valoir la peine d'être dessinée (gain de performance, et ça
  // évite un fouillis de pixels minuscules près de l'horizon).
  const MIN_VISIBLE_SCALE = 0.04;

  class Renderer {
    constructor(ctx, config, camera) {
      this.ctx = ctx;
      this.config = config;
      this.camera = camera;
    }

    render(engine) {
      const t = engine.getElapsedSeconds();

      this._drawBackground();
      this._drawTiles(engine.sequence.tiles, t);
      this._drawHitLine();
      this._drawBall(engine);
    }

    _drawBackground() {
      const { ctx, config, camera } = this;
      const horizonY = camera.horizonY;

      // Ciel au-dessus de l'horizon, route en dessous : cette simple
      // séparation de couleurs aide beaucoup à lire la profondeur.
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, '#05070f');
      sky.addColorStop(1, '#161f33');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, config.canvas.width, horizonY);

      const road = ctx.createLinearGradient(0, horizonY, 0, config.canvas.height);
      road.addColorStop(0, '#22304a');
      road.addColorStop(1, '#0f172a');
      ctx.fillStyle = road;
      ctx.fillRect(0, horizonY, config.canvas.width, config.canvas.height - horizonY);

      // Deux bords de route qui convergent vers le point de fuite, à
      // l'horizon : c'est ce qui vend vraiment l'effet de perspective,
      // comme une route qui s'éloigne devant soi.
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(config.canvas.width * 0.04, config.canvas.height);
      ctx.lineTo(camera.vanishingPointX, horizonY);
      ctx.moveTo(config.canvas.width * 0.96, config.canvas.height);
      ctx.lineTo(camera.vanishingPointX, horizonY);
      ctx.stroke();
    }

    _drawHitLine() {
      const { ctx, config } = this;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, config.hitLine.y);
      ctx.lineTo(config.canvas.width, config.hitLine.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    _tileColor(tile) {
      const { config } = this;
      if (tile.state === 'hit') {
        return tile.isPerfect ? config.tile.perfectColor : config.tile.hitColor;
      }
      if (tile.state === 'missed') return config.tile.missColor;
      return config.tile.color;
    }

    // Un rayon de coin trop grand par rapport à la taille du rectangle
    // fait planter roundRect : on le limite toujours à la moitié du
    // plus petit côté.
    _safeCornerRadius(radius, width, height) {
      return Math.max(1, Math.min(radius, width / 2, height / 2));
    }

    _drawTiles(tiles, t) {
      const { ctx, config, camera } = this;

      // On dessine des tuiles les plus LOINTAINES aux plus PROCHES,
      // pour que les grandes tuiles proches recouvrent correctement
      // les petites tuiles lointaines si elles se chevauchent à l'écran
      // (comme une vraie scène en perspective).
      for (let i = tiles.length - 1; i >= 0; i--) {
        const tile = tiles[i];
        const flatX = tile.getCenterX(config.canvas.width, config.tile.width);
        const { screenX, screenY, scale } = camera.project(tile.worldY, flatX, t);

        if (scale < MIN_VISIBLE_SCALE) continue; // trop loin pour être utile
        if (screenY < camera.horizonY - 5 || screenY > config.canvas.height + config.tile.height) {
          continue; // hors écran
        }

        const width = config.tile.width * scale;
        const height = config.tile.height * scale;

        ctx.fillStyle = this._tileColor(tile);
        ctx.beginPath();
        ctx.roundRect(
          screenX - width / 2,
          screenY - height / 2,
          width,
          height,
          this._safeCornerRadius(6 * scale, width, height)
        );
        ctx.fill();

        // Tant que la tuile n'a pas encore été atteinte, on montre
        // directement dessus la zone bonus à viser (voir docs/GAMEPLAY.md).
        // Le reste de la tuile (en bleu) est déjà sûr, pas besoin de le
        // souligner en plus.
        if (tile.state === 'pending') {
          this._drawPerfectZone(screenX, screenY, scale);
        }
      }
    }

    _drawPerfectZone(screenX, screenY, scale) {
      const { ctx, config } = this;
      const width = config.tile.width * config.tile.perfectZoneRatio * scale;
      const height = config.tile.height * scale;

      ctx.fillStyle = config.tile.perfectZonePreviewColor;
      ctx.beginPath();
      ctx.roundRect(
        screenX - width / 2,
        screenY - height / 2,
        width,
        height,
        this._safeCornerRadius(5 * scale, width, height)
      );
      ctx.fill();
    }

    // La balle reste toujours au premier plan (échelle 1, sur la ligne
    // d'impact) : c'est le point de référence de la caméra, elle n'a
    // donc pas besoin de perspective.
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
