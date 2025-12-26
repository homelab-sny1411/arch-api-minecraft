import { Router } from 'express';
import { MinecraftController } from '../controllers/minecraftController';
import { AutoShutdownService } from '../services/autoShutdownService';

export const createMinecraftRouter = (autoShutdownService?: AutoShutdownService): Router => {
    const router = Router();
    const controller = new MinecraftController(autoShutdownService);

    /**
     * @openapi
     * /minecraft/start:
     *   post:
     *     tags:
     *       - Server Control
     *     summary: Démarrer le serveur Minecraft
     *     description: Démarre le serveur Minecraft via systemd. Cette opération peut prendre quelques secondes.
     *     operationId: startMinecraftServer
     *     responses:
     *       200:
     *         description: Serveur démarré avec succès
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ServiceResponse'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       example: true
     *                     message:
     *                       example: "Minecraft server started successfully"
     *             examples:
     *               success:
     *                 summary: Démarrage réussi
     *                 value:
     *                   success: true
     *                   message: "Minecraft server started successfully"
     *       500:
     *         description: Erreur lors du démarrage
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *             examples:
     *               error:
     *                 summary: Échec du démarrage
     *                 value:
     *                   success: false
     *                   message: "Failed to start server: Service not found"
     *     x-code-samples:
     *       - lang: curl
     *         source: |
     *           curl -X POST http://localhost:1411/minecraft/start \
     *             -H "Content-Type: application/json"
     *       - lang: JavaScript
     *         source: |
     *           const response = await fetch('http://localhost:1411/minecraft/start', {
     *             method: 'POST',
     *             headers: { 'Content-Type': 'application/json' }
     *           });
     *           const data = await response.json();
     *           console.log(data);
     */
    router.post('/start', controller.start);

    /**
     * @openapi
     * /minecraft/stop:
     *   post:
     *     tags:
     *       - Server Control
     *     summary: Arrêter le serveur Minecraft et éteindre le système
     *     description: Arrête le serveur Minecraft via systemd puis déclenche l'extinction du système après 1 seconde.
     *     operationId: stopMinecraftServer
     *     responses:
     *       200:
     *         description: Serveur arrêté avec succès, extinction du système en cours
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ServiceResponse'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       example: true
     *                     message:
     *                       example: "Minecraft server stopped successfully. System shutdown initiated."
     *             examples:
     *               success:
     *                 summary: Arrêt réussi
     *                 value:
     *                   success: true
     *                   message: "Minecraft server stopped successfully. System shutdown initiated."
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     *     x-code-samples:
     *       - lang: curl
     *         source: |
     *           curl -X POST http://localhost:1411/minecraft/stop \
     *             -H "Content-Type: application/json"
     *       - lang: JavaScript
     *         source: |
     *           const response = await fetch('http://localhost:1411/minecraft/stop', {
     *             method: 'POST',
     *             headers: { 'Content-Type': 'application/json' }
     *           });
     *           const data = await response.json();
     *           console.log('Serveur arrêté, extinction en cours...');
     */
    router.post('/stop', controller.stop);

    /**
     * @openapi
     * /minecraft/restart:
     *   post:
     *     tags:
     *       - Server Control
     *     summary: Redémarrer le serveur Minecraft
     *     description: Redémarre le serveur Minecraft via systemd. Cette opération peut prendre quelques secondes.
     *     operationId: restartMinecraftServer
     *     responses:
     *       200:
     *         description: Serveur redémarré avec succès
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ServiceResponse'
     *                 - type: object
     *                   properties:
     *                     success:
     *                       example: true
     *                     message:
     *                       example: "Minecraft server restarted successfully"
     *             examples:
     *               success:
     *                 summary: Redémarrage réussi
     *                 value:
     *                   success: true
     *                   message: "Minecraft server restarted successfully"
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     *     x-code-samples:
     *       - lang: curl
     *         source: |
     *           curl -X POST http://localhost:1411/minecraft/restart \
     *             -H "Content-Type: application/json"
     *       - lang: JavaScript
     *         source: |
     *           const response = await fetch('http://localhost:1411/minecraft/restart', {
     *             method: 'POST',
     *             headers: { 'Content-Type': 'application/json' }
     *           });
     *           const result = await response.json();
     *           if (result.success) {
     *             console.log('Serveur redémarré avec succès');
     *           }
     */
    router.post('/restart', controller.restart);

    /**
     * @openapi
     * /minecraft/status:
     *   get:
     *     tags:
     *       - Server Status
     *     summary: Obtenir le statut du serveur
     *     description: |
     *       Récupère le statut complet du serveur Minecraft incluant:
     *       - État du service systemd
     *       - Nombre de joueurs connectés
     *       - Version du serveur (si disponible)
     *       - MOTD (Message of the Day)
     *     operationId: getMinecraftStatus
     *     responses:
     *       200:
     *         description: Statut récupéré avec succès
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ServiceResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/MinecraftStatus'
     *             examples:
     *               serverRunning:
     *                 summary: Serveur actif avec joueurs
     *                 value:
     *                   success: true
     *                   message: "Status retrieved successfully"
     *                   data:
     *                     serviceStatus: "running"
     *                     playersOnline: 3
     *                     maxPlayers: 20
     *                     version: "1.21.4"
     *                     motd: "Un serveur Minecraft"
     *               serverStopped:
     *                 summary: Serveur arrêté
     *                 value:
     *                   success: true
     *                   message: "Status retrieved successfully"
     *                   data:
     *                     serviceStatus: "stopped"
     *                     playersOnline: 0
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     *     x-code-samples:
     *       - lang: curl
     *         source: |
     *           curl http://localhost:1411/minecraft/status
     *       - lang: JavaScript
     *         source: |
     *           const response = await fetch('http://localhost:1411/minecraft/status');
     *           const data = await response.json();
     *           console.log(`Joueurs: ${data.data.playersOnline}/${data.data.maxPlayers}`);
     */
    router.get('/status', controller.status);

    /**
     * @openapi
     * /minecraft/auto-shutdown/status:
     *   get:
     *     tags:
     *       - Auto-Shutdown
     *     summary: Obtenir le statut du service d'extinction automatique
     *     description: |
     *       Récupère l'état du service d'extinction automatique incluant:
     *       - Si le service est activé
     *       - Nombre de minutes d'inactivité écoulées
     *       - Si le serveur est en état d'inactivité
     *     operationId: getAutoShutdownStatus
     *     responses:
     *       200:
     *         description: Statut récupéré avec succès
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ServiceResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/AutoShutdownStatus'
     *             examples:
     *               enabled:
     *                 summary: Service actif, serveur inactif
     *                 value:
     *                   success: true
     *                   message: "Auto-shutdown status retrieved successfully"
     *                   data:
     *                     enabled: true
     *                     idleMinutes: 15
     *                     isIdle: true
     *               disabled:
     *                 summary: Service désactivé
     *                 value:
     *                   success: true
     *                   message: "Auto-shutdown status retrieved successfully"
     *                   data:
     *                     enabled: false
     *                     idleMinutes: 0
     *                     isIdle: false
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     *     x-code-samples:
     *       - lang: curl
     *         source: |
     *           curl http://localhost:1411/minecraft/auto-shutdown/status
     *       - lang: JavaScript
     *         source: |
     *           const response = await fetch('http://localhost:1411/minecraft/auto-shutdown/status');
     *           const data = await response.json();
     *           if (data.data.enabled && data.data.isIdle) {
     *             console.log(`Serveur inactif depuis ${data.data.idleMinutes} minutes`);
     *           }
     */
    router.get('/auto-shutdown/status', controller.autoShutdownStatus);

    return router;
};

const router = Router();
const controller = new MinecraftController();

router.post('/start', controller.start);
router.post('/stop', controller.stop);
router.post('/restart', controller.restart);
router.get('/status', controller.status);
router.get('/auto-shutdown/status', controller.autoShutdownStatus);

export default router;
