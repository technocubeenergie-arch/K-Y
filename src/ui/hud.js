/*
 * hud.js
 * ------------------------------------------------------------
 * Role: le HUD (Head-Up Display) = les infos affichées PENDANT
 * la partie : le score, la progression dans le niveau, et les
 * étoiles gagnées pendant cette partie.
 *
 * Ce module ne connaît pas les règles du jeu : il s'abonne juste
 * aux événements de l'eventBus ("tile:hit", "game:start"...) et
 * met à jour le texte à l'écran en conséquence.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Hud {
    constructor(elements, eventBus, totalTiles) {
      this._scoreEl = elements.scoreEl;
      this._progressEl = elements.progressEl;
      this._starsEl = elements.starsEl;
      this._totalTiles = totalTiles;

      eventBus.on('game:start', () => this._render(0, 0));
      eventBus.on('tile:hit', ({ score, runStars }) => this._render(score, runStars));
    }

    _render(score, runStars) {
      this._scoreEl.textContent = 'Score : ' + score;
      this._progressEl.textContent = score + ' / ' + this._totalTiles;
      this._starsEl.textContent = '⭐ ' + runStars;
    }
  }

  TH.Hud = Hud;
})(window.TH = window.TH || {});
