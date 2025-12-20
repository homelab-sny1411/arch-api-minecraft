import express, { Request, Response } from 'express';
import { config } from './config/environment';
import { createMinecraftRouter } from './routes/minecraftRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AutoShutdownService } from './services/autoShutdownService';

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
    console.log(`API started on port ${config.api.port}`);
    console.log(`Environment: ${config.api.nodeEnv}`);
    console.log(`Minecraft service: ${config.minecraft.serviceName}`);
    console.log(`Minecraft server: ${config.minecraft.host}:${config.minecraft.port}`);

    autoShutdownService.start();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping auto-shutdown service...');
    autoShutdownService.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping auto-shutdown service...');
    autoShutdownService.stop();
    process.exit(0);
});
