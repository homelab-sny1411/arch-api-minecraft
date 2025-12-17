import express, { Request, Response } from 'express';
import { config } from './config/environment';
import minecraftRoutes from './routes/minecraftRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/minecraft', minecraftRoutes);

app.use(errorHandler);

app.listen(config.api.port, () => {
    console.log(`API started on port ${config.api.port}`);
    console.log(`Environment: ${config.api.nodeEnv}`);
    console.log(`Minecraft service: ${config.minecraft.serviceName}`);
    console.log(`Minecraft server: ${config.minecraft.host}:${config.minecraft.port}`);
});
