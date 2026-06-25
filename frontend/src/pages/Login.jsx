import { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("1 - Antes do fetch");
      const response = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      console.log("2 - Recebi resposta");

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Resposta:", data);

      if (!response.ok) {
        throw new Error(data.message || "Usuário ou senha inválidos.");
      }

      // backend retorna um token JWT que é salvo
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      console.log("Login realizado com sucesso!");

      window.location.href = "/";
    } catch (err) {
      console.error(err);

      setError(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
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

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-divider">ou</div>

          <div className="login-footer">
            <p>
              Não tem conta? <a href="/register">Criar conta</a>
            </p>
            <p>
              <a href="/forgot-password" className="forgot-link">
                Esqueci minha senha
              </a>
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
