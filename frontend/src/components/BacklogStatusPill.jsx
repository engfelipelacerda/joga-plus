export default function BacklogStatusPill({ status }) {
  const labels = {
    quer_jogar: "Quero jogar",
    joguei: "Joguei",
    talvez: "Talvez",
  };

  const colors = {
    quer_jogar: "#3b82f6",
    joguei: "#10b981",
    talvez: "#f59e0b",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${colors[status]}`,
        color: colors[status],
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {labels[status] ?? "—"}
    </span>
  );
}
