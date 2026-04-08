import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Vote, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Proposal, ProposalStatus } from "../backend";

interface ProposalCardProps {
  proposal: Proposal;
  onVoteChange: (pendingVotes: number) => void;
}

export default function ProposalCard({
  proposal,
  onVoteChange,
}: ProposalCardProps) {
  const [isVoting, setIsVoting] = useState(false);

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case "approved":
      case "tmrConsensus":
      case "crossChainConsensus":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "rejected":
      case "noConsensus":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "majorityConsensus":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "voting":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusLabel = (status: ProposalStatus): string => {
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

  const handleVote = async (accepted: boolean) => {
    setIsVoting(true);

    // Simulate voting (backend method not available)
    setTimeout(() => {
      toast.success(
        accepted ? "Voto favorável registrado" : "Voto contrário registrado",
        {
          description: `Proposta #${proposal.id} - Aguardando consenso TMR`,
        },
      );
      onVoteChange(proposal.votes.length + 1);
      setIsVoting(false);
    }, 1000);
  };

  const nodes = ["SP-BR", "LIS-PT", "JNB-ZA"];
  const _votedNodes = proposal.votes.map((v) => v.nodeId);

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{proposal.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Proposta #{proposal.id.toString()}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {getStatusLabel(proposal.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {proposal.content}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {nodes.map((nodeId) => {
            const vote = proposal.votes.find((v) => v.nodeId === nodeId);
            return (
              <Badge
                key={nodeId}
                variant="outline"
                className={
                  vote
                    ? vote.accepted
                      ? "border-chart-2 text-chart-2"
                      : "border-destructive text-destructive"
                    : "border-muted text-muted-foreground"
                }
              >
                {nodeId}
                {vote &&
                  (vote.accepted ? (
                    <CheckCircle2 className="w-3 h-3 ml-1" />
                  ) : (
                    <XCircle className="w-3 h-3 ml-1" />
                  ))}
              </Badge>
            );
          })}
        </div>

        {proposal.status === "voting" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-chart-2 text-chart-2 hover:bg-chart-2/10"
              onClick={() => handleVote(true)}
              disabled={isVoting}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => handleVote(false)}
              disabled={isVoting}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
