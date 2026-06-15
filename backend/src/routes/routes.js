import express from 'express';

import userRouter from './user.routes.js';
import loginRouter from './login.routes.js';

const router = express.Router();

// todas as rotas dentro de sourceRoute vão começar em /
router.use('/users', userRouter);
router.use('/auth', loginRouter);

export default router;
