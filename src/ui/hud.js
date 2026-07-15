/*
 * hud.js
 * ------------------------------------------------------------
 * Role: le HUD (Head-Up Display) = les infos affichées PENDANT
 * la partie : le score, la progression dans le niveau, et les
 * étoiles gagnées pendant cette partie.
 *
 * Ce module ne connaît pas les règles du jeu : il s'abonne juste
 * aux événements de l'eventBus ("tile:hit", "game:start"...) et
 * met à jour le texte à l'écran en conséquence. Le nombre total de
 * tuiles vient de l'événement `game:start` (et non d'une valeur figée
 * à la création du HUD), pour que ça reste juste même si le niveau
 * change en cours de route (par ex. un niveau généré à partir d'une
 * musique importée, voir main.js).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Hud {
    constructor(elements, eventBus) {
      this._scoreEl = elements.scoreEl;
      this._progressEl = elements.progressEl;
      this._starsEl = elements.starsEl;
      this._totalTiles = 0;

      eventBus.on('game:start', ({ totalTiles }) => {
        this._totalTiles = totalTiles;
        this._render(0, 0);
      });
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
