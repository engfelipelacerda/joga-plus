import { UserCircle2, CalendarDays, Mail } from "lucide-react";
import SidebarLayout from "../components/SidebarLayout";
import { useAuth } from "../contexts/AuthContext";
import "../profile.css";

export default function Profile() {
  const { user } = useAuth();

  return (
    <SidebarLayout>
      <section className="page-card profile-card">
        <div className="page-card-header">
          <div>
            <p className="page-eyebrow">Conta</p>
            <h1>
              <UserCircle2 size={24} /> Perfil
            </h1>
          </div>
        </div>

        <div className="profile-summary">
          <div className="avatar-large">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h2>{user?.username ?? "Jogador"}</h2>
            <p>Seu perfil central do Joga+.</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="info-item">
            <Mail size={18} />
            <div>
              <strong>Email: </strong>
              <span>{user?.email ?? "—"}</span>
            </div>
          </div>
          <div className="info-item">
            <CalendarDays size={18} />
            <div>
              <strong>Membro desde: </strong>
              <span>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("pt-BR")
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </SidebarLayout>
  );
}
