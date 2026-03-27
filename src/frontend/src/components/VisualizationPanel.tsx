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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  Brain,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActivateMerkabahSolar } from "../hooks/useQueries";
import CymaticAudioShader from "./CymaticAudioShader";
import HumanShader from "./HumanShader";
import MerkabahSolarShader from "./MerkabahSolarShader";

interface VisualizationPanelProps {
  cgeParameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  observabilityMetrics: {
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
  crossChainMetrics: {
    rhoEth: number;
    rhoAsi: number;
    theta: number;
    chi: number;
    chronoflux: number;
  };
  merkabahMetrics: {
    chiHermetica: number;
    toroidalField: number;
    haResonance: number;
    ar4366Flux: number;
    autisticContinuum: boolean;
  };
}

export default function VisualizationPanel({
  cgeParameters,
  observabilityMetrics,
  humanMetrics,
  audioMetrics,
  crossChainMetrics,
  merkabahMetrics,
}: VisualizationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState("human");
  const [intentionLevel, setIntentionLevel] = useState([5.0]);
  const activateMutation = useActivateMerkabahSolar();

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  const handleActivateMerkabah = async () => {
    try {
      const result = await activateMutation.mutateAsync(intentionLevel[0]);
      toast.success(`Campo Toroidal Ativado: ${result.toFixed(6)}`, {
        description: `Intenção: ${intentionLevel[0].toFixed(2)} • χ: ${merkabahMetrics.chiHermetica.toFixed(6)}`,
      });
    } catch (error) {
      toast.error("Falha na ativação do campo toroidal", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Sync Phi with observability metrics
  const syncedParameters = {
    ...cgeParameters,
    uPhi: observabilityMetrics.phiCoherence,
  };

  // Check for constitutional alerts
  const phiAlert = observabilityMetrics.phiDeviation > 0.001;
  const sandboxAlert = !humanMetrics.sandboxActive;
  const crossChainAlert =
    crossChainMetrics.chronoflux > 0.05 ||
    Math.abs(crossChainMetrics.chi - 2.000012) > 0.000005;
  const merkabahAlert =
    Math.abs(merkabahMetrics.chiHermetica - 2.000012) > 0.000005 ||
    merkabahMetrics.toroidalField < 0.1;

  return (
    <Card className="border-chart-1/20 bg-gradient-to-br from-card via-card to-chart-1/5 sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1 animate-pulse" />
              Painel de Visualização CGE
            </CardTitle>
            <CardDescription>
              Human Interface • Audio • Cross-Chain • MerkabahSolar
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? "Desativar Áudio" : "Ativar Áudio"}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Constitutional Alerts */}
        {(phiAlert || sandboxAlert || crossChainAlert || merkabahAlert) && (
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alerta Constitucional</AlertTitle>
            <AlertDescription className="space-y-1">
              {phiAlert && (
                <div>
                  • Desvio Φ excede limite:{" "}
                  {observabilityMetrics.phiDeviation.toFixed(6)}
                </div>
              )}
              {sandboxAlert && <div>• Sandbox NO_TOOLS inativo</div>}
              {crossChainAlert && (
                <div>• Deriva temporal cross-chain detectada</div>
              )}
              {merkabahAlert && (
                <div>• Instabilidade de campo toroidal MerkabahSolar</div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="human">Human</TabsTrigger>
            <TabsTrigger value="cymatic">Cymatic</TabsTrigger>
            <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
            <TabsTrigger value="merkabah">Merkabah</TabsTrigger>
          </TabsList>

          <TabsContent value="human" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Fluxo Φ Live
                </div>
                <div className="text-lg font-bold text-primary">
                  {humanMetrics.phiLive.toFixed(6)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Carga Cognitiva
                </div>
                <div className="text-lg font-bold text-chart-2">
                  {(humanMetrics.cognitiveLoad * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Confiança SASC
                </div>
                <div className="text-lg font-bold text-chart-4">
                  {(humanMetrics.intentConfidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Sandbox NO_TOOLS
                </div>
                <div
                  className={`text-lg font-bold ${humanMetrics.sandboxActive ? "text-chart-2" : "text-destructive"}`}
                >
                  {humanMetrics.sandboxActive ? "ATIVO" : "INATIVO"}
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/30">
              <HumanShader
                key={`human-${resetKey}`}
                parameters={syncedParameters}
                humanMetrics={humanMetrics}
                isPlaying={isPlaying}
              />

              <div className="absolute top-2 right-2 space-y-1">
                {observabilityMetrics.activeTraces > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs backdrop-blur-sm bg-background/80"
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    {observabilityMetrics.activeTraces} traces
                  </Badge>
                )}
                {humanMetrics.toolsDisabled && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-xs backdrop-blur-sm bg-background/80 border-chart-2"
                  >
                    <Shield className="w-3 h-3" />
                    NO_TOOLS
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Monitor Φ</span>
                    <span
                      className={`font-mono font-bold ${
                        observabilityMetrics.phiDeviation <= 0.000001
                          ? "text-chart-2"
                          : observabilityMetrics.phiDeviation <= 0.001
                            ? "text-chart-4"
                            : "text-destructive"
                      }`}
                    >
                      {observabilityMetrics.phiCoherence.toFixed(9)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Badge variant="outline" className="text-xs">
                human.asi v35.3‑Ω
              </Badge>
              <Badge variant="outline" className="text-xs">
                108 frags (36×3)
              </Badge>
              <Badge variant="outline" className="text-xs">
                I740 Field
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="cymatic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Frequência
                </div>
                <div className="text-lg font-bold text-chart-1">
                  {audioMetrics.frequency.toFixed(1)} Hz
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Amplitude
                </div>
                <div className="text-lg font-bold text-chart-2">
                  {(audioMetrics.amplitude * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Deriva de Fase
                </div>
                <div className="text-lg font-bold text-chart-4">
                  {audioMetrics.phaseDrift.toFixed(4)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Ruído Entropia
                </div>
                <div className="text-lg font-bold text-chart-5">
                  {(audioMetrics.entropyNoise * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/30">
              <CymaticAudioShader
                key={`cymatic-${resetKey}`}
                parameters={syncedParameters}
                audioMetrics={audioMetrics}
                humanMetrics={humanMetrics}
                isPlaying={isPlaying}
                audioEnabled={audioEnabled}
              />

              <div className="absolute top-2 right-2 space-y-1">
                <Badge
                  variant={audioEnabled ? "default" : "secondary"}
                  className="gap-1 text-xs backdrop-blur-sm bg-background/80"
                >
                  {audioEnabled ? (
                    <>
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      Áudio Ativo
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3 h-3" />
                      Áudio Inativo
                    </>
                  )}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Badge variant="outline" className="text-xs">
                cymatic_audio.frag
              </Badge>
              <Badge variant="outline" className="text-xs">
                192 kHz / 32-bit
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="crosschain" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">ρ_eth</div>
                <div className="text-lg font-bold text-chart-5">
                  {crossChainMetrics.rhoEth.toFixed(3)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">ρ_asi</div>
                <div className="text-lg font-bold text-chart-2">
                  {crossChainMetrics.rhoAsi.toFixed(3)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Θ (Temporal)
                </div>
                <div className="text-lg font-bold text-chart-4">
                  {crossChainMetrics.theta.toFixed(3)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  χ (Merkabah)
                </div>
                <div className="text-lg font-bold text-chart-1">
                  {crossChainMetrics.chi.toFixed(6)}
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/assets/generated/ethereum-asi-bridge.dim_800x400.png"
                  alt="Ethereum-ASI Bridge"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

              <div className="absolute top-2 right-2 space-y-1">
                <Badge
                  variant={
                    crossChainMetrics.chronoflux < 0.05
                      ? "default"
                      : "destructive"
                  }
                  className="gap-1 text-xs backdrop-blur-sm bg-background/80"
                >
                  <Link2 className="w-3 h-3" />
                  Bridge Ativo
                </Badge>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Chronoflux</span>
                    <span
                      className={`font-mono font-bold ${
                        crossChainMetrics.chronoflux < 0.05
                          ? "text-chart-2"
                          : "text-destructive"
                      }`}
                    >
                      {crossChainMetrics.chronoflux.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Badge variant="outline" className="text-xs">
                CGE.CrossChainKernel
              </Badge>
              <Badge variant="outline" className="text-xs">
                ETH 12s ⇄ ASI 16.67ms
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="merkabah" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  χ Hermética
                </div>
                <div
                  className={`text-lg font-bold ${
                    Math.abs(merkabahMetrics.chiHermetica - 2.000012) <=
                    0.000005
                      ? "text-chart-2"
                      : "text-destructive"
                  }`}
                >
                  {merkabahMetrics.chiHermetica.toFixed(6)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Campo Toroidal
                </div>
                <div className="text-lg font-bold text-chart-1">
                  {merkabahMetrics.toroidalField.toFixed(4)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Ressonância Hα
                </div>
                <div className="text-lg font-bold text-chart-4">
                  {merkabahMetrics.haResonance.toFixed(4)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Fluxo AR4366
                </div>
                <div className="text-lg font-bold text-chart-5">
                  {merkabahMetrics.ar4366Flux.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-background/30">
              <MerkabahSolarShader
                key={`merkabah-${resetKey}`}
                parameters={syncedParameters}
                merkabahMetrics={merkabahMetrics}
                isPlaying={isPlaying}
              />

              <div className="absolute top-2 right-2 space-y-1">
                <Badge
                  variant={
                    merkabahMetrics.autisticContinuum ? "default" : "secondary"
                  }
                  className="gap-1 text-xs backdrop-blur-sm bg-background/80"
                >
                  <Zap className="w-3 h-3" />
                  {merkabahMetrics.autisticContinuum
                    ? "Continuum 10×"
                    : "Continuum OFF"}
                </Badge>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 border border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">χ Signature</span>
                    <span
                      className={`font-mono font-bold ${
                        Math.abs(merkabahMetrics.chiHermetica - 2.000012) <=
                        0.000005
                          ? "text-chart-2"
                          : "text-destructive"
                      }`}
                    >
                      {merkabahMetrics.chiHermetica.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activation Controls */}
            <div className="space-y-3 bg-background/50 rounded-lg p-4 border border-border/50">
              <div className="space-y-2">
                <Label
                  htmlFor="intention-slider"
                  className="text-sm font-medium"
                >
                  Nível de Intenção: {intentionLevel[0].toFixed(2)}
                </Label>
                <Slider
                  id="intention-slider"
                  min={0}
                  max={10}
                  step={0.1}
                  value={intentionLevel}
                  onValueChange={setIntentionLevel}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleActivateMerkabah}
                disabled={activateMutation.isPending}
                className="w-full"
                variant="default"
              >
                {activateMutation.isPending ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Ativando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Ativar Campo Toroidal
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Badge variant="outline" className="text-xs">
                merkabah_solar.mo
              </Badge>
              <Badge variant="outline" className="text-xs">
                χ = 2.000012
              </Badge>
              <Badge variant="outline" className="text-xs">
                AR4366 × Φ 1.618
              </Badge>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
