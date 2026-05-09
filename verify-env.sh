#!/bin/bash

echo "Checking PeerChain Environment..."

echo ""
echo "Rust:"
rustc --version || echo "Rust missing"

echo ""
echo "Cargo:"
cargo --version || echo "Cargo missing"

echo ""
echo "Solana:"
solana --version || echo "Solana missing"

echo ""
echo "Anchor:"
anchor --version || echo "Anchor missing"

echo ""
echo "Node:"
node --version || echo "Node missing"

echo ""
echo "Yarn:"
yarn --version || echo "Yarn missing"

echo ""
echo "Wallet:"
solana address || echo "Wallet missing"

echo ""
echo "RPC:"
solana config get
