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
automatique, contrôle de la balle, musique procédurale rythmée
d'environ 60s) → écran d'échec (avec meilleur score) ou écran de
victoire → possibilité de rejouer. Testé en conditions automatisées
(Playwright) : défilement, collisions, échec, retry, pause et fin de
niveau fonctionnent tous correctement, sans erreur console.

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
- Moteur de règles (`core/engine.js`) : score, collision, échec, victoire
- Boucle de jeu (`core/gameLoop.js`)
- Entrées joueur souris/tactile/clavier (`core/input.js`)
- Balle (`entities/ball.js`), Tuile (`entities/tile.js`)
- Données de niveau en "lettres" + séquenceur (`level/levelData.js`,
  `level/levelSequencer.js`)
- Caméra/défilement (`render/camera.js`), rendu canvas (`render/renderer.js`)
- Musique procédurale + gestionnaire audio (`audio/musicGenerator.js`,
  `audio/audioManager.js`)
- HUD et écrans (`ui/hud.js`, `ui/screens.js`)
- Sauvegarde locale du meilleur score (`storage/localStore.js`)
- Registre central des assets temporaires (`assets/assetManifest.js`)

## Mécaniques en place

Voir `docs/GAMEPLAY.md` pour le détail. En résumé : défilement
automatique basé sur le temps, une tuile toutes les `hopBeats`
battements de musique, collision tolérante à la demi-largeur d'une
tuile, échec immédiat si raté, musique dont la mélodie suit directement
la position des tuiles.

## Bugs connus

Voir `docs/BUGS.md`. Le bug majeur d'origine (jeu totalement statique)
est résolu. Les autres entrées du journal sont des risques identifiés
et déjà prévenus (pas des bugs actifs).

## Prochaines priorités (au moment de la rédaction de ce document)

1. Faire jouer/tester le niveau par Ylonna elle-même et récolter son
   ressenti (difficulté, plaisir, lisibilité du chemin des tuiles).
2. Ajuster éventuellement le motif du niveau d'entraînement
   (`level/levelData.js`) selon ce retour — c'est un fichier simple à
   modifier même sans savoir coder.
3. Envisager un deuxième niveau **seulement** une fois le premier
   validé comme "parfaitement fonctionnel et amusant" (consigne
   explicite : pas de contenu supplémentaire avant ça).
4. Plus tard seulement : remplacement des assets et intégration
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

Vérifier au minimum : le défilement est visible, la balle suit
souris/doigt/clavier, une tuile touchée devient verte et incrémente le
score, une tuile ratée déclenche l'écran d'échec, le bouton pause
fonctionne, terminer le niveau affiche l'écran de victoire.

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
