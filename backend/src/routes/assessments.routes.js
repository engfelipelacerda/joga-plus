import { Router } from 'express';
import assessmentController from '../modules/assessment/assessmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, assessmentController.listAll);
router.get('/:jogo_id', authMiddleware, assessmentController.getByGame);
router.post('/', authMiddleware, assessmentController.create);
router.patch('/', authMiddleware, assessmentController.update);
router.delete('/:jogo_id', authMiddleware, assessmentController.remove);

export default router;

