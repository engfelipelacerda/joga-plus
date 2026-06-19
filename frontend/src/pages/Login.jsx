import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Integrar com backend
      console.log({ email, password });
      // Simulação de login bem-sucedido
      setTimeout(() => {
        setLoading(false);
        // window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-content">
          <div className="login-header">
            <h1>Joga<span>+</span></h1>
            <p>Bem-vindo de volta</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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
              <label htmlFor="password">Senha</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
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
              {loading ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-divider">ou</div>

          <div className="login-footer">
            <p>Não tem conta? <a href="/register">Criar conta</a></p>
            <p><a href="/forgot-password" className="forgot-link">Esqueci minha senha</a></p>
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
