/*
 * exporter.js
 * ------------------------------------------------------------
 * Role: transformer le résultat (prises + fusion, voir merger.js) en
 * un fichier .json téléchargeable, dans un format simple et stable —
 * pensé pour être relu plus tard, par cet outil ou par le jeu.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  // `merged` : le résultat de `Merger.merge()`, avec `confidence` sur
  // chaque tuile/tapis. On le garde tel quel à l'export (pas juste les
  // horaires) : cette information sert à repérer plus tard un événement
  // peu fiable (confiance basse) sans avoir à tout refaire.
  function buildExportData(songName, takes, merged) {
    return {
      song: songName,
      takes: takes.map((take) => ({
        tiles: take.tiles,
        longPlates: take.longPlates,
      })),
      merged: {
        tiles: merged.tiles,
        longPlates: merged.longPlates,
      },
    };
  }

  function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  BE.Exporter = { buildExportData, downloadJSON };
})(window.BE = window.BE || {});
