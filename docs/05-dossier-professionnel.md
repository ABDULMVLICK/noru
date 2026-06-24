# Dossier Professionnel (DP) — Brouillon de travail

> Document de travail qui sera reporté dans le template officiel `.docx` du Ministère.
> ⚠️ Avant de signer la déclaration sur l'honneur : vérifier que CHAQUE phrase est vraie au moment de la remise (les exemples des activités 1 et 3 décrivent du travail à finaliser pendant le développement).

## Identité (à compléter — remplacer l'identité « SMAIL Manel » du fichier)

- Nom de naissance : _________
- Nom d'usage : _________
- Prénom : _________
- Adresse : _________
- Titre professionnel visé : **Concepteur Développeur d'Applications (CDA)**
- Modalité d'accès : ☑ Parcours de formation

---

# Activité-type 2 — Concevoir et développer une application sécurisée organisée en couches

## Exemple n° 1 : Analyse des besoins et conception de l'architecture logicielle de l'application NORU

**1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :**

Dans le cadre de mon projet de certification, j'ai conçu NORU, une application web de simulation de transfert d'argent du Bénin vers la France. J'ai d'abord analysé le besoin : j'ai formalisé les attentes sous forme de 14 user stories priorisées (méthode MoSCoW), puis rédigé un cahier des charges définissant le périmètre fonctionnel, le périmètre technique et un hors-périmètre explicite (le paiement et le virement bancaire étant simulés).

J'ai ensuite réalisé les maquettes de l'application : d'abord des wireframes basse fidélité pour valider la structure et le parcours utilisateur, puis des maquettes haute fidélité en définissant une charte graphique (palette de couleurs, typographie, composants réutilisables et leurs états). J'ai intégré dès la conception les exigences réglementaires : l'accessibilité (référentiel RGAA / WCAG : contrastes suffisants, navigation au clavier, labels) et le RGPD (page de politique de confidentialité, consentement à l'inscription, droit à l'effacement du compte), ces données étant des données personnelles sensibles (email, IBAN).

J'ai défini l'architecture logicielle multicouche répartie de l'application : une couche présentation (React), une couche applicative et métier (API NestJS organisée en modules, contrôleurs et services), une couche d'accès aux données (ORM Prisma) et la base de données relationnelle (MySQL), complétée par une base NoSQL (MongoDB) dédiée au journal des notifications. J'ai défini le rôle de chaque couche en tenant compte de la stratégie de sécurité (authentification, validation, séparation des responsabilités).

J'ai formalisé cette architecture par sept diagrammes UML (cas d'utilisation, classes, séquence, états-transitions, activité, déploiement, composants) et consigné l'ensemble dans un dossier de conception structuré. J'ai mené ce travail en autonomie, en amont de tout développement, selon une démarche itérative.

**2. Précisez les moyens utilisés :**

Figma (wireframes, maquettes et charte graphique) ; PlantUML et dbdiagram.io (diagrammes UML, MCD/MLD) ; Visual Studio Code ; Git et GitHub pour le versionnement de la conception. Référentiels appliqués : recommandations de l'ANSSI (sécurité), RGAA (accessibilité), guides de la CNIL (RGPD). Méthode de priorisation MoSCoW.

**3. Avec qui avez-vous travaillé ?**

J'ai travaillé en autonomie, sous le suivi d'un formateur référent de l'École Multimédia. J'ai recueilli des retours d'utilisateurs-tests (mon entourage) sur les maquettes afin d'ajuster l'ergonomie et la navigation.

**4. Contexte**
- Nom de l'entreprise, organisme ou association : École Multimédia
- Chantier, atelier, service : Projet fil rouge de certification (CDA)
- Période d'exercice : du ________ au ________

**5. Informations complémentaires (facultatif) :** Code et documents de conception versionnés sur GitHub : ________

---

## Exemple n° 2 : Conception de la base de données et développement des accès aux données (SQL et NoSQL)

**1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :**

À partir des besoins exprimés dans le cahier des charges, j'ai conçu le modèle conceptuel de données (MCD) en formalisme entité-association, avec trois entités principales (Utilisateur, Bénéficiaire, Transfert) et leurs cardinalités. Je l'ai traduit en modèle logique (MLD) en précisant les types SQL et les contraintes d'intégrité : clés primaires, clés étrangères, NOT NULL, UNIQUE, contraintes CHECK et valeurs par défaut. J'ai justifié mes choix : le type DECIMAL pour les montants (précision exacte sur de la monnaie), des types ENUM pour contraindre les valeurs du rôle utilisateur et du statut de transfert, et le stockage du taux de change appliqué pour assurer la traçabilité.

J'ai mis en place la base de données relationnelle MySQL via l'ORM Prisma (définition du schéma et migrations versionnées), et défini les utilisateurs et leurs droits d'accès (rôles USER et ADMIN) en respectant les règles de sécurité et de confidentialité. J'ai développé les traitements d'accès aux données en consultation, création, modification et suppression de façon sécurisée : requêtes paramétrées par l'ORM (protection contre l'injection SQL), validation systématique des entrées côté serveur, et gestion des cas d'exception.

Pour le journal des notifications envoyées aux receveurs, j'ai mis en place une base NoSQL MongoDB, plus adaptée à des données volumineuses, à format souple et non relationnelles. J'ai constitué un jeu d'essai dans une base de test et prévu une procédure de sauvegarde et de restauration.

**2. Précisez les moyens utilisés :**

ORM Prisma (schéma, migrations, requêtes), MySQL, MongoDB, NestJS, PlantUML et dbdiagram.io (MCD/MLD), ESLint pour la qualité du code. Bonnes pratiques de sécurisation des accès aux données issues de l'OWASP et des recommandations ANSSI.

**3. Avec qui avez-vous travaillé ?**

En autonomie, sous le suivi d'un formateur référent de l'École Multimédia.

**4. Contexte**
- Nom de l'entreprise, organisme ou association : École Multimédia
- Chantier, atelier, service : Projet fil rouge de certification (CDA)
- Période d'exercice : du ________ au ________

**5. Informations complémentaires (facultatif) :** Schéma Prisma et migrations versionnés sur GitHub : ________

---

# Activité-type 1 — Développer une application sécurisée
> À rédiger au fur et à mesure du développement (Phase 3).

## Exemple n° 1 : Développement des interfaces utilisateur React de NORU *(compétence C2)*
- Portée : développement des écrans (connexion, inscription, tableau de bord des transferts, formulaire de saisie, espace bénéficiaires, espace admin), consommation de l'API REST, responsive (mobile/tablette/desktop), accessibilité, gestion des états de chargement et d'erreur, sécurité côté client (rendu React par défaut anti-XSS). *(à compléter)*

## Exemple n° 2 : Composants métier, authentification JWT et gestion de projet *(compétences C1, C3, C4)*
- Portée : mise en place de l'environnement (Git, Docker, conventions de commits), développement des composants métier serveur (logique de transfert, conversion FCFA→EUR, calcul des frais), authentification sécurisée par JWT et hachage des mots de passe (bcrypt), planification et suivi des tâches. *(à compléter)*

---

# Activité-type 3 — Préparer le déploiement d'une application sécurisée
> À rédiger après les phases tests et déploiement (Phases 4 et 5).

## Exemple n° 1 : Élaboration et exécution du plan de tests *(compétence C9)*
- Portée : plan de tests (OPTP), tests d'intégration des endpoints, tests système, tests d'acceptation, outils de qualité de code, couverture. *(à compléter)*

## Exemple n° 2 : Mise en production dans une démarche DevOps *(compétences C10, C11)*
- Portée : intégration continue (GitHub Actions), conteneurisation Docker, déploiement continu vers le registre GHCR, déploiement sur VPS, procédure de rollback. *(à compléter)*

---

# Déclaration sur l'honneur

Je soussigné(e) ________________ , déclare sur l'honneur que les renseignements fournis dans ce dossier sont exacts et que je suis l'auteur(e) des réalisations jointes.

Fait à ________________ le ________________ , pour faire valoir ce que de droit.

Signature :
