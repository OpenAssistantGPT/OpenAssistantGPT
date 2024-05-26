// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gptModels = [
  { id: 'gpt-2', name: 'gpt-2' },
  { id: 'gpt-2-medium', name: 'gpt-2-medium' },
  { id: 'gpt-2-large', name: 'gpt-2-large' },
  { id: 'gpt-2-xl', name: 'gpt-2-xl' },
  { id: 'gpt-3', name: 'gpt-3' },
  { id: 'gpt-3-davinci', name: 'gpt-3-davinci' },
  { id: 'gpt-3-curie', name: 'gpt-3-curie' },
  { id: 'gpt-3-babbage', name: 'gpt-3-babbage' },
  { id: 'gpt-3-ada', name: 'gpt-3-ada' },
  { id: 'gpt-4', name: 'gpt-4' },
  { id: 'gpt-4-turbo', name: 'gpt-4-turbo' },
  { id: 'gpt-4o', name: 'gpt-4o' }
];

async function main() {
  for (const model of gptModels) {
    await prisma.chatbotModel.upsert({
      where: { id: model.id },
      update: {},
      create: {
        id: model.id,
        name: model.name,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
