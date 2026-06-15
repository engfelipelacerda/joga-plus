import { Router } from 'express';
import listController from '../modules/list/listController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Todas protegidas — usuário precisa estar logado
router.get('/', authMiddleware, listController.listAll);
router.get('/:tipo', authMiddleware, listController.listByType);
router.post('/', authMiddleware, listController.add);
router.patch('/move', authMiddleware, listController.moveToList);
router.patch('/priority', authMiddleware, listController.updatePriority);
router.delete('/:jogo_id', authMiddleware, listController.remove);

export default router;

