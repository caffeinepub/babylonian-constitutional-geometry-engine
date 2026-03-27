export default function SystemPhase() {
  const labels = [
    { label: "VOID", angle: -90 },
    { label: "CHAOS", angle: 0 },
    { label: "LOVE", angle: 90 },
    { label: "CRYSTAL", angle: 180 },
  ];

  const cx = 100;
  const cy = 100;
  const outerR = 80;
  const innerR = 52;

  return (
    <div
      className="card-glow rounded-lg border border-border p-5 flex flex-col items-center"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="system-phase.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 self-start">
        System Phase Indicator
      </p>

      {/* Crystal label */}
      <div className="mb-2 relative">
        <p
          className="text-4xl font-bold tracking-widest"
          style={{
            background:
              "linear-gradient(135deg, oklch(65% 0.28 305), oklch(75% 0.2 250))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 12px oklch(65% 0.28 305 / 0.8))",
          }}
        >
          CRYSTAL
        </p>
      </div>

      {/* Mandala */}
      <svg width={200} height={200} viewBox="0 0 200 200">
        <defs>
          <radialGradient id="mandalaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(65% 0.28 305 / 0.3)" />
            <stop offset="100%" stopColor="oklch(65% 0.28 305 / 0)" />
          </radialGradient>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(65% 0.28 305)" />
            <stop offset="100%" stopColor="oklch(85% 0.18 200)" />
          </linearGradient>
        </defs>

        {/* Outer glow circle */}
        <circle cx={cx} cy={cy} r={outerR + 8} fill="url(#mandalaGrad)" />

        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="oklch(65% 0.28 305 / 0.4)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke="oklch(65% 0.28 305 / 0.6)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r={30}
          fill="none"
          stroke="oklch(85% 0.18 200 / 0.4)"
          strokeWidth="1"
        />

        {/* Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={cx + 30 * Math.cos(rad)}
              y1={cy + 30 * Math.sin(rad)}
              x2={cx + outerR * Math.cos(rad)}
              y2={cy + outerR * Math.sin(rad)}
              stroke="oklch(65% 0.28 305 / 0.3)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Phase dots + labels */}
        {labels.map(({ label, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const dotX = cx + outerR * Math.cos(rad);
          const dotY = cy + outerR * Math.sin(rad);
          const txtX = cx + (outerR + 16) * Math.cos(rad);
          const txtY = cy + (outerR + 16) * Math.sin(rad);
          const isActive = label === "CRYSTAL";
          return (
            <g key={label}>
              <circle
                cx={dotX}
                cy={dotY}
                r={isActive ? 5 : 3}
                fill={isActive ? "oklch(65% 0.28 305)" : "oklch(50% 0.1 270)"}
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 5px oklch(65% 0.28 305))" }
                    : {}
                }
              />
              <text
                x={txtX}
                y={txtY + 3}
                textAnchor="middle"
                fontSize="7"
                fill={isActive ? "oklch(65% 0.28 305)" : "oklch(55% 0.04 270)"}
                fontWeight={isActive ? "700" : "400"}
                letterSpacing="1"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Center crystal */}
        <circle cx={cx} cy={cy} r={10} fill="oklch(65% 0.28 305 / 0.3)" />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="oklch(65% 0.28 305)"
          style={{ filter: "drop-shadow(0 0 6px oklch(65% 0.28 305))" }}
        />
      </svg>

      <p className="text-xs text-muted-foreground mt-1">
        Phase 4 · Geometric Crystallization
      </p>
    </div>
  );
}
