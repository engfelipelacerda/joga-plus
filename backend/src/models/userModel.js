import connection from "../database/connection.js";

class userModel {
  async list() {
    const sql = "SELECT id, username, email, birth_date, created_at FROM users";

    try {
      const [response] = await connection.query(sql);
      console.info("Usuários listados com sucesso.");
      return response;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  }

  async create(user) {
    const sql = `
          INSERT INTO users
          (username, email, birth_date, password)
          VALUES (?, ?, ?, ?);
  `;

    try {
      const values = [
        user.username,
        user.email,
        user.birth_date,
        user.password,
      ];

      const [response] = await connection.query(sql, values);
      console.info("Usuário criado com sucesso.");
      return response;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async update(id, user) {
    try {
      let sql;
      let values;

      if (user.password) {
        sql = `
        UPDATE users
        SET
          username = ?,
          email = ?,
          birth_date = ?,
          password = ?
        WHERE id = ?;
      `;

        values = [
          user.username,
          user.email,
          user.birth_date,
          user.password,
          id,
        ];
      } else {
        sql = `
        UPDATE users
        SET
          username = ?,
          email = ?,
          birth_date = ?
        WHERE id = ?;
      `;

        values = [user.username, user.email, user.birth_date, id];
      }

      const [response] = await connection.query(sql, values);

      return response;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  async delete(id) {
    const sql = `
    DELETE FROM users
      WHERE id = ?;
  `;

    try {
      const [response] = await connection.query(sql, [id]);
      console.info("Usuário removido com sucesso.");
      return response;
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      throw error;
    }
  }
}

export default new userModel();
