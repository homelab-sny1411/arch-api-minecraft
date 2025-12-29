# Arch API Minecraft

API REST pour la gestion et le monitoring d'un serveur Minecraft avec extinction automatique intelligente.

## Fonctionnalités

- **Contrôle du serveur** : Démarrage, arrêt et redémarrage du serveur Minecraft via systemd
- **Monitoring en temps réel** : Récupération du statut du serveur, nombre de joueurs connectés, version et MOTD
- **Extinction automatique** : Arrêt automatique du serveur et du système après une période d'inactivité configurable
- **Logging structuré** : Utilisation de Pino pour des logs clairs et performants
- **Configuration flexible** : Toute la configuration via variables d'environnement

## Documentation de l'API

Une documentation interactive complète est disponible via Swagger UI. Elle inclut:
- Tous les endpoints avec descriptions détaillées
- Schémas de requêtes et réponses
- Exemples de requêtes (cURL, JavaScript)
- Interface de test "Try it out" pour tester les endpoints directement

**Accès à la documentation:**
- Interface interactive: `http://localhost:1411/api-docs`
- Spécification OpenAPI (JSON): `http://localhost:1411/api-docs.json`

> **Note:** Remplacez `localhost:1411` par l'adresse de votre serveur en production.

## Prérequis

- Node.js 18+ ou 20+
- Un serveur Minecraft configuré avec systemd
- Accès systemd (privilèges sudo si nécessaire)
- Linux (testé sur Arch Linux)

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/homelab-sny1411/arch-api-minecraft.git
cd arch-api-minecraft
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer le fichier de configuration :
```bash
cp .env.example .env
```

4. Configurer les variables d'environnement dans `.env` :
```env
# API Configuration
API_PORT=1411
NODE_ENV=development

# Minecraft Server Configuration
MINECRAFT_SERVICE_NAME=minecraft-server
MINECRAFT_PORT=25565
MINECRAFT_RCON_PORT=25575
MINECRAFT_RCON_PASSWORD=your_rcon_password_here
MINECRAFT_SERVER_PATH=/opt/minecraft
MINECRAFT_HOST=localhost

# System Configuration
SHUTDOWN_COMMAND=systemctl poweroff

# Auto-shutdown Configuration
AUTO_SHUTDOWN_ENABLED=true
AUTO_SHUTDOWN_CHECK_INTERVAL=60000
AUTO_SHUTDOWN_IDLE_TIME=1800000
```

## Utilisation

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `API_PORT` | Port de l'API | `1411` |
| `NODE_ENV` | Environnement d'exécution | `development` |
| `MINECRAFT_SERVICE_NAME` | Nom du service systemd | `minecraft-server` |
| `MINECRAFT_PORT` | Port du serveur Minecraft | `25565` |
| `MINECRAFT_RCON_PORT` | Port RCON | `25575` |
| `MINECRAFT_RCON_PASSWORD` | Mot de passe RCON | - |
| `MINECRAFT_SERVER_PATH` | Chemin du serveur | `/opt/minecraft` |
| `MINECRAFT_HOST` | Hôte du serveur | `localhost` |
| `SHUTDOWN_COMMAND` | Commande d'extinction | `systemctl poweroff` |
| `AUTO_SHUTDOWN_ENABLED` | Activer l'extinction auto | `true` |
| `AUTO_SHUTDOWN_CHECK_INTERVAL` | Intervalle de vérification (ms) | `60000` (1 min) |
| `AUTO_SHUTDOWN_IDLE_TIME` | Durée d'inactivité avant extinction (ms) | `1800000` (30 min) |

### Service d'extinction automatique

Le service surveille automatiquement le nombre de joueurs connectés. Si aucun joueur n'est connecté pendant la durée configurée (`AUTO_SHUTDOWN_IDLE_TIME`), le serveur et le système s'arrêtent automatiquement.

**Fonctionnement :**
1. Vérification périodique toutes les `AUTO_SHUTDOWN_CHECK_INTERVAL` millisecondes
2. Décompte du temps d'inactivité lorsque 0 joueur est connecté
3. Réinitialisation du compteur dès qu'un joueur se connecte
4. Arrêt automatique après `AUTO_SHUTDOWN_IDLE_TIME` millisecondes d'inactivité

## Architecture

```
src/
├── config/
│   └── environment.ts          # Configuration de l'environnement
├── controllers/
│   └── minecraftController.ts  # Logique des endpoints
├── middleware/
│   └── errorHandler.ts         # Gestion des erreurs
├── routes/
│   └── minecraftRoutes.ts      # Définition des routes
├── services/
│   ├── autoShutdownService.ts  # Service d'extinction automatique
│   ├── minecraftQueryService.ts # Interrogation du serveur Minecraft
│   ├── shutdownService.ts      # Gestion de l'extinction système
│   └── systemdService.ts       # Interface avec systemd
├── types/
│   └── minecraft.types.ts      # Définitions TypeScript
├── utils/
│   └── logger.ts               # Logger Pino
└── index.ts                    # Point d'entrée de l'application
```

## Développement

### Scripts disponibles

- `npm run dev` : Lance le serveur en mode développement avec rechargement automatique
- `npm run build` : Compile le TypeScript en JavaScript
- `npm start` : Lance le serveur en production (après build)

### Technologies utilisées

- **Express** : Framework web rapide et minimaliste
- **TypeScript** : Typage statique pour plus de robustesse
- **Pino** : Logger JSON haute performance
- **minecraft-server-util** : Bibliothèque pour interroger les serveurs Minecraft
- **dotenv** : Gestion des variables d'environnement
- **Swagger/OpenAPI** : Documentation interactive de l'API
- **Zod** : Validation de schémas avec inférence de types

## Déploiement

### Avec systemd

1. Créer un fichier de service `/etc/systemd/system/arch-api-minecraft.service` :
```ini
[Unit]
Description=Arch API Minecraft
After=network.target

[Service]
Type=simple
User=minecraft
WorkingDirectory=/opt/arch-api-minecraft
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

2. Activer et démarrer le service :
```bash
sudo systemctl daemon-reload
sudo systemctl enable arch-api-minecraft
sudo systemctl start arch-api-minecraft
```

### Avec Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 1411

CMD ["node", "dist/index.js"]
```

```bash
docker build -t arch-api-minecraft .
docker run -d -p 1411:1411 --env-file .env arch-api-minecraft
```

## Licence

ISC

## Auteur

[homelab-sny1411](https://github.com/homelab-sny1411)
