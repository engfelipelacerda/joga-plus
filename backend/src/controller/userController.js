import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

class userController {
  async list() {
    return await userModel.list();
  }

  async create(user) {
    // adicionando encriptacao na senha
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
    return await userModel.create(user);
  }

  async update(id, user) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
    return await userModel.update(id, user);
  }

  async delete(id) {
    return await userModel.delete(id);
  }
}

export default new userController();
