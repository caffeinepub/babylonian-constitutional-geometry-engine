import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

type LogEntry = {
  hash: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  amount: string;
  time: string;
};

const SEED_LOG: LogEntry[] = [
  {
    hash: "0x7f3a..2c91",
    status: "CONFIRMED",
    amount: "$284.50",
    time: "14:23:01",
  },
  {
    hash: "0x4b8e..f7a2",
    status: "CONFIRMED",
    amount: "$1,142.30",
    time: "14:22:47",
  },
  {
    hash: "0x9d1c..3e85",
    status: "PENDING",
    amount: "$67.80",
    time: "14:22:31",
  },
  {
    hash: "0x2a5f..8b14",
    status: "CONFIRMED",
    amount: "$193.40",
    time: "14:22:15",
  },
  {
    hash: "0xe3b7..1d60",
    status: "CONFIRMED",
    amount: "$45.20",
    time: "14:21:58",
  },
  {
    hash: "0x1c9a..4f73",
    status: "FAILED",
    amount: "$712.00",
    time: "14:21:42",
  },
  {
    hash: "0x8d4e..c2f1",
    status: "CONFIRMED",
    amount: "$88.60",
    time: "14:21:27",
  },
  {
    hash: "0x5b2a..9e43",
    status: "CONFIRMED",
    amount: "$320.10",
    time: "14:21:11",
  },
];

const HASH_CHARS = "0123456789abcdef";
function randHash() {
  const part = Array.from(
    { length: 4 },
    () => HASH_CHARS[Math.floor(Math.random() * 16)],
  ).join("");
  const part2 = Array.from(
    { length: 4 },
    () => HASH_CHARS[Math.floor(Math.random() * 16)],
  ).join("");
  return `0x${part}..${part2}`;
}
function randAmount() {
  return `$${(Math.random() * 1200 + 50).toFixed(2)}`;
}
function randTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}
const STATUSES: LogEntry["status"][] = [
  "CONFIRMED",
  "CONFIRMED",
  "CONFIRMED",
  "PENDING",
  "FAILED",
];

const MAP_DOTS = [
  { x: 160, y: 60 },
  { x: 230, y: 52 },
  { x: 240, y: 60 },
  { x: 340, y: 80 },
  { x: 380, y: 90 },
  { x: 420, y: 70 },
  { x: 185, y: 115 },
  { x: 420, y: 130 },
];

export default function RelayMonitor() {
  const [log, setLog] = useState<LogEntry[]>(SEED_LOG);

  useEffect(() => {
    const id = setInterval(() => {
      const entry: LogEntry = {
        hash: randHash(),
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        amount: randAmount(),
        time: randTime(),
      };
      setLog((prev) => [entry, ...prev.slice(0, 7)]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const statusStyle = (s: LogEntry["status"]) => {
    if (s === "CONFIRMED")
      return {
        color: "oklch(75% 0.22 150)",
        bg: "oklch(75% 0.22 150 / 0.12)",
        border: "oklch(75% 0.22 150 / 0.3)",
      };
    if (s === "PENDING")
      return {
        color: "oklch(80% 0.18 80)",
        bg: "oklch(80% 0.18 80 / 0.12)",
        border: "oklch(80% 0.18 80 / 0.3)",
      };
    return {
      color: "oklch(55% 0.22 25)",
      bg: "oklch(55% 0.22 25 / 0.12)",
      border: "oklch(55% 0.22 25 / 0.3)",
    };
  };

  return (
    <div
      className="card-glow rounded-lg border border-border p-5 flex flex-col"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="relay.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
        Transaction Relay Monitor
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-foreground">+283,786</span>
        <span className="text-xs text-muted-foreground">Global nodes</span>
      </div>

      <div className="flex flex-col gap-1.5 mb-4 max-h-[160px] overflow-y-auto">
        {log.map((entry, i) => {
          const st = statusStyle(entry.status);
          return (
            <div
              key={`${entry.hash}-${entry.time}`}
              className={`flex items-center justify-between py-1 ${i === 0 ? "log-entry" : ""}`}
              data-ocid={`relay.item.${i + 1}`}
            >
              <span className="text-[10px] font-mono text-muted-foreground">
                {entry.hash}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-foreground">
                  {entry.amount}
                </span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    color: st.color,
                    background: st.bg,
                    border: `1px solid ${st.border}`,
                  }}
                >
                  {entry.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rounded"
        style={{ background: "oklch(10% 0.02 270)", padding: "8px" }}
      >
        <svg width="100%" viewBox="0 0 480 160" style={{ display: "block" }}>
          <path
            d="M100 40 Q130 30 160 35 Q190 30 210 45 Q220 55 215 70 Q200 80 185 85 Q170 90 155 82 Q140 88 125 80 Q105 70 100 55 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M210 40 Q240 32 270 40 Q280 55 275 75 Q265 85 250 80 Q235 85 220 75 Q212 60 210 40 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M290 35 Q320 28 350 38 Q370 50 365 70 Q355 80 335 75 Q315 82 300 70 Q288 55 290 35 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M380 50 Q410 42 440 55 Q455 70 445 90 Q430 100 415 95 Q395 100 382 85 Q375 70 380 50 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M175 95 Q195 90 210 100 Q215 115 205 128 Q192 135 178 128 Q168 115 175 95 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M400 105 Q425 98 445 110 Q452 125 440 138 Q424 145 408 138 Q398 125 400 105 Z"
            fill="none"
            stroke="oklch(30% 0.04 270)"
            strokeWidth="0.8"
            opacity="0.6"
          />
          {MAP_DOTS.map((d, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
            <g key={i}>
              <circle
                cx={d.x}
                cy={d.y}
                r={4}
                fill="oklch(85% 0.18 200 / 0.2)"
              />
              <circle
                cx={d.x}
                cy={d.y}
                r={2}
                fill="oklch(85% 0.18 200)"
                style={{ filter: "drop-shadow(0 0 3px oklch(85% 0.18 200))" }}
              />
            </g>
          ))}
        </svg>
      </div>

      <button
        type="button"
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-xs text-muted-foreground hover:text-cyan border border-border hover:border-cyan/30 transition-all"
        data-ocid="relay.event-node.button"
      >
        <Globe className="w-3 h-3" />
        Event Node
      </button>
    </div>
  );
}
