import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Fuel,
  GitBranch,
  Radio,
  Shield,
  Sliders,
  Tv,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  CrossChainEvent,
  EthereumAgent,
  TVBroadcastSummary,
} from "../backend";
import {
  useCrossChainEvents,
  useCrossChainMetrics,
  useEthereumAgents,
  useTVBroadcastSummaries,
} from "../hooks/useQueries";
import ArbitrageActivity from "./ArbitrageActivity";
import CrossChainBridgePanel from "./CrossChainBridgePanel";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  return d.toLocaleTimeString("en-US", { hour12: false });
}

function eventStatusColor(type: string) {
  if (type.includes("error") || type.includes("fail"))
    return "oklch(55% 0.22 25)";
  if (type.includes("pending") || type.includes("sync"))
    return "oklch(80% 0.18 80)";
  return "oklch(75% 0.22 150)";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
      {label}
    </p>
  );
}

function CardShell({
  children,
  ocid,
}: {
  children: React.ReactNode;
  ocid?: string;
}) {
  return (
    <div
      className="card-glow rounded-lg border border-border p-5 flex flex-col"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid={ocid}
    >
      {children}
    </div>
  );
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className="text-xs font-mono font-semibold"
        style={{ color: color ?? "oklch(85% 0.18 200)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Cross-Chain Metrics Panel ────────────────────────────────────────────────

function CrossChainMetricsPanel() {
  const { data: metrics, isLoading } = useCrossChainMetrics();

  return (
    <CardShell ocid="trading.cc-metrics">
      <SectionLabel label="Cross-Chain Metrics" />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
            <Skeleton key={i} className="h-7 w-full rounded" />
          ))}
        </div>
      )}

      {!isLoading && metrics && (
        <div className="flex flex-col flex-1">
          <MetricRow
            label="ρ_eth (Ethereum Density)"
            value={metrics.rhoEth.toFixed(3)}
            color={
              metrics.rhoEth > 0.7
                ? "oklch(75% 0.22 150)"
                : "oklch(80% 0.18 80)"
            }
          />
          <MetricRow
            label="ρ_asi (ASI Density)"
            value={metrics.rhoAsi.toFixed(3)}
            color={
              metrics.rhoAsi > 0.8
                ? "oklch(75% 0.22 150)"
                : "oklch(80% 0.18 80)"
            }
          />
          <MetricRow
            label="Φ (Constitutional Integrity)"
            value={metrics.phi.toFixed(6)}
            color={
              Math.abs(metrics.phi - 1.038) <= 0.001
                ? "oklch(75% 0.22 150)"
                : "oklch(55% 0.22 25)"
            }
          />
          <MetricRow
            label="Θ (Temporal Sync)"
            value={metrics.theta.toFixed(3)}
            color={
              metrics.theta > 0.9 ? "oklch(75% 0.22 150)" : "oklch(80% 0.18 80)"
            }
          />
          <MetricRow
            label="χ (Merkabah)"
            value={metrics.chi.toFixed(6)}
            color={
              Math.abs(metrics.chi - 2.000012) <= 0.000005
                ? "oklch(75% 0.22 150)"
                : "oklch(55% 0.22 25)"
            }
          />
          <MetricRow
            label="Chronoflux (Temporal Drift)"
            value={metrics.chronoflux.toFixed(4)}
            color={
              metrics.chronoflux < 0.05
                ? "oklch(75% 0.22 150)"
                : "oklch(55% 0.22 25)"
            }
          />

          {/* Invariant badges */}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Invariants
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(["inv1", "inv2", "inv3", "inv4", "inv5", "inv6"] as const).map(
                (key) => (
                  <span
                    key={key}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                    style={{
                      color: metrics[key]
                        ? "oklch(75% 0.22 150)"
                        : "oklch(55% 0.22 25)",
                      background: metrics[key]
                        ? "oklch(75% 0.22 150 / 0.1)"
                        : "oklch(55% 0.22 25 / 0.1)",
                      borderColor: metrics[key]
                        ? "oklch(75% 0.22 150 / 0.3)"
                        : "oklch(55% 0.22 25 / 0.3)",
                    }}
                  >
                    {key.toUpperCase()}: {metrics[key] ? "✓" : "✗"}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoading && !metrics && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6">
          <Activity className="w-8 h-8 text-muted-foreground opacity-40" />
          <p className="text-xs text-muted-foreground">No metrics available</p>
        </div>
      )}
    </CardShell>
  );
}

// ─── Cross-Chain Events Log ───────────────────────────────────────────────────

function CrossChainEventsLog() {
  const { data: events, isLoading } = useCrossChainEvents();

  return (
    <CardShell ocid="trading.cc-events">
      <SectionLabel label="Cross-Chain Events Log" />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      )}

      {!isLoading && events && events.length > 0 && (
        <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto pr-1">
          {events.map((ev: CrossChainEvent, i: number) => (
            <div
              key={`${ev.eventType}-${ev.timestamp.toString()}`}
              className="rounded border border-border/40 px-3 py-2"
              style={{ background: "oklch(10% 0.02 270)" }}
              data-ocid={`trading.cc-event.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[10px] font-mono font-semibold uppercase tracking-wider"
                  style={{ color: eventStatusColor(ev.eventType) }}
                >
                  {ev.eventType}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatTimestamp(ev.timestamp)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {ev.details}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!events || events.length === 0) && (
        <div
          className="flex flex-col items-center justify-center flex-1 gap-2 py-8 rounded border border-border/30"
          style={{ background: "oklch(10% 0.02 270)" }}
        >
          <GitBranch className="w-8 h-8 text-muted-foreground opacity-40" />
          <p className="text-xs text-muted-foreground">No events recorded</p>
          <p className="text-[10px] text-muted-foreground opacity-60">
            Cross-chain events will appear here
          </p>
        </div>
      )}
    </CardShell>
  );
}

// ─── TV Broadcast Summaries ───────────────────────────────────────────────────

function TVBroadcastSummaries() {
  const { data: summaries, isLoading } = useTVBroadcastSummaries();

  function signalColor(strength: number) {
    if (strength >= 0.85) return "oklch(75% 0.22 150)";
    if (strength >= 0.6) return "oklch(80% 0.18 80)";
    return "oklch(55% 0.22 25)";
  }

  return (
    <CardShell ocid="trading.tv-summaries">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel label="TV Broadcast Summaries" />
        <Tv className="w-4 h-4 text-muted-foreground -mt-4 opacity-60" />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
            <Skeleton key={i} className="h-16 w-full rounded" />
          ))}
        </div>
      )}

      {!isLoading && summaries && summaries.length > 0 && (
        <div className="flex flex-col gap-2">
          {summaries.map((s: TVBroadcastSummary, i: number) => (
            <div
              key={`${s.broadcastId.toString()}-${s.nodeId}`}
              className="rounded border border-border/40 px-3 py-2.5"
              style={{ background: "oklch(10% 0.02 270)" }}
              data-ocid={`trading.tv-summary.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-mono text-foreground">
                    #{s.broadcastId.toString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {s.nodeId}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 border-border/60"
                  style={{ color: signalColor(s.signalStrength) }}
                >
                  {s.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Signal
                  </p>
                  <p
                    className="text-xs font-mono font-semibold"
                    style={{ color: signalColor(s.signalStrength) }}
                  >
                    {(s.signalStrength * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    Quality
                  </p>
                  <p
                    className="text-xs font-mono font-semibold"
                    style={{ color: signalColor(s.transmissionQuality) }}
                  >
                    {(s.transmissionQuality * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!summaries || summaries.length === 0) && (
        <div
          className="flex flex-col items-center justify-center flex-1 gap-2 py-8 rounded border border-border/30"
          style={{ background: "oklch(10% 0.02 270)" }}
        >
          <Tv className="w-8 h-8 text-muted-foreground opacity-40" />
          <p className="text-xs text-muted-foreground">No active broadcasts</p>
        </div>
      )}
    </CardShell>
  );
}

// ─── Ethereum Agents ──────────────────────────────────────────────────────────

function EthereumAgentsList() {
  const { data: agents, isLoading } = useEthereumAgents();

  const SEED_AGENTS: EthereumAgent[] = [
    {
      address: "0x7f3a2c91d84e5b1f",
      checksumValid: true,
      entropyScore: 0.93,
      dhtMetrics: {
        dhtScore: 0.88,
        merkleVerified: true,
        nodeCount: BigInt(142),
      },
    },
    {
      address: "0x4b8ef7a219c30d56",
      checksumValid: true,
      entropyScore: 0.87,
      dhtMetrics: {
        dhtScore: 0.79,
        merkleVerified: true,
        nodeCount: BigInt(98),
      },
    },
    {
      address: "0x9d1c3e852a5f8b14",
      checksumValid: false,
      entropyScore: 0.61,
      dhtMetrics: {
        dhtScore: 0.54,
        merkleVerified: false,
        nodeCount: BigInt(23),
      },
    },
  ];

  const displayAgents = agents && agents.length > 0 ? agents : SEED_AGENTS;

  return (
    <CardShell ocid="trading.eth-agents">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel label="Ethereum Agents" />
        <Bot className="w-4 h-4 text-muted-foreground -mt-4 opacity-60" />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
            <Skeleton key={i} className="h-16 w-full rounded" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
          {displayAgents.map((agent: EthereumAgent, i: number) => (
            <div
              key={agent.address}
              className="rounded border border-border/40 px-3 py-2.5"
              style={{ background: "oklch(10% 0.02 270)" }}
              data-ocid={`trading.eth-agent.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-foreground truncate max-w-[160px]">
                  {agent.address}
                </span>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 border-border/60"
                  style={{
                    color: agent.checksumValid
                      ? "oklch(75% 0.22 150)"
                      : "oklch(55% 0.22 25)",
                  }}
                >
                  {agent.checksumValid ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Valid
                    </span>
                  ) : (
                    "Invalid"
                  )}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>
                  Entropy:{" "}
                  <span
                    className="font-mono"
                    style={{
                      color:
                        agent.entropyScore > 0.8
                          ? "oklch(75% 0.22 150)"
                          : "oklch(80% 0.18 80)",
                    }}
                  >
                    {(agent.entropyScore * 100).toFixed(0)}%
                  </span>
                </span>
                <span>
                  DHT:{" "}
                  <span
                    className="font-mono"
                    style={{ color: "oklch(60% 0.22 250)" }}
                  >
                    {agent.dhtMetrics.dhtScore.toFixed(2)}
                  </span>
                </span>
                <span>
                  Nodes:{" "}
                  <span className="font-mono text-foreground">
                    {agent.dhtMetrics.nodeCount.toString()}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardShell>
  );
}

// ─── Gas & Slippage ───────────────────────────────────────────────────────────

function GasSlippagePanel() {
  const [gasPrice, setGasPrice] = useState(34.2);
  const [slippage] = useState(0.5);
  const [baseFee, setBaseFee] = useState(28.4);
  const [priorityFee, setPriorityFee] = useState(2.1);

  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.5) * 3;
      setGasPrice((p) => Number.parseFloat(Math.max(10, p + delta).toFixed(1)));
      setBaseFee((p) =>
        Number.parseFloat(
          Math.max(8, p + (Math.random() - 0.5) * 2).toFixed(1),
        ),
      );
      setPriorityFee((p) =>
        Number.parseFloat(
          Math.max(0.5, p + (Math.random() - 0.5) * 0.5).toFixed(2),
        ),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <CardShell ocid="trading.gas-panel">
      <div className="flex items-center gap-2 mb-4">
        <Fuel className="w-4 h-4 text-muted-foreground" />
        <SectionLabel label="Gas Estimation" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded border border-border/40 p-3 flex flex-col gap-1"
          style={{ background: "oklch(10% 0.02 270)" }}
        >
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Gas Price
          </p>
          <p
            className="text-lg font-mono font-bold"
            style={{ color: "oklch(85% 0.18 200)" }}
          >
            {gasPrice} <span className="text-xs font-normal">Gwei</span>
          </p>
        </div>
        <div
          className="rounded border border-border/40 p-3 flex flex-col gap-1"
          style={{ background: "oklch(10% 0.02 270)" }}
        >
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Slippage Tolerance
          </p>
          <p
            className="text-lg font-mono font-bold"
            style={{ color: "oklch(65% 0.28 305)" }}
          >
            {slippage}%
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <MetricRow
          label="Base Fee (EIP-1559)"
          value={`${baseFee} Gwei`}
          color="oklch(60% 0.22 250)"
        />
        <MetricRow
          label="Priority Fee (Tip)"
          value={`${priorityFee} Gwei`}
          color="oklch(80% 0.18 80)"
        />
        <MetricRow
          label="Max Fee"
          value={`${(baseFee * 2 + priorityFee).toFixed(1)} Gwei`}
          color="oklch(85% 0.18 200)"
        />
        <MetricRow
          label="Est. Confirmation"
          value="~12s"
          color="oklch(75% 0.22 150)"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Sliders className="w-3 h-3 text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Quorum Consensus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1.5 rounded-full"
            style={{ background: "oklch(20% 0.04 270)" }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-1000"
              style={{
                width: "96%",
                background:
                  "linear-gradient(to right, oklch(60% 0.22 250), oklch(85% 0.18 200))",
                boxShadow: "0 0 6px oklch(85% 0.18 200 / 0.6)",
              }}
            />
          </div>
          <span
            className="text-[10px] font-mono"
            style={{ color: "oklch(85% 0.18 200)" }}
          >
            96%
          </span>
        </div>
      </div>
    </CardShell>
  );
}

// ─── System Status Strip ──────────────────────────────────────────────────────

function TradingStatusStrip() {
  const { data: metrics } = useCrossChainMetrics();
  const [uptime] = useState("14d 06h 32m");

  const isHealthy = metrics
    ? Math.abs(metrics.phi - 1.038) <= 0.001 && metrics.theta > 0.9
    : true;

  return (
    <div
      className="rounded-lg border border-border/60 px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: "oklch(11% 0.025 270)" }}
      data-ocid="trading.status-strip"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: isHealthy
              ? "oklch(75% 0.22 150)"
              : "oklch(55% 0.22 25)",
            boxShadow: `0 0 6px ${isHealthy ? "oklch(75% 0.22 150 / 0.8)" : "oklch(55% 0.22 25 / 0.8)"}`,
          }}
        />
        <span
          className="text-xs font-medium"
          style={{
            color: isHealthy ? "oklch(75% 0.22 150)" : "oklch(55% 0.22 25)",
          }}
        >
          {isHealthy ? "System Healthy" : "Degraded State"}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          Uptime: <span className="font-mono text-foreground">{uptime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Cpu className="w-3 h-3" />
          Engine:{" "}
          <span className="font-mono" style={{ color: "oklch(65% 0.28 305)" }}>
            CGE v2.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Zap className="w-3 h-3" />
          Mode:{" "}
          <span className="font-mono" style={{ color: "oklch(60% 0.22 250)" }}>
            AUTONOMOUS
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main TradingTab ──────────────────────────────────────────────────────────

export default function TradingTab() {
  const DUMMY_CGE = {
    uPhi: 1.038,
    uActiveDomains: 6,
    uPendingVotes: 2,
    uConsensusLevel: 0.96,
  };
  const DUMMY_HUMAN = {
    cognitiveLoad: 0.42,
    phiLive: 1.038,
    intentConfidence: 0.91,
    sandboxActive: true,
    toolsDisabled: false,
  };

  return (
    <div className="flex flex-col gap-5" data-ocid="trading.tab">
      {/* Status strip */}
      <TradingStatusStrip />

      {/* Row 1: DEX feed + Gas/Slippage + CC Metrics */}
      <div className="grid grid-cols-3 gap-5">
        <ArbitrageActivity />
        <GasSlippagePanel />
        <CrossChainMetricsPanel />
      </div>

      {/* Row 2: Events + TV Summaries + Eth Agents */}
      <div className="grid grid-cols-3 gap-5">
        <CrossChainEventsLog />
        <TVBroadcastSummaries />
        <EthereumAgentsList />
      </div>

      {/* Row 3: Cross-Chain Bridge (full width, 2-col) */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 3fr" }}>
        <div className="flex flex-col gap-5">
          {/* Compact bridge metrics summary */}
          <CardShell ocid="trading.bridge-summary">
            <SectionLabel label="Bridge Synopsis" />
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "EIP-55 Validation",
                  icon: Shield,
                  color: "oklch(75% 0.22 150)",
                },
                { label: "MaiHH DHT", icon: Cpu, color: "oklch(60% 0.22 250)" },
                {
                  label: "150× Redundancy",
                  icon: GitBranch,
                  color: "oklch(65% 0.28 305)",
                },
                {
                  label: "Eternity Crystal",
                  icon: Zap,
                  color: "oklch(85% 0.18 200)",
                },
              ].map(({ label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded border border-border/40 p-3 flex items-center gap-2"
                  style={{ background: "oklch(10% 0.02 270)" }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </CardShell>
        </div>

        <CrossChainBridgePanel
          cgeParameters={DUMMY_CGE}
          humanMetrics={DUMMY_HUMAN}
        />
      </div>
    </div>
  );
}
