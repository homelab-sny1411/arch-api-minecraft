/**
 * @openapi
 * components:
 *   schemas:
 *     HealthCheck:
 *       type: object
 *       required:
 *         - status
 *         - timestamp
 *       properties:
 *         status:
 *           type: string
 *           enum: [ok]
 *           example: ok
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-12-26T12:00:00.000Z"
 *
 *     ServiceStatus:
 *       type: string
 *       enum:
 *         - running
 *         - stopped
 *         - failed
 *         - unknown
 *       example: running
 *
 *     MinecraftStatus:
 *       type: object
 *       required:
 *         - serviceStatus
 *         - playersOnline
 *       properties:
 *         serviceStatus:
 *           $ref: '#/components/schemas/ServiceStatus'
 *         playersOnline:
 *           type: integer
 *           minimum: 0
 *           example: 3
 *         maxPlayers:
 *           type: integer
 *           minimum: 1
 *           example: 20
 *         version:
 *           type: string
 *           example: "1.21.4"
 *         motd:
 *           type: string
 *           example: "Un serveur Minecraft"
 *
 *     ServiceResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: Données optionnelles spécifiques à la réponse
 *
 *     AutoShutdownStatus:
 *       type: object
 *       required:
 *         - enabled
 *         - idleMinutes
 *         - isIdle
 *       properties:
 *         enabled:
 *           type: boolean
 *           example: true
 *           description: Indique si le service d'extinction automatique est actif
 *         idleMinutes:
 *           type: integer
 *           minimum: 0
 *           example: 15
 *           description: Nombre de minutes d'inactivité écoulées
 *         isIdle:
 *           type: boolean
 *           example: true
 *           description: Indique si le serveur est actuellement en état d'inactivité
 *
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "An error occurred"
 */

export {};
