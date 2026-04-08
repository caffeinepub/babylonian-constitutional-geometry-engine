import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AudioMetrics,
  CrossChainEvent,
  CrossChainMetrics,
  CymaticParameters,
  EthereumAgent,
  HumanMetrics,
  MerkabahSolar,
  Node,
  Proposal,
  TVBroadcastSummary,
  UserProfile,
} from "../backend";
import { createActor } from "../backend";

export function useProposals() {
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);
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
  const { actor } = useActor(createActor);
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
  const { actor, isFetching } = useActor(createActor);
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
  const { actor } = useActor(createActor);
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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor, isFetching } = useActor(createActor);

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
  const { actor } = useActor(createActor);
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

// Cymatic Parameters Queries
export function useCymaticParameters() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<CymaticParameters>({
    queryKey: ["cymaticParameters", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity)
        throw new Error("Actor or identity not initialized");
      return actor.getCymaticParameters(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 5000,
  });
}

export function useGenerateCymaticParameters() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (audioMetrics: AudioMetrics) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.generateCymaticParameters(audioMetrics);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cymaticParameters", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useUpdateCymaticParameters() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (params: CymaticParameters) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateCymaticParameters(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cymaticParameters", identity?.getPrincipal().toString()],
      });
    },
  });
}

// User Profile Queries
export function useCallerUserProfile() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useNodes() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Node[]>({
    queryKey: ["nodes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNodes();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useCreateProposal() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createProposal(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
