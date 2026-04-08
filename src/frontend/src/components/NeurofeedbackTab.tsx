import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Brain,
  CheckCircle2,
  Heart,
  Loader2,
  Music2,
  RefreshCw,
  Sparkles,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  useActivateMerkabahSolar,
  useAudioMetrics,
  useCymaticParameters,
  useGenerateCymaticParameters,
  useHumanMetrics,
  useMerkabahSolarParams,
} from "../hooks/useQueries";
import EEGManifold from "./EEGManifold";
import SystemPhase from "./SystemPhase";

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionPreset =
  | "Geometric Healing"
  | "Focus Enhancement"
  | "Trauma Release";

const SESSION_PRESETS: {
  label: SessionPreset;
  description: string;
  color: string;
}[] = [
  {
    label: "Geometric Healing",
    description: "Ricci Flow coherence restoration · α=10.3Hz",
    color: "oklch(75% 0.22 150)",
  },
  {
    label: "Focus Enhancement",
    description: "Theta entrainment · Phase lock at 8.1Hz",
    color: "oklch(85% 0.18 200)",
  },
  {
    label: "Trauma Release",
    description: "Toroidal field harmonic clearing · δ=12.4Hz",
    color: "oklch(65% 0.28 305)",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricRow({
  icon,
  label,
  value,
  unit,
  badge,
  badgeVariant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  unit?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="text-xs text-muted-foreground truncate">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value !== undefined ? (
          <span className="text-sm font-mono text-foreground">
            {value}
            {unit && (
              <span className="text-muted-foreground text-xs ml-0.5">
                {unit}
              </span>
            )}
          </span>
        ) : (
          <Skeleton className="h-4 w-16" />
        )}
        {badge && (
          <Badge
            variant={badgeVariant ?? "secondary"}
            className="text-[10px] h-5 px-1.5"
          >
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  accentColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg border border-border p-4"
      style={{ background: "oklch(12% 0.025 270)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: accentColor }}>{icon}</span>
        <p
          className="text-[11px] uppercase tracking-widest font-medium"
          style={{ color: accentColor }}
        >
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
        <Skeleton key={i} className="h-8 w-full opacity-60" />
      ))}
    </div>
  );
}

// ─── Human Metrics Card ────────────────────────────────────────────────────────

function HumanMetricsCard() {
  const { data, isLoading } = useHumanMetrics();

  const getThreshold = (val: number, low: number, high: number) => {
    if (val < low) return { label: "LOW", variant: "destructive" as const };
    if (val > high) return { label: "HIGH", variant: "destructive" as const };
    return { label: "NOMINAL", variant: "secondary" as const };
  };

  return (
    <SectionCard
      title="Human Metrics"
      icon={<Heart className="w-4 h-4" />}
      accentColor="oklch(85% 0.18 200)"
    >
      {isLoading ? (
        <LoadingRows count={4} />
      ) : data ? (
        <div>
          <MetricRow
            icon={<Heart className="w-3.5 h-3.5" />}
            label="Intent Confidence"
            value={(data.intentConfidence * 100).toFixed(1)}
            unit="%"
            badge={getThreshold(data.intentConfidence, 0.4, 0.95).label}
            badgeVariant={
              getThreshold(data.intentConfidence, 0.4, 0.95).variant
            }
          />
          <MetricRow
            icon={<Wind className="w-3.5 h-3.5" />}
            label="Cognitive Load"
            value={(data.cognitiveLoad * 100).toFixed(1)}
            unit="%"
            badge={getThreshold(data.cognitiveLoad, 0.2, 0.8).label}
            badgeVariant={getThreshold(data.cognitiveLoad, 0.2, 0.8).variant}
          />
          <MetricRow
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Φ Deviation"
            value={data.phiDeviation.toFixed(4)}
            badge={data.phiDeviation < 0.05 ? "STABLE" : "DRIFT"}
            badgeVariant={
              data.phiDeviation < 0.05 ? "secondary" : "destructive"
            }
          />
          <MetricRow
            icon={<Zap className="w-3.5 h-3.5" />}
            label="Sandbox"
            value={data.sandboxActive ? "Active" : "Inactive"}
            badge={data.sandboxActive ? "ON" : "OFF"}
            badgeVariant={data.sandboxActive ? "default" : "outline"}
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">
          Authenticate to load human metrics
        </p>
      )}
    </SectionCard>
  );
}

// ─── Audio Metrics Card ────────────────────────────────────────────────────────

function AudioMetricsCard() {
  const { data, isLoading } = useAudioMetrics();

  return (
    <SectionCard
      title="Audio Metrics"
      icon={<Music2 className="w-4 h-4" />}
      accentColor="oklch(65% 0.28 305)"
    >
      {isLoading ? (
        <LoadingRows count={4} />
      ) : data ? (
        <div>
          <MetricRow
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Frequency"
            value={data.frequency.toFixed(2)}
            unit="Hz"
          />
          <MetricRow
            icon={<Zap className="w-3.5 h-3.5" />}
            label="Amplitude"
            value={data.amplitude.toFixed(4)}
          />
          <MetricRow
            icon={<Brain className="w-3.5 h-3.5" />}
            label="Phase Drift"
            value={data.phaseDrift.toFixed(4)}
            badge={data.phaseDrift < 0.1 ? "LOCKED" : "DRIFTING"}
            badgeVariant={data.phaseDrift < 0.1 ? "secondary" : "destructive"}
          />
          <MetricRow
            icon={<Wind className="w-3.5 h-3.5" />}
            label="Entropy Noise"
            value={data.entropyNoise.toFixed(4)}
            badge={data.entropyNoise < 0.2 ? "CLEAN" : "NOISY"}
            badgeVariant={data.entropyNoise < 0.2 ? "secondary" : "outline"}
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">
          Authenticate to load audio metrics
        </p>
      )}
    </SectionCard>
  );
}

// ─── Cymatic Parameters Card ───────────────────────────────────────────────────

function CymaticParametersCard() {
  const { data, isLoading, refetch } = useCymaticParameters();
  const { data: audioData } = useAudioMetrics();
  const generateMutation = useGenerateCymaticParameters();

  const handleGenerate = async () => {
    const metrics = audioData ?? {
      frequency: 432,
      amplitude: 0.5,
      phaseDrift: 0.0,
      entropyNoise: 0.01,
    };
    await generateMutation.mutateAsync(metrics);
    refetch();
  };

  return (
    <SectionCard
      title="Cymatic Parameters"
      icon={<Sparkles className="w-4 h-4" />}
      accentColor="oklch(60% 0.22 250)"
    >
      {isLoading ? (
        <LoadingRows count={3} />
      ) : data ? (
        <div className="space-y-3">
          <MetricRow
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Intensity"
            value={data.intensity.toFixed(4)}
          />
          <MetricRow
            icon={<Brain className="w-3.5 h-3.5" />}
            label="Visual Pattern"
            value={data.visualPattern}
          />
          <div className="pt-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Uniform Data Array
            </p>
            <div className="grid grid-cols-4 gap-1">
              {data.uniformData.slice(0, 8).map((v, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length uniform data array
                  key={i}
                  className="rounded px-1.5 py-0.5 text-center"
                  style={{ background: "oklch(16% 0.03 270)" }}
                >
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {v.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            {data.uniformData.length > 8 && (
              <p className="text-[10px] text-muted-foreground mt-1 text-center">
                +{data.uniformData.length - 8} more harmonics
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">
          No parameters loaded
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 text-xs border-border/60"
        style={{ color: "oklch(60% 0.22 250)" }}
        onClick={handleGenerate}
        disabled={generateMutation.isPending}
        data-ocid="neurofeedback.generate-cymatic"
      >
        {generateMutation.isPending ? (
          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
        ) : (
          <RefreshCw className="w-3 h-3 mr-1.5" />
        )}
        Generate Parameters
      </Button>
    </SectionCard>
  );
}

// ─── MerkabahSolar Card ────────────────────────────────────────────────────────

function MerkabahSolarCard() {
  const { data, isLoading } = useMerkabahSolarParams();
  const activateMutation = useActivateMerkabahSolar();
  const [activateResult, setActivateResult] = useState<
    "success" | "fail" | null
  >(null);

  const handleActivate = async () => {
    setActivateResult(null);
    try {
      await activateMutation.mutateAsync(1);
      setActivateResult("success");
      setTimeout(() => setActivateResult(null), 3000);
    } catch {
      setActivateResult("fail");
      setTimeout(() => setActivateResult(null), 3000);
    }
  };

  return (
    <SectionCard
      title="Merkabah Solar"
      icon={<Sparkles className="w-4 h-4" />}
      accentColor="oklch(65% 0.28 305)"
    >
      {isLoading ? (
        <LoadingRows count={3} />
      ) : data ? (
        <div>
          <MetricRow
            icon={<Zap className="w-3.5 h-3.5" />}
            label="Chi Hermetica"
            value={data.chiHermetica.toFixed(4)}
            badge={data.chiHermetica > 0.5 ? "ACTIVE" : "DORMANT"}
            badgeVariant={data.chiHermetica > 0.5 ? "default" : "outline"}
          />
          <MetricRow
            icon={<Activity className="w-3.5 h-3.5" />}
            label="AR4366 Flux"
            value={data.ar4366Flux.toFixed(4)}
          />
          <MetricRow
            icon={<Brain className="w-3.5 h-3.5" />}
            label="Autistic Continuum"
            value={data.autisticContinuum ? "Enabled" : "Disabled"}
            badge={data.autisticContinuum ? "ON" : "OFF"}
            badgeVariant={data.autisticContinuum ? "secondary" : "outline"}
          />
          <div className="mt-2 pt-2 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
              Tetrahedra Vectors
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded p-1.5"
                style={{ background: "oklch(16% 0.03 270)" }}
              >
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  ♂ Masculino
                </p>
                <p className="text-[10px] font-mono text-foreground">
                  {data.tetraedroMasculino.x.toFixed(2)},{" "}
                  {data.tetraedroMasculino.y.toFixed(2)},{" "}
                  {data.tetraedroMasculino.z.toFixed(2)}
                </p>
              </div>
              <div
                className="rounded p-1.5"
                style={{ background: "oklch(16% 0.03 270)" }}
              >
                <p className="text-[9px] text-muted-foreground mb-0.5">
                  ♀ Feminino
                </p>
                <p className="text-[10px] font-mono text-foreground">
                  {data.tetraedroFeminino.x.toFixed(2)},{" "}
                  {data.tetraedroFeminino.y.toFixed(2)},{" "}
                  {data.tetraedroFeminino.z.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">
          Loading Merkabah data…
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-border/60"
          style={{ color: "oklch(65% 0.28 305)" }}
          onClick={handleActivate}
          disabled={activateMutation.isPending}
          data-ocid="neurofeedback.activate-merkabah"
        >
          {activateMutation.isPending ? (
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          ) : (
            <Zap className="w-3 h-3 mr-1.5" />
          )}
          Activate MerkabahSolar
        </Button>

        {activateResult === "success" && (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "oklch(75% 0.22 150)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            OK
          </span>
        )}
        {activateResult === "fail" && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <XCircle className="w-3.5 h-3.5" />
            Error
          </span>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Session Preset Selector ───────────────────────────────────────────────────

function SessionPresetSelector({
  selected,
  onSelect,
}: {
  selected: SessionPreset;
  onSelect: (p: SessionPreset) => void;
}) {
  return (
    <div
      className="rounded-lg border border-border p-4"
      style={{ background: "oklch(12% 0.025 270)" }}
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
        Session Preset
      </p>
      <div className="space-y-2">
        {SESSION_PRESETS.map((preset) => {
          const isActive = selected === preset.label;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onSelect(preset.label)}
              className="w-full text-left rounded-md px-3 py-2.5 transition-all duration-200 border"
              style={{
                background: isActive
                  ? `${preset.color.replace(")", " / 0.1)")}`
                  : "oklch(16% 0.03 270)",
                borderColor: isActive
                  ? `${preset.color.replace(")", " / 0.5)")}`
                  : "transparent",
                boxShadow: isActive
                  ? `0 0 12px ${preset.color.replace(")", " / 0.15)")}`
                  : "none",
              }}
              data-ocid={`neurofeedback.preset-${preset.label.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isActive ? preset.color : "oklch(80% 0.03 270)",
                  }}
                >
                  {preset.label}
                </span>
                {isActive && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: `${preset.color.replace(")", " / 0.15)")}`,
                      color: preset.color,
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function NeurofeedbackTab() {
  const [activePreset, setActivePreset] =
    useState<SessionPreset>("Geometric Healing");

  return (
    <div className="space-y-5" data-ocid="neurofeedback.root">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Neurofeedback Session
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Geometric neurofeedback · Live metrics · Constitutional Geometry
            Engine
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: "oklch(75% 0.22 150 / 0.1)",
            border: "1px solid oklch(75% 0.22 150 / 0.3)",
            color: "oklch(75% 0.22 150)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(75% 0.22 150)",
              boxShadow: "0 0 6px oklch(75% 0.22 150)",
              animation: "pulse-node 2s infinite",
            }}
          />
          Session Live · {activePreset}
        </div>
      </div>

      {/* Row 1: EEG Manifold + System Phase + Session Preset */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-1">
          <EEGManifold />
        </div>
        <div className="col-span-1">
          <SystemPhase />
        </div>
        <div className="col-span-1">
          <SessionPresetSelector
            selected={activePreset}
            onSelect={setActivePreset}
          />
        </div>
      </div>

      {/* Row 2: Human Metrics + Audio Metrics */}
      <div className="grid grid-cols-2 gap-5">
        <HumanMetricsCard />
        <AudioMetricsCard />
      </div>

      {/* Row 3: Cymatic Parameters + MerkabahSolar */}
      <div className="grid grid-cols-2 gap-5">
        <CymaticParametersCard />
        <MerkabahSolarCard />
      </div>
    </div>
  );
}
