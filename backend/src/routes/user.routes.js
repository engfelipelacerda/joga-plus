import express from "express";
const userRouter = express.Router();
import {create,list,update,remove} from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// get, post, put, delete
// quando alguém acessar tal URL execute essa função.
userRouter.get("/", authMiddleware, list);

userRouter.post("/",create);

userRouter.put("/:id", authMiddleware,update);

userRouter.delete("/:id", authMiddleware, remove);

export default userRouter;
