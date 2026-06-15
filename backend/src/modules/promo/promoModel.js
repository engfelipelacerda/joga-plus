import connection from "../../database/connection.js";

class PromoModel {
    async create(data) {
        const sql = `
      INSERT INTO promocao (jogo_id, preco_promocional, preco_normal, loja, deal_id)
      VALUES (?, ?, ?, ?, ?);
    `;
        const values = [
            data.jogo_id,
            data.preco_promocional,
            data.preco_normal,
            data.loja,
            data.deal_id,
        ];
        const [response] = await connection.query(sql, values);
        return response;
    }

    async findByDealId(deal_id) {
        const sql = `SELECT * FROM promocao WHERE deal_id = ?`;
        const [rows] = await connection.query(sql, [deal_id]);
        return rows[0] || null;
    }

    async findActiveByGame(jogo_id) {
        const sql = `
      SELECT * FROM promocao
      WHERE jogo_id = ? AND (data_fim IS NULL OR data_fim > NOW())
      ORDER BY data_inicio DESC
      LIMIT 1;
    `;
        const [rows] = await connection.query(sql, [jogo_id]);
        return rows[0] || null;
    }

    async findAllActiveForUser(usuario_id) {
        const sql = `
      SELECT p.*, g.titulo, g.imagem_url, l.prioridade
      FROM promocao p
      JOIN jogos g ON p.jogo_id = g.id
      JOIN lista l ON l.jogo_id = g.id
      WHERE l.usuario_id = ?
        AND l.tipo_lista = 'desejados'
        AND (p.data_fim IS NULL OR p.data_fim > NOW())
      ORDER BY l.prioridade DESC;
    `;
        const [rows] = await connection.query(sql, [usuario_id]);
        return rows;
    }

    async expire(deal_id) {
        const sql = `
      UPDATE promocao SET data_fim = NOW()
      WHERE deal_id = ?;
    `;
        const [response] = await connection.query(sql, [deal_id]);
        return response;
    }
}

export default new PromoModel();