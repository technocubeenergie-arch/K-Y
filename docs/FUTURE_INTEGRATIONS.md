# Intégrations futures

> Ce document liste tout ce qui est **volontairement temporaire**
> aujourd'hui, et comment le remplacer proprement plus tard, sans avoir
> à réécrire le jeu.

## 1. Remplacer les assets temporaires par de vrais assets

Les visuels sont **générés par du code** (pas de fichier image). C'est
un choix assumé pour avancer vite sur le gameplay. La musique, elle,
est déjà un vrai fichier (voir section 2), mais fixe et non choisi par
le joueur. La liste complète est dans `src/assets/assetManifest.js`,
qui sert de point d'entrée unique.

### Marche à suivre pour un remplacement

1. Déposer le nouveau fichier dans un dossier `assets/` à créer
   (`assets/images/...`, `assets/audio/...`) — ce dossier n'existe pas
   encore, il est prévu par `assetManifest.js` (champ `futurePath`).
2. Dans `assetManifest.js`, changer l'entrée concernée :
   `status: 'procedural'` → `status: 'file'`, et renseigner le chemin.
3. Modifier **uniquement** le module responsable de cet asset pour
   qu'il charge le fichier au lieu de le générer :

| Asset | Fichier à modifier | Ce qu'il faut faire |
|---|---|---|
| Sons (land/fail/complete) | `src/audio/audioManager.js` | Remplacer `_playBlip(...)` par la lecture du fichier correspondant |
| Balle | `src/render/renderer.js` (`_drawBall`) | Remplacer `ctx.arc(...)` par `ctx.drawImage(image, ...)` |
| Tuiles | `src/render/renderer.js` (`_drawTiles`) | Remplacer `ctx.roundRect(...)` par `ctx.drawImage(...)` |
| Fond | `src/render/renderer.js` (`_drawBackground`) | Remplacer le dégradé par une image |

Aucun autre module (moteur, niveau, score...) n'a besoin d'être touché :
c'est tout l'intérêt d'avoir isolé le rendu et l'audio du reste.

### Assets prévus mais pas encore branchés

Ces éléments sont anticipés dans l'architecture (structure prête) mais
n'ont pas encore de logique associée :

- **Variantes visuelles de tuiles** (plusieurs styles selon le niveau) :
  prévoir un champ `tile.variant` sur l'objet `Tile` (`entities/tile.js`)
  le jour venu.
- **Effets de particules / lumière** à l'impact : un bon endroit serait
  un nouveau fichier `render/particles.js`, déclenché depuis
  `renderer.js` en écoutant l'état `tile.state === 'hit'`.
- **Écran de démarrage illustré, HUD stylisé** : uniquement du CSS/HTML à
  enrichir dans `index.html` / `css/style.css`, aucun changement JS
  nécessaire.
- **Collectibles / skins / bonus** : n'existent pas encore, mais la
  **monnaie pour les acheter existe déjà** (les étoiles, voir
  `docs/GAMEPLAY.md`). Voir section 3 ci-dessous pour la suite.

## 2. Laisser le joueur choisir sa propre musique

**Partiellement fait.** Le niveau est déjà entièrement généré à partir
du rythme réel de la musique du jeu (`audio/beatDetector.js` +
`level/levelSequencer.buildSequence`, voir `docs/ARCHITECTURE.md` et
`docs/GAMEPLAY.md`) — ce n'est plus un test, c'est le fonctionnement
normal du jeu. Ce qui reste temporaire : la musique est un **seul
fichier fixe**, choisi par nous (actuellement `src/assets/phuthona.ogg`,
embarqué en base64 dans `src/assets/levelTrackData.js` — voir
`src/assets/assetManifest.js` pour le fichier actif), pas encore un
fichier choisi par le joueur.

### Ce qu'il reste à faire pour que ce soit une vraie fonctionnalité

- **Laisser le joueur choisir son fichier** : un `<input type="file"
  accept="audio/*">` sur l'écran de démarrage. Un `File` choisi par
  l'utilisateur se lit directement avec `file.arrayBuffer()` (aucun
  `fetch()` nécessaire, donc ça marche aussi bien avec ou sans
  serveur) — ce résultat se passe tel quel à
  `audioManager.decodeArrayBuffer()`, qui existe déjà.
- **Retirer le fichier fixe embarqué** (`levelTrackData.js`, et le
  fichier `.ogg` source qu'il contient) une fois qu'un vrai mécanisme
  de sélection existe : il n'a été embarqué que pour que le jeu
  fonctionne sans configuration, en attendant ce sélecteur.
- **Un vrai retour à l'écran de démarrage** : aujourd'hui, il n'existe
  pas de bouton "Menu" pour changer de musique sans recharger la page
  (voir `docs/GAMEPLAY.md`, limites connues).
- **Améliorer la détection de rythme** si nécessaire : `beatDetector.js`
  utilise une méthode simple (un seul canal d'analyse d'énergie). Pour
  des musiques plus subtiles (peu de percussions marquées), une
  analyse multi-bandes (grave/médium/aigu séparés) donnerait de
  meilleurs résultats — mais ajoute de la complexité, à ne faire que si
  le besoin se confirme.
- **Décider où va la position latérale** : aujourd'hui, le tracé
  (FL/L/C/R/FR) vient toujours de `level/levelData.js` quel que soit le
  fichier choisi. Une vraie fonctionnalité pourrait vouloir un tracé
  différent selon la musique (aléatoire, ou dérivé d'une autre analyse
  du son, comme sa hauteur/fréquence dominante).

### Points de vigilance

- Ne jamais faire dépendre `core/engine.js` de la façon dont un niveau
  a été construit : c'est tout l'intérêt de `tile.expectedTime` et de
  `config.scroll.speed` (voir `docs/ARCHITECTURE.md`) — ce module ne
  doit jamais avoir besoin de savoir d'où vient le rythme.
- Le décodage + l'analyse d'un long fichier peuvent prendre plusieurs
  secondes : garder un message de chargement clair (déjà en place,
  `#start-status`), et prévoir un moyen d'annuler si ça devient gênant
  pour de très gros fichiers.
- Le résultat de l'analyse est mis en cache dans `main.js` pour que
  "Réessayer"/"Rejouer" soient instantanés : si le joueur peut changer
  de musique en cours de route, penser à vider ce cache au bon moment.

## 3. Construire la boutique (dépenser les étoiles)

**Pas encore fait, volontairement.** Le joueur gagne des étoiles
(atterrissage parfait sur une tuile), et elles sont sauvegardées de
façon persistante via `src/storage/localStore.js`
(`getStarBalance()` / `addStars(amount)`). Il n'existe **pas encore**
d'endroit où les dépenser.

### Ce qu'il faudra construire

- **Un catalogue d'objets achetables** : nouveau fichier de données,
  par exemple `src/shop/shopData.js` (même esprit que
  `level/levelData.js` : une liste simple, facile à modifier). Chaque
  objet aura au minimum un identifiant, un nom, un prix en étoiles.
- **Un état "possédé" par objet** : à sauvegarder aussi via
  `localStore.js` (nouvelle méthode à ajouter, par exemple
  `getOwnedItems()` / `setOwnedItems(ids)`), avec la même logique que
  `getStarBalance()`.
- **Un écran boutique** : un nouveau fichier `src/ui/shopScreen.js`
  (même famille que `ui/screens.js`), accessible depuis l'écran de
  démarrage (par exemple un bouton "Boutique"). Il affichera le
  catalogue, le solde d'étoiles (`localStore.getStarBalance()`), et
  gérera le clic "Acheter" (vérifier le solde, débiter, marquer
  l'objet comme possédé).
- **Appliquer l'objet acheté** : dépend de ce qu'on vend en premier.
  Le plus simple pour commencer serait une **couleur de balle** ou une
  **couleur de tuile parfaite** différente (juste une valeur à lire
  dans `config.ball.color` / `config.tile.perfectColor` au lieu de la
  valeur fixe actuelle).
- **Idée retenue pour un futur objet (pas encore construit)** : une
  "balle volante" (une mini-balle à ailes) qui permettrait au joueur de
  sauter par-dessus le vide, y compris une fausse tuile (voir
  `docs/GAMEPLAY.md`, section sur les fausses tuiles), sans perdre.
  Techniquement : un état temporaire sur `ball` (par exemple
  `ball.isFlying`), lu par `core/engine.js` dans `_processHop` pour
  ignorer l'échec normal quand la balle n'est pas alignée avec la vraie
  tuile. Le point de décision est déjà unique et isolé dans le code
  actuel (une seule condition `isAligned` dans `_processHop`), pour que
  cet ajout reste simple le jour venu.

### Points de vigilance

- Ne pas mélanger la logique de la boutique avec `engine.js` : le
  moteur de jeu n'a pas besoin de savoir ce que le joueur a acheté,
  seulement lire la config (ou un état simple posé sur `ball`) qui en
  résulte (couleur, skin, vol...).
- Garder la même règle que pour les étoiles : l'inventaire "objets
  possédés" doit être écrit dès maintenant pour être **facile à
  migrer vers Supabase** plus tard (voir section 4), donc passer par
  `localStore.js`, jamais par un accès direct à `localStorage` ailleurs
  dans le code.

## 4. Brancher Supabase (authentification + base de données)

**Pas encore fait, volontairement.** Aujourd'hui, le meilleur score et
le solde d'étoiles sont sauvegardés, en local, via
`src/storage/localStore.js` (`window.localStorage`).

### Pourquoi c'est facile à brancher plus tard

`localStore.js` expose ces méthodes :

```js
getHighScore()          // renvoie un nombre
setHighScore(score)      // enregistre un nombre
getStarBalance()          // renvoie le total d'étoiles du joueur
addStars(amount)           // ajoute des étoiles au total, renvoie le nouveau total
```

(Si la boutique de la section 3 est construite avant Supabase, elle
ajoutera probablement `getOwnedItems()` / `setOwnedItems(ids)` ici
aussi, en suivant le même principe.)

`main.js` est le seul endroit qui crée une instance de ce module
(`new TH.LocalStore(...)`) et la passe à `engine.js`. Le jour où
Supabase est prêt :

1. Créer un nouveau fichier `src/storage/supabaseStore.js`, avec une
   classe qui respecte **le même contrat** (mêmes noms de méthodes),
   mais qui appelle l'API Supabase au lieu de `localStorage`.
2. Dans `main.js`, remplacer `new TH.LocalStore(...)` par
   `new TH.SupabaseStore(...)`.
3. `engine.js` n'a besoin d'aucune modification : il appelle
   `localStore.getHighScore()` / `setHighScore()` / `getStarBalance()` /
   `addStars()` sans savoir ce qu'il y a derrière.

### Prérequis techniques à prévoir avant le branchement

- Authentification des joueurs (pour savoir à qui appartiennent un
  score et des étoiles) : probablement `supabase.auth`, à décider avec
  le reste de l'équipe/utilisateur avant implémentation.
- Une table `scores` (ou équivalent) côté Supabase : `user_id`,
  `level_id`, `score`, `created_at` au minimum.
- Une table (ou colonne) pour le solde d'étoiles, et potentiellement
  une table `owned_items` si la boutique (section 3) existe déjà à ce
  moment-là.
- Gérer le cas hors-ligne / erreur réseau : `SupabaseStore` devra
  définir un comportement de repli raisonnable (par exemple, retomber
  sur `LocalStore` en cas d'échec réseau) plutôt que de faire planter le
  jeu.
- Ne jamais mettre de clé secrète Supabase dans le code JS exposé au
  navigateur : seules les clés publiques (`anon key`) sont adaptées à ce
  contexte client-only.

### Points de vigilance au moment du branchement final

- Le score (`engine.score`) et les étoiles (`engine.runStars` /
  `localStore.getStarBalance()`) sont de simples entiers ; vérifier que
  le schéma Supabase choisi correspond bien à ce type de donnée avant
  de committer un modèle de données définitif.
- Le `localStorage` restera utile même après Supabase, comme solution
  de secours hors-ligne : ne pas le supprimer, seulement l'utiliser en
  complément (voir point "hors-ligne" ci-dessus).
- Ce document doit être mis à jour dès que Supabase est réellement
  branché : cette section passera alors dans `ARCHITECTURE.md` comme
  fonctionnement définitif, et cette entrée sera marquée comme faite ici.
