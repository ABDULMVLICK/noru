# NORU — Diagrammes UML

> Phase 2 — Conception. 7 diagrammes UML. Sources PlantUML versionnées dans `diagrams/`.
> Pour rendre une image : copier le `.puml` sur https://www.plantuml.com/plantuml ou via l'extension PlantUML de VS Code.

## Liste des diagrammes

| # | Diagramme | Source | Rôle |
|---|---|---|---|
| 1 | Cas d'utilisation | `diagrams/1-cas-utilisation.puml` | Qui fait quoi |
| 2 | États-transitions | `diagrams/2-etats-transfert.puml` | Cycle de vie du transfert |
| 3 | Classes | `diagrams/3-classes.puml` | Structure du code (entités, services, contrôleurs) |
| 4a | Séquence — connexion | `diagrams/4-sequence-connexion.puml` | Connexion + génération du JWT |
| 4b | Séquence — transfert | `diagrams/4-sequence-transfert.puml` | Création d'un transfert |
| 5 | Activité | `diagrams/5-activite-inscription.puml` | Processus d'inscription (branches de décision) |
| 6 | Déploiement | `diagrams/6-deploiement.puml` | Infra CI/CD : GitHub → Railway + Vercel |
| 7 | Composants | `diagrams/7-composants.puml` | Frontend ↔ Backend ↔ bases de données |

---

## 1. Diagramme de cas d'utilisation

Acteurs : **Visiteur** (non connecté), **Envoyeur** (utilisateur connecté), **Admin**. Le bénéficiaire n'est pas un acteur du système (il ne s'y connecte pas) : il est simplement notifié par email.

Points clés à défendre à l'oral :
- L'`Envoyeur` est un `Visiteur` qui s'est connecté → il hérite de « Se connecter ».
- `Créer un transfert` **inclut** `Payer par mobile money` (on ne crée pas un transfert sans le financer).
- `Changer le statut` **inclut** `Notifier le bénéficiaire`.

## 2. Diagramme d'états-transitions (cycle de vie du Transfert)

États : `EN_ATTENTE → PAYE → ENVOYE → RECU`, avec une branche `ECHEC`.

| Transition | Événement déclencheur |
|---|---|
| → EN_ATTENTE | création du transfert |
| EN_ATTENTE → PAYE | paiement (simulé) validé |
| EN_ATTENTE → ECHEC | paiement refusé ou abandonné |
| PAYE → ENVOYE | traitement par NORU |
| ENVOYE → RECU | admin marque « reçu », notification envoyée |
| ENVOYE → ECHEC | incident de traitement |

Intérêt pour la certification : ce diagramme prouve qu'on a réfléchi aux **cas limites** (échec) avant de coder, pas seulement au chemin nominal. Le champ `statut` de la table `transfert` matérialise directement ces états.

## 3. Diagramme de classes

Reflète la structure réelle du code backend, en 3 couches :
- **Entités** (modèles Prisma) : `Utilisateur`, `Beneficiaire`, `Transfert` + énumérations `Role`, `StatutTransfert`.
- **Services** (logique métier) : `AuthService`, `BeneficiairesService`, `TransfertsService`, `AdminService`, `NotificationsService`, `PrismaService`.
- **Contrôleurs** (API REST) : `AuthController`, `BeneficiairesController`, `TransfertsController`, `AdminController`.

Sens des dépendances : `Contrôleur → Service → PrismaService → BDD`. À défendre à l'oral : cette séparation en couches est la traduction directe de l'architecture (compétence C6/C8).

## 4. Diagrammes de séquence (parcours critiques)

**4a — Connexion (génération du JWT)** : Utilisateur → Frontend → `AuthController` → `AuthService` → MySQL (recherche), puis `bcrypt.compare` (vérification du mot de passe) et `JwtService` (génération du jeton), enfin retour du token stocké côté client.

**4b — Création d'un transfert** : le `JwtAuthGuard` vérifie le jeton, puis `TransfertsService` contrôle que le bénéficiaire appartient à l'utilisateur, calcule les frais et la conversion FCFA→EUR, génère la référence et enregistre le transfert au statut `EN_ATTENTE`.

Ces deux diagrammes permettent de **tracer le chemin d'une requête étape par étape** — exactement ce que le jury demande (« quand un utilisateur crée un transfert, par quels objets passe la requête ? »).

## 5. Diagramme d'activité (inscription)

Représente le processus d'inscription avec ses **branches de décision** : validation des données, consentement RGPD obligatoire, unicité de l'email, puis hachage du mot de passe, création et connexion. Il prouve qu'on a réfléchi aux chemins alternatifs (erreurs) et pas seulement au cas nominal.

## 6. Diagramme de déploiement

Montre l'infrastructure réelle : le développeur pousse sur **GitHub**, où **GitHub Actions** exécute la CI (lint + tests) puis la CD (construction des images publiées sur **GHCR**). Le backend NestJS et les bases **MySQL** / **MongoDB** tournent sur **Railway**, le frontend React sur **Vercel**. L'utilisateur accède au frontend en HTTPS, qui appelle l'API REST du backend.

## 7. Diagramme de composants

Détaille les composants logiciels et leurs dépendances : côté frontend (pages, composants réutilisables, module d'appel API), côté backend (contrôleurs REST → services métier → Prisma/Mongoose), reliés aux bases MySQL et MongoDB. C'est la vue « briques logicielles » de l'architecture en couches.

---

**Les 7 diagrammes UML sont complets.** Pour obtenir les images : coller chaque `.puml` sur https://www.plantuml.com/plantuml (ou l'extension PlantUML de VS Code) et exporter en PNG/PDF pour le dossier de conception.
