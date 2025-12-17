import { Router } from 'express';
import { MinecraftController } from '../controllers/minecraftController';

const router = Router();
const controller = new MinecraftController();

router.post('/start', controller.start);
router.post('/stop', controller.stop);
router.post('/restart', controller.restart);
router.get('/status', controller.status);

export default router;
