import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Brain,
  ChevronDown,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Triangle,
  Users,
} from "lucide-react";
import type { NavTab } from "../App";

const NAV_ITEMS: { label: NavTab; icon: React.FC<{ className?: string }> }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Trading", icon: TrendingUp },
  { label: "Neurofeedback", icon: Brain },
  { label: "Quorum", icon: Users },
  { label: "Settings", icon: Settings },
];

interface Props {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function AppHeader({ activeTab, onTabChange }: Props) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background: "oklch(10% 0.025 270 / 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center gap-8">
        {/* Brand */}
        <div
          className="flex items-center gap-2 shrink-0"
          data-ocid="header.link"
        >
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ filter: "drop-shadow(0 0 6px oklch(85% 0.18 200))" }}
          >
            <Triangle className="w-5 h-5 fill-cyan text-cyan" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            Arkhe<span className="text-cyan">(n)</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onTabChange(label)}
              data-ocid={`nav.${label.toLowerCase()}.tab`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTab === label
                  ? "text-cyan bg-cyan/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              style={
                activeTab === label
                  ? { filter: "drop-shadow(0 0 4px oklch(85% 0.18 200 / 0.5))" }
                  : {}
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="header.bell.button"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="header.user.button"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-secondary text-foreground">
                Ω
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
}
