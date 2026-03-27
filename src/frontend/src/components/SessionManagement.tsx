export default function SessionManagement() {
  return (
    <div
      className="card-glow rounded-lg border border-border p-5"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="session.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        Session Management
      </p>
      <div className="flex flex-col gap-3">
        {[
          { label: "Current Session", value: "4hr 12m", highlight: false },
          { label: "Strategy", value: "Arkhe-Sync", highlight: false },
          { label: "Mode", value: "Alpha-Neutral", highlight: false },
          { label: "Neuro-Sync", value: "Active", highlight: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span
              className="text-xs font-medium"
              style={
                row.highlight
                  ? {
                      color: "oklch(75% 0.22 150)",
                      filter: "drop-shadow(0 0 4px oklch(75% 0.22 150 / 0.5))",
                    }
                  : { color: "oklch(85% 0.015 270)" }
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
