import { useEffect, useState, useCallback } from "react";
import { Heart, Sparkles } from "lucide-react";
import SidebarLayout from "../components/SidebarLayout";
import api from "../services/api";

export default function Favorites() {
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get("/lists/favoritos");
      setFavoriteGames(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar favoritos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <SidebarLayout>
      <section className="page-card">
        <div className="page-card-header">
          <div>
            <p className="page-eyebrow">Coleção pessoal</p>
            <h1>
              <Heart size={24} /> Favoritos
            </h1>
          </div>
          <span className="page-pill">
            <Sparkles size={16} /> {favoriteGames.length} jogos
          </span>
        </div>

        {loading ? (
          <div className="empty-state">Carregando favoritos...</div>
        ) : error ? (
          <div className="empty-state">Erro: {error}</div>
        ) : favoriteGames.length === 0 ? (
          <div className="empty-state">
            Nenhum favorito ainda. Marque jogos como favoritos a partir da busca.
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteGames.map((item) => (
              <article key={item.jogo_id} className="game-card">
                <div
                  className="card-cover"
                  style={{
                    backgroundImage: `url(${item.jogo?.imagem_url ?? ""})`,
                  }}
                />
                <div className="card-body">
                  <div>
                    <h4>{item.jogo?.titulo ?? "Sem título"}</h4>
                    <div className="card-meta">
                      {item.jogo?.loja ? `${item.jogo.loja}` : "Sem loja"}
                    </div>
                  </div>
                  <button className="play-button" type="button">
                    Abrir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SidebarLayout>
  );
}
