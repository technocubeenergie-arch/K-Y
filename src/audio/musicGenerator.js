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
 * La composition (~1 minute, calée sur le tempo du niveau) a 3 voix :
 *  - une grosse caisse à chaque battement ;
 *  - une ligne de basse qui suit une progression d'accords
 *    (La mineur 7 → Fa majeur 7 → Do majeur 7 → Sol 7, un classique) ;
 *  - une mélodie : chaque tuile du niveau correspond à UNE note,
 *    jouée pile au moment où la tuile arrive sur la ligne d'impact.
 *    La hauteur de la note dépend de la position de la tuile (gauche
 *    = grave, droite = aigu) PARMI les notes de l'accord du moment.
 *    C'est ce qui fait que "la musique et les tuiles sont liées", tout
 *    en donnant une vraie progression harmonique à l'ensemble.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // Progression d'accords (La mineur 7, Fa majeur 7, Do majeur 7, Sol 7).
  // `root` = note de basse ; `notes` = 5 notes de l'accord (graves vers
  // aiguës), une par position latérale possible (FL, L, C, R, FR).
  const CHORDS = [
    { root: 110.0, notes: [220.0, 261.63, 329.63, 392.0, 440.0] }, // La mineur 7
    { root: 87.31, notes: [174.61, 220.0, 261.63, 329.63, 349.23] }, // Fa majeur 7
    { root: 130.81, notes: [261.63, 329.63, 392.0, 493.88, 523.25] }, // Do majeur 7
    { root: 98.0, notes: [196.0, 246.94, 293.66, 349.23, 392.0] }, // Sol 7
  ];

  // Nombre de tuiles ("hops") avant de passer à l'accord suivant. Avec
  // 50 tuiles au total, ça donne 5 phrases de 10 tuiles : les 4 accords,
  // puis un retour au premier (La mineur) pour boucler proprement.
  const CHORD_LENGTH_HOPS = 10;

  function getChordForHopIndex(hopIndex) {
    const phraseIndex = Math.floor(hopIndex / CHORD_LENGTH_HOPS);
    return CHORDS[phraseIndex % CHORDS.length];
  }

  function noteFrequencyForXFraction(xFraction, chordNotes) {
    const index = Math.min(chordNotes.length - 1, Math.floor(xFraction * chordNotes.length));
    return chordNotes[index];
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

  function scheduleBass(audioCtx, destination, startTime, rootFreq) {
    playTone(audioCtx, destination, {
      freq: rootFreq,
      startTime,
      duration: 0.32,
      type: 'sine',
      peakGain: 0.26,
    });
  }

  function scheduleMelodyNote(audioCtx, destination, startTime, xFraction, chordNotes) {
    playTone(audioCtx, destination, {
      freq: noteFrequencyForXFraction(xFraction, chordNotes),
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
      const hopIndex = Math.floor(beat / config.music.hopBeats);
      const chord = getChordForHopIndex(hopIndex);

      scheduleKick(audioCtx, destination, beatTime);
      scheduleBass(audioCtx, destination, beatTime, chord.root);
      // Un charleston léger sur les temps "creux" entre deux tuiles.
      if (config.music.hopBeats > 1 && beat % config.music.hopBeats !== 0) {
        scheduleHat(audioCtx, destination, beatTime);
      }
    }

    sequence.tiles.forEach((tile, index) => {
      const noteTime = startTime + index * sequence.hopInterval;
      const chord = getChordForHopIndex(index);
      scheduleMelodyNote(audioCtx, destination, noteTime, tile.xFraction, chord.notes);
    });
  }

  TH.MusicGenerator = { schedule };
})(window.TH = window.TH || {});
