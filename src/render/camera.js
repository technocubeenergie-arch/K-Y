/*
 * camera.js
 * ------------------------------------------------------------
 * Role: LE DÉFILEMENT. C'est le module le plus important pour
 * corriger le problème "le jeu est statique" : c'est lui qui fait
 * avancer le monde tout seul, sans que le joueur ait à s'en occuper.
 *
 * Principe : chaque tuile a une position fixe "dans le monde"
 * (worldY, définie une fois pour toutes par levelSequencer). La
 * caméra avance dans le temps (scrollY augmente tout le temps),
 * et ce module calcule à quelle hauteur À L'ÉCRAN chaque tuile
 * doit être dessinée à cet instant précis.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Camera {
    constructor(scrollSpeed, hitLineY) {
      this.scrollSpeed = scrollSpeed; // pixels/seconde
      this.hitLineY = hitLineY;
    }

    // Distance déjà parcourue dans le monde, à l'instant t (secondes).
    getScrollDistance(t) {
      return this.scrollSpeed * t;
    }

    // Convertit la position "monde" d'une tuile en position "écran".
    worldToScreenY(worldY, t) {
      return this.hitLineY - worldY + this.getScrollDistance(t);
    }
  }

  TH.Camera = Camera;
})(window.TH = window.TH || {});
