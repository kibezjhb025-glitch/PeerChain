# PeerChain Local Setup

## 1. Clone Repo

```bash
git clone <repo>
cd PeerChain
```

## 2. Run Bootstrap

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

## 3. Verify Installation

```bash
./verify-env.sh
```

## 4. Install Frontend

```bash
yarn install
```

## 5. Run Solana Validator

```bash
solana-test-validator
```

## 6. Build Anchor Program

```bash
anchor build
```

## 7. Deploy Program

```bash
anchor deploy
```

## 8. Start Frontend

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
