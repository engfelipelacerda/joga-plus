import { useEffect, useState } from "react";
import { Search, Bell, Heart, Plus, ChevronDown, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import api from "../services/api";

const TIPOS = {
  desejados: { label: "Desejados", emoji: "🎯" },
  nao_jogados: { label: "Não jogados", emoji: "📦" },
  jogados: { label: "Jogados", emoji: "✅" },
  jogar_novamente: { label: "Jogar novamente", emoji: "🔄" },
  backlog: { label: "BackLog", emoji: "📌" },
};

const SearchResultCard = ({ game, onAdd, onFavorite }) => {
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
      {game.cover && (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${game.cover})` }}
        />
      )}
      <div className="card-body">
        <div>
          <h4>{game.title}</h4>
          <div className="card-meta">{game.genre}</div>
        </div>
        <div className="card-actions" style={{ position: "relative" }}>
          <button
            className="favorite-button"
            type="button"
            onClick={() => onFavorite(game)}
            style={{ marginRight: 8 }}
          >
            <Heart size={14} /> Favoritar
          </button>
          <button
            className="play-button"
            type="button"
            disabled={adding}
            onClick={() => setOpen((prev) => !prev)}
          >
            {adding ? <Loader size={14} className="spin" /> : <Plus size={14} />}
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

const HeroBanner = () => (
  <section className="hero-banner">
    <div className="hero-text">
      <div className="section-heading">
        <div>
          <h2>
            Nova temporada: <span>Rocket Rebellion</span>
          </h2>
          <p>
            Combates em ritmo acelerado, mapa dinâmico e recompensas exclusivas
            para jogadores competitivos.
          </p>
        </div>
      </div>
      <div className="hero-actions">
        <button className="primary-cta">Jogar Agora</button>
        <button className="secondary-cta">Ver Detalhes</button>
      </div>
    </div>
    <div className="hero-image">
      <div className="hero-card">
        <strong>Rocket Rebellion</strong>
        <p>O destaque da semana com gráficos imersivos e ação nonstop.</p>
      </div>
    </div>
  </section>
);

const SearchBar = ({ search, setSearch }) => (
  <label className="search-bar">
    <Search size={18} />
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Buscar jogos, gêneros ou promoções"
    />
  </label>
);

// Retorna a inicial do username em maiúsculo
function getInitial(user) {
  if (!user?.username) return "?";
  return user.username[0].toUpperCase();
}

export default function Menu() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError("");

      try {
        const data = await api.get(`/games/search?titulo=${encodeURIComponent(search.trim())}`);
        const normalized = (Array.isArray(data) ? data : []).slice(0, 8).map((game) => ({
          id: game.gameID ?? game.id,
          gameID: game.gameID,
          rawg_id: game.rawg_id,
          external: game.external ?? game.title ?? game.name ?? "Jogo",
          title: game.title ?? game.external ?? game.name ?? "Jogo",
          genre: game.genre ?? "Busca externa",
          cover: game.thumb ?? game.cover ?? game.background_image ?? game.imagem_url ?? "",
          progress: 0,
          price: Number(game.cheapest) || Number(game.price) || 0,
          promoPrice: Number(game.cheapest) || Number(game.promoPrice) || 0,
          discount: Number(game.discount) || 0,
          favorite: false,
        }));

        setSearchResults(normalized);
      } catch (error) {
        setSearchResults([]);
        setSearchError(error.message || "Não foi possível buscar jogos no momento.");
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function handleAdd(game, tipo_lista) {
    try {
      const cheapshark_id = game.gameID ?? undefined;
      const title = game.external ?? game.title ?? game.name;
      const saved = await api.post("/games", { cheapshark_id, title });
      const jogo_id = saved.game?.id || saved.id;
      if (!jogo_id) throw new Error("ID do jogo não retornado.");

      try {
        await api.post("/lists", { jogo_id, tipo_lista });
      } catch (error) {
        if (error.status === 409) {
          await api.patch("/lists/move", { jogo_id, tipo_lista });
        } else {
          throw error;
        }
      }

      showToast(`"${title}" adicionado aos ${TIPOS[tipo_lista].label}!`);
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      showToast(
        err.message === "Jogo já está na sua lista."
          ? "Este jogo já está na sua lista."
          : `Erro: ${err.message}`,
      );
    }
  }

  async function handleFavorite(game) {
    try {
      const cheapshark_id = game.gameID ?? undefined;
      const title = game.external ?? game.title ?? game.name;
      const saved = await api.post("/games", { cheapshark_id, title });
      const jogo_id = saved.game?.id || saved.id;
      if (!jogo_id) throw new Error("ID do jogo não retornado.");

      try {
        await api.post("/lists", { jogo_id, tipo_lista: "favoritos" });
      } catch (error) {
        if (error.status === 409) {
          await api.patch("/lists/move", { jogo_id, tipo_lista: "favoritos" });
        } else {
          throw error;
        }
      }

      showToast(`"${title}" adicionado aos Favoritos!`);
    } catch (err) {
      showToast(
        err.message === "Jogo já está na sua lista."
          ? "Este jogo já está na sua lista."
          : `Erro: ${err.message}`,
      );
    }
  }

  return (
    <SidebarLayout>
        <header className="menu-header">
          <div className="app-title">
            <h1>
              Menu <span>Joga+</span>
            </h1>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
          <div className="header-actions">
            <button className="icon-button" type="button">
              <Bell size={20} />
            </button>

            {/* Chip do usuário com dados reais */}
            <div className="user-chip">
              <div className="avatar-placeholder">{getInitial(user)}</div>
              <div>
                <span>{user?.username ?? "..."}</span>
                <small>Online</small>
              </div>
            </div>
          </div>
        </header>

        {searching && <p className="empty-state">Buscando jogos…</p>}
        {searchError && <p className="empty-state">{searchError}</p>}
        {toast && <p className="toast-message">{toast}</p>}

        {!search.trim() && <HeroBanner />}

        <section className="section-row">
          <div className="section-heading">
            <h3>Resultados de busca</h3>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchResults([]);
              }}
            >
              Limpar
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="library-grid">
              {searchResults.map((game) => (
                <SearchResultCard
                  key={game.id}
                  game={game}
                  onAdd={handleAdd}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          ) : (
            search.trim() ? (
              <div className="empty-state">
                Nenhum jogo encontrado. Tente outro termo.
              </div>
            ) : (
              <div className="empty-state">
                Use a busca para encontrar jogos reais e adicioná-los às suas
                listas.
              </div>
            )
          )}
        </section>
    </SidebarLayout>
  );
}
