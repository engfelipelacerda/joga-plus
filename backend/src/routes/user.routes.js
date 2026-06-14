import express from "express";
const userRouter = express.Router();
import userController from "../controller/userController.js";
import validateUser from "../utils/validateUser.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// get, post, put, delete
// quando alguém acessar tal URL execute essa função.
userRouter.get("/", authMiddleware, userController.list);

userRouter.post("/", async (req, res) => {
  try {
    const user = req.body;

    // validate before saving the new user
    const validation = validateUser(user);
    if (validation) {
      return res.status(400).json(validation);
    }

    const response = await userController.create(user);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Erro ao cadastrar usuário.",
    });
  }
});

userRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;

    // validate before saving the new client
    const validation = validateUser(user, true);
    if (validation) {
      return res.status(400).json(validation);
    }

    const response = await userController.update(id, user);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Erro ao atualizar usuário.",
    });
  }
});

userRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await userController.delete(id);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Erro ao remover usuário.",
    });
  }
});

export default userRouter;
