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
      this._levelEl = elements.levelEl;
      this._totalTiles = 0;
      // Le score est cumulé sur TOUTE la partie (plusieurs niveaux, voir
      // core/engine.js), mais la progression affichée doit rester "X / Y
      // tuiles DE CE NIVEAU" — on retient donc le score au moment où le
      // niveau courant a commencé, pour pouvoir en soustraire la part
      // des niveaux précédents.
      this._scoreAtLevelStart = 0;

      eventBus.on('game:start', ({ totalTiles, levelIndex, totalLevels }) => {
        this._totalTiles = totalTiles;
        this._scoreAtLevelStart = 0;
        this._renderLevel(levelIndex, totalLevels);
        this._render(0, 0);
      });
      eventBus.on('level:start', ({ totalTiles, levelIndex, totalLevels, score, runStars }) => {
        this._totalTiles = totalTiles;
        this._scoreAtLevelStart = score;
        this._renderLevel(levelIndex, totalLevels);
        this._render(score, runStars);
      });
      eventBus.on('tile:hit', ({ score, runStars }) => this._render(score, runStars));
    }

    _render(score, runStars) {
      this._scoreEl.textContent = 'Score : ' + score;
      this._progressEl.textContent = (score - this._scoreAtLevelStart) + ' / ' + this._totalTiles;
      this._starsEl.textContent = '⭐ ' + runStars;
    }

    _renderLevel(levelIndex, totalLevels) {
      this._levelEl.textContent = 'Niveau ' + (levelIndex + 1) + ' / ' + totalLevels;
    }
  }

  TH.Hud = Hud;
})(window.TH = window.TH || {});
