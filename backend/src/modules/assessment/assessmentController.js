import assessmentModel from './assessmentModel.js';
import listModel from '../list/listModel.js';

// Cria avaliação — só pode avaliar jogos da lista "jogados"
const create = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id, nota, comentario } = req.body;

	if (!jogo_id || nota === undefined) {
		return res.status(400).json({ message: 'Informe jogo_id e nota.' });
	}

	if (nota < 0 || nota > 5) {
		return res.status(400).json({ message: 'Nota deve ser entre 0 e 5.' });
	}

	if (comentario && comentario.length > 500) {
		return res
			.status(400)
			.json({ message: 'Comentário não pode exceder 500 caracteres.' });
	}

	try {
		// Verifica se o jogo está na lista "jogados"
		const inList = await listModel.findByUserAndGame(usuario_id, jogo_id);
		if (!inList || inList.tipo_lista !== 'jogados') {
			return res
				.status(403)
				.json({ message: "Você só pode avaliar jogos da lista 'jogados'." });
		}

		// Verifica se já existe avaliação
		const existing = await assessmentModel.findByUserAndGame(usuario_id, jogo_id);
		if (existing) {
			return res
				.status(409)
				.json({ message: 'Você já avaliou esse jogo. Use o método de edição.' });
		}

		await assessmentModel.create({ usuario_id, jogo_id, nota, comentario });
		return res.status(201).json({ message: 'Avaliação criada com sucesso.' });
	} catch (error) {
		console.error('Erro ao criar avaliação:', error);
		return res.status(500).json({ message: 'Erro ao criar avaliação.' });
	}
};

// Lista todas as avaliações do usuário
const listAll = async (req, res) => {
	const usuario_id = req.user.id;
	try {
		const assessments = await assessmentModel.findAllByUser(usuario_id);
		return res.status(200).json(assessments);
	} catch (error) {
		console.error('Erro ao listar avaliações:', error);
		return res.status(500).json({ message: 'Erro ao listar avaliações.' });
	}
};

// Busca avaliação de um jogo específico + média geral
const getByGame = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id } = req.params;
	try {
		const assessment = await assessmentModel.findByUserAndGame(
			usuario_id,
			jogo_id,
		);
		const average = await assessmentModel.getAverageByGame(jogo_id);
		return res.status(200).json({ assessment, average });
	} catch (error) {
		console.error('Erro ao buscar avaliação:', error);
		return res.status(500).json({ message: 'Erro ao buscar avaliação.' });
	}
};

// Edita avaliação existente
const update = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id, nota, comentario } = req.body;

	if (!jogo_id || nota === undefined) {
		return res.status(400).json({ message: 'Informe jogo_id e nota.' });
	}

	if (nota < 0 || nota > 5) {
		return res.status(400).json({ message: 'Nota deve ser entre 0 e 5.' });
	}

	if (comentario && comentario.length > 500) {
		return res
			.status(400)
			.json({ message: 'Comentário não pode exceder 500 caracteres.' });
	}

	try {
		const existing = await assessmentModel.findByUserAndGame(usuario_id, jogo_id);
		if (!existing)
			return res.status(404).json({ message: 'Avaliação não encontrada.' });

		await assessmentModel.update(usuario_id, jogo_id, { nota, comentario });
		return res.status(200).json({ message: 'Avaliação atualizada com sucesso.' });
	} catch (error) {
		console.error('Erro ao atualizar avaliação:', error);
		return res.status(500).json({ message: 'Erro ao atualizar avaliação.' });
	}
};

// Remove avaliação
const remove = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id } = req.params;
	try {
		const existing = await assessmentModel.findByUserAndGame(usuario_id, jogo_id);
		if (!existing)
			return res.status(404).json({ message: 'Avaliação não encontrada.' });
		await assessmentModel.delete(usuario_id, jogo_id);
		return res.status(200).json({ message: 'Avaliação removida com sucesso.' });
	} catch (error) {
		console.error('Erro ao remover avaliação:', error);
		return res.status(500).json({ message: 'Erro ao remover avaliação.' });
	}
};

export default { create, listAll, getByGame, update, remove };

