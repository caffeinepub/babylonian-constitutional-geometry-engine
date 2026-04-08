import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Network,
  Plus,
  ShieldCheck,
  Vote,
} from "lucide-react";
import { useState } from "react";
import type { ProposalStatus } from "../backend";
import { useNodes, useProposals } from "../hooks/useQueries";
import CreateProposalDialog from "./CreateProposalDialog";
import ProposalCard from "./ProposalCard";
import QuorumNodes from "./QuorumNodes";

// ── Constitutional Invariants (C1–C13) ────────────────────────────────────────

const INVARIANTS = [
  {
    id: "C1",
    label: "Geometric Integrity",
    desc: "Manifold curvature within Ricci flow bounds (κ < 0.01)",
  },
  {
    id: "C2",
    label: "Quantum Coherence",
    desc: "Bell-state fidelity ≥ 0.97 across all quorum nodes",
  },
  {
    id: "C3",
    label: "Narrative Separation",
    desc: "Metaphorical events never propagated as system state",
  },
  {
    id: "C4",
    label: "Identity Immutability",
    desc: "Principal keys cannot be reassigned without multi-sig quorum",
  },
  {
    id: "C5",
    label: "Resource Bounding",
    desc: "All compute cycles capped; no unbounded iteration permitted",
  },
  {
    id: "C6",
    label: "Audit Completeness",
    desc: "Every state mutation produces a verifiable ledger entry",
  },
  {
    id: "C7",
    label: "Sandboxed Intent",
    desc: "Human interface strictly sandboxed from kernel state",
  },
  {
    id: "C8",
    label: "TMR 2-of-3 Consensus",
    desc: "No on-chain action materialises below quorum threshold",
  },
  {
    id: "C9",
    label: "Entropy Thresholding",
    desc: "Identity entropy score ≥ 0.72 required for key operations",
  },
  {
    id: "C10",
    label: "Phase Isolation",
    desc: "AGI and ASI phases operate on isolated state partitions",
  },
  {
    id: "C11",
    label: "Recoverability",
    desc: "Snapshot + zeroize + restore validated at every upgrade",
  },
  {
    id: "C12",
    label: "Topology Preservation",
    desc: "Ricci flow does not create or destroy manifold topology",
  },
  {
    id: "C13",
    label: "Constitutional Supremacy",
    desc: "No module may override invariants C1–C12 at runtime",
  },
];

// ── Proposal filter tabs ───────────────────────────────────────────────────────

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "voting", label: "Active" },
  { value: "approved", label: "Passed" },
  { value: "rejected", label: "Rejected" },
  { value: "pending", label: "Pending" },
];

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon
          className="w-4 h-4 text-cyan"
          style={{ filter: "drop-shadow(0 0 4px oklch(85% 0.18 200))" }}
        />
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Proposal list skeleton ─────────────────────────────────────────────────────

function ProposalsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Node stats row ─────────────────────────────────────────────────────────────

function NodeStatsRow({
  nodes,
}: { nodes: Array<{ id: string; status: string; location: string }> }) {
  const active = nodes.filter(
    (n) => n.status === "active" || n.status === "participating",
  ).length;
  const voting = nodes.filter((n) => n.status === "voting").length;
  const inactive = nodes.filter((n) => n.status === "inactive").length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: "Active", value: active, color: "text-[oklch(75%_0.22_150)]" },
        { label: "Voting", value: voting, color: "text-cyan" },
        { label: "Inactive", value: inactive, color: "text-muted-foreground" },
      ].map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border/40 p-3 text-center"
          style={{ background: "oklch(10% 0.02 270)" }}
        >
          <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function QuorumTab() {
  const {
    data: proposals,
    isLoading: proposalsLoading,
    refetch: refetchProposals,
  } = useProposals();
  const { data: nodes, isLoading: nodesLoading } = useNodes();
  const [activeFilter, setActiveFilter] = useState("all");
  const [pendingVotes, setPendingVotes] = useState(0);

  const filteredProposals = (() => {
    if (!proposals) return [];
    if (activeFilter === "all") return proposals;
    // Map "passed" filter to backend statuses
    if (activeFilter === "approved")
      return proposals.filter(
        (p) =>
          p.status === "approved" ||
          p.status === "tmrConsensus" ||
          p.status === "crossChainConsensus" ||
          p.status === "majorityConsensus",
      );
    return proposals.filter(
      (p) => p.status === (activeFilter as ProposalStatus),
    );
  })();

  const activeProposals =
    proposals?.filter((p) => p.status === "voting").length ?? 0;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* ── Left column: Proposals ───────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* Proposals card */}
        <div
          className="rounded-lg border border-border p-5"
          style={{ background: "oklch(12% 0.025 270)" }}
          data-ocid="quorum.proposals.card"
        >
          <SectionHeader icon={Vote} label="Constitutional Proposals">
            <div className="flex items-center gap-2">
              {activeProposals > 0 && (
                <Badge
                  className="text-[10px] px-2 py-0.5"
                  style={{
                    background: "oklch(85% 0.18 200 / 0.12)",
                    color: "oklch(85% 0.18 200)",
                    border: "1px solid oklch(85% 0.18 200 / 0.3)",
                  }}
                >
                  {activeProposals} active
                </Badge>
              )}
              <CreateProposalDialog onCreated={() => refetchProposals()} />
            </div>
          </SectionHeader>

          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full"
          >
            <TabsList
              className="w-full mb-4"
              style={{ background: "oklch(9% 0.02 270)" }}
            >
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="flex-1 text-xs"
                  data-ocid={`quorum.filter.${t.value}`}
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeFilter}>
              <ScrollArea className="h-[380px] pr-2">
                {proposalsLoading ? (
                  <ProposalsSkeleton />
                ) : filteredProposals.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id.toString()}
                        proposal={proposal}
                        onVoteChange={(v) => setPendingVotes(v)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-14 text-center"
                    data-ocid="quorum.proposals.empty"
                  >
                    <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No proposals found.
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {activeFilter === "all"
                        ? "Create the first constitutional proposal."
                        : "No proposals in this category."}
                    </p>
                    {activeFilter === "all" && (
                      <div
                        className="mt-4"
                        data-ocid="quorum.proposals.empty.cta"
                      >
                        <CreateProposalDialog
                          onCreated={() => refetchProposals()}
                        />
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {pendingVotes > 0 && (
            <p className="text-[10px] text-muted-foreground mt-3 text-right">
              {pendingVotes} pending vote{pendingVotes !== 1 ? "s" : ""} in
              session
            </p>
          )}
        </div>

        {/* Constitutional Invariants */}
        <div
          className="rounded-lg border border-border p-5"
          style={{ background: "oklch(12% 0.025 270)" }}
          data-ocid="quorum.invariants.card"
        >
          <SectionHeader
            icon={ShieldCheck}
            label="Constitutional Invariants (C1–C13)"
          />
          <ScrollArea className="h-[260px] pr-2">
            <div className="space-y-1.5">
              {INVARIANTS.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-start gap-3 rounded-md px-3 py-2 hover:bg-muted/20 transition-colors"
                  data-ocid={`quorum.invariant.${inv.id.toLowerCase()}`}
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    style={{
                      color: "oklch(75% 0.22 150)",
                      filter: "drop-shadow(0 0 3px oklch(75% 0.22 150 / 0.5))",
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold font-mono"
                        style={{ color: "oklch(85% 0.18 200)" }}
                      >
                        {inv.id}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {inv.label}
                      </span>
                      <Badge
                        className="text-[9px] px-1.5 py-0 ml-auto shrink-0"
                        style={{
                          background: "oklch(75% 0.22 150 / 0.1)",
                          color: "oklch(75% 0.22 150)",
                          border: "1px solid oklch(75% 0.22 150 / 0.25)",
                        }}
                      >
                        COMPLIANT
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {inv.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* ── Right column: Network + Nodes ─────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* World map */}
        <QuorumNodes />

        {/* Node roster from backend */}
        <div
          className="rounded-lg border border-border p-5"
          style={{ background: "oklch(12% 0.025 270)" }}
          data-ocid="quorum.nodes.card"
        >
          <SectionHeader icon={Network} label="Registered Quorum Nodes" />

          {nodesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : nodes && nodes.length > 0 ? (
            <>
              <NodeStatsRow nodes={nodes} />
              <div className="space-y-2">
                {nodes.map((node) => {
                  const isActive =
                    node.status === "active" || node.status === "participating";
                  const isVoting = node.status === "voting";
                  return (
                    <div
                      key={node.id}
                      className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2.5 hover:border-primary/20 transition-colors"
                      style={{ background: "oklch(10% 0.02 270)" }}
                      data-ocid={`quorum.node.${node.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: isActive
                              ? "oklch(75% 0.22 150)"
                              : isVoting
                                ? "oklch(85% 0.18 200)"
                                : "oklch(40% 0.04 270)",
                            boxShadow: isActive
                              ? "0 0 6px oklch(75% 0.22 150)"
                              : isVoting
                                ? "0 0 6px oklch(85% 0.18 200)"
                                : "none",
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-mono font-semibold text-foreground truncate">
                            {node.id}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {node.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className="text-[9px] px-2 py-0 shrink-0 ml-2"
                        style={
                          isActive
                            ? {
                                background: "oklch(75% 0.22 150 / 0.1)",
                                color: "oklch(75% 0.22 150)",
                                border: "1px solid oklch(75% 0.22 150 / 0.3)",
                              }
                            : isVoting
                              ? {
                                  background: "oklch(85% 0.18 200 / 0.1)",
                                  color: "oklch(85% 0.18 200)",
                                  border: "1px solid oklch(85% 0.18 200 / 0.3)",
                                }
                              : {
                                  background: "oklch(40% 0.04 270 / 0.1)",
                                  color: "oklch(50% 0.04 270)",
                                  border: "1px solid oklch(40% 0.04 270 / 0.3)",
                                }
                        }
                      >
                        {node.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="quorum.nodes.empty"
            >
              <AlertCircle className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No nodes registered.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
