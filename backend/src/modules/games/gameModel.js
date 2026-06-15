import connection from "../../database/connection.js";

class GameModel {
    async findByCheapsharkId(cheapshark_id) {
        const sql = `SELECT * FROM games WHERE cheapshark_id = ?`;
        const [rows] = await connection.query(sql, [cheapshark_id]);
        return rows[0] || null;
    }

    async findById(id) {
        const sql = `SELECT * FROM games WHERE id = ?`;
        const [rows] = await connection.query(sql, [id]);
        return rows[0] || null;
    }

    async create(game) {
        const sql = `
      INSERT INTO games
        (cheapshark_id, titulo, imagem_url, preco_atual, menor_preco, loja)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
        const values = [
            game.cheapshark_id,
            game.titulo,
            game.imagem_url,
            game.preco_atual,
            game.menor_preco,
            game.loja,
        ];
        const [response] = await connection.query(sql, values);
        return response;
    }

    async update(cheapshark_id, game) {
        const sql = `
      UPDATE games SET
        preco_atual = ?,
        menor_preco = ?,
        loja = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE cheapshark_id = ?;
    `;
        const values = [
            game.preco_atual,
            game.menor_preco,
            game.loja,
            cheapshark_id,
        ];
        const [response] = await connection.query(sql, values);
        return response;
    }
}

export default new GameModel();