import { useState } from "react";
import AppHeader from "./components/AppHeader";
import ArbitrageActivity from "./components/ArbitrageActivity";
import EEGManifold from "./components/EEGManifold";
import OmegaCoherence from "./components/OmegaCoherence";
import QuantumMethod from "./components/QuantumMethod";
import QuorumNodes from "./components/QuorumNodes";
import RelayMonitor from "./components/RelayMonitor";
import SessionManagement from "./components/SessionManagement";
import SystemPhase from "./components/SystemPhase";

export type NavTab =
  | "Dashboard"
  | "Trading"
  | "Neurofeedback"
  | "Quorum"
  | "Settings";

function ComingSoon({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div
        className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-6"
        style={{ boxShadow: "0 0 20px oklch(85% 0.18 200 / 0.3)" }}
      >
        <div
          className="w-3 h-3 rounded-full bg-cyan"
          style={{ filter: "drop-shadow(0 0 6px oklch(85% 0.18 200))" }}
        />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">{tab}</h2>
      <p className="text-muted-foreground text-sm">
        Module under development. Coming soon.
      </p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("Dashboard");

  return (
    <div className="min-h-screen" style={{ background: "#060914" }}>
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-[1200px] mx-auto px-5 pt-8 pb-16">
        {activeTab !== "Dashboard" ? (
          <ComingSoon tab={activeTab} />
        ) : (
          <>
            {/* Row 1: 3 columns */}
            <div className="grid grid-cols-3 gap-5 mb-5">
              <OmegaCoherence />
              <SystemPhase />
              <ArbitrageActivity />
            </div>

            {/* Row 2: 3+2 split */}
            <div
              className="grid gap-5 mb-5"
              style={{ gridTemplateColumns: "3fr 2fr" }}
            >
              <EEGManifold />
              <RelayMonitor />
            </div>

            {/* Row 3: 2+3 split */}
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "2fr 3fr" }}
            >
              <div className="flex flex-col gap-5">
                <SessionManagement />
                <QuantumMethod />
              </div>
              <QuorumNodes />
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border py-5">
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Arkhe(n) Platform · Constitutional Geometry Engine v2.0
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
