# Cluster W — Large Industry, Web3 and 2026 Hackathons (2025–2026)

Researched 2026-09-25. Sources used:
- ETHGlobal showcase pages (`ethglobal.com/showcase/...`).
- The Devfolio public search API for ETHDenver 2026. The project pages there render with JavaScript, so the raw project JSON was pulled from `api.devfolio.co/api/search/projects`.
- Colosseum Arena project pages and the Colosseum blog.
- Cerebral Valley's gallery and Anthropic's winners blog for Built with Opus 4.7.
- GitLab's winners blog and Devpost project pages.

Descriptions summarize what the teams wrote about their own projects. The "Why it likely won" lines are analyst inference, not quotes from judges.

**Paid-service legend:** PAID = usage-billed or subscription API/hardware. FREE-TIER = has a meaningful free tier, testnet or hackathon credits, but costs money at scale. FREE/OPEN-SOURCE = self-hostable, open protocol or free public data.

## Hackathons covered

| # | Hackathon | Edition used | Dates | Size | Projects verified |
|---|---|---|---|---|---|
| W1 | ETHGlobal Cannes | 2025 | Jul 4–6, 2025 | ~1,500 hackers / 334 projects / $275k pool | 8 (W1-8 has limited detail) |
| W2 | ETHDenver BUIDLathon | 2026 | Feb 18–21, 2026 on-site (virtual from Feb 11) | 186 Devfolio projects; festival 25k+ attendees | 8 (+2 more top-10 noted) |
| W3 | Colosseum Solana Cypherpunk | Late 2025 | Sep–Oct 2025; winners announced Dec 2025 | 9,000+ participants / 1,576 projects | 8 |
| W4 | Anthropic × Cerebral Valley "Built with Opus 4.7" Claude Code Hackathon | 2026 | Build week starting Apr 21, 2026 (per the Cerebral Valley gallery) | 20,000+ applicants, 500 selected, 288 projects, 9 finalists | 8 |
| W5 | GitLab AI Hackathon (with Google Cloud and Anthropic) | 2026 | Feb 9 – Mar 25, 2026 | ~7,000 developers / 600+ agents and flows / $65k | 8 |

**Substitutions and reasoning**
- **W1:** I chose Cannes 2025 over Buenos Aires 2025. Cannes is better documented: an official top-10 finalist list, press coverage, and showcase pages that could be scraped. Buenos Aires pages were not reliably fetchable during this research.
- **W2:** The 2026 edition was available, so no fallback to 2025 was needed. ETHDenver named a "Top 10" (two winners in each of five tracks). The overall winner, Umbra Gateway, was confirmed by ETHDenver's X post ("Winner: Umbra Gateway") and by the resolved Polymarket market.
- **W3:** I used Cypherpunk rather than Breakout. It is the larger event and the most recent fully documented one. Colosseum also ran a 2026 "Frontier" hackathon, billed as the largest crypto hackathon ever, with 26 winners (Grand Champion: CrowdBrain). I excluded it to keep the cluster diverse, and it is a good candidate if more Solana data is needed.
- **W4:** This is the biggest 2026 AI/agents hackathon found with fully published winners that was not excluded. It has a huge applicant pool, and every winner and finalist has a gallery page.
  - I also considered Mistral AI's Worldwide Hackathon (Feb 28 – Mar 1, 2026: 7 cities, 7,000+ applicants, 1,000 builders). The winners' names and project details were not published in any source I could fetch, so I dropped it.
  - The finalists of ETHGlobal Cannes 2026 (April 2026) are known: ENShell, DIVE, maki, Défi, ALMA, npmguard, VEIL VPN, PaintGlobal, EVM PORST and Corpus. I did not use it to avoid duplicating W1.
- **W5:** GitLab AI Hackathon 2026 has a large participant count and well-documented winners, and its domain (DevSecOps / software-lifecycle agents) differs from W4's domain-expert consumer apps.
  - I also considered MakeMIT × Harvard 2026 for a hardware angle. It had only 51 projects and its gallery does not rank winners, so it is too small.

---

## W1 — ETHGlobal Cannes 2025

- **Official name / dates / venue:** ETHGlobal Cannes, July 4–6, 2025, Cannes, France (EthCC week).
- **Size:** ~1,500 participants; 334 projects submitted; 10 finalists.
- **Prize structure:** $275k total and 29 sponsor prizes. The largest were $20k each from LayerZero, 1inch and World. $10k each came from Oasis, Zircuit, Chainlink, Flare, Ledger, Flow, Circle, ENS, Walrus, The Graph, Self Protocol and the ASI Alliance. The 10 ETHGlobal finalists present on the main stage and receive the Finalist Pack perks.
- **Finalist list source:** https://x.com/ETHGlobal/status/1941863125759984042 and https://www.chaincatcher.com/en/article/2190093
- **Showcase:** https://ethglobal.com/showcase?events=cannes

### W1-1 — Hashlocked
- **Prize(s):** ETHGlobal Cannes Finalist; 1inch "Non-EVM Extensions for Fusion+" 1st place
- **Source:** https://ethglobal.com/showcase/hashlocked-jwaq6
- **Pitch:** Trustless, bidirectional atomic swaps between EVM tokens and native Bitcoin.
- **Problem:** Trading between ETH and BTC requires centralized exchanges, custodians or wrapped BTC, which adds custody risk and fees.
- **How it works:**
  - The maker locks tokens in a per-trade escrow on the EVM side, built on the 1inch Limit Order Protocol, under a hash of a secret.
  - The counterparty locks BTC in a native Hash Time-Locked Contract (P2SH/P2WSH) under the same hash.
  - Revealing the secret to claim one side makes it public, which lets the other side claim. Timelocks give refunds if either party walks away.
- **Tech stack:** Solidity, Hardhat, TypeScript, 1inch Limit Order Protocol / Fusion+ escrow factory, Bitcoin script (HTLC), Bitcoin Core.
- **External APIs:**
  - Mempool.space API — FREE
  - Bitcoin Core node — FREE/OPEN-SOURCE
  - 1inch contracts — FREE/OPEN-SOURCE
- **Why it likely won:** Deep technical work across two very different execution environments. It answered a $20k sponsor bounty exactly, and cross-chain BTC liquidity is a long-standing unsolved pain point.
- **Core primitive:** A *hashlock/timelock atomic swap between an EVM smart contract and a native Bitcoin script*, i.e. trustless cross-chain settlement with no bridge.

### W1-2 — OnlyDanks
- **Prize(s):** ETHGlobal Cannes Finalist; World Pool Prize
- **Source:** https://ethglobal.com/showcase/onlydanks-wi77b
- **Pitch:** End-to-end-encrypted messaging that lives entirely in Ethereum blob space. No app, no server, no middleman.
- **Problem:** Private messengers still depend on centralized servers that can see metadata, censor or be shut down.
- **How it works:**
  - Each user registers an ENS subname (`name.onlydanks.eth`) that points to a secp256k1 public key.
  - The sender runs ECDH with the recipient's key, encrypts the message and posts it into an EIP-4844 blob.
  - A stateless indexer scans blobs and lets recipients look up messages by a hash of the shared secret. Messages are unlinkable to outsiders, and blobs expire, so storage is ephemeral.
- **Tech stack:** Ethereum blobs (EIP-4844), ENS subnames (L2 registrar on World Chain Sepolia), ECDH over secp256k1, a stateless indexing backend.
- **External APIs:**
  - Ethereum RPC / blob access (e.g. a beacon API provider) — FREE-TIER
  - ENS — FREE/OPEN-SOURCE (gas only)
- **Why it likely won:** A novel and slightly subversive use of a brand-new Ethereum primitive (blobs). It pairs a strong privacy narrative with a clean demo.
- **Core primitive:** *Encrypted, censorship-resistant message drop into public blob data, discoverable only by the holder of a shared secret.*

### W1-3 — PolyBet (PolyBets)
- **Prize(s):** ETHGlobal Cannes Finalist; ASI Alliance "Innovator's Edge" 2nd place; Oasis "Build on Oasis Stack" 3rd place
- **Source:** https://ethglobal.com/showcase/polybet-p884n
- **Pitch:** An AI-powered, privacy-preserving smart router that aggregates prediction markets for best execution.
- **Problem:** Prediction-market liquidity is fragmented across venues, so users must compare prices by hand, suffer slippage and expose their positions publicly.
- **How it works:**
  - Deposits and bet slips live in confidential contracts on Oasis Sapphire.
  - A router running in a TEE (Oasis ROFL) splits each bet across Polymarket and LMSR-priced custom markets. It uses convex optimization, grid search and gradient descent to minimize price impact.
  - An LLM matches equivalent markets across venues and rewrites their titles. A separate ROFL service hunts for arbitrage.
- **Tech stack:** Oasis Sapphire, ROFL (TEE), Solidity, Python, Bun + Hono/Elysia, Supabase Postgres, Next.js 15 / React 19, Reown AppKit / Wagmi, The Graph, Anchor (Solana), an LMSR market maker.
- **External APIs:**
  - Anthropic Claude — PAID
  - Polymarket API — FREE
  - The Graph — FREE-TIER
  - Supabase — FREE-TIER
  - Oasis Sapphire testnet — FREE
- **Why it likely won:** It combines three hot themes (prediction markets, AI agents, confidential compute) into a working router, and its technical depth spans several services.
- **Core primitive:** A *confidential (TEE-run) best-execution order router across fragmented markets, with LLM-based market matching.*

### W1-4 — livestakes
- **Prize(s):** ETHGlobal Cannes Finalist
- **Source:** https://ethglobal.com/showcase/livestakes-sn1wb
- **Pitch:** A parallel betting market on hackathon teams, where fans bet on who will win each track.
- **Problem:** Hackathon winners earn little, and would-be judges and angel investors have no way to build a verifiable track record of picking talent.
- **How it works:**
  - Teams upload pitch videos, stored on IPFS with the hashes kept on-chain.
  - Bettors stake FLOW on teams per track, and odds update from the pool ratios.
  - After judging, `setWinners()` and `distribute()` pay 80% of the pool to correct bettors and 20% to the winning hackers. A leaderboard tracks each bettor's ROI.
- **Tech stack:** Flow EVM smart contracts, IPFS, web frontend (livestakes.fun).
- **External APIs:**
  - IPFS pinning service — FREE-TIER
  - Flow testnet — FREE
- **Why it likely won:** A meta, crowd-pleasing idea that judges at a hackathon immediately "get". It is a clear consumer loop with a live demo.
- **Core primitive:** A *parimutuel side-pool on any judged competition that splits payouts between predictors and competitors.*

### W1-5 — Pace Club
- **Prize(s):** ETHGlobal Cannes Finalist
- **Source:** https://ethglobal.com/showcase/pace-club-b6fn6 (code: https://github.com/finessevanes/pace-club)
- **Pitch:** "Bumble BFF meets Strava": a privacy-first social running app for women, with verified meetups and rewards.
- **Problem:** "Let's run sometime" rarely turns into real meetups, and women face safety and trust concerns meeting strangers.
- **How it works:**
  - Users log in with Privy (embedded wallet) and prove only their gender through a zero-knowledge identity proof (Self), without revealing full identity.
  - They connect Strava and set pace, vibe and location. An AI matching engine suggests running partners.
  - Once Strava data (timestamps and geolocation matching) confirms a joint run, both users earn "Pace Points" redeemable for perks.
- **Tech stack:** Privy, Self (ZK passport/ID attribute proofs), Strava API, an AI matching engine, Flow.
- **External APIs:**
  - Privy — FREE-TIER
  - Self Protocol — FREE/OPEN-SOURCE
  - Strava API — FREE-TIER
  - LLM/AI matching — PAID (provider not specified)
- **Why it likely won:** Strong social-impact and safety narrative. It uses ZK selectively for exactly one attribute and has a mainstream consumer UX that hides the crypto.
- **Core primitive:** *Selective-disclosure ZK attribute proof (e.g. gender or age only) plus a proof-of-activity check from a fitness API.*

### W1-6 — POAPrivacy
- **Prize(s):** ETHGlobal Cannes Finalist; ENS "Most Creative Use Case" 2nd place
- **Source:** https://ethglobal.com/showcase/poaprivacy-ykk5a
- **Pitch:** Mint POAPs to stealth addresses, so you can prove attendance without doxxing your physical location.
- **Problem:** A POAP publicly links an identity (`name.eth`) to a physical place and time, which is a safety risk.
- **How it works:**
  - A passkey (WebAuthn) deterministically derives spending and viewing keys through HKDF, so no raw private key is stored.
  - Each mint goes to a fresh ERC-5564 stealth address derived from an ephemeral key plus the user's ERC-6538 meta-address, and an announcement is posted on-chain.
  - The recipient scans announcements with the viewing key to find and control their POAPs.
- **Tech stack:** Next.js, React, TypeScript, Tailwind, TanStack Query, Privy, ERC-5564/ERC-6538, WebAuthn passkeys, secp256k1, POAP APIs.
- **External APIs:**
  - POAP Collectors and Minting API — FREE (API key)
  - Privy — FREE-TIER
- **Why it likely won:** A clean, standards-based privacy upgrade to a beloved Ethereum primitive, delivered with passkey UX. It landed right at Ethereum's 10-year privacy push.
- **Core primitive:** *Passkey-derived stealth-address receiving: unlinkable credentials or assets delivered to a user without exposing their main identity.*

### W1-7 — PrivyCycle
- **Prize(s):** ETHGlobal Cannes Finalist; Privy "Best Consumer App"; Zircuit "Best Project Deployed on Zircuit"; 0G "Most Innovative Use of 0G"
- **Source:** https://ethglobal.com/showcase/privycycle-anndr
- **Pitch:** A private, user-owned period tracker with encrypted records, revocable sharing and anonymized AI insights.
- **Problem:** Period apps expose or sell intimate health data, and users lose their history if the company folds.
- **How it works:**
  - Users sign in with Google, Apple or email through Privy.
  - Logs are encrypted on-device and stored on IPFS.
  - Users grant or revoke decryption access for doctors, partners or family. The "Gift to Daughter" feature hands the archive down to the next generation.
  - Anonymized features go to 0G's decentralized AI inference for cycle insights.
- **Tech stack:** React Native, Node/Express, Privy SDK, IPFS, 0G compute, Zircuit L2.
- **External APIs:**
  - Privy — FREE-TIER
  - IPFS pinning — FREE-TIER
  - 0G inference — FREE-TIER (testnet)
  - Zircuit — FREE (testnet)
- **Why it likely won:** A highly relatable women's-health privacy story, a polished mobile consumer app, and three sponsor prizes stacked on one product.
- **Core primitive:** *Client-side-encrypted personal data vault with granular, revocable sharing plus privacy-preserving AI analysis.*

### W1-8 — PrivacyLinks *(limited detail)*
- **Prize(s):** ETHGlobal Cannes Finalist
- **Source:** Finalist announcement https://x.com/ETHGlobal/status/1941863125759984042 and https://www.bitget.com/news/detail/12560604852787. The showcase page could not be located or fetched.
- **Pitch:** A browser wallet that makes Web3 browsing private.
- **Problem:** A normal wallet links every dapp session to one address across chains and sites, so activity is trivially trackable.
- **How it works (from the finalist summaries only):** It combines Privacy Pools deposits, stealth addresses and cross-chain *session isolation*, so each dapp or session sees a different, unlinkable identity.
- **Tech stack:** Browser-extension wallet, Privacy Pools, stealth addresses (details unverified).
- **External APIs:** Not verified.
- **Why it likely won:** The privacy theme dominated Cannes 2025, and this moves privacy down to the wallet and browsing layer.
- **Core primitive:** *Per-site, per-session unlinkable wallet identities.*

*Other Cannes finalists not detailed:* BeamPay (EIP-7702 wrapped ERC-20 payments with on-chain metadata in a single transaction) and ChromaMind (personalized sound and light meditation sessions minted as NFTs). Their showcase pages were not found.

---

## W2 — ETHDenver 2026 BUIDLathon

- **Official name / dates:** ETHDenver 2026 "New #BUIDL City" BUIDLathon. Virtual building started Feb 11, 2026, on-site building ran Feb 18–21, 2026, and winners were announced Feb 21, 2026.
- **Size:** 186 projects on Devfolio (https://ethdenver2026.devfolio.co/projects). The overall festival draws 25k+ attendees.
- **Track / sponsor structure:**
  - **Five main tracks, with two winners each ("Top 10"):**
    - ETHERSPACE (user-owned internet)
    - Devtopia (infrastructure)
    - New France Village (DeFi / markets)
    - Futurllama (AI / frontier)
    - Prosperia (public goods / impact)
  - **Sponsor bounties:** Hedera, 0G Labs, ADI Foundation, Canton Network, Base, Kite AI (x402), QuickNode, Blockade Labs, Uniswap Foundation, Nouns DAO.
  - **Other awards:** "Celebrity Judge Honourable Mentions". Polymarket ran a market on the overall winner, which resolved to Umbra Gateway.
- **Winners source:** https://x.com/EthereumDenver/status/2025346999596225007 and https://polymarket.com/event/who-will-win-the-ethdenver-buidlathon-726
- **Project data source:** Devfolio search API, `hackathon_slugs=["ethdenver2026"]`.

### W2-1 — Umbra Gateway
- **Prize(s):** Overall BUIDLathon winner; Devtopia track winner; Celebrity Judge Honourable Mention
- **Source:** https://devfolio.co/projects/privacy-gateway-1829 (code: https://github.com/kshinn/umbra-gateway)
- **Pitch:** "Dial tone from a payphone": anonymous Ethereum RPC access, paid in stablecoins and routed over Tor.
- **Problem:** Privacy wallets still leak everything at the RPC layer. Alchemy, Infura and QuickNode see your IP address, account, payment card and every call payload, and can correlate wallets with people.
- **How it works:**
  - A desktop (Electron) wallet stack bundles a Tor client (Arti, compiled per architecture) and a locally compiled Helios light client (WASM), so non-state calls stay local and state is verified with proofs.
  - Remaining RPC calls go through onion routing to a gateway. The gateway is paid per request with x402 stablecoin micropayments, so no account or credit card is needed.
- **Tech stack:** Electron, React, Tailwind, Go, Tor/Arti, Helios (WASM light client), x402, Base Sepolia.
- **External APIs:**
  - Upstream RPC provider — FREE-TIER/PAID
  - x402 facilitator — FREE
  - Tor network — FREE/OPEN-SOURCE
- **Why it likely won:** It fixes a real, under-appreciated hole in the privacy stack (the "Kohaku"-style privacy-wallet agenda). The infrastructure work is serious, and it made payment-for-access fully anonymous.
- **Core primitive:** *Anonymous pay-per-request access to a metered API (x402 + Tor), with no account, no card and no IP address exposed.*

### W2-2 — Stake Clash
- **Prize(s):** ETHERSPACE track winner (Top 10); Celebrity Judge Honourable Mention; Hedera "Best Hiero CLI Plugin (Open Source PR)"
- **Source:** https://devfolio.co/projects/stake-clash-84f4 (code: https://github.com/jazibrq/StakeClash, live: https://stake-clash.vercel.app)
- **Pitch:** "Stake. Compete. Win." A no-loss competitive game where only your staking yield is at risk.
- **Problem:** Crypto yield is boring (passive staking), dangerous (leverage) or gambling-like (play-to-earn that risks principal), and bigger wallets dominate.
- **How it works:**
  - Users deposit ETH (staking) or stablecoins (lending). Principal stays staked, and the yield is normalized across assets and turned into in-game resources.
  - Players compete in seasonal, friend-based lobbies and on leaderboards.
  - Hedera Schedule Service system contracts run time-locked refunds and season transitions on-chain, with no off-chain cron.
- **Tech stack:** Solidity, Node.js, TypeScript, ethers.js, Hedera Schedule Service, Hiero CLI.
- **External APIs:**
  - Hedera testnet — FREE
  - Staking and lending protocols — FREE/OPEN-SOURCE (gas only)
- **Why it likely won:** A "no-loss lottery" mechanic reframed as skill-based play, with fairness across wallet sizes. It also shipped real on-chain automation and an open-source PR.
- **Core primitive:** *Yield-only-at-risk game economy: principal-protected deposits whose yield funds competitive play.*

### W2-3 — ChainCraft Games
- **Prize(s):** ETHERSPACE track winner (Top 10)
- **Source:** https://devfolio.co/projects/chaincraft-games-edb2 (live: https://play.chaincraft.games)
- **Pitch:** Describe a game idea to an AI and get a playable multiplayer game in minutes, with ownable, remixable mechanics and royalties.
- **Problem:** Even prototyping one game mechanic means building a whole game, so most ideas die unplayed.
- **How it works:**
  - A conversational Claude "Game Builder" agent refines the design and then compiles it once into *deterministic* game code (state schemas, transitions, preconditions). Gameplay therefore needs no LLM calls: the target is under $0.01 per game, down from ~$0.13 per six-move game when AI ran every turn.
  - AI "simulation players" test games before publishing.
  - Games and their modules are minted as NFTs. Remixers pay royalties.
  - "Token Duels" add skill-based wagering, with a cut going to the creator.
- **Tech stack:** Next.js, React, Node.js, Solidity, Arbitrum mainnet, Claude, Leonardo AI (art), token-gated builder (Data Drifter NFT).
- **External APIs:**
  - Anthropic Claude — PAID
  - Leonardo AI — PAID/FREE-TIER
  - Arbitrum RPC — FREE-TIER
- **Why it likely won:** Live on mainnet with real multiplayer. It has an explicit AI-cost engineering story and a complete creator-economy flywheel.
- **Core primitive:** *LLM compiles natural language to a deterministic state machine once, then runs it with zero inference cost, plus on-chain ownership and royalties for the generated modules.*

### W2-4 — Tabula
- **Prize(s):** Devtopia track winner (Top 10)
- **Source:** https://devfolio.co/projects/tabula-1e0c (code: https://github.com/0xwonj/tabula)
- **Pitch:** A zero-knowledge kernel that proves *schema-typed table state transitions* instead of RISC-V execution.
- **Problem:** General zkVMs (SP1, RISC Zero) push every state read through the whole ISA pipeline and memory-consistency argument. Proving cost therefore scales with total computation rather than with state accesses, and Merkle-root updates cost thousands of hashes.
- **How it works:**
  - Programs compile to an IR in a strict Normal Form with true SSA, so access patterns are statically known and locals behave like wires rather than memory. This removes intra-transaction RAM checks.
  - Each (table, column) picks its own commitment: a sparse Merkle tree for big columns, a new "Small Sparse Map Commitment" for small ones. These roll up into one global state root.
  - Proofs are STARKs built on Plonky3.
- **Tech stack:** Rust, Plonky3, STARKs, custom IR and commitment schemes. Built heavily with Claude Code, with multiple agents working across crates in parallel.
- **External APIs:** None. FREE/OPEN-SOURCE.
- **Why it likely won:** A genuine research-grade result, reached as a solo builder, targeting a core scaling bottleneck for rollups and verifiable databases.
- **Core primitive:** *A ZK-provable, typed key-value/table state machine whose cost scales with state touched, not with instructions executed.*

### W2-5 — ParlayVoo
- **Prize(s):** New France Village track winner (Top 10); 0G Labs "Best Use of AI Inference or Fine-Tuning" 2nd place
- **Source:** https://devfolio.co/projects/parlayvoo-be87 (code: https://github.com/roman-popenov/parlaycity)
- **Pitch:** "Bet like a degen. Earn like the house." On-chain parlays on Base, where liquidity providers are the house.
- **Problem:** Sportsbook parlays are opaque, and the house edge goes to bookmakers.
- **How it works:**
  - Users build 2–5-leg parlays that are minted as NFT tickets, with multipliers computed on-chain from a LegRegistry.
  - LPs deposit USDC and earn the house edge. Losing bettors get 10% back, a figure the team modeled for house solvency.
  - Three agents run the system:
    - "Kelly", a risk advisor that sells EV and Kelly-criterion advice behind x402 paywalls and runs its inference on 0G.
    - "Betty", which recommends bets from sports data.
    - "Seth", a settler bot on Base that resolves legs and pays its own gas from x402 fees.
- **Tech stack:** Solidity, Foundry, TypeScript, Node, Tailwind, Base, Uniswap API/position manager, 0G compute, x402 (Kite AI).
- **External APIs:**
  - 0G compute — FREE-TIER
  - Uniswap API — FREE-TIER
  - x402 facilitator — FREE
  - Sports data API — FREE-TIER/PAID
  - Base RPC — FREE-TIER
- **Why it likely won:** Full-stack DeFi plus a self-sustaining agent economy that hits four sponsor bounties at once. The house economics were actually modeled.
- **Core primitive:** *A self-funding agent: one that sells a service over x402 and uses the revenue to pay its own on-chain operating costs (keeper/settler).*

### W2-6 — EventGraph
- **Prize(s):** New France Village track winner (Top 10)
- **Source:** https://devfolio.co/projects/eventgraph-0218 (live: https://denver.eventgraph.ai, code: https://github.com/coingraphai/eventgraph-ethdenver-2026)
- **Pitch:** A unified intelligence layer across prediction markets.
- **Problem:** The same event trades at different prices on Polymarket, Kalshi, Limitless and others. There is no event-level view, and arbitrage is hard to spot.
- **How it works:**
  - Market feeds are normalized into a single probability format and mapped to canonical event IDs using fuzzy matching plus LLM semantic matching of differently worded contracts.
  - Monitoring agents compute cross-venue spreads and filter false arbitrage by liquidity depth, slippage and latency, then surface high-confidence opportunities.
- **Tech stack:** React, TypeScript, Python, PostgreSQL, REST, LLM matching.
- **External APIs:**
  - Polymarket API — FREE
  - Kalshi API — FREE
  - Limitless API — FREE
  - LLM provider — PAID
- **Why it likely won:** Prediction markets were the dominant 2025–26 narrative (compare W1-3 and W3-2), and this has a live, useful dashboard.
- **Core primitive:** *LLM-based entity resolution of "the same real-world event" across heterogeneous market APIs.*

### W2-7 — Necto
- **Prize(s):** Futurllama track winner (Top 10); Celebrity Judge Honourable Mention; ADI Foundation track winner
- **Source:** https://devfolio.co/projects/necto-20be (code: https://github.com/ansonlam23/necto)
- **Pitch:** A two-sided institutional compute marketplace, the "Expedia for GPUs".
- **Problem:** Institutions leave GPUs idle because DePIN networks lack KYC and compliance controls. Startups overpay for centralized clouds because DePIN supply is fragmented across CLIs and tokens.
- **How it works:**
  - A Vercel AI SDK agent turns a plain-English job ("train a PyTorch model") into Docker image, VRAM and CPU specs, and lets the user refine them in English.
  - It fetches live prices across ~8 DePIN networks (Akash, Render, io.net and others), picks the cheapest compliant provider and emits a valid Akash SDL manifest.
  - An AI-managed escrow settles payment.
- **Tech stack:** Next.js, TypeScript, Solidity, Vercel AI SDK, Akash SDL.
- **External APIs:**
  - LLM via Vercel AI SDK — PAID
  - Akash / Render / io.net pricing APIs — FREE
  - Compute itself — PAID
- **Why it likely won:** A clear B2B wedge (compliance for institutions), a concrete agent that produces valid infrastructure manifests, and a sizeable market story.
- **Core primitive:** *Natural language to infrastructure spec to cheapest-provider deployment across a decentralized compute market.*

### W2-8 — Clean Slate Agent
- **Prize(s):** Prosperia track winner (Top 10)
- **Source:** https://devfolio.co/projects/clean-slate-agent-c8e5 (code: https://github.com/anitasrinivasan/clean-slate-agent)
- **Pitch:** Free AI legal aid to clear your criminal record, plus privacy-preserving eligibility credentials for employers.
- **Problem:** About 1 in 3 US adults has a record and many are eligible for expungement, but the process is expensive and confusing. Employers see far more detail than "Ban the Box" laws intend.
- **How it works:**
  - A Claude Sonnet 4 chat agent uses a state-specific rules knowledge base covering 10 US states to assess eligibility. Claude Vision reads uploaded RAP-sheet photos, and a second Claude pass extracts structured JSON.
  - An "eligible" verdict creates a Daml credential on Canton Network. Employers verify with only the credential ID and see eligible or not eligible. The other fields are cryptographically invisible thanks to Canton's sub-transaction privacy.
  - The agent's own Base wallet is funded by employer verification micropayments.
- **Tech stack:** React, Vite, Tailwind, Node/Express, SQLite, Daml / Canton Network, Solidity, ethers.js, Base.
- **External APIs:**
  - Anthropic Claude (chat + vision) — PAID
  - Canton / Daml SDK — FREE/OPEN-SOURCE
  - Base RPC — FREE-TIER
- **Why it likely won:** Strong social impact, a legally grounded privacy guarantee enforced by the ledger rather than by policy, and a self-sustaining agent business model.
- **Core primitive:** *An AI eligibility determination issued as a selective-disclosure credential: the verifier learns only yes or no.*

*Other ETHDenver 2026 Top-10 winners (not detailed above):*
- **OnlyGains.ai** (Futurllama; Blockade Labs "Homeless Agent" bounty): an anime AI fitness coach that pays ETH from an escrowed deposit when webcam pose detection verifies exercise. It uses OpenAI 4.1 nano, Deepgram TTS and Blockade Labs skyboxes. https://devfolio.co/projects/onlygains-81d7
- **ClawMon** (Prosperia): a staked trust and reputation layer for agent skills on ClawHub/MCP. It uses ERC-8004 agent identity, x402-paid invocations, sybil detection and TEE attestations, and stakes MON. https://devfolio.co/projects/clawmon-a534

---

## W3 — Colosseum Solana Cypherpunk Hackathon

- **Official name / dates:** Solana Cypherpunk Hackathon (Colosseum). Online, fall 2025 (Sep–Oct build period; exact dates not verified); winners announced Dec 2025.
- **Size:** 9,000+ participants from 150+ countries and 1,576 final projects. Colosseum called it "the largest crypto hackathon to date".
- **Prize structure:**
  - Grand Champion: $30k USDC.
  - First place in each of six tracks: $25k USDC. The tracks are Consumer, DeFi, Infrastructure, RWA, Stablecoins and "Undefined".
  - Places 2–5 in each track also receive prizes.
  - University Award and Public Goods Award: $10k each.
  -
- **Winners source:** https://blog.colosseum.com/announcing-the-winners-of-the-solana-cypherpunk-hackathon/
- **Data caveat:** The Arena pages are short, and several winners publish only a one-paragraph description plus videos. The mechanisms below go only as deep as those pages and the repos they link.

### W3-1 — Unruggable
- **Prize(s):** Grand Champion ($30k)
- **Source:** https://colosseum.com/arena/projects/explore/unruggable-3 (code: github.com/hogyzen12/unruggable-app)
- **Pitch:** A Solana-native hardware wallet and companion app.
- **Problem:** Multi-chain hardware wallets treat Solana as an afterthought, so users must choose between hot-wallet UX and cold-wallet security.
- **How it works:**
  - A dedicated signing device plus a cross-platform app, with setup in under 30 seconds.
  - Swap, stake, lend, earn and send run directly from the device. Native integrations include Jupiter (Lend and Swap), Jito, Squads multisig, Titan, Anza Confidential Transfers, SNS, DeFi Carrot and Privacy Cash.
  - Fully open source.
- **Tech stack:** Rust (app and firmware), custom hardware, Solana.
- **External APIs:**
  - Jupiter API — FREE
  - Solana RPC — FREE-TIER
  - Other protocol SDKs — FREE/OPEN-SOURCE
  - Hardware BOM — PAID
- **Why it likely won:** Hardware plus software shipped as a real product, and it fits the "cypherpunk" self-custody theme exactly. It integrates the ecosystem's key protocols.
- **Core primitive:** *A chain-native hardware signer with first-class DeFi actions, i.e. cold-key security with hot-wallet UX.*

### W3-2 — Capitola
- **Prize(s):** Consumer track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/capitola
- **Pitch:** A prediction-markets meta-aggregator: trade any event at the best price.
- **Problem:** Event contracts are split across many venues, each with its own prices and liquidity.
- **How it works:** It aggregates markets from multiple prediction-market venues into one interface and routes each trade to the best price. The Arena page gives no implementation detail beyond this.
- **Tech stack:** Solana; the rest is not published on the Arena page (repo "capitola-app").
- **External APIs:** Prediction-market venue APIs (e.g. Polymarket, Kalshi) — FREE (exact venues unverified).
- **Why it likely won:** Consumer-friendly UX on the hottest category of the cycle.
- **Core primitive:** *A best-price router across fragmented event markets.* This is the same primitive as W1-3 and W2-6.

### W3-3 — Yumi Finance
- **Prize(s):** DeFi track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/yumi-finance
- **Pitch:** Fully on-chain Buy Now, Pay Later, covering underwriting, financing, origination and servicing.
- **Problem:** Merchants and businesses lack crypto-native credit rails, and consumers and SMBs lack flexible payment terms.
- **How it works:**
  - A merchant/crypto-gateway SDK offers BNPL at checkout. Yumi underwrites and takes the counterparty risk.
  - Loans are originated and serviced on-chain and settled in stablecoins.
  - Other pieces: B2B BNPL, card issuance backed by on-chain credit, and an interoperable on-chain credit-profile data layer.
- **Tech stack:** Solana programs, stablecoins, merchant SDK (team based in South Korea).
- **External APIs:** Solana RPC — FREE-TIER. Card-issuing partner — PAID (planned).
- **Why it likely won:** It brings a huge TradFi category on-chain with a full credit lifecycle rather than just a lending pool.
- **Core primitive:** *A portable on-chain credit profile plus underwriting that any merchant checkout can call.*

### W3-4 — Seer
- **Prize(s):** Infrastructure track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/seer (code: https://github.com/VasilyGerrans/seer)
- **Pitch:** "Tenderly for Solana": full function- and line-level transaction traces.
- **Problem:** Solana developers debug by reading raw logs and error codes, with no source mapping.
- **How it works:** Seer replays a transaction and maps execution back to source code. It shows the function and line trace, standard program logs, and local variable values at chosen execution points. The proof of concept is designed to become framework-agnostic.
- **Tech stack:** Rust / Solana runtime tooling, source mapping, web UI.
- **External APIs:** Solana RPC — FREE-TIER.
- **Why it likely won:** It solves a universal developer pain, and judges from the ecosystem feel that pain themselves.
- **Core primitive:** *Execution-trace replay with source-level mapping for a blockchain VM.*

### W3-5 — Autonom
- **Prize(s):** RWA track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/autonom-unleashing-rwas-in-solana (code: https://github.com/ElementalBrian/autonom)
- **Pitch:** An RWA-specialized oracle that makes tokenized equities safe to use in perps and lending.
- **Problem:** Price oracles ignore corporate actions (splits, dividends, M&A) and account context, so venues cap leverage very low or refuse RWAs altogether.
- **How it works:** It has three modules:
  - A corporate-action oracle that adjusts prices dynamically on-chain.
  - A funding-rate service for RWA perpetuals.
  - A risk module that recommends deleveraging or rebalancing around known risk windows such as earnings.
- **Tech stack:** Solana programs, oracle off-chain workers.
- **External APIs:** Equity price and corporate-action data feeds — PAID (typically; the specific provider is not stated).
- **Why it likely won:** It unblocks the RWA-perps narrative with a specific, overlooked technical gap.
- **Core primitive:** *An event-aware oracle that publishes corporate-action-adjusted prices plus risk-window signals.*

### W3-6 — MCPay
- **Prize(s):** Stablecoins track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/mcpay (code: https://github.com/microchipgnu/MCPay)
- **Pitch:** Charge for MCP tools, data sources and agent capabilities with x402 pay-per-call.
- **Problem:** MCP servers have no native way to monetize, and subscriptions do not fit autonomous agents.
- **How it works:**
  - An MCP client calls through the MCPay proxy. If the upstream returns HTTP 402 with pricing, the proxy either pays on-chain in USDC or EUROe (if authorized) or hands the payment to the client.
  - The request is then retried and streamed back, and usage and revenue events feed dashboards.
  - It also ships a registry of paid MCP servers, a "Monetizer" wrapper and a CLI (`mcpay connect`).
- **Tech stack:** TypeScript, Hono, x402, MCP SDK. Chains: Solana plus EVM (Base, Avalanche, IoTeX, Sei).
- **External APIs:**
  - x402 facilitator — FREE
  - USDC — FREE (on-chain)
  - Chain RPCs — FREE-TIER
- **Why it likely won:** Stablecoins as agent payment rails was the breakout 2025–26 theme, and this is open infrastructure that others can adopt immediately.
- **Core primitive:** *A paywall proxy that turns any MCP tool or API into a pay-per-call endpoint an agent can pay for by itself.*

### W3-7 — attn.markets
- **Prize(s):** "Undefined" track 1st place ($25k)
- **Source:** https://colosseum.com/arena/projects/explore/attn.markets (code: https://github.com/twentyOne2x/attnmarkets)
- **Pitch:** Tokenize on-chain revenue streams to give builders, DAOs and creators banking-style services.
- **Problem:** Solana apps earn ~$1.72B a year and Pump.fun creator rewards come to ~$300M, yet that revenue cannot be borrowed against or financed.
- **How it works:**
  - Revenue flows are routed into a Squads 2-of-2 multisig (user plus protocol). The user keeps sole withdrawal control whenever no position is open.
  - The tokenized cash flows back cash advances, loans, bonds, savings accounts (4–6% APR on stables and LSTs) and credit lines.
  - LPs earn yield that is uncorrelated with crypto prices.
- **Tech stack:** Solana, Squads multisig (live on devnet), tokenized revenue claims.
- **External APIs:** Squads Protocol — FREE/OPEN-SOURCE. Solana RPC — FREE-TIER.
- **Why it likely won:** A new asset class (on-chain revenue) turned into credit, with a pragmatic custody design.
- **Core primitive:** *Revenue-based financing enforced by shared multisig control of the income stream.*

### W3-8 — Samui Wallet
- **Prize(s):** Public Goods Award ($10k)
- **Source:** https://colosseum.com/arena/projects/explore/samui-wallet (code: https://github.com/samui-build/samui-wallet)
- **Pitch:** An open-source developer wallet and toolbox for Solana.
- **Problem:** Consumer wallets are closed-source and lack dev tooling, so developers constantly switch between clusters, keypairs and explorers.
- **How it works:** A web wallet built for devnet and localnet first. It offers fast keypair and cluster switching, built-in airdrops, token and NFT creation, and detailed in-wallet transaction views. The architecture is extensible, and an extension, CLI, mobile and desktop versions are planned.
- **Tech stack:** TypeScript web app, Solana web3 libraries.
- **External APIs:** Solana RPC — FREE-TIER.
- **Why it likely won:** A textbook public good with auditability and developer-productivity gains.
- **Core primitive:** *A developer-mode wallet: keys, network switching and asset minting as one embeddable toolbox.*

*Not detailed:* Pythia (University Award, $10k) — https://colosseum.com/arena/projects/explore/pythia

---

## W4 — Built with Opus 4.7: a Claude Code Hackathon (Anthropic × Cerebral Valley)

- **Official name / dates:** "Built with Opus 4.7: a Claude Code hackathon". Virtual, with the build week starting Apr 21, 2026 according to the Cerebral Valley gallery. Winners were announced on Anthropic's blog. One secondary source dates the announcement June 15, 2026; I could not reconcile this and treat it as unverified.
- **Size:** 20,000+ applicants; 500 builders selected, each given $500 in Claude API credits; 288 projects in the gallery; 9 finalists.
- **Prize structure:** 1st, 2nd and 3rd place (2nd included $30k in Claude credits), plus special prizes: "Most Creative Opus 4.7 Exploration", the "Keep Thinking" prize and "Best Use of Claude Managed Agents". The total credit pool was ~$100k.
- **Sources:**
  - https://claude.com/blog/meet-the-winners-of-built-with-opus-4-7-claude-code-hackathon
  - https://cerebralvalley.ai/e/built-with-4-7-hackathon/hackathon/gallery
  - https://www.edtechinnovationhub.com/news/a-doctor-a-carpenter-and-a-teacher-win-anthropics-global-opus-47-hackathon
- **Theme observed:** "Domain experts" (a doctor, a repair technician, a teacher, a carpenter's son) won by encoding their own expertise into agentic apps.

### W4-1 — MedKit
- **Prize(s):** 1st Place
- **Source:** Anthropic winners blog (above); Cerebral Valley gallery finalist
- **Pitch:** A voice-first clinical simulator where medical students interview AI patients, order labs and make diagnoses, then get graded.
- **Problem:** Medical students get too little safe practice at history-taking and clinical reasoning before meeting real patients.
- **How it works:**
  - Students speak with a simulated patient, order lab tests and commit to a diagnosis.
  - Their reasoning is scored against published clinical guidelines.
  - It is built as four parallel Claude Code workstreams (voice engine, case-content generation, a 3D game layer and the core app) and uses Claude Managed Agents for patient encounters.
- **Tech stack:** Claude Opus 4.7, Claude Managed Agents, voice pipeline (STT/TTS), 3D game layer.
- **External APIs:**
  - Anthropic API — PAID (hackathon credits)
  - Voice STT/TTS provider — PAID/FREE-TIER (provider unspecified)
- **Why it likely won:** A builder with deep domain expertise (a physician turned engineer), an immediately understandable high-stakes use case, and real traction (three medical faculties plus a pharma company piloting).
- **Core primitive:** *A voice role-play simulator whose AI persona is graded against an authoritative rubric (guidelines), usable for any "practice before the real thing" training.*

### W4-2 — Wrench Board
- **Prize(s):** 2nd Place ($30k Claude credits)
- **Source:** Anthropic winners blog; https://www.edtechinnovationhub.com/news/a-doctor-a-carpenter-and-a-teacher-win-anthropics-global-opus-47-hackathon
- **Pitch:** An AI diagnostic workbench for board-level electronics repair.
- **Problem:** Micro-soldering diagnosis needs senior-technician expertise, so small repair shops scrap fixable boards, which adds to e-waste.
- **How it works:**
  - The user drops in a schematic and a boardview and describes the symptoms. Opus 4.7's vision builds a unified electrical graph of the board.
  - The agent reasons over the graph and points to the exact pad to probe. It reads back the measured values and updates its hypotheses until the fault is found.
  - It produces step-by-step overlays on the board. Specs were written in Claude Design, and debugging ran 5–6 parallel Claude Code agents.
- **Tech stack:** Claude Opus 4.7 (vision/spatial), Claude Code multi-agent, schematic and boardview parsing.
- **External APIs:** Anthropic API — PAID.
- **Why it likely won:** A human-in-the-loop measurement cycle (agent asks, human probes, agent updates) is a genuinely new workflow, and the right-to-repair and e-waste angle adds impact.
- **Core primitive:** *Vision to structured graph from technical drawings, plus hypothesis-driven "tell me what to measure next" diagnostic loops.*

### W4-3 — Maieutic
- **Prize(s):** 3rd Place
- **Source:** Anthropic winners blog; https://maieutic.dev
- **Pitch:** A Python IDE for learners that makes you explain and spec before it lets you code.
- **Problem:** AI autocomplete lets students ship code they do not understand.
- **How it works:**
  - The editor stays locked until the student writes a detailed spec, and autocomplete is disabled.
  - Claude asks clarifying Socratic counter-questions instead of giving fixes.
  - "Intent-Diff Review" compares the finished code against the stated spec.
  - A live instructor dashboard analyzes misconception patterns across the cohort.
- **Tech stack:** Web Python IDE, Claude (pedagogical chat and evaluation), instructor analytics dashboard.
- **External APIs:** Anthropic API — PAID.
- **Why it likely won:** A contrarian design (AI that withholds answers) grounded in pedagogy research. The builder is a CS PhD student and teacher.
- **Core primitive:** *Intent-diff review: an LLM checks an artifact against the author's own prior written specification.*

### W4-4 — Virtual Puppet Theater
- **Prize(s):** Most Creative Opus 4.7 Exploration
- **Source:** Anthropic winners blog; Cerebral Valley gallery (finalist "rhmoller")
- **Pitch:** A browser puppet show you perform with your hands and voice. Props appear when you describe them, and an AI companion puppet talks back.
- **Problem:** Creative, playful interactive play (for kids and storytellers) that needs no hardware.
- **How it works:**
  - MediaPipe hand tracking (WASM) drives Three.js puppets at 60 fps.
  - Speech goes over WebSocket to the Anthropic SDK. Claude generates dialogue and spawns props, and ElevenLabs voices the companion (Web Speech API as fallback).
  - Opus 4.7's spatial reasoning checks the scene layout through a screenshot feedback loop.
- **Tech stack:** Bun, Vite, TypeScript, MediaPipe, Three.js, WebSocket, Anthropic SDK, ElevenLabs. MIT-licensed.
- **External APIs:**
  - Anthropic API — PAID
  - ElevenLabs — FREE-TIER/PAID
  - MediaPipe — FREE/OPEN-SOURCE
- **Why it likely won:** A delightful live demo and a creative use of the model's visual self-checking.
- **Core primitive:** *A screenshot-feedback loop that lets an LLM verify and correct its own spatial or visual output.*

### W4-5 — MaestrIA
- **Prize(s):** "Keep Thinking" Prize
- **Source:** Anthropic winners blog; Cerebral Valley gallery finalist
- **Pitch:** Photograph home or heritage damage, get a master-carpenter-level diagnosis and local parts prices, and get a WhatsApp message drafted to a tradesperson.
- **Problem:** Homeowners cannot diagnose repairs or scope them, and trades expertise is scarce and hard to reach.
- **How it works:**
  - Streaming vision reasoning draws animated bounding boxes on the photo.
  - A single JSON "expertise file" (17 diagnostic rules, 7 native woods, 16 trade dialect terms, 19 benchmark prices) lifted agreement with a human master from 74% to 81% on the team's eval.
  - Agents price parts at local stores and draft the WhatsApp brief. Security basics were in place from day one: sanitization, rate limiting and Zod schemas.
- **Tech stack:** Claude Opus 4.7 (vision), Claude agents, Zod, WhatsApp message generation.
- **External APIs:**
  - Anthropic API — PAID
  - Local store price lookup — FREE (scraping/search)
  - WhatsApp deep links — FREE
- **Why it likely won:** Rigorous evals-driven iteration from a self-taught builder, with a real pilot at his father's carpentry business.
- **Core primitive:** *A compact expert-knowledge file injected into a vision agent, measured against a human expert baseline.*

### W4-6 — ARIA (team TrayStones)
- **Prize(s):** Best Use of Claude Managed Agents
- **Source:** Anthropic winners blog; Cerebral Valley gallery finalist "TrayStones (ARIA)"
- **Pitch:** Predictive maintenance that turns factory sensor signals and manuals into ready-to-execute work orders.
- **Problem:** Unplanned equipment failures are costly, and floor-operator knowledge is never captured.
- **How it works:**
  - Onboarding profiles a plant in 15 minutes using four calibration questions and ingests manufacturer PDFs.
  - Five parallel agents monitor live signals through 17 shared tools. They compute real-time degradation rates in Managed Agents' sandboxed Python.
  - Output is a work order: the component, failure mode, urgency, parts list and intervention window.
- **Tech stack:** Claude Managed Agents (sandboxed Python, session persistence, MCP), Claude Code (~80% of the code), multi-agent tool layer.
- **External APIs:**
  - Anthropic API / Managed Agents — PAID
  - IoT signal source — FREE (simulated/own)
- **Why it likely won:** The most complete use of the sponsor's new platform feature, with industrial buyers already interested.
- **Core primitive:** *A multi-agent signal monitor that turns time-series data plus manuals into structured, actionable tickets.*

### W4-7 — OmniBridge
- **Prize(s):** Finalist
- **Source:** https://cerebralvalley.ai/e/built-with-4-7-hackathon/hackathon/gallery/51 (code: github.com/adindamochamad/omnibridge)
- **Pitch:** An AI agent that reverse-engineers unknown serial device protocols by itself.
- **Problem:** Integrating legacy hardware (1980s scales, Modbus PLCs, sensors) takes a median of ~18 hours per device of manual protocol analysis.
- **How it works:**
  - A multi-turn Opus 4.7 agent with six tools analyzes binary streams, checks framing and validates CRC16.
  - It then generates a local extractor (regex for ASCII or byte-offset parsers for binary) that runs at high throughput with no further API calls.
  - Prompt caching (~65% hit rate) keeps identification to about $0.20 per device.
- **Tech stack:** Claude Opus 4.7, tool use with preserved reasoning, prompt caching, native macOS app. MIT-licensed.
- **External APIs:** Anthropic API — PAID (about $0.20 per device).
- **Why it likely won:** A massive time saving (about 18 hours down to about 5 minutes), and an "LLM once, deterministic code forever" design.
- **Core primitive:** *An LLM infers the format of an unknown data stream and emits a zero-cost local parser.*

### W4-8 — Mobius
- **Prize(s):** Finalist
- **Source:** https://cerebralvalley.ai/e/built-with-4-7-hackathon/hackathon/gallery/273 (code: https://github.com/leventilo/mobius)
- **Pitch:** Drop in a physics paper PDF and get back an interactive simulator validated against the paper's own figures.
- **Problem:** Papers are static, so reproducing results and building intuition takes weeks.
- **How it works:**
  - Opus 4.7 orchestrates nine skills across seven phases. Paper-parser, physics-interpreter and claim-extractor run in parallel and produce a typed SimSpec.
  - It generates Python (NumPy, SciPy, SymPy) that runs in the Managed Agents sandbox and streams a live solver over SSE, driven by sliders.
  - Eight integrity checks run: units, CFL stability, conservation residual, claim match, and vision-based figure diff among them.
  - A run takes about 25 minutes per PDF.
- **Tech stack:** Claude Opus 4.7, Managed Agents Python runtime, NumPy/SciPy/SymPy, SSE, vision.
- **External APIs:** Anthropic API — PAID.
- **Why it likely won:** Rigorous self-verification (the output is checked against the source's own figures) on an ambitious science-communication task.
- **Core primitive:** *Document to executable model, verified by an automated reproduction check against the document's claims and figures.*

*Other finalist:* an interior-design tool for French office architects by Saad El Babidi (limited detail).

---

## W5 — GitLab AI Hackathon 2026 (with Google Cloud and Anthropic)

- **Official name / dates:** GitLab AI Hackathon. Run on Devpost, Feb 9 – Mar 25, 2026.
- **Size:** ~7,000 developers; 600+ agents and flows submitted; 19 judges over 18 days.
- **Prize / track structure:** $65k total.
  - Grand Prize.
  - "Most Impactful on GitLab & Google" grand prize and runner-up.
  - "Most Impactful on GitLab & Anthropic" grand prize and runner-up.
  - Category prizes: Most Technically Impressive, Most Impactful and Easiest to Use.
  - Green Agent Prize, Sustainable Design bonuses and honorable mentions.
  - All entries had to build on the GitLab Duo Agent Platform (custom agents, flows and the AI Catalog).
- **Sources:** https://about.gitlab.com/blog/gitlab-ai-hackathon-2026-meet-the-winners/ and gallery https://gitlab.devpost.com/project-gallery

### W5-1 — LORE (Living Organizational Record Engine)
- **Prize(s):** Grand Prize
- **Source:** https://devpost.com/software/lore-living-organizational-record-engine
- **Pitch:** Institutional memory for codebases: capture architectural decisions and enforce them on every MR.
- **Problem:** Decisions such as "never cache auth responses" get buried in MR threads or leave with engineers, so teams repeat past mistakes.
- **How it works:** Eight Claude-powered agents fire at different lifecycle events:
  - **Pre-Mortem** (on issue creation): mines history to predict failures and writes a spec.
  - **MR Review:** a five-layer check covering memory conflicts, promise verification, security, code intelligence and patterns.
  - **Decision Extractor** (on merge): records the decisions made.
  - **Health Auditor:** dashboard with carbon metrics.
  - **Onboarding:** briefings for new team members.
  - **Others:** a follow-up evaluator, a reply handler and a commit keeper.

  Semantic equivalence detection recognizes that "in-memory dict cache" is the same as "Redis cache". Memory evolves: overriding a decision triggers re-validation.
- **Tech stack:** GitLab Duo Agent Platform, Claude, Python `lore-cli`, Mermaid.js, GitLab Pages / CI, pytest (43 tests).
- **External APIs:**
  - Anthropic Claude (via GitLab AI Gateway) — PAID
  - GitLab — FREE-TIER
- **Why it likely won:** A universal pain, a lifecycle-spanning multi-agent design with loop prevention, a polished dashboard and testing discipline.
- **Core primitive:** *Decision memory: extract decisions from work artifacts and semantically enforce them on future changes.*

### W5-2 — Gitdefender
- **Prize(s):** Most Impactful on GitLab & Google — Grand Prize
- **Source:** https://devpost.com/software/gitdefender
- **Pitch:** AI-powered MR triage that protects open-source maintainers from floods of AI-generated merge requests.
- **Problem:** Plausible-looking but broken AI-written MRs overwhelm maintainers, and skimming a diff does not reveal what the code actually does.
- **How it works:**
  - A GitLab flow chains five agents. Four extract semantic features from diffs and the codebase; the fifth aggregates 58 features in 6 categories (code quality, AI fingerprints, commit and description signals, architectural fit, metadata, author reputation), posts a review with a test plan and stores the feature vector.
  - An Adaptive Random Forest (River, online learning) on Cloud Run scores each MR. It was pre-trained on 896 real MRs and updates on every merge or close.
  - A VS Code agent guides the maintainer through review and testing.
- **Tech stack:** Python, FastAPI, River, GitLab Duo Agent Platform, GitLab GraphQL, Claude (AI Gateway), Google Cloud Run, Cloud SQL, Terraform, Docker.
- **External APIs:**
  - Google Cloud Run / Cloud SQL — FREE-TIER/PAID
  - Claude — PAID
  - GitLab API — FREE
- **Why it likely won:** A timely problem (AI slop in open source), a hybrid LLM-features-to-online-ML design, and a real cloud deployment.
- **Core primitive:** *LLM feature extraction feeding an online-learning classifier that improves from human accept or reject decisions.*

### W5-3 — Aegis
- **Prize(s):** Most Impactful on GitLab & Google — Runner Up
- **Source:** https://devpost.com/software/aegis-2m1oq0
- **Pitch:** Seven autonomous agents that secure, predict and score releases, producing a Release Confidence Score from 0 to 100.
- **Problem:** DORA 2025 found that AI-assisted teams ship faster but fail more pipelines, and existing tools need manual invocation.
- **How it works:**
  - Event-triggered agents (on pipeline events, reviewer assignment or mentions):
    - Security Sentinel: finds secrets, SQL injection and unsafe patterns, and opens fix MRs.
    - Pipeline Oracle: predicts CI failures with XGBoost (claimed AUC 0.999).
    - Smart Reviewer: uses the Blame API to pick code owners.
    - Compliance Guardian: enforces approvals and audit requirements.
    - Dependency Guardian: scans transitive dependencies for CVEs.
    - Claude Deep Analyzer: reviews full release diffs for architectural risk.
    - Release Risk Advisor: aggregates everything into the final score.
  - SHAP explanations are fed to Claude as structured context. Python AST analysis computes the multi-hop blast radius.
- **Tech stack:** GitLab Duo flows, Claude, XGBoost, SHAP, scikit-learn, FastAPI, React / Vite / Tailwind, Google Cloud (BigQuery, Vertex AI, GKE Autopilot, Pub/Sub, Vector Search), Terraform.
- **External APIs:**
  - Google Cloud services — PAID/FREE-TIER
  - Claude — PAID
  - GitLab APIs — FREE
- **Why it likely won:** Heavy use of the sponsor's cloud, explainable ML paired with an LLM, and graceful degradation.
- **Core primitive:** *A SHAP-to-LLM reasoning chain: classical ML predictions explained in natural language with feature attributions.*

### W5-4 — GraphDev
- **Prize(s):** Most Impactful on GitLab & Anthropic — Grand Prize
- **Source:** https://devpost.com/software/graphdev (demo: https://graphdev-demo.fly.dev)
- **Pitch:** Turn a codebase into a semantic 3D graph and show every PR's ripple effect.
- **Problem:** Reviewers see changed lines, not the downstream components and subsystems a change affects.
- **How it works:**
  - tree-sitter parses TS/Next.js code into units and dependencies. An LLM writes a description for each unit, and embeddings are clustered with HDBSCAN into subsystems and laid out with UMAP.
  - A Three.js view colors changed nodes red, ripple-affected nodes yellow and the rest dimmed.
  - A GitLab agent answers impact questions in Duo Chat, and an MR flow posts risk-scored impact comments.
- **Tech stack:** FastAPI, SQLite, tree-sitter, Next.js, Three.js, shadcn/Tailwind/Zustand, HDBSCAN, UMAP, Fly.io, GitLab Duo Agent Platform.
- **External APIs:**
  - Claude — PAID
  - OpenAI embeddings and descriptions — PAID
  - Fly.io — FREE-TIER/PAID
- **Why it likely won:** A striking visual demo, a clear reviewer benefit, and alignment with GitLab's own knowledge-graph roadmap.
- **Core primitive:** *A semantic code graph with change-impact propagation (blast-radius analysis).*

### W5-5 — DocSync
- **Prize(s):** Most Impactful on GitLab & Anthropic — Runner Up
- **Source:** https://devpost.com/software/pipeheal
- **Pitch:** Automatically detect and fix documentation that code changes made stale.
- **Problem:** 50–70% of internal docs go stale within six months, and no CI check enforces freshness.
- **How it works:** A three-agent pipeline passes JSON schemas through GitLab's `context:{agent}.final_answer`, which limits hallucination propagation:
  - **Detector** (14 read-only tools) classifies drift as contradiction, omission, stale example, stale reference or version mismatch, with a confidence score.
  - **Writer** (16 tools) opens a docs-only fix MR when confidence is at least 0.5, and otherwise opens an issue for a human.
  - **Reviewer** (12 tools) independently checks the fix against the source code.
- **Tech stack:** GitLab Duo Flows, Claude, Node.js / Express.
- **External APIs:** Claude — PAID. GitLab API — FREE.
- **Why it likely won:** Simple, trustworthy agent choreography with confidence gating and an independent verifier.
- **Core primitive:** *A detect-write-review agent triad with a confidence threshold for autonomous action versus human escalation.*

### W5-6 — Time-Traveler
- **Prize(s):** Most Technically Impressive
- **Source:** https://devpost.com/software/time-traveler-w3cxp0
- **Pitch:** Preview risky database migrations on disposable production-like clones, driven entirely from GitLab Duo Chat.
- **Problem:** A migration such as adding a `NOT NULL` column can lock millions of rows, and small teams have no staging environment.
- **How it works:**
  - Eight agents chain Shadow Architect, Auditor, Data Smith, SRE Monitor and Smoke Tester.
  - The auditor scores risk with a penalty model (DROP −3, NOT NULL without DEFAULT −2 and so on; a score under 5 means "DO NOT DEPLOY") and writes rollback SQL.
  - Data Smith synthesizes realistic test data. A FastAPI "MCP bridge" on a GCP VM spins up an isolated Docker stack (Postgres, API, Nginx) in about 90 seconds, runs smoke tests, then tears the stack down and reports the RAM and CO₂ saved.
- **Tech stack:** Python, FastAPI, PostgreSQL, Docker SDK, GCP VMs, GitLab Duo Agent Platform / Chat / AI Catalog.
- **External APIs:**
  - Google Cloud Compute — PAID/FREE-TIER
  - GitLab Duo (Claude) — PAID
- **Why it likely won:** Real infrastructure is created and destroyed end to end in the demo, and the agents take actions rather than just giving advice.
- **Core primitive:** *Ephemeral shadow environments spun up by agents to test a risky change before it touches production.*

### W5-7 — RedAgent
- **Prize(s):** Most Impactful
- **Source:** https://devpost.com/software/redagent
- **Pitch:** Adversarial red-teaming for AI agents: intercept tool calls and let Claude craft realistic attacks automatically.
- **Problem:** Agent developers test only the happy path. Prompt injection, false data, state corruption and privilege escalation reach production.
- **How it works:**
  - The decorators `@redAgent.query` and `@redAgent.mutation` wrap tool functions. RedAgent runs the real call, and Claude decides whether to return the genuine result or a crafted adversarial variant.
  - A Mocking Agent keeps the world state consistent across turns. An Analyzer and a Reporter publish findings.
  - It runs in CI on MRs (`REDAGENT_MODE=ON`) or when mentioned in issues.
- **Tech stack:** Python, TypeScript, Claude Sonnet 4, python-gitlab, SQLite, GitLab CI/CD, AI Catalog agents.
- **External APIs:** Claude — PAID. GitLab API — FREE.
- **Why it likely won:** Agent security is a fast-growing concern, and this has a drop-in developer experience (two decorators).
- **Core primitive:** *A tool-call interception layer that injects LLM-generated adversarial responses to fuzz agents.*

### W5-8 — Launch Control
- **Prize(s):** Easiest to Use
- **Source:** https://devpost.com/software/launch-control-bgp8az (dashboard: launch-control-six.vercel.app)
- **Pitch:** An AI release gate that returns GO, NEEDS_REVIEW or BLOCK verdicts from policy-as-code.
- **Problem:** "Release decisions shouldn't depend on who remembers the checklist."
- **How it works:**
  - Four agents (Planner, Security Analyst, Compliance Analyst, Release Coordinator), each limited to five GitLab tools, run in sequence.
  - An 11-factor weighted score defined in YAML policy files (≤24 GO, 25–59 NEEDS_REVIEW, ≥60 BLOCK) is combined with hard blockers (failed pipeline, critical CVE, missing approvals).
  - Verdicts are posted as MR notes with evidence, and remediation issues are opened automatically.
- **Tech stack:** GitLab Duo Flows (Claude), Express / Node / TypeScript, React 19, Vite, Framer Motion, Zod, YAML policies, Vercel.
- **External APIs:**
  - GitLab Duo (Claude) — PAID
  - GitLab API — FREE
  - Vercel — FREE-TIER
- **Why it likely won:** A polished UX, and policies can be changed without redeploying. Each agent's tool access is tightly scoped.
- **Core primitive:** *A policy-as-code risk gate: an LLM gathers evidence, a deterministic weighted score decides, and hard blockers override.*

*Other GitLab winners:* GreenPipe (Green Agent Prize: CI/CD carbon-footprint reports); BugFlow, DELTA Cyber Reasoning, CarbonLint and TFGuardian (Sustainable Design bonuses). Honorable mentions: SecurityMonkey, stregent, Compliance Sentinel, Carbon Tracker, RepoWarden and MR Compliance Auditor.

---

## Cluster-level analysis

- **Agents that pay and get paid were the defining 2026 pattern.** x402 micropayments show up across the crypto winners:
  - MCPay (W3-6) monetizes MCP tools.
  - Umbra Gateway (W2-1) pays per RPC request anonymously.
  - ParlayVoo (W2-5) and Clean Slate Agent (W2-8) run agents that fund their own gas and operations from fees.
  - ClawMon adds staked trust scoring to agent skills.

  Judges rewarded *self-sustaining* agents over agents that are only called by humans.
- **Prediction-market aggregation won at all three crypto events** (PolyBet W1-3, EventGraph W2-6, Capitola W3-2). The shared primitive is LLM-based entity resolution of the same event across venues, plus best-price routing. This is a crowded idea, so the winners differentiated with confidential compute (TEEs) or live data quality.
- **Privacy was the top web3 theme, done with standards rather than new cryptography.** Winners used stealth addresses (ERC-5564), ZK attribute proofs (Self), blobs, Tor, TEEs (Oasis ROFL) and ledger-level sub-transaction privacy (Canton). The winning move was applying an existing privacy primitive to a very concrete, relatable leak: POAP location, period data, RPC metadata, criminal records.
- **Domain experts beat generalists in the AI hackathons.** The Opus 4.7 podium (a physician, a repair technician, a CS teacher) and MaestrIA won by encoding tacit expertise into agent tools, rules files and rubrics, and by showing eval numbers (74% to 81%) or real pilots. "Who is the user, and do you have real ones?" mattered as much as the tech.
- **"LLM once, deterministic forever" is a recurring cost pattern.** ChainCraft compiles games to deterministic code; OmniBridge emits local parsers; Launch Control keeps final decisions in a YAML-weighted score. Judges favored designs that bound inference cost and make outcomes reproducible.
- **Multi-agent choreography with verification is table stakes in enterprise AI.** GitLab winners all used 3–8 specialized agents with scoped tools, JSON handoffs, confidence thresholds, independent reviewer agents and hard human gates. Hybrid ML (XGBoost, online Random Forest, HDBSCAN) with an LLM explanation layer won the technical categories.
- **Self-verification against ground truth impresses judges.** Mobius diffs its output against the paper's figures, Wrench Board updates from real probe measurements, and MedKit grades against clinical guidelines. Showing the agent checks itself was a strong differentiator.
- **Common tech:** Claude (Opus 4.7 / Sonnet 4) was the most-cited LLM, especially for coding and agent reasoning. The rest of the common stack:
  - **Web frontends:** Next.js / React / Tailwind.
  - **Backends:** FastAPI / Hono / Express.
  - **Web3 plumbing:** Privy for onboarding; Base, Solana and Hedera as chains; 0G and Oasis for AI and confidential compute.
  - **Cloud:** Google Cloud for enterprise.

  Nearly all top teams used AI coding agents (Claude Code, Cursor) to build.
