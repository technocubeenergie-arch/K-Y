# Document de reprise / transmission

> Lis ce document en premier si tu reprends ce projet sans contexte
> préalable. Il doit te suffire pour être opérationnel immédiatement.

## Objectif exact du projet

Construire, avec une débutante de 13 ans (Ylonna), un jeu inspiré de
**Tiles Hop** : une balle avance automatiquement dans un niveau rythmé
par la musique, le joueur la dirige latéralement pour atterrir sur des
tuiles, et rate = fin de partie immédiate. Le niveau est **généré à
partir du rythme réel de la musique** (pas l'inverse) : voir
`docs/GAMEPLAY.md`. L'objectif est un accompagnement pédagogique en
plus du résultat technique : code propre, modulaire, bien documenté,
expliqué simplement.

## Contraintes non négociables

- **Un seul dépôt** : tout le travail se fait sur le dépôt `K-Y`, jamais
  sur un autre dépôt du même compte GitHub.
- **Pas de fichier monolithique.** Chaque responsabilité a son propre
  fichier (voir `docs/ARCHITECTURE.md`).
- **Pas de code mort, pas de doc obsolète.** Si un bout de code ou une
  ligne de documentation ne correspond plus à la réalité, elle doit être
  corrigée ou supprimée dans le même temps que le changement de code.
- **Assets définitifs et Supabase = plus tard, pas maintenant.** Ce qui
  existe aujourd'hui doit juste être *prêt* à les accueillir (voir
  `docs/FUTURE_INTEGRATIONS.md`).
- **Un seul niveau pour l'instant** (niveau d'entraînement, ~60
  secondes), avant d'envisager plusieurs niveaux.
- **Pédagogie** : toute explication donnée à Ylonna doit rester simple,
  courte, concrète — pas de jargon technique non expliqué.

## État actuel du prototype

Jouable de bout en bout, un seul bouton "Jouer" : écran de démarrage →
clic → décodage + analyse du rythme de la musique du jeu (~1s, message
de chargement pendant ce temps) → jeu (défilement automatique en
perspective façon "vu depuis derrière la balle", contrôle de la balle
au clavier/souris/tactile, tuiles placées sur le rythme réel détecté,
étoiles gagnées sur atterrissage parfait) → écran d'échec (avec
meilleur score et étoiles) ou écran de victoire → possibilité de
rejouer (instantané, la musique déjà analysée est réutilisée). Testé
en conditions automatisées (Playwright), y compris en ouvrant
`index.html` directement (`file://`, sans serveur, comme le fait
Ylonna) : défilement, collisions, échec, retry, pause (audio compris),
fin de niveau, mouvement clavier continu, gain/persistance des étoiles
fonctionnent tous correctement, sans erreur console.

Historique des retours déjà pris en compte : mouvement clavier rendu
fluide (BUG-004), vitesse clavier ajustée plusieurs fois suite aux
retours de Ylonna (elle règle maintenant directement certaines valeurs
dans `gameConfig.js` elle-même, en plus de me le demander), ajout du
système d'étoiles, correction d'une zone morte sur les tuiles
(BUG-006), passage en vue perspective, correction du décalage
audio/jeu après une pause (BUG-007), passage complet à une génération
du niveau depuis le rythme réel de la musique (plus de tempo fixe ni de
musique composée pour le jeu), et musique embarquée en base64 pour
fonctionner sans serveur (voir `docs/GAMEPLAY.md` et `docs/BUGS.md`).

## Architecture en place

Voir `docs/ARCHITECTURE.md` pour le détail complet. En résumé : des
fichiers `src/**/*.js` qui s'attachent tous à un objet global `TH`,
chargés dans un ordre précis via des balises `<script>` classiques dans
`index.html` (pas de bundler, pas d'`import`/`export`, pour rester
ouvrable sans installation).

## Modules déjà implémentés

- Config centralisée (`config/gameConfig.js`)
- Horloge synchronisée sur l'audio (`core/clock.js`)
- Messagerie entre modules (`core/eventBus.js`)
- Moteur de règles (`core/engine.js`) : score, étoiles, collision,
  échec, victoire
- Boucle de jeu (`core/gameLoop.js`)
- Entrées joueur souris/tactile/clavier, mouvement clavier fluide
  image par image (`core/input.js`)
- Balle (`entities/ball.js`), Tuile (`entities/tile.js`, avec un
  `expectedTime` par tuile — pas d'intervalle fixe supposé)
- Données de niveau en "lettres" + séquenceur, qui construit un niveau
  à partir des horaires détectés dans la musique
  (`level/levelData.js`, `level/levelSequencer.js`, fonction unique
  `buildSequence(beatTimes, levelDef, config)`)
- Caméra/défilement/perspective (`render/camera.js`), rendu canvas en
  perspective (`render/renderer.js`)
- Gestionnaire audio : décode et joue le fichier de musique du jeu
  (`audio/audioManager.js`)
- Détection de rythme dans le fichier audio du jeu
  (`audio/beatDetector.js`)
- Conversion base64 → données binaires, pour lire la musique embarquée
  sans passer par `fetch()` (`utils/base64.js`)
- HUD et écrans, avec affichage des étoiles (`ui/hud.js`, `ui/screens.js`)
- Sauvegarde locale du meilleur score ET de la tirelire d'étoiles
  (`storage/localStore.js`)
- Registre central des assets temporaires (`assets/assetManifest.js`)
- Musique du niveau embarquée en base64, prête à être lue sans serveur
  (`assets/levelTrackData.js`, généré à partir du fichier `.ogg`
  actuellement actif — voir `assets/assetManifest.js`)

## Mécaniques en place

Voir `docs/GAMEPLAY.md` pour le détail. En résumé : défilement
automatique basé sur le temps, une tuile pour chaque "coup" détecté
dans la musique du jeu (donc un espacement irrégulier, pas un tempo
fixe), toute la tuile compte comme réussie mais une petite zone dorée
au centre rapporte en plus une étoile, échec immédiat si raté à côté.
Les étoiles sont une monnaie persistante prévue pour une future
boutique (non construite).

**Important pour la suite** : le moteur ne suppose pas d'intervalle
fixe entre deux tuiles (`core/engine.js` lit `tile.expectedTime` au cas
par cas). C'est ce qui permet à `audio/beatDetector.js` d'analyser le
vrai fichier audio du jeu pour trouver son rythme, et à
`level/levelSequencer.buildSequence` de construire le niveau à partir
de ces horaires réels. Ce n'est plus un test : c'est le fonctionnement
normal et unique du jeu depuis la consolidation autour d'un seul
bouton "Jouer". Ce qui reste temporaire, c'est que la musique est un
seul fichier fixe choisi par nous, pas encore par le joueur (voir
`docs/FUTURE_INTEGRATIONS.md`, section 2).

## Bugs connus

Voir `docs/BUGS.md`. Le bug majeur d'origine (jeu totalement statique)
est résolu. Les autres entrées du journal sont des risques identifiés
et déjà prévenus (pas des bugs actifs).

## Prochaines priorités (au moment de la rédaction de ce document)

1. Continuer à faire jouer/tester le niveau par Ylonna et récolter son
   ressenti (difficulté, plaisir, lisibilité du chemin des tuiles,
   difficulté à viser le centre des tuiles pour les étoiles).
2. Ajuster éventuellement le motif du niveau d'entraînement
   (`level/levelData.js`) ou la tolérance d'atterrissage parfait
   (`config.tile.perfectZoneRatio`) selon ce retour — ce sont des
   réglages simples à modifier même sans savoir coder.
3. Laisser le joueur choisir sa propre musique (sélecteur de fichier,
   retrait du fichier fixe embarqué, bouton retour au menu) — voir
   `docs/FUTURE_INTEGRATIONS.md` section 2. Puis construire la
   boutique pour dépenser les étoiles (catalogue, écran, inventaire
   possédé) — section 3.
4. Envisager un deuxième niveau **seulement** une fois le premier
   validé comme "parfaitement fonctionnel et amusant" (consigne
   explicite : pas de contenu supplémentaire avant ça).
5. Plus tard seulement : remplacement des assets et intégration
   Supabase (voir `docs/FUTURE_INTEGRATIONS.md`).

## Règles à respecter pour ajouter du code

- Un fichier = une responsabilité claire (voir la table dans
  `docs/ARCHITECTURE.md`).
- Aucun nombre "magique" en dur : passer par `config/gameConfig.js`.
- Ne jamais faire dépendre `renderer.js` ou `audio/*` des règles du jeu :
  ils ne font que réagir à `engine.js` via `eventBus`.
- Mettre à jour la documentation concernée **dans le même commit** que
  le changement de code, jamais après coup.
- Tester dans un vrai navigateur avant de considérer une fonctionnalité
  terminée (voir méthode ci-dessous).

## Comment tester le jeu

Pas de framework de test automatisé mis en place à ce stade (le
prototype a été vérifié manuellement avec des scripts Playwright
ponctuels pendant le développement, non conservés dans le dépôt). Pour
vérifier une modification, le plus important est de tester **comme le
fait Ylonna** : ouvrir directement `index.html` en double-cliquant
dessus (protocole `file://`, sans serveur). C'est ce mode qui a révélé
le bug "Impossible de lire ce fichier audio." (voir `docs/BUGS.md`) —
un test via `python3 -m http.server` ne l'aurait pas montré, donc ne
pas se fier uniquement à un serveur local.

Vérifier au minimum : au clic sur "Jouer", un message de chargement
apparaît puis disparaît (~1s, le temps de décoder et analyser
`src/assets/levelTrackData.js`, qui embarque actuellement
`src/assets/phuthon.ogg`), le défilement (en perspective) est
visible, la balle suit souris/doigt/clavier (mouvement clavier fluide
en continu, pas saccadé), les tuiles apparaissent avec un espacement
irrégulier qui suit le rythme entendu, une tuile touchée devient verte
(dorée si atterrissage parfait, avec incrément des étoiles dans le
HUD) et incrémente le score, une tuile ratée déclenche l'écran
d'échec, le bouton pause fonctionne (le son se fige aussi, pas
seulement le jeu), terminer le niveau affiche l'écran de victoire,
rejouer est instantané (musique déjà analysée réutilisée), et le solde
d'étoiles survit à un rechargement de la page (localStorage).

## Comment intégrer plus tard les assets finaux et Supabase

Ne pas improviser : suivre exactement la marche à suivre décrite dans
`docs/FUTURE_INTEGRATIONS.md`, qui liste fichier par fichier ce qu'il
faut changer (et surtout, ce qu'il ne faut **pas** changer).

## Fichiers à lire en priorité

1. `docs/HANDOFF.md` (ce fichier)
2. `docs/ARCHITECTURE.md`
3. `docs/GAMEPLAY.md`
4. `src/config/gameConfig.js` (pour comprendre les réglages actuels)
5. `src/core/engine.js` (le cœur des règles du jeu)
6. `docs/BUGS.md` et `docs/FUTURE_INTEGRATIONS.md` (contexte historique
   et travail à venir)
