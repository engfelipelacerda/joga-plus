import { useMemo, useState } from 'react';
import { Search, Bell, Heart, Play } from 'lucide-react';

const libraryGames = [
  {
    id: 1,
    title: 'Nebula Outlaws',
    genre: 'Ação | Ficção',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    progress: 72,
    price: 59.99,
    promoPrice: 29.99,
    discount: 50,
    favorite: true,
  },
  {
    id: 2,
    title: 'Midnight Drift',
    genre: 'Corrida | Arcade',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    progress: 38,
    price: 49.99,
    promoPrice: 24.99,
    discount: 50,
    favorite: false,
  },
  {
    id: 3,
    title: 'Aeon Frontier',
    genre: 'RPG | Aventura',
    cover: 'https://images.unsplash.com/photo-1522202222199-0c502491d60f?auto=format&fit=crop&w=800&q=80',
    progress: 56,
    price: 79.99,
    promoPrice: 39.99,
    discount: 51,
    favorite: false,
  },
  {
    id: 4,
    title: 'Shadow Protocol',
    genre: 'Stealth | Tiro',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=801&q=80',
    progress: 15,
    price: 69.99,
    promoPrice: 34.99,
    discount: 50,
    favorite: true,
  },
  {
    id: 5,
    title: 'Solar Harvest',
    genre: 'Simulação | Estratégia',
    cover: 'https://images.unsplash.com/photo-1526059959458-7130b91c7bf8?auto=format&fit=crop&w=800&q=80',
    progress: 82,
    price: 34.99,
    promoPrice: 17.49,
    discount: 50,
    favorite: false,
  },
  {
    id: 6,
    title: 'Lunar Ascend',
    genre: 'Plataforma | Puzzle',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    progress: 0,
    price: 44.99,
    promoPrice: 22.49,
    discount: 50,
    favorite: false,
  },
];

const SearchBar = ({ value, onChange }) => (
  <label className="search-bar">
    <Search size={18} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar jogos, categorias ou promoções"
    />
  </label>
);

const LibraryGameCard = ({ game, onToggleFavorite }) => (
  <div className="game-card">
    <div className="card-cover" style={{ backgroundImage: `url(${game.cover})` }} />
    <div className="card-body">
      <div>
        <h4>{game.title}</h4>
        <div className="card-meta">{game.genre}</div>
      </div>
      <div className="card-actions">
        <button className="play-button" type="button">
          <Play size={16} /> Jogar
        </button>
        <button
          type="button"
          className={`favorite-button ${game.favorite ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(game.id)}
        >
          <Heart size={16} /> {game.favorite ? 'Favorito' : 'Favoritar'}
        </button>
      </div>
    </div>
  </div>
);

const PromotionCard = ({ game }) => (
  <div className="promotion-card">
    <div className="card-cover" style={{ backgroundImage: `url(${game.cover})` }} />
    <div className="promotion-content">
      <h4>{game.title}</h4>
      <div className="promotion-discount">-{game.discount}%</div>
      <div className="price-group">
        <span className="price-old">R$ {game.price.toFixed(2)}</span>
        <span className="price-new">R$ {game.promoPrice.toFixed(2)}</span>
      </div>
      <button className="play-button" type="button">Ver Oferta</button>
    </div>
  </div>
);

export default function Library() {
  const [games, setGames] = useState(libraryGames);
  const [query, setQuery] = useState('');

  const filteredGames = useMemo(
    () =>
      games.filter((game) =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.genre.toLowerCase().includes(query.toLowerCase())
      ),
    [games, query]
  );

  const favorites = useMemo(() => games.filter((game) => game.favorite), [games]);
  const continuePlaying = useMemo(
    () => games.filter((game) => game.progress > 0).slice(0, 4),
    [games]
  );

  const handleToggleFavorite = (id) => {
    setGames((current) =>
      current.map((game) =>
        game.id === id ? { ...game, favorite: !game.favorite } : game
      )
    );
  };

  return (
    <div className="library-shell">
      <div className="library-top">
        <div className="library-brand">
          <h1>Biblioteca <span>Joga+</span></h1>
        </div>
        <div className="library-actions">
          <SearchBar value={query} onChange={setQuery} />
          <button className="icon-button" type="button">
            <Bell size={20} />
          </button>
          <div className="user-chip">
            <div className="avatar-placeholder">J</div>
            <div>
              <span>João Gamer</span>
              <small>Ativo agora</small>
            </div>
          </div>
        </div>
      </div>

      <section className="hero-banner">
        <div>
          <h2>Explorar <span>Skybound Odyssey</span></h2>
          <p>A aventura de fantasia mais comentada do mês chegou com novos eventos, artefatos lendários e trilha sonora épica.</p>
          <div className="hero-buttons">
            <button className="play-button" type="button">Jogar Agora</button>
            <button className="favorite-button" type="button">Ver Detalhes</button>
          </div>
        </div>
        <div className="hero-preview">
          <div className="hero-preview-text">
            <strong>Skybound Odyssey</strong>
            <p>Conquiste reinos flutuantes e forme alianças em batalhas aéreas intensas.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Continue Jogando</h3>
          <button type="button">Ver todos</button>
        </div>
        <div className="continue-row">
          {continuePlaying.map((game) => (
            <div key={game.id} className="game-card">
              <div className="card-cover" style={{ backgroundImage: `url(${game.cover})` }} />
              <div className="card-body">
                <h4>{game.title}</h4>
                <div className="card-meta">{game.genre}</div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${game.progress}%` }} />
                </div>
                <button className="play-button" type="button">Continuar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Biblioteca</h3>
          <button type="button">Ordenar por novidades</button>
        </div>
        <div className="library-grid">
          {filteredGames.map((game) => (
            <LibraryGameCard key={game.id} game={game} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Jogos Favoritos</h3>
          <button type="button">Ver favoritos</button>
        </div>
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((game) => (
              <LibraryGameCard key={game.id} game={game} onToggleFavorite={handleToggleFavorite} />
            ))
          ) : (
            <div className="empty-state">
              Marque jogos como favoritos para vê-los aqui.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}