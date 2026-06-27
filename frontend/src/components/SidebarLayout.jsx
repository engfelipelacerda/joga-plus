import { Home, LibraryBig, Heart, ListChecks, User, Settings, ChevronDown, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { label: "Início", path: "/menu", icon: Home },
  { label: "Biblioteca", path: "/library", icon: LibraryBig },
  { label: "Favoritos", path: "/favorites", icon: Heart },
  { label: "BackLog", path: "/backlog", icon: ListChecks },
  { label: "Perfil", path: "/profile", icon: User },
  { label: "Configurações", path: "/settings", icon: Settings },
];

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="menu-shell">
      <aside className="menu-sidebar">
        <div className="sidebar-brand">
          <h2>
            Joga<span>+</span>
          </h2>
          <ChevronDown size={20} />
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              type="button"
              className={location.pathname === path ? "active" : ""}
              onClick={() => navigate(path)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <main className="menu-content">{children}</main>
    </div>
  );
}
