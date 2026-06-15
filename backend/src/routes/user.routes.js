import express from 'express';
const userRouter = express.Router();

import * as userController from '../controller/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

userRouter.get('/', authMiddleware, userController.list);
userRouter.get('/me', authMiddleware, userController.me);

userRouter.post('/', userController.create);

userRouter.put('/:id', authMiddleware, userController.update);

userRouter.delete('/:id', authMiddleware, userController.remove);

export default userRouter;
