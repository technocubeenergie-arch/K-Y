/*
 * merger.js
 * ------------------------------------------------------------
 * Role: fusionner PLUSIEURS prises (voir takesStore.js) en un seul
 * résultat plus fiable — l'idée centrale demandée : si on tape 4 ou 5
 * fois sur la même musique, un même coup de musique tombe rarement
 * exactement au même instant à chaque fois (le geste humain varie un
 * peu), mais les points obtenus se regroupent naturellement PRÈS les
 * uns des autres. En les regroupant puis en prenant leur moyenne, on
 * obtient un horaire plus stable que n'importe quelle prise seule.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  const DEFAULT_TILE_TOLERANCE_SECONDS = 0.15;
  const DEFAULT_LONGPLATE_TOLERANCE_SECONDS = 0.3;

  // Regroupe des nombres TRIÉS en "grappes" : un nouveau groupe démarre
  // dès que l'écart avec le DERNIER point ajouté (pas le premier)
  // dépasse la tolérance — un tapotement humain peut dériver un peu au
  // fil des prises, mieux vaut suivre cette dérive que rester ancré
  // sur le tout premier point du groupe.
  function clusterNumbers(values, tolerance) {
    const sorted = [...values].sort((a, b) => a - b);
    const clusters = [];
    let current = [];

    for (const value of sorted) {
      if (current.length === 0 || value - current[current.length - 1] <= tolerance) {
        current.push(value);
      } else {
        clusters.push(current);
        current = [value];
      }
    }
    if (current.length > 0) clusters.push(current);
    return clusters;
  }

  function average(numbers) {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  function round(seconds) {
    return Math.round(seconds * 1000) / 1000;
  }

  // Fusionne les tuiles de TOUTES les prises. `confidence` (0 à 1) dit
  // sur combien de prises, PROPORTIONNELLEMENT au total, ce groupe est
  // apparu — utile pour repérer dans l'interface une tuile tapée une
  // seule fois par erreur (confiance basse) plutôt qu'un vrai coup
  // confirmé par plusieurs prises (confiance haute).
  function mergeTiles(takes, tolerance) {
    const allTimes = [];
    takes.forEach((take) => allTimes.push(...take.tiles));
    if (allTimes.length === 0) return [];

    return clusterNumbers(allTimes, tolerance)
      .map((cluster) => ({
        time: round(average(cluster)),
        confidence: cluster.length / takes.length,
      }))
      .sort((a, b) => a.time - b.time);
  }

  // Même principe pour les tapis, mais sur des SEGMENTS : deux segments
  // sont regroupés s'ils se chevauchent, OU si l'écart entre la fin de
  // l'un et le début du suivant reste sous la tolérance.
  function mergeLongPlates(takes, tolerance) {
    const allSegments = [];
    takes.forEach((take) => allSegments.push(...take.longPlates));
    if (allSegments.length === 0) return [];

    const sorted = [...allSegments].sort((a, b) => a.start - b.start);
    const clusters = [];
    let current = [sorted[0]];
    let currentEnd = sorted[0].end;

    for (let i = 1; i < sorted.length; i++) {
      const segment = sorted[i];
      if (segment.start - currentEnd <= tolerance) {
        current.push(segment);
        currentEnd = Math.max(currentEnd, segment.end);
      } else {
        clusters.push(current);
        current = [segment];
        currentEnd = segment.end;
      }
    }
    clusters.push(current);

    return clusters
      .map((cluster) => ({
        start: round(average(cluster.map((s) => s.start))),
        end: round(average(cluster.map((s) => s.end))),
        confidence: cluster.length / takes.length,
      }))
      .sort((a, b) => a.start - b.start);
  }

  function merge(takes, options) {
    const opts = Object.assign(
      {
        tileToleranceSeconds: DEFAULT_TILE_TOLERANCE_SECONDS,
        longPlateToleranceSeconds: DEFAULT_LONGPLATE_TOLERANCE_SECONDS,
      },
      options
    );
    return {
      tiles: mergeTiles(takes, opts.tileToleranceSeconds),
      longPlates: mergeLongPlates(takes, opts.longPlateToleranceSeconds),
    };
  }

  BE.Merger = { merge, DEFAULT_TILE_TOLERANCE_SECONDS, DEFAULT_LONGPLATE_TOLERANCE_SECONDS };
})(window.BE = window.BE || {});
