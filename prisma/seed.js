const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  // Read data from data.json
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // Insert data into the database
  for (const item of data) {
    await prisma.documents.create({
      data: item,
    });
    
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
