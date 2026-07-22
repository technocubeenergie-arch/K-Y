/*
 * main.js
 * ------------------------------------------------------------
 * Role: le CHEF D'ORCHESTRE. C'est le seul fichier qui a le droit
 * de connaître TOUS les autres modules : il les crée, les relie
 * entre eux, puis les laisse travailler chacun de leur côté.
 *
 * Rien de la logique du jeu ne vit ici : ce fichier ne fait que
 * du "branchement". Si un module manque ou change, c'est
 * généralement ici qu'il faut le rebrancher.
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  const TH = window.TH;
  const config = TH.Config;

  // --- 1. Éléments du DOM -------------------------------------------------
  const canvas = document.getElementById('game-canvas');
  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;
  const ctx = canvas.getContext('2d');

  const domRefs = {
    levelEl: document.getElementById('level'),
    scoreEl: document.getElementById('score'),
    progressEl: document.getElementById('progress'),
    starsEl: document.getElementById('stars'),
    startScreen: document.getElementById('screen-start'),
    pauseScreen: document.getElementById('screen-pause'),
    failScreen: document.getElementById('screen-fail'),
    completeScreen: document.getElementById('screen-complete'),
    startButton: document.getElementById('btn-start'),
    pauseButton: document.getElementById('btn-pause'),
    resumeButton: document.getElementById('btn-resume'),
    retryFailButton: document.getElementById('btn-retry-fail'),
    retryCompleteButton: document.getElementById('btn-retry-complete'),
    failLevel: document.getElementById('fail-level'),
    failScore: document.getElementById('fail-score'),
    failHighscore: document.getElementById('fail-highscore'),
    failStars: document.getElementById('fail-stars'),
    completeScore: document.getElementById('complete-score'),
    completeHighscore: document.getElementById('complete-highscore'),
    completeStars: document.getElementById('complete-stars'),
  };
  const startStatus = document.getElementById('start-status');

  // --- 2. Briques du jeu ---------------------------------------------------
  const eventBus = new TH.EventBus();
  const audioManager = new TH.AudioManager();
  const localStore = new TH.LocalStore(config.storage);

  // Le vrai niveau n'existe qu'une fois la musique analysée (voir
  // handleStart) : avant ça, l'engine démarre avec un niveau vide.
  const initialSequence = { tiles: [], scrollSpeed: config.scroll.speed, totalDurationSeconds: 0 };
  const camera = new TH.Camera(config.scroll.speed, config);
  const ball = new TH.Ball(config);
  const clock = new TH.Clock(() => audioManager.getAudioTime(), config.audio.globalOffsetMs);

  const engine = new TH.Engine({ config, clock, ball, sequence: initialSequence, eventBus, localStore });
  const renderer = new TH.Renderer(ctx, config, camera);
  const input = new TH.InputController(canvas, ball, config);
  const gameLoop = new TH.GameLoop(engine, renderer, input);

  new TH.Hud(domRefs, eventBus);
  new TH.Screens(domRefs, eventBus, {
    onStart: handleStart,
    onTogglePause: handleTogglePause,
  });

  // --- 3. Réactions audio (le son ne dirige jamais le jeu, il réagit) -----
  // Aucun atterrissage sur une tuile ne joue de son, ni normal ni
  // parfait (demande de Ylonna) : seuls l'échec et la victoire (fin de
  // partie) restent sonorisés.
  eventBus.on('game:over', () => audioManager.stopMusic());
  eventBus.on('game:over', () => audioManager.playFailSound());
  eventBus.on('game:complete', () => audioManager.stopMusic());
  eventBus.on('game:complete', () => audioManager.playCompleteSound());
  eventBus.on('game:pause', () => audioManager.pause());
  eventBus.on('game:resume', () => audioManager.resumeIfNeeded());

  // --- 4. Actions déclenchées par les boutons ------------------------------

  // Le niveau est généré à partir du RYTHME RÉEL de la musique du jeu
  // (voir audio/beatDetector.js) : la musique n'est pas composée pour
  // suivre des tuiles déjà fixées, c'est l'inverse (voir
  // docs/GAMEPLAY.md). L'analyse (décodage + détection) ne se fait
  // qu'une fois : les parties suivantes réutilisent le résultat, pour
  // rejouer instantanément.
  //
  // `cachedSequence` : TOUTE la partie (tous les niveaux), déjà
  // combinée en une seule séquence continue (voir
  // level/levelSequencer.js, `combineLevelSequences`) — construite une
  // fois pour toutes après l'analyse.
  let cachedAudioBuffer = null;
  let cachedSequence = null;

  async function handleStart() {
    domRefs.startButton.disabled = true;
    startStatus.textContent = cachedSequence ? '' : 'Analyse du rythme en cours…';

    try {
      audioManager.init();
      await audioManager.resumeIfNeeded();

      if (!cachedAudioBuffer || !cachedSequence) {
        const arrayBuffer = TH.Base64.toArrayBuffer(TH.LevelTrackData);
        const audioBuffer = await audioManager.decodeArrayBuffer(arrayBuffer);

        // Rythme posé à la main (voir config.beatmap.useManualData,
        // tools/beatmap-editor/, docs/BEATMAP_EDITOR.md) si disponible,
        // sinon détection automatique (voir audio/beatDetector.js).
        const useManualBeatmap = config.beatmap.useManualData && !!TH.BeatmapData;
        const onsets = useManualBeatmap
          ? TH.BeatmapData.merged.tiles.map((tile) => tile.time)
          : TH.BeatDetector.detectOnsets(audioBuffer, config.beatDetection).slice(0, config.beatDetection.maxTiles);
        const explicitLongPlates = useManualBeatmap ? TH.BeatmapData.merged.longPlates : null;

        if (onsets.length < 2) {
          startStatus.textContent = 'Pas assez de rythme détecté dans ce fichier.';
          domRefs.startButton.disabled = false;
          return;
        }

        cachedAudioBuffer = audioBuffer;

        // Chaque niveau commence exactement là où le précédent s'arrête
        // (voir docs/GAMEPLAY.md, "aucune coupure entre deux niveaux") :
        // sa durée réelle est celle du fichier entier rejoué à sa
        // propre vitesse (`audioBuffer.duration / speedMultiplier`),
        // pas juste l'horaire de sa dernière tuile — la musique
        // continue après le dernier coup détecté, et audioManager la
        // joue jusqu'au bout (voir scheduleLevels).
        let cumulativeStartTime = 0;
        const perLevelSequences = config.levels.speedMultipliers.map((speedMultiplier) => {
          const sequence = TH.LevelSequencer.buildSequence(
            onsets,
            TH.Levels.training,
            config,
            speedMultiplier,
            cumulativeStartTime,
            explicitLongPlates
          );
          cumulativeStartTime += audioBuffer.duration / speedMultiplier;
          return sequence;
        });
        cachedSequence = TH.LevelSequencer.combineLevelSequences(perLevelSequences, config);
      }

      startStatus.textContent = '';
      domRefs.startButton.disabled = false;

      const startTime = audioManager.scheduleLevels(cachedAudioBuffer, config.levels.speedMultipliers);
      engine.start(startTime, cachedSequence);
    } catch (error) {
      startStatus.textContent = 'Impossible de lire ce fichier audio.';
      domRefs.startButton.disabled = false;
    }
  }

  function handleTogglePause() {
    engine.togglePause();
  }

  // --- 5. Démarrage de la boucle de rendu (dessine même avant le "Jouer") -
  gameLoop.start();
})();
