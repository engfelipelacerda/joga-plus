import { ListChecks, CheckCircle2, Clock3, ArrowRightCircle } from "lucide-react";
import SidebarLayout from "../components/SidebarLayout";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const STATUS_LABELS = {
  quer_jogar: { label: "Quero jogar", icon: Clock3 },
  joguei: { label: "Joguei", icon: CheckCircle2 },
  talvez: { label: "Talvez", icon: ArrowRightCircle },
};

export default function Backlog() {
  const [backlog, setBacklog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBacklog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/lists/backlog");
      setBacklog(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar o BackLog.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBacklog();
  }, [loadBacklog]);

  async function updateStatus(jogo_id, status) {
    try {
      await api.patch("/lists/status", { jogo_id, status });
      loadBacklog();
    } catch (err) {
      setError(err.message || "Não foi possível atualizar o status.");
    }
  }

  return (
    <SidebarLayout>
      <section className="page-card">
        <div className="page-card-header">
          <div>
            <p className="page-eyebrow">Organize seus planos</p>
            <h1>
              <ListChecks size={24} /> BackLog
            </h1>
          </div>
          <span className="page-pill">{backlog.length} itens</span>
        </div>

        <div className="page-card-body">
          <div className="page-intro">
            <p>
              Aqui você vê jogos que adicionou ao BackLog e pode marcar se já jogou,
              se quer jogar ou se está em dúvida.
            </p>
          </div>

          {loading ? (
            <div className="empty-state">Carregando BackLog...</div>
          ) : error ? (
            <div className="empty-state">Erro: {error}</div>
          ) : backlog.length === 0 ? (
            <div className="empty-state">
              Nenhum jogo no BackLog ainda. Adicione jogos da busca para começar.
            </div>
          ) : (
            <div className="backlog-grid">
              {backlog.map((item) => {
                const status = STATUS_LABELS[item.status] ? item.status : "quer_jogar";
                const statusConfig = STATUS_LABELS[status];
                return (
                  <article key={item.jogo_id} className="game-card backlog-card">
                    {item.jogo?.imagem_url ? (
                      <div
                        className="card-cover"
                        style={{ backgroundImage: `url(${item.jogo.imagem_url})` }}
                      />
                    ) : (
                      <div className="card-cover card-cover--empty">🎮</div>
                    )}
                    <div className="card-body">
                      <div>
                        <h4>{item.jogo?.titulo ?? "Sem título"}</h4>
                        <div className="card-meta">Status atual: {statusConfig.label}</div>
                      </div>
                      <div className="backlog-actions">
                        {Object.entries(STATUS_LABELS).map(([key, { label, icon: Icon }]) => (
                          <button
                            key={key}
                            type="button"
                            className={key === status ? "favorite-button favorited" : "favorite-button"}
                            onClick={() => updateStatus(item.jogo_id, key)}
                          >
                            <Icon size={14} /> {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SidebarLayout>
  );
}
