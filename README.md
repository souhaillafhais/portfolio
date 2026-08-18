# cli-portfolio

Portfolio interactif de **Souhail Lafhais** — élève ingénieur MIAGE à l'EMSI Casablanca
(cybersécurité, cloud, IA). Le contenu se parcourt depuis un shell simulé affiché dans un
écran CRT, ou depuis une vue CV classique.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4. Aucune dépendance runtime hors React.

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

| Script            | Rôle                                          |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Serveur de développement Vite                 |
| `npm run build`   | Vérification TypeScript puis build production |
| `npm run preview` | Sert le contenu de `dist/`                     |
| `npm run lint`    | ESLint sur l'ensemble du dépôt                 |

## Le shell

Le terminal implémente un sous-ensemble de bash sur un système de fichiers virtuel.

**Commandes de contenu** — `whoami`, `skills`, `experience`, `education`, `certifications`,
`interests`, `contact`, `specs`.

**Navigation** — `pwd`, `cd` (avec `cd -` et `OLDPWD`), `ls`, `cat` (accepte plusieurs
fichiers, stdout et stderr séparés), `clear`, `help`.

**Thèmes** — `theme list` puis `theme <id>` parmi 15 palettes (`kali`, `dracula`, `nord`,
`gruvbox`, `tokyo-night`, `catppuccin`, `paper`…). Le choix persiste dans `localStorage`.

Le tokenizer gère les guillemets simples et doubles, `Tab` complète commandes et chemins
via plus long préfixe commun, `↑`/`↓` parcourent l'historique — pré-rempli avec toutes les
commandes disponibles pour servir de découverte.

Quelques commandes Unix courantes (`sudo`, `nmap`, `ping`, `rm`…) renvoient une réponse
clin d'œil : rien n'est réellement exécuté.

## Organisation

```
src/
  fs/virtualFileSystem.ts   Arborescence virtuelle + résolution de chemins
  utils/parseCommandLine.ts Tokenizer type shell (guillemets, échappements)
  utils/commandHandler.ts   Dispatch des commandes et rendu des sorties
  utils/tabCompletion.ts    Complétion Tab
  content/portfolioCopy.ts  Texte des fichiers virtuels
  data/certifications.ts    Source unique des certifications
  theme/                    15 palettes, provider et contexte
  components/               Terminal, écran CRT, vue CV, portail de connexion
```

`data/certifications.ts` alimente à la fois les cartes du CV et le texte de la commande
`certifications` : ajouter une certification ne se fait qu'à cet endroit.

Les aperçus de certifications sont servis depuis `public/assets/certifications/`.

## Accessibilité

`prefers-reduced-motion` est respecté dans tous les composants animés (frappe, allumage
CRT, fond de code, transition du portrait). Les sorties de commandes sont annoncées dans
une région live, et la modale de certification gère `Échap`, le focus à l'ouverture et sa
restauration à la fermeture.

## Connexion

L'écran d'accueil pose une question de culture générale tirée au sort. C'est un décor, pas
un mécanisme de sécurité : tout le contenu du portfolio est public et présent dans le
bundle.
