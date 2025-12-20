import { Router } from 'express';
import { MinecraftController } from '../controllers/minecraftController';
import { AutoShutdownService } from '../services/autoShutdownService';

export const createMinecraftRouter = (autoShutdownService?: AutoShutdownService): Router => {
    const router = Router();
    const controller = new MinecraftController(autoShutdownService);

    router.post('/start', controller.start);
    router.post('/stop', controller.stop);
    router.post('/restart', controller.restart);
    router.get('/status', controller.status);
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
