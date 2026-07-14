# Mécaniques du jeu

> Ce document décrit le fonctionnement du niveau d'entraînement tel qu'il
> existe aujourd'hui dans le code. À garder synchronisé avec
> `src/config/gameConfig.js`, `src/core/engine.js` et `src/level/levelData.js`.

## L'inspiration : Tiles Hop

Le jeu s'inspire de *Tiles Hop* (aussi connu sous *EDM Rush* /
*Beat Hopper*) : une balle avance continuellement dans un couloir, le
joueur la dirige seulement sur le côté, et doit atterrir sur des tuiles
qui apparaissent en rythme avec la musique. Rater une tuile termine la
partie immédiatement. Le contrôle est simple : on touche l'écran et on
fait glisser le doigt (« touch / hold / drag »).

Notre jeu reprend ces principes avec une vue "vue depuis derrière la
balle" façon route qui s'éloigne (un peu comme une caméra de voiture
dans un jeu de course, ou la vue à la troisième personne de GTA San
Andreas) : les tuiles apparaissent minuscules à l'horizon, grandissent
en s'approchant, et arrivent jusqu'à une **ligne d'impact** fixe, où la
balle doit se trouver au bon moment. Ce n'est pas de la vraie 3D (pas
de moteur 3D, juste des calculs de mise à l'échelle sur un canvas 2D,
voir `render/camera.js`), mais l'effet visuel s'en rapproche beaucoup,
sans complexifier le reste du jeu : les règles (collision, score,
étoiles) ne savent même pas que cette perspective existe, elles
raisonnent toujours en positions "à plat" (voir `docs/ARCHITECTURE.md`).

## Ce que le joueur contrôle, et ce qu'il ne contrôle pas

| Contrôlé par le joueur | Automatique |
|---|---|
| Position **latérale** (gauche/droite) de la balle | Avancée du niveau (défilement) |
| — | Rythme, tempo, apparition des tuiles |
| — | Rebond visuel de la balle (en rythme) |

Le joueur ne gère jamais "l'avancée" du jeu : elle est 100% automatique,
pilotée par le temps qui passe (voir `docs/ARCHITECTURE.md`, section
"défilement automatique").

## Le rythme structure tout

Tout part du tempo choisi dans `gameConfig.js` :

- `music.bpm = 100` (battements par minute)
- `music.hopBeats = 2` → une tuile arrive toutes les 2 battements

Donc :
- un battement dure `60 / 100 = 0,6 seconde`
- une tuile (un "hop") arrive toutes les `0,6 × 2 = 1,2 seconde`
- pour un niveau d'environ 60 secondes, il faut `60 / 1,2 = 50 tuiles`

Ces 50 "moments de saut" sont calculés une fois pour toutes par
`level/levelSequencer.js` au lancement du niveau. Chaque tuile a donc un
horaire précis et fixe (tuile n°0 à t=0s, tuile n°1 à t=1,2s, tuile n°2
à t=2,4s, etc.).

## Le chemin des tuiles (niveau d'entraînement)

Le "chemin" que la balle doit suivre est écrit avec des lettres dans
`src/level/levelData.js` :

```
FL = tout à gauche   L = un peu à gauche   C = centre
R  = un peu à droite   FR = tout à droite
```

C'est volontairement simple à lire (et à modifier) sans savoir coder :
changer le niveau, c'est changer cette suite de lettres.

## Que se passe-t-il à chaque "saut" (hop) ?

À l'instant précis où une tuile atteint la ligne d'impact, le jeu
compare la position `x` de la balle à la tuile. Il y a trois résultats
possibles, du plus généreux au plus exigeant :

1. **La balle est n'importe où sur la tuile (zone bleue)** → la tuile
   devient verte ("hit"), le score augmente de 1, la balle fait un
   petit "squash" (aplatissement) pour simuler l'impact, une note de
   musique joue. **Toute la tuile compte** : `tile.hitZoneRatio` vaut 1
   dans `gameConfig.js`, donc il n'y a aucune "zone morte" invisible à
   l'intérieur de la tuile où on perdrait sans comprendre pourquoi
   (voir `docs/BUGS.md`, BUG-006 — c'était le cas avant, et c'était une
   mauvaise expérience de jeu).
2. **La balle est dans la petite zone dorée au centre** → en plus du
   point, la tuile devient dorée et rapporte une étoile (voir la
   section suivante). Cette zone est volontairement étroite
   (`tile.perfectZoneRatio`, actuellement 0,25, soit 15px de tolérance
   de chaque côté du centre) : c'est un bonus difficile à obtenir, pas
   une condition de survie.
3. **La balle est complètement en dehors de la tuile** → la tuile
   devient rouge ("missed"), et la partie se termine immédiatement
   (`game:over`).

C'est ce qui rend le timing et la précision importants sans être
injuste : on ne rate que si on atterrit vraiment à côté, comme dans
Tiles Hop.

## Voir où viser le bonus avant d'y être

Chaque tuile pas encore atteinte affiche directement dessus sa petite
zone dorée (la zone "parfaite"), comme une cible à viser pour le bonus
étoile. Le reste de la tuile (en bleu) est déjà sûr par défaut, inutile
de le souligner. Ça permet d'anticiper précisément où placer la balle
pour tenter le bonus, avant que la tuile n'arrive à la ligne d'impact.
Ce dessin est géré par `render/renderer.js` (`_drawPerfectZone`) et
disparaît dès que la tuile est résolue (touchée ou ratée), remplacé par
sa couleur de résultat.

## Les étoiles : récompenser la précision

Toucher une tuile suffit pour marquer un point, mais atterrir **pile au
centre** rapporte en plus une **étoile** ⭐ — la monnaie du jeu, prévue
pour être dépensée plus tard dans une boutique (voir
`docs/FUTURE_INTEGRATIONS.md`).

- Une tuile touchée est dite **"parfaite"** si la balle est à moins de
  `perfectZoneRatio × (largeur de tuile / 2)` du centre de la tuile
  (réglage dans `gameConfig.js`, `tile.perfectZoneRatio`, actuellement
  0,25 — soit une tolérance de 15px autour du centre). Cette valeur a
  varié plusieurs fois en fonction des tests : trop stricte au départ
  (voir `docs/BUGS.md`, BUG-005), puis volontairement resserrée à
  nouveau une fois que la zone de réussite est devenue toute la tuile
  (voir BUG-006) — c'est maintenant elle seule qui porte la difficulté
  du bonus, la survie ne dépend plus de la précision.
- Une tuile parfaite est dessinée en **doré** au lieu de vert, et joue un
  petit carillon distinct du son d'atterrissage normal.
- Les étoiles gagnées existent à deux niveaux :
  - **pendant la partie en cours** (`runStars`, remis à zéro à chaque
    nouvelle tentative, affiché dans le HUD) ;
  - **au total, toutes parties confondues** (`starBalance`, sauvegardé
    sur l'appareil via `src/storage/localStore.js`, jamais remis à
    zéro — même après un échec, les étoiles déjà gagnées sont gardées).
- Les écrans d'échec et de victoire affichent les deux : le nombre
  d'étoiles gagnées pendant cette partie, et le total cumulé.

Contrairement au score (qui redémarre à zéro à chaque nouvelle partie),
les étoiles forment une progression qui **persiste dans le temps** —
c'est ce qui permettra plus tard d'acheter des choses dans le jeu.

## Le rebond visuel de la balle

Indépendamment de la détection de collision, la balle fait un petit
"saut" (mouvement vertical en arc, comme une parabole) à chaque cycle de
1,2 seconde, pour donner une sensation de rythme continu — même avant
la première tuile ou entre deux tuiles. Ce mouvement est **uniquement
visuel** : il ne change jamais la position latérale de la balle, donc il
n'affecte jamais si on touche ou rate une tuile.

## Musique et tuiles : un seul et même rythme

La musique (voir `src/audio/musicGenerator.js`) n'est pas jouée "à
côté" du jeu : elle est **calculée à partir de la même horloge** que les
tuiles.

- Un son de grosse caisse ("kick") joue à chaque battement.
- Une ligne de basse suit une **progression d'accords** (La mineur 7 →
  Fa majeur 7 → Do majeur 7 → Sol 7, puis retour au premier accord),
  qui change toutes les 10 tuiles. C'est elle qui donne une vraie
  structure musicale au morceau plutôt qu'une simple boucle plate.
- Une note de mélodie joue à **chaque tuile**, exactement au moment où
  elle atteint la ligne d'impact. Sa hauteur dépend de la position de
  la tuile (à gauche = note grave, à droite = note aiguë) **parmi les
  notes de l'accord du moment** : la mélodie suit donc à la fois le
  tracé des tuiles ET l'harmonie du morceau.

Résultat : la musique "raconte" le chemin des tuiles, avec une vraie
progression harmonique en fond. Un joueur qui écoute attentivement peut
anticiper les prochains mouvements.

## Conditions de victoire / d'échec

- **Échec (`game:over`)** : la balle n'est pas alignée avec une tuile au
  moment où celle-ci atteint la ligne d'impact. La musique s'arrête, un
  son d'échec joue, l'écran "Raté !" apparaît avec le score et le
  meilleur score.
- **Victoire (`game:complete`)** : toutes les tuiles du niveau ont été
  touchées avec succès. Une petite fanfare joue, l'écran "Bravo, niveau
  terminé !" apparaît.

## Score et meilleur score

Le score correspond simplement au nombre de tuiles touchées avec
succès. Le meilleur score est sauvegardé localement sur l'appareil (voir
`src/storage/localStore.js`) et comparé à chaque fin de partie. Les
étoiles (voir plus haut) suivent une logique différente : c'est un
cumul qui ne redémarre jamais à zéro.

## Sensations à préserver dans les prochaines évolutions

Toute future modification du gameplay doit continuer à respecter :
- une avancée du niveau **toujours automatique**, jamais gérée par le
  joueur ;
- un contrôle **latéral uniquement**, simple et immédiat (pas de délai
  artificiel) ;
- une **précision réelle** requise pour toucher une tuile (pas de
  rattrapage automatique) ;
- un lien **direct et audible** entre la musique et le placement des
  tuiles ;
- un échec **clair et immédiat** dès qu'une tuile est ratée.
