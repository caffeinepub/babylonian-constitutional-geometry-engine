import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Cpu,
  Loader2,
  Settings2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

// ── Types ──────────────────────────────────────────────────────────────────────

type HardwareProfile = "Simulated" | "OpenBCI" | "Muse" | "Emotiv" | "g.tec";
type TherapeuticProtocol =
  | "Geometric Healing"
  | "Focus Enhancement"
  | "Trauma Release";
type EEGSensitivity = "Low" | "Medium" | "High";

const HARDWARE_PROFILES: {
  id: HardwareProfile;
  label: string;
  description: string;
}[] = [
  {
    id: "Simulated",
    label: "Simulated",
    description: "Software-generated EEG signals for testing",
  },
  {
    id: "OpenBCI",
    label: "OpenBCI",
    description: "Open-source bio-sensing hardware",
  },
  { id: "Muse", label: "Muse", description: "Muse S / Muse 2 EEG headband" },
  {
    id: "Emotiv",
    label: "Emotiv",
    description: "Emotiv EPOC / Insight headsets",
  },
  {
    id: "g.tec",
    label: "g.tec",
    description: "g.tec medical-grade biosignal hardware",
  },
];

const THERAPEUTIC_PROTOCOLS: {
  id: TherapeuticProtocol;
  description: string;
}[] = [
  {
    id: "Geometric Healing",
    description:
      "Ricci-flow guided geometric patterns promoting neural coherence and cellular resonance.",
  },
  {
    id: "Focus Enhancement",
    description:
      "Harmonic entrainment protocols targeting alpha-theta band synchronization for sustained attention.",
  },
  {
    id: "Trauma Release",
    description:
      "Low-frequency somatic anchoring sequences for trauma integration via structured neural oscillation.",
  },
];

// ── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: "oklch(85% 0.18 200 / 0.1)",
          border: "1px solid oklch(85% 0.18 200 / 0.25)",
        }}
      >
        <Icon size={16} style={{ color: "oklch(85% 0.18 200)" }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 mb-5"
      style={{
        background: "oklch(12% 0.025 270)",
        border: "1px solid oklch(25% 0.05 270)",
        boxShadow:
          "0 0 20px oklch(60% 0.22 250 / 0.08), 0 1px 3px oklch(0% 0 0 / 0.5)",
      }}
    >
      {children}
    </div>
  );
}

// ── Radio Option ───────────────────────────────────────────────────────────────

function RadioOption<T extends string>({
  value,
  selected,
  onSelect,
  label,
  description,
}: {
  value: T;
  selected: T;
  onSelect: (v: T) => void;
  label: string;
  description?: string;
}) {
  const isSelected = value === selected;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className="w-full text-left rounded-lg px-4 py-3 transition-all duration-200 flex items-start gap-3"
      style={{
        background: isSelected
          ? "oklch(85% 0.18 200 / 0.07)"
          : "oklch(18% 0.03 270)",
        border: isSelected
          ? "1px solid oklch(85% 0.18 200 / 0.4)"
          : "1px solid oklch(25% 0.05 270)",
      }}
      data-ocid={`radio-option-${value.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center border"
        style={{
          borderColor: isSelected
            ? "oklch(85% 0.18 200)"
            : "oklch(40% 0.05 270)",
          background: isSelected ? "oklch(85% 0.18 200 / 0.2)" : "transparent",
        }}
      >
        {isSelected && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "oklch(85% 0.18 200)" }}
          />
        )}
      </div>
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Toggle Row ─────────────────────────────────────────────────────────────────

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 pr-4">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={`toggle-${id}`}
        style={
          checked
            ? ({
                "--switch-thumb": "oklch(10% 0.02 270)",
              } as React.CSSProperties)
            : undefined
        }
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SettingsTab() {
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? "—";

  // Section 1 — User Profile
  const { data: profileData, isLoading: profileLoading } =
    useCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaved, setProfileSaved] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (profileData) {
      setName(profileData.name ?? "");
    }
  }, [profileData]);

  const handleSaveProfile = async () => {
    setProfileSaved("saving");
    try {
      await saveProfile.mutateAsync({ name });
      setProfileSaved("success");
      setTimeout(() => setProfileSaved("idle"), 3000);
    } catch {
      setProfileSaved("error");
      setTimeout(() => setProfileSaved("idle"), 4000);
    }
  };

  // Section 2 — Hardware Configuration
  const [hardware, setHardware] = useState<HardwareProfile>("Simulated");

  // Section 3 — Therapeutic Protocols
  const [protocol, setProtocol] =
    useState<TherapeuticProtocol>("Geometric Healing");

  // Section 4 — System Preferences
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [eegSensitivity, setEegSensitivity] =
    useState<EEGSensitivity>("Medium");
  const [breathSync, setBreathSync] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="mb-7">
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "oklch(85% 0.18 200)" }}
        >
          System Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure identity, hardware, protocols, and preferences.
        </p>
      </div>

      {/* ── Section 1: User Profile ─────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          icon={User}
          title="User Profile"
          subtitle="Identity and contact information"
        />
        <Separator className="mb-5 opacity-30" />

        {/* Principal ID */}
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Principal ID
          </Label>
          <div
            className="rounded-lg px-3 py-2.5 font-mono text-xs break-all text-muted-foreground"
            style={{
              background: "oklch(8% 0.03 270)",
              border: "1px solid oklch(22% 0.04 270)",
            }}
            data-ocid="principal-id-display"
          >
            {principalId}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <Label
            htmlFor="profile-name"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block"
          >
            Display Name
          </Label>
          {profileLoading ? (
            <div
              className="h-10 rounded-lg animate-pulse"
              style={{ background: "oklch(18% 0.03 270)" }}
            />
          ) : (
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              data-ocid="profile-name-input"
              className="bg-input border-border focus-visible:ring-1 text-sm"
              style={
                {
                  "--tw-ring-color": "oklch(85% 0.18 200 / 0.5)",
                } as React.CSSProperties
              }
            />
          )}
        </div>

        {/* Email (local state only — no backend field) */}
        <div className="mb-5">
          <Label
            htmlFor="profile-email"
            className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block"
          >
            Email{" "}
            <span className="normal-case text-muted-foreground/60">
              (local)
            </span>
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            data-ocid="profile-email-input"
            className="bg-input border-border focus-visible:ring-1 text-sm"
            style={
              {
                "--tw-ring-color": "oklch(85% 0.18 200 / 0.5)",
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveProfile}
            disabled={profileSaved === "saving" || profileLoading}
            data-ocid="save-profile-btn"
            size="sm"
            className="text-xs font-medium"
            style={{
              background: "oklch(85% 0.18 200)",
              color: "oklch(10% 0.02 270)",
            }}
          >
            {profileSaved === "saving" ? (
              <>
                <Loader2 size={13} className="animate-spin mr-1.5" />
                Saving…
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
          {profileSaved === "success" && (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "oklch(75% 0.22 150)" }}
            >
              <CheckCircle size={13} /> Saved successfully
            </span>
          )}
          {profileSaved === "error" && (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "oklch(55% 0.22 25)" }}
            >
              <AlertCircle size={13} /> Failed to save
            </span>
          )}
        </div>
      </SectionCard>

      {/* ── Section 2: Hardware Configuration ──────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          icon={Cpu}
          title="Hardware Configuration"
          subtitle="Active EEG acquisition device"
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Active:</span>
          <Badge
            variant="outline"
            className="text-xs font-mono"
            style={{
              borderColor: "oklch(85% 0.18 200 / 0.4)",
              color: "oklch(85% 0.18 200)",
            }}
            data-ocid="active-hardware-badge"
          >
            {hardware}
          </Badge>
        </div>
        <Separator className="mb-4 opacity-30" />
        <div className="flex flex-col gap-2">
          {HARDWARE_PROFILES.map((hp) => (
            <RadioOption
              key={hp.id}
              value={hp.id}
              selected={hardware}
              onSelect={setHardware}
              label={hp.label}
              description={hp.description}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── Section 3: Therapeutic Protocols ───────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          icon={Brain}
          title="Therapeutic Protocols"
          subtitle="Active neural entrainment program"
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Active:</span>
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              borderColor: "oklch(65% 0.28 305 / 0.5)",
              color: "oklch(65% 0.28 305)",
            }}
            data-ocid="active-protocol-badge"
          >
            {protocol}
          </Badge>
        </div>
        <Separator className="mb-4 opacity-30" />
        <div className="flex flex-col gap-2">
          {THERAPEUTIC_PROTOCOLS.map((tp) => (
            <RadioOption
              key={tp.id}
              value={tp.id}
              selected={protocol}
              onSelect={setProtocol}
              label={tp.id}
              description={tp.description}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── Section 4: System Preferences ──────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          icon={Settings2}
          title="System Preferences"
          subtitle="Audio, signal processing, and synchronization"
        />
        <Separator className="mb-1 opacity-30" />

        <ToggleRow
          id="audio-enabled"
          label="Audio Output"
          description="Enable harmonic audio synthesis during active sessions"
          checked={audioEnabled}
          onCheckedChange={setAudioEnabled}
        />
        <Separator className="opacity-20" />

        <ToggleRow
          id="breath-sync"
          label="Breath-Rate Sync"
          description="Synchronize protocol timing with detected breath cadence"
          checked={breathSync}
          onCheckedChange={setBreathSync}
        />
        <Separator className="opacity-20" />

        {/* EEG Filter Sensitivity */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-foreground">
                EEG Filter Sensitivity
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Signal noise rejection level for raw EEG acquisition
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: "oklch(60% 0.22 250 / 0.4)",
                color: "oklch(60% 0.22 250)",
              }}
              data-ocid="eeg-sensitivity-badge"
            >
              {eegSensitivity}
            </Badge>
          </div>
          <div className="flex gap-2 mt-3">
            {(["Low", "Medium", "High"] as EEGSensitivity[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEegSensitivity(level)}
                data-ocid={`eeg-sensitivity-${level.toLowerCase()}`}
                className="flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200"
                style={{
                  background:
                    eegSensitivity === level
                      ? "oklch(60% 0.22 250 / 0.15)"
                      : "oklch(18% 0.03 270)",
                  border:
                    eegSensitivity === level
                      ? "1px solid oklch(60% 0.22 250 / 0.5)"
                      : "1px solid oklch(25% 0.05 270)",
                  color:
                    eegSensitivity === level
                      ? "oklch(60% 0.22 250)"
                      : "oklch(65% 0.04 270)",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
