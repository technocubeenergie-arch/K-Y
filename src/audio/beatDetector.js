/*
 * beatDetector.js
 * ------------------------------------------------------------
 * Role: ANALYSER un morceau de musique pour trouver ses "coups"
 * (onsets) : les moments où le son a un sursaut d'énergie (une
 * grosse caisse, une percussion, une note jouée fort...).
 *
 * C'est ce qui permet de générer les tuiles à partir d'une VRAIE
 * musique importée : avant, on composait la musique pour qu'elle
 * suive des tuiles déjà fixées (le tempo était décidé d'abord). Ici,
 * c'est l'inverse : on écoute la musique, et les tuiles suivent ce
 * qu'on y trouve (voir docs/GAMEPLAY.md).
 *
 * Principe (une technique simple et classique, "flux d'énergie") :
 *  1. découper le son en toutes petites tranches de temps ;
 *  2. mesurer l'énergie (le volume) de chaque tranche ;
 *  3. repérer les tranches où l'énergie AUGMENTE brusquement (une
 *     baisse de volume n'est jamais un "coup") ;
 *  4. ne garder que les vrais pics, pas trop rapprochés entre eux,
 *     et nettement plus forts que le volume moyen du moment.
 *
 * Ce n'est pas un détecteur de rythme "parfait" (un vrai outil pro
 * analyserait plusieurs bandes de fréquences séparément) : c'est une
 * version simple, sans dépendance externe, suffisante pour transformer
 * une musique en tuiles jouables.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  const DEFAULT_OPTIONS = {
    windowSize: 1024, // taille d'une tranche d'analyse, en échantillons audio
    minIntervalSeconds: 0.45, // écart minimum entre deux tuiles (temps de réaction)
    sensitivity: 1.4, // un pic doit dépasser la moyenne locale de ce facteur
    localWindowSeconds: 1.0, // fenêtre utilisée pour calculer la "moyenne locale"
  };

  // Mélange tous les canaux (stéréo, etc.) en un seul signal mono :
  // plus simple à analyser, et le rythme ne dépend pas du canal.
  function toMonoSamples(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const mono = new Float32Array(audioBuffer.length);

    for (let channel = 0; channel < channelCount; channel++) {
      const data = audioBuffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        mono[i] += data[i] / channelCount;
      }
    }
    return mono;
  }

  // Énergie (RMS, "volume") de chaque tranche de `windowSize` échantillons.
  function computeEnergyEnvelope(samples, windowSize) {
    const frameCount = Math.floor(samples.length / windowSize);
    const energy = new Float32Array(frameCount);

    for (let frame = 0; frame < frameCount; frame++) {
      let sumOfSquares = 0;
      const start = frame * windowSize;
      for (let i = 0; i < windowSize; i++) {
        const sample = samples[start + i];
        sumOfSquares += sample * sample;
      }
      energy[frame] = Math.sqrt(sumOfSquares / windowSize);
    }
    return energy;
  }

  // "Flux" : de combien l'énergie a AUGMENTÉ par rapport à la tranche
  // précédente. Les baisses d'énergie sont ignorées (ramenées à 0).
  function computeFlux(energy) {
    const flux = new Float32Array(energy.length);
    for (let i = 1; i < energy.length; i++) {
      flux[i] = Math.max(0, energy[i] - energy[i - 1]);
    }
    return flux;
  }

  // Repère les pics du flux qui dépassent nettement la moyenne locale
  // (adaptative : un passage calme et un passage fort n'ont pas la
  // même échelle), en respectant un écart minimum entre deux pics.
  function pickPeaks(flux, framesPerSecond, options) {
    const localWindowFrames = Math.max(1, Math.round(options.localWindowSeconds * framesPerSecond));
    const minIntervalFrames = Math.max(1, Math.round(options.minIntervalSeconds * framesPerSecond));

    const onsetTimes = [];
    let lastPeakFrame = -Infinity;

    for (let i = 1; i < flux.length - 1; i++) {
      const isLocalMax = flux[i] > flux[i - 1] && flux[i] >= flux[i + 1];
      if (!isLocalMax) continue;
      if (i - lastPeakFrame < minIntervalFrames) continue;

      const windowStart = Math.max(0, i - localWindowFrames);
      const windowEnd = Math.min(flux.length, i + localWindowFrames);
      let sum = 0;
      for (let j = windowStart; j < windowEnd; j++) sum += flux[j];
      const localAverage = sum / (windowEnd - windowStart);

      if (flux[i] > localAverage * options.sensitivity && flux[i] > 0.0001) {
        onsetTimes.push(i / framesPerSecond);
        lastPeakFrame = i;
      }
    }
    return onsetTimes;
  }

  // Analyse un AudioBuffer déjà décodé et renvoie la liste des horaires
  // (en secondes depuis le début du morceau) où un "coup" a été détecté.
  function detectOnsets(audioBuffer, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
    const samples = toMonoSamples(audioBuffer);
    const energy = computeEnergyEnvelope(samples, options.windowSize);
    const flux = computeFlux(energy);
    const framesPerSecond = audioBuffer.sampleRate / options.windowSize;
    return pickPeaks(flux, framesPerSecond, options);
  }

  TH.BeatDetector = { detectOnsets };
})(window.TH = window.TH || {});
