class Tables {
  init(connection) {
    this.connection = connection;
    this.createTableUsers();
  }

  async createTableUsers() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        birth_date DATE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
     `;
    try {
      await this.connection.query(sql);
      console.log("Tabela users verificada com sucesso");
    } catch (error) {
      console.log("Deu erro na hora de criar a tabela users");
      console.log(error.message);
    }
  }
}

export default new Tables();
