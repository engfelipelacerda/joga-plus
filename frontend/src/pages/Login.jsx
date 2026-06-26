import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Se já estiver logado, manda direto pro menu
  if (!loading && isAuthenticated) {
    return <Navigate to="/menu" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await api.post("/auth/login", { username, password });

      if (data.token) {
        login(data.token); // salva token + carrega usuário no contexto
      }

      navigate("/menu");
    } catch (err) {
      setError(err.message || "Usuário ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-content">
          <div className="login-header">
            <h1>
              Joga<span>+</span>
            </h1>
            <p>Bem-vindo de volta</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="username"
                  type="text"
                  placeholder="Seu username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? "Entrando..." : "Entrar"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-divider">ou</div>

          <div className="login-footer">
            <p>
              Não tem conta? <a href="/register">Criar conta</a>
            </p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="visual-panel">
          <div className="gradient-overlay"></div>
          <div className="content-overlay">
            <div className="illustration">
              <div className="icon-large">🎮</div>
              <h2>Organize seus jogos</h2>
              <p>Encontre rapidamente o jogo perfeito para qualquer momento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
