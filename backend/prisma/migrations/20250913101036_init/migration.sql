-- CreateTable
CREATE TABLE "public"."Citizen" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "localityId" INTEGER NOT NULL,

    CONSTRAINT "Citizen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."District" (
    "id" SERIAL NOT NULL,
    "districAdminId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Locality" (
    "id" SERIAL NOT NULL,
    "districtId" INTEGER NOT NULL,
    "localityAdminId" INTEGER NOT NULL,

    CONSTRAINT "Locality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DistrictAdmin" (
    "id" SERIAL NOT NULL,
    "govtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DistrictAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LocalityAdmin" (
    "id" SERIAL NOT NULL,
    "govtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LocalityAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_phoneNumber_key" ON "public"."Citizen"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_email_key" ON "public"."Citizen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "District_districAdminId_key" ON "public"."District"("districAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Locality_localityAdminId_key" ON "public"."Locality"("localityAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictAdmin_govtId_key" ON "public"."DistrictAdmin"("govtId");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictAdmin_phoneNumber_key" ON "public"."DistrictAdmin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictAdmin_email_key" ON "public"."DistrictAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityAdmin_govtId_key" ON "public"."LocalityAdmin"("govtId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityAdmin_phoneNumber_key" ON "public"."LocalityAdmin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LocalityAdmin_email_key" ON "public"."LocalityAdmin"("email");

-- AddForeignKey
ALTER TABLE "public"."Citizen" ADD CONSTRAINT "Citizen_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "public"."Locality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."District" ADD CONSTRAINT "District_districAdminId_fkey" FOREIGN KEY ("districAdminId") REFERENCES "public"."DistrictAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Locality" ADD CONSTRAINT "Locality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Locality" ADD CONSTRAINT "Locality_localityAdminId_fkey" FOREIGN KEY ("localityAdminId") REFERENCES "public"."LocalityAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
