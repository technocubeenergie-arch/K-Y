/*
 * recorder.js
 * ------------------------------------------------------------
 * Role: transformer UN appui sur le bouton (ou la barre ESPACE) en UN
 * événement, pendant que la musique joue :
 *  - appui COURT (relâché avant LONG_PRESS_THRESHOLD_SECONDS) -> une
 *    tuile, un simple instant ;
 *  - appui LONG (tenu plus longtemps) -> un tapis glissant, avec un
 *    début (au moment de presser) et une fin (au moment de relâcher).
 *
 * Ce module ne sait RIEN dessiner ni fusionner : il se contente de
 * lire l'heure de lecture actuelle (fournie de l'extérieur, voir
 * ui.js) au bon moment, et de ranger le résultat dans "la prise en
 * cours". C'est ui.js qui décide quand une prise est terminée et doit
 * être ajoutée à takesStore.js.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  const LONG_PRESS_THRESHOLD_SECONDS = 0.2;

  class Recorder {
    // `getCurrentTime` : fonction qui renvoie l'heure de lecture
    // actuelle (en secondes) — pas une valeur figée, pour toujours lire
    // l'heure la plus fraîche au moment de l'appui/relâchement.
    constructor(getCurrentTime) {
      this._getCurrentTime = getCurrentTime;
      this._pressStartTime = null;
      this._currentTake = { tiles: [], longPlates: [] };
    }

    reset() {
      this._pressStartTime = null;
      this._currentTake = { tiles: [], longPlates: [] };
    }

    getCurrentTake() {
      return this._currentTake;
    }

    isPressing() {
      return this._pressStartTime !== null;
    }

    press() {
      if (this.isPressing()) return; // déjà en train d'appuyer, ignore
      this._pressStartTime = this._getCurrentTime();
    }

    // Renvoie l'événement créé ({type: 'tile', time} ou
    // {type: 'longPlate', start, end}), ou `null` si aucun appui
    // n'était en cours (relâchement "orphelin").
    release() {
      if (!this.isPressing()) return null;

      const start = this._pressStartTime;
      const end = this._getCurrentTime();
      this._pressStartTime = null;

      if (end - start < LONG_PRESS_THRESHOLD_SECONDS) {
        const time = round(start);
        this._currentTake.tiles.push(time);
        return { type: 'tile', time };
      }

      const segment = { start: round(start), end: round(end) };
      this._currentTake.longPlates.push(segment);
      return { type: 'longPlate', start: segment.start, end: segment.end };
    }
  }

  // Arrondi à la milliseconde : suffisant pour un appui humain, et ça
  // évite d'exporter des nombres à 15 décimales illisibles.
  function round(seconds) {
    return Math.round(seconds * 1000) / 1000;
  }

  BE.Recorder = Recorder;
  BE.LONG_PRESS_THRESHOLD_SECONDS = LONG_PRESS_THRESHOLD_SECONDS;
})(window.BE = window.BE || {});
