# PeerChain — Solana Program Deployment Guide

## Prerequisites

```bash
# 1. Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# 2. Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 3. Configure Solana for devnet
solana config set --url devnet

# 4. Create a wallet
solana-keygen new --outfile ~/.config/solana/id.json

# 5. Get devnet SOL
solana airdrop 2
solana airdrop 2  # repeat if needed
```

## Build & Deploy

```bash
# 1. Build the Anchor program
cd anchor
anchor build

# 2. Get the program ID
solana address -k target/deploy/peerchain-keypair.json

# 3. Update program ID in ALL three places:
#    - anchor/programs/peerchain/src/lib.rs  (declare_id!)
#    - anchor/Anchor.toml                     [programs.devnet]
#    - .env.local                             NEXT_PUBLIC_PROGRAM_ID

# 4. Rebuild with the real program ID
anchor build

# 5. Deploy to devnet
anchor deploy
```

## Initialize Treasury

After deployment:

```bash
# 1. Fund the treasury wallet (optional, can receive SOL later)
solana transfer <TREASURY_PDA> 10 --allow-unfunded-recipient

# 2. Initialize treasury on-chain via script
node scripts/init-treasury.js
```

## Run Tests

```bash
# Requirements: localnet or devnet validator running
anchor test --skip-deploy
```

## Verify Deployment

- **Program:** `https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet`
- **Treasury PDA:** `https://explorer.solana.com/address/<TREASURY_PDA>?cluster=devnet`

## Architecture Overview

### PDA Derivation

| Account         | Seed                          |
|-----------------|-------------------------------|
| UserProfile     | `["user-profile", <wallet>]`  |
| MentorshipSession | `["session", <session_id>]` |
| ReputationState | `["reputation", <wallet>]`    |
| FundingRequest  | `["funding", <request_id>]`   |
| TreasuryPool    | `["treasury"]`                |

### Instructions

| Instruction         | Signers                          | Description                     |
|---------------------|----------------------------------|---------------------------------|
| `create_user`       | authority                        | Create user profile PDA         |
| `update_user`       | authority + admin                | Update name/role                |
| `log_session`       | student + mentor                 | Record mentorship session       |
| `update_reputation` | user                             | Calculate & store reputation    |
| `request_funding`   | requester                        | Submit funding request (rep≥10) |
| `initialize_treasury` | authority                      | Create treasury PDA             |
| `approve_funding`   | authority (treasury admin)       | Approve pending request         |
| `reject_funding`    | authority (treasury admin)       | Reject pending request          |
| `distribute_funds`  | authority (treasury admin)       | Transfer SOL to requester       |
| `close_request`     | requester                        | Cancel own pending request      |

### Events

All state changes emit Anchor events for off-chain indexing:
- `UserCreated`, `UserUpdated`
- `SessionLogged`
- `ReputationUpdated`
- `FundingRequested`, `FundingApproved`, `FundingRejected`, `FundsDistributed`, `FundingCancelled`
- `TreasuryInitialized`

### Security Model

1. **Authority validation** — Treasury operations require treasury authority signature
2. **Mentor validation** — `log_session` requires BOTH student and mentor signatures
3. **Replay protection** — Each session/request uses a unique PDA seed (session_id/request_id)
4. **Overflow protection** — All arithmetic uses `checked_add`/`checked_sub`
5. **Input validation** — Duration limits (1-1440 min), name/topic length checks
6. **Reputation gating** — Funding requests require reputation ≥ 10
7. **Anti-double-spend** — Status state machine: Pending → Approved → Distributed (irreversible)
