import { Router } from "express";
import listController from "./listController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Todas protegidas — usuário precisa estar logado
router.get("/list", authMiddleware, listController.listAll);
router.get("/list/:tipo", authMiddleware, listController.listByType);
router.post("/list", authMiddleware, listController.add);
router.patch("/list/move", authMiddleware, listController.moveToList);
router.patch("/list/priority", authMiddleware, listController.updatePriority);
router.delete("/list/:jogo_id", authMiddleware, listController.remove);

export default router;