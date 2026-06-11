import express from "express";
import bcrypt from "bcrypt";
import connection from "../database/connection.js";
import jwt from "jsonwebtoken";
const loginRouter = express.Router();
import dotenv from "dotenv";

dotenv.config();

loginRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    const [response] = await connection.query(sql, [username]);

    if (!response.length) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    const validPassword = await bcrypt.compare(password, response[0].password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Usuário ou senha inválidos",
      });
    }

    const token = jwt.sign({ id: response[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Erro interno do servidor",
    });
  }
});

export default loginRouter;
