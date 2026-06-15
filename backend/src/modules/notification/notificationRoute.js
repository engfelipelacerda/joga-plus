import { Router } from "express";
import notificationController from "./notificationController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Todas protegidas
router.get("/notification", authMiddleware, notificationController.listAll);
router.get("/notification/unread", authMiddleware, notificationController.listUnread);
router.patch("/notification/:id/read", authMiddleware, notificationController.markAsRead);
router.patch("/notification/read-all", authMiddleware, notificationController.markAllAsRead);
router.delete("/notification/:id", authMiddleware, notificationController.remove);

export default router;