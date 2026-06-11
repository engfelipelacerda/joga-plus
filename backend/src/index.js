import express from "express"; // chamar o servidor express
import dotenv from "dotenv";
dotenv.config();

const app = express(); // atribuir a variável app para usar o express;
const port = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import connection from "./database/connection.js";
import tables from "./database/tables.js";

import userRouter from "./routes/userRoute.js";
import loginRouter from "./routes/loginRoute.js";

tables.init(connection);

// todas as rotas dentro de sourceRoute vão começar em /
app.use("/users", userRouter);
app.use("/auth", loginRouter);

app.listen(port, (error) => {
  if (error) {
    console.log("Express deu erro!");
    return;
  }
  console.log("Express subiu!");
}); // porta para o servidor ler/ouvir
