import { toast } from "sonner";

export default function QuantumMethod() {
  return (
    <div
      className="card-glow rounded-lg border border-border p-5"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="quantum-method.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        Quantum Method
      </p>
      <div className="flex flex-col gap-3 mb-5">
        {[
          { label: "Protocol", value: "Ricci Flow v4" },
          { label: "Entanglement", value: "8 Nodes" },
          { label: "Field Coherence", value: "91.3%" },
          { label: "Timeline", value: "Stable" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className="text-xs font-medium text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          toast.success(
            "Quantum sync cleared. Re-initializing field coherence.",
          )
        }
        data-ocid="quantum-method.clear-sync.button"
        className="w-full py-2 rounded text-xs font-medium transition-all"
        style={{
          background:
            "linear-gradient(to right, oklch(60% 0.22 250 / 0.2), oklch(85% 0.18 200 / 0.2))",
          border: "1px solid oklch(85% 0.18 200 / 0.4)",
          color: "oklch(85% 0.18 200)",
          boxShadow: "0 0 10px oklch(85% 0.18 200 / 0.1)",
        }}
      >
        Clear Sync
      </button>
    </div>
  );
}
