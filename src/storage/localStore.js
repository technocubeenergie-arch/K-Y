/*
 * localStore.js
 * ------------------------------------------------------------
 * Role: sauvegarder le meilleur score SUR CET APPAREIL, en
 * attendant Supabase (base de données en ligne, prévue plus tard
 * — voir docs/FUTURE_INTEGRATIONS.md).
 *
 * C'est volontairement une solution TEMPORAIRE : les deux méthodes
 * ci-dessous (getHighScore / setHighScore) forment le "contrat"
 * qu'un futur SupabaseStore devra respecter pour remplacer ce
 * fichier sans rien casser ailleurs.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class LocalStore {
    constructor(storageKey) {
      this._key = storageKey;
    }

    getHighScore() {
      try {
        const raw = window.localStorage.getItem(this._key);
        return raw ? parseInt(raw, 10) : 0;
      } catch (error) {
        // localStorage indisponible (navigation privée, etc.) : pas grave,
        // le jeu continue de fonctionner, juste sans mémoire du score.
        return 0;
      }
    }

    setHighScore(score) {
      try {
        window.localStorage.setItem(this._key, String(score));
      } catch (error) {
        // Idem : on ignore silencieusement, ce n'est pas bloquant.
      }
    }
  }

  TH.LocalStore = LocalStore;
})(window.TH = window.TH || {});
