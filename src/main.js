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

  // --- 2. Briques du jeu ---------------------------------------------------
  const eventBus = new TH.EventBus();
  const audioManager = new TH.AudioManager();
  const localStore = new TH.LocalStore(config.storage);

  const sequence = TH.LevelSequencer.buildSequence(TH.Levels.training, config);
  const camera = new TH.Camera(sequence.scrollSpeed, config.hitLine.y);
  const ball = new TH.Ball(config);
  const clock = new TH.Clock(() => audioManager.getAudioTime());

  const engine = new TH.Engine({ config, clock, ball, sequence, eventBus, localStore });
  const renderer = new TH.Renderer(ctx, config, camera);
  const input = new TH.InputController(canvas, ball, config);
  const gameLoop = new TH.GameLoop(engine, renderer, input);

  new TH.Hud(domRefs, eventBus, sequence.tiles.length);
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
  eventBus.on('game:complete', () => audioManager.playCompleteSound());

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

  // --- 5. Démarrage de la boucle de rendu (dessine même avant le "Jouer") -
  gameLoop.start();
})();
