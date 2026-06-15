import { prisma } from '../../database/connection.js';

class ListModel {
	async create(data) {
		return await prisma.lists.create({
			data: {
				usuario_id: data.usuario_id,
				jogo_id: data.jogo_id,
				tipo_lista: data.tipo_lista,
				prioridade: data.prioridade ?? 1,
			},
		});
	}

	async findByUser(usuario_id) {
		return await prisma.lists.findMany({
			where: { usuario_id },
			include: {
				jogo: {
					select: {
						titulo: true,
						imagem_url: true,
						preco_atual: true,
						menor_preco: true,
						loja: true,
					},
				},
			},
			orderBy: [{ tipo_lista: 'asc' }, { prioridade: 'desc' }],
		});
	}

	async findByUserAndType(usuario_id, tipo_lista) {
		return await prisma.lists.findMany({
			where: { usuario_id, tipo_lista },
			include: {
				jogo: {
					select: {
						titulo: true,
						imagem_url: true,
						preco_atual: true,
						menor_preco: true,
						loja: true,
					},
				},
			},
			orderBy: { prioridade: 'desc' },
		});
	}

	async findByUserAndGame(usuario_id, jogo_id) {
		return await prisma.lists.findUnique({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
		});
	}

	async updateType(usuario_id, jogo_id, tipo_lista) {
		return await prisma.lists.update({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
			data: { tipo_lista },
		});
	}

	async updatePriority(usuario_id, jogo_id, prioridade) {
		return await prisma.lists.update({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
			data: { prioridade: Number(prioridade) },
		});
	}

	async delete(usuario_id, jogo_id) {
		return await prisma.lists.delete({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
		});
	}
}

export default new ListModel();

