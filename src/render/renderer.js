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
    }

    render(engine) {
      const t = engine.getElapsedSeconds();

      this._drawBackground();
      this._drawBridges(engine.sequence.bridges, t);
      this._drawLevelBanners(engine.sequence.levelBanners, t);
      this._drawTiles(engine.sequence.tiles, t);
      this._drawHitLine();
      this._drawBall(engine);
      if (this.config.debug.showTiming) this._drawDebugTiming(engine);
    }

    // Les bandeaux "NIVEAU X" (un par niveau sauf le premier) ont une
    // position FIXE dans le monde, posée une fois pour toutes par
    // `level/levelSequencer.js` (`combineLevelSequences`) — exactement
    // comme une tuile. Pas d'état à gérer ici : on les projette et on
    // les dessine chaque image, seulement s'ils sont dans une échelle
    // utile (comme `_drawSingleTile`). C'est ce qui garantit qu'ils
    // arrivent et défilent SUR LE CHEMIN, à la suite des tuiles, sans
    // jamais interrompre le jeu ni "sauter" au changement de niveau
    // (voir docs/GAMEPLAY.md, "aucune coupure entre deux niveaux").
    _drawLevelBanners(banners, t) {
      if (!banners) return;
      for (const banner of banners) {
        this._drawSingleLevelBanner(banner, t);
      }
    }

    // Une vraie PLATEFORME barre tout le chemin (même logique qu'une
    // tuile géante, voir `_drawSingleTile`/`_drawBridges`), avec le
    // texte dessus : ça se lit comme un élément DU PARCOURS qui défile
    // à la suite des tuiles, pas comme du texte flottant par-dessus le
    // jeu (retour de Ylonna après avoir vu le premier essai).
    _drawSingleLevelBanner(banner, t) {
      const { ctx, config, camera } = this;
      const { screenX, screenY, scale } = camera.project(banner.worldY, config.canvas.width / 2, t);

      // Trop loin pour être utile, ou déjà bien passée la ligne
      // d'impact : rien à dessiner (même idée que `_drawSingleTile`).
      // `bannerMaxScale` coupe BIEN avant que le bandeau ne grossisse
      // jusqu'à recouvrir la balle (contrairement aux tuiles) : il
      // reste ainsi toujours visible plus haut à l'écran (retour de
      // Ylonna).
      if (scale < config.perspective.minVisibleScale || scale > config.levels.bannerMaxScale) return;

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
          this._drawPerfectZone(projected.screenX, projected.screenY, projected.scale, tile.tiltDirection);
        }
      }
    }

    // Position latérale "à plat" (avant perspective) d'une tuile, à
    // l'instant `t` : normalement fixe (`tile.getCenterX`), sauf pour
    // une tuile glissante (voir entities/tile.js, `slidesRightToLeft`),
    // qui part du bord DROIT du chemin entier (comme une tuile qui
    // serait sur la position la plus à droite, `xFraction = 1`) et
    // glisse SUR TOUTE LA LONGUEUR du chemin, dès `tile.slideStartTime`
    // (l'horaire de la tuile précédente, voir level/levelSequencer.js),
    // jusqu'à sa position réelle, pile au moment où elle atteint la
    // ligne d'impact (`tile.expectedTime`) — ce qui garantit que
    // `core/engine.js` (qui compare toujours à `tile.getCenterX`,
    // jamais à cette fonction) juge le contact exactement là où la
    // tuile se trouve VRAIMENT au moment du saut, sans avoir besoin
    // d'en savoir quoi que ce soit.
    _effectiveFlatX(tile, t) {
      const { config } = this;
      const baseFlatX = tile.getCenterX(config.canvas.width, config.tile.width);
      if (!tile.slidesRightToLeft) return baseFlatX;

      const rightEdgeFlatX = config.canvas.width - config.tile.width / 2;
      if (t <= tile.slideStartTime) return rightEdgeFlatX;
      if (t >= tile.expectedTime) return baseFlatX;

      const duration = tile.expectedTime - tile.slideStartTime;
      const phase = duration > 0 ? (t - tile.slideStartTime) / duration : 1;
      return TH.MathUtils.lerp(rightEdgeFlatX, baseFlatX, phase);
    }

    // Dessine UNE tuile (vraie ou fausse) et renvoie sa position/échelle
    // à l'écran, ou `null` si elle n'est pas visible (trop loin, ou hors
    // écran) — pour éviter de dupliquer ce calcul de projection entre
    // `_drawTiles` et `_drawPerfectZone`. `minScale` est différent pour
    // une vraie tuile et une fausse tuile (voir `_drawTiles`).
    _drawSingleTile(tile, t, color, minScale) {
      const { ctx, config, camera } = this;
      const flatX = this._effectiveFlatX(tile, t);
      const { screenX, screenY, scale } = camera.project(tile.worldY, flatX, t);

      if (scale < minScale) return null; // trop loin pour être utile
      if (screenY < camera.horizonY - 5 || screenY > config.canvas.height + config.tile.height) {
        return null; // hors écran
      }

      const width = config.tile.width * scale;
      const height = config.tile.height * scale;

      // Tuile inclinée (voir entities/tile.js, tiltDirection) : purement
      // visuel, on tourne juste le dessin autour de son propre centre —
      // la zone de contact réelle (`getCenterX`, utilisée par
      // core/engine.js) ne bouge jamais.
      ctx.save();
      ctx.translate(screenX, screenY);
      if (tile.tiltDirection) {
        ctx.rotate(tile.tiltDirection * config.tile.inclineAngle);
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, this._safeCornerRadius(6 * scale, width, height));
      ctx.fill();
      ctx.restore();

      return { screenX, screenY, scale };
    }

    _drawPerfectZone(screenX, screenY, scale, tiltDirection) {
      const { ctx, config } = this;
      const width = config.tile.width * config.tile.perfectZoneRatio * scale;
      const height = config.tile.height * scale;

      // Même rotation que la tuile (voir `_drawSingleTile`), pour que la
      // zone bonus reste posée dessus au lieu de flotter à côté.
      ctx.save();
      ctx.translate(screenX, screenY);
      if (tiltDirection) {
        ctx.rotate(tiltDirection * config.tile.inclineAngle);
      }
      ctx.fillStyle = config.tile.perfectZonePreviewColor;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, this._safeCornerRadius(5 * scale, width, height));
      ctx.fill();
      ctx.restore();
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
