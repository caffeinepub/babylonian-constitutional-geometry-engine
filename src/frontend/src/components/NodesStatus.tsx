import { Badge } from "@/components/ui/badge";
import { Activity, Server } from "lucide-react";

const nodes = [
  { id: "SP-BR", location: "São Paulo, Brasil", status: "active" },
  { id: "LIS-PT", location: "Lisboa, Portugal", status: "active" },
  { id: "JNB-ZA", location: "Joanesburgo, África do Sul", status: "active" },
];

export default function NodesStatus() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Server className="w-4 h-4 text-primary" />
        <span>Nós Participantes</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm font-bold">{node.id}</span>
              <Activity className="w-3 h-3 text-chart-2 animate-pulse" />
            </div>
            <div className="text-xs text-muted-foreground">{node.location}</div>
            <Badge
              variant="outline"
              className="mt-2 text-xs border-chart-2 text-chart-2"
            >
              Ativo
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
