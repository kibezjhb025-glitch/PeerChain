# PeerChain - Solana Program Deployment Guide

## Prerequisites

1. Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

2. Install Anchor CLI:
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

3. Configure Solana for devnet:
```bash
solana config set --url devnet
```

4. Create a wallet (if you don't have one):
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

5. Get devnet SOL:
```bash
solana airdrop 2
```

## Build and Deploy

1. Build the program:
```bash
cd anchor
anchor build
```

2. Get the program ID:
```bash
solana address -k target/deploy/peerchain-keypair.json
```

3. Update the program ID in:
   - `anchor/programs/peerchain/src/lib.rs` (line 4: `declare_id!`)
   - `anchor/Anchor.toml` (under `[programs.devnet]`)
   - `app/.env.local` (as `NEXT_PUBLIC_PROGRAM_ID`)

4. Build again with the new ID:
```bash
anchor build
```

5. Deploy to devnet:
```bash
anchor deploy
```

## Initialize Treasury

After deployment, initialize the treasury account:

```bash
anchor run initialize_treasury
```

Or create a script in `scripts/`:
```bash
node scripts/init-treasury.js
```

## Verify Deployment

Check your program on Solana Explorer:
https://explorer.solana.com/address/<YOUR_PROGRAM_ID>?cluster=devnet
