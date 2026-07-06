# NORU — Journal de développement

> Projet final CDA — Concepteur Développeur d'Applications. Auteur : SEIBOU Abdou Malick, École Multimédia. Période : 4 mai – 12 juillet 2026.

---

## 1. Présentation du projet et du contexte

NORU est une application web de **simulation** de transfert d'argent du Bénin vers la France. Elle répond, dans un cadre pédagogique, au besoin d'une personne souhaitant envoyer de l'argent à un proche : l'envoyeur crée un compte, enregistre un bénéficiaire (nom, email, IBAN), crée un transfert d'un montant en FCFA converti en euros, effectue un faux paiement mobile money, et le receveur est notifié par email. Un espace administrateur permet de superviser l'activité et de gérer les utilisateurs et les transferts.

NORU est **explicitement une simulation** : aucun flux financier réel n'est traité (faux paiement, faux virement). Ce cadrage, défini dès le cahier des charges, écarte la conformité bancaire réelle (PCI-DSS, KYC) tout en implémentant l'intégralité de la mécanique applicative.

Le projet a été mené en autonomie, sous le suivi d'un formateur référent, selon une démarche itérative organisée en sept phases : analyse du besoin, conception, développement, tests, déploiement, documentation et préparation à la soutenance.

## 2. Architecture technique

NORU suit une **architecture multicouche répartie** :

- **Couche présentation** : une application React (single-page application) qui affiche les interfaces et consomme l'API.
- **Couche applicative et métier** : une API REST développée avec NestJS, organisée en couches internes — contrôleurs (routes HTTP), services (logique métier), accès aux données (ORM).
- **Couche données** : une base relationnelle MySQL (utilisateurs, bénéficiaires, transferts) et une base NoSQL MongoDB (journal des notifications).

Le frontend et le backend sont hébergés séparément et communiquent via l'API REST. Le schéma d'architecture de déploiement (voir `docs/diagrams/6-deploiement.puml`) et le diagramme de composants (`docs/diagrams/7-composants.puml`) détaillent cette organisation.

**Flux type d'une requête** : le navigateur appelle `/api/...`, la requête traverse le guard d'authentification (vérification du JWT), le contrôleur, le service (logique métier), puis l'ORM Prisma qui interroge MySQL.

## 3. Choix techniques justifiés

- **React (frontend)** : standard du marché, modèle par composants réutilisables, large écosystème. Combiné à Tailwind CSS pour un style rapide et cohérent, et à React Router pour la navigation.
- **NestJS (backend)** : framework Node.js en TypeScript qui impose une **architecture en couches claire** (modules, contrôleurs, services). Ce choix permet d'avoir **un seul langage (TypeScript) sur toute la stack**, ce qui simplifie la maintenance, et met en évidence la séparation des responsabilités exigée par le référentiel.
- **MySQL + Prisma** : MySQL pour des données structurées et fortement reliées (relations 1-N entre utilisateur, bénéficiaire et transfert). Prisma comme ORM type-safe : il génère un client typé, protège nativement contre l'injection SQL (requêtes paramétrées) et gère les migrations versionnées.
- **MongoDB + Mongoose** : pour le journal des notifications, données volumineuses, à format souple et non relationnelles — un cas d'usage typique du NoSQL.
- **JWT (authentification)** : standard pour sécuriser une API REST sans état côté serveur.
- **Docker** : pour exécuter les bases de données en local à l'identique de la production, et pour conteneuriser l'application.
- **Railway + Vercel (hébergement)** : Railway pour le backend conteneurisé et les bases de données, Vercel pour le frontend statique. Déploiement automatique depuis GitHub.

## 4. Méthodologie de développement

Le travail a été planifié à partir de **14 user stories priorisées** (méthode MoSCoW) et d'un cahier des charges définissant le périmètre.

Le versionnement suit une **stratégie de branches inspirée de Git Flow** : une branche `main` protégée (production), une branche `develop` (intégration), et des évolutions apportées par **Pull Requests**. La branche `main` est protégée par des règles interdisant le push direct et exigeant une **intégration continue verte** avant toute fusion.

Les commits suivent la convention **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`…), ce qui rend l'historique lisible. Chaque évolution significative passe par une Pull Request soumise à la CI.

## 5. Intégration et déploiement continus (CI/CD)

### Vue d'ensemble

Deux workflows GitHub Actions automatisent la chaîne :

- **CI (`ci.yml`)** : à chaque push et chaque Pull Request, elle démarre MySQL et MongoDB en services, applique les migrations, exécute l'analyse de code (lint) et les tests automatisés. Elle s'exécute pour le backend et le frontend (lint + build).
- **CD (`cd.yml`)** : à chaque arrivée de code sur `main`, elle construit les images Docker du backend et du frontend et les publie sur le **GitHub Container Registry (GHCR)**, en les taguant avec l'identifiant unique du commit (SHA) pour permettre le suivi et le retour arrière.

Le déploiement effectif est assuré par les plateformes connectées à GitHub : **Railway** reconstruit et redéploie le backend, **Vercel** le frontend, automatiquement à chaque mise à jour de `main`.

### Environnements

- **Développement** : machine locale, bases MySQL et MongoDB en conteneurs Docker, serveurs de développement.
- **Test** : runner GitHub Actions, avec MySQL et MongoDB en services, exécution des tests.
- **Production** : backend et bases sur Railway, frontend sur Vercel.

### Procédure de déploiement

1. Développement sur une branche, fusion dans `develop`.
2. Ouverture d'une Pull Request `develop → main` ; la CI doit être verte.
3. Après fusion, Railway et Vercel redéploient automatiquement ; les migrations Prisma s'appliquent au démarrage du conteneur backend.
4. L'application est accessible sur ses URLs publiques.

### Procédure de rollback

En cas de bug critique en production : sur Railway, sélectionner le dernier déploiement stable et le redéployer ; sur Vercel, promouvoir un déploiement antérieur en production. Les images Docker étant taguées par SHA, on peut aussi redéployer une version précise. Autres stratégies connues : déploiement bleu-vert, canari, rolling update.

## 6. Tests et qualité

Trois niveaux de tests, distinctement nommés :

- **Tests d'intégration** (automatisés, Jest + Supertest) : ils lancent la vraie application et vérifient de bout en bout les parcours de l'API — inscription, validation (cas d'erreur), connexion, protection des routes (accès refusé sans jeton), création de bénéficiaire, création de transfert avec vérification de la conversion, paiement, et contrôle d'accès admin (refus pour un non-administrateur). Ils s'exécutent dans la CI.
- **Tests système** : scénarios manuels de bout en bout exécutés sur l'application déployée (inscription, connexion, création et paiement d'un transfert, suivi des statuts).
- **Tests d'acceptation** : formulés au format Given-When-Then à partir des user stories, ils vérifient que ce qui a été demandé est livré.

**Qualité du code** : analyse statique par ESLint et TypeScript en mode strict, exécutée dans la CI. Le style est uniformisé (Prettier).

## 7. Sécurité (OWASP Top 10 appliqué à NORU)

- **Contrôle d'accès (A01)** : authentification par JWT, autorisation par rôles (`@Roles('ADMIN')`), et contrôle d'appartenance — chaque utilisateur n'accède qu'à ses propres bénéficiaires et transferts. Un administrateur ne peut pas supprimer son propre compte.
- **Défaillances cryptographiques (A02)** : mots de passe hachés avec bcrypt (jamais stockés en clair), secrets (clé JWT, mots de passe de base) placés dans des variables d'environnement, jamais versionnées.
- **Injection (A03)** : accès aux données via l'ORM Prisma (requêtes paramétrées, aucune concaténation de SQL), et validation systématique des données entrantes avec class-validator (DTO).
- **Mauvaise configuration (A05)** : CORS restreint à l'origine du frontend, fichiers `.env` exclus du dépôt via `.gitignore`.
- **Défauts d'authentification (A07)** : jeton JWT signé côté serveur, messages d'erreur de connexion volontairement neutres (pour ne pas révéler si l'email ou le mot de passe est en cause).
- **XSS** : le rendu par défaut de React échappe automatiquement les contenus affichés.
- **Scan des dépendances** : `npm audit` sur le backend et le frontend.

## 8. Incidents et résolutions

### Incident 1 — Erreur 502 en production (port)

- **Détection** : après le premier déploiement du backend sur Railway, l'URL renvoyait `502 Application failed to respond`.
- **Diagnostic** : le domaine public de Railway routait vers le port 8080, alors que l'application NestJS écoutait sur un autre port : le proxy ne trouvait aucune application sur le port attendu.
- **Correction** : ajout de la variable d'environnement `PORT=8080` pour que l'application écoute exactement sur le port exposé. Le service a répondu correctement.

### Incident 2 — Plantage au démarrage (connexion MongoDB)

- **Détection** : le conteneur backend redémarrait en boucle. Les logs affichaient `MongoParseError: Invalid scheme, expected connection string to start with "mongodb://"`.
- **Diagnostic** : la variable `MONGODB_URI` ne contenait pas une adresse valide — la référence à la variable du service Mongo ne s'était pas correctement reliée, la valeur ne commençait donc pas par `mongodb://`.
- **Correction** : renseignement de `MONGODB_URI` avec l'adresse de connexion complète du service MongoDB. L'application a démarré et l'API a répondu (inscription et connexion fonctionnelles en ligne).

### Incident 3 — Erreur 404 au rafraîchissement (routage SPA)

- **Détection** : en rafraîchissant une page comme `/connexion`, Vercel renvoyait une erreur `404 NOT_FOUND`.
- **Diagnostic** : NORU est une single-page application dont les routes sont gérées côté navigateur par React Router ; au rafraîchissement, Vercel cherchait un fichier physique à ce chemin, inexistant.
- **Correction** : ajout d'un fichier `vercel.json` avec une règle de réécriture renvoyant toutes les routes vers `index.html`, laissant React Router gérer la navigation.

*(Incident mineur complémentaire : la validation stricte de l'IBAN — clé de contrôle — bloquait la saisie de bénéficiaires fictifs lors de la démonstration ; elle a été assouplie en un contrôle de longueur, cohérent avec la nature simulée de l'application.)*
