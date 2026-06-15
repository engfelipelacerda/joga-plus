import connection from "../../database/connection.js";

class ListModel {
    async create(data) {
        const sql = `
      INSERT INTO lista (usuario_id, jogo_id, tipo_lista, prioridade)
      VALUES (?, ?, ?, ?);
    `;
        const values = [data.usuario_id, data.jogo_id, data.tipo_lista, data.prioridade ?? 1];
        const [response] = await connection.query(sql, values);
        return response;
    }

    async findByUser(usuario_id) {
        const sql = `
      SELECT l.*, g.titulo, g.imagem_url, g.preco_atual, g.menor_preco, g.loja
      FROM lista l
      JOIN jogos g ON l.jogo_id = g.id
      WHERE l.usuario_id = ?
      ORDER BY l.tipo_lista, l.prioridade DESC;
    `;
        const [rows] = await connection.query(sql, [usuario_id]);
        return rows;
    }

    async findByUserAndType(usuario_id, tipo_lista) {
        const sql = `
      SELECT l.*, g.titulo, g.imagem_url, g.preco_atual, g.menor_preco, g.loja
      FROM lista l
      JOIN jogos g ON l.jogo_id = g.id
      WHERE l.usuario_id = ? AND l.tipo_lista = ?
      ORDER BY l.prioridade DESC;
    `;
        const [rows] = await connection.query(sql, [usuario_id, tipo_lista]);
        return rows;
    }

    async findByUserAndGame(usuario_id, jogo_id) {
        const sql = `SELECT * FROM lista WHERE usuario_id = ? AND jogo_id = ?`;
        const [rows] = await connection.query(sql, [usuario_id, jogo_id]);
        return rows[0] || null;
    }

    async updateType(usuario_id, jogo_id, tipo_lista) {
        const sql = `
      UPDATE lista SET tipo_lista = ?
      WHERE usuario_id = ? AND jogo_id = ?;
    `;
        const [response] = await connection.query(sql, [tipo_lista, usuario_id, jogo_id]);
        return response;
    }

    async updatePriority(usuario_id, jogo_id, prioridade) {
        const sql = `
      UPDATE lista SET prioridade = ?
      WHERE usuario_id = ? AND jogo_id = ?;
    `;
        const [response] = await connection.query(sql, [prioridade, usuario_id, jogo_id]);
        return response;
    }

    async delete(usuario_id, jogo_id) {
        const sql = `DELETE FROM lista WHERE usuario_id = ? AND jogo_id = ?;`;
        const [response] = await connection.query(sql, [usuario_id, jogo_id]);
        return response;
    }
}

export default new ListModel();