import { Router } from 'express';
import notificationController from '../modules/notification/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, notificationController.listAll);
router.get('/unread', authMiddleware, notificationController.listUnread);
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead);
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);
router.delete('/:id', authMiddleware, notificationController.remove);

export default router;
