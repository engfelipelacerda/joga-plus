import { prisma } from '../../database/connection.js';

class AssessmentModel {
	async create(data) {
		return await prisma.assessments.create({
			data: {
				usuario_id: data.usuario_id,
				jogo_id: data.jogo_id,
				nota: data.nota,
				comentario: data.comentario ?? null,
			},
		});
	}

	async findByUserAndGame(usuario_id, jogo_id) {
		return await prisma.assessments.findUnique({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
			include: {
				jogo: {
					select: {
						titulo: true,
						imagem_url: true,
					},
				},
			},
		});
	}

	async findAllByUser(usuario_id) {
		return await prisma.assessments.findMany({
			where: {
				usuario_id,
			},
			include: {
				jogo: {
					select: {
						titulo: true,
						imagem_url: true,
					},
				},
			},
			orderBy: {
				data_avaliacao: 'desc',
			},
		});
	}

	async getAverageByGame(jogo_id) {
		const result = await prisma.assessments.aggregate({
			where: {
				jogo_id: Number(jogo_id),
			},
			_avg: {
				nota: true,
			},
			_count: {
				id: true,
			},
		});

		return {
			media: result._avg.nota ? Number(result._avg.nota.toFixed(1)) : null,
			total: result._count.id,
		};
	}

	async update(usuario_id, jogo_id, data) {
		return await prisma.assessments.update({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
			data: {
				nota: data.nota,
				comentario: data.comentario ?? null,
				data_avaliacao: new Date(),
			},
		});
	}

	async delete(usuario_id, jogo_id) {
		return await prisma.assessments.delete({
			where: {
				usuario_id_jogo_id: {
					usuario_id: Number(usuario_id),
					jogo_id: Number(jogo_id),
				},
			},
		});
	}
}

export default new AssessmentModel();
