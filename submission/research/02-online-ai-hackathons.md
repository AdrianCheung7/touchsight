# Cluster A: Large Online / AI & Devtool Hackathons (2025–2026)

Research date: 2026-09-25. Project IDs: `A<hackathon#>-<project#>`.

## Hackathons covered

| # | Hackathon | Dates | Size | Notes |
|---|---|---|---|---|
| A1 | Bolt.new "World's Largest Hackathon" | May 30 – Jun 30, 2025 | ~130,000 registered (128,327 on Devpost); $1M+ prizes | As assigned |
| A2 | Microsoft AI Agents Hackathon 2025 | Apr 8 – 30, 2025 | 18,000+ registered; 570 submissions | As assigned |
| A3 | Google DeepMind **Gemini 3 Hackathon** (Devpost) | Dec 17, 2025 – Feb 9, 2026 (winners announced ~Apr 2026) | 35,522 registered; 4,500+ submissions; $100K | **Substitution** for the Google ADK Hackathon (see note) |
| A4 | Kaggle "Google – The Gemma 3n Impact Challenge" | Launched late Jun 2025; submissions closed ~early Aug 2025; winners announced Dec 2025 | 600+ submissions; $150K | As assigned |
| A5 | NASA International Space Apps Challenge 2025 | Oct 4 – 5, 2025 (winners Dec 18, 2025) | 114,000+ participants, 18,860 teams, 11,500+ submissions, 551 events, 167 countries/territories | As assigned |

**Substitution note:** the Google ADK Hackathon (2025) was verified. It had 10,400+ participants and 477 submissions, the smallest of the six candidates. It was replaced by the Gemini 3 Hackathon: a 2026 event, about 3.5x as many registrants, about 10x as many submissions, and published winners. The ADK winner list is still included as a short appendix because it was verified.

---

## A1. Bolt.new — World's Largest Hackathon (2025)

- **Official name:** World's Largest Hackathon presented by Bolt
- **Dates:** May 30 – June 30, 2025 (online). Winners were announced at live parties in SF, NYC, Toronto, Boston, Seattle, Manchester and Lisbon.
- **Size:** about 130,000 builders registered (Bolt blog), 128,327 on Devpost. More than $1M in prizes. Grand prize was $100K.
- **Track structure:** Top 10 overall places ($10K–$100K cash plus AWS credits). Regional awards (3 each for AMER/APAC/EMEA). $25K sponsor challenges: Make More Money (RevenueCat), Custom Domain (Entri/IONOS), Blockchain (Algorand), Conversational AI Video (Tavus), Voice AI (ElevenLabs), Deploy (Netlify), Silly Sh!t (Reddit), Startup (Supabase). Also bonus prizes and "One-Shot" awards. The app had to be built with Bolt.new.
- **Judging:** potential impact, idea quality, technical implementation, design/UX.
- **Sources:** https://bolt.new/blog/2025-bolt-hackathon-winners · https://bolt.new/winners · https://worldslargesthackathon.devpost.com/

### A1-1. Tailored Labs
- **Prize:** Grand Prize (1st, $100K) | https://devpost.com/software/civilink
- **Pitch:** A conversational video editor: describe the edit and get a finished timeline.
- **Problem:** Editing raw footage (finding clips, cutting bad takes and dead air, arranging) takes hours of manual work.
- **How it works:** Agentic workflows on AWS Lambda analyze uploaded clips and index them in a searchable media library, removing bad takes and filler. Natural-language commands ("remove the second clip", "add a 3-second title") change a timeline that also supports drag-and-drop. A "one-shot" mode builds a full edit from raw clips. Final renders run in the cloud through Remotion. Bolt reports that about 8 hours of editing took about 4 minutes.
- **Tech stack:** Next.js 15, React, TypeScript, Tailwind; GPT-4 and Claude Opus; Remotion; AWS Lambda; built in Bolt.new.
- **External services:** OpenAI API (PAID), Anthropic API (PAID), Supabase DB/auth/storage (FREE-TIER), AWS Lambda (FREE-TIER/PAID), Remotion cloud rendering (PAID for companies/cloud; the library is source-available), Stripe (PAID per transaction).
- **Why it likely won:** Very visible "wow" demo with an obvious time saving. It looked like a real SaaS product with payments. Bolt said it led on all four criteria.
- **Core primitive:** Natural-language-to-edit-operations on a media timeline, backed by AI clip analysis and indexing.

### A1-2. Weight Coach
- **Prize:** 2nd Place and Voice AI Challenge winner (ElevenLabs) | https://devpost.com/software/weight-coach
- **Pitch:** An AI kitchen assistant that turns your pantry into meal plans, grocery lists and hands-free cooking guidance.
- **Problem:** Households throw away about 40% of their food. Meal planning is overwhelming, and nutrition apps only log meals after they are eaten.
- **How it works:** Users add inventory by voice ("3 apples and 2 bananas"), by camera food recognition (no barcodes needed) or by text. The app tracks expiry dates. Claude Sonnet 4 on AWS Bedrock builds meal plans that use expiring items first and match the user's goals, then generates shopping lists. While cooking, an ElevenLabs voice agent answers questions, sets timers and converts units.
- **Tech stack:** React Native/Expo, TypeScript, Supabase, AWS Bedrock (Claude Sonnet 4), Netlify, Sentry, PostHog, RevenueCat.
- **External services:** ElevenLabs Conversational AI (PAID/FREE-TIER), AWS Bedrock (PAID), OpenAI (PAID), Supabase (FREE-TIER), RevenueCat (FREE-TIER), Sentry/PostHog (FREE-TIER).
- **Why it likely won:** Polished consumer mobile app that combines vision, voice and planning. Uses several sponsor tools. Clear everyday problem.
- **Core primitive:** Camera or voice capture of inventory feeding an LLM planner, plus a hands-free voice agent.

### A1-3. KeyHaven
- **Prize:** 3rd Place | https://devpost.com/software/keyhaven
- **Pitch:** One secure place to store, rotate and monitor API keys across providers.
- **Problem:** Developers keep API keys scattered across services and have no central view of usage, rotation or anomalies.
- **How it works:** Keys are stored encrypted in a Supabase/Postgres vault. The dashboard shows usage analytics across providers, lifecycle and rotation management, and real-time anomaly and usage alerts (emailed through Resend). Tiered subscriptions run through Stripe.
- **Tech stack:** React, TypeScript, Vite, Tailwind, Supabase/PostgreSQL, Netlify.
- **External services:** Supabase (FREE-TIER), Stripe (PAID per transaction), Resend (FREE-TIER), Netlify (FREE-TIER).
- **Why it likely won:** A devtool pain point every hackathon builder has hit. Shipped as a complete product with a business model.
- **Core primitive:** Encrypted secrets vault with usage monitoring and anomaly alerting.

### A1-4. Klinva
- **Prize:** 4th Place | https://devpost.com/software/klinva-ultimate-crm-saas-for-commercial-cleaning-companies
- **Pitch:** An AI-powered, vertical CRM and operations SaaS for commercial cleaning companies.
- **Problem:** A large industry runs on scattered tools and generic CRMs that don't fit how it works.
- **How it works:** Role-based dashboards for owner, staff, client and telemarketing users. Covers job scheduling, GPS team tracking, client messaging, automated invoicing, lead management and a marketplace for job bids.
- **Tech stack:** React 18, Tailwind, Supabase, Clerk auth, Netlify, built in Bolt. Live at klinva.com.
- **External services:** Supabase (FREE-TIER), Clerk (FREE-TIER), Netlify (FREE-TIER). No other third-party APIs are listed.
- **Why it likely won:** Deep vertical focus, a real-sized market, and a lot of working features for one month.
- **Core primitive:** Multi-role vertical CRM scaffold (scheduling, tracking, invoicing, marketplace).

### A1-5. Ecobolt
- **Prize:** 5th Place | https://devpost.com/software/ecobolt
- **Pitch:** An IoT and AI farm monitor for smallholder farmers.
- **Problem:** Rural farmers depend on guesswork and have no real-time environmental data.
- **How it works:** An ESP32 streams temperature, humidity, soil and nutrient readings to Supabase realtime. A dashboard charts them, SMS or email alerts fire when thresholds are crossed, and pumps and lights can be switched remotely. IBM watsonx generates farming recommendations, using weather data as extra context.
- **Tech stack:** React 18, TypeScript, Tailwind, Chart.js, Supabase, ESP32 hardware with sensors, Netlify.
- **External services:** IBM watsonx (FREE-TIER/PAID), OpenWeatherMap (FREE-TIER), Twilio SMS (PAID), Salesforce (PAID), Supabase (FREE-TIER).
- **Why it likely won:** Real hardware in a web-dominated field, social impact, closed-loop control.
- **Core primitive:** Sensor-to-cloud telemetry with threshold alerts, remote actuation and LLM advice.

### A1-6. CallVance
- **Prize:** 6th Place and Startup Challenge winner | https://devpost.com/software/callvance
- **Pitch:** AI voice calls that confirm appointments automatically.
- **Problem:** Staff spend hours on manual confirmation calls, and no-shows cost businesses revenue.
- **How it works:** The user enters appointments or uploads a CSV (Papa Parse). The backend places outbound calls through Twilio, and an ElevenLabs Conversational AI agent with dynamic per-call variables confirms, reschedules or records the outcome. Status streams live to the dashboard over WebSockets.
- **Tech stack:** Node.js (Fastify), React, TypeScript, Vite, Tailwind; Netlify for the frontend, Railway/DigitalOcean for the backend.
- **External services:** ElevenLabs Conversational AI (PAID), Twilio voice/PSTN (PAID), Supabase (FREE-TIER), Netlify (FREE-TIER).
- **Why it likely won:** Clear ROI for small businesses, and a live phone call makes a strong demo.
- **Core primitive:** Outbound AI phone agent (telephony plus conversational voice) driven by a structured task list.

### A1-7. ModelMash
- **Prize:** 7th Place and "Most Likely to Get Funded" bonus | https://devpost.com/software/modelmash-find-the-perfect-llm
- **Pitch:** Benchmark many LLMs on your own task and pick the best one.
- **Problem:** Developers choose models by gut feel rather than evidence.
- **How it works:** The user defines a task and picks models. ModelMash runs the same prompts on each through OpenRouter. Several evaluator models then rank the outputs on configurable criteria such as accuracy and creativity, and the result is a shareable comparison report. Pricing is pay-as-you-go.
- **Tech stack:** React (Bolt.new), Supabase, Railway for persistent functions, Netlify.
- **External services:** OpenRouter (PAID per token), Supabase (FREE-TIER), Railway (PAID/FREE-TIER), Netlify (FREE-TIER).
- **Why it likely won:** Meta-devtool for the AI era with obvious commercial demand, as the funding award shows.
- **Core primitive:** Multi-model fan-out with LLM-as-judge ranking.

### A1-8. Legion
- **Prize:** 8th Place | https://devpost.com/software/legion-ym9uef
- **Pitch:** Men's mental-health accountability community with an AI mentor.
- **Problem:** Therapy alone often doesn't produce consistent action. The founder found that peer brotherhood and accountability were missing.
- **How it works:** Users commit to 7-, 21- or 30-day "Missions" with daily check-ins and streaks. A community feed, weekly video "Meeting Pods" and leaderboards with cash rewards keep them engaged. "Aurel", a GPT-4o mentor running in Supabase Edge Functions, gives guidance around the clock.
- **Tech stack:** Bolt.new, Supabase (Postgres with RLS, Edge Functions), Netlify.
- **External services:** OpenAI GPT-4o (PAID), Stripe (PAID per transaction), Supabase (FREE-TIER).
- **Why it likely won:** Authentic founder story, underserved audience, social impact.
- **Core primitive:** Streak and accountability engine combined with a persona-tuned AI coach.

*Other A1 winners (not detailed):* 9th Bored? Opposite!, 10th HealthPlan AI. Challenges: startsnap.fun (Blockchain), FoodGrade AI (Tavus video), OUTStories (Deploy), AccessPath (Domain), Skyboard (Silly), HotDog Training App / BaseballHub / Loafie (RevenueCat).

---

## A2. Microsoft AI Agents Hackathon 2025

- **Official name:** AI Agents Hackathon 2025 (Microsoft Reactor / Azure Dev Community, GitHub-issue submissions)
- **Dates:** April 8 – 30, 2025 (free, virtual, 3 weeks)
- **Size:** 18,000+ registrants; 570 submissions
- **Track structure:** Best Overall plus one best-in-language/platform award for each of Python, C#, Java, JavaScript/TypeScript, Copilot (Copilot Studio / M365 Agents SDK) and Best Use of Azure AI Agent Service. Also 9 honorable mentions.
- **Judging:** innovation, impact, usability, solution quality, category alignment.
- **Sources:** https://microsoft.github.io/AI_Agents_Hackathon/winners/ · https://techcommunity.microsoft.com/blog/azuredevcommunityblog/ai-agents-hackathon-2025-%E2%80%93-category-winners-showcase/4415088 · GitHub issues in microsoft/AI_Agents_Hackathon (below)

### A2-1. RiskWise: Procurement Risk Analysis System
- **Prize:** Best Overall | https://github.com/microsoft/AI_Agents_Hackathon/issues/526 (repo: github.com/oh-qi-qi/azure-ai-agent-hackathon-2025)
- **Pitch:** Multi-agent, explainable supply-chain risk intelligence for equipment deliveries.
- **Problem:** Procurement teams need real-time, explainable views of delivery risk from geopolitics, tariffs, logistics and schedule slippage.
- **How it works:** Semantic Kernel group chat with a Scheduler Agent (delivery-risk and schedule-variance maths over Azure SQL), a Political Risk Agent (Bing Search grounding), a Reporting Agent (writes Word reports) and an Assistant Agent. Selection and termination strategies route each query to the right agent by intent. A map-based Next.js UI shows risk by geography.
- **Tech stack:** Python, FastAPI, Semantic Kernel, Streamlit, React/Next.js, Tailwind, React Simple Maps, PyODBC, Spire.Doc.Free.
- **External services:** Azure AI Agent Service (PAID), Azure OpenAI (PAID), Azure SQL/Blob (PAID/FREE-TIER), Bing Search grounding (PAID).
- **Why it likely won:** A textbook multi-agent pattern with real data grounding, an enterprise-relevant problem that was topical during the 2025 tariffs, and explainable output.
- **Core primitive:** Intent-routed multi-agent risk analyst (quantitative agent, web-grounded agent, report agent).

### A2-2. Apollo – Deep Research Meta Agent
- **Prize:** Best C# Agent | https://github.com/microsoft/AI_Agents_Hackathon/issues/681 (repo: github.com/manasseh-zw/apollo)
- **Pitch:** Turns a broad topic into a well-cited research report.
- **Problem:** Manual deep research is slow. Chat context limits break long research workflows.
- **How it works:** Three agents work in Semantic Kernel group chat. Apollo coordinates, Athena generates queries and gathers sources through Exa, and Hermes checks completeness and finds gaps (self-reflective RAG). A state machine carries the workflow past context limits, and a two-stage synthesis writes the report. Memory is Kernel Memory on Postgres/pgvector.
- **Tech stack:** .NET / ASP.NET Core, Semantic Kernel, Kernel Memory, PostgreSQL + pgvector, React (Vite, TanStack).
- **External services:** Azure AI Agent Service / AI Foundry GPT-4 (PAID), Exa AI search (PAID/FREE-TIER).
- **Why it likely won:** A strong "deep research" clone in C#, a language with few agent projects, and a solid engineering design.
- **Core primitive:** Coordinator, researcher and critic loop for gap-aware deep research.

### A2-3. Bits2Brain
- **Prize:** Best Java Agent | https://github.com/microsoft/AI_Agents_Hackathon/issues/638 (repo: github.com/Xenixxxxx/bits-to-brain)
- **Pitch:** Turns scattered learning (videos, articles, images) into an interactive "Knowledge Star Map".
- **Problem:** Information overload. Knowledge picked up from daily media is never organized or connected.
- **How it works:** Multimodal inputs are processed by Azure Computer Vision OCR and Video Indexer, then summarized and embedded into a Neo4j knowledge graph. A LangChain4j agent with memory suggests related topics from the graph's state, answers questions using node content, and finds YouTube videos to attach to nodes.
- **Tech stack:** Java Spring Boot, LangChain4j, Neo4j, React, Docker on Azure VM, GitHub Actions.
- **External services:** Azure OpenAI and embeddings (PAID), Azure Computer Vision (FREE-TIER), Azure Video Indexer (PAID/FREE-TIER), Google Custom Search API (FREE-TIER).
- **Why it likely won:** A visual graph UI, multimodal ingestion, and one of the few strong Java entries.
- **Core primitive:** Multimodal content turned into a knowledge graph that an agent can explore.

### A2-4. WorkWizee
- **Prize:** Best Copilot Agent | https://github.com/microsoft/AI_Agents_Hackathon/issues/587 (repo: github.com/Santhoshkumard11/WorkWizee)
- **Pitch:** Run P1/P2 incident chores from Teams in natural language.
- **Problem:** During incidents, engineers lose time updating Jira, ServiceNow and Confluence and sending RCA emails.
- **How it works:** A Copilot Studio bot in Teams parses commands such as "add comment X to WOWZEE-12". Python APIs on Azure Functions then call Jira, Bitbucket, Confluence and Outlook. The author claims it saves about 40% of time.
- **Tech stack:** Microsoft Copilot Studio, Python, Azure Functions.
- **External services:** Copilot Studio (PAID licence), Azure Functions (FREE-TIER), Jira/Confluence/Bitbucket APIs (FREE-TIER with an account), Outlook/Graph (tied to M365 licence).
- **Why it likely won:** Directly useful enterprise workflow inside Teams, a clear productivity number, and good fit for the category.
- **Core primitive:** Chat-ops agent that turns natural language into multi-tool ticketing and doc actions.

### A2-5. ModelProof: Sentinel AI Chat
- **Prize:** Best JavaScript/TypeScript Agent | https://github.com/microsoft/AI_Agents_Hackathon/issues/517 (repo: github.com/hgenix20/modelproof)
- **Pitch:** Trustworthy AI chat that cross-checks models and audits every answer.
- **Problem:** Enterprises need to catch hallucinations, bias and toxicity with an audit trail.
- **How it works:** Modular agents send each query to two or more LLMs (dual Azure OpenAI deployments) and compare the answers for consistency. An audit agent then scores each reply for hallucination, bias and toxicity and flags problems in real time.
- **Tech stack:** TypeScript/Node.js (with Python/C#/Java pieces), Copilot Studio, M365 Agents SDK.
- **External services:** Azure AI Agent Service (PAID), Azure OpenAI (PAID).
- **Why it likely won:** Addresses AI trust and safety head on. Matches Microsoft's responsible-AI messaging.
- **Core primitive:** Dual-LLM consistency checks plus a safety-audit guardrail layer.

### A2-6. TARIFFED!
- **Prize:** Best Use of Azure AI Agent Service | https://github.com/microsoft/AI_Agents_Hackathon/issues/349 (repo: github.com/tagr/ai-agents-hack)
- **Pitch:** Ask plain-English questions about US tariffs.
- **Problem:** The Harmonized Tariff Schedule is impenetrable, and 2025 tariff changes hit everyday goods.
- **How it works:** GPT-4o agents in Azure AI Agent Service use function calling against a SQL Server copy of the HTS, plus Bing grounding for live news. They answer questions such as where a good is imported from, the likely duty and domestic substitutes. The app is Blazor, orchestrated with .NET Aspire.
- **Tech stack:** .NET 9, Blazor, .NET Aspire, SQL Server 2022, Docker.
- **External services:** Azure AI Agent Service + GPT-4o (PAID), Bing Search grounding (PAID). HTS data is public (FREE).
- **Why it likely won:** Timely, grounded in structured data, and a clean showcase of the sponsor's service.
- **Core primitive:** Agent with SQL function-calling over a regulatory dataset plus web grounding.

### A2-7. Konveyor
- **Prize:** Best Python Agent | https://github.com/microsoft/AI_Agents_Hackathon/issues/645 (repo: github.com/sdamache/konveyor-onboarding-agent)
- **Pitch:** A Slack agent that speeds up engineer onboarding with cited answers from internal docs and code.
- **Problem:** Onboarding costs $30K+ per engineer because docs are scattered and knowledge sits in silos.
- **How it works:** An orchestrator classifies intent and routes each Slack message to a Semantic Kernel skill: doc navigation with citations, code explanation with architectural context, or knowledge-gap detection. Retrieval uses Azure Cognitive Search, and conversation memory keeps context. Infrastructure is managed with Terraform.
- **Tech stack:** Python 3.10+, Semantic Kernel, Slack Bot Framework, Terraform.
- **External services:** Azure OpenAI (PAID), Azure Cognitive/AI Search (PAID/FREE-TIER), Azure Key Vault and App Service (PAID/FREE-TIER), Slack API (FREE).
- **Why it likely won:** Production-minded infrastructure-as-code, a quantified business problem, and delivery inside a tool teams already use.
- **Core primitive:** Enterprise RAG agent in chat with citations and knowledge-gap detection.

### A2-8. Agentic Software Factory *(honorable mention; limited detail)*
- **Prize:** Honorable Mention | https://microsoft.github.io/AI_Agents_Hackathon/winners/
- **Pitch:** A multi-agent ecosystem of autonomous coding agents that build software.
- **Problem:** Coordinating the planning, coding and review stages of software development.
- **How it works:** Per the winners page only: several coding agents built with Semantic Kernel, AutoGen and Magentic-One, connected through MCP on Azure AI Agent Service. The project page was not opened and there are no further mechanism details.
- **Tech stack:** Python, Semantic Kernel, AutoGen, Magentic-One, MCP.
- **External services:** Azure AI Agent Service (PAID). Model provider presumed Azure OpenAI (PAID, unverified).
- **Why it likely won:** Combines every major Microsoft agent framework plus MCP.
- **Core primitive:** Framework-agnostic multi-agent software-development pipeline over MCP.

*Other honorable mentions:* DeepStudy (K12 AI classroom), Agent Groot (multimodal retail), Nuroxa (dementia risk), DocAssistant.Researchy, RegulAIte (compliance), Sirius, Personal Finance Manager, Seveum (AI interview recruiter on LiveKit).

---

## A3. Gemini 3 Hackathon (Google DeepMind × Devpost) — 2026 [SUBSTITUTE]

- **Official name:** Gemini 3 Hackathon: Build what's next
- **Dates:** December 17, 2025 – February 9, 2026. Results were delayed and published around April 2026.
- **Size:** 35,522 registered; 4,500+ submissions. Google called it one of the biggest hackathons it has run.
- **Track structure:** A single open track built on the Gemini 3 API. Grand Prize $50K, 2nd $20K, 3rd $10K, 10 Honorable Mentions at $2K each ($100K total).
- **Sources:** https://gemini3.devpost.com/ · https://gemini3.devpost.com/project-gallery · project pages below
- The top 3 are shown in order. Five of the 10 honorable mentions were verified and are listed as A3-4 to A3-8.

### A3-1. Globot
- **Prize:** Grand Prize ($50K) | https://devpost.com/software/globot-341w9q
- **Pitch:** "Turns sudden supply chain chaos into confident decisions in 60 seconds."
- **Problem:** When a crisis hits (for example the Red Sea shipping crisis), logistics managers must re-route millions of dollars of cargo while juggling spreadsheets and news feeds.
- **How it works:** A five-agent CrewAI "reasoning engine": market and geopolitical monitor, financial-impact calculator for alternative routes, route re-planner that avoids conflict zones, insurance-policy analyst (long context over policy documents), and an adversarial "red team" agent that challenges the others' conclusions. Gemini Vision reads satellite imagery for early signs of port or canal status before official notices. Policies go through RAG using Gemini embeddings and ChromaDB. A 3D Deck.gl globe shows the routes.
- **Tech stack:** Gemini 3 Flash, Gemini Vision, Gemini Embeddings, CrewAI, Python/FastAPI, React/TypeScript, Deck.gl, SQLite, ChromaDB.
- **External services:** Gemini API (FREE-TIER/PAID), Clerk auth (FREE-TIER), ChromaDB (FREE/OPEN-SOURCE). Planned: Bloomberg (PAID), MarineTraffic AIS (PAID), Sentinel-2 imagery (FREE).
- **Why it likely won:** High-stakes, time-pressured story; multimodal use (satellite vision, long context); an adversarial self-check agent; a striking 3D visual.
- **Core primitive:** Crisis-decision multi-agent crew with an adversarial verifier and satellite-imagery signals.

### A3-2. Aegis: Autonomous Multi-Agent Crisis Command
- **Prize:** Second Place ($20K) | https://devpost.com/software/aegis-autonomous-multi-agent-crisis-command
- **Pitch:** An AI command center that keeps 911 from collapsing during mass-casualty events.
- **Problem:** Emergency dispatch fails because of call volume: 10,000 calls in minutes swamp human dispatchers and use up the "golden hour".
- **How it works:** A Coordinator agent routes multimodal signals (audio, text, images, video). A Triage agent reasons about context and escalates. A Surveillance agent checks images against live Google Search. A Logistics agent routes rescue assets on Google Maps, and a Reporter agent compiles legal Situation Reports. "Protocol Zero" sends uncertain, high-stakes decisions to a human commander for approval.
- **Tech stack:** Gemini 3 Pro (deep thinking), Next.js 14 (App Router, Server Actions), TypeScript, Tailwind, Vercel.
- **External services:** Gemini API (FREE-TIER/PAID), Google Maps JS API (FREE-TIER/PAID), Google Search grounding (PAID beyond quota), Vercel (FREE-TIER).
- **Why it likely won:** Life-or-death stakes, true multimodality, and human-in-the-loop safety design.
- **Core primitive:** Multimodal triage swarm with a human-approval gate for uncertain actions.

### A3-3. Netra: Empowering the Visually Impaired
- **Prize:** Third Place ($10K) | https://devpost.com/software/netra-empowering-the-visually-impaired
- **Pitch:** A socially aware sight assistant on an ordinary smartphone.
- **Problem:** Assistive tech finds obstacles but is "socially blind": it misses expressions, intent and crowd dynamics.
- **How it works:** The phone streams camera frames over WebSockets to a FastAPI backend that calls Gemini 3. There are five modes: continuous awareness (smiles, approaching people), hold-to-ask Q&A, persistent object search with guided hand navigation, multi-step task guidance with visual verification, and a "Memory Palace" that stores landmarks in JSON for later recall.
- **Tech stack:** Gemini 3, Python/FastAPI/Uvicorn, WebSockets, HTML/JS/Tailwind, Pillow, Web Audio API.
- **External services:** Gemini API (FREE-TIER/PAID). Everything else is open source.
- **Why it likely won:** Emotional accessibility demo, clever use of real-time multimodal streaming, and persistent spatial memory.
- **Core primitive:** Real-time camera-to-LLM streaming assistant with persistent spatial memory.

### A3-4. Proofy.AI
- **Prize:** Honorable Mention ($2K) | https://devpost.com/software/fakey-ai
- **Pitch:** Deepfake and AI-content checks for ordinary people.
- **Problem:** Deepfake scams target non-experts (the founder's mother nearly fell for a deepfake investment video), and detection tools are built for researchers.
- **How it works:** A mobile app triggered by the volume button analyzes whatever is on screen. Video is checked frame by frame for facial and lip-sync artifacts, voice and text by rhythm and linguistic patterns, and images by source tracing. A browser extension verifies pages inline, and a web platform does batch analysis with timestamped anomaly highlights and confidence scores. Gemini does the analysis.
- **Tech stack:** Gemini, React, Three.js, Framer Motion, TypeScript, Node.js, Tailwind, Vercel, Google AI Studio.
- **External services:** Gemini API (FREE-TIER/PAID), Vercel (FREE-TIER).
- **Why it likely won:** Timely consumer-safety problem, several delivery surfaces, and a personal backstory.
- **Core primitive:** Multimodal authenticity/deepfake analysis callable from any screen.

### A3-5. Agent-weaver
- **Prize:** Honorable Mention ($2K) | https://devpost.com/software/agent-weaver
- **Pitch:** Gemini as a coordinated five-role dev team with shared, git-committed memory.
- **Problem:** AI coding tools forget context, repeat analysis across teammates, and give insights that can't be verified.
- **How it works:** Architect, PM, Developer, QA and Reviewer agents share a context board kept in a `.weaver/` folder that is committed to git. Tree-sitter and ast-grep parse the codebase, Gemini annotates it in natural language, and humans verify the annotations. A Hub Sync server shares memory across a team by branch, exposed through MCP, and a Next.js dashboard streams activity over SSE.
- **Tech stack:** Gemini 3 Flash, MCP, Tree-sitter, ast-grep, Next.js 15, React 19, Express, Tailwind 4, Node.js.
- **External services:** Gemini API (FREE-TIER/PAID), GitHub (FREE), Vercel (FREE-TIER).
- **Why it likely won:** Solves agent memory persistence in a git-native way, with a clear developer-tool use case.
- **Core primitive:** Git-versioned shared memory for multi-agent coding teams, served through MCP.

### A3-6. OrphaFold
- **Prize:** Honorable Mention ($2K) | https://devpost.com/software/orphafold
- **Pitch:** Multi-agent drug-repurposing research for rare diseases.
- **Problem:** About 95% of the 7,000+ rare diseases have no approved treatment, and the data is split across siloed databases.
- **How it works:** Four Gemini 3 agents. Clinical Grounding uses Orphanet and OMIM. Bio-Mechanism uses AlphaFold DB, UniProt and ClinVar. Discovery uses PubMed and ClinicalTrials.gov. Hypothesis Lab compares structural homology and binding pockets to propose repurposing candidates. The output is a report with 3D protein viewers.
- **Tech stack:** Gemini 3, React/Vite, custom 3D protein rendering.
- **External services:** Gemini API (FREE-TIER/PAID). Orphanet, UniProt, PubMed/NCBI, AlphaFold DB, ClinicalTrials.gov and ClinVar are FREE public APIs. OMIM API is FREE with registration and a licence.
- **Why it likely won:** Serious scientific depth, many real data integrations, and humanitarian impact.
- **Core primitive:** Agent pipeline that federates public biomedical APIs into hypothesis generation.

### A3-7. AgentGuard
- **Prize:** Honorable Mention ($2K) | https://devpost.com/software/agentguard-the-semantic-firewall-for-the-agentic-web
- **Pitch:** "SSL for AI agents": a semantic firewall that tells good shopping agents from bad scrapers.
- **Problem:** Retailers block all bots, which breaks legitimate agentic commerce.
- **How it works:** Classifies traffic by behavioral intent (request velocity, headers, interaction patterns) rather than IP. Gemini 3 Flash returns a verdict in under 300 ms with a readable reasoning trace. A cache handles about 99% of repeat traffic at no latency or cost.
- **Tech stack:** Gemini 3 Flash, FastAPI (async), React + Vite, GCP.
- **External services:** Gemini API (FREE-TIER/PAID), GCP hosting (PAID/FREE-TIER).
- **Why it likely won:** A new infrastructure category for the agentic web, with explainable decisions and cost-aware design.
- **Core primitive:** LLM-based intent classifier for agent traffic with a cache in front.

### A3-8. Orbital Assets
- **Prize:** Honorable Mention ($2K) | https://devpost.com/software/orbital-assets
- **Pitch:** An investment-banking memo generator for asteroid mining, grounded in physics.
- **Problem:** Space-resource valuations are hype, with "quadrillion-dollar" claims that ignore delta-v and market effects.
- **How it works:** The user pastes a NASA Eyes asteroid URL. The app pulls orbital and physical data from the NASA Small-Body Database API and runs deterministic TypeScript valuation (delta-v, composition, market damping, NPV) so the numbers can't be hallucinated. Gemini 3 writes only the qualitative risk narrative. The memo is emailed through Resend and shown with a React Three Fiber orbit view.
- **Tech stack:** gemini-3-pro-preview, Next.js App Router, React Three Fiber / Three.js, Firebase Firestore, Edge runtime.
- **External services:** Gemini API (FREE-TIER/PAID), NASA SBDB API (FREE), Resend (FREE-TIER), Firebase (FREE-TIER).
- **Why it likely won:** A clear "LLM for narrative, code for maths" anti-hallucination design with public data.
- **Core primitive:** Deterministic computation core with an LLM narrative layer.

*Other verified honorable mentions (not detailed):* Logic Lift (COBOL-to-Python migration), PROCSee (autonomous process investigation), BatteryForgeAI (multi-agent battery optimization), Gemini GeoFlow (archaeological data prep), CineStream (A2A mesh, cinematic learning).

---

## A4. Kaggle — Google: The Gemma 3n Impact Challenge (2025)

- **Official name:** Google – The Gemma 3n Impact Challenge (Kaggle hackathon)
- **Dates:** Launched late June 2025 alongside the full Gemma 3n release. Submissions closed around early August 2025 (exact deadline not verified). Winners announced December 2025.
- **Size:** 600+ project submissions; $150K prize pool.
- **Track structure:** Overall places 1–4 for impact in accessibility, education, health, environment and crisis response, using Gemma 3n's on-device, offline, multimodal capabilities. Special technology prizes: Google AI Edge, Unsloth ($10K), Ollama, LeRobot and NVIDIA Jetson. Submissions were a video, a Kaggle writeup and code.
- **Sources:** https://blog.google/innovation-and-ai/technology/developers-tools/developers-changing-lives-with-gemma-3n/ · https://www.kaggle.com/competitions/google-gemma-3n-hackathon/hackathon-winners (JS-rendered, not readable) · GitHub repos below
- **Data gap:** Kaggle writeups are JS-rendered and could not be read. Details for A4-4 to A4-8 come from the Google blog summary and are thin.

### A4-1. Gemma Vision
- **Prize:** 1st Place and Google AI Edge special prize | https://github.com/TGTech06/gemma-vision (writeup: kaggle.com/competitions/gemma-4-good-hackathon/writeups/winner-of-gemma-3n-challenge-gemma-vision)
- **Pitch:** A fully on-device vision assistant for blind users, controlled by a tactile controller or voice.
- **Problem:** Holding a phone while using a white cane doesn't work, and touchscreen menus are hard for blind users.
- **How it works:** The phone is strapped to the chest and its camera feeds Gemma 3n, running locally through the MediaPipe LLM Inference API via the `flutter_gemma` package with streamed responses. An 8BitDo Micro Bluetooth controller in keyboard mode, or voice, triggers scene description, text reading and follow-up questions; the model keeps photo history for context. Output goes through VoiceOver or TalkBack. After a one-time download of about 3 GB it works offline, and nothing leaves the device.
- **Tech stack:** Gemma 3n, Google AI Edge / MediaPipe LLM Inference, Flutter (`flutter_gemma`), 8BitDo Micro controller.
- **External services:** None at runtime (FREE/OPEN-SOURCE model and runtime). Controller is about $25 hardware.
- **Why it likely won:** Real accessibility impact, a hardware and UX insight (chest mount plus controller), full privacy and offline use, and the best showcase of the sponsor's edge stack.
- **Core primitive:** Offline on-device multimodal scene understanding with a non-touch (controller or voice) interface.

### A4-2. Vite Vere Offline
- **Prize:** 2nd Place | https://github.com/guidomarangoni/vite-vere-offline
- **Pitch:** An offline digital companion that turns a photo into simple spoken step-by-step instructions for people with cognitive disabilities.
- **Problem:** People with intellectual disabilities need simple, patient guidance for daily tasks, and the earlier Gemini-API version needed an internet connection.
- **How it works:** A Flutter app runs Gemma 3n E2B (2.9 GB, recommended) or E4B (4.1 GB) on-device through `flutter_gemma`. The user photographs a scene (for example a messy room). The model writes a structured, motivating action plan in simplified language, and `flutter_tts` reads it aloud. Prompts are localized in five languages, and wakelock keeps the device awake during long inference.
- **Tech stack:** Gemma 3n E2B/E4B, Flutter, flutter_gemma, flutter_tts, wakelock_plus.
- **External services:** None (FREE/OPEN-SOURCE). The team moved off the Gemini API (PAID/FREE-TIER) to run offline.
- **Why it likely won:** A deep, specific user group; a clear cloud-to-offline migration story; dignity-focused design.
- **Core primitive:** Image-to-simplified-instructions with TTS, fully offline.

### A4-3. 3VA
- **Prize:** 3rd Place | Source: Google blog (Kaggle writeup not readable)
- **Pitch:** A personal AAC voice: pictograms become rich, nuanced sentences for Eva, a user with cerebral palsy.
- **Problem:** Pictogram-based AAC produces flat, telegraphic speech. Personalized AAC is expensive.
- **How it works:** Gemma 3n was fine-tuned locally on a Mac with Apple MLX on Eva's own pictogram-to-expression pairs. The model expands a pictogram sequence into expressive natural language in her voice and style.
- **Tech stack:** Gemma 3n, Apple MLX (local fine-tuning on Apple Silicon).
- **External services:** None (FREE/OPEN-SOURCE).
- **Why it likely won:** A single real user, a very personal story, and proof that cheap personalized fine-tuning works.
- **Core primitive:** Low-cost local fine-tuning that personalizes a small model to one user's communication style.

### A4-4. Sixth Sense for Security Guards
- **Prize:** 4th Place | https://www.kaggle.com/competitions/google-gemma-3n-hackathon/writeups/sixth-sense-for-security-guards-powered-by-googles
- **Pitch:** Human-level context for CCTV so guards only see real threats.
- **Problem:** Guards watching many feeds miss events or drown in false alarms.
- **How it works:** A lightweight YOLO-NAS detector screens every frame for motion and objects, and only flagged events go to Gemma 3n, which judges whether the scene is benign or a threat. This two-stage cascade handles up to 360 fps across 16 cameras in real time.
- **Tech stack:** YOLO-NAS, Gemma 3n (local).
- **External services:** None stated (FREE/OPEN-SOURCE). Note that YOLO-NAS weights carry a restrictive licence.
- **Why it likely won:** Strong systems engineering (cascade for throughput) and a practical safety deployment.
- **Core primitive:** Cheap detector gating an expensive VLM for real-time video reasoning.

### A4-5. Dream Assistant
- **Prize:** Unsloth special prize | Source: Google blog
- **Pitch:** A voice assistant that understands one person's impaired speech.
- **Problem:** Mainstream voice assistants fail people with speech impairments.
- **How it works:** Gemma 3n's audio path was fine-tuned with Unsloth on the user's own recordings, so the model learns that person's speech patterns and can control device functions by voice.
- **Tech stack:** Gemma 3n (audio), Unsloth efficient fine-tuning (LoRA).
- **External services:** None required (FREE/OPEN-SOURCE). A GPU notebook may be needed; Kaggle and Colab offer free tiers.
- **Why it likely won:** Showcases the sponsor tool on an unusual modality (audio fine-tuning) with direct accessibility impact.
- **Core primitive:** Per-user speech adaptation of an on-device audio LLM.

### A4-6. LENTERA
- **Prize:** Ollama special prize | Source: Google blog
- **Pitch:** An offline AI education hub for villages without internet.
- **Problem:** Disconnected rural regions get none of the benefits of AI tutoring.
- **How it works:** Cheap hardware becomes an offline micro-server that runs Gemma 3n through Ollama and broadcasts its own Wi-Fi hotspot. Students connect with any phone or laptop and use the educational AI through a local web app, with no internet needed.
- **Tech stack:** Gemma 3n, Ollama, low-cost single-board or mini-PC hardware (exact device not verified), local Wi-Fi AP.
- **External services:** None (FREE/OPEN-SOURCE).
- **Why it likely won:** One box serves many users, which scales impact for the digital divide.
- **Core primitive:** Local-LLM hotspot server: one offline box serving AI to many devices over LAN.

### A4-7. Graph-based Cost Learning and Gemma 3n for Sensing
- **Prize:** LeRobot special prize | Source: Google blog
- **Pitch:** Robot exploration plans that minimize sensing and scanning time.
- **Problem:** Robots spend too long scanning when exploring.
- **How it works:** A "scanning-time-first" pipeline uses an inductive graph-based matrix completion (IGMC) model to predict sensing costs, and Gemma 3n reasons over them to plan exploration, on Hugging Face LeRobot.
- **Tech stack:** Gemma 3n, IGMC, LeRobot.
- **External services:** None (FREE/OPEN-SOURCE).
- **Why it likely won:** A rare robotics entry with novel method depth.
- **Core primitive:** Learned cost model combined with an LLM planner for robot exploration.

### A4-8. My (Jetson) Gemma
- **Prize:** NVIDIA Jetson special prize | Source: Google blog
- **Pitch:** A context-aware voice assistant on edge hardware.
- **Problem:** Real-world assistants need to respond quickly and use little energy without the cloud.
- **How it works:** Gemma 3n is deployed on a Jetson Orin with CPU and GPU hybrid processing split across pipeline stages, giving an energy-efficient, responsive voice interface.
- **Tech stack:** Gemma 3n, NVIDIA Jetson Orin.
- **External services:** None (FREE/OPEN-SOURCE). Jetson is hardware at roughly $250+.
- **Why it likely won:** Best use of the sponsor hardware, and practical embedded deployment.
- **Core primitive:** Embedded edge voice assistant with CPU/GPU split inference.

---

## A5. NASA International Space Apps Challenge 2025 (Global Winners)

- **Official name:** NASA International Space Apps Challenge 2025 (theme "Learn, Launch, Lead")
- **Dates:** October 4 – 5, 2025. Global winners announced December 18, 2025.
- **Size:** 114,000+ participants, 18,860 teams, 11,500+ submissions, 551 local events, 167 countries and territories. The largest event in this cluster by participants.
- **Track structure:** 18 NASA-written challenges (exoplanets, space biology, weather, LEO commercialization, habitats, agriculture and others). Local judging, then Global Finalists, then 10 Global Awards judged by NASA and partner agencies. No cash; winners are invited to NASA.
- **Sources:** https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/ · https://www.spaceappschallenge.org/2025/meet-the-2025-global-winners/ · https://news.sciencex.in/nasa-announces-2025-international-space-apps-challenge-global-winners
- **Data gap:** Space Apps team pages are JS-rendered. Tech stacks are only partly verified. The 8 most technical of the 10 winners are detailed below.

### A5-1. SpaceGenes+ (Germany)
- **Prize:** Best Use of Science | https://www.spaceappschallenge.org/2025/find-a-team/spacegenes/ · https://spacegenes-plus.framer.website/
- **Pitch:** A dashboard that finds genes that react synergistically to radiation plus microgravity.
- **Problem:** Astronaut health risks from combined spaceflight stressors are hidden in raw omics datasets.
- **How it works:** Pulls NASA GeneLab open datasets (for example GLDS-288, mouse spleen). Compares gene fold changes across Control, Radiation, Microgravity and Combined conditions. A "Synergy Threshold" rule flags genes whose combined response exceeds the sum of the single stressors (for example TP53 and ATM), and the dashboard visualizes them.
- **Tech stack:** Not fully verified (interactive dashboard; site on Framer).
- **External services:** NASA GeneLab/OSDR (FREE), Framer (FREE-TIER).
- **Why it likely won:** Real scientific insight (non-additive effects) from real NASA data, made accessible.
- **Core primitive:** Multi-condition omics synergy detector with a visual explorer.

### A5-2. Resonant Exoplanets (USA)
- **Prize:** Best Use of Data | https://adhvaidh.com/nasa-space-apps/ · https://resonant-planet.vercel.app/
- **Pitch:** AI that hunts exoplanets and biosignatures in telescope data automatically.
- **Problem:** Manual review of huge Kepler/TESS/JWST datasets is slow and hard to trust.
- **How it works:** Ingests large telescope and satellite datasets, including JWST spectra, and runs an AI pipeline to flag exoplanet signals and possible biosignatures. It also visualizes resonance patterns in planetary systems to make the signals "more transparent and trustworthy." Specific ML models were not verified.
- **Tech stack:** Web app on Vercel. ML details not verified.
- **External services:** NASA Exoplanet Archive / MAST (FREE), Vercel (FREE-TIER).
- **Why it likely won:** Directly solves the challenge, uses flagship data (JWST), and emphasizes explainability.
- **Core primitive:** ML signal detection with transparent visualization over astronomical time-series and spectra.

### A5-3. Twisters — SkySense (Mexico)
- **Prize:** Best Use of Technology | https://skysense.surf/
- **Pitch:** "Will it rain on my parade?" Hyperlocal weather risk for planning outdoor activities.
- **Problem:** Generic forecasts don't turn into activity-specific go/no-go decisions.
- **How it works:** A data pipeline blends and cleans NASA Earth-observation and weather datasets and turns rain, wind, temperature, humidity and visibility into probability metrics. AI analysis produces real-time risk assessments and recommends the safest time windows.
- **Tech stack:** Web app. Specific frameworks and models not verified.
- **External services:** NASA Earthdata / POWER / GES DISC (FREE).
- **Why it likely won:** Turns science data into an everyday consumer tool with a polished interface.
- **Core primitive:** Multi-source Earth-observation fusion producing a personal activity-risk score.

### A5-4. Astro Sweepers (Universal/virtual event)
- **Prize:** Galactic Impact | https://www.spaceappschallenge.org/2025/find-a-team/astro-sweepers-we-catch-what-space-leaves-behind/
- **Pitch:** A credit score for orbital-debris responsibility.
- **Problem:** Commercial LEO growth creates debris risk with no accountability incentives.
- **How it works:** Automatically ingests public orbital data (catalogs and debris data), computes a risk index for every space object, and generates compliance and assessment reports. Operators get a sustainability "credit score" that rewards responsible behavior.
- **Tech stack:** Interactive prototype. Specifics not verified.
- **External services:** Public orbital catalogs such as CelesTrak/Space-Track (FREE with registration), NASA ODPO data (FREE).
- **Why it likely won:** Policy and business mechanism design on top of data, and it fits the commercialization theme.
- **Core primitive:** Per-object risk scoring and compliance reporting from public tracking data.

### A5-5. PureFlow (Brazil)
- **Prize:** Best Mission Concept | https://www.spaceappschallenge.org/2025/find-a-team/pureflow2/
- **Pitch:** Design a space habitat in 3D, then stress-test it against solar storms.
- **Problem:** Habitat layouts are designed for ideal conditions rather than resilience to real space weather.
- **How it works:** An interactive systems-engineering tool. Users lay out and model a habitat in 3D, including waste, power, life support and comms, then validate it against real space-weather threat scenarios such as solar storms.
- **Tech stack:** 3D web modeling. Specifics not verified.
- **External services:** NASA space-weather data such as DONKI (FREE).
- **Why it likely won:** Combines design and simulation with a safety-first engineering mindset.
- **Core primitive:** Interactive 3D configurator with physics- and threat-based validation.

### A5-6. Photonics Odyssey (India)
- **Prize:** Most Inspirational | https://www.spaceappschallenge.org/2025/find-a-team/photonic-force/
- **Pitch:** Satellite internet as sovereign public infrastructure for India.
- **Problem:** More than 700 million Indians lack broadband, and private satellite internet targets people who can pay.
- **How it works:** A national LEO constellation concept using phased-array antennas to reduce dependence on ground stations, with coverage modeling for remote regions. Delivered as policy and architecture.
- **Tech stack:** Concept and modeling. Specifics not verified.
- **External services:** None verified.
- **Why it likely won:** Huge social-impact framing and a new public-good model.
- **Core primitive:** Coverage-and-equity modeling for connectivity infrastructure.

### A5-7. Gaia+LEO (USA)
- **Prize:** Global Connection | https://www.spaceappschallenge.org/2025/find-a-team/gaialeo/
- **Pitch:** Co-design orbital and ground data centers for greener AI compute.
- **Problem:** AI training's energy and water demands strain Earth's resources.
- **How it works:** A mixed-integer optimization framework decides where to place compute across orbital and terrestrial data-center networks for large-scale AI training and climate modeling. It trades off power, water, latency and land use.
- **Tech stack:** MILP optimization. Solver not verified; likely an open-source or commercial MILP solver.
- **External services:** None verified.
- **Why it likely won:** Rigorous operations-research depth on a timely AI-sustainability question.
- **Core primitive:** MILP placement optimizer for distributed compute under resource constraints.

### A5-8. QUEÑARIS (Peru)
- **Prize:** Local Impact | https://www.spaceappschallenge.org/2025/find-a-team/watana-project/
- **Pitch:** Satellites, drones and AI to speed up Andean queñua forest restoration.
- **Problem:** Water scarcity in Arequipa is tied to degraded queñua forests.
- **How it works:** NASA satellite phenology monitoring and drone imagery feed AI that finds the best reforestation sites and tracks ecosystem health. The project pairs this with native microorganisms (biotech) to speed tree growth, plus an ecotourism model.
- **Tech stack:** Satellite and drone imagery with an AI analysis pipeline. Specifics not verified.
- **External services:** NASA Earthdata / Landsat / MODIS phenology (FREE).
- **Why it likely won:** A hyper-local, community-rooted plan that spans space data, drones and biotech.
- **Core primitive:** Satellite and drone site-suitability plus monitoring for restoration.

*Other A5 global winners (not detailed):* HerCode Space, "A Solar Tale" (Best Use of Storytelling; children's space-weather story). Zumorroda-X, "Henry's Farm Adventure" (Art & Technology, Egypt; pixel farming game on NASA data).

---

## Appendix: Google ADK Hackathon 2025 (replaced; verified winner list)

Source: https://cloud.google.com/blog/products/ai-machine-learning/adk-hackathon-results-winners-and-highlights. 10,400+ participants from 62 countries, 477 submissions, 1,500+ agents built. Wrapped September 2, 2025. Grand prize was $15K plus $3K in GCP credits.

| ID | Project | Prize | Summary | Link |
|---|---|---|---|---|
| A3x-1 | SalesShortcut | Grand Prize | Multi-agent AI SDR: lead generation, research, proposals, outreach | https://devpost.com/software/salesshortcut |
| A3x-2 | Energy Agent AI | Regional – North America | ADK multi-agent energy customer management | https://devpost.com/software/energy-agent-ai |
| A3x-3 | Edu.AI | Regional – LATAM | Agents grade essays, build study plans and mock exams for Brazil | https://devpost.com/software/edu-ai-multi-agent-educational-system-for-brazil |
| A3x-4 | GreenOps | Regional – APAC | Agent team that audits, forecasts and optimizes cloud for sustainability | https://devpost.com/software/greenops-gzp4aj |
| A3x-5 | Nexora-AI | Regional – EMEA | Personalized lessons with visuals and quizzes | https://devpost.com/software/teachai-upzofa |
| A3x-6 | Particle Physics Agent | Honorable Mention | Natural language to validated Feynman diagrams | https://devpost.com/software/particle-physics-agent |
| A3x-7 | TradeSageAI | Honorable Mention | Multi-agent evaluation of trading hypotheses (Agent Engine, Cloud Run, Vertex AI) | https://devpost.com/software/tradesage-ai |
| A3x-8 | Bleach | Honorable Mention | Visual, plain-English ADK agent builder | https://devpost.com/software/bleach-7tqdmo |

---

## Cluster-level analysis

- **Multi-agent orchestration won the agent-themed events.** The winners of the Microsoft, Gemini 3 and ADK hackathons were all role-specialized agent teams (coordinator plus specialist plus reporter or critic): RiskWise, Apollo, Globot, Aegis, OrphaFold, SalesShortcut. Judges rewarded clearly named agent roles, intent routing, and a visible verification or critic step (Globot's adversarial agent, Hermes in Apollo, Aegis's "Protocol Zero" human gate).
- **Grounding beat raw generation.** Winners anchored the LLM in real data: SQL function calls (TARIFFED!, RiskWise), public scientific APIs (OrphaFold, Orbital Assets, SpaceGenes+), and search grounding (Bing, Google Search). Orbital Assets states the rule directly: deterministic code for the maths, LLM for the narrative.
- **Accessibility and social impact dominated the model-launch challenges.** In the Gemma 3n top 3, all three are accessibility tools (blindness, cognitive disability, cerebral palsy AAC), and Gemini 3's 3rd place (Netra) also serves blind users. Judges consistently rewarded one named, real user and a personal story (Eva in 3VA, the founder's mother in Proofy, the founder's depression in Legion).
- **On-device and offline is a winning angle whenever the sponsor sells edge AI.** Winners used Gemma 3n through flutter_gemma/MediaPipe, Ollama, MLX, Unsloth and Jetson. They stressed privacy, zero connectivity and cheap hardware, and the special-prize structure pushed entrants to use each partner tool.
- **Bolt rewarded shippable SaaS, not research.** Its top 8 were mostly complete products with auth, payments (Stripe/RevenueCat), deployment (Netlify) and a clear market. Voice (ElevenLabs plus Twilio) and video (Remotion) produced the strongest demos. Stacking sponsor tools let projects win extra challenge prizes (Weight Coach and CallVance each won two prizes).
- **Demo "wow" and real-time multimodality matter.** Top prizes went to visible, time-compressed transformations: 8 hours of video editing in 4 minutes, supply-chain decisions in 60 seconds, 911 triage at scale, 360 fps across 16 cameras. Camera, voice, satellite imagery and 3D visuals (Deck.gl, Three.js) recur.
- **Common tech:** React/Next.js with TypeScript and Tailwind; Python/FastAPI backends; Supabase as the default backend-as-a-service; vector stores (ChromaDB, pgvector, Azure Search); agent frameworks (Semantic Kernel, CrewAI, ADK, LangChain4j, MCP). Hosted LLM APIs (Gemini, Azure OpenAI, OpenAI/Claude) are the main PAID dependency. Gemma 3n winners run with no paid dependencies at all.
- **NASA Space Apps is different.** It rewards scientific use of NASA open data (GeneLab, exoplanet archives, Earthdata), mission and policy concepts, and storytelling and local impact more than code polish. AI is present (exoplanet detection, weather risk, reforestation) but is usually a means rather than the headline.
