# Journal des bugs

> Historique des problèmes rencontrés et de leur résolution. Un bug
> résolu ne doit jamais être supprimé de ce fichier : c'est une mémoire
> utile pour éviter de refaire la même erreur.

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
