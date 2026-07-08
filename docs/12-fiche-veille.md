# NORU — Fiche de veille technologique

**SEIBOU Abdou Malick — Concepteur Développeur d'Applications — 2026**

> ⚠️ **À personnaliser.** Cette fiche décrit une démarche de veille cohérente avec le projet NORU. Le jury appréciera que tu parles de **tes vraies habitudes** : garde ce que tu fais réellement, remplace le reste. La partie « Synthèse d'un sujet suivi » (section 5) doit impérativement porter sur un article que tu as **réellement lu**.

---

## 1. Pourquoi faire de la veille ?

Le métier de développeur évolue en permanence : nouvelles versions de langages, nouvelles failles de sécurité, nouvelles bonnes pratiques. La veille technologique permet de **rester à jour**, de **sécuriser ses applications** et de **faire les bons choix techniques**. C'est une compétence attendue dans la certification (transverse T3).

---

## 2. Mes centres d'intérêt

J'ai organisé ma veille autour de **trois axes**, directement liés aux technologies de mon projet NORU :

1. **La sécurité applicative** — parce que NORU manipule des données personnelles et de l'authentification, je dois connaître les failles courantes et les moyens de m'en protéger.
2. **L'écosystème JavaScript / TypeScript** — mon projet repose sur React (front) et NestJS (back) ; je suis les évolutions de ces frameworks et du langage.
3. **Le DevOps et le déploiement** — Docker, l'intégration continue et le déploiement en ligne, pour livrer mon application de façon fiable.

---

## 3. Mes sources

### Sécurité
| Source | Type | Pourquoi |
|---|---|---|
| **OWASP** (owasp.org) | Référentiel | Le Top 10 des failles web, la référence du domaine. |
| **CERT-FR** (cert.ssi.gouv.fr) | Alertes | Alertes de sécurité officielles françaises (ANSSI). |
| **Snyk Blog** | Blog | Vulnérabilités des dépendances, écosystème npm. |

### JavaScript / TypeScript / Frameworks
| Source | Type | Pourquoi |
|---|---|---|
| **Blog officiel React** (react.dev/blog) | Blog | Annonces et bonnes pratiques React. |
| **Documentation NestJS** (docs.nestjs.com) | Doc | Évolutions du framework backend que j'utilise. |
| **MDN Web Docs** | Référence | La référence pour le web (HTML, CSS, JS). |
| **JavaScript Weekly** | Newsletter | Résumé hebdomadaire de l'actualité JS. |

### DevOps / Déploiement
| Source | Type | Pourquoi |
|---|---|---|
| **GitHub Blog / Changelog** | Blog | Nouveautés GitHub Actions (ma CI/CD). |
| **Docker Blog** | Blog | Bonnes pratiques de conteneurisation. |
| **Node.js Blog** (nodejs.org/blog) | Blog | Versions LTS et correctifs de sécurité de Node. |

---

## 4. Mes outils et ma méthode

- **Agrégateur de flux RSS** (par exemple **Feedly**) : je regroupe mes sources au même endroit pour les consulter rapidement.
- **Newsletters** : je reçois JavaScript Weekly par email chaque semaine.
- **GitHub** : je « watch » ou j'étoile les dépôts des outils que j'utilise pour être notifié des nouvelles versions.

**Rythme** : je consacre environ **15 minutes par jour** à parcourir les titres, et je lis en détail un ou deux articles par semaine. Je note les sujets importants pour les approfondir.

---

## 5. Synthèse d'un sujet suivi récemment

> **À réécrire avec un article que tu as vraiment lu.** Structure à respecter : le sujet, ce que j'ai appris, comment ça s'applique à mon projet. Exemple de trame ci-dessous.

**Sujet : Le hachage des mots de passe avec bcrypt**

- **Où** : documentation OWASP (Password Storage Cheat Sheet) et documentation de la librairie bcrypt.
- **Ce que j'ai appris** : un mot de passe ne doit jamais être stocké en clair ni simplement « chiffré ». Il faut le **hacher** avec un algorithme lent et salé comme bcrypt. La lenteur est volontaire : elle rend les attaques par force brute très coûteuses. Le « sel » (salt) empêche deux mots de passe identiques d'avoir la même empreinte.
- **Comment je l'ai appliqué dans NORU** : j'utilise bcrypt à l'inscription pour hacher le mot de passe, et je ne stocke que l'empreinte en base. À la connexion, je compare l'empreinte sans jamais « déchiffrer ». Cela répond directement à la faille OWASP « Identification and Authentication Failures ».

---

## 6. Ce que la veille m'a apporté sur ce projet

- J'ai sécurisé l'authentification (bcrypt + JWT) grâce à mes lectures sur OWASP.
- J'ai choisi mes versions d'outils (Prisma 6, Node LTS) en connaissance de cause.
- J'ai adopté des bonnes pratiques de CI/CD (secrets hors du code, branche protégée) vues dans mes sources DevOps.

---

*Fiche de veille — NORU — SEIBOU Abdou Malick — 2026*
