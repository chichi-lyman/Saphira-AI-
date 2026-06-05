# GitHub Repository Structure: Sophia AI Ecosystem

This document outlines the standard monorepo structure for the full Sophia AI (Saphira) ecosystem, designed to house the mobile application, backend services, multi-agent frameworks, and infrastructure deployments.

## Monorepo Layout (Turborepo / Yarn Workspaces)

```text
sophia-ai-ecosystem/
├── apps/
│   ├── mobile/                 # React Native (Expo) App for iOS & Android
│   │   ├── src/
│   │   │   ├── components/     # UI Components (SaphiraOrb, AgentCluster)
│   │   │   ├── hooks/          # Voice recognition, wake word, state
│   │   │   ├── screens/        # App screens (Home, Memory, Settings)
│   │   │   ├── audio/          # Audio processing & TTS integration
│   │   │   ├── store/          # Zustand/Redux for global state
│   │   │   └── api/            # API client to communicate with backend
│   │   ├── app.json            # Expo config
│   │   └── package.json
│   ├── web/                    # Next.js or React Web Dashboard (For pro users)
│   │   └── ...
│   └── api/                    # Node.js Express/NestJS Backend
│       ├── src/
│       │   ├── controllers/    # API Route handlers
│       │   ├── services/       # Claude API, Stripe, Firebase integrations
│       │   ├── agents/         # Multi-agent router & distinct agent logic
│       │   ├── db/             # Prisma or Drizzle ORM schema & migrations
│       │   └── webhooks/       # Stripe/Stripe billing webhooks
│       └── package.json
├── packages/
│   ├── ui/                     # Shared UI components (Tailwind, Radix)
│   ├── core-logic/             # Shared TypeScript models and agent routing logic
│   ├── 3d-engine/              # Shared Three.js shader code for Saphira Orbs
│   └── config/                 # Shared ESLint, TypeScript, and Prettier configs
├── infrastructure/
│   ├── terraform/              # IaC for AWS/GCP (if moving off Vercel/Railway)
│   └── docker/                 # Container configs for local dev and microservices
├── .github/
│   ├── workflows/
│   │   ├── mobile-build.yml    # EAS Build pipeline for Expo
│   │   ├── api-deploy.yml      # Backend deployment pipeline
│   │   └── web-deploy.yml      # Vercel deployment pipeline
├── README.md
├── package.json
└── turbo.json                  # Turborepo build pipeline configuration
```

## Key Architectural Decisions

1. **Monorepo (Turborepo):** Keeps backend types strictly locked with the frontend mobile app. If you change a database schema, the mobile app build will fail locally, preventing deployed bugs.
2. **Shared 3D Engine:** Extracting the Three.js GLSL shaders into `packages/3d-engine` means both the web dashboard and the mobile app use the exact same visual representation of Saphira.
3. **Agent Segregation:** The `apps/api/src/agents/` directory houses separate logic files for the Risk Agent, Creative Agent, Logic Agent, and Execution Agent to maintain clean operational boundaries.
