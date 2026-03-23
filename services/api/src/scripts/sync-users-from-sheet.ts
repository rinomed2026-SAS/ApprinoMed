// CLI script — delegates to lib/sync-users.ts
// Run with: npm run users:sync
import dotenv from 'dotenv';
dotenv.config();

import { syncUsersFromSheet } from '../lib/sync-users.js';
import { prisma } from '../lib/prisma.js';

syncUsersFromSheet()
  .then((stats) => {
    console.log('Google Sheet sync completed');
    console.table(stats);
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
