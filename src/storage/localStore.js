/*
 * localStore.js
 * ------------------------------------------------------------
 * Role: sauvegarder SUR CET APPAREIL le meilleur score et le nombre
 * d'étoiles gagnées, en attendant Supabase (base de données en ligne,
 * prévue plus tard — voir docs/FUTURE_INTEGRATIONS.md).
 *
 * C'est volontairement une solution TEMPORAIRE : les méthodes
 * ci-dessous (getHighScore / setHighScore / getStarBalance / addStars)
 * forment le "contrat" qu'un futur SupabaseStore devra respecter pour
 * remplacer ce fichier sans rien casser ailleurs.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class LocalStore {
    constructor(storageConfig) {
      this._highscoreKey = storageConfig.highscoreKey;
      this._starsKey = storageConfig.starsKey;
    }

    _readInt(key) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? parseInt(raw, 10) : 0;
      } catch (error) {
        // localStorage indisponible (navigation privée, etc.) : pas grave,
        // le jeu continue de fonctionner, juste sans mémoire.
        return 0;
      }
    }

    _writeInt(key, value) {
      try {
        window.localStorage.setItem(key, String(value));
      } catch (error) {
        // Idem : on ignore silencieusement, ce n'est pas bloquant.
      }
    }

    getHighScore() {
      return this._readInt(this._highscoreKey);
    }

    setHighScore(score) {
      this._writeInt(this._highscoreKey, score);
    }

    // Total d'étoiles accumulées par le joueur, toutes parties confondues
    // (la "tirelire", conservée même après une partie ratée).
    getStarBalance() {
      return this._readInt(this._starsKey);
    }

    // Ajoute `amount` étoiles à la tirelire et renvoie le nouveau total.
    addStars(amount) {
      const newTotal = this.getStarBalance() + amount;
      this._writeInt(this._starsKey, newTotal);
      return newTotal;
    }
  }

  TH.LocalStore = LocalStore;
})(window.TH = window.TH || {});
