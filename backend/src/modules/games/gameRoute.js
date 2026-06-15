import { Router } from "express";
import gameController from "../controller/gameController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Busca jogos na CheapShark por título (pública)
router.get("/games/search", gameController.search);

// Busca jogo no banco por ID interno (protegida)
router.get("/games/:id", authMiddleware, gameController.buscarPorId);

// Salva ou atualiza jogo no banco (protegida)
router.post("/games", authMiddleware, gameController.salvar);

export default router;