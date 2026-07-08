# NORU — Les 20 questions du jury (préparation orale)

> Une réponse de 30 à 60 secondes par question. Lis-les à voix haute jusqu'à les intégrer.
> ⚠️ Les questions 17 et 18 (veille) sont à **personnaliser avec tes vraies sources** — voir la note.

---

## Sur la conception

**1. Comment êtes-vous arrivé à votre modèle de données ? Pourquoi ces tables ?**
« Je suis parti des user stories. Trois entités s'imposaient : l'`Utilisateur` (l'envoyeur ou l'admin), le `Bénéficiaire` (le destinataire, avec son IBAN) et le `Transfert` (l'opération). Un utilisateur possède plusieurs bénéficiaires et effectue plusieurs transferts ; un transfert vise un bénéficiaire. J'ai gardé le modèle minimal : chaque table sert une user story. J'ai choisi `DECIMAL` pour les montants (précision monétaire), des `ENUM` pour le statut et le rôle, et j'ai stocké le taux de change appliqué pour la traçabilité. »

**2. Pourquoi cette stack technique (React, NestJS, MySQL) ?**
« React côté client car c'est le standard, avec des composants réutilisables. NestJS côté serveur en TypeScript : ça m'a donné un seul langage sur toute la stack et une architecture en couches claire — contrôleurs, services, accès aux données. MySQL pour des données structurées et reliées, avec Prisma comme ORM type-safe qui protège des injections SQL. Et MongoDB pour le journal des notifications, un cas typique de NoSQL. »

**3. Quelles règles d'accessibilité avez-vous appliquées ?**
« Des éléments HTML sémantiques, les labels associés aux champs de formulaire, des contrastes suffisants, et la navigation possible au clavier. L'interface est aussi responsive, pensée mobile-first. »

**4. Comment l'application respecte-t-elle le RGPD ?**
« Trois points concrets : le consentement explicite obligatoire à l'inscription, le droit à l'effacement — l'utilisateur peut supprimer son compte et toutes ses données —, et la minimisation : je ne collecte que le nécessaire. Les mots de passe sont hachés et les secrets ne sont jamais dans le dépôt. »

## Sur le développement

**5. Tracez le chemin d'une requête de création de transfert, du clic au stockage.**
« Quand l'utilisateur valide, React envoie un `POST /api/transferts` avec le JWT dans le header `Authorization`. Côté backend, le `JwtAuthGuard` vérifie le token, puis le `TransfertsController` délègue au `TransfertsService`. Le service vérifie que le bénéficiaire appartient bien à l'utilisateur, calcule les frais et la conversion FCFA→EUR, génère une référence, et via Prisma insère le transfert au statut `EN_ATTENTE`. La réponse remonte au frontend qui l'affiche. »

**6. Comment fonctionne votre authentification ? Que contient un JWT ?**
« À la connexion, je vérifie le mot de passe avec bcrypt, puis je génère un JWT. Un JWT a trois parties séparées par des points : `header.payload.signature`. Le payload contient l'id et le rôle de l'utilisateur, jamais le mot de passe. La signature est calculée par mon serveur avec une clé secrète : si le token est modifié, la signature ne correspond plus. Le client renvoie ce token à chaque requête, et le serveur le vérifie sans rappeler la base. »

**7. Comment vous protégez-vous des injections SQL ? Et des XSS ?**
« Contre l'injection SQL : j'utilise l'ORM Prisma, qui fait des requêtes paramétrées — je ne concatène jamais de chaîne utilisateur dans une requête. Contre le XSS : React échappe par défaut tout ce qu'il affiche, et je ne force jamais d'insertion de HTML brut. Je valide aussi systématiquement les entrées côté serveur avec des DTO. »

**8. Quelle stratégie pour gérer les erreurs côté frontend ?**
« J'ai centralisé les appels API dans un module unique. Quand l'API renvoie une erreur, je la remonte sous forme de message lisible pour l'utilisateur — par exemple les messages de validation — plutôt que le code technique. Chaque page gère aussi ses états de chargement et d'erreur. »

## Sur les tests et la CI

**9. Quels sont les 3 niveaux de tests dans votre projet ?**
« Les tests d'intégration, automatisés avec Jest et Supertest : ils lancent l'API et vérifient les parcours de bout en bout, cas nominaux et d'erreur (200, 400, 401, 403). Les tests système : des scénarios manuels de bout en bout sur l'application déployée. Et les tests d'acceptation : au format Given-When-Then, à partir des user stories. »

**10. Comment garantissez-vous que du code cassé n'arrive pas en production ?**
« Ma branche `main` est protégée : impossible de pousser directement, il faut passer par une Pull Request, et l'intégration continue doit être verte — lint plus tests — pour pouvoir fusionner. Aucune modification non testée ne peut atteindre la production. »

**11. Quelle couverture de tests ? Pourquoi pas 100 % ?**
« Mes tests couvrent les endpoints principaux et les règles métier importantes. Je ne vise pas 100 % parce que ce n'est ni atteignable ni utile : tester du code trivial coûte du temps pour zéro valeur. Je concentre l'effort sur la logique métier et la sécurité. »

**12. Montrez un test d'acceptation et expliquez ce qu'il vérifie.**
« Par exemple : *étant donné* un utilisateur connecté avec un bénéficiaire, *quand* il crée un transfert de 100 000 FCFA, *alors* le transfert apparaît avec le montant converti — 152,45 € — au statut `EN_ATTENTE`. Ça décrit ce que le client constate, sans parler de technique. »

## Sur le déploiement

**13. Quelle est la différence entre intégration continue et déploiement continu ?**
« L'intégration continue (CI) vérifie automatiquement le code à chaque push : lint et tests. Le déploiement continu (CD) va plus loin : une fois la CI verte sur `main`, il construit les images Docker et déclenche la mise en ligne. En résumé : la CI vérifie, la CD livre. »

**14. Décrivez votre procédure de déploiement étape par étape.**
« Je développe sur une branche, je fusionne dans `develop`, puis j'ouvre une Pull Request vers `main`. La CI doit être verte. Après fusion, la CD construit les images Docker et les publie sur GHCR ; Railway (backend + bases) et Vercel (frontend) redéploient automatiquement. Les migrations Prisma s'appliquent au démarrage. L'application est à jour sur son URL publique. »

**15. Comment feriez-vous un rollback en cas de bug critique ?**
« Sur Railway, je sélectionne le dernier déploiement stable et je le redéploie ; sur Vercel, je promeus un déploiement antérieur. Comme chaque image Docker est taguée avec le SHA du commit, je peux aussi redéployer une version précise. Ça prend environ une minute. »

**16. Pourquoi vos credentials sont dans les secrets et pas dans le YAML ?**
« Parce qu'un fichier YAML est versionné dans le dépôt, qui est public. Y mettre un mot de passe ou une clé, c'est le rendre visible de tous et impossible à changer sans réécrire l'historique. Les secrets sont donc dans des variables d'environnement, jamais versionnées. »

## Sur la veille et la posture

**17. Sur quoi faites-vous de la veille technologique ?** *(à personnaliser)*
« Je fais de la veille sur trois domaines : la sécurité (OWASP, CERT-FR), l'écosystème JavaScript/TypeScript (React, NestJS, les releases de Node), et le DevOps (Docker, GitHub Actions). J'utilise un agrégateur de flux et je lis quelques minutes par jour. »

**18. Quelle est la dernière chose intéressante apprise par votre veille ?** *(à personnaliser)*
« Par exemple, les évolutions récentes de Prisma sur la gestion des migrations ; ou une faille XSS courante et sa parade. » → **Remplace par un vrai sujet que tu as réellement lu récemment.**

**19. Si vous deviez recommencer le projet, que feriez-vous différemment ?**
« Je mettrais l'envoi réel des emails dès le début plutôt qu'en simulation, et j'automatiserais aussi les tests système. Je documenterais le déploiement plus tôt, car j'ai perdu du temps sur des incidents de configuration que j'aurais pu anticiper. »

**20. Racontez-moi un bug ou un incident que vous avez résolu.**
« Au premier déploiement sur Railway, l'API renvoyait une erreur 502 "Application failed to respond". Dans les logs, j'ai vu que le domaine pointait sur le port 8080 alors que mon application écoutait sur un autre port. J'ai corrigé en définissant la variable `PORT` à 8080, et l'API a répondu. J'ai eu deux autres incidents du même type — une connexion MongoDB invalide et un 404 au rafraîchissement — résolus à chaque fois en suivant détection, diagnostic, correction. »

---

## Stratégie pour une question dont tu ne connais pas la réponse

Ne bloque pas et ne bluffe pas. Dis-le honnêtement et montre ta méthode :

> « Je n'ai pas la réponse précise, mais voici comment je m'y prendrais : je commencerais par la documentation officielle, puis Stack Overflow, et je consulterais un collègue plus expérimenté si besoin. »

Cette posture est **valorisée** : elle prouve que tu sais exercer le métier sans tout savoir par cœur.

---

## Note sur la veille (questions 17-18)

Le jury sait reconnaître une **vraie** veille d'une veille inventée. Si tu n'en fais pas encore : commence **maintenant**. Abonne-toi à un agrégateur (Feedly), suis 5 sources (par ex. **CERT-FR**, **OWASP Blog**, **React Blog**, **Node.js releases**, **GitHub Actions Changelog**), lis 15 min/jour pendant deux semaines, et note **2 sujets qui t'ont marqué**. Tu pourras alors répondre aux questions 17-18 avec du vrai vécu.
