import { prisma } from '../../database/connection.js';

function normalizeListRow(row) {
	return {
		id: Number(row.id),
		usuario_id: Number(row.usuario_id),
		jogo_id: Number(row.jogo_id),
		tipo_lista: row.tipo_lista,
		prioridade: Number(row.prioridade ?? 1),
		status: row.status ?? 'quer_jogar',
		added_at: row.added_at,
		jogo: {
			titulo: row.titulo,
			imagem_url: row.imagem_url,
			preco_atual: row.preco_atual,
			menor_preco: row.menor_preco,
			loja: row.loja,
		},
	};
}

class ListModel {
	async create(data) {
		const usuario_id = Number(data.usuario_id);
		const jogo_id = Number(data.jogo_id);
		const prioridade = Number(data.prioridade ?? 1);
		const status = data.status ?? 'quer_jogar';

		await prisma.$executeRaw`
			INSERT INTO lists (usuario_id, jogo_id, tipo_lista, prioridade, status)
			VALUES (${usuario_id}, ${jogo_id}, ${data.tipo_lista}, ${prioridade}, ${status})
		`;

		return this.findByUserAndGame(usuario_id, jogo_id);
	}

	async findByUser(usuario_id) {
		const rows = await prisma.$queryRaw`
			SELECT
				l.id,
				l.usuario_id,
				l.jogo_id,
				l.tipo_lista,
				l.prioridade,
				COALESCE(l.status, 'quer_jogar') AS status,
				l.added_at,
				g.titulo,
				g.imagem_url,
				g.preco_atual,
				g.menor_preco,
				g.loja
			FROM lists l
			INNER JOIN games g ON g.id = l.jogo_id
			WHERE l.usuario_id = ${Number(usuario_id)}
			ORDER BY l.tipo_lista ASC, l.prioridade DESC, l.added_at DESC
		`;

		return rows.map(normalizeListRow);
	}

	async findByUserAndType(usuario_id, tipo_lista) {
		const rows = await prisma.$queryRaw`
			SELECT
				l.id,
				l.usuario_id,
				l.jogo_id,
				l.tipo_lista,
				l.prioridade,
				COALESCE(l.status, 'quer_jogar') AS status,
				l.added_at,
				g.titulo,
				g.imagem_url,
				g.preco_atual,
				g.menor_preco,
				g.loja
			FROM lists l
			INNER JOIN games g ON g.id = l.jogo_id
			WHERE l.usuario_id = ${Number(usuario_id)} AND l.tipo_lista = ${tipo_lista}
			ORDER BY l.prioridade DESC, l.added_at DESC
		`;

		return rows.map(normalizeListRow);
	}

	async findByUserAndGame(usuario_id, jogo_id) {
		const rows = await prisma.$queryRaw`
			SELECT
				id,
				usuario_id,
				jogo_id,
				tipo_lista,
				prioridade,
				COALESCE(status, 'quer_jogar') AS status,
				added_at
			FROM lists
			WHERE usuario_id = ${Number(usuario_id)} AND jogo_id = ${Number(jogo_id)}
			LIMIT 1
		`;

		return rows[0] ?? null;
	}

	async updateType(usuario_id, jogo_id, tipo_lista) {
		await prisma.$executeRaw`
			UPDATE lists
			SET tipo_lista = ${tipo_lista}
			WHERE usuario_id = ${Number(usuario_id)} AND jogo_id = ${Number(jogo_id)}
		`;

		return this.findByUserAndGame(usuario_id, jogo_id);
	}

	async updatePriority(usuario_id, jogo_id, prioridade) {
		await prisma.$executeRaw`
			UPDATE lists
			SET prioridade = ${Number(prioridade)}
			WHERE usuario_id = ${Number(usuario_id)} AND jogo_id = ${Number(jogo_id)}
		`;

		return this.findByUserAndGame(usuario_id, jogo_id);
	}

	async updateStatus(usuario_id, jogo_id, status) {
		await prisma.$executeRaw`
			UPDATE lists
			SET status = ${status}, tipo_lista = 'backlog'
			WHERE usuario_id = ${Number(usuario_id)} AND jogo_id = ${Number(jogo_id)}
		`;

		return this.findByUserAndGame(usuario_id, jogo_id);
	}

	async delete(usuario_id, jogo_id) {
		await prisma.$executeRaw`
			DELETE FROM lists
			WHERE usuario_id = ${Number(usuario_id)} AND jogo_id = ${Number(jogo_id)}
		`;

		return { usuario_id: Number(usuario_id), jogo_id: Number(jogo_id) };
	}
}

export default new ListModel();
