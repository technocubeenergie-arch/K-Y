# Le jeu de Ylonna

Un jeu inspiré de **Tiles Hop** : le niveau avance tout seul, la balle
rebondit en rythme, et le joueur la dirige vers la gauche ou la droite
pour qu'elle atterrisse sur les tuiles au bon moment.

C'est un projet fait à deux : une débutante en programmation et un
assistant IA, pour apprendre en construisant un vrai jeu, étape par étape.

## Comment jouer

Aucune installation n'est nécessaire.

1. Ouvre `index.html` dans un navigateur (Chrome, Firefox, Edge...).
   - Le plus simple : lance un petit serveur local, par exemple
     `python3 -m http.server 8080` depuis ce dossier, puis ouvre
     `http://localhost:8080`. (Certains navigateurs bloquent le son ou
     certaines fonctions quand on ouvre le fichier directement en
     double-cliquant.)
2. Clique sur **Jouer**.
3. Fais glisser ton doigt (ou la souris, en maintenant le clic) pour
   déplacer la balle. Les flèches `←` `→` du clavier fonctionnent aussi.
4. Atterris sur les tuiles en rythme avec la musique. Rater une tuile
   termine la partie.

## Ce qu'il y a dans ce dépôt

- `index.html` — la page du jeu (structure uniquement, pas de logique).
- `css/style.css` — l'habillage visuel.
- `src/` — tout le code du jeu, découpé en petits fichiers (voir
  [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) pour le détail de
  chacun).
- `docs/` — la documentation du projet, à jour en permanence :
  - [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — comment le code est organisé.
  - [`GAMEPLAY.md`](docs/GAMEPLAY.md) — comment le jeu fonctionne (règles, rythme).
  - [`BUGS.md`](docs/BUGS.md) — le journal des problèmes rencontrés et corrigés.
  - [`FUTURE_INTEGRATIONS.md`](docs/FUTURE_INTEGRATIONS.md) — ce qui reste à
    brancher plus tard (vrais dessins/sons, Supabase).
  - [`HANDOFF.md`](docs/HANDOFF.md) — pour reprendre le projet rapidement.

## État actuel du projet

Un seul niveau d'entraînement, jouable du début à la fin, avec une
musique rythmée temporaire générée par le code (~1 minute). Tous les
visuels et sons sont des formes/sons simples, temporaires et
remplaçables (voir `docs/FUTURE_INTEGRATIONS.md`).
