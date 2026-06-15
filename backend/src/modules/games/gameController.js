import gameModel from "../models/gameModel.js";

const CHEAPSHARK_BASE = "https://www.cheapshark.com/api/1.0";

// Busca jogos na CheapShark pelo título (sem salvar no banco)
const search = async (req, res) => {
    const { titulo } = req.query;

    if (!titulo) {
        return res.status(400).json({ message: "Informe o título do jogo." });
    }

    try {
        const response = await fetch(
            `${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(titulo)}&limit=10`,
            { headers: { "User-Agent": "JogaPlus/1.0" } }
        );
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar na CheapShark:", error);
        return res.status(500).json({ message: "Erro ao buscar jogos." });
    }
};

// Salva ou atualiza um jogo no banco a partir do cheapshark_id
const salvar = async (req, res) => {
    const { cheapshark_id } = req.body;

    if (!cheapshark_id) {
        return res.status(400).json({ message: "Informe o cheapshark_id." });
    }

    try {
        const response = await fetch(
            `${CHEAPSHARK_BASE}/games?id=${cheapshark_id}`,
            { headers: { "User-Agent": "JogaPlus/1.0" } }
        );
        const data = await response.json();

        if (!data || !data.info) {
            return res.status(404).json({ message: "Jogo não encontrado na CheapShark." });
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
            await gameModel.update(cheapshark_id, game);
            return res.status(200).json({ message: "Jogo atualizado com sucesso.", game: { ...existing, ...game } });
        }

        await gameModel.create(game);
        return res.status(201).json({ message: "Jogo salvo com sucesso.", game });
    } catch (error) {
        console.error("Erro ao salvar jogo:", error);
        return res.status(500).json({ message: "Erro ao salvar jogo." });
    }
};

// Busca um jogo no banco pelo ID interno
const buscarPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await gameModel.findById(id);
        if (!game) return res.status(404).json({ message: "Jogo não encontrado." });
        return res.status(200).json(game);
    } catch (error) {
        console.error("Erro ao buscar jogo:", error);
        return res.status(500).json({ message: "Erro ao buscar jogo." });
    }
};

export default { search, salvar, buscarPorId };