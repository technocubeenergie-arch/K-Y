/*
 * assetManifest.js
 * ------------------------------------------------------------
 * Role: la "liste de courses" de tous les assets du jeu.
 *
 * Aujourd'hui, on n'a pas encore de vrais dessins ni de vrais
 * fichiers audio : on les GÉNÈRE avec du code (formes simples,
 * sons synthétiques). C'est volontaire et temporaire.
 *
 * Chaque entrée dit :
 *  - status: 'procedural' (généré par le code) ou 'file' (vrai fichier)
 *  - source: qui génère l'asset, ou le chemin du fichier futur
 *
 * Le jour où on aura de vrais dessins/sons, on changera UNIQUEMENT
 * ce fichier (status: 'file', source: 'assets/images/ball.png'...),
 * sans toucher au reste du code. C'est tout l'intérêt de centraliser
 * les assets ici plutôt que de les éparpiller.
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  TH.AssetManifest = {
    music: {
      // La musique DU NIVEAU : un vrai fichier (pas de composition
      // procédurale), dont le rythme réel décide où sont placées les
      // tuiles (voir audio/beatDetector.js et docs/GAMEPLAY.md, "Générer
      // les tuiles depuis le rythme de la musique").
      levelTrack: {
        status: 'file',
        source: 'src/assets/phuthona.ogg (embarqué en base64 dans assets/levelTrackData.js, voir utils/base64.js)',
        note: 'Extrait tiré du vrai jeu Tiles Hop, utilisé pour comparer le rendu de la génération de tuiles à une référence connue (src/assets/audioniveau6.ogg reste dans le dépôt pour cette comparaison, mais n\'est plus le fichier actif). Embarquée directement dans le JS (pas de fetch()) pour fonctionner même sans serveur, en ouvrant index.html directement. Voir docs/FUTURE_INTEGRATIONS.md pour la suite (sélection d\'un fichier par le joueur).',
      },
    },

    beatmap: {
      // Rythme de phuthona.ogg posé à la main avec tools/beatmap-editor/
      // (voir docs/BEATMAP_EDITOR.md), utilisé à la place de
      // audio/beatDetector.js quand config.beatmap.useManualData vaut
      // true (voir main.js).
      manualData: {
        status: 'file',
        source: 'export de tools/beatmap-editor/ (embarqué tel quel dans assets/beatmapData.js)',
        note: '214 tuiles et 1 tapis glissant tapés à l\'oreille par Ylonna, fusionnés depuis une prise (export mis à jour ; versions précédentes : 210 tuiles/17 tapis, puis 155 tuiles/49 tapis). Remplace la détection automatique pour ce morceau ; un futur morceau sans beatmap manuel retombe automatiquement sur audio/beatDetector.js (voir main.js).',
      },
    },

    sfx: {
      fail: {
        status: 'procedural',
        source: 'audioManager.js#playFailSound',
        futurePath: 'assets/audio/sfx/fail.wav',
        note: 'Son grave joué quand la balle rate une tuile.',
      },
      complete: {
        status: 'procedural',
        source: 'audioManager.js#playCompleteSound',
        futurePath: 'assets/audio/sfx/complete.wav',
        note: 'Petite fanfare jouée à la fin du niveau.',
      },
    },

    visuals: {
      ball: {
        status: 'procedural',
        source: 'render/renderer.js#drawBall (cercle canvas)',
        futurePath: 'assets/images/ball.png',
        note: 'Remplaçable par un sprite/image plus tard (voir docs/FUTURE_INTEGRATIONS.md).',
      },
      tile: {
        status: 'procedural',
        source: 'render/renderer.js#drawTile (rectangle canvas)',
        futurePath: 'assets/images/tile.png',
        note: 'Prévoir plusieurs variantes visuelles de tuiles plus tard. Une tuile "parfaite" utilise déjà une couleur dorée dédiée (config.tile.perfectColor).',
      },
      starIcon: {
        status: 'procedural',
        source: "caractère Unicode '⭐' (HUD et écrans, voir index.html)",
        futurePath: 'assets/images/star-icon.png',
        note: 'Icône temporaire pour représenter la monnaie du jeu.',
      },
      background: {
        status: 'procedural',
        source: 'render/renderer.js#drawBackground (dégradé + lignes)',
        futurePath: 'assets/images/background.png',
        note: 'Fond simple pour le moment ; un vrai décor pourra être ajouté sans changer la logique.',
      },
    },
  };
})(window.TH = window.TH || {});
