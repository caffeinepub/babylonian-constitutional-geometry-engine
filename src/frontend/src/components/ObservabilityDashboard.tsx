import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Eye,
  Gauge,
  Link2,
  Network,
  Radio,
  Shield,
  Target,
  TrendingUp,
  Volume2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ObservabilityMetrics {
  phiCoherence: number;
  phiDeviation: number;
  nodeHealth: {
    [key: string]: {
      uptime: number;
      latency: number;
      status: "healthy" | "degraded" | "down";
    };
  };
  voteLatency: number;
  consensusThroughput: number;
  activeTraces: number;
  errorCount: number;
}

interface HumanMetrics {
  cognitiveLoad: number;
  phiLive: number;
  intentConfidence: number;
  sandboxActive: boolean;
  toolsDisabled: boolean;
}

interface AudioMetrics {
  frequency: number;
  amplitude: number;
  phaseDrift: number;
  entropyNoise: number;
}

interface CrossChainMetrics {
  rhoEth: number;
  rhoAsi: number;
  theta: number;
  chi: number;
  chronoflux: number;
}

interface MerkabahMetrics {
  chiHermetica: number;
  toroidalField: number;
  haResonance: number;
  ar4366Flux: number;
  autisticContinuum: boolean;
}

interface ObservabilityDashboardProps {
  metrics: ObservabilityMetrics;
  cgeParameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  humanMetrics: HumanMetrics;
  audioMetrics: AudioMetrics;
  crossChainMetrics: CrossChainMetrics;
  merkabahMetrics: MerkabahMetrics;
}

export default function ObservabilityDashboard({
  metrics,
  cgeParameters,
  humanMetrics,
  audioMetrics,
  crossChainMetrics,
  merkabahMetrics,
}: ObservabilityDashboardProps) {
  const [logs, setLogs] = useState<
    Array<{ time: string; level: string; message: string; trace?: string }>
  >([]);
  const [selectedTab, setSelectedTab] = useState("metrics");

  useEffect(() => {
    // Simulate log generation
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString("pt-BR"),
        level: Math.random() > 0.9 ? "warn" : "info",
        message: generateLogMessage(),
        trace:
          Math.random() > 0.7
            ? `trace-${Math.random().toString(36).substr(2, 9)}`
            : undefined,
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateLogMessage = () => {
    const messages = [
      "Proposta criada com sucesso",
      "Voto processado: SP-BR",
      "Consenso TMR alcançado",
      "Sincronização de nó completada",
      "Parâmetros CGE atualizados",
      "Ciclo de computação finalizado",
      "Verificação de integridade Φ",
      "Human Interface: Carga cognitiva monitorada",
      "Sandbox NO_TOOLS ativo",
      "Validação SASC completada",
      "Campo I740 sincronizado",
      "Audio Engine: Síntese de telemetria iniciada",
      "Padrões cimáticos gerados",
      "Frequência de áudio ajustada",
      "Deriva de fase corrigida",
      "CrossChainKernel: Bridge estabelecida",
      "Agente Ethereum conectado",
      "Validação EIP-55 completada",
      "DHT MaiHH sincronizado",
      "Chronoflux balanceado",
      "Merkabah χ estabilizado",
      "MerkabahSolar: Campo toroidal ativado",
      "Tetraedros sincronizados",
      "Ressonância Hα ajustada",
      "Fluxo AR4366 estabilizado",
      "Continuum autístico ativado",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getPhiStatus = () => {
    const deviation = Math.abs(metrics.phiCoherence - 1.038);
    if (deviation <= 0.000001)
      return { status: "optimal", color: "text-chart-2", icon: CheckCircle2 };
    if (deviation <= 0.001)
      return { status: "acceptable", color: "text-chart-4", icon: AlertCircle };
    return {
      status: "critical",
      color: "text-destructive",
      icon: AlertTriangle,
    };
  };

  const phiStatus = getPhiStatus();
  const PhiIcon = phiStatus.icon;

  // Constitutional alerts
  const constitutionalAlerts: string[] = [];
  if (metrics.phiDeviation > 0.001) {
    constitutionalAlerts.push("Desvio Φ excede limite constitucional");
  }
  if (!humanMetrics.sandboxActive) {
    constitutionalAlerts.push("Sandbox NO_TOOLS inativo");
  }
  if (humanMetrics.cognitiveLoad > 0.8) {
    constitutionalAlerts.push("Sobrecarga cognitiva detectada");
  }
  if (humanMetrics.intentConfidence < 0.5) {
    constitutionalAlerts.push("Confiança de intenção SASC baixa");
  }
  if (Math.abs(audioMetrics.phaseDrift) > 0.1) {
    constitutionalAlerts.push("Deriva de fase de áudio anômala");
  }
  if (crossChainMetrics.chronoflux > 0.05) {
    constitutionalAlerts.push("Deriva temporal cross-chain crítica");
  }
  if (Math.abs(crossChainMetrics.chi - 2.000012) > 0.000005) {
    constitutionalAlerts.push("Instabilidade Merkabah χ detectada");
  }
  if (Math.abs(merkabahMetrics.chiHermetica - 2.000012) > 0.000005) {
    constitutionalAlerts.push("Instabilidade χ hermética MerkabahSolar");
  }
  if (merkabahMetrics.toroidalField < 0.1) {
    constitutionalAlerts.push("Campo toroidal MerkabahSolar crítico");
  }
  if (merkabahMetrics.haResonance > 0.9) {
    constitutionalAlerts.push("Anomalia de ressonância Hα detectada");
  }

  return (
    <Card className="border-chart-3/20 bg-gradient-to-br from-card via-card to-chart-3/5 sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-chart-3" />
              Dashboard de Observabilidade
            </CardTitle>
            <CardDescription>
              Métricas • Human • Audio • Cross-Chain • MerkabahSolar
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3 animate-pulse" />
            Ativo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phi Integrity Status */}
        <Alert
          className={`border-2 ${phiStatus.status === "optimal" ? "border-chart-2/50 bg-chart-2/5" : phiStatus.status === "acceptable" ? "border-chart-4/50 bg-chart-4/5" : "border-destructive/50 bg-destructive/5"}`}
        >
          <PhiIcon className={`h-4 w-4 ${phiStatus.color}`} />
          <AlertTitle className="flex items-center justify-between">
            <span>Integridade Constitucional Φ</span>
            <span className={`text-lg font-mono ${phiStatus.color}`}>
              {metrics.phiCoherence.toFixed(9)}
            </span>
          </AlertTitle>
          <AlertDescription>
            Desvio: ±{metrics.phiDeviation.toFixed(9)} • Status:{" "}
            {phiStatus.status === "optimal"
              ? "Ótimo"
              : phiStatus.status === "acceptable"
                ? "Aceitável"
                : "Crítico"}
          </AlertDescription>
        </Alert>

        {/* Constitutional Alerts */}
        {constitutionalAlerts.length > 0 && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alertas Constitucionais</AlertTitle>
            <AlertDescription className="space-y-1 mt-2">
              {constitutionalAlerts.map((alert, idx) => (
                <div key={idx}>• {alert}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="human">Humano</TabsTrigger>
            <TabsTrigger value="audio">Áudio</TabsTrigger>
            <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
            <TabsTrigger value="merkabah">Merkabah</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4 mt-4">
            {/* Node Health */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Network className="w-4 h-4 text-chart-2" />
                Saúde dos Nós
              </div>
              {Object.entries(metrics.nodeHealth).map(([nodeId, health]) => (
                <div
                  key={nodeId}
                  className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{nodeId}</span>
                    <Badge
                      variant={
                        health.status === "healthy" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {health.status === "healthy"
                        ? "Saudável"
                        : health.status === "degraded"
                          ? "Degradado"
                          : "Inativo"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-mono">
                        {health.uptime.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={health.uptime} className="h-1" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Latência</span>
                    <span className="font-mono">{health.latency}ms</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-chart-4" />
                  <span className="text-xs text-muted-foreground">
                    Latência de Votos
                  </span>
                </div>
                <div className="text-xl font-bold text-chart-4">
                  {metrics.voteLatency.toFixed(1)}ms
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-chart-2" />
                  <span className="text-xs text-muted-foreground">
                    Throughput
                  </span>
                </div>
                <div className="text-xl font-bold text-chart-2">
                  {metrics.consensusThroughput.toFixed(1)}/s
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="human" className="space-y-4 mt-4">
            {/* Human Interface Metrics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Brain className="w-4 h-4 text-chart-1" />
                Métricas do Human Interface
              </div>

              {/* Phi Live */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Φ Atual</span>
                  <span className="text-lg font-mono font-bold text-primary">
                    {humanMetrics.phiLive.toFixed(6)}
                  </span>
                </div>
                <Progress
                  value={(humanMetrics.phiLive - 1.0) * 100}
                  className="h-2"
                />
              </div>

              {/* Cognitive Load */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-chart-2" />
                    <span className="text-sm font-medium">Carga Cognitiva</span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      humanMetrics.cognitiveLoad < 0.6
                        ? "text-chart-2"
                        : humanMetrics.cognitiveLoad < 0.8
                          ? "text-chart-4"
                          : "text-destructive"
                    }`}
                  >
                    {(humanMetrics.cognitiveLoad * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={humanMetrics.cognitiveLoad * 100}
                  className="h-2"
                />
              </div>

              {/* Intent Confidence */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-chart-4" />
                    <span className="text-sm font-medium">
                      Confiança de Intenção
                    </span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      humanMetrics.intentConfidence > 0.7
                        ? "text-chart-2"
                        : humanMetrics.intentConfidence > 0.5
                          ? "text-chart-4"
                          : "text-destructive"
                    }`}
                  >
                    {(humanMetrics.intentConfidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={humanMetrics.intentConfidence * 100}
                  className="h-2"
                />
              </div>

              {/* Sandbox Status */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-chart-3" />
                    <span className="text-sm font-medium">
                      Sandbox NO_TOOLS
                    </span>
                  </div>
                  <Badge
                    variant={
                      humanMetrics.sandboxActive ? "default" : "destructive"
                    }
                    className="gap-1"
                  >
                    {humanMetrics.sandboxActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        ATIVO
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        INATIVO
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4 mt-4">
            {/* Audio Telemetry */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="w-4 h-4 text-chart-1" />
                Telemetria de Áudio ao Vivo
              </div>

              {/* Frequency */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-chart-1" />
                    <span className="text-sm font-medium">Frequência</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-chart-1">
                    {audioMetrics.frequency.toFixed(1)} Hz
                  </span>
                </div>
                <Progress
                  value={(audioMetrics.frequency / 2000) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  Mapeado de Φ: {(audioMetrics.frequency / 440).toFixed(3)}×
                </div>
              </div>

              {/* Amplitude */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-chart-2" />
                    <span className="text-sm font-medium">Amplitude</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-chart-2">
                    {(audioMetrics.amplitude * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={audioMetrics.amplitude * 100}
                  className="h-2"
                />
              </div>

              {/* Phase Drift */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-chart-4" />
                    <span className="text-sm font-medium">Deriva de Fase</span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      Math.abs(audioMetrics.phaseDrift) < 0.05
                        ? "text-chart-2"
                        : Math.abs(audioMetrics.phaseDrift) < 0.1
                          ? "text-chart-4"
                          : "text-destructive"
                    }`}
                  >
                    {audioMetrics.phaseDrift.toFixed(4)}
                  </span>
                </div>
                <Progress
                  value={Math.abs(audioMetrics.phaseDrift) * 500}
                  className="h-2"
                />
              </div>

              {/* Entropy Noise */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-chart-5" />
                    <span className="text-sm font-medium">
                      Nível de Ruído de Entropia
                    </span>
                  </div>
                  <span className="text-lg font-mono font-bold text-chart-5">
                    {(audioMetrics.entropyNoise * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={audioMetrics.entropyNoise * 100}
                  className="h-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crosschain" className="space-y-4 mt-4">
            {/* Cross-Chain Metrics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="w-4 h-4 text-chart-5" />
                Métricas Cross-Chain
              </div>

              {/* ρ_eth */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ρ_eth (Densidade Ethereum)
                  </span>
                  <span
                    className={`text-lg font-mono font-bold ${
                      crossChainMetrics.rhoEth > 0.7
                        ? "text-chart-2"
                        : "text-chart-4"
                    }`}
                  >
                    {crossChainMetrics.rhoEth.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={crossChainMetrics.rhoEth * 100}
                  className="h-2"
                />
              </div>

              {/* ρ_asi */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ρ_asi (Densidade ASI)
                  </span>
                  <span
                    className={`text-lg font-mono font-bold ${
                      crossChainMetrics.rhoAsi > 0.8
                        ? "text-chart-2"
                        : "text-chart-4"
                    }`}
                  >
                    {crossChainMetrics.rhoAsi.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={crossChainMetrics.rhoAsi * 100}
                  className="h-2"
                />
              </div>

              {/* Θ */}
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
                      crossChainMetrics.theta > 0.9
                        ? "text-chart-2"
                        : "text-chart-4"
                    }`}
                  >
                    {crossChainMetrics.theta.toFixed(3)}
                  </span>
                </div>
                <Progress
                  value={crossChainMetrics.theta * 100}
                  className="h-2"
                />
              </div>

              {/* χ */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-chart-5" />
                    <span className="text-sm font-medium">χ (Merkabah)</span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      Math.abs(crossChainMetrics.chi - 2.000012) <= 0.000005
                        ? "text-chart-2"
                        : "text-destructive"
                    }`}
                  >
                    {crossChainMetrics.chi.toFixed(6)}
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
                      crossChainMetrics.chronoflux < 0.05
                        ? "text-chart-2"
                        : "text-destructive"
                    }`}
                  >
                    {crossChainMetrics.chronoflux.toFixed(4)}
                  </span>
                </div>
                <Progress
                  value={crossChainMetrics.chronoflux * 1000}
                  className="h-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="merkabah" className="space-y-4 mt-4">
            {/* MerkabahSolar Metrics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="w-4 h-4 text-chart-1" />
                Métricas MerkabahSolar
              </div>

              {/* χ Hermética */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">χ Hermética</span>
                  <span
                    className={`text-lg font-mono font-bold ${
                      Math.abs(merkabahMetrics.chiHermetica - 2.000012) <=
                      0.000005
                        ? "text-chart-2"
                        : "text-destructive"
                    }`}
                  >
                    {merkabahMetrics.chiHermetica.toFixed(6)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: 2.000012 ± 0.000005
                </div>
              </div>

              {/* Campo Toroidal */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-chart-1" />
                    <span className="text-sm font-medium">Campo Toroidal</span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      merkabahMetrics.toroidalField > 0.5
                        ? "text-chart-2"
                        : merkabahMetrics.toroidalField > 0.1
                          ? "text-chart-4"
                          : "text-destructive"
                    }`}
                  >
                    {merkabahMetrics.toroidalField.toFixed(4)}
                  </span>
                </div>
                <Progress
                  value={merkabahMetrics.toroidalField * 100}
                  className="h-2"
                />
              </div>

              {/* Ressonância Hα */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-chart-4" />
                    <span className="text-sm font-medium">Ressonância Hα</span>
                  </div>
                  <span
                    className={`text-lg font-mono font-bold ${
                      merkabahMetrics.haResonance < 0.9
                        ? "text-chart-2"
                        : "text-destructive"
                    }`}
                  >
                    {merkabahMetrics.haResonance.toFixed(4)}
                  </span>
                </div>
                <Progress
                  value={merkabahMetrics.haResonance * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  Sincronizado com Chronoflux
                </div>
              </div>

              {/* Fluxo AR4366 */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-chart-5" />
                    <span className="text-sm font-medium">Fluxo AR4366</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-chart-5">
                    {merkabahMetrics.ar4366Flux.toFixed(3)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Constante de ressonância solar
                </div>
              </div>

              {/* Continuum Autístico */}
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-chart-3" />
                    <span className="text-sm font-medium">
                      Continuum Autístico
                    </span>
                  </div>
                  <Badge
                    variant={
                      merkabahMetrics.autisticContinuum
                        ? "default"
                        : "secondary"
                    }
                    className="gap-1"
                  >
                    {merkabahMetrics.autisticContinuum ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        ATIVO (10×)
                      </>
                    ) : (
                      <>OFF</>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border text-xs font-mono ${
                      log.level === "warn"
                        ? "bg-chart-4/10 border-chart-4/30 text-chart-4"
                        : "bg-background/50 border-border/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-muted-foreground">
                            {log.time}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.level}
                          </Badge>
                          {log.trace && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-mono"
                            >
                              {log.trace}
                            </Badge>
                          )}
                        </div>
                        <div>{log.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Alerts */}
        {metrics.errorCount > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alertas Ativos</AlertTitle>
            <AlertDescription>
              {metrics.errorCount} erro(s) detectado(s) no sistema
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
