import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    nodeId?: string;
    name: string;
}
export interface CrossChainEvent {
    timestamp: bigint;
    details: string;
    eventType: string;
}
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}
export interface Proposal {
    id: bigint;
    status: ProposalStatus;
    title: string;
    content: string;
    votes: Array<Vote>;
    proposer: Principal;
}
export interface EthereumAgent {
    checksumValid: boolean;
    address: string;
    dhtMetrics: DHTMetrics;
    entropyScore: number;
}
export interface TVBroadcastSummary {
    status: string;
    broadcastId: bigint;
    signalStrength: number;
    nodeId: string;
    transmissionQuality: number;
}
export interface HumanMetrics {
    sandboxActive: boolean;
    intentConfidence: number;
    phiDeviation: number;
    cognitiveLoad: number;
}
export interface Node {
    id: string;
    status: NodeStatus;
    location: string;
}
export interface CymaticParameters {
    uniformData: Array<number>;
    visualPattern: string;
    intensity: number;
}
export interface CrossChainMetrics {
    chi: number;
    phi: number;
    theta: number;
    inv1: boolean;
    inv2: boolean;
    inv3: boolean;
    inv4: boolean;
    inv5: boolean;
    inv6: boolean;
    chronoflux: number;
    rhoAsi: number;
    rhoEth: number;
}
export interface AudioMetrics {
    phaseDrift: number;
    amplitude: number;
    frequency: number;
    entropyNoise: number;
}
export interface Vote {
    nodeId: string;
    accepted: boolean;
}
export interface MerkabahSolar {
    chiHermetica: number;
    tetraedroFeminino: Vector3D;
    autisticContinuum: boolean;
    tetraedroMasculino: Vector3D;
    ar4366Flux: number;
}
export interface DHTMetrics {
    dhtScore: number;
    merkleVerified: boolean;
    nodeCount: bigint;
}
export interface TVBroadcastMetrics {
    broadcastId: bigint;
    nodeId: string;
    frameRate: number;
    amplitude: number;
    entropy: number;
    transmissionQuality: number;
    bleStatus: boolean;
    phiIntegrity: number;
    timestamp: bigint;
    frequency: number;
    tmrValidation: boolean;
    pqcStatus: boolean;
}
export enum NodeStatus {
    active = "active",
    voting = "voting",
    inactive = "inactive",
    participating = "participating"
}
export enum ProposalStatus {
    noConsensus = "noConsensus",
    pending = "pending",
    crossChainConsensus = "crossChainConsensus",
    voting = "voting",
    approved = "approved",
    tmrConsensus = "tmrConsensus",
    rejected = "rejected",
    majorityConsensus = "majorityConsensus"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateMerkabahSolar(intention: number): Promise<number>;
    addEthereumAgent(address: string, entropyScore: number, checksumValid: boolean): Promise<void>;
    addNode(nodeId: string, location: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProposal(title: string, content: string): Promise<bigint>;
    generateCymaticParameters(audioMetrics: AudioMetrics): Promise<CymaticParameters>;
    getAllNodes(): Promise<Array<Node>>;
    getAllProposals(): Promise<Array<Proposal>>;
    getAllProposalsByTitle(): Promise<Array<Proposal>>;
    getAudioMetrics(user: Principal): Promise<AudioMetrics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCrossChainEvents(): Promise<Array<CrossChainEvent>>;
    getCrossChainEventsByType(eventType: string): Promise<Array<CrossChainEvent>>;
    getCrossChainMetrics(): Promise<CrossChainMetrics>;
    getCurrentTVBroadcastSummaries(): Promise<Array<TVBroadcastSummary>>;
    getCymaticParameters(user: Principal): Promise<CymaticParameters>;
    getEthereumAgent(address: string): Promise<EthereumAgent>;
    getHumanMetrics(user: Principal): Promise<HumanMetrics>;
    getMerkabahSolarParams(): Promise<MerkabahSolar>;
    getNode(nodeId: string): Promise<Node>;
    getProposal(proposalId: bigint): Promise<Proposal>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logCrossChainEvent(eventType: string, details: string): Promise<void>;
    pruneOldTVBroadcastMetrics(): Promise<void>;
    removeNode(nodeId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTVBroadcastMetrics(metrics: TVBroadcastMetrics): Promise<void>;
    updateAudioMetrics(metrics: AudioMetrics): Promise<void>;
    updateCrossChainMetrics(metrics: CrossChainMetrics): Promise<void>;
    updateCymaticParameters(params: CymaticParameters): Promise<void>;
    updateDHTMetrics(address: string, nodeCount: bigint, merkleVerified: boolean, dhtScore: number): Promise<void>;
    updateHumanMetrics(metrics: HumanMetrics): Promise<void>;
    updateNodeStatus(nodeId: string, status: NodeStatus): Promise<void>;
    voteOnProposal(proposalId: bigint, nodeId: string, accepted: boolean): Promise<void>;
}
