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

  class Renderer {
    constructor(ctx, config, camera) {
      this.ctx = ctx;
      this.config = config;
      this.camera = camera;
      // Bandeau "Niveau X" (voir showLevelBanner ci-dessous) : { text,
      // worldY } ou null. PAS un écran séparé : il arrive et défile sur
      // le chemin, exactement comme une tuile (voir docs/GAMEPLAY.md).
      this._banner = null;
    }

    render(engine) {
      const t = engine.getElapsedSeconds();

      this._drawBackground();
      this._drawBridges(engine.sequence.bridges, t);
      this._drawTiles(engine.sequence.tiles, t);
      this._drawHitLine();
      if (this._banner) this._drawLevelBanner(t);
      this._drawBall(engine);
      if (this.config.debug.showTiming) this._drawDebugTiming(engine);
    }

    // Programme l'apparition du bandeau annonçant un nouveau niveau
    // (voir main.js, événement `level:start`) : il apparaît minuscule à
    // l'horizon, sur le chemin, puis grandit et défile vers la balle
    // exactement comme une tuile (même `camera.project`, voir
    // `_drawLevelBanner`) — jamais un écran séparé qui interromprait le
    // jeu. `worldY` détermine à quelle distance il apparaît (voir
    // config.levels.bannerLeadSeconds, main.js).
    showLevelBanner(text, worldY) {
      this._banner = { text, worldY };
    }

    // Voir showLevelBanner : dessine le bandeau à sa position/échelle
    // actuelle sur le chemin, et l'efface tout seul une fois qu'il a
    // bien dépassé la ligne d'impact (comme une tuile qui continuerait
    // de grossir indéfiniment sinon, immobile à l'écran).
    //
    // Une vraie PLATEFORME barre tout le chemin (même logique qu'une
    // tuile géante, voir `_drawSingleTile`/`_drawBridges`), avec le
    // texte dessus : ça se lit comme un élément DU PARCOURS qui défile
    // à la suite des tuiles, pas comme du texte flottant par-dessus le
    // jeu (retour de Ylonna après avoir vu le premier essai).
    _drawLevelBanner(t) {
      const { ctx, config, camera } = this;
      const banner = this._banner;
      const { screenX, screenY, scale } = camera.project(banner.worldY, config.canvas.width / 2, t);

      if (scale > 3) {
        this._banner = null;
        return;
      }

      const width = config.canvas.width * 0.88 * scale;
      const height = 50 * scale;

      ctx.save();
      ctx.globalAlpha = TH.MathUtils.clamp(scale * 1.5, 0, 1);

      ctx.fillStyle = config.tile.perfectColor;
      ctx.beginPath();
      ctx.roundRect(
        screenX - width / 2,
        screenY - height / 2,
        width,
        height,
        this._safeCornerRadius(10 * scale, width, height)
      );
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = Math.max(1, 2 * scale);
      ctx.stroke();

      ctx.fillStyle = '#1c1305';
      ctx.font = `bold ${22 * scale}px 'Segoe UI', Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(banner.text, screenX, screenY);
      ctx.restore();
    }

    // Voir config.debug.showTiming, docs/GAMEPLAY.md : purement un outil
    // de calibration, aucun effet sur les règles du jeu. Placé près du
    // bas du canvas (pas en haut, comme le HUD en HTML par-dessus le
    // canvas — voir css/style.css, #hud) pour ne jamais le recouvrir.
    _drawDebugTiming(engine) {
      const { ctx, config } = this;
      const info = engine.getDebugTimingInfo();
      const boxY = config.canvas.height - 62;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(4, boxY, 196, 58);

      ctx.fillStyle = '#4ade80';
      ctx.font = '11px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(`musicTime: ${info.musicTime.toFixed(3)}s`, 10, boxY + 4);
      ctx.fillText(
        `prochaine tuile: ${info.nextExpectedTime !== null ? info.nextExpectedTime.toFixed(3) + 's' : '-'}`,
        10,
        boxY + 18
      );
      ctx.fillText(`écart: ${info.delta !== null ? Math.round(info.delta * 1000) + 'ms' : '-'}`, 10, boxY + 32);
      ctx.fillText(`offset réglé: ${Math.round(info.offsetMs)}ms`, 10, boxY + 46);
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

    // Une "plateforme de liaison" (voir docs/GAMEPLAY.md,
    // level/levelSequencer.js) comble un long vide du rythme : dessinée
    // comme un long ruban qui rétrécit vers l'horizon (même logique de
    // perspective que les tuiles, mais étirée entre deux profondeurs
    // au lieu d'une seule), plutôt qu'une simple tuile.
    _drawBridges(bridges, t) {
      const { ctx, config, camera } = this;
      if (!bridges || bridges.length === 0) return;

      const margin = config.tile.width / 2;
      const usableWidth = config.canvas.width - margin * 2;

      for (const bridge of bridges) {
        const flatX = margin + bridge.xFraction * usableWidth;
        const near = camera.project(bridge.startWorldY, flatX, t);
        const far = camera.project(bridge.endWorldY, flatX, t);

        if (near.scale < config.perspective.minVisibleScale && far.scale < config.perspective.minVisibleScale) {
          continue; // les deux bouts sont trop loin pour être utiles
        }

        const nearWidth = config.bridge.width * near.scale;
        const farWidth = config.bridge.width * far.scale;

        ctx.fillStyle = config.bridge.color;
        ctx.beginPath();
        ctx.moveTo(near.screenX - nearWidth / 2, near.screenY);
        ctx.lineTo(near.screenX + nearWidth / 2, near.screenY);
        ctx.lineTo(far.screenX + farWidth / 2, far.screenY);
        ctx.lineTo(far.screenX - farWidth / 2, far.screenY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = Math.max(1, 2 * near.scale);
        ctx.stroke();
      }
    }

    _drawTiles(tiles, t) {
      // On dessine des tuiles les plus LOINTAINES aux plus PROCHES,
      // pour que les grandes tuiles proches recouvrent correctement
      // les petites tuiles lointaines si elles se chevauchent à l'écran
      // (comme une vraie scène en perspective).
      for (let i = tiles.length - 1; i >= 0; i--) {
        const tile = tiles[i];

        // Les fausses tuiles (voir docs/GAMEPLAY.md) d'abord : elles
        // sont à la même distance (même worldY) que la vraie tuile,
        // mais sur d'autres positions latérales, donc ne se chevauchent
        // jamais avec elle à l'écran — l'ordre entre les deux n'a pas
        // d'importance. Seuil de visibilité différent (voir
        // `tile.decoyMinVisibleScale`) : elles disparaissent bien avant
        // les vraies tuiles, qui doivent rester visibles loin vers
        // l'horizon.
        if (tile.decoys) {
          for (const decoy of tile.decoys) {
            this._drawSingleTile(decoy, t, this.config.tile.decoyColor, this.config.tile.decoyMinVisibleScale);
          }
        }

        const projected = this._drawSingleTile(tile, t, this._tileColor(tile), this.config.perspective.minVisibleScale);

        // Tant que la tuile n'a pas encore été atteinte, on montre
        // directement dessus la zone bonus à viser (voir docs/GAMEPLAY.md).
        // Le reste de la tuile (en bleu) est déjà sûr, pas besoin de le
        // souligner en plus. Les fausses tuiles n'ont jamais cette zone :
        // elles ne rapportent jamais rien.
        if (projected && tile.state === 'pending') {
          this._drawPerfectZone(projected.screenX, projected.screenY, projected.scale);
        }
      }
    }

    // Dessine UNE tuile (vraie ou fausse) et renvoie sa position/échelle
    // à l'écran, ou `null` si elle n'est pas visible (trop loin, ou hors
    // écran) — pour éviter de dupliquer ce calcul de projection entre
    // `_drawTiles` et `_drawPerfectZone`. `minScale` est différent pour
    // une vraie tuile et une fausse tuile (voir `_drawTiles`).
    _drawSingleTile(tile, t, color, minScale) {
      const { ctx, config, camera } = this;
      const flatX = tile.getCenterX(config.canvas.width, config.tile.width);
      const { screenX, screenY, scale } = camera.project(tile.worldY, flatX, t);

      if (scale < minScale) return null; // trop loin pour être utile
      if (screenY < camera.horizonY - 5 || screenY > config.canvas.height + config.tile.height) {
        return null; // hors écran
      }

      const width = config.tile.width * scale;
      const height = config.tile.height * scale;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(
        screenX - width / 2,
        screenY - height / 2,
        width,
        height,
        this._safeCornerRadius(6 * scale, width, height)
      );
      ctx.fill();

      return { screenX, screenY, scale };
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

      // Sur une plateforme de liaison (voir docs/GAMEPLAY.md), la balle
      // roule en continu au lieu de sauter : pas de rebond.
      const offsetY = engine.isOnBridge() ? 0 : ball.getBounceOffsetY(engine.getBouncePhase());
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
