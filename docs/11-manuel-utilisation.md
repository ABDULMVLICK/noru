# NORU — Manuel d'utilisation

**Application de transfert d'argent Bénin → France (simulation)**
Version 1.0 — Juillet 2026

> Les emplacements *[Capture d'écran]* sont à remplacer par tes propres captures d'écran de l'application.

---

## 1. Introduction

### À quoi sert NORU ?

NORU est une application web qui permet d'envoyer de l'argent depuis le Bénin vers la France, simplement et rapidement. Vous saisissez un montant en Francs CFA (FCFA), l'application le convertit automatiquement en euros (EUR), et l'argent est destiné à un bénéficiaire enregistré au préalable.

> ⚠️ **NORU est une application de démonstration.** Aucun paiement ni virement réel n'est effectué. Elle a été conçue dans le cadre d'un projet de certification.

### Pour qui ?

- **L'expéditeur** (utilisateur standard) : une personne au Bénin qui souhaite envoyer de l'argent à un proche en France.
- **L'administrateur** : la personne qui supervise l'ensemble des transferts et des utilisateurs.

### Ce dont vous avez besoin

- Un ordinateur ou un téléphone avec un navigateur web (Chrome, Firefox, Safari…).
- Une connexion Internet.
- Une adresse email.

L'application est accessible à l'adresse : **https://noru-two.vercel.app**

---

## 2. Créer un compte

1. Sur la page d'accueil, cliquez sur **« Créer un compte »**.
2. Renseignez votre **nom**, votre **email** et un **mot de passe** (au moins 8 caractères).
3. Cochez la case de **consentement RGPD** pour accepter le traitement de vos données.
4. Cliquez sur **« S'inscrire »**.

Vous êtes automatiquement connecté et redirigé vers votre tableau de bord.

*[Capture d'écran : page d'inscription]*

---

## 3. Se connecter

1. Sur la page d'accueil, cliquez sur **« Se connecter »**.
2. Saisissez votre **email** et votre **mot de passe**.
3. Cliquez sur **« Connexion »**.

En cas d'erreur (mauvais email ou mot de passe), un message vous en informe. Recommencez avec les bons identifiants.

*[Capture d'écran : page de connexion]*

---

## 4. Ajouter un bénéficiaire

Avant d'envoyer de l'argent, vous devez enregistrer la personne qui va le recevoir.

1. Dans le menu, cliquez sur **« Bénéficiaires »**.
2. Cliquez sur **« Ajouter un bénéficiaire »**.
3. Renseignez :
   - Le **nom complet** du bénéficiaire.
   - Son **email**.
   - Son **IBAN** (le numéro de compte bancaire français).
4. Cliquez sur **« Enregistrer »**.

Le bénéficiaire apparaît alors dans votre liste. Vous pouvez le **modifier** ou le **supprimer** à tout moment.

*[Capture d'écran : liste des bénéficiaires]*

---

## 5. Effectuer un transfert

1. Dans le menu, cliquez sur **« Nouveau transfert »**.
2. Choisissez le **bénéficiaire** dans la liste.
3. Saisissez le **montant en FCFA** que vous souhaitez envoyer.
4. L'application affiche instantanément :
   - Les **frais** (2 % du montant).
   - Le **montant converti en euros** que recevra le bénéficiaire.
5. Vérifiez le récapitulatif, puis cliquez sur **« Confirmer le transfert »**.

Le transfert est créé avec le statut **« En attente »**.

*[Capture d'écran : formulaire de nouveau transfert avec aperçu de la conversion]*

> **Comment est calculé le montant ?** L'application utilise le taux fixe officiel du Franc CFA : **1 € = 655,957 FCFA**. Elle retire d'abord les frais de 2 %, puis convertit le reste en euros.

---

## 6. Payer un transfert

Un transfert en attente doit être « payé » pour être traité.

1. Retournez sur votre **tableau de bord**.
2. Repérez le transfert au statut **« En attente »**.
3. Cliquez sur **« Payer »** (paiement mobile money simulé).

Le statut passe à **« Payé »**. Le transfert suivra ensuite son cycle : **Envoyé**, puis **Reçu** lorsque le bénéficiaire est notifié.

*[Capture d'écran : tableau de bord avec bouton Payer]*

---

## 7. Suivre ses transferts

Le **tableau de bord** liste tous vos transferts avec, pour chacun :

- La **référence** (par exemple `NORU-4F2A`).
- Le **bénéficiaire**.
- Le **montant** envoyé et le montant reçu en euros.
- Le **statut**, affiché par une pastille de couleur :

| Statut | Signification |
|---|---|
| En attente | Le transfert est créé, en attente de paiement. |
| Payé | Le paiement a été effectué. |
| Envoyé | Le transfert est en cours d'acheminement. |
| Reçu | Le bénéficiaire a été notifié : transfert terminé. |
| Échec | Le transfert n'a pas pu aboutir. |

*[Capture d'écran : tableau de bord avec les statuts]*

---

## 8. Gérer son compte (RGPD)

Vous êtes propriétaire de vos données. À tout moment, vous pouvez **supprimer votre compte** :

1. Rendez-vous dans les paramètres de votre compte.
2. Cliquez sur **« Supprimer mon compte »**.
3. Confirmez.

Toutes vos données (compte, bénéficiaires, transferts) sont **définitivement effacées**. Cette action est irréversible.

---

## 9. Espace administrateur

*Réservé aux comptes ayant le rôle administrateur.*

L'administrateur accède à un espace de supervision permettant de :

- Consulter les **statistiques** générales (nombre d'utilisateurs, de transferts, volume).
- Voir **tous les transferts** de tous les utilisateurs et **changer leur statut**.
- Gérer les **utilisateurs** : en créer, changer leur rôle (utilisateur/administrateur), les supprimer.
- Consulter le **journal des notifications** envoyées.

*[Capture d'écran : espace administrateur]*

---

## 10. Questions fréquentes

**L'argent est-il réellement envoyé ?**
Non. NORU est une simulation à but pédagogique. Aucune transaction financière réelle n'a lieu.

**Le bénéficiaire reçoit-il un email ?**
Une notification est enregistrée à chaque transfert reçu. L'envoi réel de l'email est une évolution prévue pour une future version.

**J'ai oublié mon mot de passe.**
La réinitialisation de mot de passe fait partie des évolutions prévues. Pour l'instant, créez un nouveau compte si besoin.

**Mes données sont-elles en sécurité ?**
Oui. Votre mot de passe est chiffré (haché), vous seul avez accès à vos transferts, et vous pouvez supprimer vos données à tout moment.

---

*NORU — Projet de certification Concepteur Développeur d'Applications — SEIBOU Abdou Malick — 2026*
