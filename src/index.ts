import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/environment';
import { swaggerSpec } from './config/swagger';
import { createMinecraftRouter } from './routes/minecraftRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AutoShutdownService } from './services/autoShutdownService';
import { logger } from './utils/logger';

const app = express();
const autoShutdownService = new AutoShutdownService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger UI
const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Arch API Minecraft - Documentation',
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true
    }
};

// Routes Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Route pour obtenir le JSON OpenAPI brut
app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/**
 * @openapi
 * /ping:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check de l'API
 *     description: Vérifie que l'API est disponible et fonctionnelle
 *     operationId: healthCheck
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             example:
 *               status: ok
 *               timestamp: "2025-12-26T12:00:00.000Z"
 *     x-code-samples:
 *       - lang: curl
 *         source: |
 *           curl http://localhost:1411/ping
 *       - lang: JavaScript
 *         source: |
 *           const response = await fetch('http://localhost:1411/ping');
 *           const data = await response.json();
 *           console.log(data.status); // "ok"
 */
app.get('/ping', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/minecraft', createMinecraftRouter(autoShutdownService));

app.use(errorHandler);

app.listen(config.api.port, () => {
    logger.info(`API started on port ${config.api.port}`);
    logger.info(`Environment: ${config.api.nodeEnv}`);
    logger.info(`Minecraft service: ${config.minecraft.serviceName}`);
    logger.info(`Minecraft server: ${config.minecraft.host}:${config.minecraft.port}`);
    logger.info(`Swagger UI available at: http://localhost:${config.api.port}/api-docs`);
    logger.info(`OpenAPI JSON available at: http://localhost:${config.api.port}/api-docs.json`);

    autoShutdownService.start();
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received, stopping auto-shutdown service...');
    autoShutdownService.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, stopping auto-shutdown service...');
    autoShutdownService.stop();
    process.exit(0);
});
