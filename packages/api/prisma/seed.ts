import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default roulette configuration
  const rouletteConfig = await prisma.rouletteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      segments: 8,
      probabilities: {
        0: 0.125, // 12.5% chance
        1: 0.125,
        2: 0.125,
        3: 0.125,
        4: 0.125,
        5: 0.125,
        6: 0.125,
        7: 0.125,
      },
    },
  });

  // Create default tasks
  const tasks = [
    {
      title: 'Daily Login',
      description: 'Log in to the app',
      type: 'DAILY' as const,
      reward: 100,
    },
    {
      title: 'First Spin',
      description: 'Make your first spin',
      type: 'DAILY' as const,
      reward: 50,
    },
    {
      title: 'Win 3 Times',
      description: 'Win 3 roulette spins',
      type: 'DAILY' as const,
      reward: 200,
    },
    {
      title: 'Invite Friend',
      description: 'Invite a friend to the app',
      type: 'SPECIAL' as const,
      reward: 500,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.title },
      update: task,
      create: {
        id: task.title,
        ...task,
      },
    });
  }

  // Create shop items
  const shopItems = [
    {
      name: '100 Coins',
      description: 'Get 100 coins',
      type: 'COINS' as const,
      price: 100,
      currency: 'TON' as const,
    },
    {
      name: '500 Coins',
      description: 'Get 500 coins',
      type: 'COINS' as const,
      price: 450,
      currency: 'TON' as const,
    },
    {
      name: '1000 Coins',
      description: 'Get 1000 coins',
      type: 'COINS' as const,
      price: 800,
      currency: 'TON' as const,
    },
    {
      name: '5 Tickets',
      description: 'Get 5 roulette tickets',
      type: 'TICKETS' as const,
      price: 4500, // 5 * 900 coins
      currency: 'COINS' as const,
    },
    {
      name: 'Starter Pack',
      description: 'Perfect for beginners',
      type: 'STARTER_PACK' as const,
      price: 1000,
      currency: 'TON' as const,
    },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { id: item.name },
      update: item,
      create: {
        id: item.name,
        ...item,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });