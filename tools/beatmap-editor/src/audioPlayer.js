/*
 * audioPlayer.js
 * ------------------------------------------------------------
 * Role: charger et jouer le fichier audio choisi par l'utilisateur.
 *
 * Contrairement au jeu (src/audio/audioManager.js, qui utilise
 * l'AudioContext pour une synchronisation très précise), cet outil se
 * contente d'un élément <audio> HTML classique : c'est bien assez
 * précis pour des appuis tapés à la main (la variation naturelle du
 * geste humain domine largement une éventuelle imprécision de lecture),
 * et c'est beaucoup plus simple à charger/jouer/mettre en pause.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  class AudioPlayer {
    constructor(audioElement) {
      this._audio = audioElement;
    }

    // Charge un fichier choisi via <input type="file">. Renvoie une
    // promesse résolue une fois la durée connue (le fichier est prêt à
    // être joué).
    loadFile(file) {
      const url = URL.createObjectURL(file);
      this._audio.src = url;
      return new Promise((resolve, reject) => {
        this._audio.onloadedmetadata = () => resolve(this._audio.duration);
        this._audio.onerror = () => reject(new Error('Impossible de lire ce fichier audio.'));
      });
    }

    play() {
      return this._audio.play();
    }

    pause() {
      this._audio.pause();
    }

    restart() {
      this._audio.currentTime = 0;
    }

    get currentTime() {
      return this._audio.currentTime;
    }

    get duration() {
      return this._audio.duration || 0;
    }

    onTimeUpdate(callback) {
      this._audio.addEventListener('timeupdate', callback);
    }

    onEnded(callback) {
      this._audio.addEventListener('ended', callback);
    }
  }

  BE.AudioPlayer = AudioPlayer;
})(window.BE = window.BE || {});
