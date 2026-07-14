/*
 * camera.js
 * ------------------------------------------------------------
 * Role: LE DÉFILEMENT ET LA PERSPECTIVE. C'est le module le plus
 * important pour corriger le problème "le jeu est statique" : c'est
 * lui qui fait avancer le monde tout seul, sans que le joueur ait à
 * s'en occuper. Il donne aussi au jeu son effet "vu depuis derrière
 * la balle" (une route qui s'éloigne vers l'horizon), plutôt qu'une
 * vue du dessus bien plate.
 *
 * Principe : chaque tuile a une position fixe "dans le monde"
 * (worldY, définie une fois pour toutes par levelSequencer). La
 * caméra avance dans le temps (scrollY augmente tout le temps), ce
 * qui rapproche chaque tuile de la ligne d'impact. Ce module calcule,
 * pour un instant donné, la position ET la taille À L'ÉCRAN d'une
 * tuile : plus elle est loin, plus elle est petite et proche du
 * centre (vers le point de fuite) ; plus elle est proche, plus elle
 * est grande et écartée (comme une vraie route qui s'élargit).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Camera {
    constructor(scrollSpeed, config) {
      this.scrollSpeed = scrollSpeed; // pixels/seconde
      this.hitLineY = config.hitLine.y;
      this.horizonY = config.perspective.horizonY;
      this.focalDepth = config.perspective.focalDepth;
      this.vanishingPointX = config.canvas.width / 2;
    }

    // Distance déjà parcourue dans le monde, à l'instant t (secondes).
    getScrollDistance(t) {
      return this.scrollSpeed * t;
    }

    // "Profondeur" d'un point : distance qu'il lui reste à parcourir
    // avant d'atteindre la ligne d'impact. Positif = pas encore arrivé,
    // 0 = pile dessus, négatif = déjà passé (repasse "devant" la caméra).
    getDepth(worldY, t) {
      return worldY - this.getScrollDistance(t);
    }

    // Projette une position du monde (worldY = distance dans le niveau,
    // flatX = position latérale "à plat", calculée sans perspective par
    // ex. via tile.getCenterX) vers l'écran : position ET échelle.
    project(worldY, flatX, t) {
      // On évite que la profondeur ne s'approche trop de -focalDepth,
      // ce qui ferait exploser l'échelle (division par presque zéro).
      const depth = Math.max(this.getDepth(worldY, t), -this.focalDepth * 0.9);
      const scale = this.focalDepth / (this.focalDepth + depth);
      const screenY = this.horizonY + (this.hitLineY - this.horizonY) * scale;
      const screenX = this.vanishingPointX + (flatX - this.vanishingPointX) * scale;
      return { screenX, screenY, scale };
    }
  }

  TH.Camera = Camera;
})(window.TH = window.TH || {});
