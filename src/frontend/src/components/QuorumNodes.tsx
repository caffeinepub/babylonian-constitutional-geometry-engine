import { useEffect, useState } from "react";

const CITIES = [
  { name: "New York", x: 160, y: 68 },
  { name: "London", x: 232, y: 52 },
  { name: "Zurich", x: 240, y: 58 },
  { name: "Dubai", x: 308, y: 78 },
  { name: "Singapore", x: 368, y: 98 },
  { name: "Tokyo", x: 410, y: 65 },
  { name: "S\u00e3o Paulo", x: 185, y: 120 },
  { name: "Sydney", x: 420, y: 128 },
];

const ARC_KEYS = [
  "ny-lon",
  "lon-dub",
  "dub-sin",
  "sin-tok",
  "ny-sao",
  "zur-dub",
  "tok-syd",
  "lon-zur",
];
const ARCS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 5],
  [0, 6],
  [2, 3],
  [5, 7],
  [1, 2],
];

function cubicBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 30;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export default function QuorumNodes() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [nodeCount] = useState(147);
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPulseIdx((prev) => (prev + 1) % CITIES.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="card-glow-cyan rounded-lg border border-border p-5 flex flex-col"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="quorum.card"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Quantum Quorum Consensus Nodes
        </p>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "oklch(75% 0.22 150 / 0.15)",
              color: "oklch(75% 0.22 150)",
              border: "1px solid oklch(75% 0.22 150 / 0.3)",
            }}
          >
            ● OPERATIONAL
          </span>
          <span className="text-xs text-cyan font-medium">
            {nodeCount} Nodes Active
          </span>
        </div>
      </div>

      <div
        className="rounded-lg flex-1 relative"
        style={{
          background: "oklch(9% 0.02 270)",
          border: "1px solid oklch(20% 0.03 270)",
        }}
      >
        <svg
          width="100%"
          viewBox="0 0 480 180"
          style={{ display: "block", minHeight: 180 }}
        >
          <defs>
            <linearGradient id="arcGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(65% 0.28 305 / 0.6)" />
              <stop offset="100%" stopColor="oklch(85% 0.18 200 / 0.6)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M95 35 Q120 28 150 35 Q170 38 185 50 Q195 60 190 75 Q180 85 170 82 Q155 90 140 85 Q120 88 105 75 Q92 62 95 45 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M160 100 Q178 95 195 105 Q202 118 198 135 Q188 148 175 144 Q162 148 155 135 Q150 120 160 100 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M218 30 Q240 24 260 32 Q272 42 270 58 Q262 70 252 68 Q242 72 232 65 Q220 55 218 40 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M225 75 Q242 70 255 78 Q262 92 258 110 Q248 122 236 118 Q224 122 218 108 Q215 94 225 75 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M282 60 Q302 54 318 64 Q325 76 320 90 Q308 98 295 92 Q283 88 280 75 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M320 35 Q360 26 400 38 Q420 52 415 72 Q400 85 380 80 Q358 88 338 75 Q318 62 320 45 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />
          <path
            d="M395 108 Q418 102 438 112 Q446 126 438 142 Q424 150 408 145 Q394 142 390 128 Z"
            fill="oklch(18% 0.025 270)"
            stroke="oklch(28% 0.04 270)"
            strokeWidth="0.8"
          />

          {ARCS.map(([i, j], idx) => (
            <path
              key={ARC_KEYS[idx]}
              d={cubicBezierPath(
                CITIES[i].x,
                CITIES[i].y,
                CITIES[j].x,
                CITIES[j].y,
              )}
              fill="none"
              stroke="url(#arcGrad1)"
              strokeWidth="0.8"
              opacity="0.5"
            />
          ))}

          {CITIES.map((city, i) => {
            const isActive = activeNode === i;
            const isPulsing = pulseIdx === i;
            return (
              <g
                key={city.name}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveNode(isActive ? null : i)}
                data-ocid={`quorum.node.${i + 1}`}
              >
                {isPulsing && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={8}
                    fill="none"
                    stroke="oklch(85% 0.18 200 / 0.4)"
                    strokeWidth="1"
                    style={{ animation: "pulse-ring 1.5s ease-out" }}
                  />
                )}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? 7 : 5}
                  fill="oklch(85% 0.18 200 / 0.15)"
                  filter="url(#glow)"
                />
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? 4 : 3}
                  fill={
                    isActive
                      ? "oklch(85% 0.18 200)"
                      : "oklch(80% 0.18 200 / 0.9)"
                  }
                  style={{ filter: "drop-shadow(0 0 4px oklch(85% 0.18 200))" }}
                  className={isPulsing ? "node-pulse" : ""}
                />
                <text
                  x={city.x}
                  y={city.y + 14}
                  textAnchor="middle"
                  fontSize="7"
                  fill={
                    isActive ? "oklch(85% 0.18 200)" : "oklch(60% 0.04 270)"
                  }
                  fontWeight={isActive ? "600" : "400"}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          { label: "Latency", value: "12ms" },
          { label: "Consensus", value: "99.2%" },
          { label: "Uptime", value: "99.97%" },
          { label: "Blocks", value: "4,847,201" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className="text-xs font-semibold text-cyan">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
