import { createApp } from './serverApp.js';
import { prisma } from './db/prisma.js';

async function main() {
  const { httpServer } = await createApp();
  const port = process.env.PORT || 4000;
  httpServer.listen(Number(port), '0.0.0.0', () => {
    console.log('Server listening on', port);
  });
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
