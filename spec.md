# Arkhe(n) — Platform Dashboard

## Current State
New project. No application files exist yet.

## Requested Changes (Diff)

### Add
- Full-stack Arkhe(n) dashboard web app
- Backend: session management, relay log entries, quorum node status, oracle metrics storage
- Frontend: dark cyber dashboard with all panels from design preview

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- Store oracle metrics (omega, phase, coherence)
- Store relay transactions (id, status, gas, block, explorer_url)
- Store quorum nodes (id, region, city, omega, status)
- Store EEG session data (duration, strategy, sync status, manifold metrics)
- Store arbitrage activity (pair, profit, timestamp, exchange)
- CRUD operations for all above
- Seed realistic demo data on init

### Frontend (React + Tailwind)
- Top nav: brand "Arkhe(n)" + nav items (Dashboard, Trading, Neurofeedback, Quorum, Settings)
- Row 1 (3 cols): Omega Prime Coherence gauge | System Phase Indicator | Live Arbitrage Activity + Quorum strip
- Row 2 (2 cols): EEG Geometric Manifold (3D wireframe with Three.js/Canvas) | Transaction Relay Monitor
- Row 3: Session Management + Quantum Method cards | Quantum Quorum Consensus Nodes map
- All panels match design preview aesthetic: deep navy bg, cyan/purple neon accents, card borders with glow
- Real-time feel with animated coherence gauge, pulsing nodes, live relay log
