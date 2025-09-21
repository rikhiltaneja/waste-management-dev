/// <reference types="node" />
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.complaint.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.citizen.deleteMany();
  await prisma.locality.deleteMany();
  await prisma.district.deleteMany();

  // Create Districts
  const bangalore = await prisma.district.create({
    data: {
      name: "Bangalore Urban",
      state: "Karnataka",
    },
  });

  const mysore = await prisma.district.create({
    data: {
      name: "Mysore",
      state: "Karnataka",
    },
  });

  await prisma.locality.createMany({
    data: [
      { name: "Koramangala", pincode: "560034", districtId: bangalore.id },
      { name: "Indiranagar", pincode: "560038", districtId: bangalore.id },
      { name: "VV Mohalla", pincode: "570002", districtId: mysore.id },
    ],
  });

  console.log("Dummy Districts and Localities created ✅");
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
