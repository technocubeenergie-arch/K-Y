# Architecture du projet

> Dernière mise à jour : le niveau est généré à partir du rythme réel
> de la musique du jeu (plus de tempo fixe ni de musique composée pour
> le jeu). Ce document doit rester fidèle au code : si tu changes un
> module, mets cette page à jour dans le même commit.

## Vue d'ensemble

Le jeu tourne **entièrement dans le navigateur**, sans étape de
compilation ("build"). C'est volontaire : pour une débutante, pouvoir
ouvrir un fichier et voir le résultat tout de suite est important.

Chaque fichier JavaScript ajoute ses fonctionnalités à un seul objet
global partagé, `TH` (comme "TilesHop") :

```js
(function (TH) {
  'use strict';
  TH.MonModule = class MonModule { /* ... */ };
})(window.TH = window.TH || {});
```

Ce motif s'appelle une IIFE (fonction immédiatement exécutée). Il évite
d'utiliser `import`/`export` (les "modules ES"), qui ne fonctionnent pas
si on ouvre juste le fichier `index.html` sans serveur. En échange, **l'ordre
des balises `<script>` dans `index.html` est important** : un fichier qui
utilise `TH.Tile` doit être chargé après `entities/tile.js`.

## Organisation du dépôt

```
index.html              Structure de la page (canvas + HUD + écrans)
css/style.css            Habillage visuel (aucune logique de jeu)
src/
  config/
    gameConfig.js         Tous les réglages (vitesse, détection de rythme, couleurs...)
  utils/
    math.js                Petites fonctions génériques (clamp, lerp)
    base64.js                Convertit une donnée base64 embarquée en ArrayBuffer (audio)
  core/
    eventBus.js             Messagerie entre modules (pub/sub)
    clock.js                 Le temps qui passe (chrono, pause), rien d'autre
    engine.js                 Le cerveau : règles du jeu, score, étoiles, victoire/échec
    gameLoop.js                La boucle requestAnimationFrame (input → engine → rendu)
    input.js                   Traduit souris/doigt/clavier en "va vers X" (déplacement clavier fluide, image par image)
  entities/
    ball.js                  La balle : position, rebond visuel
    tile.js                   Une tuile : position, état (pending/hit/missed), atterrissage parfait
  level/
    levelData.js              La "recette" du tracé latéral (motif de lettres)
    levelSequencer.js          Transforme des horaires détectés + le tracé en vraies tuiles
  render/
    camera.js                  Défilement + projection en perspective (position/échelle écran)
    renderer.js                  Dessine tout sur le canvas (route, tuiles, balle)
  audio/
    beatDetector.js              Analyse la musique du jeu pour trouver son rythme (onsets)
    audioManager.js               Seul fichier qui touche à l'API audio
  ui/
    hud.js                      Score, progression et étoiles affichés pendant la partie
    screens.js                   Écrans démarrage / pause / échec / fin
  storage/
    localStore.js               Sauvegarde du meilleur score et de la tirelire d'étoiles (temporaire, local)
  assets/
    assetManifest.js             Registre central de tous les assets (voir plus bas)
    levelTrackData.js              La musique du niveau, encodée en base64 (généré, voir plus bas)
    phuthona.ogg                     Fichier audio actuellement utilisé pour le niveau (test de comparaison, voir docs/GAMEPLAY.md)
    audioniveau6.ogg                Fichier audio précédent, gardé pour comparaison/régénération
  main.js                    Chef d'orchestre : crée et relie tous les modules
docs/                     Documentation (ce dossier)
tools/
  beatmap-editor/         Outil SÉPARÉ du jeu (page HTML indépendante) pour fabriquer
                          des beatmaps à la main — voir docs/BEATMAP_EDITOR.md
```

## Qui a le droit de connaître qui ?

C'est la règle la plus importante pour garder le code "propre" :

- **`config/`, `utils/`** : ne dépendent de rien. Tout le monde peut les lire.
- **`entities/` (Ball, Tile)** : ne connaissent ni le rendu, ni l'audio, ni
  les règles du jeu. Une balle sait juste "où je suis" et "comment je
  rebondis visuellement". Une tuile sait juste "où je suis" et "mon état".
- **`level/`** : transforme des données de niveau en objets `Tile`. Ne sait
  pas dessiner ni jouer de son.
- **`core/engine.js`** : LE SEUL module qui décide des règles (touché,
  raté, score, victoire). Il ne dessine rien et ne joue aucun son
  directement : il informe les autres via `eventBus`.
- **`render/`** : lit l'état préparé par `engine.js` et le dessine. Ne
  modifie jamais le score ni l'état du jeu.
- **`audio/`** : ne décide jamais des règles. Il **réagit** aux
  événements du jeu (`tile:hit`, `game:over`...) émis par `engine.js`,
  via `main.js` qui fait le lien.
- **`ui/` (hud, screens)** : pareil, réagit aux événements, ne pilote rien.
- **`storage/`** : indépendant, fournit juste `getHighScore()` /
  `setHighScore()`.
- **`main.js`** : le seul fichier qui a le droit de connaître **tous**
  les modules. Il les construit et les branche ensemble, puis les laisse
  travailler.

Cette séparation veut dire qu'un bug dans le rendu (par exemple une
tuile mal dessinée) ne peut pas venir de `engine.js`, et qu'un bug de
score ne peut pas venir de `renderer.js`. Ça aide énormément à chercher
un bug rapidement.

## Comment les modules communiquent : l'eventBus

Plutôt que d'appeler les autres modules directement (ce qui créerait des
dépendances emmêlées), `engine.js` **annonce** ce qu'il se passe :

```js
eventBus.emit('tile:hit', { index, score, isPerfect, runStars, starBalance });
eventBus.emit('game:over', { score, highscore, isNewHighscore, runStars, starBalance });
```

Et les autres modules **s'abonnent** à ce qui les intéresse :

```js
eventBus.on('game:over', () => audioManager.playFailSound());
```

Événements existants aujourd'hui : `game:start`, `game:pause`,
`game:resume`, `game:over`, `game:complete`, `tile:hit`, `tile:miss`,
`level:reached` (voir docs/GAMEPLAY.md, section "Une partie, plusieurs
niveaux" — signale juste qu'on vient d'entrer dans un nouveau niveau,
pour le HUD ; contrairement aux autres événements, il ne correspond à
AUCUN changement d'état du jeu : l'horloge, la balle et les tuiles
continuent sans interruption, toute la partie étant une seule séquence
continue construite d'un coup, voir `level/levelSequencer.js`,
`combineLevelSequences`).

## Le flux principal (une image de jeu)

1. `gameLoop.js` demande une nouvelle image au navigateur
   (`requestAnimationFrame`), calcule `dt` (temps écoulé depuis la
   dernière image).
2. `input.update(dt)` regarde si une flèche du clavier est actuellement
   enfoncée, et si oui, déplace la cible de la balle d'une petite
   distance proportionnelle à `dt` (c'est ce qui rend le clavier fluide
   plutôt que saccadé — voir `docs/BUGS.md`, BUG-004). Le glisser
   souris/tactile, lui, met déjà à jour la cible directement à chaque
   déplacement, sans attendre cette étape.
3. `engine.update(dt)` :
   - met à jour la position de la balle (`ball.update()`),
   - lit le temps écoulé via `clock.getElapsedSeconds()`,
   - vérifie si une nouvelle tuile vient d'atteindre la ligne d'impact
     (voir `docs/GAMEPLAY.md` pour le calcul du rythme),
   - si oui : compare la position de la balle à celle de la tuile,
     marque la tuile `hit` ou `missed`, met à jour le score, émet les
     événements correspondants.
4. `renderer.render(engine)` redessine tout : fond, tuiles (dont la
   position à l'écran est calculée par `camera.js` à partir du temps
   écoulé), balle.
5. Les modules `audio/`, `ui/hud.js`, `ui/screens.js` réagissent aux
   événements émis à l'étape 3, indépendamment les uns des autres.

## Le défilement automatique (comment on a corrigé le jeu statique)

Chaque tuile a une position fixe "dans le monde" (`tile.worldY`), qui ne
bouge jamais. C'est la **caméra** (`render/camera.js`) qui, à chaque
image, calcule où **à l'écran** chaque tuile doit apparaître, en
fonction du temps écoulé. Plus le temps passe, plus les tuiles se
rapprochent de la ligne d'impact, sans que le joueur n'ait jamais à
s'en occuper. C'est ce mécanisme qui remplace l'ancien jeu statique.

## La perspective (vue "depuis derrière la balle")

Depuis la version "vue perspective", `camera.js` ne calcule pas
seulement une position, mais une **projection** : position à l'écran
ET échelle (taille), à partir d'une notion de "profondeur" :

```
profondeur d'une tuile = sa position dans le monde − distance déjà parcourue
échelle                = focalDepth / (focalDepth + profondeur)
position à l'écran     = horizon + (ligne d'impact − horizon) × échelle
```

Une tuile encore loin (grande profondeur) a une échelle proche de 0 :
elle apparaît minuscule, près du point de fuite (le centre, à hauteur
de l'horizon). Une tuile sur le point d'être atteinte (profondeur proche
de 0) a une échelle proche de 1 : taille normale, en bas de l'écran. Le
même calcul s'applique à la position latérale (`flatX`), qui se
resserre vers le centre pour les tuiles lointaines — comme une route
qui s'élargit en s'approchant.

`render/renderer.js` ne dessine pas une tuile dont l'échelle tombe sous
un seuil minimum — sinon, un niveau généré à partir d'un long morceau
(beaucoup de tuiles) afficherait un fouillis de tuiles minuscules
empilées près de l'horizon, puisque toutes les tuiles à venir (même
très loin dans le niveau) sont projetées à chaque image, aussi loin
soit leur `worldY`. Ce seuil est volontairement **différent** pour une
vraie tuile (`config.perspective.minVisibleScale`, très bas : on VEUT
voir le chemin s'étirer loin vers l'horizon) et pour une fausse tuile
(`config.tile.decoyMinVisibleScale`, nettement plus haut : elle ne sert
qu'à brouiller la lecture juste avant l'atterrissage, pas à décorer
tout l'horizon — voir docs/GAMEPLAY.md).

**Point important d'architecture** : cette perspective est une pure
affaire de *rendu*. `core/engine.js` (les règles du jeu) continue de
raisonner uniquement en positions "à plat" (`tile.getCenterX`, sans
perspective) pour détecter les collisions : il ne sait même pas que
l'écran affiche une perspective. C'est cette séparation stricte entre
"les règles" et "le dessin" (voir plus haut, "qui a le droit de
connaître qui") qui a permis de faire cet ajout uniquement en modifiant
`camera.js` et `renderer.js`, sans toucher au moteur de jeu ni casser
le score, les collisions ou les étoiles.

## Générer les tuiles depuis le rythme de la musique (pas l'inverse)

Règle de fonctionnement du jeu : **la musique décide, les tuiles
suivent** — jamais l'inverse. Il n'y a pas de tempo fixé à l'avance
dans `gameConfig.js`, et pas de musique composée pour coller à des
tuiles déjà placées. Le moteur écoute le vrai fichier audio du jeu et
en déduit où placer les tuiles.

1. **`audio/beatDetector.js`** analyse un `AudioBuffer` déjà décodé et
   renvoie une liste d'horaires (secondes) où un "coup" a été détecté
   (une technique simple de flux d'énergie : voir les commentaires du
   fichier). Ce module ne connaît ni les tuiles, ni le jeu : il ne fait
   que de l'analyse de signal.
2. **`level/levelSequencer.buildSequence(beatTimes, levelDef, config)`**
   transforme cette liste d'horaires en objets `Tile`. La position
   latérale (quelle lettre FL/L/C/R/FR) vient de `levelDef`
   (`level/levelData.js`) : l'analyse audio ne peut donner QUE le
   rythme, pas où placer la balle. La même fonction repère aussi les
   longs vides entre deux tuiles (`buildBridges`) pour y placer une
   plateforme de liaison (voir `docs/GAMEPLAY.md`) — une liste séparée
   (`sequence.bridges`), jamais mêlée à `sequence.tiles`.
3. **`core/engine.js`** ne suppose jamais un intervalle fixe entre deux
   tuiles : chaque `Tile` porte son propre `expectedTime`, et c'est
   cette valeur que la boucle de jeu compare au temps écoulé — jamais
   `index × un_intervalle_fixe`. Le rebond de la balle
   (`getBouncePhase`) est calculé de la même façon, à partir de l'écart
   réel entre la dernière tuile passée et la prochaine.
4. **`config.scroll.speed`** est une vitesse de défilement CONSTANTE.
   C'est ce qui permet à la caméra (`render/camera.js`) de rester
   simple : elle n'a jamais besoin de connaître le détail du rythme,
   juste la position (`worldY`) de chaque tuile.
5. **`audio/audioManager.js`** décode et joue le fichier audio du jeu
   (`decodeArrayBuffer` / `scheduleLevels`). Le fichier lui-même est
   embarqué en base64 directement dans un script JS
   (`assets/levelTrackData.js`, généré à partir du fichier `.ogg`
   actuellement choisi comme musique du niveau — voir
   `src/assets/assetManifest.js` pour savoir lequel) : pas de
   `fetch()`, donc ça fonctionne même en ouvrant `index.html`
   directement, sans serveur (voir `docs/BUGS.md`).
6. **`main.js`** (`handleStart`) enchaîne ces étapes au clic sur
   "Jouer" : décodage → détection du rythme → construction du niveau →
   lecture → `engine.start(startTime, sequence)`. Le résultat de
   l'analyse est mis en cache : les parties suivantes ("Réessayer",
   "Rejouer") réutilisent la musique déjà décodée et le niveau déjà
   généré, sans refaire l'analyse à chaque fois.

## Les assets : centralisés et remplaçables

Les visuels (balle, tuiles, fond) restent **générés par du code**
(formes simples sur le canvas). La musique, elle, est un vrai fichier
(actuellement `assets/phuthona.ogg`, voir `docs/GAMEPLAY.md`), mais
c'est encore un choix temporaire (pas de sélection par le joueur).
Chaque asset est référencé dans `src/assets/assetManifest.js`, avec son statut
et, pour les visuels encore générés, leur futur chemin de fichier. Voir
`docs/FUTURE_INTEGRATIONS.md` pour la marche à suivre le jour du
remplacement.

## Conventions à respecter en ajoutant du code

- Un fichier = une responsabilité. Si un fichier commence à faire
  "deux choses", c'est le signal qu'il faut le découper.
- Aucun nombre magique en dur ailleurs que dans `config/gameConfig.js`.
- Un module ne doit jamais piloter directement un autre module qui
  n'est pas sous sa responsabilité directe (ex: `renderer.js` ne doit
  jamais modifier `engine.score`) : passer par l'eventBus.
- Ajouter un nouveau fichier = ajouter sa balise `<script>` dans
  `index.html`, **au bon endroit** dans l'ordre (avant les fichiers qui
  en dépendent).
- Mettre à jour cette page si l'organisation change.
