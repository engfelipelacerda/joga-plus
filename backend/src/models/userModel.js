import connection from "../database/connection.js";

class userModel {
  async list() {
    const sql = "SELECT * FROM users";

    try {
      const [response] = await connection.query(sql);
      console.log("funcionou o listar!");
      return response;
    } catch (error) {
      console.log("Deu erro no listar!");
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
      console.log("Funcionou o create!");
      return response;
    } catch (error) {
      console.log("Deu erro no create!");
      throw error;
    }
  }

  async update(id, user) {
    const sql = `
    UPDATE users
      SET
        username = ?,
        email = ?,
        birth_date = ?,
        password = ?
      WHERE id = ?;
    `;
    const values = [
      user.username,
      user.email,
      user.birth_date,
      user.password,
      id,
    ];
    try {
      const [response] = await connection.query(sql, values);

      console.log("Funcionou o update!");

      return response;
    } catch (error) {
      console.log("Deu erro no update!");
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

      console.log("Funcionou o delete!");

      return response;
    } catch (error) {
      console.log("Deu erro no delete!");

      throw error;
    }
  }
}

export default new userModel();
