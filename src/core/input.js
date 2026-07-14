/*
 * input.js
 * ------------------------------------------------------------
 * Role: TRADUIRE ce que fait le joueur (glisser le doigt/la souris,
 * appuyer sur les flèches) en une seule chose que la balle comprend :
 * "va vers cette position X". Ce module ne connaît ni les tuiles,
 * ni le score : juste comment lire les entrées du joueur.
 *
 * Pour le clavier, on ne bouge pas la balle directement au moment où
 * la touche est pressée : on retient juste "cette flèche est
 * actuellement enfoncée", et c'est update(dt), appelée à chaque image
 * par la boucle de jeu, qui fait avancer la balle petit à petit tant
 * que la touche reste appuyée. C'est ce qui rend le mouvement fluide
 * au lieu de saccadé (voir docs/BUGS.md, BUG-004).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  const MOVE_KEYS = {
    ArrowLeft: -1,
    ArrowRight: 1,
  };

  class InputController {
    constructor(canvas, ball, config) {
      this._canvas = canvas;
      this._ball = ball;
      this._config = config;
      this._isDragging = false;
      this._pressedKeys = new Set();

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

      window.addEventListener('keydown', (event) => {
        if (!(event.key in MOVE_KEYS)) return;
        event.preventDefault(); // empêche la page de défiler avec les flèches
        this._pressedKeys.add(event.key);
      });
      window.addEventListener('keyup', (event) => {
        this._pressedKeys.delete(event.key);
      });
      // Si le joueur change de fenêtre/onglet en maintenant une touche,
      // on n'aura jamais le "keyup" correspondant : on oublie tout pour
      // éviter que la balle continue de glisser toute seule.
      window.addEventListener('blur', () => this._pressedKeys.clear());
    }

    _applyClientX(clientX) {
      const rect = this._canvas.getBoundingClientRect();
      const scaleX = this._config.canvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      this._ball.setTargetX(canvasX);
    }

    // Appelée à chaque image par gameLoop.js.
    update(dt) {
      let direction = 0;
      for (const key of this._pressedKeys) {
        direction += MOVE_KEYS[key];
      }
      if (direction === 0) return;
      this._ball.nudgeTargetX(direction * this._config.ball.keyboardSpeed * dt);
    }
  }

  TH.InputController = InputController;
})(window.TH = window.TH || {});
