# NORU — Fiche conformité : RGPD, données & réglementation des paiements

**Fiche de révision pour l'oral — SEIBOU Abdou Malick — 2026**

> Contexte : l'expéditeur est au **Bénin**, le bénéficiaire en **France (UE)**. L'app collecte email, nom, IBAN et **simule** un paiement mobile money (MTN MoMo / Moov Money). C'est un **prototype fonctionnel** : le circuit de paiement réel est développé mais **en attente des autorisations réglementaires et des accords opérateurs**.
>
> ⚠️ Lis les **réserves de fiabilité** en fin de fiche : sur les chiffres précis (montants d'amendes, capital minimum), renvoie au texte de loi plutôt que de citer un chiffre incertain.

---

## PARTIE 1 — Protection des données personnelles

### A. Au Bénin

**Texte en vigueur : la Loi n°2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin**, précisément son **Livre V** (« protection des données à caractère personnel et de la vie privée »), **modifiée par la Loi n°2020-35 du 6 janvier 2021**.

- L'ancienne **Loi n°2009-09 du 27 avril 2009** est le **texte historique** (elle avait créé une « CNIL » béninoise) ; ses dispositions ont été refondues dans le Code du numérique.
- 🗣️ **À dire au jury :** « Aujourd'hui c'est le **Code du numérique de 2018, Livre V** (modifié en 2021) qui régit — la loi de 2009 est le texte historique. »

**Autorité de contrôle : l'APDP** — Autorité de Protection des Données à caractère Personnel (autorité administrative indépendante, apdp.bj). Elle a remplacé l'ancienne « CNIL » béninoise et peut enquêter, enjoindre, suspendre un traitement et sanctionner.

**Principes clés** (proches du RGPD) : licéité/loyauté, finalité déterminée, minimisation, exactitude, durée de conservation limitée, sécurité/confidentialité, consentement.

**Formalités préalables auprès de l'APDP** (point sensible pour NORU) — le Bénin fonctionne encore par **régimes de formalités préalables** :
- **Déclaration** pour les traitements courants ;
- **Autorisation** pour les traitements sensibles/à risque (données **bancaires/financières**, **transferts hors du pays**…) ;
- L'APDP statue sous **60 jours** (dossier complet) ;
- Un traitement d'**IBAN + transfert à l'étranger** relève très probablement du **régime d'autorisation**.

**Droits des personnes** : information, accès, rectification, opposition, effacement (droit à l'oubli), portabilité, réparation.

**Sanctions** : administratives (avertissement, mise en demeure, suspension, amendes) **et pénales** (amendes + emprisonnement pour les manquements graves).

### B. Côté France / UE — le RGPD

**Oui, le RGPD s'applique.** Le bénéficiaire est en France : l'app traite des données de personnes dans l'UE (nom, IBAN, email). Par l'**article 3 du RGPD** (champ territorial), le règlement s'applique **même à un responsable hors UE** dès lors qu'il **offre des services à des personnes dans l'UE**. Un **IBAN est une donnée personnelle** (il identifie une personne physique).

**Transfert de données Bénin ⇄ UE :**
- Le **Bénin n'a PAS de décision d'adéquation** de la Commission européenne (art. 45 RGPD) — aucun pays d'Afrique subsaharienne n'en a à ce jour.
- Tout transfert **UE → Bénin** doit donc être encadré par des **garanties appropriées (art. 46)**, en pratique les **Clauses Contractuelles Types (CCT / SCC)** de la Commission (décision du 4 juin 2021), + une analyse d'impact des transferts (**TIA**) si besoin.

### C. Articulation des deux régimes

- NORU serait soumis **aux deux** : **APDP** (données collectées au Bénin) **et RGPD** (données du bénéficiaire en UE).
- **Base légale** : exécution du contrat de transfert (art. 6.1.b RGPD) et/ou consentement.
- **Mesures concrètes** : politique de confidentialité, mentions d'information, registre des traitements, minimisation, **chiffrement des IBAN**, **déclaration/autorisation APDP**, et **CCT** pour les flux transfrontières.

---

## PARTIE 2 — Réglementation des paiements / transfert d'argent

### A. Qui régule au Bénin : UEMOA / BCEAO

Le Bénin est membre de l'**UEMOA/UMOA**. La **BCEAO** (Banque Centrale des États de l'Afrique de l'Ouest) régule la monnaie électronique et les services de paiement ; le contrôle prudentiel est assuré par la **Commission Bancaire de l'UMOA**.

### B. Émetteur de Monnaie Électronique (EME) et agrément

**Texte de référence : Instruction BCEAO n°008-05-2015 du 21 mai 2015** (conditions d'exercice des **émetteurs de monnaie électronique** dans l'UMOA).

- Une structure **non bancaire** qui émet de la monnaie électronique doit obtenir un **agrément de la BCEAO** (un « **Guide du promoteur** » de la BCEAO détaille la procédure).
- **Pour lancer réellement NORU**, deux voies :
  1. **Obtenir soi-même l'agrément EME** (lourd : capital minimum, gouvernance, dispositif LCB-FT) ; ou
  2. **S'adosser à un acteur déjà agréé** (banque, EME, opérateur) et opérer comme **partenaire technique / agent** → **le schéma le plus réaliste** pour un projet étudiant.

### C. Opérateurs mobile money, API, LCB-FT

- **MTN MoMo** et **Moov Money** émettent leur monnaie électronique via des entités agréées/adossées (cadre BCEAO). Leurs **API** permettent l'intégration, mais leur usage en production exige un **contrat opérateur** et le respect de leurs règles KYC.
- Le **transfert d'argent** (type **Wave, Wari**) est une **activité réglementée** — jamais libre — exercée sous agrément propre ou sous couvert d'un établissement agréé.
- **LCB-FT / KYC obligatoires** : identification/vérification du client (**KYC**), surveillance des opérations, conservation, et **déclaration de soupçon à la CENTIF** (Cellule Nationale de Traitement des Informations Financières du Bénin).

### D. Côté France (bref)

- Côté français, ce service relève du statut d'**établissement de paiement** agréé par l'**ACPR** (adossée à la Banque de France), cadre issu de la directive **DSP2 (2015/2366)**. Instruction sous **3 mois** (dossier complet).
- Le **passeport européen** ne bénéficie pas à un acteur **hors UE** (béninois) : il faudrait s'adosser à un établissement de paiement agréé dans l'UE pour la « jambe » française.

---

## PARTIE 3 — Argumentaire oral prêt à l'emploi

### 8 phrases à dire au jury

1. « Mon application est un **prototype fonctionnel** : le circuit de paiement est développé et testé en simulation, mais il n'est **pas ouvert au public** car il attend les autorisations réglementaires et les accords opérateurs. »
2. « Côté données, je suis soumis à **deux régimes** : au Bénin le **Code du numérique, Loi n°2017-20 de 2018, Livre V**, sous le contrôle de l'**APDP** ; et le **RGPD** côté UE, puisque mon bénéficiaire est en France. »
3. « J'ai intégré la **protection des données dès la conception** : minimisation, chiffrement des IBAN, politique de confidentialité, base légale sur l'exécution du contrat. »
4. « Le Bénin **n'a pas de décision d'adéquation** RGPD, donc un déploiement réel encadrerait les flux UE→Bénin par des **Clauses Contractuelles Types**. »
5. « Pour le paiement, l'autorité compétente est la **BCEAO**, et la monnaie électronique est régie par l'**Instruction n°008-05-2015**. Lancer réellement suppose soit un **agrément EME**, soit un **adossement à un acteur agréé**. »
6. « Je connais les obligations **LCB-FT / KYC** : identification du client, traçabilité, et **déclaration de soupçon à la CENTIF**. »
7. « L'intégration MTN MoMo / Moov se ferait via leurs **API**, mais leur usage en production nécessite un **contrat opérateur** que je n'ai pas encore. »
8. « Mon choix — simulation aujourd'hui, branchement API demain — est une démarche **conforme et réaliste** : je ne manipule pas de fonds réels sans agrément. »

### Questions pièges du jury + bonnes réponses

**Q — « Un IBAN, ce n'est pas une donnée personnelle ? »**
> Si. Un IBAN identifie une personne physique : c'est une **donnée personnelle** (art. 4 RGPD et Code du numérique béninois). Je la traite avec base légale, minimisation et chiffrement.

**Q — « Transférer des données vers l'Europe / le Bénin, c'est légal sans rien ? »**
> Non. Le Bénin **n'a pas de décision d'adéquation**. Pour un déploiement réel, les flux avec l'UE seraient couverts par les **Clauses Contractuelles Types (art. 46 RGPD)**, et côté béninois par une **autorisation de transfert de l'APDP**.

**Q — « Sans agrément, votre app est illégale ? »**
> Non, car elle **ne manipule aucun fonds réel** : le paiement est **simulé**. Manipuler de la monnaie électronique sans agrément BCEAO serait illégal — c'est justement pourquoi le circuit réel reste **désactivé**, en attente de l'agrément EME ou d'un adossement.

**Q — « Que faut-il pour passer en production ? »**
> Trois choses : (1) **agrément/adossement BCEAO** (Instruction 008-05-2015), (2) **accords opérateurs** MTN/Moov pour les API, (3) conformité **données** : déclaration/autorisation **APDP** + **CCT** RGPD, et un dispositif **LCB-FT/KYC**.

**Q — « Qui régule le mobile money au Bénin ? »**
> La **BCEAO**, banque centrale commune de l'UEMOA. Les opérateurs émettent la monnaie électronique **sous ce cadre**, via une entité agréée ou adossée.

---

## Réserves de fiabilité (à connaître)

- **Statut de la Loi 2009-09** : le texte de référence actuel est le **Code du numérique (2017-20)** ; « abrogée » vs « refondue » varie selon les sources → dis simplement « le texte en vigueur est le **Code du numérique de 2018, modifié en 2021** ».
- **Chiffres précis** (montants d'amendes APDP, capital minimum EME) : non vérifiés ligne à ligne → renvoie au texte (Livre V ; Instruction 008-05-2015) plutôt que de citer un chiffre.
- **Flux cross-zone** : l'argent part du Bénin (BCEAO) vers la France (ACPR/DSP2) → un lancement réel exige des **partenariats agréés des deux côtés**. C'est un **argument de maturité** à valoriser.

---

## Sources principales

**Données — Bénin :** Code du numérique 2018 (Loi 2017-20) · APDP (apdp.bj / archive.apdp.bj) · Loi 2009-09 (historique).
**RGPD / transferts :** CNIL — Clauses Contractuelles Types · CNIL — transferts hors UE · liste des pays adéquats (le Bénin n'y figure pas).
**Paiement — BCEAO :** Instruction n°008-05-2015 (bceao.int) · Guide du promoteur EME.
**Paiement — France :** ACPR — établissement de paiement · ACPR — LCB-FT · DSP2.

*(URLs détaillées conservées dans l'historique du projet.)*
