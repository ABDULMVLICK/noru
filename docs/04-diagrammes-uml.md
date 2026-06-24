# NORU — Diagrammes UML

> Phase 2 — Conception. 7 diagrammes UML. Sources PlantUML versionnées dans `diagrams/`.
> Pour rendre une image : copier le `.puml` sur https://www.plantuml.com/plantuml ou via l'extension PlantUML de VS Code.

## Liste des diagrammes

| # | Diagramme | Source | Rôle |
|---|---|---|---|
| 1 | Cas d'utilisation | `diagrams/1-cas-utilisation.puml` | Qui fait quoi |
| 2 | États-transitions | `diagrams/2-etats-transfert.puml` | Cycle de vie du transfert |
| 3 | Classes | `diagrams/3-classes.puml` | *(lot 2)* |
| 4 | Séquence | `diagrams/4-sequence-*.puml` | *(lot 2)* |
| 5 | Activité | `diagrams/5-activite-*.puml` | *(lot 3)* |
| 6 | Déploiement | `diagrams/6-deploiement.puml` | *(lot 3)* |
| 7 | Composants | `diagrams/7-composants.puml` | *(lot 3)* |

---

## 1. Diagramme de cas d'utilisation

Acteurs : **Visiteur** (non connecté), **Envoyeur** (utilisateur connecté), **Admin**, **Receveur** (acteur secondaire qui reçoit la notification).

Points clés à défendre à l'oral :
- L'`Envoyeur` est un `Visiteur` qui s'est connecté → il hérite de « Se connecter ».
- `Créer un transfert` **inclut** `Faux paiement mobile money` (on ne crée pas un transfert sans le financer).
- `Changer le statut` **inclut** l'envoi de la `notification` au receveur.

## 2. Diagramme d'états-transitions (cycle de vie du Transfert)

États : `EN_ATTENTE → PAYE → ENVOYE → RECU`, avec une branche `ECHEC`.

| Transition | Événement déclencheur |
|---|---|
| → EN_ATTENTE | création du transfert |
| EN_ATTENTE → PAYE | paiement (simulé) validé |
| EN_ATTENTE → ECHEC | paiement refusé ou abandonné |
| PAYE → ENVOYE | traitement par NORU |
| ENVOYE → RECU | admin marque « reçu », notification envoyée |
| ENVOYE → ECHEC | incident de traitement |

Intérêt pour la certification : ce diagramme prouve qu'on a réfléchi aux **cas limites** (échec) avant de coder, pas seulement au chemin nominal. Le champ `statut` de la table `transfert` matérialise directement ces états.
