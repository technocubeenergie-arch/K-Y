# Mécaniques du jeu

> Ce document décrit le fonctionnement du niveau tel qu'il existe
> aujourd'hui dans le code. À garder synchronisé avec
> `src/config/gameConfig.js`, `src/core/engine.js`,
> `src/level/levelData.js` et `src/audio/beatDetector.js`.

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

Le déplacement latéral est libre, mais borné : la balle ne peut pas
aller plus loin, sur le côté, que l'endroit où une tuile peut
réellement exister (`entities/ball.js`, mêmes bornes que
`tile.getCenterX` dans `entities/tile.js` — voir `docs/BUGS.md`,
BUG-010). Impossible, donc, d'envoyer la balle dans une zone où aucune
tuile n'apparaît jamais.

## Le rythme structure tout : la musique décide, les tuiles suivent

Contrairement à beaucoup de jeux du genre, il n'y a **pas de tempo
choisi à l'avance**. Le niveau est entièrement construit à partir du
rythme réel de la musique du jeu (actuellement
`src/assets/phuthona.ogg`, un extrait tiré du vrai jeu Tiles Hop, utilisé
pour comparer le rendu de la génération de tuiles à une référence
connue — voir `src/assets/assetManifest.js` pour savoir quel fichier
est actif) :

1. Au clic sur "Jouer", le fichier est décodé, puis analysé par
   `audio/beatDetector.js`. Technique utilisée, en deux temps :
   - découpage en petites tranches de temps, mesure du volume de
     chaque tranche, puis de combien ce volume AUGMENTE d'une tranche
     à l'autre (le "flux") ;
   - repérage du **pouls régulier** du morceau par autocorrélation (on
     compare le flux à lui-même décalé de différentes durées, et on
     garde la durée qui le fait le plus se ressembler à lui-même — la
     définition même d'un rythme périodique), puis placement d'une
     tuile à CHAQUE position de cette grille régulière, en choisissant
     le plus gros sursaut d'énergie tout autour de chaque position
     (voir les commentaires du fichier pour le détail).
2. Chaque position de la grille rythmique ainsi confirmée devient
   l'horaire d'une tuile (`level/levelSequencer.buildSequence`). Une
   position sans sursaut d'énergie suffisant reste vide (silence, vraie
   pause dans le morceau) — sinon, la quasi-totalité des temps du
   morceau obtient sa tuile.
3. Le fichier se joue normalement pendant que le niveau généré défile,
   synchronisé sur la même horloge (voir `docs/ARCHITECTURE.md`).

Réglages disponibles dans `gameConfig.js` (`beatDetection`) :
`minIntervalSeconds`/`maxIntervalSeconds` (plage de tempo recherchée —
`minIntervalSeconds` sert aussi de temps de réaction minimum entre deux
tuiles), `sensitivity` (à quel point un sursaut doit être marqué pour
confirmer une tuile à une position de la grille), `toleranceRatio`
(marge de recherche autour de chaque position, pour un morceau pas joué
à la mécanique près), `maxTiles` (longueur maximum du niveau généré,
même pour un long morceau).

**Pourquoi une grille plutôt que des pics détectés librement ?** Une
première version cherchait les sursauts d'énergie n'importe où dans le
morceau. Problème observé en testant avec `audioniveau6.ogg` : un coup
plus discret pouvait être raté, laissant un "trou" — la balle sautait
alors vers la tuile suivante pendant qu'une note s'entendait pourtant
au milieu du saut. Verrouiller d'abord le pouls régulier du morceau,
puis chercher un coup à CHAQUE position de ce pouls (voir
`docs/BUGS.md`, entrée sur la synchronisation notes/tuiles), garantit
que la balle atterrit en rythme à chaque fois, sauf vraie pause
musicale.

**Limites connues** (voir `docs/FUTURE_INTEGRATIONS.md` pour la
suite) :
- la détection suppose un **tempo stable** sur tout le morceau (une
  seule grille pour toute sa durée) : un morceau qui change de tempo en
  cours de route serait mal suivi dans sa seconde partie ;
- c'est une version simple (un seul "canal" d'analyse) : une musique
  sans attaques nettes (très douce, très continue) donnerait un pouls
  mal défini, et donc peu ou pas de tuiles ;
- la position latérale des tuiles (quelle lettre FL/L/C/R/FR) vient
  toujours du tracé de `level/levelData.js` : l'analyse audio ne donne
  que le RYTHME, pas où placer la balle ;
- la musique est pour l'instant un seul fichier fixe
  (`phuthona.ogg`), pas encore un fichier choisi par le joueur ;
- la durée du niveau suit celle de la musique embarquée (`maxTiles`
  sert seulement de garde-fou pour un morceau bien plus long) :
  actuellement `phuthona.ogg` dure 1min32, et le niveau généré couvre
  tout le morceau, du premier au dernier coup détecté ;
- il n'existe pas encore de bouton "retour à l'écran de démarrage" :
  pour changer de musique, il faut remplacer le fichier dans le code
  (voir `docs/FUTURE_INTEGRATIONS.md`).
- L'analyse (décodage + détection) ne se fait qu'une fois par
  chargement de page : les parties suivantes ("Réessayer", "Rejouer")
  réutilisent le résultat déjà calculé, pour rejouer instantanément.

## Le chemin latéral des tuiles

Le "chemin" que la balle doit suivre (gauche/droite, pas le rythme) est
écrit avec des lettres dans `src/level/levelData.js` :

```
FL = tout à gauche   L = un peu à gauche   C = centre
R  = un peu à droite   FR = tout à droite
```

C'est volontairement simple à lire (et à modifier) sans savoir coder :
changer le niveau, c'est changer cette suite de lettres.

## Les fausses tuiles : brouiller la lecture du chemin

DE TEMPS EN TEMPS (pas à chaque horaire, sinon ce serait trop chargé à
lire), en plus de la VRAIE tuile (colorée normalement), le jeu affiche
aussi des **fausses tuiles** : des tuiles grises, sans couleur,
regroupées sur UN SEUL bord (gauche ou droite, jamais les deux à la
fois) au même moment — pas étalées sur toute la largeur. Elles ne
servent qu'à rendre le chemin moins évident à lire d'un coup d'œil — un
peu comme dans le vrai Tiles Hop.

Ces fausses tuiles n'ont **aucune existence dans les règles du jeu** :
`core/engine.js` ne les connaît même pas. Rater en atterrissant sur
l'une d'elles revient exactement à rater en atterrissant dans le vide
(la balle n'est simplement pas alignée avec la vraie tuile) — le moteur
n'a pas eu besoin d'un seul changement pour ça (voir `docs/BUGS.md`).
Elles sont générées par `level/levelSequencer.js` (fonction
`buildDecoys`) et attachées à la vraie tuile (`tile.decoys`), puis
dessinées par `render/renderer.js`, sans zone bonus ni changement de
couleur possible.

Quelles tuiles reçoivent des fausses tuiles, et de quel bord ? Décidé
par un "hash" (voir `pseudoRandom01` dans `levelSequencer.js`) plutôt
que par un vrai tirage au sort (`Math.random()`) : ça donne un résultat
qui semble irrégulier au joueur, tout en générant **toujours exactement
le même niveau** pour un même morceau — important pour que
"Réessayer"/"Rejouer" retombent sur le même défi, et pour pouvoir
tester le jeu de façon fiable. Un tirage 50/50, même bien réparti, peut
par pur hasard aligner plusieurs fois le même bord d'affilée (repéré en
jeu jusqu'à 8 fois de suite) : un changement de côté est donc forcé
au-delà de `tile.decoyMaxSameSideStreak` occurrences consécutives, pour
que les deux bords soient bien utilisés au fil d'une partie.

Un bord n'est choisi que s'il ne contient PAS la position de la vraie
tuile : sinon, une seule fausse tuile resterait (l'autre étant filtrée
pour ne pas doubler la vraie), collée contre elle et dépassant
légèrement d'un côté — un petit bout de tuile qui semble ne rien faire
là, repéré par Ylonna en jeu. Quand la vraie tuile est déjà sur une
position d'un bord, ce bord est donc écarté au profit de l'autre
(toujours entièrement libre, sauf configuration extrême de
`decoyCount`).

Réglages dans `gameConfig.js` (`tile.decoyCount`, `tile.decoyFrequency`,
`tile.decoyMaxSameSideStreak`, `tile.decoyColor`,
`tile.decoyMinVisibleScale`) : `decoyCount` contrôle combien de
positions, comptées depuis le bord choisi (2 par défaut : les deux plus
proches de ce bord), reçoivent une fausse tuile QUAND il y en a,
`decoyFrequency` contrôle À QUELLE FRÉQUENCE ça arrive
(0 = jamais,
1 = à chaque tuile ; actuellement 0,3, soit environ 3 tuiles sur 10).

Les fausses tuiles disparaissent aussi **plus tôt** que les vraies
quand elles s'éloignent (`tile.decoyMinVisibleScale`, plus haut que
`config.perspective.minVisibleScale` qui régit les vraies tuiles) :
elles ne servent qu'à brouiller la lecture juste avant l'atterrissage,
pas à décorer tout l'horizon. Les vraies tuiles, elles, doivent bien
rester visibles loin dans le niveau — c'est tout l'intérêt de la vue
en perspective (voir `docs/ARCHITECTURE.md`).

**Prévu pour plus tard** (voir `docs/FUTURE_INTEGRATIONS.md`) : un
objet de boutique (une "balle volante") qui permettrait de sauter
par-dessus une fausse tuile, ou le vide, sans perdre. Le moteur garde
donc un seul point de décision pour l'échec (`core/engine.js`,
`_processHop`), pour qu'un futur état "vole" sur la balle puisse
facilement désactiver cet échec sans toucher au reste des règles.

## Les plaques glissantes : la balle roule toute seule

Certaines tuiles, en plus d'être une tuile normale, sont des **plaques
glissantes** : une fois touchées, la balle se met à **rouler toute
seule** vers la gauche ou vers la droite (selon la plaque), jusqu'à la
tuile suivante. Le joueur garde le contrôle (souris/doigt/clavier
fonctionnent normalement), mais doit maintenant compenser ce roulement
en plus de viser la prochaine tuile — sinon la balle continue de
dériver et peut finir hors de la tuile suivante.

Visuellement, une plaque glissante reste **toujours à plat** (jamais
inclinée à l'écran) : elle se reconnaît uniquement à sa couleur
distincte (`tile.slipperyColor`) et à une petite flèche blanche
indiquant le sens du roulement, affichée tant qu'elle n'est pas encore
atteinte (même principe que la zone bonus, voir plus bas). Une fois
touchée, elle redevient verte (ou dorée si parfaite) comme n'importe
quelle tuile réussie.

Le roulement s'arrête net dès que la balle touche une tuile **normale**
(pas de plaque glissante) : `core/engine.js` (`_processHop`) appelle
`ball.startSliding(tile.slideDirection, config.ball.slideSpeed)` à
CHAQUE tuile touchée, glissante ou non — `slideDirection` vaut alors
`'left'`, `'right'` ou `null`, et `null` coupe immédiatement tout
roulement en cours. Si deux plaques glissantes se suivent, la seconde
remplace simplement le roulement de la première (nouvelle vitesse,
nouveau sens).

Techniquement, `entities/ball.js` distingue toujours deux choses : la
position voulue par le joueur (`targetX`, mise à jour par
`core/input.js`) et le roulement (`slideVelocity`, ajouté À `targetX`
à chaque image tant qu'il n'est pas nul) — la balle continue donc de
dériver même si le joueur ne touche à rien, exactement comme sur de la
glace.

Quelles tuiles sont des plaques glissantes ? Décrit dans
`level/levelData.js` (`SLIPPERY_PATTERN`), indépendamment du tracé
latéral (`PATTERN`) : une simple liste "quel indice du motif, quel
sens", facile à modifier sans savoir coder.

Réglages dans `gameConfig.js` : `ball.slideSpeed` (vitesse du roulement
en px/seconde — plus haut, plus dur à rattraper) et
`tile.slipperyColor` (sa couleur, tant qu'elle n'est pas atteinte).

Compatible avec les principes du jeu (voir "Sensations à préserver"
plus bas) : le contrôle reste immédiat et précis dès que le joueur
agit, rien n'est fait à sa place — la plaque glissante ajoute une
difficulté environnementale, pas un raccourci.

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
"saut" (mouvement vertical en arc, comme une parabole) entre chaque
tuile, pour donner une sensation de rythme continu — même avant la
première tuile ou entre deux tuiles. Comme l'écart entre deux tuiles
n'est pas toujours le même (il suit le rythme réel de la musique), la
durée de ce saut s'adapte à chaque fois à l'écart réel entre la
dernière tuile passée et la prochaine (voir `core/engine.js`,
`getBouncePhase`). Ce mouvement est **uniquement visuel** : il ne
change jamais la position latérale de la balle, donc il n'affecte
jamais si on touche ou rate une tuile.

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
