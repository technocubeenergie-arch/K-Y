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
    constructor(index, worldY, xFraction) {
      this.index = index;
      this.worldY = worldY; // position fixe dans le "monde" du niveau
      this.xFraction = xFraction; // 0 = bord gauche, 1 = bord droit
      // 'pending' -> pas encore atteinte, 'hit' -> réussie, 'missed' -> ratée
      this.state = 'pending';
      // true si la tuile a été touchée pile au centre (voir engine.js) :
      // ça rapporte une étoile en plus du point normal.
      this.isPerfect = false;
    }

    getCenterX(canvasWidth, tileWidth) {
      const margin = tileWidth / 2;
      const usableWidth = canvasWidth - margin * 2;
      return margin + this.xFraction * usableWidth;
    }
  }

  TH.Tile = Tile;
})(window.TH = window.TH || {});
