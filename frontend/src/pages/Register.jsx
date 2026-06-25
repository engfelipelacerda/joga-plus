import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          birth_date,
          password,
        }),
      });

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Resposta:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      console.log("Usuário criado com sucesso!");

      // Redireciona para a tela de login
      window.location.href = "/login";
    } catch (err) {
      console.error(err);

      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-content">
          <div className="register-header">
            <h1>
              Joga<span>+</span>
            </h1>
            <p>Comece sua jornada</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="name"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Data de Nascimento</label>
              <div className="input-wrapper">
                <Calendar size={18} />
                <input
                  id="birthDate"
                  type="date"
                  value={birth_date}
                  onChange={(e) => setBirthDate(e.target.value)}
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="register-divider">ou</div>

          <div className="register-footer">
            <p>
              Já tem conta? <a href="/login">Fazer login</a>
            </p>
          </div>
        </div>
      </div>

      <div className="register-right">
        <div className="visual-panel">
          <div className="gradient-overlay"></div>
          <div className="content-overlay">
            <div className="illustration">
              <div className="icon-large">⭐</div>
              <h2>Junte-se à comunidade</h2>
              <p>
                Descubra novos jogos e compartilhe suas descobertas com outros
                jogadores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
