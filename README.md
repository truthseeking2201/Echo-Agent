# Echo Agent - Demo Application

A demonstration application for the Echo automated trading agent. This demo recreates the core user experience without connecting to real chains, wallets, or APIs.

## Features

- Live-looking Social-Alpha signal stream
- One-click Auto-Trade with transparent rationale
- PnL tracking and portfolio visualization
- Adjustable risk controls
- Monte Carlo simulation for risk analysis

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the directory
cd echo-agent-demo

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **State Management:** Zustand
- **Charts:** Recharts
- **GraphQL:** Apollo Server/Client
- **Virtualization:** react-window
- **Animation:** Framer Motion

## Mock Data Generation

The demo uses synthetic data generated with seeded random number generators to ensure reproducible results. Data is generated during installation and can be regenerated with:

```bash
pnpm run mock:gen
```

## Project Structure

```
/
├── mocks/                    # Mock data generation and API
│   ├── data/                 # Generated JSON fixtures
│   ├── generators/           # Data generation scripts
│   ├── graphql/              # Schema and resolvers
│   └── templates/            # Signal rationale templates
├── pages/                    # Next.js pages
│   ├── api/                  # API routes
│   ├── _app.tsx              # Application wrapper
│   ├── dashboard.tsx         # Portfolio overview
│   ├── signals.tsx           # Signal feed
│   ├── logs.tsx              # Trade history
│   ├── settings.tsx          # Risk controls
│   └── simulate.tsx          # Monte Carlo simulator
├── src/
│   ├── components/           # React components
│   └── store/                # Zustand state management
└── styles/                   # Global styles
```

## Demo Mode

This application runs entirely in demo mode with synthetic data. No real funds are exchanged, and no blockchain transactions are executed.

Key features:
- All numbers, hashes, addresses, prices, and charts are synthetic
- Wallet connection is simulated
- Trade execution is mocked with artificial delay
- Portfolio value is generated using seeded RNG

## License

This project is licensed under the MIT License - see the LICENSE file for details.