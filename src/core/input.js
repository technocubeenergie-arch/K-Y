/*
 * input.js
 * ------------------------------------------------------------
 * Role: TRADUIRE ce que fait le joueur (glisser le doigt/la souris,
 * appuyer sur les flèches) en une seule chose que la balle comprend :
 * "va vers cette position X". Ce module ne connaît ni les tuiles,
 * ni le score : juste comment lire les entrées du joueur.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class InputController {
    constructor(canvas, ball, config) {
      this._canvas = canvas;
      this._ball = ball;
      this._config = config;
      this._isDragging = false;

      canvas.addEventListener('pointerdown', (event) => {
        this._isDragging = true;
        this._applyClientX(event.clientX);
      });
      window.addEventListener('pointermove', (event) => {
        if (this._isDragging) this._applyClientX(event.clientX);
      });
      window.addEventListener('pointerup', () => {
        this._isDragging = false;
      });
      window.addEventListener('pointercancel', () => {
        this._isDragging = false;
      });
      window.addEventListener('keydown', (event) => this._handleKey(event));
    }

    _applyClientX(clientX) {
      const rect = this._canvas.getBoundingClientRect();
      const scaleX = this._config.canvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      this._ball.setTargetX(canvasX);
    }

    _handleKey(event) {
      const step = this._config.tile.width * 0.5;
      if (event.key === 'ArrowLeft') this._ball.nudgeTargetX(-step);
      if (event.key === 'ArrowRight') this._ball.nudgeTargetX(step);
    }
  }

  TH.InputController = InputController;
})(window.TH = window.TH || {});
