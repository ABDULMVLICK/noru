# NORU

**Application web de transfert d'argent du Bénin vers la France.**
L'envoyeur crée un compte, enregistre ses bénéficiaires, initie un transfert en FCFA converti en euros, le règle par mobile money, et le bénéficiaire est notifié par email. Un espace d'administration permet de superviser l'activité.

🔗 **Application en ligne** : https://noru-two.vercel.app
🔗 **API** : https://noru-production.up.railway.app/api
🔗 **Dépôt** : https://github.com/ABDULMVLICK/noru

> ℹ️ **État du projet** — NORU est un **prototype fonctionnel**. Toute la mécanique applicative est développée et déployée ; le circuit de paiement est en place mais **désactivé en attente des autorisations réglementaires** (agrément d'établissement de monnaie électronique — BCEAO / UEMOA) et des accords opérateurs (MTN MoMo, Moov Money). **Aucun flux financier réel n'est traité à ce stade.**

---

## Fonctionnalités

- **Comptes** — inscription, connexion par jeton JWT, suppression du compte et des données (droit à l'effacement, RGPD).
- **Bénéficiaires** — création, consultation et suppression, avec contrôle strict d'appartenance.
- **Transferts** — conversion FCFA → EUR au taux fixe (1 € = 655,957 FCFA), frais de 2 %, référence unique, cycle de vie `EN_ATTENTE → PAYE → ENVOYE → RECU` (+ branche `ECHEC`).
- **Notifications** — journalisation des notifications destinées au bénéficiaire (MongoDB).
- **Administration** — supervision des transferts, changement de statut, gestion des utilisateurs et des rôles, statistiques.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript, Vite, Tailwind CSS |
| Backend | NestJS + TypeScript, API REST |
| ORM + BDD relationnelle | Prisma + MySQL |
| BDD NoSQL | MongoDB (journal des notifications) |
| Authentification | JWT + bcrypt, contrôle d'accès par rôles |
| Conteneurs | Docker / docker-compose |
| CI/CD | GitHub Actions → GHCR → Railway (API) & Vercel (front) |

## Architecture

Architecture **client-serveur découplée**, en trois couches :

```
React (SPA)  ──HTTP/JSON──►  API REST NestJS  ──►  Prisma  ──►  MySQL
                             (Contrôleur → Service)  Mongoose ─►  MongoDB
```

Chaque couche a une responsabilité unique. L'API est **sans état** : chaque requête porte le jeton JWT.

## Prérequis

- Node.js 20+ et npm
- Docker Desktop (ou équivalent)

## Démarrer en local

```bash
# 1. Lancer les bases de données (MySQL + MongoDB)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env        # puis adapter si besoin
npm install
npx prisma migrate dev      # crée les tables
npm run start:dev           # API sur http://localhost:3000/api

# 3. Frontend
cd ../frontend
npm install
npm run dev                 # app sur http://localhost:5173
```

## Tests

```bash
cd backend
npm run test:e2e            # tests d'intégration (Jest + Supertest)
```

Les tests couvrent les parcours de bout en bout et les cas d'erreur (200, 201, 400, 401, 403).

## Sécurité

- Mots de passe **hachés avec bcrypt** (jamais stockés en clair).
- **JWT** signé pour l'authentification, **rôles** (`USER` / `ADMIN`) pour l'autorisation.
- **Requêtes paramétrées via Prisma** → protection contre l'injection SQL.
- Échappement par défaut de React → protection contre le XSS.
- Validation systématique des entrées côté serveur (DTO + `class-validator`).
- Aucun secret dans le dépôt : tout passe par des variables d'environnement.

## Structure du projet

```
noru/
├── backend/            API NestJS (modules : auth, beneficiaires, transferts, admin, notifications)
│   ├── prisma/         schéma et migrations
│   └── test/           tests d'intégration
├── frontend/           Application React (pages, composants, lib)
├── docs/               Conception : user stories, cahier des charges, MCD/MLD
│   └── diagrams/       diagrammes UML (sources PlantUML + rendus PNG)
├── docker-compose.yml
└── README.md
```

## Documentation

| Document | Contenu |
|---|---|
| [Cahier des charges](docs/02-cahier-des-charges.md) | Besoins, périmètre, contraintes |
| [User stories](docs/01-user-stories.md) | 14 user stories priorisées (MoSCoW) |
| [Modèle de données](docs/03-modele-de-donnees.md) | MCD, MLD, MPD et justification des choix |
| [Diagrammes UML](docs/04-diagrammes-uml.md) | 7 diagrammes (cas d'utilisation, séquence, classes…) |
| [Dossier de conception](docs/09-dossier-conception.md) | Document de conception complet |
| [Déploiement](docs/06-deploiement.md) | Procédure de mise en production et rollback |
| [Journal de développement](docs/07-journal-developpement.md) | Suivi, incidents et résolutions |

## Auteur

**SEIBOU Abdou Malick** — Projet de certification Concepteur Développeur d'Applications, École Multimédia (2026).
