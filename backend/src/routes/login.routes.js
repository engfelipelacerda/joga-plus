import express from 'express';
const loginRouter = express.Router();
import dotenv from 'dotenv';
import { signIn } from '../controller/loginController.js';

dotenv.config();

loginRouter.post('/login', signIn);

export default loginRouter;
