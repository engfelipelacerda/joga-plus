import { Router } from 'express';
import promoController from '../modules/promo/promoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Consulta CheapShark e salva promoções dos desejados do usuário
router.post('/check', authMiddleware, promoController.checkPromos);

// Lista promoções ativas dos desejados do usuário
router.get('/', authMiddleware, promoController.listActive);

export default router;

