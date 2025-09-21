/*
  Warnings:

  - The primary key for the `Citizen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `districAdminId` on the `District` table. All the data in the column will be lost.
  - The primary key for the `DistrictAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LocalityAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[districtAdminId]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Locality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Locality` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED', 'DRAFT');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'CITIZEN', 'DISTRICT_ADMIN', 'LOCALITY_ADMIN', 'WORKER');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('CANCELLED', 'REGISTERED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('ABSENT', 'LATE', 'PRESENT');

-- CreateEnum
CREATE TYPE "public"."CompletionStatus" AS ENUM ('CERTIFIED', 'COMPLETED', 'IN_PROGRESS', 'NOT_COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."WorkerType" AS ENUM ('WASTE_COLLECTOR', 'SWEEPER');

-- DropForeignKey
ALTER TABLE "public"."District" DROP CONSTRAINT "District_districAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Locality" DROP CONSTRAINT "Locality_localityAdminId_fkey";

-- DropIndex
DROP INDEX "public"."District_districAdminId_key";

-- AlterTable
ALTER TABLE "public"."Citizen" DROP CONSTRAINT "Citizen_pkey",
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT,
ADD CONSTRAINT "Citizen_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Citizen_id_seq";

-- AlterTable
ALTER TABLE "public"."District" DROP COLUMN "districAdminId",
ADD COLUMN     "districtAdminId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."DistrictAdmin" DROP CONSTRAINT "DistrictAdmin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT,
ADD CONSTRAINT "DistrictAdmin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DistrictAdmin_id_seq";

-- AlterTable
ALTER TABLE "public"."Locality" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL,
ALTER COLUMN "localityAdminId" DROP NOT NULL,
ALTER COLUMN "localityAdminId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."LocalityAdmin" DROP CONSTRAINT "LocalityAdmin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT,
ADD CONSTRAINT "LocalityAdmin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LocalityAdmin_id_seq";

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Worker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localityId" INTEGER NOT NULL,
    "workerType" "public"."WorkerType" NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Complaint" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "complaintImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "citizenId" TEXT NOT NULL,
    "status" "public"."ComplaintStatus" NOT NULL DEFAULT 'PENDING',
    "workerId" TEXT,
    "reviewText" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "workDoneImage" TEXT,
    "localityAdminId" TEXT,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhysicalTrainingEvent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "maxCapacity" INTEGER,
    "targetAudience" "public"."UserRole"[],
    "status" "public"."EventStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByDistrictAdminId" TEXT,
    "createdByLocalityAdminId" TEXT,
    "localityId" INTEGER,

    CONSTRAINT "PhysicalTrainingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhysicalTrainingRegistration" (
    "id" SERIAL NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "citizenId" TEXT,
    "workerId" TEXT,
    "physicalTrainingEventId" INTEGER NOT NULL,

    CONSTRAINT "PhysicalTrainingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhysicalTrainingAttendance" (
    "id" SERIAL NOT NULL,
    "attendanceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."AttendanceStatus" NOT NULL,
    "completionStatus" "public"."CompletionStatus" NOT NULL DEFAULT 'NOT_COMPLETED',
    "certificateUrl" TEXT,
    "citizenId" TEXT,
    "workerId" TEXT,
    "physicalTrainingEventId" INTEGER NOT NULL,

    CONSTRAINT "PhysicalTrainingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningMaterial" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "documentUrls" TEXT[],
    "category" TEXT,
    "targetAudience" "public"."UserRole"[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByAdminId" TEXT NOT NULL,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearningProgress" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "citizenId" TEXT,
    "workerId" TEXT,
    "learningMaterialId" INTEGER NOT NULL,

    CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_phoneNumber_key" ON "public"."Worker"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "public"."Worker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalTrainingRegistration_citizenId_physicalTrainingEven_key" ON "public"."PhysicalTrainingRegistration"("citizenId", "physicalTrainingEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalTrainingRegistration_workerId_physicalTrainingEvent_key" ON "public"."PhysicalTrainingRegistration"("workerId", "physicalTrainingEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalTrainingAttendance_citizenId_physicalTrainingEventI_key" ON "public"."PhysicalTrainingAttendance"("citizenId", "physicalTrainingEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalTrainingAttendance_workerId_physicalTrainingEventId_key" ON "public"."PhysicalTrainingAttendance"("workerId", "physicalTrainingEventId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_citizenId_learningMaterialId_key" ON "public"."LearningProgress"("citizenId", "learningMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_workerId_learningMaterialId_key" ON "public"."LearningProgress"("workerId", "learningMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "District_districtAdminId_key" ON "public"."District"("districtAdminId");

-- AddForeignKey
ALTER TABLE "public"."Worker" ADD CONSTRAINT "Worker_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "public"."Locality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."District" ADD CONSTRAINT "District_districtAdminId_fkey" FOREIGN KEY ("districtAdminId") REFERENCES "public"."DistrictAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Locality" ADD CONSTRAINT "Locality_localityAdminId_fkey" FOREIGN KEY ("localityAdminId") REFERENCES "public"."LocalityAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Citizen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_localityAdminId_fkey" FOREIGN KEY ("localityAdminId") REFERENCES "public"."LocalityAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingEvent" ADD CONSTRAINT "PhysicalTrainingEvent_createdByDistrictAdminId_fkey" FOREIGN KEY ("createdByDistrictAdminId") REFERENCES "public"."DistrictAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingEvent" ADD CONSTRAINT "PhysicalTrainingEvent_createdByLocalityAdminId_fkey" FOREIGN KEY ("createdByLocalityAdminId") REFERENCES "public"."LocalityAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingEvent" ADD CONSTRAINT "PhysicalTrainingEvent_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "public"."Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingRegistration" ADD CONSTRAINT "PhysicalTrainingRegistration_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Citizen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingRegistration" ADD CONSTRAINT "PhysicalTrainingRegistration_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingRegistration" ADD CONSTRAINT "PhysicalTrainingRegistration_physicalTrainingEventId_fkey" FOREIGN KEY ("physicalTrainingEventId") REFERENCES "public"."PhysicalTrainingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingAttendance" ADD CONSTRAINT "PhysicalTrainingAttendance_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Citizen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingAttendance" ADD CONSTRAINT "PhysicalTrainingAttendance_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhysicalTrainingAttendance" ADD CONSTRAINT "PhysicalTrainingAttendance_physicalTrainingEventId_fkey" FOREIGN KEY ("physicalTrainingEventId") REFERENCES "public"."PhysicalTrainingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningMaterial" ADD CONSTRAINT "LearningMaterial_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningProgress" ADD CONSTRAINT "LearningProgress_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Citizen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningProgress" ADD CONSTRAINT "LearningProgress_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningProgress" ADD CONSTRAINT "LearningProgress_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "public"."LearningMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
