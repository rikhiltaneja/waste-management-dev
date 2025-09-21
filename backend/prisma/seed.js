"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const prisma_1 = require("./generated/prisma");
const prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.complaint.deleteMany();
        yield prisma.worker.deleteMany();
        yield prisma.citizen.deleteMany();
        yield prisma.locality.deleteMany();
        yield prisma.district.deleteMany();
        // Create Districts
        const bangalore = yield prisma.district.create({
            data: {
                name: "Bangalore Urban",
                state: "Karnataka",
            },
        });
        const mysore = yield prisma.district.create({
            data: {
                name: "Mysore",
                state: "Karnataka",
            },
        });
        yield prisma.locality.createMany({
            data: [
                { name: "Koramangala", pincode: "560034", districtId: bangalore.id },
                { name: "Indiranagar", pincode: "560038", districtId: bangalore.id },
                { name: "VV Mohalla", pincode: "570002", districtId: mysore.id },
            ],
        });
        console.log("Dummy Districts and Localities created ✅");
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
