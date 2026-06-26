import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Bell,
  Heart,
  Plus,
  RefreshCw,
  X,
  ChevronDown,
  Tag,
  Loader,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

// ─── Mapa de tipos de lista ───────────────────────────────────────────────────
const TIPOS = {
  desejados: { label: "Desejados", emoji: "🎯" },
  nao_jogados: { label: "Não jogados", emoji: "📦" },
  jogados: { label: "Jogados", emoji: "✅" },
  jogar_novamente: { label: "Jogar novamente", emoji: "🔄" },
};

// ─── Componente: barra de busca ───────────────────────────────────────────────
const SearchBar = ({ value, onChange, loading }) => (
  <label className="search-bar">
    <Search size={18} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar jogos na CheapShark..."
    />
    {loading && <Loader size={16} className="spin" />}
  </label>
);

// ─── Componente: card de resultado de busca ───────────────────────────────────
const SearchResultCard = ({ game, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  async function handleAdd(tipo_lista) {
    setAdding(true);
    setOpen(false);
    await onAdd(game, tipo_lista);
    setAdding(false);
  }

  return (
    <div className="game-card search-result-card">
      {game.thumb && (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${game.thumb})` }}
        />
      )}
      <div className="card-body">
        <div>
          <h4>{game.external}</h4>
          {game.cheapest && (
            <div className="card-meta">
              A partir de <strong>$ {game.cheapest}</strong>
            </div>
          )}
        </div>
        <div className="card-actions" style={{ position: "relative" }}>
          <button
            className="play-button"
            type="button"
            disabled={adding}
            onClick={() => setOpen((o) => !o)}
          >
            {adding ? (
              <Loader size={14} className="spin" />
            ) : (
              <Plus size={14} />
            )}
            {adding ? "Adicionando…" : "Adicionar"}
            <ChevronDown size={14} />
          </button>
          {open && (
            <div className="dropdown-menu">
              {Object.entries(TIPOS).map(([tipo, { label, emoji }]) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => handleAdd(tipo)}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Componente: card de jogo da biblioteca do usuário ───────────────────────
const LibraryGameCard = ({ item, onMove, onRemove }) => {
  const [open, setOpen] = useState(false);
  const jogo = item.jogo;

  return (
    <div className="game-card">
      {jogo.imagem_url ? (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${jogo.imagem_url})` }}
        />
      ) : (
        <div className="card-cover card-cover--empty">🎮</div>
      )}
      <div className="card-body">
        <div>
          <h4>{jogo.titulo}</h4>
          <div className="card-meta">
            <span className="list-badge">
              {TIPOS[item.tipo_lista]?.emoji} {TIPOS[item.tipo_lista]?.label}
            </span>
            {jogo.preco_atual && (
              <span>$ {parseFloat(jogo.preco_atual).toFixed(2)}</span>
            )}
          </div>
          {item.prioridade > 1 && (
            <div className="card-meta">
              Prioridade: {"★".repeat(item.prioridade)}
            </div>
          )}
        </div>
        <div className="card-actions" style={{ position: "relative" }}>
          <button
            className="favorite-button"
            type="button"
            onClick={() => setOpen((o) => !o)}
          >
            <Tag size={14} /> Mover
            <ChevronDown size={14} />
          </button>
          <button
            className="favorite-button"
            type="button"
            onClick={() => onRemove(item.jogo_id)}
            style={{ color: "#e05" }}
          >
            <X size={14} />
          </button>
          {open && (
            <div className="dropdown-menu">
              {Object.entries(TIPOS)
                .filter(([tipo]) => tipo !== item.tipo_lista)
                .map(([tipo, { label, emoji }]) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onMove(item.jogo_id, tipo);
                    }}
                  >
                    {emoji} {label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Componente: card de promoção ─────────────────────────────────────────────
const PromoCard = ({ promo }) => {
  const desconto = promo.preco_normal
    ? Math.round((1 - promo.preco_promocional / promo.preco_normal) * 100)
    : null;

  return (
    <div className="promotion-card">
      {promo.jogo?.imagem_url && (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${promo.jogo.imagem_url})` }}
        />
      )}
      <div className="promotion-content">
        <h4>{promo.jogo?.titulo ?? "—"}</h4>
        {desconto && <div className="promotion-discount">-{desconto}%</div>}
        <div className="price-group">
          {promo.preco_normal && (
            <span className="price-old">
              $ {parseFloat(promo.preco_normal).toFixed(2)}
            </span>
          )}
          <span className="price-new">
            $ {parseFloat(promo.preco_promocional).toFixed(2)}
          </span>
        </div>
        <button className="play-button" type="button">
          Ver Oferta
        </button>
      </div>
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Library() {
  const { user } = useAuth();

  // Busca CheapShark
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Biblioteca do usuário
  const [myGames, setMyGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

  // Promoções
  const [promos, setPromos] = useState([]);
  const [checkingPromos, setCheckingPromos] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");

  // Toast de feedback
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // ── Carrega biblioteca do usuário ──
  const loadMyGames = useCallback(async () => {
    setLoadingGames(true);
    try {
      const data = await api.get("/lists");
      setMyGames(data);
    } catch {
      showToast("Erro ao carregar sua biblioteca.");
    } finally {
      setLoadingGames(false);
    }
  }, []);

  // ── Carrega promoções ativas ──
  const loadPromos = useCallback(async () => {
    try {
      const data = await api.get("/promos");
      setPromos(data);
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    loadMyGames();
    loadPromos();
  }, [loadMyGames, loadPromos]);

  // ── Busca na CheapShark com debounce ──
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        // GET /games/search?titulo=... — rota pública, sem auth
        const res = await fetch(
          `http://localhost:3333/games/search?titulo=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // ── Adicionar jogo à lista ──
  async function handleAdd(game, tipo_lista) {
    try {
      // 1. Salva/atualiza o jogo no banco via cheapshark_id
      const saved = await api.post("/games", { cheapshark_id: game.gameID });
      const jogo_id = saved.game?.id;

      if (!jogo_id) throw new Error("ID do jogo não retornado.");

      // 2. Adiciona à lista do usuário
      await api.post("/lists", { jogo_id, tipo_lista });

      showToast(
        `"${game.external}" adicionado aos ${TIPOS[tipo_lista].label}!`,
      );
      setQuery("");
      setSearchResults([]);
      loadMyGames();
    } catch (err) {
      showToast(
        err.message === "Jogo já está na sua lista."
          ? "Este jogo já está na sua lista."
          : `Erro: ${err.message}`,
      );
    }
  }

  // ── Mover jogo de lista ──
  async function handleMove(jogo_id, tipo_lista) {
    try {
      await api.patch("/lists/move", { jogo_id, tipo_lista });
      showToast("Jogo movido com sucesso!");
      loadMyGames();
    } catch (err) {
      showToast(`Erro: ${err.message}`);
    }
  }

  // ── Remover jogo ──
  async function handleRemove(jogo_id) {
    try {
      await api.delete(`/lists/${jogo_id}`);
      showToast("Jogo removido da biblioteca.");
      loadMyGames();
    } catch (err) {
      showToast(`Erro: ${err.message}`);
    }
  }

  // ── Verificar promoções ──
  async function handleCheckPromos() {
    setCheckingPromos(true);
    setPromoMsg("");
    try {
      const data = await api.post("/promos/check");
      setPromoMsg(data.message);
      loadPromos();
    } catch (err) {
      setPromoMsg(`Erro: ${err.message}`);
    } finally {
      setCheckingPromos(false);
    }
  }

  // Agrupa jogos por tipo de lista
  const byType = Object.fromEntries(
    Object.keys(TIPOS).map((tipo) => [
      tipo,
      myGames.filter((item) => item.tipo_lista === tipo),
    ]),
  );

  const initial = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="library-shell">
      {/* Toast */}
      {toast && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "#1e293b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,.4)",
            fontSize: 14,
            maxWidth: 320,
          }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="library-top">
        <div className="library-brand">
          <h1>
            Biblioteca <span>Joga+</span>
          </h1>
        </div>
        <div className="library-actions">
          <SearchBar value={query} onChange={setQuery} loading={searching} />
          <button className="icon-button" type="button">
            <Bell size={20} />
          </button>
          <div className="user-chip">
            <div className="avatar-placeholder">{initial}</div>
            <div>
              <span>{user?.username ?? "..."}</span>
              <small>Ativo agora</small>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h3>Resultados para "{query}"</h3>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchResults([]);
              }}
            >
              <X size={14} /> Limpar
            </button>
          </div>
          <div className="library-grid">
            {searchResults.map((game) => (
              <SearchResultCard
                key={game.gameID}
                game={game}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </section>
      )}

      {/* Promoções */}
      <section className="section">
        <div className="section-header">
          <h3>🔥 Promoções dos seus Desejados</h3>
          <button
            type="button"
            className="play-button"
            onClick={handleCheckPromos}
            disabled={checkingPromos}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {checkingPromos ? (
              <>
                <Loader size={14} className="spin" /> Verificando…
              </>
            ) : (
              <>
                <RefreshCw size={14} /> Verificar agora
              </>
            )}
          </button>
        </div>
        {promoMsg && (
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
            {promoMsg}
          </p>
        )}
        {promos.length > 0 ? (
          <div className="promotions-grid">
            {promos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        ) : (
          !checkingPromos && (
            <div className="empty-state">
              Nenhuma promoção ativa nos seus desejados. Clique em "Verificar
              agora".
            </div>
          )
        )}
      </section>

      {/* Biblioteca por tipo de lista */}
      {loadingGames ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <Loader size={24} className="spin" /> Carregando sua biblioteca…
        </div>
      ) : myGames.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          Sua biblioteca está vazia. Busque um jogo acima e adicione à sua
          lista!
        </div>
      ) : (
        Object.entries(TIPOS).map(([tipo, { label, emoji }]) =>
          byType[tipo].length > 0 ? (
            <section key={tipo} className="section">
              <div className="section-header">
                <h3>
                  {emoji} {label} ({byType[tipo].length})
                </h3>
              </div>
              <div className="library-grid">
                {byType[tipo].map((item) => (
                  <LibraryGameCard
                    key={item.jogo_id}
                    item={item}
                    onMove={handleMove}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </section>
          ) : null,
        )
      )}
    </div>
  );
}

