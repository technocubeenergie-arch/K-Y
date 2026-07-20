/*
 * takesStore.js
 * ------------------------------------------------------------
 * Role: garder en mémoire toutes les prises (passes d'écoute) déjà
 * enregistrées pour LA musique actuellement chargée. Une prise, c'est
 * juste `{ tiles: [...], longPlates: [...] }` (voir recorder.js).
 *
 * Rien n'est sauvegardé sur le disque ici : tant qu'on n'a pas exporté
 * (voir exporter.js), tout reste en mémoire, perdu si on recharge la
 * page. C'est un choix volontaire de simplicité pour un premier outil.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  class TakesStore {
    constructor() {
      this._songName = null;
      this._takes = [];
    }

    setSongName(name) {
      this._songName = name;
    }

    getSongName() {
      return this._songName;
    }

    // Vide toutes les prises (appelé quand on charge une NOUVELLE
    // musique : les prises d'une autre musique n'ont aucun sens ici).
    reset() {
      this._takes = [];
    }

    addTake(take) {
      this._takes.push(take);
      return this._takes.length - 1;
    }

    removeTake(index) {
      this._takes.splice(index, 1);
    }

    getTakes() {
      return this._takes;
    }

    getTakeCount() {
      return this._takes.length;
    }
  }

  BE.TakesStore = TakesStore;
})(window.BE = window.BE || {});
