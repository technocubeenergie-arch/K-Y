/*
 * audioManager.js
 * ------------------------------------------------------------
 * Role: le SEUL fichier qui touche à l'API audio du navigateur
 * (Web Audio). Le reste du jeu ne connaît jamais AudioContext :
 * il appelle juste audioManager.playMusic(), .playLandSound(), etc.
 *
 * Pourquoi c'est important : le jour où on remplace la musique
 * générée par un vrai fichier .mp3, on ne modifie QUE ce fichier.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class AudioManager {
    constructor() {
      this._audioCtx = null;
      this._musicGain = null;
      this._sfxGain = null;
    }

    // Doit être appelé suite à un clic/tap du joueur (règle des
    // navigateurs : pas de son avant une interaction utilisateur).
    init() {
      if (this._audioCtx) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this._audioCtx = new AudioContextClass();
      this._sfxGain = this._audioCtx.createGain();
      this._sfxGain.gain.value = 0.5;
      this._sfxGain.connect(this._audioCtx.destination);
    }

    async resumeIfNeeded() {
      if (this._audioCtx && this._audioCtx.state === 'suspended') {
        await this._audioCtx.resume();
      }
    }

    // Gèle complètement l'audio (plus aucun son, et le temps audio
    // lui-même arrête d'avancer). C'est ce qui garde la musique et le
    // jeu parfaitement synchronisés pendant une pause : sans ça, la
    // musique continuerait de jouer "en avance" pendant que le jeu est
    // figé, et tout serait décalé au retour (voir docs/BUGS.md, BUG-007).
    pause() {
      if (this._audioCtx && this._audioCtx.state === 'running') {
        this._audioCtx.suspend();
      }
    }

    // Horloge audio précise, utilisée par core/clock.js pour rester
    // parfaitement synchronisé avec la musique.
    getAudioTime() {
      return this._audioCtx ? this._audioCtx.currentTime : 0;
    }

    _createMusicGain() {
      this._musicGain = this._audioCtx.createGain();
      this._musicGain.gain.value = 0.6;
      this._musicGain.connect(this._audioCtx.destination);
      return this._musicGain;
    }

    // Compose et lance la musique du niveau. Renvoie l'heure audio
    // exacte de démarrage, pour que l'horloge du jeu s'aligne dessus.
    playMusic(sequence, config) {
      const gain = this._createMusicGain();
      const startTime = this._audioCtx.currentTime + 0.15;
      TH.MusicGenerator.schedule(this._audioCtx, gain, startTime, sequence, config);
      return startTime;
    }

    // Télécharge et décode un vrai fichier audio (mp3, etc.) en un
    // AudioBuffer exploitable — par ex. par audio/beatDetector.js pour
    // en extraire le rythme, puis par playTrack() ci-dessous pour le
    // jouer. C'est le SEUL endroit du jeu qui sait lire un fichier audio.
    async loadTrack(url) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return this._audioCtx.decodeAudioData(arrayBuffer);
    }

    // Joue un vrai fichier audio déjà décodé (voir loadTrack), pour un
    // niveau généré à partir d'une musique importée (voir
    // audio/beatDetector.js). Renvoie l'heure audio exacte de
    // démarrage, comme playMusic(), pour que l'horloge du jeu s'aligne
    // dessus de la même façon.
    playTrack(audioBuffer) {
      const gain = this._createMusicGain();
      const source = this._audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gain);

      const startTime = this._audioCtx.currentTime + 0.15;
      source.start(startTime);
      return startTime;
    }

    // Coupe immédiatement toute note en cours ou déjà programmée.
    stopMusic() {
      if (!this._musicGain) return;
      const now = this._audioCtx.currentTime;
      this._musicGain.gain.cancelScheduledValues(now);
      this._musicGain.gain.setValueAtTime(this._musicGain.gain.value, now);
      this._musicGain.gain.linearRampToValueAtTime(0, now + 0.08);
      const gainToDisconnect = this._musicGain;
      setTimeout(() => gainToDisconnect.disconnect(), 200);
      this._musicGain = null;
    }

    _playBlip(freq, duration, type) {
      if (!this._audioCtx) return;
      const now = this._audioCtx.currentTime;
      const osc = this._audioCtx.createOscillator();
      const gain = this._audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain).connect(this._sfxGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    playLandSound() {
      this._playBlip(660, 0.1, 'sine');
    }

    // Son distinct pour un atterrissage "parfait" (voir engine.js) :
    // deux notes rapides et aiguës, pour bien le distinguer d'un simple
    // atterrissage réussi.
    playStarSound() {
      this._playBlip(880, 0.08, 'triangle');
      setTimeout(() => this._playBlip(1318.51, 0.12, 'triangle'), 60);
    }

    playFailSound() {
      this._playBlip(110, 0.4, 'sawtooth');
    }

    playCompleteSound() {
      this._playBlip(523.25, 0.15, 'triangle');
      setTimeout(() => this._playBlip(659.25, 0.2, 'triangle'), 120);
      setTimeout(() => this._playBlip(783.99, 0.3, 'triangle'), 240);
    }
  }

  TH.AudioManager = AudioManager;
})(window.TH = window.TH || {});
