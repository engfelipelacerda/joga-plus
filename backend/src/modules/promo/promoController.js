import promoModel from "./promoModel.js";
import gameModel from "./gameModel.js";
import listModel from "../list/listModel.js";
import notificationModel from "../notification/notificationModel.js";

const CHEAPSHARK_BASE = "https://www.cheapshark.com/api/1.0";

// Consulta a CheapShark e salva promoções dos jogos desejados do usuário
const checkPromos = async (req, res) => {
    const usuario_id = req.user.id;

    try {
        // Busca jogos da lista "desejados" do usuário
        const desejados = await listModel.findByUserAndType(usuario_id, "desejados");

        if (!desejados.length) {
            return res.status(200).json({ message: "Nenhum jogo na lista de desejados." });
        }

        const promoEncontradas = [];

        for (const item of desejados) {
            const jogo = await gameModel.findById(item.jogo_id);
            if (!jogo?.cheapshark_id) continue;

            // Consulta deals do jogo na CheapShark
            const response = await fetch(
                `${CHEAPSHARK_BASE}/games?id=${jogo.cheapshark_id}`,
                { headers: { "User-Agent": "JogaPlus/1.0" } }
            );
            const data = await response.json();

            if (!data?.deals?.length) continue;

            const deal = data.deals[0];
            const desconto = parseFloat(deal.savings);

            // Só considera promoção se tiver pelo menos 10% de desconto
            if (desconto < 10) continue;

            // Verifica se essa promoção já foi salva
            const existing = await promoModel.findByDealId(deal.dealID);
            if (existing) continue;

            // Salva a promoção
            await promoModel.create({
                jogo_id: jogo.id,
                preco_promocional: parseFloat(deal.price),
                preco_normal: parseFloat(deal.retailPrice),
                loja: deal.storeID,
                deal_id: deal.dealID,
            });

            // Atualiza preço do jogo no banco
            await gameModel.update(jogo.cheapshark_id, {
                preco_atual: parseFloat(deal.price),
                menor_preco: parseFloat(data.cheapestPriceEver?.price) || jogo.menor_preco,
                loja: deal.storeID,
            });

            promoEncontradas.push({
                jogo_id: jogo.id,
                titulo: jogo.titulo,
                preco_promocional: parseFloat(deal.price),
                preco_normal: parseFloat(deal.retailPrice),
                loja: deal.storeID,
                prioridade: item.prioridade,
            });
        }

        // Gera notificações para as promoções encontradas, ordenadas por prioridade
        if (promoEncontradas.length) {
            promoEncontradas.sort((a, b) => b.prioridade - a.prioridade);

            for (const promo of promoEncontradas) {
                await notificationModel.create({
                    usuario_id,
                    jogo_id: promo.jogo_id,
                    mensagem: `🎮 ${promo.titulo} está em promoção por R$ ${promo.preco_promocional} (era R$ ${promo.preco_normal})!`,
                });
            }
        }

        return res.status(200).json({
            message: `${promoEncontradas.length} promoção(ões) encontrada(s).`,
            promos: promoEncontradas,
        });
    } catch (error) {
        console.error("Erro ao verificar promoções:", error);
        return res.status(500).json({ message: "Erro ao verificar promoções." });
    }
};

// Lista promoções ativas dos jogos desejados do usuário
const listActive = async (req, res) => {
    const usuario_id = req.user.id;
    try {
        const promos = await promoModel.findAllActiveForUser(usuario_id);
        return res.status(200).json(promos);
    } catch (error) {
        console.error("Erro ao listar promoções:", error);
        return res.status(500).json({ message: "Erro ao listar promoções." });
    }
};

export default { checkPromos, listActive };