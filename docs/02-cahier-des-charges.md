# NORU — Cahier des charges

> Document contractuel décrivant ce qui sera livré. Projet final CDA.
> Version 1.0 — Auteur : Abdulmalick Seibou.

---

## 1. Contexte et objectifs

**Contexte.** De nombreux Béninois souhaitent envoyer de l'argent à des proches en France (étudiants, prestataires, famille). Les solutions existantes (Wave, Wari, WorldRemit…) sont parfois perçues comme complexes. NORU propose une **maquette fonctionnelle simplifiée** d'un service de transfert d'argent, à but pédagogique.

**Objectif.** Concevoir et développer une application web sécurisée, en architecture multicouche, qui permet :
- à un **envoyeur** (Bénin) d'envoyer de l'argent à un **bénéficiaire** (France) via un faux paiement mobile money ;
- au **receveur** d'être notifié par email ;
- à un **admin** de superviser l'activité.

NORU est une **simulation** : aucun flux financier réel n'est traité.

---

## 2. Périmètre fonctionnel

Les fonctionnalités sont décrites en détail dans le document [01-user-stories.md](01-user-stories.md). Regroupées par grandes fonctionnalités :

- **F1 — Authentification & compte** : inscription, connexion (JWT), suppression de compte RGPD. *(US-01, US-02, US-11)*
- **F2 — Bénéficiaires** : CRUD des bénéficiaires (nom, email, IBAN). *(US-03, US-04)*
- **F3 — Transferts** : création d'un transfert, conversion FCFA→EUR + frais, faux paiement mobile money, suivi (liste + détail + statut). *(US-05 à US-09)*
- **F4 — Notification** : envoi d'un email au receveur. *(US-10)*
- **F5 — Administration** : supervision des transferts/utilisateurs, changement de statut, statistiques. *(US-12 à US-14)*

---

## 3. Périmètre technique

### Stack imposée
| Couche | Technologie |
|---|---|
| Frontend | React (TypeScript) |
| Backend | NestJS (TypeScript), API REST |
| ORM + BDD relationnelle | Prisma + MySQL |
| BDD NoSQL | MongoDB (journal des notifications) |
| Authentification | JWT maison (bcrypt + passport-jwt) |
| Email | Service mailer (ex. Nodemailer / Mailtrap en test) |
| Conteneurs | Docker / docker-compose |
| Tests | Jest (back) |
| Qualité | ESLint + TypeScript strict |
| CI/CD | GitHub Actions → GHCR |
| Déploiement | VPS (URL publique réelle) |

### Contraintes & exigences non-fonctionnelles
- **Sécurité** : mots de passe hashés (bcrypt), JWT en header `Authorization`, validation de toutes les entrées, protection contre injection SQL (Prisma paramétré) et XSS (rendu React par défaut), aucun secret en clair dans le dépôt.
- **RGPD** : politique de confidentialité, consentement à l'inscription, droit à l'effacement.
- **Responsive** : mobile (375px), tablette (768px), desktop (1280px).
- **Accessibilité** : contrastes ≥ 4.5:1, navigation clavier, labels associés (objectif Lighthouse ≥ 90).
- **Performance** : requêtes BDD optimisées (pas de N+1).

---

## 4. Hors-périmètre

Ce qui ne sera **explicitement pas** réalisé :
- Vrai paiement / vraie passerelle bancaire (mobile money, carte) → **simulé**.
- Vrai virement vers l'IBAN du receveur → **simulé** (notification uniquement).
- Conformité bancaire réelle : PCI-DSS, KYC, lutte anti-blanchiment.
- Application mobile native (le web responsive en tient lieu).
- Multi-devises (uniquement XOF → EUR).
- Messagerie / chat temps réel.
- Compte pour le receveur (il reçoit seulement un email).

---

## 5. Livrables

- Code source versionné sur **GitHub** (back + front).
- Application déployée sur une **URL publique**.
- **Dossier de conception** (maquettes, MCD/MLD, UML, architecture).
- **OPTP** (plan de tests).
- **Journal de développement**.
- **Manuel d'utilisation**.
- **Fiche de veille technologique**.
- **Dossier Professionnel** (template officiel).
- **Support de présentation** (slides).

---

## 6. Planning indicatif

| Phase | Contenu | Durée indicative |
|---|---|---|
| 1 — Analyse du besoin | User stories, cahier des charges | ✅ en cours |
| 2 — Conception | Maquettes, MCD/MLD, UML, architecture, dossier de conception | 2 semaines |
| 3 — Développement | Setup, backend NestJS, frontend React, sécurité | 5 à 7 semaines |
| 4 — Tests & qualité | Tests intégration/système/acceptation, OPTP, qualité code | en parallèle |
| 5 — Déploiement | CI/CD, VPS, rollback | 2 semaines |
| 6 — Documentation | Journal, manuel, veille | étalée |
| 7 — Soutenance | Slides, démo, préparation oral | 1 semaine |
