import { Request, Response } from "express";
import { PrismaClient } from "../../prisma/generated/prisma";
import { clerkClient, getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const createCitizen = async (req: Request, res: Response) => {
  const { id, name, phoneNumber, email, localityId } = req.body;

  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      role: "Citizen",
    },
  });

  if (!id || !name || !phoneNumber || !email || !localityId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const citizen = await prisma.citizen.create({
      data: { id, name, phoneNumber: String(phoneNumber), email, localityId },
    });
    res.status(201).json(citizen);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getCitizenProfile = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const citizen = await prisma.citizen.findUnique({ where: { id } });
    if (!citizen) return res.status(404).json({ error: "Citizen not found" });
    res.json(citizen);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getCitizenComplaints = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const complaints = await prisma.complaint.findMany({
      where: { citizenId: id },
      include: { localityAdmin: true, worker: true },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const updateCitizenPoints = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { points } = req.body;

  if (points == null) {
    return res.status(400).json({ error: "Points value is required" });
  }

  try {
    const citizen = await prisma.citizen.update({
      where: { id },
      data: { points },
    });
    res.json({ message: "Points updated", citizen });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const updateCitizenReview = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { complaintId, review, rating } = req.body;

  if (!complaintId || !review || rating === undefined) {
    return res
      .status(400)
      .json({ error: "complaintId, review, and rating are required" });
  }

  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });
    if (
      !complaint ||
      complaint.citizenId !== id ||
      complaint.status !== "RESOLVED"
    ) {
      return res
        .status(400)
        .json({ error: "Complaint not found or not resolved yet" });
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { reviewText: review, rating: Number(rating) },
    });
    res.json({ message: "Review and rating updated" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getCitizenComplaintStatus = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    const complaints = await prisma.complaint.findMany({
      where: { citizenId: id },
      select: {
        id: true,
        description: true,
        status: true,
        createdAt: true,
        complaintImage: true,
        reviewText: true,
        worker: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const deleteCitizen = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const citizen = await prisma.citizen.findUnique({
      where: { id },
      include: { complaints: { where: { status: { not: "RESOLVED" } } } },
    });

    if (!citizen) {
      return res.status(404).json({ error: "Citizen not found" });
    }

    if (citizen.complaints.length > 0) {
      return res.status(400).json({
        error: `Cannot delete citizen. Citizen has ${citizen.complaints.length} ongoing complaint(s). Please resolve complaints first.`,
      });
    }

    await prisma.citizen.delete({ where: { id } });
    res.json({ message: "Citizen deleted successfully" });
  } catch (error) {
    console.error("Error deleting citizen:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
