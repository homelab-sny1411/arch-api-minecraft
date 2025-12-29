import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './environment';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Arch API Minecraft',
    version: '1.1.0',
    description: 'API REST pour la gestion et le monitoring d\'un serveur Minecraft avec extinction automatique intelligente',
    contact: {
      name: 'homelab-sny1411',
      url: 'https://github.com/homelab-sny1411/arch-api-minecraft'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.api.port}`,
      description: 'Serveur de développement'
    },
    {
      url: `http://{host}:{port}`,
      description: 'Serveur personnalisé',
      variables: {
        host: {
          default: 'localhost',
          description: 'Hôte du serveur'
        },
        port: {
          default: config.api.port.toString(),
          description: 'Port du serveur'
        }
      }
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Endpoints de santé de l\'API'
    },
    {
      name: 'Server Control',
      description: 'Contrôle du serveur Minecraft (démarrage, arrêt, redémarrage)'
    },
    {
      name: 'Server Status',
      description: 'Monitoring et statut du serveur'
    },
    {
      name: 'Auto-Shutdown',
      description: 'Gestion de l\'extinction automatique'
    }
  ],
  components: {
    schemas: {},
    responses: {
      BadRequest: {
        description: 'Requête invalide',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      },
      InternalServerError: {
        description: 'Erreur interne du serveur',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      },
      ServiceUnavailable: {
        description: 'Service non disponible',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/index.ts',
    './src/schemas/openapi.schemas.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
