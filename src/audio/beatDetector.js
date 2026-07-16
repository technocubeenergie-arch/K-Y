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
 * Principe (deux techniques simples et classiques, sans dépendance
 * externe) :
 *  1. découper le son en toutes petites tranches de temps, et mesurer
 *     l'énergie (le volume) de chaque tranche, puis de combien elle
 *     AUGMENTE par rapport à la tranche précédente ("flux") — une
 *     baisse de volume n'est jamais un "coup" ;
 *  2. plutôt que de chercher des pics au hasard dans ce flux (ce qui
 *     peut laisser passer un coup plus discret, faisant "flotter" la
 *     balle sans tuile pendant qu'on entend pourtant une note), on
 *     commence par trouver le POULS régulier du morceau
 *     (autocorrélation, voir `estimateTempoIntervalFrames`) puis on
 *     place une tuile
 *     à chaque position de cette grille régulière, en cherchant le
 *     plus grand sursaut d'énergie tout autour (pour rester tolérant
 *     à un morceau pas joué mécaniquement). Une position sans aucun
 *     sursaut clair reste vide (silence, vraie pause), sinon quasiment
 *     chaque temps du morceau obtient sa tuile.
 *
 * Ce n'est pas un détecteur de rythme "parfait" (un vrai outil pro
 * analyserait plusieurs bandes de fréquences séparément, et gérerait
 * les changements de tempo en cours de morceau) : c'est une version
 * simple, suffisante pour transformer une musique à tempo à peu près
 * stable en tuiles jouables, bien synchronisées avec ce qu'on entend.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  const DEFAULT_OPTIONS = {
    windowSize: 1024, // taille d'une tranche d'analyse, en échantillons audio
    minIntervalSeconds: 0.45, // écart minimum entre deux tuiles (temps de réaction) ET tempo le plus rapide recherché
    maxIntervalSeconds: 1.4, // tempo le plus lent recherché, pour borner la recherche du pouls du morceau
    sensitivity: 1.4, // un sursaut d'énergie doit dépasser la moyenne locale de ce facteur pour devenir une tuile
    localWindowSeconds: 1.0, // fenêtre utilisée pour calculer la "moyenne locale"
    toleranceRatio: 0.3, // tolérance de recherche autour de chaque position de la grille (fraction du pouls détecté)
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

  // Trouve le pouls régulier du morceau par autocorrélation : on
  // compare le flux à lui-même décalé de `lag` tranches, pour tous les
  // décalages plausibles (entre `minIntervalSeconds` et
  // `maxIntervalSeconds`). Un signal périodique ressemble beaucoup à
  // lui-même décalé d'exactement une période — mais aussi décalé de 2,
  // 3 fois cette période (chaque "double coup" retombe aussi juste) :
  // sans précaution, cette recherche a tendance à préférer un multiple
  // du vrai pouls (trop lent) plutôt que le pouls lui-même. On prend
  // donc le PLUS PETIT décalage qui produit déjà un pic net de
  // ressemblance (au moins 85% du meilleur score trouvé sur toute la
  // plage), plutôt que le meilleur score toutes plages confondues.
  function estimateTempoIntervalFrames(flux, framesPerSecond, options) {
    const minLagFrames = Math.max(1, Math.round(options.minIntervalSeconds * framesPerSecond));
    const maxLagFrames = Math.max(minLagFrames + 1, Math.round(options.maxIntervalSeconds * framesPerSecond));

    const scores = new Float64Array(maxLagFrames - minLagFrames + 1);
    let bestScore = -Infinity;
    for (let lag = minLagFrames; lag <= maxLagFrames; lag++) {
      let score = 0;
      for (let i = 0; i + lag < flux.length; i++) {
        score += flux[i] * flux[i + lag];
      }
      scores[lag - minLagFrames] = score;
      if (score > bestScore) bestScore = score;
    }

    const acceptanceThreshold = bestScore * 0.85;
    for (let lag = minLagFrames; lag <= maxLagFrames; lag++) {
      const score = scores[lag - minLagFrames];
      const previous = lag > minLagFrames ? scores[lag - minLagFrames - 1] : -Infinity;
      const next = lag < maxLagFrames ? scores[lag - minLagFrames + 1] : -Infinity;
      const isLocalPeak = score >= previous && score >= next;
      if (isLocalPeak && score >= acceptanceThreshold) return lag;
    }

    // Filet de sécurité (ne devrait pas arriver) : le meilleur score brut.
    let bestLag = minLagFrames;
    for (let lag = minLagFrames; lag <= maxLagFrames; lag++) {
      if (scores[lag - minLagFrames] === bestScore) {
        bestLag = lag;
        break;
      }
    }
    return bestLag;
  }

  // Une fois le pouls connu (sa DURÉE), reste à savoir où il commence
  // (sa PHASE) : on teste tous les départs possibles dans une première
  // période, et on garde celui qui tombe le plus souvent sur de gros
  // sursauts d'énergie.
  function estimateBeatPhaseFrames(flux, intervalFrames) {
    let bestPhase = 0;
    let bestScore = -Infinity;

    for (let phase = 0; phase < intervalFrames; phase++) {
      let score = 0;
      for (let frame = phase; frame < flux.length; frame += intervalFrames) {
        score += flux[frame];
      }
      if (score > bestScore) {
        bestScore = score;
        bestPhase = phase;
      }
    }
    return bestPhase;
  }

  // Pour chaque position de la grille rythmique (phase, phase+intervalle,
  // phase+2×intervalle...), cherche le plus grand sursaut d'énergie aux
  // alentours (tolérance `toleranceRatio`, pour rester juste même si le
  // morceau n'est pas joué à la mécanique près). Une position sans
  // sursaut suffisamment marqué par rapport à la moyenne locale reste
  // vide : c'est une vraie pause dans la musique, pas une tuile ratée.
  //
  // Cette tolérance de recherche peut, pour deux positions voisines de
  // la grille, faire retomber les deux coups choisis plus près l'un de
  // l'autre que l'intervalle normal (un peu avant l'un, un peu après
  // l'autre) : sur un morceau à tempo déjà rapide, l'écart obtenu peut
  // alors passer sous `minIntervalSeconds`, le temps de réaction
  // minimum. Un coup trop proche du précédent est donc ignoré (la
  // position reste vide) plutôt que de livrer deux tuiles injouables
  // coup sur coup.
  function buildGridOnsets(flux, framesPerSecond, intervalFrames, phaseFrames, options) {
    const localWindowFrames = Math.max(1, Math.round(options.localWindowSeconds * framesPerSecond));
    const toleranceFrames = Math.max(1, Math.round(intervalFrames * options.toleranceRatio));
    const minIntervalFrames = Math.max(1, Math.round(options.minIntervalSeconds * framesPerSecond));

    const onsetTimes = [];
    let lastAcceptedFrame = -Infinity;

    for (let frame = phaseFrames; frame < flux.length; frame += intervalFrames) {
      const searchStart = Math.max(0, frame - toleranceFrames);
      const searchEnd = Math.min(flux.length, frame + toleranceFrames);

      let bestFrame = -1;
      let bestValue = 0;
      for (let f = searchStart; f < searchEnd; f++) {
        if (flux[f] > bestValue) {
          bestValue = flux[f];
          bestFrame = f;
        }
      }
      if (bestFrame < 0) continue;
      if (bestFrame - lastAcceptedFrame < minIntervalFrames) continue;

      const windowStart = Math.max(0, bestFrame - localWindowFrames);
      const windowEnd = Math.min(flux.length, bestFrame + localWindowFrames);
      let sum = 0;
      for (let j = windowStart; j < windowEnd; j++) sum += flux[j];
      const localAverage = sum / (windowEnd - windowStart);

      if (bestValue > localAverage * options.sensitivity && bestValue > 0.0001) {
        onsetTimes.push(bestFrame / framesPerSecond);
        lastAcceptedFrame = bestFrame;
      }
    }

    return onsetTimes;
  }

  // La grille avance par pas fixes de `intervalFrames` : un coup RÉEL
  // qui tombe entre deux positions de la grille (par exemple une
  // syncope, ou une légère variation de tempo à cet endroit précis)
  // n'est jamais cherché, puisque la recherche ne regarde qu'autour de
  // chaque position de la grille elle-même — même si ce coup est fort
  // et parfaitement audible. Cette passe repère les écarts anormalement
  // grands entre deux coups acceptés (plus d'1,5× le pouls détecté) et
  // cherche, DANS cet écart, le plus gros sursaut d'énergie avec le
  // même critère que `buildGridOnsets` (dépasser la moyenne locale de
  // `sensitivity`). Un écart sans aucun sursaut suffisant reste tel
  // quel : c'est alors une vraie pause (voir level/levelSequencer.js,
  // qui y place une plateforme de liaison).
  function fillMissedBeats(onsetTimes, flux, framesPerSecond, intervalFrames, options) {
    const localWindowFrames = Math.max(1, Math.round(options.localWindowSeconds * framesPerSecond));
    const minIntervalFrames = Math.max(1, Math.round(options.minIntervalSeconds * framesPerSecond));
    const gapThresholdFrames = intervalFrames * 1.5;

    const filled = [onsetTimes[0]];

    for (let i = 1; i < onsetTimes.length; i++) {
      const previousFrame = Math.round(filled[filled.length - 1] * framesPerSecond);
      const nextFrame = Math.round(onsetTimes[i] * framesPerSecond);

      if (nextFrame - previousFrame > gapThresholdFrames) {
        const searchStart = previousFrame + minIntervalFrames;
        const searchEnd = nextFrame - minIntervalFrames;

        let bestFrame = -1;
        let bestValue = 0;
        for (let f = searchStart; f < searchEnd; f++) {
          if (flux[f] > bestValue) {
            bestValue = flux[f];
            bestFrame = f;
          }
        }

        if (bestFrame >= 0) {
          const windowStart = Math.max(0, bestFrame - localWindowFrames);
          const windowEnd = Math.min(flux.length, bestFrame + localWindowFrames);
          let sum = 0;
          for (let j = windowStart; j < windowEnd; j++) sum += flux[j];
          const localAverage = sum / (windowEnd - windowStart);

          if (bestValue > localAverage * options.sensitivity && bestValue > 0.0001) {
            filled.push(bestFrame / framesPerSecond);
          }
        }
      }

      filled.push(onsetTimes[i]);
    }

    return filled;
  }

  // Analyse un AudioBuffer déjà décodé et renvoie la liste des horaires
  // (en secondes depuis le début du morceau) où un "coup" a été détecté.
  function detectOnsets(audioBuffer, userOptions) {
    const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
    const samples = toMonoSamples(audioBuffer);
    const energy = computeEnergyEnvelope(samples, options.windowSize);
    const flux = computeFlux(energy);
    const framesPerSecond = audioBuffer.sampleRate / options.windowSize;

    const intervalFrames = estimateTempoIntervalFrames(flux, framesPerSecond, options);
    const phaseFrames = estimateBeatPhaseFrames(flux, intervalFrames);
    const gridOnsets = buildGridOnsets(flux, framesPerSecond, intervalFrames, phaseFrames, options);
    return fillMissedBeats(gridOnsets, flux, framesPerSecond, intervalFrames, options);
  }

  TH.BeatDetector = { detectOnsets };
})(window.TH = window.TH || {});
