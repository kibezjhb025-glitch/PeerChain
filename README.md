# PeerChain 🚀

Decentralized Peer-Learning & Micro-Funding powered by Solana and AI.

## 📁 Project Structure

```
peerchain/
├── anchor/                # Solana Smart Contracts (Rust/Anchor)
│   ├── programs/
│   │   └── peerchain/     # Core logic for Reputation & Funding
│   │       └── src/
│   │           ├── lib.rs # Program instructions
│   │           └── state.rs # Account definitions
│   ├── Anchor.toml        # Anchor configuration
│   └── DEPLOYMENT.md     # Deployment guide
├── app/                   # Next.js Frontend (Generated via v0 by Vercel)
│   ├── components/        # Reusable UI elements
│   │   ├── dashboard/     # Dashboard components
│   │   ├── shared/        # Wallet, Sidebar, Layout
│   │   └── ui/           # Shadcn UI primitives
│   ├── api/               # API routes (Backend logic)
│   │   ├── sessions/      # Session logging
│   │   ├── funding/       # Funding requests
│   │   ├── reputation/    # Reputation system
│   │   └── tts/          # ElevenLabs TTS
│   ├── lib/               # Utilities & Providers
│   │   ├── solana-provider.tsx
│   │   └── wallet-context.tsx
│   └── hooks/             # Custom React hooks
├── shared/               # Shared types and interfaces
│   └── types/
├── docs/                 # Project documentation
├── scripts/              # Setup and deployment scripts
└── README.md            # This file
```

## 🛠️ Tech Stack

- **Blockchain**: Solana (Anchor Framework, Rust)
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Shadcn UI
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare)
- **AI**: ElevenLabs (Text-to-Speech)
- **Deployment**: Vercel (Frontend), Solana Devnet (Contracts)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd peerchain
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your keys:
# - ELEVENLABS_API_KEY (get from elevenlabs.ai)
# - NEXT_PUBLIC_PROGRAM_ID (after deploying the Solana program)
```

### 3. Deploy Solana Program (Optional - for blockchain features)

```bash
cd anchor
# Install Solana CLI and Anchor first (see anchor/DEPLOYMENT.md)
anchor build
anchor deploy
# Copy the program ID to .env.local
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 MVP Flow (Demo)

1. **Connect Phantom Wallet** - Use the "Connect Wallet" button
2. **Create Profile** - Initialize on-chain profile (via program)
3. **Join Mentorship Session** - Log learning sessions
4. **Build Reputation** - Earn reputation points
5. **Request Funding** - Submit micro-funding requests
6. **Voice Integration** - Generate audio briefs with ElevenLabs

## 🏆 Hackathon Tracks

### Solana Track
- Real wallet integration (Phantom)
- On-chain program (Anchor)
- Transaction history visible on Explorer
- PDA-based account structure

### v0/Frontend Track
- Polished UI components
- Responsive dashboard
- Smooth onboarding flow
- Clean component architecture

### ElevenLabs/AI Track
- Text-to-speech integration
- Audio briefs for funding pitches
- Accessible audio content

### Social Impact Track
- Educational accessibility
- Transparent funding system
- Measurable trust/reputation system

## 📝 API Routes

- `GET/POST /api/sessions` - Session management
- `GET/POST /api/funding` - Funding requests
- `GET/POST /api/reputation` - Reputation tracking
- `GET/POST /api/tts` - ElevenLabs audio generation

## ⚠️ Demo Notes

- Uses Solana Devnet (free transactions)
- Program ID needs to be updated after deployment
- ElevenLabs API key required for audio features
- Wallet must be connected to use blockchain features

## 🔧 Troubleshooting

**Wallet not connecting?**
- Ensure Phantom is installed
- Switch to Devnet in Phantom settings
- Check browser console for errors

**Audio not generating?**
- Verify ELEVENLABS_API_KEY in .env.local
- Check API key has sufficient credits

**Program deployment failing?**
- See `anchor/DEPLOYMENT.md` for detailed guide
- Ensure Solana CLI is configured for devnet
**Solana program ID is still the System Program placeholder (`Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`).
**You must:**
1. Install Solana CLI and Anchor
2. Run `anchor build && anchor deploy`
3. Copy the new program ID to `anchor/programs/peerchain/src/lib.rs` and `.env.local`
