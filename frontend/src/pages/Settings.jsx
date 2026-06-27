import { SlidersHorizontal, ShieldCheck, BellRing } from "lucide-react";
import SidebarLayout from "../components/SidebarLayout";

export default function Settings() {
  return (
    <SidebarLayout>
      <section className="page-card">
        <div className="page-card-header">
          <div>
            <p className="page-eyebrow">Preferências</p>
            <h1>
              <SlidersHorizontal size={24} /> Configurações
            </h1>
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-item">
            <div>
              <strong>Notificações</strong>
              <p>Receba alertas sobre promoções e novidades.</p>
            </div>
            <button className="secondary-cta" type="button">
              <BellRing size={16} /> Ativar
            </button>
          </div>

          <div className="settings-item">
            <div>
              <strong>Privacidade</strong>
              <p>Controle quem pode ver seu perfil e atividades.</p>
            </div>
            <button className="secondary-cta" type="button">
              <ShieldCheck size={16} /> Ajustar
            </button>
          </div>
        </div>
      </section>
    </SidebarLayout>
  );
}
