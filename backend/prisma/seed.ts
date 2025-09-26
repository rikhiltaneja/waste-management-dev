/// <reference types="node" />
import { PrismaClient, ComplaintStatus, EventStatus, UserRole, RegistrationStatus, AttendanceStatus, CompletionStatus, WorkerType, DonationType } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order matters due to relations)
  await prisma.donations.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.physicalTrainingAttendance.deleteMany();
  await prisma.physicalTrainingRegistration.deleteMany();
  await prisma.physicalTrainingEvent.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.citizen.deleteMany();
  await prisma.locality.deleteMany();
  await prisma.district.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.districtAdmin.deleteMany();
  await prisma.localityAdmin.deleteMany();

  // --------- ADMINS ---------
  const superAdmin = await prisma.admin.create({
    data: {
      id: "admin-1",
      name: "Super Admin",
      email: "admin@wastemgmt.org",
      verified: true,
    },
  });

  const districtAdmin = await prisma.districtAdmin.create({
    data: {
      id: "distadmin-1",
      govtId: "GOVT123",
      name: "Ravi Kumar",
      phoneNumber: "9876543210",
      email: "ravi.kumar@wastemgmt.org",
      verified: true,
    },
  });

  const localityAdmin = await prisma.localityAdmin.create({
    data: {
      id: "locadmin-1",
      govtId: "LOC456",
      name: "Priya Sharma",
      phoneNumber: "8765432109",
      email: "priya.sharma@wastemgmt.org",
      verified: true,
    },
  });

  // --------- DISTRICTS & LOCALITIES ---------
  const bangalore = await prisma.district.create({
    data: {
      name: "Bangalore Urban",
      state: "Karnataka",
      admin: { connect: { id: districtAdmin.id } },
    },
  });

  const koramangala = await prisma.locality.create({
    data: {
      name: "Koramangala",
      pincode: "560034",
      districtId: bangalore.id,
      localityAdminId: "locadmin-1",
    },
    include:{
      admin:true
    }
  });

  const indiranagar = await prisma.locality.create({
    data: {
      name: "Indiranagar",
      pincode: "560038",
      districtId: bangalore.id,
    },
  });

  // --------- CITIZENS ---------
  const citizen1 = await prisma.citizen.create({
    data: {
      id: "citizen-1",
      name: "Arjun Mehta",
      phoneNumber: "9123456789",
      email: "arjun.mehta@example.com",
      localityId: koramangala.id,
      points: 20,
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      id: "citizen-2",
      name: "Sneha Iyer",
      phoneNumber: "9988776655",
      email: "sneha.iyer@example.com",
      localityId: koramangala.id,
      points: 35,
    },
  });

  const citizen3 = await prisma.citizen.create({
    data: {
      id: "citizen-3",
      name: "Rahul Verma",
      phoneNumber: "8899776655",
      email: "rahul.verma@example.com",
      localityId: indiranagar.id,
      points: 10,
    },
  });

  // --------- WORKERS ---------
  const worker1 = await prisma.worker.create({
    data: {
      id: "worker-1",
      name: "Suresh",
      phoneNumber: "9000011111",
      email: "suresh@wastemgmt.org",
      localityId: koramangala.id,
      workerType: WorkerType.WASTE_COLLECTOR,
      assignedTasks: 5,
      completedTasks: 4,
    },
  });

  const worker2 = await prisma.worker.create({
    data: {
      id: "worker-2",
      name: "Lakshmi",
      phoneNumber: "9000022222",
      email: "lakshmi@wastemgmt.org",
      localityId: koramangala.id,
      workerType: WorkerType.SWEEPER,
      assignedTasks: 8,
      completedTasks: 7,
    },
  });

  const worker3 = await prisma.worker.create({
    data: {
      id: "worker-3",
      name: "Manoj",
      phoneNumber: "9000033333",
      email: "manoj@wastemgmt.org",
      localityId: indiranagar.id,
      workerType: WorkerType.WASTE_COLLECTOR,
      assignedTasks: 3,
      completedTasks: 2,
    },
  });

  // --------- COMPLAINTS ---------
  await prisma.complaint.createMany({
    data: [
      {
        description: "Garbage not collected for 3 days",
        citizenId: citizen1.id,
        workerId: worker1.id,
        status: ComplaintStatus.IN_PROGRESS,
        localityAdminId: localityAdmin.id,
      },
      {
        description: "Overflowing dustbin in street corner",
        citizenId: citizen2.id,
        workerId: worker2.id,
        status: ComplaintStatus.PENDING,
      },
      {
        description: "Improper waste segregation in apartment",
        citizenId: citizen3.id,
        workerId: worker3.id,
        status: ComplaintStatus.RESOLVED,
        rating: 4.5,
        reviewText: "Good job by the worker",
      },
    ],
  });

  // --------- PHYSICAL TRAINING EVENTS ---------
  const event1 = await prisma.physicalTrainingEvent.create({
    data: {
      title: "Waste Segregation Workshop",
      description: "Learn about dry and wet waste segregation.",
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      location: "Community Hall, Koramangala",
      maxCapacity: 50,
      targetAudience: ["CITIZEN", "WORKER"],
      createdByDistrictAdminId: districtAdmin.id,
      localityId: koramangala.id,
    },
  });

  const event2 = await prisma.physicalTrainingEvent.create({
    data: {
      title: "Street Sweeping Training",
      description: "Best practices for safe and efficient sweeping.",
      startDateTime: new Date(),
      location: "Indiranagar Park",
      targetAudience: [UserRole.WORKER],
      createdByLocalityAdminId: localityAdmin.id,
      localityId: indiranagar.id,
    },
  });

  // --------- REGISTRATIONS & ATTENDANCE ---------
  await prisma.physicalTrainingRegistration.createMany({
    data: [
      { citizenId: citizen1.id, physicalTrainingEventId: event1.id },
      { workerId: worker1.id, physicalTrainingEventId: event1.id },
      { workerId: worker2.id, physicalTrainingEventId: event2.id },
    ],
  });

  await prisma.physicalTrainingAttendance.createMany({
    data: [
      {
        citizenId: citizen1.id,
        physicalTrainingEventId: event1.id,
        status: AttendanceStatus.PRESENT,
        completionStatus: CompletionStatus.COMPLETED,
      },
      {
        workerId: worker1.id,
        physicalTrainingEventId: event1.id,
        status: AttendanceStatus.LATE,
        completionStatus: CompletionStatus.IN_PROGRESS,
      },
    ],
  });

  // --------- LEARNING MATERIALS & PROGRESS ---------
  const material1 = await prisma.learningMaterial.create({
    data: {
      title: "Basics of Recycling",
      description: "Introduction to recycling household waste",
      content: "Video and PDF materials included",
      videoUrl: "https://example.com/recycling-basics",
      documentUrls: ["https://example.com/guide.pdf"],
      targetAudience: [UserRole.CITIZEN, UserRole.WORKER],
      estimatedDuration: 30,
      createdByAdminId: superAdmin.id,
      isPublished: true,
    },
  });

  await prisma.learningProgress.createMany({
    data: [
      { citizenId: citizen2.id, learningMaterialId: material1.id, progressPercent: 50 },
      { workerId: worker2.id, learningMaterialId: material1.id, progressPercent: 100, completedAt: new Date() },
    ],
  });

  // --------- DONATIONS ---------
  await prisma.donations.createMany({
    data: [
      {
        citizenId: citizen1.id,
        amount: 500,
        type: DonationType.RECYCLING,
      },
      {
        citizenId: citizen2.id,
        amount: 1000,
        type: DonationType.PLANTATION,
      },
    ],
  });

  console.log("✅ Seed data inserted successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });