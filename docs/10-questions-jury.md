# NORU — Les 30 questions du jury (préparation orale)

> Une réponse de 30 à 60 secondes par question. Lis-les à voix haute jusqu'à les intégrer.
> ⚠️ Les questions sur la veille (27-28) sont à **personnaliser avec tes vraies sources** (voir la fiche de veille).

---

## A. Conception et besoin

**1. Comment êtes-vous arrivé à votre modèle de données ? Pourquoi ces tables ?**
« Je suis parti des user stories. Trois entités s'imposaient : l'`Utilisateur` (l'envoyeur ou l'admin), le `Bénéficiaire` (le destinataire, avec son IBAN) et le `Transfert` (l'opération). Un utilisateur possède plusieurs bénéficiaires et effectue plusieurs transferts ; un transfert vise un bénéficiaire. J'ai gardé le modèle minimal : chaque table sert une user story. J'ai choisi `DECIMAL` pour les montants, des `ENUM` pour le statut et le rôle, et j'ai stocké le taux de change appliqué pour la traçabilité. »

**2. Pourquoi cette stack technique (React, NestJS, MySQL) ?**
« React côté client car c'est le standard, avec des composants réutilisables. NestJS côté serveur en TypeScript : ça m'a donné un seul langage sur toute la stack et une architecture en couches claire. MySQL pour des données structurées et reliées, avec Prisma comme ORM type-safe qui protège des injections SQL. Et MongoDB pour le journal des notifications, un cas typique de NoSQL. »

**3. Quelles règles d'accessibilité avez-vous appliquées ?**
« Des éléments HTML sémantiques, les labels associés aux champs, des contrastes suffisants, et la navigation au clavier. L'interface est aussi responsive, pensée mobile-first. »

**4. Comment l'application respecte-t-elle le RGPD ?**
« Trois points : le consentement explicite obligatoire à l'inscription, le droit à l'effacement — l'utilisateur peut supprimer son compte et toutes ses données —, et la minimisation : je ne collecte que le nécessaire. Les mots de passe sont hachés et les secrets ne sont jamais dans le dépôt. »

**5. Comment avez-vous recueilli et priorisé les besoins ?**
« J'ai reformulé le besoin en 14 user stories au format "En tant que… je veux… afin de…", puis je les ai priorisées avec la méthode MoSCoW : indispensable, souhaitable, optionnel, exclu. Ça m'a permis de développer d'abord le cœur (auth, bénéficiaires, transferts) avant les fonctionnalités secondaires. »

**6. Pourquoi avoir cadré un "hors-périmètre" ?**
« Parce que NORU est une simulation. Dire clairement ce que je ne fais pas — vrai paiement, vrai virement, conformité bancaire — évite de prétendre à des garanties que le projet ne tient pas, et concentre l'effort sur les compétences visées. »

## B. Base de données et architecture

**7. Pourquoi MongoDB en plus de MySQL ?**
« MySQL pour les données structurées et reliées — utilisateurs, bénéficiaires, transferts — où l'intégrité et les relations sont essentielles. MongoDB pour le journal des notifications : des données volumineuses, à format souple et non relationnelles. C'est le bon outil pour chaque type de donnée, et ça démontre la maîtrise du SQL et du NoSQL. »

**8. Qu'est-ce qu'un ORM et pourquoi Prisma ?**
« Un ORM fait le pont entre le code objet et la base relationnelle : au lieu d'écrire du SQL à la main, je manipule des objets. Prisma génère un client typé à partir de mon schéma, gère les migrations versionnées, et fait des requêtes paramétrées — ce qui protège nativement contre l'injection SQL. »

**9. Comment gérez-vous les migrations de base de données ?**
« Chaque évolution du schéma passe par une migration Prisma, versionnée dans le dépôt. Ça garde un historique clair et permet d'appliquer les mêmes changements sur chaque environnement de façon reproductible — y compris en production, au démarrage du conteneur. »

**10. Pourquoi avoir séparé le frontend et le backend ?**
« Pour une architecture découplée : le frontend React est une application autonome qui consomme l'API REST du backend. Ça sépare clairement les responsabilités, permet de faire évoluer chaque partie indépendamment, et de les héberger séparément (Vercel pour le front, Railway pour le back). »

**11. Décrivez votre architecture en couches.**
« Trois couches : la présentation (React), l'applicative et métier (API NestJS, organisée en contrôleurs → services), et l'accès aux données (Prisma pour MySQL, Mongoose pour MongoDB). Chaque couche a une responsabilité unique, ce qui rend l'application maintenable et testable. »

**12. Qu'est-ce que Docker vous a apporté ?**
« Docker me permet d'exécuter mes bases MySQL et MongoDB en conteneurs, à l'identique en local et en production. Une seule commande démarre tout l'environnement. Et en production, mon application est conteneurisée, ce qui garantit qu'elle tourne partout de la même façon. »

## C. Développement et sécurité

**13. Tracez le chemin d'une requête de création de transfert.**
« Le frontend envoie un `POST /api/transferts` avec le JWT. Le `JwtAuthGuard` vérifie le token, le `TransfertsController` délègue au `TransfertsService`, qui vérifie que le bénéficiaire appartient à l'utilisateur, calcule les frais et la conversion FCFA→EUR, génère une référence, et via Prisma insère le transfert au statut `EN_ATTENTE`. La réponse remonte au frontend. »

**14. Comment fonctionne votre authentification ? Que contient un JWT ?**
« À la connexion, je vérifie le mot de passe avec bcrypt, puis je génère un JWT. Un JWT a trois parties : `header.payload.signature`. Le payload contient l'id et le rôle, jamais le mot de passe. La signature est calculée avec une clé secrète : si le token est modifié, la signature ne correspond plus. Le client renvoie ce token à chaque requête, et le serveur le vérifie sans rappeler la base. »

**15. Comment un utilisateur ne peut-il voir que ses propres données ?**
« Chaque service vérifie l'appartenance : quand je cherche un bénéficiaire ou un transfert, je contrôle que son `utilisateur_id` correspond à l'utilisateur du JWT. Sinon je renvoie "introuvable". Un utilisateur ne peut donc jamais accéder aux données d'un autre. »

**16. Comment vous protégez-vous des injections SQL ? Et des XSS ?**
« Contre l'injection SQL : Prisma fait des requêtes paramétrées — je ne concatène jamais de chaîne utilisateur. Contre le XSS : React échappe par défaut tout ce qu'il affiche, et je ne force jamais d'insertion de HTML brut. Je valide aussi toutes les entrées côté serveur avec des DTO. »

**17. Comment stockez-vous les mots de passe ?**
« Jamais en clair. À l'inscription, je hache le mot de passe avec bcrypt, un algorithme conçu pour être lent et résistant aux attaques par force brute. En base, je ne stocke que cette empreinte. À la connexion, je compare l'empreinte, je ne "déchiffre" jamais le mot de passe. »

**18. Comment gérez-vous l'autorisation (les rôles) ?**
« J'ai deux rôles : USER et ADMIN. Les routes d'administration sont protégées par un `RolesGuard` et le décorateur `@Roles('ADMIN')` : si le rôle du JWT n'est pas ADMIN, l'accès est refusé avec une erreur 403. »

**19. Quelle stratégie pour gérer les erreurs côté frontend ?**
« J'ai centralisé les appels API dans un module unique. Quand l'API renvoie une erreur, je la remonte sous forme de message lisible pour l'utilisateur, plutôt que le code technique. Chaque page gère aussi ses états de chargement et d'erreur. »

**20. Comment fonctionne la conversion FCFA→EUR et le calcul des frais ?**
« J'applique un taux fixe — la parité du Franc CFA, 1 euro = 655,957 FCFA — et des frais de 2 % du montant. Ces calculs sont faits côté serveur dans le service de transfert, pour ne pas dépendre du client, et le taux appliqué est stocké dans le transfert pour la traçabilité. »

## D. Tests, CI/CD et déploiement

**21. Quels sont les 3 niveaux de tests dans votre projet ?**
« Les tests d'intégration, automatisés avec Jest et Supertest : ils lancent l'API et vérifient les parcours de bout en bout, cas nominaux et d'erreur. Les tests système : des scénarios manuels sur l'application déployée. Et les tests d'acceptation : au format Given-When-Then, à partir des user stories. »

**22. Comment garantissez-vous que du code cassé n'arrive pas en production ?**
« Ma branche `main` est protégée : impossible de pousser directement, il faut une Pull Request, et l'intégration continue doit être verte — lint plus tests — pour fusionner. Aucune modification non testée n'atteint la production. »

**23. Quelle est la différence entre intégration continue et déploiement continu ?**
« La CI vérifie automatiquement le code à chaque push : lint et tests. La CD va plus loin : une fois la CI verte sur main, elle construit les images Docker et déclenche la mise en ligne. En résumé : la CI vérifie, la CD livre. »

**24. Décrivez votre procédure de déploiement.**
« Je développe sur une branche, je fusionne dans develop, puis j'ouvre une Pull Request vers main. La CI doit être verte. Après fusion, la CD construit les images Docker et les publie sur GHCR ; Railway et Vercel redéploient automatiquement. Les migrations s'appliquent au démarrage. L'appli est à jour sur son URL publique. »

**25. Comment feriez-vous un rollback en cas de bug critique ?**
« Sur Railway, je sélectionne le dernier déploiement stable et je le redéploie ; sur Vercel, je promeus un déploiement antérieur. Comme chaque image Docker est taguée avec le SHA du commit, je peux aussi redéployer une version précise. Ça prend environ une minute. »

**26. Pourquoi vos credentials sont dans les secrets et pas dans le YAML ?**
« Parce qu'un fichier YAML est versionné dans le dépôt, qui est public. Y mettre un mot de passe, c'est le rendre visible de tous et impossible à changer sans réécrire l'historique. Les secrets sont dans des variables d'environnement, jamais versionnées. »

## E. Veille, posture et recul

**27. Sur quoi faites-vous de la veille technologique ?** *(à personnaliser)*
« Je fais de la veille sur trois domaines : la sécurité (OWASP, CERT-FR), l'écosystème JavaScript/TypeScript (React, NestJS, les releases de Node), et le DevOps (Docker, GitHub Actions). J'utilise un agrégateur de flux et je lis quelques minutes par jour. » *(Voir ma fiche de veille.)*

**28. Quelle est la dernière chose intéressante apprise par votre veille ?** *(à personnaliser)*
→ **Remplace par un vrai sujet que tu as réellement lu récemment** (voir la fiche de veille).

**29. Si vous deviez recommencer le projet, que feriez-vous différemment ?**
« Je mettrais l'envoi réel des emails dès le début plutôt qu'en simulation, et j'automatiserais aussi les tests système. Je documenterais le déploiement plus tôt, car j'ai perdu du temps sur des incidents de configuration que j'aurais pu anticiper. »

**30. Racontez-moi un bug ou un incident que vous avez résolu.**
« Au premier déploiement sur Railway, l'API renvoyait une erreur 502. Dans les logs, j'ai vu que le domaine pointait sur le port 8080 alors que mon application écoutait sur un autre port. J'ai corrigé avec la variable `PORT`, et l'API a répondu. J'ai eu deux autres incidents du même type — une connexion MongoDB invalide et un 404 au rafraîchissement — résolus en suivant à chaque fois détection, diagnostic, correction. »

---

## Stratégie pour une question dont tu ne connais pas la réponse

Ne bloque pas et ne bluffe pas. Sois honnête et montre ta méthode :

> « Je n'ai pas la réponse précise, mais voici comment je m'y prendrais : je commencerais par la documentation officielle, puis Stack Overflow, et je consulterais un collègue plus expérimenté si besoin. »

Cette posture est valorisée : elle prouve que tu sais exercer le métier sans tout savoir par cœur.
