# Journal des bugs

> Historique des problèmes rencontrés et de leur résolution. Un bug
> résolu ne doit jamais être supprimé de ce fichier : c'est une mémoire
> utile pour éviter de refaire la même erreur.

---

## BUG-007 — La musique continuait pendant la pause (signalé par Ylonna)

- **Problème observé** : en mettant le jeu en pause puis en reprenant,
  le son n'était plus du tout synchronisé avec ce qui s'affichait
  ("tout est décalé").
- **Contexte** : Ylonna a soupçonné que le rythme de la musique et la
  génération des tuiles n'étaient pas liés. En creusant, ce n'était
  pas ça : les tuiles et la musique utilisent bien la même horloge et
  les mêmes formules de tempo (voir `docs/GAMEPLAY.md`, "Musique et
  tuiles : un seul et même rythme") — le souci était ailleurs.
- **Cause identifiée** : `engine.togglePause()` mettait bien en pause
  l'horloge du JEU (`core/clock.js`, qui gèle correctement les calculs
  de tuiles), mais **rien ne mettait en pause l'audio**. La musique,
  programmée à l'avance avec des horaires absolus sur l'horloge de
  l'`AudioContext`, continuait donc de jouer normalement pendant que
  le jeu était figé à l'écran. Au moment de reprendre, le son avait
  "couru en avance" de toute la durée de la pause : la note qu'on
  entendait ne correspondait plus à la tuile affichée.
- **Solution appliquée** :
  - `audio/audioManager.js` : nouvelle méthode `pause()`, qui appelle
    `AudioContext.suspend()`. C'est la méthode native du navigateur qui
    gèle à la fois le son ET l'horloge audio elle-même
    (`audioContext.currentTime` n'avance plus du tout tant que le
    contexte est suspendu).
  - `main.js` : `eventBus.on('game:pause', ...)` appelle
    `audioManager.pause()`, et `eventBus.on('game:resume', ...)`
    réutilise `audioManager.resumeIfNeeded()` (déjà utilisée au
    lancement de la partie) pour relancer l'audio.
- **Effets secondaires** : aucun. `core/clock.js` n'a pas eu besoin
  d'être modifié : puisque l'horloge audio elle-même est maintenant
  gelée pendant la pause, son mécanisme de compensation existant
  (`_pauseAccumulated`) devient simplement inutile pendant ce laps de
  temps (rien à compenser), sans jamais causer de double correction.
- **Point de vigilance** : toute nouvelle action qui met le jeu en
  pause doit systématiquement geler l'audio de la même façon (passer
  par l'eventBus, jamais appeler `audioContext` directement ailleurs
  que dans `audioManager.js`).
- **Vérifié** : testé en navigateur réel (Playwright), en interceptant
  les appels à `suspend()`/`resume()` : le temps audio mesuré est
  strictement identique juste avant la pause et juste après la reprise
  (aucune avance pendant les 2 secondes de pause simulées), et le jeu
  continue ensuite à un rythme normal, sans échec ni saut de tuile.

### Note sur une proposition de refonte complète (BeatmapEngine)

Ylonna a proposé, pour corriger ce bug, de s'inspirer d'une architecture
plus large de type "BeatmapEngine" (liste d'événements `{time, xNorm}`,
position de la balle interpolée entre deux événements, horloge basée sur
`AudioContext`, jugement par fenêtre de tolérance). Après relecture, les
bonnes pratiques utiles à notre jeu **étaient déjà en place** :

- horloge de jeu basée sur `AudioContext.currentTime`, jamais sur
  `Date.now()`/`performance.now()`/`setInterval()` comme référence
  principale (voir `core/clock.js`) ;
- une donnée structurée de type "liste d'événements avec position et
  horaire" : c'est exactement le rôle de `level/levelSequencer.js`, qui
  transforme le tracé du niveau en tuiles (chacune avec un `worldY`
  correspondant à un horaire précis, et une position latérale) ;
  chaque tuile est déjà l'équivalent de son `BeatEvent {time, xNorm}` ;
- jugement une seule fois par tuile, avec une fenêtre de tolérance
  configurable (`hitZoneRatio`, `perfectZoneRatio` dans
  `gameConfig.js`), jamais rejugée après coup.

En revanche, l'idée de faire **suivre** à la balle une position
interpolée automatiquement entre deux événements n'a pas été reprise :
dans un jeu type Tiles Hop, c'est le **joueur** qui contrôle la
position latérale de la balle (glisser le doigt/la souris), pas une
trajectoire pré-calculée. Adopter cette partie de la proposition
aurait supprimé le contrôle du joueur, ce qui n'est pas ce qui est
recherché ici.

---

## BUG-006 — Zone morte sur la tuile : on perdait en atterrissant sur du bleu (signalé par Ylonna)

- **Problème observé** : en jouant, atterrir sur la partie bleue d'une
  tuile (visuellement dessus, mais en dehors de l'anneau blanc ajouté
  précédemment) faisait perdre la partie. Mauvaise expérience : le
  joueur voit la balle sur la tuile et perd quand même, sans
  comprendre pourquoi.
- **Contexte** : suite aux demandes précédentes de resserrer la "zone
  de réussite" (BUG-005 et les ajustements suivants), `tile.hitZoneRatio`
  avait été progressivement réduit jusqu'à 0,6 (36px de tolérance sur
  une tuile qui s'étend à 60px de chaque côté du centre). Le résultat :
  une bande de 24px de chaque côté, visible en bleu sur la tuile, mais
  qui comptait comme un échec au moment de l'impact.
- **Cause identifiée** : confusion entre deux besoins différents qui
  utilisaient la même mécanique. "Réduire la difficulté pour toucher
  une tuile" et "réduire la difficulté pour gagner une étoile" sont
  deux réglages séparés dans l'esprit du jeu, mais le code n'utilisait
  qu'une seule zone resserrée (`hitZoneRatio`) pour les deux, sans zone
  intermédiaire "j'ai touché la tuile, mais pas assez précisément pour
  une étoile".
- **Solution appliquée** : clarification du modèle en 3 zones, du plus
  généreux au plus exigeant :
  - `tile.hitZoneRatio` repassé à **1** (toute la tuile compte comme
    réussite — on ne perd que si on atterrit carrément à côté) ;
  - `tile.perfectZoneRatio` réduit de moitié, de 0,5 à **0,25** (15px
    de tolérance), pour que le bonus étoile reste difficile à obtenir
    sans jamais mettre en danger la survie ;
  - `render/renderer.js` simplifié : seule la zone dorée (le bonus) est
    maintenant dessinée sur les tuiles pas encore atteintes, la bande
    blanche (`hitZonePreviewColor`) a été retirée car elle n'a plus de
    sens (elle recouvrait exactement toute la tuile).
- **Effets secondaires** : aucun changement de comportement pour un
  atterrissage pile centre (toujours parfait + étoile) ni pour un
  atterrissage complètement à côté (toujours un échec).
- **Point de vigilance** : ne plus jamais réutiliser `hitZoneRatio`
  pour régler la difficulté du bonus étoile — c'est le rôle exclusif de
  `perfectZoneRatio`. `hitZoneRatio` doit rester à 1 sauf demande
  explicite de faire perdre le joueur pour une tuile visuellement
  atteinte (ce qui n'est, à ce jour, pas souhaité).
- **Vérifié** : testé en navigateur réel (Playwright) — un atterrissage
  à 59px du centre (bord de tuile) marque un point sans étoile ; un
  atterrissage pile centre marque un point + une étoile ; un
  atterrissage à 90px du centre (hors tuile) déclenche bien l'échec.

---

## BUG-005 — Les étoiles ne s'obtenaient presque jamais (signalé par Ylonna)

- **Problème observé** : Ylonna a testé le système d'étoiles (BUG/feature
  ajoutée juste avant) en visant délibérément le centre des tuiles, sans
  jamais obtenir de tuile dorée / d'étoile.
- **Contexte** : deux causes cumulées ont été identifiées en relisant
  `css/style.css` et `src/config/gameConfig.js`.
- **Cause n°1 (la principale) — mise en page non adaptative** :
  `#game-stage` avait une taille **fixe** en CSS (`width: 400px; height:
  700px`), sans jamais s'adapter à la taille réelle de l'écran. Sur un
  téléphone (dont la largeur est presque toujours inférieure à 400px),
  le jeu dépassait de l'écran. Résultat : viser précisément devenait
  quasi impossible, même en essayant sérieusement, car l'affichage et
  le contrôle tactile n'étaient plus correctement alignés avec ce que
  l'œil voyait.
- **Cause n°2 (aggravante) — tolérance trop stricte** : la zone
  "parfaite" ne tolérait que 24px d'écart autour du centre d'une tuile
  de 120px de large (un peu plus de 1/5e de la largeur). Une valeur
  raisonnable sur le papier, mais trop exigeante pour un doigt ou une
  souris, qui ne sont jamais parfaitement précis.
- **Solution appliquée** :
  - `#game-stage` utilise maintenant `width: min(400px, 92vw,
    calc((100vh - 130px) * (400 / 700)))` avec `aspect-ratio: 400/700` :
    le jeu garde toujours ses proportions, mais sa taille à l'écran
    s'adapte pour ne jamais dépasser l'écran (largeur OU hauteur,
    celle qui est la plus contraignante). Aucun changement JS
    nécessaire : `core/input.js` convertissait déjà correctement les
    coordonnées du doigt/souris via `getBoundingClientRect()`, quelle
    que soit la taille affichée.
  - `tile.perfectZoneRatio` passe de 0,4 à 0,5 (24px → 30px de
    tolérance), pour rester exigeant sans être irréaliste.
- **Effets secondaires** : aucun changement de logique de jeu (moteur,
  collisions) — uniquement CSS + une constante de configuration.
- **Point de vigilance** : toute nouvelle zone de l'interface (future
  boutique, futurs écrans) doit être pensée responsive dès le départ
  (tester avec un viewport mobile étroit, ex. 360-390px de large), et
  ne jamais utiliser de taille fixe en pixels pour un conteneur plein
  écran.
- **Vérifié** : testé avec un viewport mobile simulé (Playwright,
  375×667, taille d'un iPhone SE) : le jeu tient maintenant entièrement
  dans l'écran, sans dépassement horizontal.

---

## BUG-004 — Déplacement au clavier saccadé (signalé par Ylonna)

- **Problème observé** : en maintenant une flèche `←`/`→` enfoncée, la
  balle se déplaçait par à-coups au lieu de glisser en continu ; il
  fallait parfois appuyer plusieurs fois pour qu'elle avance.
- **Contexte** : `core/input.js` déplaçait la balle **une seule fois par
  événement `keydown`**. Or le navigateur ne renvoie pas un `keydown` en
  continu pendant qu'une touche est maintenue : il en envoie un premier,
  attend un court délai, puis en renvoie à un rythme de répétition qui
  dépend du système d'exploitation — d'où l'effet saccadé.
- **Cause identifiée** : le mouvement clavier n'était pas rattaché à la
  boucle de jeu (image par image), contrairement au glisser
  souris/tactile qui, lui, était déjà fluide (position appliquée
  directement à chaque déplacement du doigt).
- **Solution appliquée** : `input.js` ne déplace plus la balle au moment
  du `keydown`. Il retient seulement quelles flèches sont actuellement
  enfoncées (`keydown` ajoute, `keyup` retire). Une nouvelle méthode
  `update(dt)`, appelée à chaque image par `core/gameLoop.js`, fait
  avancer la balle d'une petite distance (`config.ball.keyboardSpeed *
  dt`) tant qu'une flèche reste enfoncée. Un écouteur `blur` vide aussi
  la liste des touches enfoncées si la fenêtre perd le focus, pour
  éviter qu'une touche reste "coincée" si le `keyup` n'arrive jamais.
- **Effets secondaires** : `GameLoop` prend désormais un troisième
  paramètre (`input`) en plus de `engine` et `renderer` ; `main.js` a été
  mis à jour en conséquence. Aucun changement pour le contrôle
  souris/tactile, déjà fluide.
- **Point de vigilance** : toute nouvelle entrée clavier future doit
  suivre ce même principe (lire l'état à chaque image via `update(dt)`),
  jamais agir directement dans le gestionnaire d'événement `keydown`.
- **Vérifié** : test automatisé (Playwright) confirmant un déplacement
  régulier de 72px toutes les 150ms en maintenant la touche (soit
  480px/s, la vitesse configurée), jusqu'au bord de l'écran.

---

## BUG-001 — Le jeu ne défilait pas du tout (jeu "statique")

- **Problème observé** : dans la version de départ (`index.html`
  originel), la balle rebondissait sur 3 plateformes fixes à l'écran.
  Rien ne défilait, aucune impression d'avancée dans un niveau : le
  joueur ne faisait que rebondir sur place indéfiniment sur les 3 mêmes
  tuiles.
- **Contexte** : c'était la toute première version du jeu, avec un
  unique fichier HTML contenant tout le code (physique, positions des
  plateformes en dur dans le HTML/CSS).
- **Cause identifiée** : les positions des tuiles étaient fixées une
  fois pour toutes en CSS (`#plateforme1`, `#plateforme2`,
  `#plateforme3`), et aucune notion de "temps qui passe" ou de "monde qui
  avance" n'existait dans le code. Il n'y avait ni horloge de niveau, ni
  défilement de caméra, ni séquence de tuiles.
- **Solution appliquée** : introduction d'une vraie architecture de
  défilement automatique :
  - chaque tuile a désormais une position fixe **dans le monde**
    (`tile.worldY`), définie une fois par `level/levelSequencer.js` ;
  - une **caméra** (`render/camera.js`) calcule la position **à
    l'écran** de chaque tuile en fonction du temps écoulé, donnant
    l'impression que tout défile vers le joueur ;
  - une **horloge dédiée** (`core/clock.js`), synchronisée sur l'audio,
    fait avancer ce temps automatiquement, sans aucune action du joueur.
- **Effets secondaires** : aucun connu. Le comportement du joueur
  (déplacement latéral) n'a pas changé de nature, seulement de contexte
  (il se déplace maintenant dans un monde qui avance).
- **Point de vigilance** : ne jamais recoder une position de tuile "en
  dur" dans le code de rendu. Toute nouvelle tuile doit passer par
  `level/levelSequencer.js` pour recevoir un `worldY` cohérent avec le
  tempo de la musique.

---

## BUG-002 (prévenu) — Le son ne doit jamais démarrer sans clic du joueur

- **Problème potentiel** : les navigateurs modernes bloquent la lecture
  de son (et la création d'un `AudioContext` actif) tant que
  l'utilisateur n'a pas interagi avec la page (règle "autoplay
  policy"). Si l'`AudioContext` est créé trop tôt, le son ne joue jamais
  et aucune erreur claire n'apparaît, ce qui rend le bug difficile à
  comprendre pour une débutante.
- **Contexte** : identifié pendant la conception de `audio/audioManager.js`.
- **Cause** : règle de sécurité des navigateurs, pas un bug du jeu en
  lui-même — mais un piège classique si l'`AudioContext` est créé au
  chargement de la page plutôt qu'au clic sur "Jouer".
- **Solution appliquée** : `audioManager.init()` (qui crée
  l'`AudioContext`) n'est appelé que dans `handleStart()` de `main.js`,
  déclenché par le clic sur le bouton **Jouer**. Un appel supplémentaire
  à `resumeIfNeeded()` gère aussi le cas où le navigateur crée le
  contexte en état "suspendu".
- **Effets secondaires** : aucun. La musique commence donc toujours
  très légèrement après le clic (environ 0,15s de battement d'avance
  programmé), ce qui est normal et volontaire.
- **Point de vigilance** : ne jamais appeler `audioManager.init()` ou
  `playMusic()` avant une interaction utilisateur explicite (clic/tap).

---

## BUG-003 (prévenu) — Mauvais calcul de la position du doigt/souris sur le canvas

- **Problème potentiel** : la taille du `<canvas>` en pixels réels
  (`config.canvas.width` = 400) peut être différente de sa taille
  affichée à l'écran en CSS (par exemple sur mobile, si la page est
  redimensionnée). Sans conversion, la position du doigt calculée par
  `event.clientX` ne correspondrait pas à la bonne position `x` dans le
  jeu, et la balle "suivrait" le doigt avec un décalage.
- **Contexte** : identifié en écrivant `core/input.js`.
- **Solution appliquée** : `input.js` utilise
  `canvas.getBoundingClientRect()` pour connaître la taille réellement
  affichée, calcule un facteur d'échelle
  (`config.canvas.width / rect.width`), et l'applique à la position du
  doigt avant de la transmettre à la balle.
- **Point de vigilance** : si la taille du canvas devient un jour
  responsive (changeante selon l'écran), vérifier que ce calcul reste
  bien fait à chaque déplacement (et pas une seule fois au chargement).

---

## Comment ajouter une nouvelle entrée

Copier le modèle ci-dessous en haut de la liste (les bugs les plus
récents en premier), avec un numéro `BUG-XXX` qui s'incrémente :

```
## BUG-XXX — Titre court et clair

- **Problème observé** :
- **Contexte** :
- **Cause identifiée** :
- **Solution appliquée** :
- **Effets secondaires** :
- **Point de vigilance** :
```
