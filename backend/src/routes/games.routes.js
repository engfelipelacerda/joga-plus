import { Router } from 'express';
import gameController from '../modules/games/gameController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Busca jogos na CheapShark por título (pública)
router.get('/search', gameController.search);

// Busca jogo no banco por ID interno (protegida)
router.get('/:id', authMiddleware, gameController.buscarPorId);

// Salva ou atualiza jogo no banco (protegida)
router.post('/', authMiddleware, gameController.salvar);

export default router;
