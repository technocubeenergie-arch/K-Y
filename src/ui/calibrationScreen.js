/*
 * calibrationScreen.js
 * ------------------------------------------------------------
 * Role: l'écran "Régler la synchro", pensé pour un joueur qui ne
 * touche JAMAIS à un fichier de réglages. Le joueur tape en rythme
 * sur quelques bips ; le jeu calcule TOUT SEUL le décalage à
 * appliquer (voir audio/audioManager.js:scheduleMetronome et
 * core/clock.js) et l'explique en mots simples, sans jamais
 * afficher un nombre brut sans phrase autour.
 *
 * Ce module gère lui-même sa visibilité (classe .is-visible sur son
 * propre écran), indépendamment de ui/screens.js : contrairement aux
 * écrans de pause/échec/fin, celui-ci n'est lié à aucun état de
 * partie (accessible uniquement AVANT de jouer, depuis l'écran de
 * démarrage).
 * ------------------------------------------------------------
 */
(function (TH) {
  'use strict';

  // Un bip toutes les 0,8s : assez lent pour bien anticiper chaque tape,
  // assez rapide pour que le test dure quelques secondes seulement.
  const TAP_COUNT = 6;
  const INTERVAL_SECONDS = 0.8;
  // Un décalage plus grand que ça serait suspect (mauvaise tape, tape
  // ratée...) : on borne le résultat pour ne jamais appliquer une valeur
  // aberrante automatiquement.
  const MAX_OFFSET_MS = 250;

  class CalibrationScreen {
    // `onApply(offsetMs)` : appelé quand le joueur valide un résultat,
    // pour que main.js applique tout de suite le réglage à l'horloge en
    // cours (voir core/clock.js:setOffsetMs), en plus de le sauvegarder.
    constructor(elements, audioManager, localStore, onApply) {
      this._els = elements;
      this._audio = audioManager;
      this._localStore = localStore;
      this._onApply = onApply;

      this._clickTimes = [];
      this._tapTimes = [];
      this._running = false;
      this._pendingOffsetMs = 0;

      elements.openButton.addEventListener('click', () => this.open());
      elements.closeButton.addEventListener('click', () => this.close());
      elements.startTestButton.addEventListener('click', () => this._startTest());
      elements.tapButton.addEventListener('click', () => this._registerTap());
      elements.applyButton.addEventListener('click', () => this._apply());
      elements.retryButton.addEventListener('click', () => this._reset());

      // La barre ESPACE est plus facile à taper vite et sans viser qu'un
      // bouton tactile minuscule, surtout plusieurs fois de suite.
      document.addEventListener('keydown', (event) => {
        if (event.code !== 'Space' || !this._running) return;
        if (!this._els.screen.classList.contains('is-visible')) return;
        event.preventDefault();
        this._registerTap();
      });
    }

    open() {
      this._reset();
      this._els.screen.classList.add('is-visible');
    }

    close() {
      this._running = false;
      this._els.screen.classList.remove('is-visible');
    }

    _reset() {
      this._running = false;
      this._clickTimes = [];
      this._tapTimes = [];
      this._els.instructions.classList.remove('is-hidden');
      this._els.tapButton.classList.add('is-hidden');
      this._els.result.classList.add('is-hidden');
      this._els.startTestButton.disabled = false;
      this._renderCurrentValue();
    }

    _renderCurrentValue() {
      const current = this._localStore.getAudioOffsetMs();
      this._els.currentValue.textContent =
        current === 0
          ? 'Réglage actuel : aucun (le jeu utilise sa valeur par défaut).'
          : `Réglage actuel : ${this._describeDirection(current)}.`;
    }

    async _startTest() {
      // L'audio a besoin d'un geste du joueur pour démarrer (règle des
      // navigateurs) : ce clic en est un, donc c'est le bon moment pour
      // initialiser l'AudioContext si ce n'est pas déjà fait (le joueur a
      // peut-être ouvert la calibration avant d'avoir jamais appuyé sur
      // "Jouer").
      this._audio.init();
      await this._audio.resumeIfNeeded();

      this._running = true;
      this._tapTimes = [];
      this._clickTimes = this._audio.scheduleMetronome(TAP_COUNT, INTERVAL_SECONDS);

      this._els.instructions.classList.add('is-hidden');
      this._els.result.classList.add('is-hidden');
      this._els.tapButton.classList.remove('is-hidden');

      const totalDurationMs = (TAP_COUNT * INTERVAL_SECONDS + 0.6) * 1000;
      setTimeout(() => this._finishTest(), totalDurationMs);
    }

    _registerTap() {
      if (!this._running) return;
      this._tapTimes.push(this._audio.getAudioTime());
    }

    _finishTest() {
      this._running = false;
      this._els.tapButton.classList.add('is-hidden');
      this._els.result.classList.remove('is-hidden');

      const deltas = this._matchTapsToClicks();

      // Pas assez de tapes utilisables : plutôt que de deviner un réglage
      // au hasard, on le dit simplement et on laisse recommencer.
      if (deltas.length < 3) {
        this._els.resultText.textContent =
          'Pas assez de tapes détectées à temps. Essaie encore, en tapant bien sur chaque bip.';
        this._els.applyButton.classList.add('is-hidden');
        return;
      }

      const avgDeltaSeconds = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
      const avgDeltaMs = Math.round(avgDeltaSeconds * 1000);
      this._pendingOffsetMs = TH.MathUtils.clamp(avgDeltaMs, -MAX_OFFSET_MS, MAX_OFFSET_MS);

      this._els.resultText.textContent =
        `Résultat : ${this._describeDirection(this._pendingOffsetMs)}. Appuie sur « Appliquer » pour garder ce réglage.`;
      this._els.applyButton.classList.remove('is-hidden');
    }

    // Associe chaque tape au bip le plus proche dans le temps (plutôt que
    // de supposer un ordre parfait), pour rester fiable même si le joueur
    // tape un peu tôt, un peu tard, ou loupe un bip de temps en temps.
    _matchTapsToClicks() {
      const deltas = [];
      for (const tap of this._tapTimes) {
        let closestClick = null;
        let closestDistance = Infinity;
        for (const click of this._clickTimes) {
          const distance = Math.abs(tap - click);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestClick = click;
          }
        }
        // Une tape trop loin de tout bip n'est probablement pas liée à ce
        // test (tape accidentelle) : on l'ignore plutôt que de fausser la
        // moyenne.
        if (closestClick !== null && closestDistance < INTERVAL_SECONDS / 2) {
          deltas.push(tap - closestClick);
        }
      }
      return deltas;
    }

    // Traduit un nombre de millisecondes en phrase simple, jamais en
    // chiffre brut tout seul (voir la demande explicite d'une interface
    // "pour un joueur", pas "pour un développeur" — docs/GAMEPLAY.md).
    _describeDirection(offsetMs) {
      const abs = Math.abs(offsetMs);
      if (abs < 10) {
        return 'déjà très bien réglé, aucune correction nécessaire';
      }
      const direction = offsetMs > 0 ? 'trop TÔT' : 'trop TARD';
      return `les tuiles arrivaient un peu ${direction} par rapport à ce que tu entends (écart : ${abs}ms)`;
    }

    _apply() {
      this._localStore.setAudioOffsetMs(this._pendingOffsetMs);
      this._onApply(this._pendingOffsetMs);
      // Une fois appliqué, le bouton disparaît (pas de double-application) :
      // il faut donc aussi changer le texte au-dessus, qui jusque-là disait
      // encore "Appuie sur Appliquer" — sinon il pointe vers un bouton qui
      // n'existe plus (voir docs/BUGS.md, BUG-015).
      this._els.resultText.textContent = 'Réglage enregistré ! Tu peux fermer cet écran, ou refaire le test si tu veux.';
      this._renderCurrentValue();
      this._els.applyButton.classList.add('is-hidden');
    }
  }

  TH.CalibrationScreen = CalibrationScreen;
})(window.TH = window.TH || {});
