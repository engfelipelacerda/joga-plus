import listModel from './listModel.js';
import gameModel from '../games/gameModel.js';

const VALID_TYPES = ['desejados', 'nao_jogados', 'jogados', 'jogar_novamente'];

// Adiciona jogo à lista do usuário
const add = async (req, res) => {
	const usuario_id = req.user.id; // vem do authMiddleware
	const { jogo_id, tipo_lista, prioridade } = req.body;

	if (!jogo_id || !tipo_lista) {
		return res.status(400).json({ message: 'Informe jogo_id e tipo_lista.' });
	}

	if (!VALID_TYPES.includes(tipo_lista)) {
		return res
			.status(400)
			.json({ message: `tipo_lista deve ser um dos: ${VALID_TYPES.join(', ')}.` });
	}

	if (prioridade && (prioridade < 1 || prioridade > 5)) {
		return res.status(400).json({ message: 'Prioridade deve ser entre 1 e 5.' });
	}

	try {
		const jogo = await gameModel.findById(jogo_id);
		if (!jogo)
			return res.status(404).json({ message: 'Jogo não encontrado no banco.' });

		const existing = await listModel.findByUserAndGame(usuario_id, jogo_id);
		if (existing)
			return res.status(409).json({ message: 'Jogo já está na sua lista.' });

		await listModel.create({ usuario_id, jogo_id, tipo_lista, prioridade });
		return res
			.status(201)
			.json({ message: 'Jogo adicionado à lista com sucesso.' });
	} catch (error) {
		console.error('Erro ao adicionar jogo à lista:', error);
		return res.status(500).json({ message: 'Erro ao adicionar jogo à lista.' });
	}
};

// Lista todos os jogos do usuário (todas as listas)
const listAll = async (req, res) => {
	const usuario_id = req.user.id;
	try {
		const items = await listModel.findByUser(usuario_id);
		return res.status(200).json(items);
	} catch (error) {
		console.error('Erro ao listar jogos:', error);
		return res.status(500).json({ message: 'Erro ao listar jogos.' });
	}
};

// Lista jogos de um tipo específico
const listByType = async (req, res) => {
	const usuario_id = req.user.id;
	const { tipo } = req.params;

	if (!VALID_TYPES.includes(tipo)) {
		return res
			.status(400)
			.json({ message: `tipo deve ser um dos: ${VALID_TYPES.join(', ')}.` });
	}

	try {
		const items = await listModel.findByUserAndType(usuario_id, tipo);
		return res.status(200).json(items);
	} catch (error) {
		console.error('Erro ao listar jogos por tipo:', error);
		return res.status(500).json({ message: 'Erro ao listar jogos.' });
	}
};

// Move jogo de uma lista para outra
const moveToList = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id, tipo_lista } = req.body;

	if (!jogo_id || !tipo_lista) {
		return res.status(400).json({ message: 'Informe jogo_id e tipo_lista.' });
	}

	if (!VALID_TYPES.includes(tipo_lista)) {
		return res
			.status(400)
			.json({ message: `tipo_lista deve ser um dos: ${VALID_TYPES.join(', ')}.` });
	}

	try {
		const existing = await listModel.findByUserAndGame(usuario_id, jogo_id);
		if (!existing)
			return res
				.status(404)
				.json({ message: 'Jogo não encontrado na sua lista.' });

		await listModel.updateType(usuario_id, jogo_id, tipo_lista);
		return res.status(200).json({ message: 'Jogo movido com sucesso.' });
	} catch (error) {
		console.error('Erro ao mover jogo:', error);
		return res.status(500).json({ message: 'Erro ao mover jogo.' });
	}
};

// Atualiza prioridade de um jogo
const updatePriority = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id, prioridade } = req.body;

	if (!jogo_id || !prioridade) {
		return res.status(400).json({ message: 'Informe jogo_id e prioridade.' });
	}

	if (prioridade < 1 || prioridade > 5) {
		return res.status(400).json({ message: 'Prioridade deve ser entre 1 e 5.' });
	}

	try {
		const existing = await listModel.findByUserAndGame(usuario_id, jogo_id);
		if (!existing)
			return res
				.status(404)
				.json({ message: 'Jogo não encontrado na sua lista.' });

		await listModel.updatePriority(usuario_id, jogo_id, prioridade);
		return res
			.status(200)
			.json({ message: 'Prioridade atualizada com sucesso.' });
	} catch (error) {
		console.error('Erro ao atualizar prioridade:', error);
		return res.status(500).json({ message: 'Erro ao atualizar prioridade.' });
	}
};

// Remove jogo da lista
const remove = async (req, res) => {
	const usuario_id = req.user.id;
	const { jogo_id } = req.params;

	try {
		const existing = await listModel.findByUserAndGame(usuario_id, jogo_id);
		if (!existing)
			return res
				.status(404)
				.json({ message: 'Jogo não encontrado na sua lista.' });

		await listModel.delete(usuario_id, jogo_id);
		return res
			.status(200)
			.json({ message: 'Jogo removido da lista com sucesso.' });
	} catch (error) {
		console.error('Erro ao remover jogo:', error);
		return res.status(500).json({ message: 'Erro ao remover jogo.' });
	}
};

export default { add, listAll, listByType, moveToList, updatePriority, remove };

