import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Envolve rotas que exigem autenticação.
 * - Se ainda carregando: mostra nada (evita flash de redirect).
 * - Se não autenticado: redireciona para /login.
 * - Se autenticado: renderiza a rota normalmente.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
