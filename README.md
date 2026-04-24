# 🌳 Celo Pulse Vision

**Celo Pulse Vision** is a real-time governance and monitoring dashboard designed for the Celo ecosystem. It transforms complex blockchain data into actionable insights, focusing on treasury transparency, validator health, and project progress tracking via MiniPay.

🚀 **Live Application:** [celo-pulse-vision.lovable.app](https://celo-pulse-vision.lovable.app/)

---

## 📋 Overview

This project serves as a "command center" for Celo governance. It enables token holders, validators, and builders to track the pulse of the network directly from their mobile devices, with a strict **Mobile-First** approach optimized for the MiniPay experience.

### Key Features:
- **Treasury Oversight:** Real-time monitoring of the Celo Community Fund balance.
- **Network Health:** Live uptime and performance metrics for Celo validators.
- **Proof of Ship Tracker:** Transparent tracking of project milestones funded by ecosystem grants.
- **Governance Interaction:** Direct interface for active Celo Governance Proposals (CGPs) and voting.
- **MiniPay Native:** Deep integration for automatic wallet detection and seamless mobile transactions.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Blockchain Interaction:** [viem](https://viem.sh/) & [wagmi v2](https://wagmi.sh/)
- **Styling:** Tailwind CSS (Celo Heritage Design System)
- **Smart Contracts:** Solidity 0.8.20 (OpenZeppelin Standards)
- **Network:** Celo Mainnet (ChainID: 42220)

## 🔐 Smart Contract

The smart contract acts as an immutable registry for ecosystem health reports and project milestones.

- **Contract Address (Celo Mainnet):** `0xbbd04983058864703b44B279f60046E0259f77f8`
- **Explorer:** [CeloScan](https://celoscan.io/address/0xbbd04983058864703b44B279f60046E0259f77f8)

## 📱 MiniPay Integration

The dashboard is specifically optimized for the **MiniPay (Opera Mini)** WebView.
- Automatic detection of `window.ethereum.isMiniPay`.
- Silent auto-connect for a frictionless user experience.
- Ultra-lightweight UI for fast loading on mobile networks.

## 🤝 Contributing

This is a community-focused project. If you want to help improve governance transparency on Celo:

1. **Fork** the project.
2. Create a Feature Branch (`git checkout -b feature/NewFeature`).
3. **Commit** your changes (`git commit -m 'Add new functionality'`).
4. **Push** to the Branch (`git push origin feature/NewFeature`).
5. Open a **Pull Request**.

---

Developed by **Beni Bauer** 
