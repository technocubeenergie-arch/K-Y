/*
 * screens.js
 * ------------------------------------------------------------
 * Role: les écrans qui recouvrent le jeu entre les parties :
 * écran de démarrage, pause, échec, et victoire (tous les niveaux
 * terminés — voir core/engine.js pour la transition silencieuse
 * entre deux niveaux, qui ne montre aucun écran).
 *
 * Comme hud.js, ce module réagit aux événements du jeu (il ne
 * décide jamais des règles). Il connaît juste 3 actions possibles
 * que le joueur peut demander via les boutons : démarrer, mettre
 * en pause/reprendre, rejouer. Ces actions sont transmises via
 * les callbacks passés en paramètre (onStart, onTogglePause,
 * onRetry), pour ne pas dépendre directement de l'engine.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Screens {
    constructor(elements, eventBus, callbacks) {
      this._els = elements;
      this._callbacks = callbacks;

      this._showOnly('start');

      elements.startButton.addEventListener('click', () => callbacks.onStart());
      elements.pauseButton.addEventListener('click', () => callbacks.onTogglePause());
      elements.resumeButton.addEventListener('click', () => callbacks.onTogglePause());
      elements.retryFailButton.addEventListener('click', () => callbacks.onStart());
      elements.retryCompleteButton.addEventListener('click', () => callbacks.onStart());

      eventBus.on('game:start', () => this._showOnly(null));
      eventBus.on('game:pause', () => this._showOnly('pause'));
      eventBus.on('game:resume', () => this._showOnly(null));
      eventBus.on('game:over', (payload) => this._showFail(payload));
      eventBus.on('game:complete', (payload) => this._showComplete(payload));
    }

    _showOnly(name) {
      const screenNames = ['start', 'pause', 'fail', 'complete'];
      for (const screenName of screenNames) {
        this._els[screenName + 'Screen'].classList.toggle('is-visible', screenName === name);
      }
      this._els.pauseButton.classList.toggle('is-visible', name === null);
    }

    _formatResult(payload) {
      const suffix = payload.isNewHighscore ? ' (nouveau record !)' : '';
      return {
        score: 'Score : ' + payload.score + suffix,
        highscore: 'Meilleur score : ' + payload.highscore,
        stars: 'Étoiles gagnées : ' + payload.runStars + ' ⭐ (total : ' + payload.starBalance + ')',
      };
    }

    _showFail(payload) {
      const text = this._formatResult(payload);
      this._els.failLevel.textContent = 'Niveau atteint : ' + payload.levelReached + ' / ' + payload.totalLevels;
      this._els.failScore.textContent = text.score;
      this._els.failHighscore.textContent = text.highscore;
      this._els.failStars.textContent = text.stars;
      this._showOnly('fail');
    }

    _showComplete(payload) {
      const text = this._formatResult(payload);
      this._els.completeScore.textContent = text.score;
      this._els.completeHighscore.textContent = text.highscore;
      this._els.completeStars.textContent = text.stars;
      this._showOnly('complete');
    }
  }

  TH.Screens = Screens;
})(window.TH = window.TH || {});
