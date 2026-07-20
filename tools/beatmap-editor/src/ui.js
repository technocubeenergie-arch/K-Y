/*
 * ui.js
 * ------------------------------------------------------------
 * Role: le CHEF D'ORCHESTRE de l'outil (même esprit que src/main.js
 * dans le jeu) : relie les boutons de la page aux modules qui font le
 * vrai travail (audioPlayer, recorder, takesStore, merger, exporter).
 * Rien de la logique elle-même ne vit ici.
 * ------------------------------------------------------------
 */
(function (BE) {
  'use strict';

  const audioEl = new Audio();
  const player = new BE.AudioPlayer(audioEl);
  const recorder = new BE.Recorder(() => player.currentTime);
  const takesStore = new BE.TakesStore();

  const els = {
    fileInput: document.getElementById('file-input'),
    songName: document.getElementById('song-name'),
    playerSection: document.getElementById('player'),
    timeDisplay: document.getElementById('time-display'),
    btnPlay: document.getElementById('btn-play'),
    btnPause: document.getElementById('btn-pause'),
    btnRestart: document.getElementById('btn-restart'),
    btnTap: document.getElementById('btn-tap'),
    currentTakeList: document.getElementById('current-take-list'),
    btnNewTake: document.getElementById('btn-new-take'),
    takesSection: document.getElementById('takes-section'),
    takesList: document.getElementById('takes-list'),
    mergeSection: document.getElementById('merge-section'),
    tileTolerance: document.getElementById('tile-tolerance'),
    longPlateTolerance: document.getElementById('longplate-tolerance'),
    btnMerge: document.getElementById('btn-merge'),
    mergedResult: document.getElementById('merged-result'),
    exportSection: document.getElementById('export-section'),
    btnExport: document.getElementById('btn-export'),
  };

  // Résultat de la dernière fusion (voir merger.js) : gardé ici pour
  // pouvoir retirer un élément (bouton "Retirer") sans tout refusionner,
  // et pour l'export.
  let lastMerged = null;

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, seconds || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remaining = Math.floor(safeSeconds % 60);
    return minutes + ':' + String(remaining).padStart(2, '0');
  }

  // --- 1. Charger un fichier -----------------------------------------------
  els.fileInput.addEventListener('change', async () => {
    const file = els.fileInput.files[0];
    if (!file) return;

    try {
      await player.loadFile(file);
    } catch (error) {
      els.songName.textContent = 'Impossible de lire ce fichier. Essaie un autre fichier audio.';
      return;
    }

    takesStore.setSongName(file.name);
    takesStore.reset();
    recorder.reset();
    lastMerged = null;

    els.songName.textContent = 'Fichier chargé : ' + file.name;
    els.playerSection.classList.remove('is-hidden');
    els.takesSection.classList.add('is-hidden');
    els.mergeSection.classList.add('is-hidden');
    els.exportSection.classList.add('is-hidden');

    renderCurrentTake();
    renderTakes();
  });

  // --- 2. Lecture -----------------------------------------------------------
  els.btnPlay.addEventListener('click', () => player.play());
  els.btnPause.addEventListener('click', () => player.pause());
  els.btnRestart.addEventListener('click', () => player.restart());

  player.onTimeUpdate(() => {
    els.timeDisplay.textContent = formatTime(player.currentTime) + ' / ' + formatTime(player.duration);
  });

  // --- 3. Enregistrement (bouton + barre ESPACE) -----------------------------
  function handlePressStart(event) {
    event.preventDefault();
    recorder.press();
    els.btnTap.classList.add('is-active');
  }

  function handlePressEnd(event) {
    event.preventDefault();
    const result = recorder.release();
    els.btnTap.classList.remove('is-active');
    if (result) renderCurrentTake();
  }

  els.btnTap.addEventListener('pointerdown', handlePressStart);
  els.btnTap.addEventListener('pointerup', handlePressEnd);
  // Si le doigt/curseur quitte le bouton pendant l'appui (glissement
  // accidentel), on considère quand même que l'appui s'arrête là,
  // plutôt que de rester bloqué en position "appuyée".
  els.btnTap.addEventListener('pointerleave', (event) => {
    if (recorder.isPressing()) handlePressEnd(event);
  });

  document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space' || event.repeat) return;
    if (els.playerSection.classList.contains('is-hidden')) return;
    handlePressStart(event);
  });
  document.addEventListener('keyup', (event) => {
    if (event.code !== 'Space') return;
    if (els.playerSection.classList.contains('is-hidden')) return;
    handlePressEnd(event);
  });

  function renderCurrentTake() {
    const take = recorder.getCurrentTake();
    els.currentTakeList.innerHTML = '';

    const items = [
      ...take.tiles.map((time) => ({ text: 'Tuile à ' + time.toFixed(2) + 's', className: 'tile' })),
      ...take.longPlates.map((p) => ({
        text: 'Tapis de ' + p.start.toFixed(2) + 's à ' + p.end.toFixed(2) + 's',
        className: 'longplate',
      })),
    ];

    if (items.length === 0) {
      els.currentTakeList.innerHTML = '<li class="empty">Aucun événement pour l\'instant.</li>';
      return;
    }

    for (const item of items) {
      const li = document.createElement('li');
      li.textContent = item.text;
      li.className = item.className;
      els.currentTakeList.appendChild(li);
    }
  }

  // --- 4. Prises --------------------------------------------------------------
  // Termine la prise en cours (si elle contient quelque chose) et
  // repart de zéro pour la suivante — voir docs/BEATMAP_EDITOR.md pour
  // le principe des prises multiples.
  els.btnNewTake.addEventListener('click', () => {
    const take = recorder.getCurrentTake();
    if (take.tiles.length > 0 || take.longPlates.length > 0) {
      takesStore.addTake(take);
    }
    recorder.reset();
    player.pause();
    player.restart();
    renderCurrentTake();
    renderTakes();
  });

  function renderTakes() {
    const takes = takesStore.getTakes();
    els.takesList.innerHTML = '';

    takes.forEach((take, index) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent =
        'Prise ' + (index + 1) + ' : ' + take.tiles.length + ' tuile(s), ' + take.longPlates.length + ' tapis';
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = 'Supprimer';
      removeButton.addEventListener('click', () => {
        takesStore.removeTake(index);
        renderTakes();
      });
      li.appendChild(label);
      li.appendChild(removeButton);
      els.takesList.appendChild(li);
    });

    const hasTakes = takes.length > 0;
    els.takesSection.classList.toggle('is-hidden', !hasTakes);
    els.mergeSection.classList.toggle('is-hidden', !hasTakes);
  }

  // --- 5. Fusion ----------------------------------------------------------------
  els.btnMerge.addEventListener('click', () => {
    const takes = takesStore.getTakes();
    if (takes.length === 0) return;

    lastMerged = BE.Merger.merge(takes, {
      tileToleranceSeconds: Number(els.tileTolerance.value) / 1000,
      longPlateToleranceSeconds: Number(els.longPlateTolerance.value) / 1000,
    });

    renderMerged();
    els.exportSection.classList.remove('is-hidden');
  });

  function renderMerged() {
    if (!lastMerged) return;
    const totalTakes = takesStore.getTakeCount();

    const tileItems = lastMerged.tiles
      .map(
        (tile, index) =>
          '<li>' +
          tile.time.toFixed(2) +
          's — confiance ' +
          Math.round(tile.confidence * 100) +
          '% (' +
          Math.round(tile.confidence * totalTakes) +
          '/' +
          totalTakes +
          ' prises) <button type="button" data-remove-tile="' +
          index +
          '">Retirer</button></li>'
      )
      .join('');

    const longPlateItems = lastMerged.longPlates
      .map(
        (plate, index) =>
          '<li>' +
          plate.start.toFixed(2) +
          's → ' +
          plate.end.toFixed(2) +
          's — confiance ' +
          Math.round(plate.confidence * 100) +
          '% <button type="button" data-remove-longplate="' +
          index +
          '">Retirer</button></li>'
      )
      .join('');

    els.mergedResult.innerHTML =
      '<h3>' +
      lastMerged.tiles.length +
      ' tuile(s) fusionnée(s)</h3><ul>' +
      (tileItems || '<li class="empty">Aucune.</li>') +
      '</ul><h3>' +
      lastMerged.longPlates.length +
      ' tapis glissant(s) fusionné(s)</h3><ul>' +
      (longPlateItems || '<li class="empty">Aucun.</li>') +
      '</ul>';

    els.mergedResult.querySelectorAll('[data-remove-tile]').forEach((button) => {
      button.addEventListener('click', () => {
        lastMerged.tiles.splice(Number(button.dataset.removeTile), 1);
        renderMerged();
      });
    });
    els.mergedResult.querySelectorAll('[data-remove-longplate]').forEach((button) => {
      button.addEventListener('click', () => {
        lastMerged.longPlates.splice(Number(button.dataset.removeLongplate), 1);
        renderMerged();
      });
    });
  }

  // --- 6. Export ------------------------------------------------------------------
  els.btnExport.addEventListener('click', () => {
    if (!lastMerged) return;
    const data = BE.Exporter.buildExportData(takesStore.getSongName(), takesStore.getTakes(), lastMerged);
    const baseName = (takesStore.getSongName() || 'beatmap').replace(/\.[^.]+$/, '');
    BE.Exporter.downloadJSON(data, baseName + '.beatmap.json');
  });
})(window.BE = window.BE || {});
