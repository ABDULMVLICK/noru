# NORU

Application web de **simulation** de transfert d'argent du Bénin vers la France.
Projet final de certification **Concepteur Développeur d'Applications (CDA)**.

> ⚠️ NORU est une simulation pédagogique : aucun flux financier réel (faux paiement mobile money, faux virement). L'envoyeur crée un transfert, le receveur est notifié par email.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React (TypeScript) |
| Backend | NestJS (TypeScript), API REST |
| ORM + BDD relationnelle | Prisma + MySQL |
| BDD NoSQL | MongoDB (journal des notifications) |
| Authentification | JWT (bcrypt) |
| Conteneurs | Docker / docker-compose |

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
npm run start:dev           # API sur http://localhost:3000

# 3. Frontend
cd ../frontend
npm install
npm run dev                 # app sur http://localhost:5173
```

## Structure du projet

```
noru/
├── backend/      API NestJS (modules, contrôleurs, services, Prisma)
├── frontend/     Application React
├── docs/         Conception (user stories, MCD/MLD, diagrammes UML)
├── docker-compose.yml
└── README.md
```

## Auteur

SEIBOU Abdou Malick — École Multimédia.
