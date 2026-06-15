import connection from "../../database/connection.js";

class NotificationModel {
    async create(data) {
        const sql = `
      INSERT INTO notificacao (usuario_id, jogo_id, mensagem)
      VALUES (?, ?, ?);
    `;
        const values = [data.usuario_id, data.jogo_id, data.mensagem];
        const [response] = await connection.query(sql, values);
        return response;
    }

    async findAllByUser(usuario_id) {
        const sql = `
      SELECT n.*, g.titulo, g.imagem_url
      FROM notificacao n
      JOIN jogos g ON n.jogo_id = g.id
      WHERE n.usuario_id = ?
      ORDER BY n.data_envio DESC;
    `;
        const [rows] = await connection.query(sql, [usuario_id]);
        return rows;
    }

    async findUnreadByUser(usuario_id) {
        const sql = `
      SELECT n.*, g.titulo, g.imagem_url
      FROM notificacao n
      JOIN jogos g ON n.jogo_id = g.id
      WHERE n.usuario_id = ? AND n.lida = FALSE
      ORDER BY n.data_envio DESC;
    `;
        const [rows] = await connection.query(sql, [usuario_id]);
        return rows;
    }

    async markAsRead(id, usuario_id) {
        const sql = `
      UPDATE notificacao SET lida = TRUE
      WHERE id = ? AND usuario_id = ?;
    `;
        const [response] = await connection.query(sql, [id, usuario_id]);
        return response;
    }

    async markAllAsRead(usuario_id) {
        const sql = `
      UPDATE notificacao SET lida = TRUE
      WHERE usuario_id = ? AND lida = FALSE;
    `;
        const [response] = await connection.query(sql, [usuario_id]);
        return response;
    }

    async delete(id, usuario_id) {
        const sql = `
      DELETE FROM notificacao
      WHERE id = ? AND usuario_id = ?;
    `;
        const [response] = await connection.query(sql, [id, usuario_id]);
        return response;
    }

    async countUnread(usuario_id) {
        const sql = `
      SELECT COUNT(*) AS total
      FROM notificacao
      WHERE usuario_id = ? AND lida = FALSE;
    `;
        const [rows] = await connection.query(sql, [usuario_id]);
        return rows[0].total;
    }
}

export default new NotificationModel();