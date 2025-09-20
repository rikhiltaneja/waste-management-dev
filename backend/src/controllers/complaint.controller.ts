import { Request, Response } from "express";
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const createComplaint = async (req: Request, res: Response) => {
  const { description, citizenId } = req.body as any;
  const file = (req as any).file;

  if (!description || !citizenId) {
    return res.status(400).json({ error: "description and citizenId required" });
  }

  if (!file) {
    return res.status(400).json({ error: "complaintImage file required" });
  }

  const complaintImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  try {
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId }, // No need to convert to Number
      include: {
        locality: {
          include: {
            admin: true,
          },
        },
      },
    });

    if (!citizen) {
      return res.status(404).json({ error: "Citizen not found" });
    }

    if (!citizen.locality.admin) {
      return res.status(400).json({
        error:
          "No locality admin assigned to this citizen's locality. Please contact system administrator.",
      });
    }

    const complaint = await prisma.complaint.create({
      data: {
        description,
        complaintImage,
        citizenId, 
        localityAdminId: citizen.locality.admin.id, 
      },
      include: {
        citizen: true,
        localityAdmin: true,
        worker: true,
      },
    });

    res.status(201).json(complaint);
  } catch (e: any) {
    console.error("Error creating complaint:", e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteComplaint = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID' });

  try {
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    await prisma.complaint.delete({ where: { id } });
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};