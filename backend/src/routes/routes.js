import express from 'express';
import assessmentsRouter from './assessments.routes.js';
import gamesRouter from './games.routes.js';
import listsRouter from './lists.routes.js';
import loginRouter from './login.routes.js';
import notificationsRouter from './notifications.routes.js';
import promosRouter from './promos.routes.js';
import userRouter from './user.routes.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', loginRouter);

router.use('/games', gamesRouter);
router.use('/lists', listsRouter);
router.use('/assessments', assessmentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/promos', promosRouter);

export default router;
