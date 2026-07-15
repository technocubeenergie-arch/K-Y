/*
 * base64.js
 * ------------------------------------------------------------
 * Role: convertir une "data URI" en base64 (ex: "data:audio/mpeg;
 * base64,....") en données binaires utilisables (ArrayBuffer), par
 * exemple pour l'API Web Audio.
 *
 * Pourquoi c'est nécessaire : pour que le jeu fonctionne même ouvert
 * en double-cliquant sur index.html (sans serveur), on ne peut pas
 * télécharger un fichier avec fetch() (bloqué par le navigateur pour
 * les fichiers locaux). La musique de test est donc directement
 * embarquée dans un fichier JavaScript (voir
 * assets/importedTrackData.js) ; cet utilitaire sert juste à
 * retransformer ce texte en vraies données audio.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  function toArrayBuffer(dataUri) {
    const base64 = dataUri.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  TH.Base64 = { toArrayBuffer };
})(window.TH = window.TH || {});
