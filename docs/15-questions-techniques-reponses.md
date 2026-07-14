# NORU — Fiche de révision : 100 questions techniques (réponses adaptées à mon projet)

**SEIBOU Abdou Malick — 2026**

> ⚠️ **Important — ma stack.** Beaucoup de questions types supposent **Symfony / Doctrine / PHP**. **Mon projet n'utilise PAS PHP** : c'est **React + NestJS + Prisma + TypeScript + MySQL + MongoDB**. Quand une question parle de Symfony, je donne **l'équivalent dans MA stack** (repéré par **→ NORU**). Le jury apprécie que je sache faire le lien plutôt que réciter une techno que je n'utilise pas.

---

## UML — Diagramme de cas d'utilisation

1. **Acteur ?** Un rôle joué par une entité externe (personne ou système) qui interagit avec le système ; représenté par un bonhomme. *Chez moi : Visiteur, Envoyeur, Admin.*
2. **include vs extend ?** *include* = un cas en inclut **obligatoirement** un autre (ex. « Créer un transfert » include « Payer »). *extend* = extension **optionnelle** sous condition.
3. **Relation entre deux acteurs ?** Oui, une **généralisation/spécialisation** (héritage), flèche à triangle blanc. *Ex. l'Envoyeur hérite du Visiteur.*
4. **Acteur primaire vs secondaire ?** Le primaire **initie** le cas pour atteindre un objectif ; le secondaire est **sollicité** par le système pendant l'exécution.

## UML — Diagramme de séquence

6. **Ligne verticale pointillée ?** La **ligne de vie** (lifeline) de l'objet : son existence dans le temps.
7. **Fragment « alt » ?** Un fragment combiné représentant une **alternative** (if/else), avec plusieurs opérandes séparés par des pointillés.
8. **Message asynchrone ?** Une flèche à **pointe ouverte** (trait plein) : l'émetteur n'attend pas de réponse.
9. **Rectangle gris sur une ligne de vie ?** Une **barre d'activation** : la période où l'objet est actif et traite un message.

## UML — Diagramme de classes

13. **Agrégation vs composition ?** Agrégation = **losange blanc**, association faible (les parties survivent seules). Composition = **losange noir**, dépendance existentielle forte.
14. **Classe abstraite ?** Nom en **italique** ou stéréotype `«abstract»` ; ne peut pas être instanciée directement.
15. **Multiplicité « 0..* » ?** Zéro ou plusieurs instances (aucune contrainte de maximum).
16. **Visibilité + - # ~ ?** `+` public, `-` privé, `#` protégé, `~` package.
19. **Héritage en UML ?** Flèche à **triangle blanc** pointant vers la classe parente (généralisation).

## UML — Diagramme d'activité

21. **Activité vs séquence ?** L'activité décrit le **flux de contrôle** (traitements/décisions) ; la séquence décrit les **interactions entre objets dans le temps**.
22. **Décision ?** Un **losange** avec une condition et plusieurs flux sortants étiquetés.
23. **Parallélisme ?** Barres de **synchronisation (fork/join)** : une barre divise le flux en activités parallèles.
25. **Nœud initial / final ?** Initial = cercle noir plein (début) ; final = cercle noir dans un cercle (fin).
26. **Merge node ?** Point de **fusion** (losange) qui réunit plusieurs flux alternatifs en un seul, **sans** synchronisation.

## Merise — MCD

27. **Entité ?** Un objet du monde réel identifiable et d'intérêt, avec des propriétés et un identifiant. *Chez moi : Utilisateur, Beneficiaire, Transfert.*
28. **Relation vs association ?** En Merise, **aucune différence** : un lien sémantique entre entités, porteur de cardinalités.
29. **Cardinalités « 1,1 » et « 0,n » ?** `1,1` = participation obligatoire et unique. `0,n` = optionnelle et multiple.
32. **Dépendance fonctionnelle ?** La valeur d'un attribut **détermine** celle d'un autre (A → B).
33. **Cardinalité « 1,n » ?** Au minimum une occurrence, au maximum plusieurs (obligatoire et multiple).
34. **Relation N-N en MLD ?** On crée une **table de jonction** avec les clés étrangères des deux entités en clé primaire composite. *(NORU n'a pas de N-N.)*

## Merise — MLD

35. **Relation « 1,n » en MLD ?** On ajoute une **clé étrangère** du côté « n » vers le côté « 1 ». *Ex. `transfert.utilisateur_id`.*
36. **Relation « 1,1 » en MLD ?** Fusionner les deux tables, ou ajouter une FK **unique** dans l'une des tables.
37. **Nommer une FK ?** Préfixe `#` (Merise) ou suffixe `_id` du nom de l'entité référencée (ex. `utilisateur_id`).
38. **Clé primaire composite ?** Une PK constituée de **plusieurs** attributs (typique des tables de jonction N-N).
39. **Propriété d'une relation en MLD ?** Elle devient un attribut de la table créée (N-N) ou migre dans la table côté « n » (1-N).
40. **Héritage en MLD ?** Trois stratégies : une table par classe mère (avec discriminant), une par classe fille, ou une par classe avec FK.

## Merise — MPD

41. **MLD vs MPD ?** Le MLD est **indépendant** du SGBD ; le MPD **spécifie** les types, index et contraintes du SGBD cible. *Chez moi = MySQL 8.*
42. **DELETE CASCADE vs SET NULL ?** CASCADE **supprime** les lignes liées ; SET NULL met la FK à **NULL**. *NORU utilise CASCADE (RGPD : supprimer un compte efface ses données).*
43. **Index en base ?** Structure qui **accélère les recherches** sur une colonne, au prix de l'espace disque et de la vitesse d'écriture.
— **Index sur une FK ?** Pour optimiser les **jointures** et recherches sur la relation.

## Symfony → **équivalents dans MA stack (NestJS / Prisma)**

44. **Entité Doctrine ?** Classe mappée à une table. **→ NORU : un modèle Prisma** défini dans `schema.prisma`.
45. **Relation OneToMany en Doctrine ?** `@ORM\OneToMany` / `@ORM\ManyToOne`. **→ NORU : une relation Prisma** (ex. `Utilisateur` a `Transfert[]`, `Transfert` a un `utilisateur`).
46. **Repository ?** Classe des requêtes d'accès aux données. **→ NORU : je n'ai pas de Repository ; j'injecte `PrismaService` dans mes services** et j'appelle `prisma.transfert.findMany(...)`.
47. **persist() vs flush() ?** persist = mémoire, flush = exécute le SQL. **→ NORU : Prisma n'a pas ce mécanisme ; `prisma.transfert.create()` exécute directement la requête.**
48. **ManyToMany en Doctrine ?** `@ORM\ManyToMany` + table de jointure. **→ NORU : se déclare en Prisma par une relation implicite ou une table de jonction explicite (non utilisé ici).**

## React

49. **Diagramme de composants pour React ?** Chaque composant React = un composant UML avec ses interfaces (props) et ses dépendances.
50. **Flux unidirectionnel React en séquence ?** Le parent envoie des **props** (synchrone) aux enfants ; les enfants remontent des **événements (callbacks)** vers le parent.

---

# Activité Type 1 — Développer une application sécurisée

## C1 — Environnement de travail

1. **Éléments d'un environnement de dev ?** *(question orientée Symfony)* **→ NORU : Node.js, npm, un éditeur (VS Code), Docker (MySQL + MongoDB), Git, et les serveurs de dev Vite (front) et Nest (back).**
2. **Dev vs prod ?** Dev : erreurs détaillées, rechargement à chaud, pas d'optimisation. Prod : optimisé, minifié, erreurs masquées, variables sécurisées.
3. **Variables d'environnement ?** Dans des fichiers `.env` (`CLE=valeur`), jamais versionnés. *NORU : `DATABASE_URL`, `JWT_SECRET`, `MONGODB_URI`…*
4. **Docker, pourquoi ?** Outil de conteneurisation : isole l'app et ses dépendances → environnement **identique** en local et en prod. *NORU : MySQL + MongoDB en conteneurs.*
5. **Git — 3 commandes ?** `git add` (indexer), `git commit` (enregistrer), `git push` (envoyer au dépôt distant).

## C2 — Interfaces utilisateur

6. **JSX ?** Extension syntaxique de JavaScript pour écrire du HTML dans le JS, transpilé en `React.createElement`.
7. **Composant contrôlé vs non contrôlé ?** Contrôlé = état géré par React (`value` + `onChange`). Non contrôlé = état dans le DOM (`ref`). *NORU : mes formulaires sont contrôlés (`useState`).*
8. **Twig dans Symfony ?** Moteur de templates PHP. **→ NORU : je n'utilise pas Twig ; mon front est React (SPA), totalement séparé du back.**
9. **Virtual DOM ?** Représentation en mémoire du DOM ; React compare les versions (réconciliation) et n'applique que les changements minimaux.
10. **Formulaires côté client React ?** État local par champ (`useState`), `onChange` pour mettre à jour, `onSubmit` pour traiter.
11. **Accessibilité (a11y) ?** Rendre l'app utilisable par tous : attributs ARIA, contrastes, navigation clavier, labels. *NORU : labels associés, contrastes, clavier.*
12. **Responsive ?** Media queries, unités relatives (rem, %, vw), Flexbox/Grid, approche mobile-first. *NORU : Tailwind CSS, mobile-first.*

## C3 — Composants métier

13. **Service ?** Classe réutilisable qui encapsule une **logique métier**, fournie par injection de dépendances. *NORU : `TransfertsService`, `AuthService`…*
14. **Injection de dépendances ?** Les dépendances sont **fournies de l'extérieur** (constructeur) plutôt que créées en interne → découplage et testabilité. *NORU : NestJS injecte les services et `PrismaService`.*
15. **Système d'événements ?** *(Symfony EventDispatcher)* **→ NORU : NestJS a des EventEmitters ; je ne les utilise pas dans ce projet (flux direct controller → service).**
16. **DTO (Data Transfer Object) ?** Objet simple qui transporte des données entre couches, sans logique, avec validation. *NORU : `CreateTransfertDto`, validés par class-validator.*
17. **Service vs Repository ?** Repository = accès aux données ; service = logique métier (peut utiliser plusieurs repositories). **→ NORU : l'accès aux données passe par `PrismaService` dans mes services.**
19. **Custom Hook React ?** Fonction commençant par `use` qui encapsule une logique réutilisable à base de hooks. *NORU : `useAuth()`.*
20. **État global React ?** Context API (besoins simples), Redux (complexe), React Query (état serveur). *NORU : **Context API** pour l'utilisateur connecté.*

## C4 — Gestion de projet

21. **Méthodologie Agile ?** Approche **itérative et incrémentale**, collaboration, adaptation au changement, livraison continue de valeur.
22. **Scrum vs Kanban ?** Scrum = **sprints** de durée fixe + rôles. Kanban = **flux continu** + limitation du travail en cours (WIP).
23. **User story ?** Description courte côté utilisateur : « En tant que [rôle], je veux [action] afin de [bénéfice] ». *NORU : 14 user stories.*
24. **Sprint (Scrum) ?** Itération de durée fixe (2-4 semaines) produisant un incrément livrable.
25. **Estimer une tâche ?** Planning Poker avec des points de story (suite de Fibonacci), selon effort, complexité et incertitude.

---

# Activité Type 2 — Concevoir une application en couches

## C5 — Analyser les besoins & maquetter

26. **Cahier des charges fonctionnel ?** Document décrivant besoins, objectifs, périmètre, cibles et contraintes.
27. **Besoin fonctionnel vs non-fonctionnel ?** Fonctionnel = ce que le système **fait**. Non-fonctionnel = **comment** (performance, sécurité, accessibilité).
28. **Wireframe ?** Maquette **basse fidélité** montrant structure et disposition, sans design.
29. **Wireframe vs maquette vs prototype ?** Wireframe = structure ; maquette = design visuel statique ; prototype = maquette **interactive**.
30. **MVP ?** Version minimale avec juste assez de fonctionnalités pour valider l'hypothèse métier.
31. **Prioriser les fonctionnalités ?** Méthode **MoSCoW** (Must/Should/Could/Won't) ou matrice valeur/effort. *NORU : MoSCoW.*

## C6 — Architecture logicielle

32. **MVC ?** Model (données/métier), View (présentation), Controller (coordination).
33. **Architecture en couches ?** Organisation en couches (présentation, métier, données) avec dépendances **unidirectionnelles**. *NORU : React → API NestJS → Prisma/Mongoose.*
34. **SOLID (3 principes) ?** **S**ingle Responsibility (responsabilité unique), **O**pen/Closed (ouvert à l'extension, fermé à la modification), **L**iskov (substituabilité) ; + Interface Segregation, Dependency Inversion.
35. **API REST ?** Interface HTTP : ressources identifiées par URL, verbes HTTP standard, échanges en JSON. *NORU : `/api/transferts`, etc.*
36. **Monolithique vs microservices ?** Monolithe = une app déployée d'un bloc. Microservices = services indépendants communiquant par API. *NORU : monolithe découplé front/back.*
37. **Pattern Repository ?** Encapsule l'accès aux données derrière une interface « collection ».
38. **Pattern Factory ?** Pattern créationnel qui délègue l'instanciation d'objets à une classe dédiée.

## C7 — Base de données relationnelle

39. **Normalisation ?** Organiser les données pour réduire la **redondance** et améliorer l'**intégrité** (formes normales 1FN, 2FN, 3FN).
41. **Intégrité référentielle ?** Une clé étrangère référence toujours une clé primaire **existante** → cohérence entre tables.
42. **DELETE CASCADE vs SET NULL ?** *(voir MPD Q42)* CASCADE supprime les lignes liées ; SET NULL met la FK à NULL.
43. **Migrations ?** *(Symfony = Doctrine Migrations)* **→ NORU : Prisma Migrate** (`prisma migrate dev` / `deploy`) → versionne le schéma.
44. **Transaction (ACID) ?** Ensemble d'opérations **tout-ou-rien** : Atomicité, Cohérence, Isolation, Durabilité.

## C8 — Accès aux données SQL & NoSQL

45. **DQL (Doctrine Query Language) ?** Langage orienté objet de Doctrine. **→ NORU : l'équivalent est le client Prisma** (`findMany`, `where`, `include`), typé.
46. **SQL vs NoSQL ?** SQL = relationnel, schéma fixe, ACID, jointures. NoSQL = flexible (document, clé-valeur), scalable, schéma dynamique. *NORU : MySQL + MongoDB.*
47. **Lazy loading ?** Chargement des données liées **à la demande** (risque du N+1). **→ NORU : avec Prisma je choisis quoi charger via `include`.**
48. **Éviter le N+1 ?** Charger les relations en **une seule requête** (JOIN / `include`) au lieu d'une par élément.
49. **Requête préparée ?** Requête SQL pré-compilée avec paramètres liés → protège des injections. **→ NORU : Prisma fait des requêtes paramétrées par défaut.**
50. **MongoDB, quand ?** Base NoSQL document (JSON/BSON), pour données semi-structurées, volumineuses ou schéma évolutif. *NORU : journal des notifications.*

---

# Activité Type 3 — Préparer le déploiement

## C9 — Tests

51. **Test unitaire ?** Vérifie une **unité isolée** de code, indépendamment de ses dépendances.
52. **Unitaire vs intégration ?** Unitaire = unité isolée (avec mocks). Intégration = plusieurs composants **réels** ensemble (ex. service + base). *NORU : tests d'intégration Jest + Supertest.*
53. **PHPUnit ?** Framework de test PHP. **→ NORU : j'utilise Jest + Supertest.**
54. **TDD ?** Écrire d'abord le test (qui échoue), puis le code, puis refactoriser. Cycle **Red-Green-Refactor**.
55. **Mock ?** Objet simulé remplaçant une dépendance réelle pour isoler le code testé.
56. **Tester un composant React ?** React Testing Library : rendre le composant, interagir (`fireEvent`), asserter (`getByText`).
57. **Couverture de code ?** % de code exécuté par les tests ; identifie les zones non testées (ne garantit pas la qualité).

## C10 — Documentation & déploiement

58. **README.md ?** Document markdown à la racine : présentation, installation, utilisation, contribution.
59. **Documentation d'API ?** Description des endpoints, verbes, paramètres, formats, codes d'erreur ; souvent via **Swagger/OpenAPI**.
60. **Documenter une API automatiquement ?** *(Symfony = NelmioApiDoc)* **→ NORU : `@nestjs/swagger` génère l'OpenAPI à partir des décorateurs.**
61. **Changelog ?** Fichier listant chronologiquement les modifications par version.
62. **Versioning sémantique (semver) ?** `MAJEUR.MINEUR.CORRECTIF` : incompatibilités / nouveautés compatibles / corrections.
63. **Pipeline CI/CD ?** Processus automatisé : tests, build, déploiement. *NORU : GitHub Actions.*

## C11 — Mise en production (DevOps)

64. **DevOps ?** Culture et pratiques unissant développement et exploitation pour livrer vite et bien.
65. **Intégration continue (CI) ?** Intégrer fréquemment le code avec **tests automatiques** à chaque commit. *NORU : lint + tests sur chaque push.*
66. **Déploiement continu (CD) ?** Automatiser le déploiement en production après validation des tests.
67. **3 outils CI/CD ?** **GitHub Actions** (le mien), GitLab CI, Jenkins, CircleCI.
68. **Reverse proxy (Nginx) ?** Serveur intermédiaire qui reçoit les requêtes et les transmet au backend (load balancing, cache, SSL). *NORU : géré par Railway/Vercel.*
69. **Conteneurisation Docker ?** Empaqueter une app avec ses dépendances dans un conteneur isolé et portable.
70. **Dockerfile ?** Script définissant la construction d'une image : `FROM`, `RUN`, `COPY`, `CMD`. *NORU : `backend/Dockerfile`.*
71. **Docker Compose ?** Outil définissant plusieurs conteneurs via un `docker-compose.yml`. *NORU : MySQL + MongoDB.*
72. **Rollback ?** Retour à une version stable précédente en cas de bug. *NORU : redéploiement de la version précédente sur Railway/Vercel.*

---

# Transversal — Sécurité

73. **Injection SQL + prévention ?** Injecter du SQL malveillant via une entrée. Prévention : **requêtes paramétrées / ORM** (Prisma), validation. *NORU : Prisma.*
74. **XSS ?** Injecter du JavaScript malveillant dans une page. Prévention : **échappement des sorties** (React le fait), validation, CSP.
75. **CSRF ?** Forcer un utilisateur authentifié à exécuter une action non voulue. Prévention : tokens CSRF, `SameSite`, vérification de l'origine.
76. **Protection CSRF ?** *(Symfony = tokens de formulaire)* **→ NORU : API stateless avec JWT en en-tête (pas de cookie de session), donc le CSRF classique par cookie ne s'applique pas.**
77. **Hachage de mot de passe ?** Transformation **irréversible** ; protège en cas de fuite de la base. Utiliser **bcrypt** / Argon2 (jamais MD5/SHA1). *NORU : bcrypt.*
78. **JWT ?** Jeton compact et autoportant (`header.payload.signature`) pour l'authentification d'API. *NORU : généré à la connexion.*
79. **Authentification vs autorisation ?** Authentification = « qui es-tu ? » (identité). Autorisation = « qu'as-tu le droit de faire ? » (permissions). *NORU : JWT + rôles.*
80. **HTTPS ?** HTTP chiffré via TLS/SSL : protège de l'interception, garantit intégrité et authenticité. *NORU : HTTPS sur Vercel/Railway.*
81. **CORS ?** Mécanisme contrôlant les requêtes inter-domaines via des en-têtes HTTP. *NORU : `CORS_ORIGIN` limité au domaine du front.*
82. **Rôles & permissions ?** *(Symfony = `@IsGranted`)* **→ NORU : `RolesGuard` + décorateur `@Roles('ADMIN')` dans NestJS.**

# Architecture & patterns avancés

83. **Pattern Command ?** Encapsuler une requête comme un objet (paramétrer, mettre en file, annuler).
84. **Pattern Observer ?** Un sujet notifie automatiquement ses observateurs à chaque changement d'état (base des événements).
85. **DRY ?** *Don't Repeat Yourself* : chaque connaissance a une représentation unique → éviter la duplication.
86. **KISS ?** *Keep It Simple* : privilégier la simplicité, éviter la complexité inutile. *Mon fil conducteur sur NORU.*
87. **YAGNI ?** *You Aren't Gonna Need It* : ne pas coder ce qui n'est pas encore nécessaire.
88. **Dette technique ?** Coût futur des choix rapides/sous-optimaux ; se rembourse par le refactoring.

# Performance & optimisation

89. **Cache applicatif ?** Stocker des résultats coûteux pour les réutiliser (Redis, etc.). *(Non utilisé dans NORU.)*
90. **Lazy loading des images ?** Charger les images seulement quand elles deviennent visibles (`loading="lazy"`).
91. **Code splitting React ?** Découper le bundle JS en morceaux chargés à la demande (`React.lazy`, imports dynamiques).
92. **Index (et quand) ?** Accélère les recherches sur colonnes souvent interrogées (WHERE, JOIN, ORDER BY) ; à utiliser avec parcimonie (ralentit l'écriture).

# API & communication

93. **PUT vs PATCH ?** PUT **remplace** toute la ressource (idempotent) ; PATCH **modifie partiellement**. *NORU : j'utilise PATCH (ex. `/transferts/:id/payer`).*
94. **Codes HTTP courants ?** 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.
95. **Pagination d'API ?** Découper de grandes collections en pages (offset/limit, curseur, numéro de page).
96. **GraphQL vs REST ?** GraphQL : le client demande **exactement** les données voulues, un seul endpoint (évite l'over/under-fetching). *NORU : REST.*
97. **Sérialisation ?** *(Symfony Serializer)* **→ NORU : NestJS sérialise automatiquement mes objets en JSON.**

# Tests & qualité

98. **Analyse statique ?** Examiner le code **sans l'exécuter** pour détecter erreurs et violations (TypeScript, ESLint). *NORU : TypeScript strict + oxlint.*
99. **Linting ?** Analyse automatique du respect des conventions et des erreurs de syntaxe (ESLint, Prettier). *NORU : oxlint dans la CI.*
100. **Test end-to-end (E2E) ?** Simuler le parcours complet d'un utilisateur à travers l'app (Cypress, Playwright). *NORU : mes tests d'intégration Supertest couvrent les parcours API.*

---

## Les 10 pièges à ne jamais oublier (spécial NORU)

1. **Je n'utilise pas Symfony/PHP** → Prisma remplace Doctrine, Jest remplace PHPUnit, NestJS injecte les services.
2. **Prisma n'est pas une base** → ma base c'est MySQL ; Prisma est l'ORM qui parle à MySQL.
3. **bcrypt ≠ chiffrement** → c'est un **hachage irréversible**.
4. **JWT** = maintenir la session ; **bcrypt** = protéger le mot de passe. Deux rôles différents.
5. **MySQL** pour les données reliées, **MongoDB** pour le journal des notifications.
6. **CSRF** : peu pertinent chez moi car API stateless avec JWT en en-tête (pas de cookie).
7. **Authentification** (qui) ≠ **autorisation** (droits).
8. **PATCH** modifie partiellement (ce que j'utilise), **PUT** remplace tout.
9. **CI** vérifie, **CD** livre.
10. **Le paiement** : prototype fonctionnel, **circuit réel en attente d'autorisations** (jamais dire « faux »).
