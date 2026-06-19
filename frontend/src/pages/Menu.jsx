import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Heart,
  Home,
  Star,
  Tag,
  Settings,
  ChevronDown,
  Play,
  Sparkles,
} from 'lucide-react';

const mockGames = [
  {
    id: 1,
    title: 'Nebula Outlaws',
    genre: 'Ação | Ficção',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    progress: 72,
    price: 59.99,
    promoPrice: 29.99,
    discount: 50,
    favorite: false,
  },
  {
    id: 2,
    title: 'Midnight Drift',
    genre: 'Corrida | Arcade',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=801&q=80',
    progress: 38,
    price: 49.99,
    promoPrice: 24.99,
    discount: 50,
    favorite: true,
  },
  {
    id: 3,
    title: 'Aeon Frontier',
    genre: 'RPG | Aventura',
    cover: 'https://images.unsplash.com/photo-1526059959458-7130b91c7bf8?auto=format&fit=crop&w=800&q=80',
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
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
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
    cover: 'https://images.unsplash.com/photo-1522202222199-0c502491d60f?auto=format&fit=crop&w=800&q=80',
    progress: 82,
    price: 34.99,
    promoPrice: 17.49,
    discount: 50,
    favorite: false,
  },
];

const SidebarButton = ({ icon, label, active, onClick }) => (
  <button type="button" className={active ? 'active' : ''} onClick={onClick}>
    {icon}
    {label}
  </button>
);

const GameCard = ({ game, onToggleFavorite }) => (
  <div className="game-card">
    <div className="card-cover" style={{ backgroundImage: `url(${game.cover})` }} />
    <div className="card-body">
      <div>
        <h4>{game.title}</h4>
        <div className="card-meta">{game.genre}</div>
      </div>
      <div className="card-actions">
        <button className="play-button">
          <Play size={16} /> Jogar
        </button>
        <button
          className={`favorite-button ${game.favorite ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(game.id)}
          type="button"
        >
          <Heart size={16} />
          {game.favorite ? 'Favorito' : 'Favoritar'}
        </button>
      </div>
    </div>
  </div>
);

const PromotionCard = ({ game }) => (
  <div className="promotion-card">
    <div className="card-cover" style={{ backgroundImage: `url(${game.cover})` }} />
    <div className="card-body promotion-content">
      <h4>{game.title}</h4>
      <div className="promotion-discount">-{game.discount}%</div>
      <div className="price-group">
        <span className="price-old">R$ {game.price.toFixed(2)}</span>
        <span className="price-new">R$ {game.promoPrice.toFixed(2)}</span>
      </div>
      <button className="play-button">Ver Oferta</button>
    </div>
  </div>
);

const HeroBanner = () => (
  <section className="hero-banner">
    <div className="hero-text">
      <div className="section-heading">
        <div>
          <h2>Nova temporada: <span>Rocket Rebellion</span></h2>
          <p>Combates em ritmo acelerado, mapa dinâmico e recompensas exclusivas para jogadores competitivos.</p>
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

export default function Menu() {
  const navigate = useNavigate();
  const [games, setGames] = useState(mockGames);
  const [search, setSearch] = useState('');

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.genre.toLowerCase().includes(search.toLowerCase())
    );
  }, [games, search]);

  const favorites = useMemo(() => games.filter((game) => game.favorite), [games]);

  const continuePlaying = useMemo(
    () => games.filter((game) => game.progress > 0).slice(0, 4),
    [games]
  );

  const promotions = useMemo(
    () => games.filter((game) => game.discount > 0).slice(0, 3),
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
    <div className="menu-shell">
      <aside className="menu-sidebar">
        <div className="sidebar-brand">
          <h2>Joga<span>+</span></h2>
          <ChevronDown size={20} />
        </div>

        <nav className="sidebar-nav">
          <SidebarButton icon={<Home size={18} />} label="Início" active />
          <SidebarButton icon={<Tag size={18} />} label="Biblioteca" onClick={() => navigate('/library')} />
          <SidebarButton icon={<Heart size={18} />} label="Favoritos" />
          <SidebarButton icon={<Sparkles size={18} />} label="Promoções" />
          <SidebarButton icon={<Star size={18} />} label="Perfil" />
          <SidebarButton icon={<Settings size={18} />} label="Configurações" />
        </nav>

        <div className="sidebar-footer">
          Bem-vindo, jogador!
        </div>
      </aside>

      <main className="menu-content">
        <header className="menu-header">
          <div className="app-title">
            <h1>Menu <span>Joga+</span></h1>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
          <div className="header-actions">
            <button className="icon-button" type="button">
              <Bell size={20} />
            </button>
            <div className="user-chip">
              <div className="avatar-placeholder">J</div>
              <div>
                <span>João Gamer</span>
                <small>Online</small>
              </div>
            </div>
          </div>
        </header>

        <HeroBanner />

        <section className="section-row">
          <div className="section-heading">
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
                  <div className="card-actions">
                    <button className="play-button">Continuar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-row">
          <div className="section-heading">
            <h3>Biblioteca</h3>
            <button type="button">Filtrar</button>
          </div>
          <div className="library-grid">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
        </section>

        <section className="section-row">
          <div className="section-heading">
            <h3>Promoções</h3>
            <button type="button">Ver ofertas</button>
          </div>
          <div className="promotions-grid">
            {promotions.map((game) => (
              <PromotionCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="section-row">
          <div className="section-heading">
            <h3>Jogos Favoritos</h3>
            <button type="button">Ver favoritos</button>
          </div>
          <div className="favorites-grid">
            {favorites.length > 0 ? (
              favorites.map((game) => (
                <GameCard key={game.id} game={game} onToggleFavorite={handleToggleFavorite} />
              ))
            ) : (
              <div className="empty-state">
                Nenhum favorito ainda. Clique no coração para marcar seus jogos preferidos.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
