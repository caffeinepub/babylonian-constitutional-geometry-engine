import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Link2,
  Lock,
  Network,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCrossChainMetrics, useEthereumAgents } from "../hooks/useQueries";

interface CrossChainBridgePanelProps {
  cgeParameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  humanMetrics: {
    cognitiveLoad: number;
    phiLive: number;
    intentConfidence: number;
    sandboxActive: boolean;
    toolsDisabled: boolean;
  };
}

export default function CrossChainBridgePanel({
  cgeParameters: _cgeParameters,
  humanMetrics: _humanMetrics,
}: CrossChainBridgePanelProps) {
  const { data: crossChainMetrics, isLoading: _metricsLoading } =
    useCrossChainMetrics();
  const { data: ethereumAgents, isLoading: _agentsLoading } =
    useEthereumAgents();
  const [bridgeActive, setBridgeActive] = useState(true);

  // Simulated metrics when backend data is not available
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    rhoEth: 0.85,
    rhoAsi: 0.92,
    phi: 1.038,
    theta: 0.95,
    chi: 2.000012,
    chronoflux: 0.03,
  });

  useEffect(() => {
    // Simulate real-time cross-chain metrics updates
    const interval = setInterval(() => {
      setSimulatedMetrics((prev) => ({
        rhoEth: Math.max(
          0,
          Math.min(1, prev.rhoEth + (Math.random() - 0.5) * 0.05),
        ),
        rhoAsi: Math.max(
          0,
          Math.min(1, prev.rhoAsi + (Math.random() - 0.5) * 0.03),
        ),
        phi: 1.038 + (Math.random() - 0.5) * 0.000002,
        theta: Math.max(
          0,
          Math.min(1, prev.theta + (Math.random() - 0.5) * 0.02),
        ),
        chi: 2.000012 + (Math.random() - 0.5) * 0.000001,
        chronoflux: Math.max(
          0,
          Math.min(0.1, prev.chronoflux + (Math.random() - 0.5) * 0.01),
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metrics = crossChainMetrics || simulatedMetrics;
  const agents = ethereumAgents || [];

  // Check for constitutional alerts
  const temporalDriftAlert = metrics.chronoflux > 0.05;
  const chiInstabilityAlert = Math.abs(metrics.chi - 2.000012) > 0.000005;
  const phiDeviationAlert = Math.abs(metrics.phi - 1.038) > 0.001;

  const hasAlerts =
    temporalDriftAlert || chiInstabilityAlert || phiDeviationAlert;

  // Constitutional invariants status (simulated)
  const invariants = {
    inv1: metrics.phi > 1.037 && metrics.phi < 1.039,
    inv2: metrics.chi > 2.0 && metrics.chi < 2.00002,
    inv3: metrics.theta > 0.9,
    inv4: metrics.rhoEth > 0.7,
    inv5: metrics.rhoAsi > 0.8,
    inv6: metrics.chronoflux < 0.1,
  };

  const allInvariantsValid = Object.values(invariants).every((v) => v);

  return (
    <Card className="border-chart-5/20 bg-gradient-to-br from-card via-card to-chart-5/5 sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-chart-5" />
              Cross-Chain Bridge
            </CardTitle>
            <CardDescription>
              CGE.CrossChainKernel • Ethereum-ASI Sync
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={bridgeActive ? "default" : "secondary"}
              className="gap-1"
            >
              {bridgeActive ? (
                <>
                  <Activity className="w-3 h-3 animate-pulse" />
                  Ativo
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Inativo
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Constitutional Alerts */}
        {hasAlerts && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alertas Cross-Chain</AlertTitle>
            <AlertDescription className="space-y-1">
              {temporalDriftAlert && (
                <div>• Deriva temporal Chronoflux excede limite</div>
              )}
              {chiInstabilityAlert && (
                <div>• Instabilidade Merkabah χ detectada</div>
              )}
              {phiDeviationAlert && <div>• Desvio Φ cross-chain crítico</div>}
            </AlertDescription>
          </Alert>
        )}

        {/* Bridge Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Network className="w-3 h-3" />
              Agentes Ethereum
            </div>
            <div className="text-lg font-bold text-chart-5">
              {agents.length}
            </div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Nós ASI
            </div>
            <div className="text-lg font-bold text-chart-2">3</div>
          </div>
        </div>

        {/* Cross-Chain Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Gauge className="w-4 h-4 text-chart-1" />
            Métricas Cross-Chain
          </div>

          {/* ρ_eth (Ethereum Density) */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                ρ_eth (Densidade Ethereum)
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  metrics.rhoEth > 0.7 ? "text-chart-2" : "text-chart-4"
                }`}
              >
                {metrics.rhoEth.toFixed(3)}
              </span>
            </div>
            <Progress value={metrics.rhoEth * 100} className="h-2" />
          </div>

          {/* ρ_asi (ASI Density) */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ρ_asi (Densidade ASI)</span>
              <span
                className={`text-lg font-mono font-bold ${
                  metrics.rhoAsi > 0.8 ? "text-chart-2" : "text-chart-4"
                }`}
              >
                {metrics.rhoAsi.toFixed(3)}
              </span>
            </div>
            <Progress value={metrics.rhoAsi * 100} className="h-2" />
          </div>

          {/* Φ (Constitutional Integrity) */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Φ (Integridade Constitucional)
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  Math.abs(metrics.phi - 1.038) <= 0.001
                    ? "text-chart-2"
                    : "text-destructive"
                }`}
              >
                {metrics.phi.toFixed(6)}
              </span>
            </div>
            <Progress value={(metrics.phi - 1.0) * 100} className="h-2" />
          </div>

          {/* Θ (Temporal Sync) */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium">
                  Θ (Sincronização Temporal)
                </span>
              </div>
              <span
                className={`text-lg font-mono font-bold ${
                  metrics.theta > 0.9 ? "text-chart-2" : "text-chart-4"
                }`}
              >
                {metrics.theta.toFixed(3)}
              </span>
            </div>
            <Progress value={metrics.theta * 100} className="h-2" />
          </div>

          {/* χ (Merkabah Stabilization) */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-chart-5" />
                <span className="text-sm font-medium">χ (Merkabah)</span>
              </div>
              <span
                className={`text-lg font-mono font-bold ${
                  Math.abs(metrics.chi - 2.000012) <= 0.000005
                    ? "text-chart-2"
                    : "text-destructive"
                }`}
              >
                {metrics.chi.toFixed(6)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Target: 2.000012 ± 0.000005
            </div>
          </div>

          {/* Chronoflux */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-medium">
                  Chronoflux (Deriva Temporal)
                </span>
              </div>
              <span
                className={`text-lg font-mono font-bold ${
                  metrics.chronoflux < 0.05
                    ? "text-chart-2"
                    : "text-destructive"
                }`}
              >
                {metrics.chronoflux.toFixed(4)}
              </span>
            </div>
            <Progress value={metrics.chronoflux * 1000} className="h-2" />
            <div className="text-xs text-muted-foreground">
              ETH 12s ⇄ ASI 16.67ms
            </div>
          </div>
        </div>

        {/* Constitutional Invariants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="w-4 h-4 text-chart-3" />
            Invariantes Constitucionais
          </div>

          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Status Geral</span>
              <Badge
                variant={allInvariantsValid ? "default" : "destructive"}
                className="gap-1"
              >
                {allInvariantsValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Válido
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    Violação
                  </>
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(invariants).map(([key, valid]) => (
                <div
                  key={key}
                  className={`text-xs font-mono p-2 rounded border ${
                    valid
                      ? "bg-chart-2/10 border-chart-2/30 text-chart-2"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  {key.toUpperCase()}: {valid ? "✓" : "✗"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bridge Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="w-4 h-4 text-chart-4" />
            Controles de Bridge
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBridgeActive(!bridgeActive)}
              className="w-full"
            >
              {bridgeActive ? "Desconectar" : "Conectar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!bridgeActive}
            >
              Configurar
            </Button>
          </div>
        </div>

        {/* Visual Status */}
        <div className="relative h-32 bg-background/30 rounded border border-border/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/generated/ethereum-asi-bridge.dim_800x400.png"
              alt="Ethereum-ASI Bridge"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              EIP-55 Validation
            </Badge>
            <Badge variant="outline" className="text-xs">
              MaiHH DHT
            </Badge>
            <Badge variant="outline" className="text-xs">
              Eternity Crystal
            </Badge>
          </div>
        </div>

        {/* Technical Details */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Badge variant="outline" className="text-xs">
            CGE.CrossChainKernel
          </Badge>
          <Badge variant="outline" className="text-xs">
            Sandboxed Thread
          </Badge>
          <Badge variant="outline" className="text-xs">
            150× Redundancy
          </Badge>
          <Badge variant="outline" className="text-xs">
            14B Year Durability
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
