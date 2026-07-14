/*
 * musicGenerator.js
 * ------------------------------------------------------------
 * Role: COMPOSE la musique temporaire du niveau d'entraînement,
 * directement en code (Web Audio API), sans aucun fichier .mp3.
 *
 * C'est un asset "procédural" temporaire (voir assetManifest.js) :
 * plus tard, on pourra le remplacer par une vraie musique en
 * changeant juste audioManager.js, sans toucher au reste du jeu.
 *
 * Idée clé : chaque tuile du niveau correspond à UNE note de la
 * mélodie, jouée pile au moment où la tuile arrive sur la ligne
 * d'impact. La hauteur de la note dépend de la position de la
 * tuile (gauche = grave, droite = aigu). C'est ce qui fait que
 * "la musique et les tuiles sont liées".
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // Gamme pentatonique (do majeur) : sonne agréable même jouée au hasard.
  const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0]; // C4 D4 E4 G4 A4

  function noteFrequencyForXFraction(xFraction) {
    const index = Math.min(SCALE.length - 1, Math.floor(xFraction * SCALE.length));
    return SCALE[index];
  }

  // Joue un son simple (oscillateur) avec une enveloppe douce
  // (attaque/chute) pour éviter les "clics" désagréables.
  function playTone(audioCtx, destination, { freq, startTime, duration, type, peakGain }) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain).connect(destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function scheduleKick(audioCtx, destination, startTime) {
    playTone(audioCtx, destination, {
      freq: 90,
      startTime,
      duration: 0.18,
      type: 'sine',
      peakGain: 0.35,
    });
  }

  function scheduleMelodyNote(audioCtx, destination, startTime, xFraction) {
    playTone(audioCtx, destination, {
      freq: noteFrequencyForXFraction(xFraction),
      startTime,
      duration: 0.28,
      type: 'triangle',
      peakGain: 0.22,
    });
  }

  function scheduleHat(audioCtx, destination, startTime) {
    playTone(audioCtx, destination, {
      freq: 1200,
      startTime,
      duration: 0.05,
      type: 'square',
      peakGain: 0.03,
    });
  }

  // Compose et programme toute la boucle du niveau d'entraînement
  // en une fois, dès le lancement (pas besoin de rejouer en boucle
  // pendant la partie : tout est calculé à l'avance).
  function schedule(audioCtx, destination, startTime, sequence, config) {
    const totalBeats = Math.round(
      sequence.totalDurationSeconds / sequence.beatInterval
    );

    for (let beat = 0; beat < totalBeats; beat++) {
      const beatTime = startTime + beat * sequence.beatInterval;
      scheduleKick(audioCtx, destination, beatTime);
      // Un charleston léger sur les temps "creux" entre deux tuiles.
      if (config.music.hopBeats > 1 && beat % config.music.hopBeats !== 0) {
        scheduleHat(audioCtx, destination, beatTime);
      }
    }

    sequence.tiles.forEach((tile, index) => {
      const noteTime = startTime + index * sequence.hopInterval;
      scheduleMelodyNote(audioCtx, destination, noteTime, tile.xFraction);
    });
  }

  TH.MusicGenerator = { schedule };
})(window.TH = window.TH || {});
