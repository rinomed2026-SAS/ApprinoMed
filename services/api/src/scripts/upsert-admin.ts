import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const result: { email?: string; password?: string; name?: string } = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (!next) continue;

    if (arg === '--email') {
      result.email = next;
      index += 1;
      continue;
    }

    if (arg === '--password') {
      result.password = next;
      index += 1;
      continue;
    }

    if (arg === '--name') {
      result.name = next;
      index += 1;
    }
  }

  return result;
}

async function run() {
  const { email, password, name } = parseArgs();

  if (!email || !password) {
    throw new Error('Usage: npx tsx src/scripts/upsert-admin.ts --email <email> --password <password> [--name <name>]');
  }

  const passwordHash = await hashPassword(password);
  const resolvedName = name?.trim() || email.split('@')[0] || 'Admin';

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name: resolvedName,
      role: 'ADMIN',
      passwordHash
    },
    create: {
      email: email.toLowerCase(),
      name: resolvedName,
      role: 'ADMIN',
      passwordHash
    }
  });

  console.log(`Admin ready: ${user.email} (${user.role})`);
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });