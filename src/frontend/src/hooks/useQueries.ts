import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AudioMetrics,
  CrossChainEvent,
  CrossChainMetrics,
  EthereumAgent,
  HumanMetrics,
  MerkabahSolar,
  Proposal,
  TVBroadcastSummary,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useProposals() {
  const { actor, isFetching } = useActor();

  return useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProposals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProposal(proposalId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Proposal>({
    queryKey: ["proposal", proposalId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getProposal(proposalId);
    },
    enabled: !!actor && !isFetching && proposalId !== undefined,
  });
}

export function useHumanMetrics() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<HumanMetrics>({
    queryKey: ["humanMetrics", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity)
        throw new Error("Actor or identity not initialized");
      return actor.getHumanMetrics(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUpdateHumanMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (metrics: HumanMetrics) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateHumanMetrics(metrics);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["humanMetrics", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useAudioMetrics() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AudioMetrics>({
    queryKey: ["audioMetrics", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity)
        throw new Error("Actor or identity not initialized");
      return actor.getAudioMetrics(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUpdateAudioMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (metrics: AudioMetrics) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateAudioMetrics(metrics);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["audioMetrics", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useTVBroadcastSummaries() {
  const { actor, isFetching } = useActor();

  return useQuery<TVBroadcastSummary[]>({
    queryKey: ["tvBroadcastSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrentTVBroadcastSummaries();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// Cross-Chain Kernel Queries
export function useCrossChainMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<CrossChainMetrics>({
    queryKey: ["crossChainMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getCrossChainMetrics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
    retry: false,
  });
}

export function useEthereumAgents() {
  const { actor, isFetching } = useActor();

  return useQuery<EthereumAgent[]>({
    queryKey: ["ethereumAgents"],
    queryFn: async () => {
      if (!actor) return [];
      // Note: Backend doesn't have a getAll method yet, returning empty array
      return [];
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useCrossChainEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<CrossChainEvent[]>({
    queryKey: ["crossChainEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrossChainEvents();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useCrossChainEventsByType(eventType: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CrossChainEvent[]>({
    queryKey: ["crossChainEvents", eventType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCrossChainEventsByType(eventType);
    },
    enabled: !!actor && !isFetching && !!eventType,
  });
}

// MerkabahSolar Queries
export function useMerkabahSolarParams() {
  const { actor, isFetching } = useActor();

  return useQuery<MerkabahSolar>({
    queryKey: ["merkabahSolarParams"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getMerkabahSolarParams();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
  });
}

export function useActivateMerkabahSolar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intention: number) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.activateMerkabahSolar(intention);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merkabahSolarParams"] });
    },
  });
}
