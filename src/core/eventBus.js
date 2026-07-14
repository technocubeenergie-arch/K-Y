/*
 * eventBus.js
 * ------------------------------------------------------------
 * Role: la "messagerie" du jeu.
 *
 * Au lieu que chaque module appelle directement les autres
 * (ce qui crée des dépendances emmêlées), chaque module peut
 * juste dire "hé, il s'est passé un truc !" (emit) et les autres
 * modules qui sont intéressés s'abonnent (on) pour être prévenus.
 *
 * Exemple : quand le moteur détecte une tuile ratée, il fait
 * `events.emit('game:over', {score})`. Le HUD, l'audio et l'écran
 * d'échec sont abonnés à 'game:over' et réagissent chacun de son
 * côté, sans se connaître entre eux.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  class EventBus {
    constructor() {
      this._listeners = new Map();
    }

    on(eventName, callback) {
      if (!this._listeners.has(eventName)) {
        this._listeners.set(eventName, []);
      }
      this._listeners.get(eventName).push(callback);
    }

    emit(eventName, payload) {
      const callbacks = this._listeners.get(eventName);
      if (!callbacks) return;
      for (const callback of callbacks) {
        callback(payload);
      }
    }
  }

  TH.EventBus = EventBus;
})(window.TH = window.TH || {});
