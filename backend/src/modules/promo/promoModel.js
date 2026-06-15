import { prisma } from '../../database/connection.js';

class PromoModel {
	async create(data) {
		return await prisma.promos.create({
			data: {
				jogo_id: data.jogo_id,
				preco_promocional: data.preco_promocional,
				preco_normal: data.preco_normal ?? null,
				loja: data.loja ?? null,
				deal_id: data.deal_id ?? null,
			},
		});
	}

	async findByDealId(deal_id) {
		return await prisma.promos.findFirst({
			where: { deal_id },
		});
	}

	async findActiveByGame(jogo_id) {
		return await prisma.promos.findFirst({
			where: {
				jogo_id: Number(jogo_id),
				OR: [{ data_fim: null }, { data_fim: { gt: new Date() } }],
			},
			orderBy: { data_inicio: 'desc' },
		});
	}

	async findAllActiveForUser(usuario_id) {
		return await prisma.promos.findMany({
			where: {
				OR: [{ data_fim: null }, { data_fim: { gt: new Date() } }],
				jogo: {
					lists: {
						some: {
							usuario_id,
							tipo_lista: 'desejados',
						},
					},
				},
			},
			include: {
				jogo: {
					select: {
						titulo: true,
						imagem_url: true,
						lists: {
							where: { usuario_id },
							select: { prioridade: true },
						},
					},
				},
			},
			orderBy: {
				jogo: { lists: { _count: 'desc' } },
			},
		});
	}

	async expire(deal_id) {
		return await prisma.promos.updateMany({
			where: { deal_id },
			data: { data_fim: new Date() },
		});
	}
}

export default new PromoModel();

