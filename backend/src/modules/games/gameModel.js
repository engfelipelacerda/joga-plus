import { prisma } from '../../database/connection.js';

class GameModel {
	async findByCheapsharkId(cheapshark_id) {
		return await prisma.games.findUnique({
			where: { cheapshark_id: String(cheapshark_id) },
		});
	}

	async findById(id) {
		return await prisma.games.findUnique({
			where: { id: Number(id) },
		});
	}

	async create(game) {
		return await prisma.games.create({ data: game });
	}

	async update(cheapshark_id, game) {
		return await prisma.games.update({
			where: { cheapshark_id: String(cheapshark_id) },
			data: {
				preco_atual: game.preco_atual,
				menor_preco: game.menor_preco,
				loja: game.loja,
			},
		});
	}
}

export default new GameModel();

