# NORU — Déploiement (CI/CD & mise en production)

> Phase 5. Décrit l'environnement de production, la procédure de déploiement et le rollback.

## 1. Architecture de production

| Composant | Hébergeur | Détail |
|---|---|---|
| Frontend (React) | **Vercel** | Build du projet Vite, sert le SPA |
| Backend (NestJS) | **Railway** | Build du `Dockerfile`, conteneur exposant l'API |
| MySQL | **Railway** | Service base de données |
| MongoDB | **Railway** | Service base de données |
| Images Docker | **GHCR** | Publiées par la CD (preuve de conteneurisation) |

Le frontend (Vercel) appelle le backend (Railway) via son URL publique (`VITE_API_URL`), et le backend autorise cette origine via CORS (`CORS_ORIGIN`).

## 2. Variables d'environnement

**Backend (Railway)**
| Variable | Valeur |
|---|---|
| `DATABASE_URL` | fournie par le service MySQL de Railway |
| `MONGODB_URI` | fournie par le service MongoDB de Railway |
| `JWT_SECRET` | secret long et aléatoire |
| `JWT_EXPIRES_IN` | `1d` |
| `CORS_ORIGIN` | URL publique du frontend Vercel |
| `PORT` | fournie automatiquement par Railway |

**Frontend (Vercel)**
| Variable | Valeur |
|---|---|
| `VITE_API_URL` | URL publique du backend Railway |

## 3. Procédure de déploiement (automatique)

1. Le travail est développé sur des branches, fusionné dans `develop`.
2. Une Pull Request `develop → main` est ouverte ; la CI doit être verte.
3. Après merge sur `main` :
   - **Railway** reconstruit et redéploie le backend automatiquement.
   - **Vercel** reconstruit et redéploie le frontend automatiquement.
   - Le workflow **`cd.yml`** publie en plus les images Docker sur GHCR (tags `latest` + SHA).
4. Les migrations Prisma s'appliquent au démarrage du conteneur backend (`prisma migrate deploy`).

## 4. Conteneurisation (compétence C11)

- `backend/Dockerfile` et `frontend/Dockerfile` : construction des images.
- `docker-compose.prod.yml` : définition de la stack complète (backend + frontend + MySQL + MongoDB), utilisable telle quelle sur un serveur/VPS.
- Images publiées sur GHCR avec un tag `SHA` unique par commit.

## 5. Procédure de rollback

En cas de bug critique en production :

- **Sur Railway** : ouvrir le service → onglet *Deployments* → sélectionner le dernier déploiement stable → *Redeploy*. Retour à la version précédente en ~1 minute.
- **Sur Vercel** : *Deployments* → déploiement stable précédent → *Promote to Production*.
- **Via les images Docker** (si déploiement par conteneurs) : chaque image porte un tag `SHA` ; on retire l'image stable correspondante et on la redéploie (`docker pull ghcr.io/.../noru-backend:<SHA_STABLE>` puis redémarrage).

### Autres stratégies de déploiement (à connaître)

- **Bleu-vert** : deux environnements identiques, bascule du trafic de l'un à l'autre.
- **Canari** : la nouvelle version est exposée à un petit pourcentage d'utilisateurs avant généralisation.
- **Rolling update** : remplacement progressif des instances (géré nativement par Kubernetes).
