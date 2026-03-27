import { Badge } from "@/components/ui/badge";
import { Activity, Hexagon } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Babylonian Constitutional Geometry Engine
              </h1>
              <p className="text-xs text-muted-foreground">
                Sistema de Consenso TMR com Visualização Geométrica e
                Observabilidade em Tempo Real
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2">
            <Activity className="w-3 h-3 animate-pulse text-chart-2" />
            <span className="text-xs">FullStack.asi Ativo</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
