import { Router } from "express";
import assessmentController from "./assessmentController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/assessment", authMiddleware, assessmentController.listAll);
router.get("/assessment/:jogo_id", authMiddleware, assessmentController.getByGame);
router.post("/assessment", authMiddleware, assessmentController.create);
router.patch("/assessment", authMiddleware, assessmentController.update);
router.delete("/assessment/:jogo_id", authMiddleware, assessmentController.remove);

export default router;