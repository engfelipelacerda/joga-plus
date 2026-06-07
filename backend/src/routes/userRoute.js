import express from "express";
const userRouter = express.Router();
import userController from "../controller/userController.js";
import validateUser from "../utils/validateUser.js";

// get, post, put, delete
// quando alguém acessar tal URL execute essa função.
userRouter.get("/users", async (req, res) => {
  try {
    const listUsers = await userController.list();

    return res.status(200).json(listUsers);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

userRouter.post("/users", async (req, res) => {
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
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

userRouter.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;

    // validate before saving the new client
    const validation = validateUser(user);
    if (validation) {
      return res.status(400).json(validation);
    }

    const response = await userController.update(id, user);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await userController.delete(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

export default userRouter;
