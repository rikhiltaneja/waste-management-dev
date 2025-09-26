import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";
const prisma = new PrismaClient();

export const getLocalities = async (req: Request, res: Response) => {
    try {
        const localities = await prisma.locality.findMany({
            include: {
                admin: true,
            },
        });

        if (!localities || localities.length === 0) {
            return res.status(404).json({ error: "No localities found" });
        }

        res.json(localities);
    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err });
    }
};

export const getCitizenLocality = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const citizen = await prisma.citizen.findUnique({
            where: { id },
            include: {
                locality: true,
            },
        });

        if (!citizen) {
            return res.status(404).json({ error: 'Citizen not found' });
        }

        if (!citizen.locality) {
            return res.status(404).json({ error: 'Locality not found for this citizen' });
        }

        res.json(citizen.locality);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err });
    }
};