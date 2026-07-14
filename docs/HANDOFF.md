# Document de reprise / transmission

> Lis ce document en premier si tu reprends ce projet sans contexte
> préalable. Il doit te suffire pour être opérationnel immédiatement.

## Objectif exact du projet

Construire, avec une débutante de 13 ans (Ylonna), un jeu inspiré de
**Tiles Hop** : une balle avance automatiquement dans un niveau rythmé
par la musique, le joueur la dirige latéralement pour atterrir sur des
tuiles, et rate = fin de partie immédiate. L'objectif est un
accompagnement pédagogique en plus du résultat technique : code propre,
modulaire, bien documenté, expliqué simplement.

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

Jouable de bout en bout : écran de démarrage → jeu (défilement
automatique en perspective façon "vu depuis derrière la balle",
contrôle de la balle au clavier/souris/tactile, musique procédurale
rythmée d'environ 60s, étoiles gagnées sur atterrissage parfait) →
écran d'échec (avec meilleur score et étoiles) ou écran de victoire →
possibilité de rejouer. Un bouton expérimental sur l'écran de
démarrage ("🧪 Tester avec la musique importée") génère aussi un niveau
à partir du rythme réel d'un fichier audio importé, au lieu du tempo
fixe habituel (voir "Mécaniques en place" ci-dessous). Testé en
conditions automatisées (Playwright) : défilement, collisions, échec,
retry, pause (audio compris), fin de niveau, mouvement clavier continu,
gain/persistance des étoiles, et génération de niveau depuis une
musique importée fonctionnent tous correctement, sans erreur console.

Historique des retours déjà pris en compte : mouvement clavier rendu
fluide (BUG-004), vitesse clavier ralentie (480 → 260 → 170px/s) suite
aux retours de Ylonna, ajout du système d'étoiles, correction d'une
zone morte sur les tuiles (BUG-006), passage en vue perspective,
correction du décalage audio/jeu après une pause (BUG-007), nouvelle
composition musicale, et génération de tuiles depuis le rythme d'une
vraie musique importée (voir `docs/GAMEPLAY.md` et `docs/BUGS.md`).

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
- Données de niveau en "lettres" + séquenceur, avec deux façons de
  construire un niveau : tempo fixe (`buildSequence`) ou horaires
  détectés dans une musique (`buildSequenceFromBeatTimes`)
  (`level/levelData.js`, `level/levelSequencer.js`)
- Caméra/défilement/perspective (`render/camera.js`), rendu canvas en
  perspective (`render/renderer.js`)
- Musique procédurale (basse + progression d'accords) + gestionnaire
  audio, qui sait aussi charger/jouer un vrai fichier
  (`audio/musicGenerator.js`, `audio/audioManager.js`)
- Détection de rythme dans un fichier audio importé
  (`audio/beatDetector.js`)
- HUD et écrans, avec affichage des étoiles (`ui/hud.js`, `ui/screens.js`)
- Sauvegarde locale du meilleur score ET de la tirelire d'étoiles
  (`storage/localStore.js`)
- Registre central des assets temporaires (`assets/assetManifest.js`)

## Mécaniques en place

Voir `docs/GAMEPLAY.md` pour le détail. En résumé : défilement
automatique basé sur le temps, une tuile toutes les `hopBeats`
battements de musique (niveau d'entraînement), toute la tuile compte
comme réussie mais une petite zone dorée au centre rapporte en plus une
étoile, échec immédiat si raté à côté, musique dont la mélodie suit la
position des tuiles ET une progression d'accords. Les étoiles sont une
monnaie persistante prévue pour une future boutique (non construite).

**Important pour la suite** : le moteur ne suppose plus un intervalle
fixe entre deux tuiles (`core/engine.js` lit `tile.expectedTime` au cas
par cas). C'est ce qui permet le bouton de test "🧪 Tester avec la
musique importée" : `audio/beatDetector.js` analyse un vrai fichier
audio pour trouver son rythme, et `level/levelSequencer.buildSequenceFromBeatTimes`
construit un niveau à partir de ces horaires réels, irréguliers. C'est
pour l'instant un test, pas un second niveau permanent (voir
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
3. Finaliser l'import de musique (sélection d'un fichier par le
   joueur, retrait du fichier de test non optimisé, bouton retour au
   menu) — voir `docs/FUTURE_INTEGRATIONS.md` section 2. Puis
   construire la boutique pour dépenser les étoiles (catalogue, écran,
   inventaire possédé) — section 3.
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
vérifier une modification :

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080 dans un navigateur
```

Vérifier au minimum : le défilement (en perspective) est visible, la
balle suit souris/doigt/clavier (mouvement clavier fluide en continu,
pas saccadé), une tuile touchée devient verte (dorée si atterrissage
parfait, avec incrément des étoiles dans le HUD) et incrémente le
score, une tuile ratée déclenche l'écran d'échec, le bouton pause
fonctionne (le son se fige aussi, pas seulement le jeu), terminer le
niveau affiche l'écran de victoire, et le solde d'étoiles survit à un
rechargement de la page (localStorage). Pour le bouton "🧪 Tester avec
la musique importée" : vérifier que l'analyse se termine (message de
chargement qui disparaît), que des tuiles apparaissent avec un
espacement irrégulier (pas un rythme parfaitement constant), et que le
fichier `src/assets/mfcc-chinese-japanese-korean-music-324382.mp3`
existe toujours dans le dépôt.

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
