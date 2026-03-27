import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

interface ParametersControlProps {
  parameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  onParametersChange: (params: any) => void;
}

export default function ParametersControl({
  parameters,
  onParametersChange,
}: ParametersControlProps) {
  return (
    <Card className="border-chart-4/20 bg-gradient-to-br from-card via-card to-chart-4/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="w-4 h-4 text-chart-4" />
          Parâmetros do Sistema
        </CardTitle>
        <CardDescription className="text-xs">
          Ajuste os parâmetros de visualização CGE
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phi" className="text-sm">
              Fluxo Φ (Phi)
            </Label>
            <span className="text-sm font-mono text-muted-foreground">
              {parameters.uPhi.toFixed(3)}
            </span>
          </div>
          <Slider
            id="phi"
            min={1.0}
            max={2.5}
            step={0.001}
            value={[parameters.uPhi]}
            onValueChange={([value]) =>
              onParametersChange({ ...parameters, uPhi: value })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="domains" className="text-sm">
              Domínios Ativos
            </Label>
            <span className="text-sm font-mono text-muted-foreground">
              {parameters.uActiveDomains}
            </span>
          </div>
          <Slider
            id="domains"
            min={0}
            max={46}
            step={1}
            value={[parameters.uActiveDomains]}
            onValueChange={([value]) =>
              onParametersChange({ ...parameters, uActiveDomains: value })
            }
          />
          <p className="text-xs text-muted-foreground">
            Total de 46 tablets/artigos constitucionais disponíveis
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="consensus" className="text-sm">
              Nível de Consenso
            </Label>
            <span className="text-sm font-mono text-muted-foreground">
              {(parameters.uConsensusLevel * 100).toFixed(1)}%
            </span>
          </div>
          <Slider
            id="consensus"
            min={0}
            max={1}
            step={0.01}
            value={[parameters.uConsensusLevel]}
            onValueChange={([value]) =>
              onParametersChange({ ...parameters, uConsensusLevel: value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
