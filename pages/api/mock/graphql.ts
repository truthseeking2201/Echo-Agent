import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { resolvers, nextSignal, updatePortfolioPnL } from '../../../mocks/graphql/resolvers';

// Read the schema
const schemaPath = path.join(process.cwd(), 'mocks/graphql/schema.graphql');
const typeDefs = fs.readFileSync(schemaPath, 'utf8');

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // Add mocks for demo
  context: () => ({
    isMockMode: true
  })
});

// Start the server
const startServer = apolloServer.start();

// Set up fake real-time updates
let signalInterval: NodeJS.Timeout | null = null;
let portfolioInterval: NodeJS.Timeout | null = null;

// Start the "real-time" updates when in mock mode
if (process.env.NODE_ENV === 'mock' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  signalInterval = setInterval(() => {
    const newSignal = nextSignal();
    if (newSignal) {
      console.log(`[MGS] Injected new signal: ${newSignal.id} for ${newSignal.token}`);
    }
  }, 7000); // Every 7 seconds
  
  portfolioInterval = setInterval(() => {
    const delta = (Math.random() * 2 - 0.5) * 0.5; // Random delta between -0.25% and +0.75%
    const newPoint = updatePortfolioPnL(delta);
    if (newPoint) {
      console.log(`[MGS] Updated portfolio: ${newPoint.v}%`);
    }
  }, 3000); // Every 3 seconds
}

// Cleanup on exit
process.on('exit', () => {
  if (signalInterval) clearInterval(signalInterval);
  if (portfolioInterval) clearInterval(portfolioInterval);
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  
  await startServer;
  await apolloServer.createHandler({
    path: '/api/mock/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};