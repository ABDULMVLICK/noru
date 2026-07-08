% NORU — Dossier de conception
% SEIBOU Abdou Malick — École Multimédia
% Titre Professionnel Concepteur Développeur d'Applications — 2026

---

# 1. Contexte et objectifs

## 1.1 Présentation du projet

NORU est une application web de **simulation** de transfert d'argent du Bénin vers la France. Elle permet à un envoyeur de créer un compte, d'enregistrer des bénéficiaires, de créer un transfert d'un montant en FCFA converti en euros, d'effectuer un faux paiement mobile money, le receveur étant notifié par email. Un espace administrateur permet de superviser l'activité.

> **NORU est une simulation pédagogique** : aucun flux financier réel n'est traité (faux paiement, faux virement). Ce cadrage écarte volontairement la conformité bancaire réelle (PCI-DSS, KYC) tout en implémentant l'intégralité de la mécanique applicative.

## 1.2 Personas

| Persona | Rôle | Description |
|---|---|---|
| **Koffi, 28 ans** | Envoyeur (USER) | Vit au Bénin. Veut envoyer de l'argent à sa famille en France, simplement. Crée un compte, enregistre ses bénéficiaires, suit ses transferts. |
| **Awa** | Receveur (sans compte) | Vit en France. Reçoit un email de notification lorsqu'un transfert lui est destiné. |
| **Admin** | Administrateur (ADMIN) | Supervise les transferts, change leur statut, gère les utilisateurs, consulte les statistiques. |

## 1.3 Objectifs

- **Simplicité** : un parcours d'envoi en quelques clics.
- **Sécurité** : authentification JWT, mots de passe hachés, validation, RGPD.
- **Fiabilité** : tests automatisés et intégration continue.
- **Mise en ligne** : une URL publique réelle, déployée en continu.

---

# 2. Cahier des charges et user stories

## 2.1 Périmètre fonctionnel

- **F1 — Authentification & compte** : inscription, connexion (JWT), suppression de compte (RGPD).
- **F2 — Bénéficiaires** : CRUD des bénéficiaires (nom, email, IBAN).
- **F3 — Transferts** : création (conversion FCFA→EUR + frais), faux paiement, suivi (liste + détail + statut).
- **F4 — Notification** : email au receveur.
- **F5 — Administration** : supervision, changement de statut, CRUD utilisateurs et transferts, statistiques.

## 2.2 User stories (extrait)

| ID | En tant que… | je veux… | Priorité |
|---|---|---|---|
| US-01 | visiteur | créer un compte | Haute |
| US-02 | utilisateur | me connecter | Haute |
| US-03 | envoyeur | enregistrer un bénéficiaire | Haute |
| US-05 | envoyeur | créer un transfert (montant FCFA) | Haute |
| US-06 | envoyeur | voir le montant en € et les frais | Haute |
| US-10 | receveur | recevoir un email de notification | Haute |
| US-12 | admin | consulter tous les transferts | Haute |

*(14 user stories priorisées selon la méthode MoSCoW — liste complète en annexe.)*

## 2.3 Hors-périmètre

Vrai paiement / passerelle bancaire (simulé), vrai virement vers l'IBAN (simulé), conformité bancaire réelle, application mobile native, multi-devises, compte pour le receveur.

---

# 3. Maquettes

La conception des interfaces a suivi une démarche en deux temps : des **wireframes basse fidélité** pour valider la structure et le parcours, puis des **maquettes haute fidélité** appliquant la charte graphique (palette verte « confiance », typographie, composants réutilisables et leurs états), en approche **mobile-first** et en tenant compte de l'accessibilité (RGAA) et du RGPD.

*(Wireframes et maquettes en annexe. L'interface réalisée est consultable en ligne : https://noru-two.vercel.app)*

---

# 4. Modèle de données

## 4.1 MCD — Modèle Conceptuel de Données

![MCD de NORU](diagrams/img/0-mcd.png)

Trois entités principales et leurs cardinalités :

- un **Utilisateur** possède **0..n** Bénéficiaires ; un Bénéficiaire appartient à **1** Utilisateur ;
- un **Utilisateur** effectue **0..n** Transferts ; un Transfert a **1** envoyeur ;
- un **Bénéficiaire** reçoit **0..n** Transferts ; un Transfert vise **1** Bénéficiaire.

## 4.2 MLD — Modèle Logique de Données

**Table `utilisateur`**

| Colonne | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| email | VARCHAR(180) | NOT NULL, UNIQUE |
| mot_de_passe | VARCHAR(255) | NOT NULL (hash bcrypt) |
| nom | VARCHAR(100) | NOT NULL |
| role | ENUM('USER','ADMIN') | défaut 'USER' |
| rgpd_accepte | BOOLEAN | défaut false |
| date_creation | DATETIME | défaut now() |

**Table `beneficiaire`**

| Colonne | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| nom_complet | VARCHAR(150) | NOT NULL |
| email | VARCHAR(180) | NOT NULL |
| iban | VARCHAR(34) | NOT NULL |
| utilisateur_id | INT | FK → utilisateur(id), ON DELETE CASCADE |
| date_creation | DATETIME | défaut now() |

**Table `transfert`**

| Colonne | Type | Contraintes |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| montant_fcfa | DECIMAL(12,2) | NOT NULL, CHECK > 0 |
| montant_eur | DECIMAL(12,2) | NOT NULL |
| frais_fcfa | DECIMAL(12,2) | défaut 0 |
| taux_change | DECIMAL(10,6) | NOT NULL |
| statut | ENUM(5 valeurs) | défaut 'EN_ATTENTE' |
| reference | VARCHAR(30) | NOT NULL, UNIQUE |
| utilisateur_id | INT | FK → utilisateur(id) |
| beneficiaire_id | INT | FK → beneficiaire(id) |
| date_creation | DATETIME | défaut now() |

## 4.3 Justification des choix

- **DECIMAL et non FLOAT** pour les montants : précision exacte, pas d'arrondi flottant sur de la monnaie.
- **ENUM** pour `role` et `statut` : contraint les valeurs valides au niveau base.
- **taux_change stocké** dans le transfert : traçabilité (le taux varie dans le temps).
- **ON DELETE CASCADE** sur les bénéficiaires : respect du droit à l'effacement (RGPD).

## 4.4 Base NoSQL (MongoDB)

Une collection **`notifications`** (MongoDB) enregistre le journal des notifications envoyées aux receveurs (type, destinataire, sujet, contenu, référence du transfert, statut d'envoi, date). Ce choix NoSQL se justifie par des données volumineuses, à format souple et non relationnelles. Le MPD est l'implémentation de ces modèles dans MySQL 8 (relationnel) et MongoDB (documents).

---

# 5. Diagrammes UML

## 5.1 Diagramme de cas d'utilisation

![Cas d'utilisation](diagrams/img/1-cas-utilisation.png)

Quatre acteurs (Visiteur, Envoyeur, Admin, Receveur). L'Envoyeur est un Visiteur connecté. « Créer un transfert » inclut le paiement ; « Changer le statut » inclut l'envoi de la notification.

## 5.2 Diagramme d'états-transitions (cycle de vie du transfert)

![États-transitions](diagrams/img/2-etats-transfert.png)

Le transfert passe de `EN_ATTENTE` à `PAYE`, `ENVOYE` puis `RECU`, avec une branche `ECHEC`. Ce diagramme se traduit directement par le champ `statut` (ENUM) de la table `transfert`.

## 5.3 Diagramme de classes

![Diagramme de classes](diagrams/img/3-classes.png)

Trois couches : entités (Utilisateur, Beneficiaire, Transfert), services (logique métier), contrôleurs (API REST). Sens des dépendances : Contrôleur → Service → Prisma → BDD.

## 5.4 Diagrammes de séquence

**Connexion (génération du JWT)**

![Séquence — connexion](diagrams/img/4-sequence-connexion.png)

**Création d'un transfert**

![Séquence — transfert](diagrams/img/4-sequence-transfert.png)

## 5.5 Diagramme d'activité (inscription)

![Activité — inscription](diagrams/img/5-activite-inscription.png)

Le processus d'inscription avec ses branches de décision : validation des données, consentement RGPD obligatoire, unicité de l'email, puis hachage du mot de passe, création et connexion.

## 5.6 Diagramme de déploiement

![Déploiement](diagrams/img/6-deploiement.png)

## 5.7 Diagramme de composants

![Composants](diagrams/img/7-composants.png)

---

# 6. Architecture logicielle

NORU suit une **architecture client-serveur découplée**, multicouche :

- **Couche présentation** : application React (SPA), hébergée sur Vercel.
- **Couche applicative et métier** : API REST NestJS (contrôleurs → services), hébergée sur Railway.
- **Couche d'accès aux données** : ORM Prisma (MySQL) et Mongoose (MongoDB).

Le frontend consomme l'API REST sans état (authentification par JWT). Chaque couche a une responsabilité claire, ce qui rend l'application maintenable et testable.

## Justification des choix techniques

- **React** : standard du marché, composants réutilisables, large écosystème.
- **NestJS** : framework Node.js en TypeScript imposant une architecture en couches claire, et un seul langage (TypeScript) sur toute la stack.
- **MySQL + Prisma** : données structurées et reliées ; Prisma est un ORM type-safe qui protège de l'injection SQL et gère les migrations versionnées.
- **MongoDB + Mongoose** : journal des notifications (données non relationnelles).
- **Docker** : environnement identique en local et en production.
- **Railway + Vercel** : déploiement automatique depuis GitHub.

---

# 7. Conformité réglementaire

## 7.1 RGPD

- **Consentement** explicite à l'inscription (case à cocher obligatoire).
- **Droit à l'effacement** : l'utilisateur peut supprimer son compte et ses données.
- **Minimisation** : seules les données nécessaires sont collectées (email, nom, IBAN du bénéficiaire).
- **Sécurité des données** : mots de passe hachés, secrets hors du dépôt.

> **Notification par email** : le système enregistre chaque notification dans la base MongoDB et prépare le message ; l'**envoi réel via un service SMTP est une évolution prévue** (actuellement simulé, cohérent avec la nature de simulation du projet).

## 7.2 Accessibilité (RGAA)

Éléments HTML sémantiques, libellés associés aux champs, contrastes suffisants, navigation au clavier, approche mobile-first.

---

# 8. Sécurité (synthèse)

- **Contrôle d'accès** : JWT + rôles (`@Roles('ADMIN')`) + contrôle d'appartenance (chaque utilisateur n'accède qu'à ses données).
- **Cryptographie** : mots de passe hachés (bcrypt), secrets en variables d'environnement.
- **Injection SQL** : requêtes paramétrées via Prisma.
- **XSS** : échappement par défaut de React.
- **Validation** : toutes les entrées validées côté serveur (DTO).

---

# 9. Annexes

- Sources des diagrammes (PlantUML) : dossier `docs/diagrams/`.
- Liste complète des 14 user stories : `docs/01-user-stories.md`.
- Cahier des charges détaillé : `docs/02-cahier-des-charges.md`.
- Code source : https://github.com/ABDULMVLICK/noru
- Application en ligne : https://noru-two.vercel.app
