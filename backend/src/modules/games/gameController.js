import gameModel from './gameModel.js';

const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';
const RAWG_BASE = 'https://api.rawg.io/api';

function normalizeCheapSharkItem(item) {
	return {
		source: 'cheapshark',
		cheapshark_id: item.gameID,
		gameID: item.gameID,
		id: item.gameID,
		title: item.external,
		external: item.external,
		genre: item.genre || 'Busca externa',
		cover: item.thumb || '',
		thumb: item.thumb || '',
		price: Number(item.cheapest) || 0,
		promoPrice: Number(item.cheapest) || 0,
		discount: 0,
	};
}

function normalizeRawgItem(item) {
	return {
		source: 'rawg',
		rawg_id: item.id,
		id: `rawg-${item.id}`,
		title: item.name,
		external: item.name,
		genre: item.genres?.map((genre) => genre.name).join(' | ') || 'Aventura',
		cover: item.background_image || '',
		thumb: item.background_image || '',
		price: 0,
		promoPrice: 0,
		discount: 0,
	};
}

function isValidCheapSharkId(value) {
	return value !== null && value !== undefined && /^\d+$/.test(String(value));
}

async function findCheapSharkIdByTitle(title) {
	const response = await fetch(
		`${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(title)}&limit=1`,
		{ headers: { 'User-Agent': 'JogaPlus/1.0' } },
	);
	const data = await response.json();
	if (!Array.isArray(data) || data.length === 0) return null;
	return data[0].gameID;
}

async function fetchCheapSharkGame(cheapshark_id) {
	const response = await fetch(`${CHEAPSHARK_BASE}/games?id=${cheapshark_id}`, {
		headers: { 'User-Agent': 'JogaPlus/1.0' },
	});

	if (!response.ok) return null;

	const data = await response.json();
	if (!data || !data.info) return null;
	return data;
}

// Busca jogos na CheapShark e em outras APIs pelo título
const search = async (req, res) => {
	const { titulo } = req.query;

	if (!titulo) {
		return res.status(400).json({ message: 'Informe o título do jogo.' });
	}

	try {
		const cheapsharkResponse = await fetch(
			`${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(titulo)}&limit=10`,
			{ headers: { 'User-Agent': 'JogaPlus/1.0' } },
		);
		const cheapsharkData = await cheapsharkResponse.json();
		const cheapsharkResults = Array.isArray(cheapsharkData)
			? cheapsharkData.map(normalizeCheapSharkItem)
			: [];

		let rawgResults = [];
		try {
			const rawgResponse = await fetch(
				`${RAWG_BASE}/games?search=${encodeURIComponent(titulo)}&page_size=6`,
			);
			if (rawgResponse.ok) {
				const rawgData = await rawgResponse.json();
				rawgResults = Array.isArray(rawgData.results)
					? rawgData.results.map(normalizeRawgItem)
					: [];
			}
		} catch (rawgError) {
			console.warn('Rawg search falhou:', rawgError.message || rawgError);
		}

		const merged = [...cheapsharkResults, ...rawgResults];
		const seen = new Set();
		const unique = [];

		for (const item of merged) {
			const key = item.title?.trim().toLowerCase();
			if (!key || seen.has(key)) continue;
			seen.add(key);
			unique.push(item);
		}

		return res.status(200).json(unique.slice(0, 14));
	} catch (error) {
		console.error('Erro ao buscar jogos:', error);
		return res.status(500).json({ message: 'Erro ao buscar jogos.' });
	}
};

// Salva ou atualiza um jogo no banco a partir do cheapshark_id ou título
const salvar = async (req, res) => {
	let { cheapshark_id, title, titulo } = req.body;
	const searchTitle = (title ?? titulo ?? '').trim();

	if (!cheapshark_id && !searchTitle) {
		return res
			.status(400)
			.json({ message: 'Informe o cheapshark_id ou o título do jogo.' });
	}

	try {
		// Resultados vindos da RAWG chegam com id tipo "rawg-123".
		// CheapShark só aceita IDs numéricos, então nesses casos buscamos pelo título.
		if (!isValidCheapSharkId(cheapshark_id)) {
			cheapshark_id = searchTitle ? await findCheapSharkIdByTitle(searchTitle) : null;
		}

		if (!cheapshark_id) {
			return res
				.status(404)
				.json({ message: 'Jogo não encontrado na CheapShark para salvar.' });
		}

		let data = await fetchCheapSharkGame(cheapshark_id);

		// Fallback: caso o ID recebido esteja inválido/desatualizado, tenta pelo título.
		if (!data && searchTitle) {
			const fallbackId = await findCheapSharkIdByTitle(searchTitle);
			if (fallbackId) {
				cheapshark_id = fallbackId;
				data = await fetchCheapSharkGame(cheapshark_id);
			}
		}

		if (!data) {
			return res
				.status(404)
				.json({ message: 'Jogo não encontrado na CheapShark.' });
		}

		const game = {
			cheapshark_id: String(cheapshark_id),
			titulo: data.info.title,
			imagem_url: data.info.thumb,
			preco_atual: parseFloat(data.deals?.[0]?.price) || null,
			menor_preco: parseFloat(data.cheapestPriceEver?.price) || null,
			loja: data.deals?.[0]?.storeID || null,
		};

		const existing = await gameModel.findByCheapsharkId(cheapshark_id);

		if (existing) {
			const updatedGame = await gameModel.update(cheapshark_id, game);
			return res.status(200).json({
				message: 'Jogo atualizado com sucesso.',
				game: updatedGame,
			});
		}

		const createdGame = await gameModel.create(game);
		return res
			.status(201)
			.json({ message: 'Jogo salvo com sucesso.', game: createdGame });
	} catch (error) {
		console.error('Erro ao salvar jogo:', error);
		return res.status(500).json({ message: 'Erro ao salvar jogo.' });
	}
};

// Busca um jogo no banco pelo ID interno
const buscarPorId = async (req, res) => {
	const { id } = req.params;
	try {
		const game = await gameModel.findById(id);
		if (!game) return res.status(404).json({ message: 'Jogo não encontrado.' });
		return res.status(200).json(game);
	} catch (error) {
		console.error('Erro ao buscar jogo:', error);
		return res.status(500).json({ message: 'Erro ao buscar jogo.' });
	}
};

export default { search, salvar, buscarPorId };
