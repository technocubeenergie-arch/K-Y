# Intégrations futures

> Ce document liste tout ce qui est **volontairement temporaire**
> aujourd'hui, et comment le remplacer proprement plus tard, sans avoir
> à réécrire le jeu.

## 1. Remplacer les assets temporaires par de vrais assets

Aujourd'hui, tous les visuels et sons sont **générés par du code** (pas
de fichier image ni audio). C'est un choix assumé pour avancer vite sur
le gameplay. La liste complète est dans
`src/assets/assetManifest.js`, qui sert de point d'entrée unique.

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
| Musique du niveau | `src/audio/audioManager.js` (`playMusic`) | Remplacer l'appel à `MusicGenerator.schedule` par le chargement/lecture d'un fichier audio (`fetch` + `decodeAudioData`, ou une simple balise `<audio>`) |
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
- **Collectibles / skins / bonus** : n'existent pas du tout aujourd'hui.
  Si ajoutés, prévoir un nouveau module `entities/collectible.js` et un
  état dédié dans `engine.js`, sans mélanger cette logique avec celle
  des tuiles.

## 2. Brancher Supabase (authentification + base de données)

**Pas encore fait, volontairement.** Aujourd'hui, seul le meilleur score
est sauvegardé, en local, via `src/storage/localStore.js`
(`window.localStorage`).

### Pourquoi c'est facile à brancher plus tard

`localStore.js` expose exactement 2 méthodes :

```js
getHighScore()        // renvoie un nombre
setHighScore(score)    // enregistre un nombre
```

`main.js` est le seul endroit qui crée une instance de ce module
(`new TH.LocalStore(...)`) et la passe à `engine.js`. Le jour où
Supabase est prêt :

1. Créer un nouveau fichier `src/storage/supabaseStore.js`, avec une
   classe qui respecte **le même contrat** (mêmes noms de méthodes),
   mais qui appelle l'API Supabase au lieu de `localStorage`.
2. Dans `main.js`, remplacer `new TH.LocalStore(...)` par
   `new TH.SupabaseStore(...)`.
3. `engine.js` n'a besoin d'aucune modification : il appelle
   `localStore.getHighScore()` / `setHighScore()` sans savoir ce qu'il y
   a derrière.

### Prérequis techniques à prévoir avant le branchement

- Authentification des joueurs (pour savoir à qui appartient un score) :
  probablement `supabase.auth`, à décider avec le reste de l'équipe/
  utilisateur avant implémentation.
- Une table `scores` (ou équivalent) côté Supabase : `user_id`,
  `level_id`, `score`, `created_at` au minimum.
- Gérer le cas hors-ligne / erreur réseau : `SupabaseStore` devra
  définir un comportement de repli raisonnable (par exemple, retomber
  sur `LocalStore` en cas d'échec réseau) plutôt que de faire planter le
  jeu.
- Ne jamais mettre de clé secrète Supabase dans le code JS exposé au
  navigateur : seules les clés publiques (`anon key`) sont adaptées à ce
  contexte client-only.

### Points de vigilance au moment du branchement final

- Le score actuel (`engine.score`) est un simple entier ; vérifier que
  le schéma Supabase choisi correspond bien à ce type de donnée avant
  de committer un modèle de données définitif.
- Le `localStorage` restera utile même après Supabase, comme solution
  de secours hors-ligne : ne pas le supprimer, seulement l'utiliser en
  complément (voir point "hors-ligne" ci-dessus).
- Ce document doit être mis à jour dès que Supabase est réellement
  branché : cette section passera alors dans `ARCHITECTURE.md` comme
  fonctionnement définitif, et cette entrée sera marquée comme faite ici.
