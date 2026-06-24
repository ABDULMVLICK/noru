# NORU — User Stories & Cadrage

> Projet final CDA (Concepteur Développeur d'Applications). Application web de **simulation** de transfert d'argent du Bénin vers la France.

---

## 1. Cadrage du projet

**En une phrase :** NORU est une application web simulée permettant à une personne au **Bénin** d'envoyer de l'argent à un proche en **France** via un faux paiement mobile money, le receveur étant prévenu par email.

> ⚠️ NORU est une **simulation pédagogique** (faux paiement, faux virement). Aucun flux financier réel. Cela exclut volontairement la conformité bancaire réelle (PCI-DSS, KYC) tout en implémentant toute la mécanique applicative.

### Acteurs (personas)

| Acteur | Description | Rôle |
|---|---|---|
| **Koffi** — l'envoyeur | Réside au Bénin, possède un compte NORU | Inscription, gestion des bénéficiaires, création et suivi des transferts, faux paiement |
| **Awa** — la receveuse | Réside en France, **sans compte** | Reçoit un email de notification lorsqu'un transfert lui est destiné |
| **Admin** | Équipe NORU | Supervise tous les transferts et utilisateurs, change les statuts, consulte les statistiques |

### Cycle de vie d'un transfert (concept central)

```
EN_ATTENTE  →  PAYÉ  →  ENVOYÉ  →  REÇU
 (créé)    (faux paiement) (traité) (receveur notifié)
                              └──►  ÉCHEC (cas d'erreur)
```

### Bases de données (exigence : SQL ET NoSQL)

- **MySQL** (relationnel) : `Utilisateur`, `Bénéficiaire`, `Transfert` — données structurées et reliées.
- **MongoDB** (NoSQL) : `Notification` — journal des emails/messages envoyés (volume élevé, format souple, non relationnel).

---

## 2. User Stories

Format : **« En tant que `<rôle>`, je veux `<action>` afin de `<bénéfice>` ».**
Priorité = ordre de développement. Complexité = estimation d'effort.

| ID | En tant que… | je veux… | afin de… | Priorité | Complexité |
|---|---|---|---|---|---|
| US-01 | visiteur | créer un compte (email + mot de passe) | accéder à NORU | Haute | Faible |
| US-02 | utilisateur | me connecter | accéder à mon espace sécurisé | Haute | Faible |
| US-03 | envoyeur | enregistrer un bénéficiaire (nom, email, IBAN) | ne pas resaisir ses infos à chaque envoi | Haute | Moyenne |
| US-04 | envoyeur | voir / modifier / supprimer mes bénéficiaires | garder ma liste à jour | Moyenne | Faible |
| US-05 | envoyeur | créer un transfert (bénéficiaire + montant en FCFA) | envoyer de l'argent en France | Haute | Forte |
| US-06 | envoyeur | voir le montant en € + les frais avant de valider | savoir ce que le receveur recevra | Haute | Moyenne |
| US-07 | envoyeur | effectuer un (faux) paiement mobile money | financer mon transfert | Haute | Moyenne |
| US-08 | envoyeur | consulter la liste de mes transferts + statuts | suivre mes envois | Haute | Faible |
| US-09 | envoyeur | voir le détail d'un transfert | vérifier les informations | Moyenne | Faible |
| US-10 | receveur | recevoir un email quand un transfert m'est destiné | être prévenu que de l'argent arrive | Haute | Moyenne |
| US-11 | utilisateur | supprimer mon compte et mes données | exercer mon droit à l'effacement (RGPD) | Moyenne | Moyenne |
| US-12 | admin | consulter tous les transferts et utilisateurs | superviser l'activité | Haute | Moyenne |
| US-13 | admin | changer le statut d'un transfert | gérer le cycle de vie | Haute | Moyenne |
| US-14 | admin | consulter des statistiques (volume total, nb transferts) | avoir une vue d'ensemble | Moyenne | Moyenne |

### Besoins implicites intégrés (non demandés par le client, exigés par la qualité/certif)

- **Sécurité** : mots de passe hashés (bcrypt), authentification JWT, validation systématique des entrées.
- **RGPD** : données personnelles (email, IBAN) → politique de confidentialité + droit à l'effacement (US-11).
- **Responsive** : utilisable sur mobile et desktop.
- **Accessibilité** : contrastes, navigation clavier, labels.
