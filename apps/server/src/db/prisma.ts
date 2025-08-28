import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export interface StoredMessage {
  id: string;
  userId: string;
  displayName: string;
  nameColor: string;
  messageColor: string;
  text: string;
  timestamp: bigint;
}

export async function getRecentMessages(limit = 100): Promise<StoredMessage[]> {
  const rows = await prisma.message.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
  return rows.sort(
    (a: StoredMessage, b: StoredMessage) =>
      Number(a.timestamp) - Number(b.timestamp),
  );
}

export interface NewMessage {
  id: string;
  userId: string;
  displayName: string;
  nameColor: string;
  messageColor: string;
  text: string;
  timestamp: number;
}

export async function addMessage(data: NewMessage): Promise<void> {
  await prisma.message.create({
    data: {
      ...data,
      timestamp: BigInt(data.timestamp),
    },
  });
  // prune older messages keeping last 100
  const count = await prisma.message.count();
  if (count > 120) {
    const toDelete = await prisma.message.findMany({
      orderBy: { timestamp: 'asc' },
      skip: 100,
    });
    const ids = toDelete.map((m: StoredMessage) => m.id);
    if (ids.length) {
      await prisma.message.deleteMany({ where: { id: { in: ids } } });
    }
  }
}
