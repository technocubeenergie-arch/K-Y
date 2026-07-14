# Architecture du projet

> Dernière mise à jour : niveau d'entraînement v1 (défilement automatique,
> musique procédurale, moteur complet). Ce document doit rester fidèle au
> code : si tu changes un module, mets cette page à jour dans le même
> commit.

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
    gameConfig.js         Tous les réglages (vitesse, tempo, couleurs...)
  utils/
    math.js                Petites fonctions génériques (clamp, lerp)
  core/
    eventBus.js             Messagerie entre modules (pub/sub)
    clock.js                 Le temps qui passe (chrono, pause), rien d'autre
    engine.js                 Le cerveau : règles du jeu, score, victoire/échec
    gameLoop.js                La boucle requestAnimationFrame (input → engine → rendu)
    input.js                   Traduit souris/doigt/clavier en "va vers X" (déplacement clavier fluide, image par image)
  entities/
    ball.js                  La balle : position, rebond visuel
    tile.js                   Une tuile : position, état (pending/hit/missed)
  level/
    levelData.js              La "recette" du niveau (motif de lettres)
    levelSequencer.js          Transforme la recette en vraies tuiles + timing
  render/
    camera.js                  Calcule le défilement (position écran d'une tuile)
    renderer.js                  Dessine tout sur le canvas
  audio/
    musicGenerator.js           Compose la musique du niveau (Web Audio)
    audioManager.js               Seul fichier qui touche à l'API audio
  ui/
    hud.js                      Score et progression affichés pendant la partie
    screens.js                   Écrans démarrage / pause / échec / fin
  storage/
    localStore.js               Sauvegarde du meilleur score (temporaire, local)
  assets/
    assetManifest.js             Registre central de tous les assets (voir plus bas)
  main.js                    Chef d'orchestre : crée et relie tous les modules
docs/                     Documentation (ce dossier)
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
eventBus.emit('tile:hit', { index, score });
eventBus.emit('game:over', { score, highscore, isNewHighscore });
```

Et les autres modules **s'abonnent** à ce qui les intéresse :

```js
eventBus.on('tile:hit', () => audioManager.playLandSound());
```

Événements existants aujourd'hui : `game:start`, `game:pause`,
`game:resume`, `game:over`, `game:complete`, `tile:hit`, `tile:miss`.

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
image, calcule à quelle hauteur **à l'écran** chaque tuile doit
apparaître, en fonction du temps écoulé :

```
distance parcourue = vitesse de défilement × temps écoulé
position à l'écran  = ligne d'impact − position dans le monde + distance parcourue
```

Résultat : plus le temps passe, plus les tuiles "descendent" vers la
ligne d'impact, sans que le joueur n'ait jamais à s'en occuper. C'est ce
mécanisme qui remplace l'ancien jeu statique.

## Les assets : centralisés et remplaçables

Aujourd'hui, aucun vrai fichier image/son n'existe : tout est **généré
par du code** (formes simples sur le canvas, sons synthétiques via Web
Audio). Chaque asset "temporaire" est référencé dans
`src/assets/assetManifest.js`, avec son futur chemin de fichier. Voir
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
