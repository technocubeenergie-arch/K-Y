/*
 * tile.js
 * ------------------------------------------------------------
 * Role: décrit UNE tuile : où elle est, et si elle a été touchée
 * ou ratée. Une tuile ne sait pas se dessiner (ça, c'est le
 * travail du renderer) ni bouger toute seule (ça, c'est la caméra
 * qui décale tout le monde). Elle ne fait que stocker son état.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Tile {
    constructor(index, worldY, xFraction, expectedTime) {
      this.index = index;
      this.worldY = worldY; // position fixe dans le "monde" du niveau
      this.xFraction = xFraction; // 0 = bord gauche, 1 = bord droit
      // Horaire (secondes depuis le début du niveau) auquel cette tuile
      // doit atteindre la ligne d'impact. Pour le niveau d'entraînement,
      // c'est un tempo régulier (index × hopInterval) ; pour un niveau
      // généré à partir d'une musique importée (voir beatDetector.js),
      // ce sont les horaires réels détectés dans le morceau — d'où
      // l'engine.js ne suppose jamais un intervalle fixe entre 2 tuiles.
      this.expectedTime = expectedTime;
      // 'pending' -> pas encore atteinte, 'hit' -> réussie, 'missed' -> ratée
      this.state = 'pending';
      // true si la tuile a été touchée pile au centre (voir engine.js) :
      // ça rapporte une étoile en plus du point normal.
      this.isPerfect = false;
      // Optionnel : posé par level/levelSequencer.js sur une tuile
      // RÉELLE, une liste de "fausses tuiles" (elles-mêmes de simples
      // Tile) à afficher au même horaire, sur d'autres positions
      // latérales. Purement visuel : core/engine.js ne lit jamais cette
      // propriété, seul render/renderer.js s'en sert.
      this.decoys = null;
    }

    getCenterX(canvasWidth, tileWidth) {
      const margin = tileWidth / 2;
      const usableWidth = canvasWidth - margin * 2;
      return margin + this.xFraction * usableWidth;
    }
  }

  TH.Tile = Tile;
})(window.TH = window.TH || {});
