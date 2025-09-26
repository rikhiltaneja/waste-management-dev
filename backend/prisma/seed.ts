import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { WorkerType, ComplaintStatus, UserRole, EventStatus, DonationType } = require("@prisma/client");


async function main() {
  // ------------------------------
  // Admins
  // ------------------------------
  const admin = await prisma.admin.create({
    data: {
      id: "admin1",
      name: "Super Admin",
      email: "admin@wastemgmt.org",
      verified: true,
    },
  });

  // ------------------------------
  // District Admin
  // ------------------------------
  const districtAdmin = await prisma.districtAdmin.create({
    data: {
      id: "distAdmin1",
      govtId: "GOVT12345",
      name: "Ramesh Kumar",
      phoneNumber: "9998887771",
      email: "ramesh@district.org",
      verified: true,
    },
  });

  // ------------------------------
  // District
  // ------------------------------
  const district = await prisma.district.create({
    data: {
      name: "South City",
      state: "Delhi",
      admin: { connect: { id: districtAdmin.id } },
    },
  });

  // ------------------------------
  // Locality + Locality Admin
  // ------------------------------
  const localityAdmin = await prisma.localityAdmin.create({
    data: {
      id: "locAdmin1",
      govtId: "LOC123",
      name: "Sunita Sharma",
      phoneNumber: "8887776661",
      email: "sunita@locality.org",
      verified: true,
    },
  });

  const locality = await prisma.locality.create({
    data: {
      name: "Green Park",
      pincode: "110016",
      district: { connect: { id: district.id } },
      admin: { connect: { id: localityAdmin.id } },
    },
  });

  // ------------------------------
  // Citizens
  // ------------------------------
  const citizen1 = await prisma.citizen.create({
    data: {
      id: "citizen1",
      name: "Anita Verma",
      phoneNumber: "9001112233",
      email: "anita@example.com",
      locality: { connect: { id: locality.id } },
      points: 50,
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      id: "citizen2",
      name: "Mohit Gupta",
      phoneNumber: "9004445566",
      email: "mohit@example.com",
      locality: { connect: { id: locality.id } },
      points: 20,
    },
  });

  // ------------------------------
  // Workers
  // ------------------------------
  const worker1 = await prisma.worker.create({
    data: {
      id: "worker1",
      name: "Rajesh Singh",
      phoneNumber: "9898989898",
      email: "rajesh@workers.org",
      locality: { connect: { id: locality.id } },
      workerType: WorkerType.WASTE_COLLECTOR,
      assignedTasks: 10,
      completedTasks: 8,
      avgDifficulty: 3,
      localityRating: 4,
      citizenRating: 5,
    },
  });

  const worker2 = await prisma.worker.create({
    data: {
      id: "worker2",
      name: "Asha Devi",
      phoneNumber: "9797979797",
      email: "asha@workers.org",
      locality: { connect: { id: locality.id } },
      workerType: WorkerType.SWEEPER,
      assignedTasks: 7,
      completedTasks: 7,
      avgDifficulty: 2,
      localityRating: 5,
      citizenRating: 4,
    },
  });

  // ------------------------------
  // Complaints
  // ------------------------------
  await prisma.complaint.create({
    data: {
      description: "Garbage pile-up near park entrance",
      complaintImage: "park_garbage.jpg",
      citizen: { connect: { id: citizen1.id } },
      status: ComplaintStatus.IN_PROGRESS,
      worker: { connect: { id: worker1.id } },
      localityAdmin: { connect: { id: localityAdmin.id } },
    },
  });

  await prisma.complaint.create({
    data: {
      description: "Overflowing dustbin near bus stand",
      citizen: { connect: { id: citizen2.id } },
      status: ComplaintStatus.PENDING,
    },
  });

  // ------------------------------
  // Training Events
  // ------------------------------
  const event = await prisma.physicalTrainingEvent.create({
    data: {
      title: "Waste Segregation Awareness",
      description: "Workshop on segregating dry and wet waste",
      startDateTime: new Date("2025-10-01T10:00:00Z"),
      endDateTime: new Date("2025-10-01T12:00:00Z"),
      location: "Community Hall, Green Park",
      maxCapacity: 50,
      targetAudience: [UserRole.CITIZEN, UserRole.WORKER],
      status: EventStatus.ACTIVE,
      createdByLocalityAdmin: { connect: { id: localityAdmin.id } },
      locality: { connect: { id: locality.id } },
    },
  });

  // ------------------------------
  // Learning Materials
  // ------------------------------
  await prisma.learningMaterial.create({
    data: {
      title: "Segregation Basics",
      description: "Short course on household waste segregation",
      content: "Video + PDF content",
      videoUrl: "https://youtube.com/example",
      documentUrls: ["segregation-guide.pdf"],
      category: "Waste Management",
      targetAudience: [UserRole.CITIZEN, UserRole.WORKER],
      isPublished: true,
      estimatedDuration: 30,
      createdByAdmin: { connect: { id: admin.id } },
    },
  });

  // ------------------------------
  // Donations
  // ------------------------------
  await prisma.donations.create({
    data: {
      citizen: { connect: { id: citizen1.id } },
      amount: 500,
      type: DonationType.CLEANUP,
    },
  });

  await prisma.donations.create({
    data: {
      citizen: { connect: { id: citizen2.id } },
      amount: 300,
      type: DonationType.RECYCLING,
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });