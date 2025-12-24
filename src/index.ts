import express, { Request, Response } from 'express';
import { config } from './config/environment';
import { createMinecraftRouter } from './routes/minecraftRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AutoShutdownService } from './services/autoShutdownService';
import { logger } from './utils/logger';

const app = express();
const autoShutdownService = new AutoShutdownService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
