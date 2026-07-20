/*
 * audioManager.js
 * ------------------------------------------------------------
 * Role: le SEUL fichier qui touche à l'API audio du navigateur
 * (Web Audio). Le reste du jeu ne connaît jamais AudioContext :
 * il appelle juste audioManager.scheduleLevels(), .playFailSound(), etc.
 *
 * Pourquoi c'est important : le jour où la musique du niveau change
 * (un autre fichier, ou un vrai sélecteur pour le joueur), on ne
 * modifie QUE ce fichier (et main.js pour le brancher).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class AudioManager {
    constructor() {
      this._audioCtx = null;
      this._musicGain = null;
      this._sfxGain = null;
      // Toutes les lectures programmées par scheduleLevels (voir plus
      // bas), pour pouvoir toutes les annuler d'un coup dans stopMusic —
      // y compris celles pas encore commencées (niveaux futurs déjà
      // programmés à l'avance).
      this._scheduledSources = [];
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

    // Décode des données audio déjà en mémoire (un ArrayBuffer) en un
    // AudioBuffer exploitable — par ex. par audio/beatDetector.js pour
    // en extraire le rythme, puis par scheduleLevels() ci-dessous pour
    // le jouer. C'est le SEUL endroit du jeu qui décode un fichier audio.
    // (La musique du niveau est embarquée en base64 dans le JS — voir
    // assets/levelTrackData.js et utils/base64.js — donc aucun
    // téléchargement réseau n'est nécessaire ici.)
    async decodeArrayBuffer(arrayBuffer) {
      return this._audioCtx.decodeAudioData(arrayBuffer);
    }

    // Programme TOUTE la partie (tous les niveaux) EN AVANCE, sur UNE
    // SEULE piste partagée : chaque niveau est une lecture du même
    // fichier (voir decodeArrayBuffer), à sa propre vitesse
    // (`speedMultipliers`, voir config.levels.speedMultipliers),
    // démarrant PILE quand la lecture du niveau précédent s'arrête —
    // bout à bout, sans le moindre silence ni redémarrage audible entre
    // deux niveaux (voir docs/GAMEPLAY.md, "aucune coupure"). Renvoie
    // l'heure de démarrage du tout premier niveau, pour caler l'horloge
    // du jeu dessus (core/clock.js, voir main.js) — cette même horloge
    // ne sera JAMAIS redémarrée entre deux niveaux.
    scheduleLevels(audioBuffer, speedMultipliers) {
      const gain = this._createMusicGain();
      this._scheduledSources = [];

      const baseStartTime = this._audioCtx.currentTime + 0.15;
      let cursor = baseStartTime;

      for (const rate of speedMultipliers) {
        const source = this._audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = rate;
        source.connect(gain);

        const levelDurationSeconds = audioBuffer.duration / rate;
        const nextCursor = cursor + levelDurationSeconds;
        source.start(cursor);
        source.stop(nextCursor); // jamais laissé jouer sur le niveau suivant
        this._scheduledSources.push(source);
        cursor = nextCursor;
      }

      return baseStartTime;
    }

    // Coupe immédiatement toute note en cours, ET annule toute lecture
    // pas encore commencée (niveaux suivants déjà programmés à l'avance
    // par scheduleLevels) : sans ça, la musique d'un niveau jamais
    // atteint (partie arrêtée avant, par un échec) continuerait de
    // démarrer toute seule plus tard.
    stopMusic() {
      if (!this._musicGain) return;
      const now = this._audioCtx.currentTime;
      this._musicGain.gain.cancelScheduledValues(now);
      this._musicGain.gain.setValueAtTime(this._musicGain.gain.value, now);
      this._musicGain.gain.linearRampToValueAtTime(0, now + 0.08);
      for (const source of this._scheduledSources) {
        try {
          source.stop(now);
        } catch (error) {
          // Déjà arrêtée (a fini de jouer naturellement) : rien à faire.
        }
      }
      this._scheduledSources = [];
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
