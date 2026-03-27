import { BarChart2, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const HISTORY_SIZE = 20;
const ICONS = [Zap, BarChart2, RefreshCw] as const;

function generateHistory(base: number): number[] {
  return Array.from(
    { length: HISTORY_SIZE },
    (_, i) => base + Math.sin(i * 0.7) * 3 + Math.random() * 2,
  );
}

export default function OmegaCoherence() {
  const [coherence, setCoherence] = useState(89.4);
  const [history, setHistory] = useState<number[]>(() => generateHistory(89));

  useEffect(() => {
    const id = setInterval(() => {
      const next = 85 + Math.random() * 10;
      setCoherence(Number.parseFloat(next.toFixed(1)));
      setHistory((prev) => [...prev.slice(1), next]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const radius = 70;
  const stroke = 10;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - coherence / 100);

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const W = 220;
  const H = 36;
  const pts = history
    .map((v, i) => {
      const x = (i / (HISTORY_SIZE - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className="card-glow-cyan rounded-lg border border-border p-5 flex flex-col"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="coherence.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        Omega Prime Coherence
      </p>

      <div className="flex justify-center mb-2">
        <svg width={180} height={100} viewBox="0 0 180 100">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(60% 0.22 250)" />
              <stop offset="100%" stopColor="oklch(85% 0.18 200)" />
            </linearGradient>
          </defs>
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
            fill="none"
            stroke="oklch(20% 0.04 270)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill="oklch(93% 0.015 270)"
            fontSize="20"
            fontWeight="700"
          >
            {coherence}%
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="oklch(85% 0.18 200)"
            fontSize="9"
            letterSpacing="2"
          >
            COHERENCE
          </text>
        </svg>
      </div>

      <div className="mb-3 px-1">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          height={H}
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor="oklch(60% 0.22 250)"
                stopOpacity="0.5"
              />
              <stop offset="100%" stopColor="oklch(85% 0.18 200)" />
            </linearGradient>
          </defs>
          <polyline
            points={pts}
            fill="none"
            stroke="url(#sparkGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex items-center justify-center mb-4">
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{
            background: "oklch(85% 0.18 200 / 0.15)",
            color: "oklch(85% 0.18 200)",
            border: "1px solid oklch(85% 0.18 200 / 0.3)",
          }}
        >
          ● HIGH STABILITY
        </span>
      </div>

      <div className="flex gap-2 mt-auto">
        {ICONS.map((Icon, i) => (
          <button
            key={Icon.displayName ?? i}
            type="button"
            data-ocid={`coherence.action.button.${i + 1}`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs text-muted-foreground hover:text-cyan border border-border hover:border-cyan/30 transition-all"
          >
            <Icon className="w-3 h-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
