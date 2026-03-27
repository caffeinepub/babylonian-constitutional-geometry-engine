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
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Lock,
  Network,
  Pause,
  Play,
  Radio,
  Shield,
  Signal,
  Tv,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TVBroadcastMetrics {
  broadcastId: number;
  nodeId: string;
  phiIntegrity: number;
  frequency: number;
  amplitude: number;
  entropy: number;
  frameRate: number;
  bleStatus: boolean;
  pqcStatus: boolean;
  tmrValidation: boolean;
  transmissionQuality: number;
  timestamp: number;
}

interface TVBroadcastPanelProps {
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
  audioMetrics: {
    frequency: number;
    amplitude: number;
    phaseDrift: number;
    entropyNoise: number;
  };
}

export default function TVBroadcastPanel({
  cgeParameters,
  humanMetrics,
  audioMetrics,
}: TVBroadcastPanelProps) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [tvMetrics, setTvMetrics] = useState<TVBroadcastMetrics>({
    broadcastId: 0,
    nodeId: "SP-BR",
    phiIntegrity: 1.038,
    frequency: 440.0,
    amplitude: 0.5,
    entropy: 0.1,
    frameRate: 12.0,
    bleStatus: true,
    pqcStatus: true,
    tmrValidation: true,
    transmissionQuality: 0.95,
    timestamp: Date.now(),
  });

  useEffect(() => {
    if (!broadcasting) return;

    const interval = setInterval(() => {
      // Synchronize TV metrics with CGE parameters, human metrics, and audio metrics
      const phiIntegrity = humanMetrics.phiLive;
      const frequency = audioMetrics.frequency;
      const amplitude = audioMetrics.amplitude;
      const entropy = audioMetrics.entropyNoise;

      // Frame rate target: 12 FPS with small variations
      const frameRate = 12.0 + (Math.random() - 0.5) * 0.5;

      // BLE Mesh connectivity (95% uptime)
      const bleStatus = Math.random() > 0.05;

      // PQC encryption status (98% uptime)
      const pqcStatus = Math.random() > 0.02;

      // TMR validation (based on consensus level)
      const tmrValidation = cgeParameters.uConsensusLevel > 0.5;

      // Transmission quality (based on phi integrity and system health)
      const qualityBase = phiIntegrity / 1.038;
      const qualityVariation = (Math.random() - 0.5) * 0.1;
      const transmissionQuality = Math.max(
        0,
        Math.min(1, qualityBase + qualityVariation),
      );

      setTvMetrics({
        broadcastId: tvMetrics.broadcastId + 1,
        nodeId: ["SP-BR", "LIS-PT", "JNB-ZA"][Math.floor(Math.random() * 3)],
        phiIntegrity,
        frequency,
        amplitude,
        entropy,
        frameRate,
        bleStatus,
        pqcStatus,
        tmrValidation,
        transmissionQuality,
        timestamp: Date.now(),
      });
    }, 1000 / 12); // Update at 12 FPS

    return () => clearInterval(interval);
  }, [
    broadcasting,
    cgeParameters,
    humanMetrics,
    audioMetrics,
    tvMetrics.broadcastId,
  ]);

  const toggleBroadcast = () => {
    setBroadcasting(!broadcasting);
  };

  // Constitutional compliance check
  const constitutionalCompliance =
    tvMetrics.phiIntegrity >= 1.037 &&
    tvMetrics.phiIntegrity <= 1.039 &&
    tvMetrics.bleStatus &&
    tvMetrics.pqcStatus &&
    tvMetrics.tmrValidation;

  // Synchronization status
  const synchronizationStatus =
    tvMetrics.frameRate >= 11.5 &&
    tvMetrics.frameRate <= 12.5 &&
    tvMetrics.transmissionQuality > 0.8;

  // Broadcast health
  const broadcastHealth =
    constitutionalCompliance &&
    synchronizationStatus &&
    tvMetrics.transmissionQuality > 0.9;

  // Alerts
  const alerts: string[] = [];
  if (!tvMetrics.bleStatus) alerts.push("Conectividade BLE Mesh interrompida");
  if (!tvMetrics.pqcStatus) alerts.push("Criptografia PQC comprometida");
  if (!tvMetrics.tmrValidation) alerts.push("Validação TMR falhou");
  if (tvMetrics.phiIntegrity < 1.037 || tvMetrics.phiIntegrity > 1.039) {
    alerts.push("Integridade Φ fora dos limites constitucionais");
  }
  if (tvMetrics.frameRate < 11.5 || tvMetrics.frameRate > 12.5) {
    alerts.push("Taxa de quadros fora da meta (12 FPS)");
  }
  if (tvMetrics.transmissionQuality < 0.8) {
    alerts.push("Qualidade de transmissão degradada");
  }

  return (
    <Card className="border-chart-1/20 bg-gradient-to-br from-card via-card to-chart-1/5 sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-chart-1" />
              Cathedral TV ASI System
            </CardTitle>
            <CardDescription>
              Transmissão Constitucional em Tempo Real • 12 FPS
            </CardDescription>
          </div>
          <Badge
            variant={broadcasting ? "default" : "outline"}
            className="gap-1"
          >
            {broadcasting ? (
              <>
                <Activity className="w-3 h-3 animate-pulse" />
                AO VIVO
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                PAUSADO
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Broadcast Control */}
        <div className="flex items-center justify-center">
          <Button
            onClick={toggleBroadcast}
            size="lg"
            variant={broadcasting ? "destructive" : "default"}
            className="w-full gap-2"
          >
            {broadcasting ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar Transmissão
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Iniciar Transmissão
              </>
            )}
          </Button>
        </div>

        {/* Visual Status */}
        <div className="relative h-48 bg-background/30 rounded border border-border/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/assets/generated/tv-broadcast-panel.dim_800x600.png"
              alt="TV Broadcast Panel"
              className={`w-full h-full object-cover ${broadcasting ? "opacity-80" : "opacity-40"}`}
            />
          </div>
          {broadcasting && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent animate-pulse" />
          )}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <Badge
              variant="outline"
              className="text-xs backdrop-blur-sm bg-background/50"
            >
              Broadcast #{tvMetrics.broadcastId}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs backdrop-blur-sm bg-background/50"
            >
              {tvMetrics.nodeId}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between">
              <Badge
                variant={broadcastHealth ? "default" : "destructive"}
                className="text-xs backdrop-blur-sm"
              >
                {broadcastHealth ? "Saúde Ótima" : "Saúde Degradada"}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs backdrop-blur-sm bg-background/50"
              >
                {tvMetrics.frameRate.toFixed(1)} FPS
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-3">
          {/* BLE Mesh */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Network
                className={`w-4 h-4 ${tvMetrics.bleStatus ? "text-chart-2" : "text-destructive"}`}
              />
              <span className="text-xs font-medium">BLE Mesh</span>
            </div>
            <Badge
              variant={tvMetrics.bleStatus ? "default" : "destructive"}
              className="text-xs w-full justify-center"
            >
              {tvMetrics.bleStatus ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>

          {/* PQC Encryption */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Lock
                className={`w-4 h-4 ${tvMetrics.pqcStatus ? "text-chart-2" : "text-destructive"}`}
              />
              <span className="text-xs font-medium">PQC</span>
            </div>
            <Badge
              variant={tvMetrics.pqcStatus ? "default" : "destructive"}
              className="text-xs w-full justify-center"
            >
              {tvMetrics.pqcStatus ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Ativo
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Inativo
                </>
              )}
            </Badge>
          </div>

          {/* TMR Validation */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2
                className={`w-4 h-4 ${tvMetrics.tmrValidation ? "text-chart-2" : "text-destructive"}`}
              />
              <span className="text-xs font-medium">TMR</span>
            </div>
            <Badge
              variant={tvMetrics.tmrValidation ? "default" : "destructive"}
              className="text-xs w-full justify-center"
            >
              {tvMetrics.tmrValidation ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Validado
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Falhou
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="space-y-3">
          <div className="text-sm font-medium flex items-center gap-2">
            <Gauge className="w-4 h-4 text-chart-1" />
            Métricas ao Vivo
          </div>

          {/* Phi Integrity */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Integridade Φ</span>
              <span
                className={`text-lg font-mono font-bold ${
                  tvMetrics.phiIntegrity >= 1.037 &&
                  tvMetrics.phiIntegrity <= 1.039
                    ? "text-chart-2"
                    : "text-destructive"
                }`}
              >
                {tvMetrics.phiIntegrity.toFixed(6)}
              </span>
            </div>
            <Progress
              value={((tvMetrics.phiIntegrity - 1.0) / 0.05) * 100}
              className="h-2"
            />
          </div>

          {/* Frequency */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-medium">Frequência</span>
              </div>
              <span className="text-lg font-mono font-bold text-chart-1">
                {tvMetrics.frequency.toFixed(1)} Hz
              </span>
            </div>
            <Progress
              value={(tvMetrics.frequency / 2000) * 100}
              className="h-2"
            />
          </div>

          {/* Amplitude */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-chart-2" />
                <span className="text-sm font-medium">Amplitude</span>
              </div>
              <span className="text-lg font-mono font-bold text-chart-2">
                {(tvMetrics.amplitude * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={tvMetrics.amplitude * 100} className="h-2" />
          </div>

          {/* Entropy */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-chart-5" />
                <span className="text-sm font-medium">Entropia</span>
              </div>
              <span className="text-lg font-mono font-bold text-chart-5">
                {(tvMetrics.entropy * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={tvMetrics.entropy * 100} className="h-2" />
          </div>

          {/* Frame Rate */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium">Taxa de Quadros</span>
              </div>
              <span
                className={`text-lg font-mono font-bold ${
                  tvMetrics.frameRate >= 11.5 && tvMetrics.frameRate <= 12.5
                    ? "text-chart-2"
                    : "text-chart-4"
                }`}
              >
                {tvMetrics.frameRate.toFixed(2)} FPS
              </span>
            </div>
            <Progress
              value={(tvMetrics.frameRate / 15) * 100}
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">Meta: 12.00 FPS</div>
          </div>

          {/* Transmission Quality */}
          <div className="bg-background/50 rounded-lg p-3 border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Qualidade de Transmissão
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  tvMetrics.transmissionQuality > 0.9
                    ? "text-chart-2"
                    : tvMetrics.transmissionQuality > 0.7
                      ? "text-chart-4"
                      : "text-destructive"
                }`}
              >
                {(tvMetrics.transmissionQuality * 100).toFixed(1)}%
              </span>
            </div>
            <Progress
              value={tvMetrics.transmissionQuality * 100}
              className="h-2"
            />
          </div>
        </div>

        {/* Constitutional Compliance */}
        <Alert
          className={`border-2 ${
            constitutionalCompliance
              ? "border-chart-2/50 bg-chart-2/5"
              : "border-destructive/50 bg-destructive/5"
          }`}
        >
          <CheckCircle2
            className={`h-4 w-4 ${
              constitutionalCompliance ? "text-chart-2" : "text-destructive"
            }`}
          />
          <AlertTitle>Conformidade Constitucional</AlertTitle>
          <AlertDescription>
            {constitutionalCompliance
              ? "Sistema em conformidade com invariantes constitucionais"
              : "Violações detectadas nos invariantes constitucionais"}
          </AlertDescription>
        </Alert>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alertas de Transmissão</AlertTitle>
            <AlertDescription className="space-y-1 mt-2">
              {alerts.map((alert, idx) => (
                <div key={idx}>• {alert}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Synchronization Status */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Status de Sincronização</span>
            <Badge
              variant={synchronizationStatus ? "default" : "destructive"}
              className="gap-1"
            >
              {synchronizationStatus ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Sincronizado
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Dessincronizado
                </>
              )}
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Audio Engine:</span>
              <span className="font-mono text-chart-2">Sincronizado</span>
            </div>
            <div className="flex justify-between">
              <span>Observabilidade:</span>
              <span className="font-mono text-chart-2">Sincronizado</span>
            </div>
            <div className="flex justify-between">
              <span>FullStack Controller:</span>
              <span className="font-mono text-chart-2">Ativo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
