/*
 * math.js
 * ------------------------------------------------------------
 * Role: petites fonctions mathématiques réutilisées partout
 * (éviter qu'un nombre sorte de l'écran, mélanger deux valeurs...).
 * Aucune logique de jeu ici, juste des outils génériques.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  TH.MathUtils = {
    // Empêche `value` de sortir de l'intervalle [min, max].
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    // Mélange progressivement `a` vers `b`. t=0 -> a, t=1 -> b.
    lerp(a, b, t) {
      return a + (b - a) * t;
    },
  };
})(window.TH = window.TH || {});
