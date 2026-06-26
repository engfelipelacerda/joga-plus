import { ArrowRight, Zap, Layers, Eye, LogIn } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Usuário já logado → manda direto pro menu
  if (!loading && isAuthenticated) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand">
          Joga<span>+</span>
        </div>
        <nav className="header-nav">
          <button className="nav-link">Sobre</button>
          <button className="nav-link">Recursos</button>
          <button className="nav-link">Contato</button>
          <button className="cta-button" onClick={() => navigate("/login")}>
            <LogIn size={18} />
            Entrar
          </button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Organize seus jogos. Descubra mais. Escolha melhor.</h1>
            <p>
              Joga+ é a plataforma ideal para gerenciar sua biblioteca de jogos,
              filtrar por preferências e encontrar exatamente o que você quer
              jogar no momento.
            </p>
            <div className="hero-actions">
              <button
                className="primary-cta"
                onClick={() => navigate("/login")}
              >
                Começar Agora
                <ArrowRight size={20} />
              </button>
              <button className="secondary-cta">Saber Mais</button>
            </div>
          </div>
        </section>

        <section className="benefits">
          <h2>Por que usar Joga+?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Layers size={32} />
              </div>
              <h3>Organize com Facilidade</h3>
              <p>
                Crie listas personalizadas, organize jogos por interesse e
                mantenha seu acervo sempre atualizado e acessível.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Zap size={32} />
              </div>
              <h3>Selecione Rapidamente</h3>
              <p>
                Filtros inteligentes e busca avançada para encontrar o jogo
                perfeito para o seu mood do momento em segundos.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Eye size={32} />
              </div>
              <h3>Visualize Tudo</h3>
              <p>
                Veja capas, avaliações, gêneros e mais informações em um visual
                limpo e intuitivo que facilita sua escolha.
              </p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <div className="feature-block">
              <h3>Biblioteca Centralizada</h3>
              <p>
                Todos os seus jogos em um único lugar. Sem mais procurar em
                vários apps ou plataformas. Tudo organizado do seu jeito.
              </p>
            </div>

            <div className="feature-block">
              <h3>Filtros Inteligentes</h3>
              <p>
                Busque por gênero, plataforma, avaliação ou qualquer critério
                que importa para você. Encontre o jogo certo na hora certa.
              </p>
            </div>

            <div className="feature-block">
              <h3>Favoritos e Listas</h3>
              <p>
                Marque seus favoritos e crie listas temáticas. Nunca mais
                esqueça aquele jogo que você queria experimentar.
              </p>
            </div>

            <div className="feature-block">
              <h3>Interface Moderna</h3>
              <p>
                Design limpo e responsivo que funciona perfeitamente em qualquer
                dispositivo. Simples e direto.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-box">
            <h2>Pronto para organizar sua biblioteca?</h2>
            <p>
              Comece agora e descubra uma nova forma de escolher seus jogos.
            </p>
            <button
              className="primary-cta large"
              onClick={() => navigate("/login")}
            >
              Entrar em Joga+
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 Joga+. Organize, selecione, aproveite.</p>
          <div className="footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
