import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MerkabahSolar "merkabah_solar";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // MerkabahSolar instance (Shared State)
  let merkabahSolar = MerkabahSolar.init();

  // Core Types
  type Node = {
    id : Text;
    location : Text;
    status : NodeStatus;
  };

  type NodeStatus = {
    #active;
    #inactive;
    #voting;
    #participating;
  };

  type Proposal = {
    id : Nat;
    title : Text;
    content : Text;
    proposer : Principal;
    status : ProposalStatus;
    votes : [Vote];
  };

  type ProposalStatus = {
    #pending;
    #voting;
    #approved;
    #rejected;
    #noConsensus;
    #majorityConsensus;
    #tmrConsensus;
    #crossChainConsensus;
  };

  type Vote = {
    nodeId : Text;
    accepted : Bool;
  };

  type CGEParameters = {
    uPhi : Float;
    uActiveDomains : Nat;
    uPendingVotes : Nat;
    uConsensusLevel : Float;
  };

  type ConsensusData = {
    parameters : CGEParameters;
    proposalId : Nat;
    consensusLevel : Float;
  };

  type HumanMetrics = {
    cognitiveLoad : Float;
    phiDeviation : Float;
    sandboxActive : Bool;
    intentConfidence : Float;
  };

  type AudioMetrics = {
    frequency : Float;
    amplitude : Float;
    phaseDrift : Float;
    entropyNoise : Float;
  };

  type CymaticParameters = {
    visualPattern : Text;
    intensity : Float;
    uniformData : [Float];
  };

  type TVBroadcastMetrics = {
    broadcastId : Nat;
    nodeId : Text;
    phiIntegrity : Float;
    frequency : Float;
    amplitude : Float;
    entropy : Float;
    frameRate : Float;
    bleStatus : Bool;
    pqcStatus : Bool;
    tmrValidation : Bool;
    transmissionQuality : Float;
    timestamp : Int;
  };

  type TVBroadcastSummary = {
    broadcastId : Nat;
    nodeId : Text;
    status : Text;
    signalStrength : Float;
    transmissionQuality : Float;
  };

  type UserProfile = {
    name : Text;
    nodeId : ?Text;
  };

  // CrossChainKernel Types
  type EthereumAgent = {
    address : Text;
    entropyScore : Float;
    checksumValid : Bool;
    dhtMetrics : DHTMetrics;
  };

  type DHTMetrics = {
    nodeCount : Nat;
    merkleVerified : Bool;
    dhtScore : Float;
  };

  type CrossChainMetrics = {
    rhoEth : Float;
    rhoAsi : Float;
    phi : Float;
    theta : Float;
    chi : Float;
    chronoflux : Float;
    inv1 : Bool;
    inv2 : Bool;
    inv3 : Bool;
    inv4 : Bool;
    inv5 : Bool;
    inv6 : Bool;
  };

  type CrossChainEvent = {
    eventType : Text;
    timestamp : Int;
    details : Text;
  };

  module Proposal {
    public func compare(proposal1 : Proposal, proposal2 : Proposal) : Order.Order {
      if (proposal1.id < proposal2.id) { #less } else if (proposal1.id > proposal2.id) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByTitle(proposal1 : Proposal, proposal2 : Proposal) : Order.Order {
      Text.compare(proposal1.title, proposal2.title);
    };
  };

  // Actor state
  let proposals = Map.empty<Nat, Proposal>();
  let nodes = Map.empty<Text, Node>();
  let humanMetrics = Map.empty<Principal, HumanMetrics>();
  let audioMetrics = Map.empty<Principal, AudioMetrics>();
  let cymaticPatterns = Map.empty<Principal, CymaticParameters>();
  let tvBroadcastSummaries = Map.empty<Nat, TVBroadcastSummary>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let tvBroadcastMetrics = Map.empty<Nat, TVBroadcastMetrics>();
  var nextProposalId : Nat = 0;

  // CrossChainKernel state
  let ethereumAgents = Map.empty<Text, EthereumAgent>();
  var crossChainMetrics : ?CrossChainMetrics = null;
  let crossChainEvents = Map.empty<Nat, CrossChainEvent>();
  var nextCrossChainEventId : Nat = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Proposal Management
  public shared ({ caller }) func createProposal(title : Text, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create proposals");
    };

    let proposalId = nextProposalId;
    nextProposalId += 1;

    let newProposal : Proposal = {
      id = proposalId;
      title;
      content;
      proposer = caller;
      status = #pending;
      votes = [];
    };

    proposals.add(proposalId, newProposal);
    proposalId;
  };

  public shared ({ caller }) func voteOnProposal(proposalId : Nat, nodeId : Text, accepted : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote on proposals");
    };

    switch (proposals.get(proposalId)) {
      case (null) { Runtime.trap("Proposal does not exist") };
      case (?proposal) {
        // Verify node exists
        switch (nodes.get(nodeId)) {
          case (null) { Runtime.trap("Node does not exist") };
          case (_) {
            // Check if user already voted with this node
            let alreadyVoted = proposal.votes.find(
              func(v) { v.nodeId == nodeId },
            );

            if (alreadyVoted != null) {
              Runtime.trap("Node has already voted on this proposal");
            };

            let newVote : Vote = { nodeId; accepted };
            let updatedVotes = proposal.votes.concat([newVote]);
            let newStatus = calculateConsensus(updatedVotes);

            let updatedProposal : Proposal = {
              proposal with
              votes = updatedVotes;
              status = newStatus;
            };

            proposals.add(proposalId, updatedProposal);
          };
        };
      };
    };
  };

  public query ({ caller }) func getProposal(proposalId : Nat) : async Proposal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view proposals");
    };
    switch (proposals.get(proposalId)) {
      case (null) { Runtime.trap("Proposal does not exist") };
      case (?proposal) { proposal };
    };
  };

  public query ({ caller }) func getAllProposals() : async [Proposal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view proposals");
    };
    proposals.values().toArray();
  };

  public query ({ caller }) func getAllProposalsByTitle() : async [Proposal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view proposals");
    };
    let proposalArray = proposals.values().toArray();
    proposalArray.sort(Proposal.compareByTitle);
  };

  // Node Management
  public shared ({ caller }) func addNode(nodeId : Text, location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add nodes");
    };

    let newNode : Node = {
      id = nodeId;
      location;
      status = #active;
    };
    nodes.add(nodeId, newNode);
  };

  public shared ({ caller }) func updateNodeStatus(nodeId : Text, status : NodeStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update node status");
    };

    switch (nodes.get(nodeId)) {
      case (null) { Runtime.trap("Node does not exist") };
      case (?node) {
        let updatedNode : Node = {
          node with status;
        };
        nodes.add(nodeId, updatedNode);
      };
    };
  };

  public shared ({ caller }) func removeNode(nodeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove nodes");
    };

    nodes.remove(nodeId);
  };

  public query ({ caller }) func getNode(nodeId : Text) : async Node {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view nodes");
    };
    switch (nodes.get(nodeId)) {
      case (null) { Runtime.trap("Node does not exist") };
      case (?node) { node };
    };
  };

  public query ({ caller }) func getAllNodes() : async [Node] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view nodes");
    };
    nodes.values().toArray();
  };

  // Human Metrics
  public query ({ caller }) func getHumanMetrics(user : Principal) : async HumanMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view human metrics");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own human metrics");
    };

    switch (humanMetrics.get(user)) {
      case (null) {
        Runtime.trap("Human metrics not found");
      };
      case (?metrics) { metrics };
    };
  };

  public shared ({ caller }) func updateHumanMetrics(metrics : HumanMetrics) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update metrics");
    };
    humanMetrics.add(caller, metrics);
  };

  // Audio Engine
  public query ({ caller }) func getAudioMetrics(user : Principal) : async AudioMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view audio metrics");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own audio metrics");
    };

    switch (audioMetrics.get(user)) {
      case (null) {
        Runtime.trap("Audio metrics not found");
      };
      case (?metrics) { metrics };
    };
  };

  public shared ({ caller }) func updateAudioMetrics(metrics : AudioMetrics) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update audio metrics");
    };
    audioMetrics.add(caller, metrics);
  };

  // Cymatic Audio Visualization
  public query ({ caller }) func getCymaticParameters(user : Principal) : async CymaticParameters {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cymatic parameters");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own cymatic parameters");
    };

    switch (cymaticPatterns.get(user)) {
      case (null) {
        Runtime.trap("Cymatic parameters not found");
      };
      case (?params) { params };
    };
  };

  public shared ({ caller }) func updateCymaticParameters(params : CymaticParameters) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cymatic parameters");
    };
    cymaticPatterns.add(caller, params);
  };

  public shared ({ caller }) func generateCymaticParameters(audioMetrics : AudioMetrics) : async CymaticParameters {
    let visualPattern = computeVisualPattern(audioMetrics.frequency);
    let normalizedIntensity = Float.abs(audioMetrics.amplitude) * audioMetrics.amplitude;
    let uniformData = generateUniformData(audioMetrics.phaseDrift, audioMetrics.entropyNoise);

    let params : CymaticParameters = {
      visualPattern;
      intensity = normalizedIntensity;
      uniformData;
    };

    params;
  };

  // TV Broadcast Panel
  public shared ({ caller }) func submitTVBroadcastMetrics(metrics : TVBroadcastMetrics) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit TV broadcast metrics");
    };

    // Store full metrics record with expiry timestamp (default 24 hours)
    tvBroadcastMetrics.add(metrics.broadcastId, metrics);

    // Store summary record for efficient queries
    let summary : TVBroadcastSummary = {
      broadcastId = metrics.broadcastId;
      nodeId = metrics.nodeId;
      status = computeStatusForSummary(metrics.phiIntegrity, metrics.transmissionQuality);
      signalStrength = metrics.amplitude * metrics.phiIntegrity;
      transmissionQuality = metrics.transmissionQuality;
    };

    tvBroadcastSummaries.add(metrics.broadcastId, summary);
  };

  func computeStatusForSummary(phiIntegrity : Float, _transmissionQuality : Float) : Text {
    if (phiIntegrity > 1.02) {
      "high";
    } else if (phiIntegrity > 1.00) {
      "good";
    } else if (phiIntegrity > 0.98) {
      "decent";
    } else {
      "low";
    };
  };

  public query ({ caller }) func getCurrentTVBroadcastSummaries() : async [TVBroadcastSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view TV broadcast summaries");
    };
    let iter = tvBroadcastSummaries.entries();
    let filtered = iter.toArray().filter(
      func((_, summary)) {
        summary.signalStrength > 0.1;
      }
    );
    filtered.map(
      func((_, summary)) { summary }
    );
  };

  public shared ({ caller }) func pruneOldTVBroadcastMetrics() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can prune TV broadcast metrics");
    };

    let currentTime = Time.now();
    let expiryThreshold = Int.abs(24 * 60 * 60 * 1000000000);

    let iter = tvBroadcastMetrics.entries();
    let filtered = iter.toArray().filter(
      func((_, record)) {
        Int.abs(currentTime - record.timestamp) < expiryThreshold;
      }
    );

    tvBroadcastMetrics.clear();

    filtered.forEach(
      func((broadcastId, record)) {
        tvBroadcastMetrics.add(broadcastId, record);
      }
    );
  };

  // CrossChainKernel Methods
  public shared ({ caller }) func addEthereumAgent(address : Text, entropyScore : Float, checksumValid : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add Ethereum agents");
    };

    let dhtMetrics : DHTMetrics = {
      nodeCount = 1;
      merkleVerified = false;
      dhtScore = 0.0;
    };

    let agent : EthereumAgent = {
      address;
      entropyScore;
      checksumValid;
      dhtMetrics;
    };

    ethereumAgents.add(address, agent);
  };

  public shared ({ caller }) func updateDHTMetrics(address : Text, nodeCount : Nat, merkleVerified : Bool, dhtScore : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update DHT metrics");
    };

    switch (ethereumAgents.get(address)) {
      case (null) { Runtime.trap("Ethereum agent not found") };
      case (?agent) {
        let updatedMetrics : DHTMetrics = {
          nodeCount;
          merkleVerified;
          dhtScore;
        };

        let updatedAgent : EthereumAgent = {
          agent with dhtMetrics = updatedMetrics;
        };

        ethereumAgents.add(address, updatedAgent);
      };
    };
  };

  public shared ({ caller }) func updateCrossChainMetrics(metrics : CrossChainMetrics) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update cross-chain metrics");
    };
    crossChainMetrics := ?metrics;
  };

  public shared ({ caller }) func logCrossChainEvent(eventType : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can log cross-chain events");
    };

    let event : CrossChainEvent = {
      eventType;
      timestamp = Time.now();
      details;
    };

    crossChainEvents.add(nextCrossChainEventId, event);
    nextCrossChainEventId += 1;
  };

  public query ({ caller }) func getEthereumAgent(address : Text) : async EthereumAgent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Ethereum agents");
    };

    switch (ethereumAgents.get(address)) {
      case (null) { Runtime.trap("Ethereum agent not found") };
      case (?agent) { agent };
    };
  };

  public query ({ caller }) func getCrossChainMetrics() : async CrossChainMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cross-chain metrics");
    };

    switch (crossChainMetrics) {
      case (null) { Runtime.trap("Cross-chain metrics not found") };
      case (?metrics) { metrics };
    };
  };

  public query ({ caller }) func getCrossChainEvents() : async [CrossChainEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cross-chain events");
    };
    crossChainEvents.values().toArray();
  };

  public query ({ caller }) func getCrossChainEventsByType(eventType : Text) : async [CrossChainEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cross-chain events");
    };

    let allEvents = crossChainEvents.values().toArray();
    allEvents.filter(func(event) { event.eventType == eventType });
  };

  // MerkabahSolar Methods (Integrated in Backend Actor)
  public query ({ caller }) func getMerkabahSolarParams() : async MerkabahSolar.MerkabahSolar {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view MerkabahSolar parameters");
    };
    merkabahSolar.getParams();
  };

  public shared ({ caller }) func activateMerkabahSolar(intention : Float) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can activate MerkabahSolar");
    };
    merkabahSolar.ativar(intention);
  };

  // Consensus calculation (TMR 2-of-3)
  func calculateConsensus(votes : [Vote]) : ProposalStatus {
    let voteCount = votes.size();

    if (voteCount < 2) {
      return #voting;
    };

    let acceptedCount = votes.filter(func(v) { v.accepted }).size();

    if (voteCount >= 3) {
      if (acceptedCount >= 2) {
        return #tmrConsensus;
      } else {
        return #noConsensus;
      };
    } else if (voteCount == 2) {
      if (acceptedCount == 2) {
        return #majorityConsensus;
      } else {
        return #noConsensus;
      };
    };

    #voting;
  };

  // Utility functions
  func computeVisualPattern(frequency : Float) : Text {
    if (frequency < 440.0) {
      "lowFrequency";
    } else if (frequency < 880.0) {
      "midFrequency";
    } else {
      "highFrequency";
    };
  };

  func generateUniformData(phaseDrift : Float, entropyNoise : Float) : [Float] {
    let arraySize = 5;
    Array.tabulate<Float>(
      arraySize,
      func(i) {
        Float.abs(phaseDrift) * Float.pow(Float.abs(entropyNoise), Int.abs(i).toFloat());
      },
    );
  };
};
