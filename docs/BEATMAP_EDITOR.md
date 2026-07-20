# Éditeur de rythme (beatmap) — outil séparé du jeu

> Ce document décrit `tools/beatmap-editor/`, un outil **complètement
> indépendant** du jeu (`index.html` à la racine). Il ne partage aucun
> fichier avec `src/` : c'est un projet à part, dans son propre dossier,
> qui sert à préparer à la main des horaires de tuiles/tapis glissants
> pour de futures musiques.

## Pourquoi cet outil existe

Aujourd'hui, le jeu détecte automatiquement le rythme d'une musique
(`src/audio/beatDetector.js`, voir `docs/GAMEPLAY.md`). Cette détection
automatique n'est pas parfaite : elle peut manquer un vrai coup, ou au
contraire réagir à un passage qui n'est pas vraiment rythmique (voir
`docs/BUGS.md` pour l'historique des corrections successives).

Cet éditeur permet de contourner ce problème pour une musique donnée :
au lieu de laisser un algorithme deviner, **on écoute la musique et on
tape soi-même**, à l'oreille, où doivent être les tuiles et les tapis
glissants. Comme un humain ne tape jamais deux fois exactement au même
instant, l'outil permet de refaire plusieurs essais ("prises") et de
les combiner pour obtenir un résultat plus stable qu'une seule prise.

**Important : cet outil ne modifie pas le jeu.** Il ne fait que
produire un fichier `.json`. Rien, pour l'instant, ne relie
automatiquement ce fichier au jeu (voir "Suite possible" en bas de ce
document).

## Comment l'utiliser

Ouvrir `tools/beatmap-editor/index.html` directement dans un navigateur
(double-clic, comme pour le jeu — pas besoin de serveur).

1. **Choisir une musique** : n'importe quel fichier audio du
   navigateur (mp3, ogg, wav...).
2. **Écouter et enregistrer** : appuyer sur "Lancer", puis taper sur le
   gros bouton jaune (ou la barre ESPACE) en rythme avec la musique :
   - un appui **court** (relâché vite) enregistre une **tuile** (un
     seul instant) ;
   - un appui **long** (maintenu) enregistre un **tapis glissant**, du
     moment où on appuie jusqu'au moment où on relâche.
   - La liste "Prise en cours" affiche en direct ce qui vient d'être
     enregistré.
3. **Valider cette prise et recommencer** : cette prise est ajoutée à
   la liste des prises, la lecture revient au début, prête pour un
   nouvel essai. **Recommencer 4 ou 5 fois** donne un bien meilleur
   résultat qu'une seule prise (voir "Comment marche la fusion"
   ci-dessous).
4. **Fusionner les prises** : une fois plusieurs prises enregistrées,
   le bouton "Fusionner maintenant" combine tout en un résultat unique.
   Deux réglages de tolérance sont ajustables (en millisecondes) si le
   résultat semble trop regroupé ou pas assez.
5. **Exporter** : télécharge un fichier `.json` avec les prises brutes
   ET le résultat fusionné (voir format ci-dessous).

Un événement peut être retiré à tout moment (bouton "Retirer" à côté de
chaque ligne, dans la prise en cours comme dans le résultat fusionné) —
aucune prise n'est définitive tant qu'elle n'est pas exportée.

## Comment marche la fusion

Le geste humain n'est jamais parfaitement identique d'une prise à
l'autre : sur la même musique, un même coup peut être tapé à 1.02s lors
d'une prise, 1.06s lors d'une autre, 0.98s lors d'une troisième. Ce
sont clairement le MÊME coup de musique, juste avec la petite variation
naturelle d'un geste répété.

- **Tuiles** : tous les instants tapés, toutes prises confondues, sont
  triés puis regroupés dès qu'ils tombent à moins de "tolérance tuiles"
  les uns des autres. Chaque groupe devient UNE tuile, à l'instant
  moyen du groupe.
- **Tapis glissants** : même principe, mais sur des segments (début +
  fin) : deux tapis sont regroupés s'ils se chevauchent, ou si l'écart
  entre eux reste sous "tolérance tapis". Le tapis fusionné prend le
  début moyen et la fin moyenne du groupe.
- **Confiance** : chaque tuile/tapis fusionné affiche une confiance
  (par exemple "3/4 prises") — combien de prises, sur le total,
  contenaient un événement dans ce groupe. Une confiance basse (tapée
  une seule fois sur 5 essais) signale probablement une erreur de
  frappe plutôt qu'un vrai coup — à vérifier et retirer si besoin.

## Format exporté

```json
{
  "song": "nom-du-fichier.mp3",
  "takes": [
    { "tiles": [1.02, 1.88, 2.41], "longPlates": [{ "start": 3.10, "end": 4.22 }] },
    { "tiles": [1.05, 1.90, 2.39], "longPlates": [{ "start": 3.15, "end": 4.18 }] }
  ],
  "merged": {
    "tiles": [
      { "time": 1.035, "confidence": 1 },
      { "time": 1.89, "confidence": 1 },
      { "time": 2.4, "confidence": 1 }
    ],
    "longPlates": [{ "start": 3.125, "end": 4.2, "confidence": 1 }]
  }
}
```

- `takes` garde les prises brutes (utile pour refaire une fusion plus
  tard avec une tolérance différente, sans tout retaper).
- `merged` est le résultat prêt à l'emploi.

## Suite possible (pas faite maintenant)

Pour qu'un fichier exporté ici remplace un jour la détection
automatique dans le jeu, il faudrait (volontairement hors du périmètre
de cet outil, qui ne doit rien changer au jeu) :
- charger ce `.json` dans `main.js` à la place de
  `BeatDetector.detectOnsets(...)` — `merged.tiles.map(t => t.time)`
  donne directement le tableau `beatTimes` attendu par
  `level/levelSequencer.js`, `buildSequence` ;
- transmettre `merged.longPlates` comme plateformes de liaison
  EXPLICITES, plutôt que de les laisser déduites automatiquement des
  écarts (voir `level/levelSequencer.js`, `buildBridges`, qui devrait
  alors accepter une liste de plateformes déjà connues en plus/à la
  place de sa détection par écart.
