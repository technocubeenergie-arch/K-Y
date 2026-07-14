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
      trainingLevel: {
        status: 'procedural',
        source: 'audio/musicGenerator.js',
        futurePath: 'assets/audio/music/training-level.mp3',
        note: 'Composition générée par Web Audio, ~60s, calée sur le BPM de gameConfig.js : grosse caisse, ligne de basse suivant une progression d\'accords (La mineur 7 / Fa majeur 7 / Do majeur 7 / Sol 7), charleston, et mélodie liée à la position des tuiles.',
      },
      // Piste de TEST pour le bouton "🧪 Tester avec la musique
      // importée" (écran de démarrage) : sert à vérifier que le moteur
      // sait générer des tuiles à partir du rythme d'une VRAIE musique
      // (voir audio/beatDetector.js), au lieu de composer la musique
      // pour suivre des tuiles déjà fixées. Fichier non optimisé
      // (déposé tel quel pour le test), à remplacer/retirer une fois la
      // fonctionnalité validée — voir docs/FUTURE_INTEGRATIONS.md.
      importedTest: {
        status: 'file',
        source: 'src/assets/mfcc-chinese-japanese-korean-music-324382.mp3',
        note: 'Musique réelle utilisée pour tester la détection de rythme et la génération de tuiles à partir d\'un fichier importé.',
      },
    },

    sfx: {
      land: {
        status: 'procedural',
        source: 'audioManager.js#playLandSound',
        futurePath: 'assets/audio/sfx/land.wav',
        note: 'Petit "bip" joué quand la balle atterrit correctement sur une tuile.',
      },
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
      star: {
        status: 'procedural',
        source: 'audioManager.js#playStarSound',
        futurePath: 'assets/audio/sfx/star.wav',
        note: 'Petit carillon joué pour un atterrissage "parfait" (voir docs/GAMEPLAY.md).',
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
