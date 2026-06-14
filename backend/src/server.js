import express from "express"; // chamar o servidor express
import app from "./app.js";

const port = 3333;

app.listen(port, (error) => {
  if (error) {
    console.log("Express deu erro!");
    return;
  }
  console.log("Express subiu!");
}); // porta para o servidor ler/ouvir
