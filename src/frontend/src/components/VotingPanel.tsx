import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Link2,
  Loader2,
  Vote,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { ProposalStatus } from "../backend";
import { useProposals } from "../hooks/useQueries";
import CreateProposalDialog from "./CreateProposalDialog";
import NodesStatus from "./NodesStatus";
import ParametersControl from "./ParametersControl";
import ProposalCard from "./ProposalCard";

interface VotingPanelProps {
  cgeParameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  onParametersChange: (params: any) => void;
}

export default function VotingPanel({
  cgeParameters,
  onParametersChange,
}: VotingPanelProps) {
  const { data: proposals, isLoading } = useProposals();
  const [selectedTab, setSelectedTab] = useState("all");

  const _getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case "approved":
      case "tmrConsensus":
        return <CheckCircle2 className="w-4 h-4 text-chart-2" />;
      case "crossChainConsensus":
        return <Link2 className="w-4 h-4 text-chart-5" />;
      case "rejected":
      case "noConsensus":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "majorityConsensus":
        return <AlertCircle className="w-4 h-4 text-chart-4" />;
      case "voting":
        return <Vote className="w-4 h-4 text-chart-1 animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const _getStatusLabel = (status: ProposalStatus): string => {
    const labels: Record<ProposalStatus, string> = {
      pending: "Pendente",
      voting: "Em Votação",
      approved: "Aprovado",
      rejected: "Rejeitado",
      noConsensus: "Sem Consenso",
      majorityConsensus: "Consenso Majoritário",
      tmrConsensus: "Consenso TMR",
      crossChainConsensus: "Consenso Cross-Chain",
    };
    return labels[status] || status;
  };

  const filterProposals = (status?: ProposalStatus) => {
    if (!proposals) return [];
    if (!status) return proposals;
    return proposals.filter((p) => p.status === status);
  };

  const filteredProposals =
    selectedTab === "all"
      ? proposals
      : filterProposals(selectedTab as ProposalStatus);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                Painel de Votação Constitucional
              </CardTitle>
              <CardDescription>
                Consenso TMR 2-de-3 • Divisão Babilônica Base-60 • Cross-Chain
                Bridge
              </CardDescription>
            </div>
            <CreateProposalDialog />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <NodesStatus />

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="voting">Votação</TabsTrigger>
              <TabsTrigger value="tmrConsensus">TMR</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredProposals && filteredProposals.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id.toString()}
                        proposal={proposal}
                        onVoteChange={(pendingVotes) => {
                          onParametersChange({
                            ...cgeParameters,
                            uPendingVotes: pendingVotes,
                          });
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      {selectedTab === "all"
                        ? "Nenhuma proposta encontrada. Crie a primeira proposta constitucional."
                        : "Nenhuma proposta nesta categoria."}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ParametersControl
        parameters={cgeParameters}
        onParametersChange={onParametersChange}
      />
    </div>
  );
}
