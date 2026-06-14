import express from "express";
import bcrypt from "bcrypt";

import userModel from "../models/userModel.js";
import validateUser from "../utils/validateUser.js";

export async function list(req,res) {
    try {
      const listUsers = await userModel.list()
      return res.status(200).json(listUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: true,
          message: "Erro ao listar usuários.",
        });
  } 
}

export async function create(req,res) {
    try {
      const user = req.body;

      // validate before saving the new user
      const validation = validateUser(user);
      if (validation) {
        return res.status(400).json(validation);
      }

      // adicionando encriptacao na senha
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;

      const response = await userModel.create(user);
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Erro ao cadastrar usuário.",
    });
  }
}

export async function update(req,res) {
    try {
      const { id } = req.params;
      const user = req.body;

      // validate before saving the new client
      const validation = validateUser(user, true);
      if (validation) {
        return res.status(400).json(validation);
      }

      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }

      const response = await userModel.update(id, user);
      return res.status(200).json(response);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: true,
        message: "Erro ao atualizar usuário.",
      });
    }
}

export async function remove(req,res) {
    try {
      const { id } = req.params;
      const response =await userModel.delete(id);
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: true,
        message: "Erro ao remover usuário.",
      });
    }
  }



