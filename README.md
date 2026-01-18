# Digital Evidence Preservation System (PoC)

A Proof of Concept (PoC) for a secure, blockchain-based system to preserve digital evidence. This system ensures the integrity and immutability of digital evidence using Ethereum smart contracts and IPFS (simulated).

## 🚀 Features

-   **Role-Based Access Control**: Only authorized officers can upload evidence.
-   **Immutable Storage**: Evidence metadata (IPFS Hash, Case ID, Uploader, Timestamp) is stored on the customized Blockchain.
-   **Evidence Verification**: Anyone can verify the authenticity of a file by checking its hash against the blockchain record.
-   **Legal Compliance**: Generates a downloadable **Section 65B Certificate** (Indian Evidence Act) for legal admissibility.
-   **Simulated IPFS**: Simulates decentralized file storage for this PoC.

## 🛠️ Tech Stack

-   **Backend**: Hardhat, Solidity (Ethereum)
-   **Frontend**: React, Vite, Ethers.js
-   **Blockchain**: Local Hardhat Network

## 📋 Prerequisites

-   Node.js (v18+)
-   MetaMask Wallet Extension

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/RLalithSeeker/Digital-Evidence.git
cd Digital-Evidence
```

### 2. Backend Setup (Blockchain)
Navigate to the `hardhat` directory and install dependencies:
```bash
cd hardhat
npm install
```

Start the local Hardhat blockchain node:
```bash
npx hardhat node
```
> **Note:** Keep this terminal running! It gives you 20 test accounts with fake ETH.

Open a **new terminal**, navigate to `hardhat`, and deploy the smart contracts:
```bash
cd hardhat
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the React application:
```bash
npm run dev
```
The app will run at `http://localhost:5173`.

## 🦊 MetaMask Configuration

1.  Open MetaMask and add a **Custom Network**:
    -   **Network Name**: Localhost 8545
    -   **RPC URL**: `http://127.0.0.1:8545`
    -   **Chain ID**: `31337` (or `1337`)
    -   **Currency Symbol**: ETH
2.  **Import an Account**:
    -   Copy one of the "Private Keys" from the `npx hardhat node` terminal.
    -   In MetaMask, click **Account** -> **Import Account** -> Paste Private Key.

## 📖 Usage Guide

1.  **Connect Wallet**: Click the "Connect Wallet" button on the top right.
2.  **Upload Evidence**:
    -   Enter a **Case ID** (e.g., `CASE-2024-X1`).
    -   Select a file to upload.
    -   Click **Secure Upload** and confirm the transaction in MetaMask.
3.  **Verify Evidence**:
    -   Copy the generated **IPFS Hash**.
    -   Paste it into the "Verify Evidence" section.
    -   Click **Verify**.
4.  **Generate Report**:
    -   If verified, click **Generate Legal Report** to see the Section 65B certificate.

## 📜 Smart Contract

The `Evidence.sol` contract handles:
-   `uploadEvidence`: Stores file hash and metadata.
-   `verifyEvidence`: Retreives metadata by hash.
-   `addOfficer`: Admin function to authorize new uploaders.
