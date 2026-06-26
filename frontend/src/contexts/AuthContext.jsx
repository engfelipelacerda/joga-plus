import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // carregando dados iniciais

  // Busca perfil do usuário autenticado
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.get("/users/me");
      setUser(data);
    } catch {
      // token inválido ou expirado — limpa tudo
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  function login(token) {
    localStorage.setItem("token", token);
    // após salvar o token, busca os dados do usuário
    fetchMe();
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniência
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
