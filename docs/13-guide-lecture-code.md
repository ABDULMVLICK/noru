# NORU — Guide pour comprendre tout le code

**Comment relire et maîtriser ton propre projet avant la soutenance**

> Objectif : pouvoir expliquer, devant le jury, ce que fait chaque partie du code et pourquoi. Suis cet ordre de lecture — du plus simple au plus complexe. Compte **2 à 3 sessions de 2 heures**.

---

## Le principe à retenir avant tout

L'application est **découplée** en deux projets :

- **`backend/`** = le cerveau (NestJS). Il reçoit des requêtes, applique les règles métier, parle aux bases de données. Il expose une **API REST** sous `/api`.
- **`frontend/`** = la vitrine (React). Il affiche les pages et appelle l'API du backend.

Ils communiquent uniquement par des **appels HTTP** (le front demande, le back répond en JSON).

Le backend suit toujours le même trajet pour chaque fonctionnalité :

```
Requête HTTP  →  Controller  →  Service  →  Prisma  →  Base de données
  (la route)     (l'aiguillage)  (la logique)  (l'ORM)    (MySQL)
```

**Le Controller** dit *quelle URL* fait *quoi*. **Le Service** contient *la vraie logique* (calculs, vérifications). Retiens ces deux mots : 90 % du backend, c'est ça.

---

## Étape 1 — La base de données (le socle)

📄 **`backend/prisma/schema.prisma`**

Commence ici. C'est la définition de tes 3 tables : `Utilisateur`, `Beneficiaire`, `Transfert`. Tu y vois les champs, les types, et les **relations** (un utilisateur a plusieurs bénéficiaires et transferts).

**Ce que tu dois savoir en sortir :** citer les 3 tables, leurs champs principaux, et les relations entre elles. C'est la traduction de ton MCD.

---

## Étape 2 — Le point d'entrée du backend

📄 **`backend/src/main.ts`** — c'est la première ligne exécutée. Tu y vois : le préfixe `/api`, l'activation du CORS (pour autoriser le front), et la `ValidationPipe` globale (qui valide toutes les entrées).

📄 **`backend/src/app.module.ts`** — le « sommaire » du backend : il liste tous les modules (auth, bénéficiaires, transferts, admin, notifications). C'est la carte de ton application.

**En sortir :** « L'appli démarre dans main.ts, qui branche tous les modules listés dans app.module.ts. »

---

## Étape 3 — Un module complet, de bout en bout : l'authentification

C'est le module le plus important. Lis ses fichiers **dans cet ordre** :

1. 📄 **`auth/dto/register.dto.ts`** et **`login.dto.ts`** — un **DTO** décrit la forme des données attendues et les règles de validation (email valide, mot de passe assez long). Simple et court.
2. 📄 **`auth/auth.controller.ts`** — les routes : `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `DELETE /auth/me`. Chaque route délègue au service.
3. 📄 **`auth/auth.service.ts`** — **le cœur**. Lis `register` (hachage bcrypt + création), `login` (vérification + génération du JWT), `supprimerCompte` (RGPD). C'est là que se passe la vraie logique.
4. 📄 **`auth/jwt.strategy.ts`** — comment le token est décodé et vérifié à chaque requête.
5. 📄 **`auth/jwt-auth.guard.ts`** — le videur : bloque les requêtes sans token valide.
6. 📄 **`auth/roles.guard.ts`** + **`roles.decorator.ts`** — l'autorisation : réserve certaines routes au rôle ADMIN.
7. 📄 **`auth/current-user.decorator.ts`** — un raccourci pour récupérer l'utilisateur connecté dans un controller.

**En sortir :** savoir raconter le parcours d'une connexion (voir le diagramme de séquence `4-sequence-connexion`). Une fois ce module compris, **tous les autres se lisent en 5 minutes** car ils suivent le même schéma.

---

## Étape 4 — Les autres modules (même schéma, lecture rapide)

Pour chacun, lis juste le **controller** puis le **service** :

- 📁 **`beneficiaires/`** — CRUD (créer, lire, modifier, supprimer). Note dans le service la **vérification d'appartenance** : on filtre toujours par `utilisateur_id` pour qu'un user ne voie que ses données.
- 📁 **`transferts/`** — le métier le plus intéressant :
  - 📄 **`transfert.constants.ts`** : le taux `655.957` et les frais `2%`.
  - 📄 **`transferts.service.ts`** : la méthode de création calcule les frais, convertit FCFA→EUR, génère la référence, crée le transfert au statut `EN_ATTENTE`. La méthode `payer` fait avancer le statut avec un garde-fou (on ne peut pas payer deux fois).
- 📁 **`admin/`** — les routes réservées à l'admin (stats, gestion des users, changement de statut). Remarque le `@Roles('ADMIN')` en haut du controller.
- 📁 **`notifications/`** — le seul module qui utilise **MongoDB** (via Mongoose, pas Prisma). Il enregistre une notification quand un transfert est reçu. L'envoi d'email y est **simulé** (un log).

---

## Étape 5 — Le frontend

Lis dans cet ordre :

1. 📄 **`frontend/src/lib/api.ts`** — la fonction unique qui appelle le backend (ajoute le JWT, gère les erreurs). **Tout le front passe par là.**
2. 📄 **`frontend/src/lib/auth.tsx`** — le « contexte » qui garde en mémoire l'utilisateur connecté et son token (stocké dans le navigateur).
3. 📄 **`frontend/src/App.tsx`** — la liste des routes (URL → page).
4. 📄 **`frontend/src/components/ProtectedRoute.tsx`** — empêche d'accéder à une page sans être connecté.
5. 📄 **Les pages** (`pages/`), une par écran : `Login`, `Register`, `Dashboard`, `Beneficiaires`, `NouveauTransfert`, `Admin`. Prends-en **une seule** (par ex. `NouveauTransfert.tsx`) et lis-la en entier : tu verras le formulaire, l'appel à `api.ts`, et l'affichage du résultat. Les autres se ressemblent.

**En sortir :** « Une page affiche un formulaire → appelle `api.ts` → qui appelle le backend → et affiche la réponse. »

---

## Étape 6 — Relier le code aux documents

Ta meilleure arme pour comprendre : **suivre une fonctionnalité à travers tes propres diagrammes.**

- Ouvre le **diagramme de séquence du transfert** (`docs/diagrams/4-sequence-transfert`) à côté du code du `transferts.service.ts`. Chaque flèche du diagramme = une ligne de code. C'est le meilleur exercice de compréhension.
- Le **diagramme d'états** (`2-etats-transfert`) explique les statuts que tu vois dans le service.
- Le **journal de développement** (`docs/07`) raconte l'ordre dans lequel tout a été construit.

---

## Méthode active (le plus efficace)

Lire ne suffit pas. Pour **vraiment** comprendre :

1. **Lance l'appli en local** et clique partout en regardant, en parallèle, les logs du backend (`npm run start:dev`). Tu vois les requêtes arriver en temps réel.
2. **Explique à voix haute** chaque fichier comme si le jury était là. Si tu bloques, tu as trouvé ce qu'il faut réviser.
3. **Modifie une petite chose** (par ex. le taux de frais de 2 % à 3 %) et observe l'effet. Comprendre en cassant/réparant est très efficace.
4. **Utilise `git log`** pour voir les commits dans l'ordre : chaque commit est une petite étape de construction, dans le bon ordre pédagogique.
5. **Prépare une phrase par fichier** : « Ce fichier sert à… ». Si tu peux le faire pour tous, tu maîtrises ton projet.

---

## Ordre de lecture récapitulatif

```
1. schema.prisma            (les données)
2. main.ts → app.module.ts  (le démarrage)
3. auth/ en entier          (le module modèle)
4. beneficiaires, transferts, admin, notifications  (controller + service)
5. front : api.ts → auth.tsx → App.tsx → 1 page
6. diagrammes de séquence à côté du code
```

Fais ça et tu pourras répondre à n'importe quelle question du jury sur ton code.

---

*Guide de lecture du code — NORU — SEIBOU Abdou Malick — 2026*
