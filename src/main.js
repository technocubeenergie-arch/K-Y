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
    failScore: document.getElementById('fail-score'),
    failHighscore: document.getElementById('fail-highscore'),
    failStars: document.getElementById('fail-stars'),
    completeScore: document.getElementById('complete-score'),
    completeHighscore: document.getElementById('complete-highscore'),
    completeStars: document.getElementById('complete-stars'),
  };
  const testTrackButton = document.getElementById('btn-test-imported-track');
  const testTrackStatus = document.getElementById('test-track-status');

  // --- 2. Briques du jeu ---------------------------------------------------
  const eventBus = new TH.EventBus();
  const audioManager = new TH.AudioManager();
  const localStore = new TH.LocalStore(config.storage);

  const sequence = TH.LevelSequencer.buildSequence(TH.Levels.training, config);
  const camera = new TH.Camera(config.scroll.speed, config);
  const ball = new TH.Ball(config);
  const clock = new TH.Clock(() => audioManager.getAudioTime());

  const engine = new TH.Engine({ config, clock, ball, sequence, eventBus, localStore });
  const renderer = new TH.Renderer(ctx, config, camera);
  const input = new TH.InputController(canvas, ball, config);
  const gameLoop = new TH.GameLoop(engine, renderer, input);

  new TH.Hud(domRefs, eventBus);
  new TH.Screens(domRefs, eventBus, {
    onStart: handleStart,
    onTogglePause: handleTogglePause,
  });

  // --- 3. Réactions audio (le son ne dirige jamais le jeu, il réagit) -----
  eventBus.on('tile:hit', ({ isPerfect }) => {
    if (isPerfect) audioManager.playStarSound();
    else audioManager.playLandSound();
  });
  eventBus.on('game:over', () => audioManager.stopMusic());
  eventBus.on('game:over', () => audioManager.playFailSound());
  eventBus.on('game:complete', () => audioManager.stopMusic());
  eventBus.on('game:complete', () => audioManager.playCompleteSound());
  eventBus.on('game:pause', () => audioManager.pause());
  eventBus.on('game:resume', () => audioManager.resumeIfNeeded());

  // --- 4. Actions déclenchées par les boutons ------------------------------
  async function handleStart() {
    audioManager.init();
    await audioManager.resumeIfNeeded();
    const musicStartTime = audioManager.playMusic(sequence, config);
    engine.start(musicStartTime);
  }

  function handleTogglePause() {
    engine.togglePause();
  }

  // Bouton expérimental : génère un niveau à partir du RYTHME RÉEL d'un
  // fichier audio importé (voir audio/beatDetector.js), au lieu du tempo
  // fixe du niveau d'entraînement. But : prouver que le moteur peut
  // suivre n'importe quelle musique, pas seulement celle composée pour
  // lui (voir docs/GAMEPLAY.md, "Générer les tuiles depuis une vraie
  // musique").
  async function handleTestImportedTrack() {
    testTrackButton.disabled = true;
    testTrackStatus.textContent = 'Analyse du rythme en cours…';

    try {
      audioManager.init();
      await audioManager.resumeIfNeeded();

      const trackUrl = TH.AssetManifest.music.importedTest.source;
      const audioBuffer = await audioManager.loadTrack(trackUrl);

      const onsets = TH.BeatDetector.detectOnsets(audioBuffer, config.beatDetection)
        .slice(0, config.beatDetection.maxTiles);

      if (onsets.length < 2) {
        testTrackStatus.textContent = "Pas assez de rythme détecté dans ce fichier.";
        testTrackButton.disabled = false;
        return;
      }

      const testSequence = TH.LevelSequencer.buildSequenceFromBeatTimes(onsets, TH.Levels.training, config);

      testTrackStatus.textContent = '';
      testTrackButton.disabled = false;

      const startTime = audioManager.playTrack(audioBuffer);
      engine.start(startTime, testSequence);
    } catch (error) {
      testTrackStatus.textContent = 'Impossible de lire ce fichier audio.';
      testTrackButton.disabled = false;
    }
  }

  testTrackButton.addEventListener('click', handleTestImportedTrack);

  // --- 5. Démarrage de la boucle de rendu (dessine même avant le "Jouer") -
  gameLoop.start();
})();
