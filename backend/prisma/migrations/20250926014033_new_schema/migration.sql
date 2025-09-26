-- CreateEnum
CREATE TYPE "public"."DonationType" AS ENUM ('CLEANUP', 'RECYCLING', 'SAFETY', 'AWARENESS', 'PLANTATION', 'ENERGY', 'OTHERS');

-- AlterTable
ALTER TABLE "public"."Worker" ADD COLUMN     "assignedTasks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "avgDifficulty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "citizenRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedTasks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "localityRating" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Donations" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "citizenId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "public"."DonationType" NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Donations" ADD CONSTRAINT "Donations_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."Citizen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
