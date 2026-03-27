import { useEffect, useState } from "react";

const SEED_DATA = [
  {
    pair: "ETH/USDC",
    time: "14:23:01",
    profit: "+$284.50",
    exchange: "Uni v3",
  },
  {
    pair: "BTC/WETH",
    time: "14:22:47",
    profit: "+$1,142.30",
    exchange: "Curve",
  },
  {
    pair: "ARB/USDC",
    time: "14:22:31",
    profit: "+$67.80",
    exchange: "Balancer",
  },
  { pair: "SOL/USDT", time: "14:22:15", profit: "+$193.40", exchange: "Orca" },
  { pair: "MATIC/DAI", time: "14:21:58", profit: "+$45.20", exchange: "Quick" },
];

export default function ArbitrageActivity() {
  const [sync, setSync] = useState(98.6);

  useEffect(() => {
    const id = setInterval(() => {
      setSync(Number.parseFloat((97 + Math.random() * 2).toFixed(1)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="card-glow rounded-lg border border-border p-5 flex flex-col"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="arbitrage.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        Live Arbitrage Activity
      </p>

      <div className="flex flex-col gap-2 flex-1">
        {SEED_DATA.map((row, i) => (
          <div
            key={row.pair}
            className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
            data-ocid={`arbitrage.item.${i + 1}`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {row.pair}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {row.time}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className="text-xs font-medium"
                style={{ color: "oklch(75% 0.22 150)" }}
              >
                {row.profit}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {row.exchange}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quorum consensus strip */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Quorum Consensus
          </span>
          <span className="text-xs font-medium text-cyan">
            {sync}% Synchronized
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full"
          style={{ background: "oklch(20% 0.04 270)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-1000"
            style={{
              width: `${sync}%`,
              background:
                "linear-gradient(to right, oklch(60% 0.22 250), oklch(85% 0.18 200))",
              boxShadow: "0 0 6px oklch(85% 0.18 200 / 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
