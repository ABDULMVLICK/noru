# NORU — Déploiement (CI/CD & mise en production)

> Phase 5. Décrit l'environnement de production, la procédure de déploiement et le rollback.

## 1. Vue d'ensemble

| Élément | Rôle |
|---|---|
| GitHub Actions (`ci.yml`) | Intégration continue : lint + tests à chaque push/PR |
| GitHub Actions (`cd.yml`) | Déploiement continu : build des images → GHCR → SSH sur le VPS |
| GHCR (GitHub Container Registry) | Stocke les images Docker (`noru-backend`, `noru-frontend`) |
| VPS (serveur Linux) | Exécute les conteneurs via `docker-compose.prod.yml` |

**Chaîne complète :** `push sur main` → CI verte → build images → publication GHCR (tags `latest` + SHA) → SSH sur le VPS → `docker compose pull && up -d` → application à jour sur l'URL publique.

## 2. Environnements

- **Développement** : machine locale, `docker compose up` (MySQL + Mongo) + `npm run start:dev` / `npm run dev`.
- **Test (CI)** : runner GitHub avec MySQL + MongoDB en services, exécution des tests.
- **Production** : VPS, images tirées depuis GHCR, `docker-compose.prod.yml`.

## 3. Préparation du serveur (une seule fois)

1. Mettre à jour le système : `sudo apt update && sudo apt upgrade -y`
2. Installer Docker et Docker Compose.
3. Créer un utilisateur `deploy` non-root, membre du groupe `docker`.
4. Ajouter la clé SSH publique de déploiement pour `deploy`.
5. Désactiver la connexion SSH par mot de passe (clé uniquement).
6. Activer le pare-feu : `ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable`
7. Déposer sur le serveur, dans `~/noru/` : `docker-compose.prod.yml` et un fichier `.env` (NON versionné) contenant `MYSQL_ROOT_PASSWORD` et `JWT_SECRET`.

## 4. Secrets GitHub à configurer

Dans le dépôt → Settings → Secrets and variables → Actions :

| Secret | Contenu |
|---|---|
| `SERVER_HOST` | Adresse IP du VPS |
| `SERVER_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | Clé SSH privée de déploiement |

Le `GITHUB_TOKEN` (authentification GHCR) est fourni automatiquement par GitHub.

## 5. Procédure de déploiement (automatique)

1. Le travail est développé sur des branches, fusionné dans `develop`.
2. Une Pull Request `develop → main` est ouverte ; la CI doit être verte.
3. Après merge, le workflow `cd.yml` se déclenche automatiquement.
4. Les images sont construites, publiées sur GHCR, et le VPS est mis à jour par SSH.
5. L'application est accessible sur `http://<IP_DU_VPS>`.

## 6. Procédure de rollback

En cas de bug critique en production, on revient à la version stable précédente.
Stratégie « retag latest » (environ 3 minutes) :

```bash
# 1. Identifier le SHA du dernier commit stable (avant le bug)
# 2. Tirer l'image correspondante et la retagger en latest
docker pull ghcr.io/abdulmvlick/noru-backend:<SHA_STABLE>
docker tag  ghcr.io/abdulmvlick/noru-backend:<SHA_STABLE> ghcr.io/abdulmvlick/noru-backend:latest
docker push ghcr.io/abdulmvlick/noru-backend:latest
# 3. Sur le VPS : redéployer
ssh deploy@<IP> "cd ~/noru && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d"
```

C'est pour rendre le rollback possible que chaque image est taguée avec le **SHA** du commit (identifiant unique et stable), en plus de `latest`.

### Autres stratégies de déploiement (à connaître)

- **Bleu-vert** : deux environnements identiques, bascule du trafic de l'un à l'autre.
- **Canari** : la nouvelle version est exposée à un petit pourcentage d'utilisateurs avant généralisation.
- **Rolling update** : remplacement progressif des instances (géré nativement par Kubernetes).
