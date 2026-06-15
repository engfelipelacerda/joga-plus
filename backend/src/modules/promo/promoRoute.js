import { Router } from "express";
import promoController from "./promoController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Consulta CheapShark e salva promoções dos desejados do usuário
router.post("/promo/check", authMiddleware, promoController.checkPromos);

// Lista promoções ativas dos desejados do usuário
router.get("/promo", authMiddleware, promoController.listActive);

export default router;