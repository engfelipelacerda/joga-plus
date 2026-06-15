import express from 'express';
import bcrypt from 'bcrypt';
import connection from '../database/connection.js';
import jwt from 'jsonwebtoken';
const loginRouter = express.Router();
import dotenv from 'dotenv';
import { signIn } from '../controller/loginController.js';

dotenv.config();

loginRouter.post('/login', signIn);

export default loginRouter;
