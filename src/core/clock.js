/*
 * clock.js
 * ------------------------------------------------------------
 * Role: gestion du temps, et RIEN d'autre.
 *
 * Ce module sait dire "combien de secondes se sont écoulées
 * depuis le début du niveau ?", et sait se mettre en pause.
 * Il ne connaît ni la balle, ni les tuiles, ni la musique.
 *
 * Astuce importante pour un jeu rythmique : on utilise l'horloge
 * de l'AudioContext (fournie par audioManager) quand elle existe,
 * car c'est l'horloge la plus précise du navigateur pour rester
 * synchro avec la musique. Si l'audio n'est pas prêt, on retombe
 * sur performance.now() (horloge classique du navigateur).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class Clock {
    // `offsetSeconds` (voir config.audio.globalOffsetMs) : décalage de
    // calibration appliqué à CHAQUE lecture du temps. Une chaîne
    // audio→haut-parleurs a toujours un peu de latence matérielle
    // (variable selon l'appareil), invisible dans `AudioContext.currentTime`
    // lui-même : ce réglage permet de la compenser à l'oreille, sans
    // toucher au reste des calculs. Positif = les tuiles/la ligne
    // d'impact "attendent" un peu plus longtemps avant de considérer
    // qu'un horaire est arrivé (utile si le son sort plus tard que ce
    // que le code croit).
    constructor(getAudioTime, offsetSeconds = 0) {
      // Fonction optionnelle fournie par l'audio pour lire l'heure précise.
      this._getAudioTime = getAudioTime || null;
      this._offsetSeconds = offsetSeconds;
      this._startTime = 0;
      this._pausedAt = 0;
      this._pauseAccumulated = 0;
      this._isPaused = true;
    }

    _now() {
      if (this._getAudioTime) return this._getAudioTime();
      return performance.now() / 1000;
    }

    // Démarre (ou redémarre) le chrono à zéro.
    // `atTime` permet de caler précisément le départ sur un instant
    // audio déjà programmé (voir audioManager.playTrack), pour que
    // le jeu et la musique démarrent exactement ensemble.
    start(atTime) {
      this._startTime = atTime !== undefined ? atTime : this._now();
      this._pauseAccumulated = 0;
      this._isPaused = false;
    }

    pause() {
      if (this._isPaused) return;
      this._pausedAt = this._now();
      this._isPaused = true;
    }

    resume() {
      if (!this._isPaused) return;
      this._pauseAccumulated += this._now() - this._pausedAt;
      this._isPaused = false;
    }

    get isPaused() {
      return this._isPaused;
    }

    // Temps écoulé depuis start(), en secondes, hors pauses.
    getElapsedSeconds() {
      const reference = this._isPaused ? this._pausedAt : this._now();
      return reference - this._startTime - this._pauseAccumulated + this._offsetSeconds;
    }
  }

  TH.Clock = Clock;
})(window.TH = window.TH || {});
