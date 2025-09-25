import { Request, Response } from "express";
import { PrismaClient } from "../../prisma/generated/prisma";
import { clerkClient, getAuth } from "@clerk/express";

const prisma = new PrismaClient();

export const createCitizen = async (req: Request, res: Response) => {
  try {
    console.log("Received request body:", req.body);
    const { id, name, phoneNumber, email, localityId } = req.body;

    // Validate first before making any external API calls
    if (!id || !name || !phoneNumber || !email || !localityId) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Attempting to update Clerk metadata for user:", id);
    
    // Update Clerk user metadata first
    try {
      await clerkClient.users.updateUserMetadata(String(id), {
        publicMetadata: {
          role: "Citizen",
        },
      });
      console.log("Clerk metadata updated successfully");
    } catch (clerkErr: any) {
      console.error("Clerk error:", clerkErr);
      if (clerkErr.status === 404) {
        console.log(`User with ID '${id}' does not exist in Clerk`);
        return res.status(404).json({ 
          error: "User not found", 
          message: `User with ID '${id}' does not exist in authentication system`
        });
      }
      return res.status(500).json({ error: "Failed to update user metadata", details: clerkErr.message });
    }

    console.log("Attempting to create citizen in database");
    
    // Create citizen in database
    const citizen = await prisma.citizen.create({
      data: { 
        id: String(id), 
        name, 
        phoneNumber: String(phoneNumber), 
        email, 
        localityId: Number(localityId) 
      },
    });
    
    console.log("Citizen created successfully:", citizen);
    res.status(201).json(citizen);
  } catch (err) {
    console.error("Error creating citizen:", err);
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

export const getCitizenProfile = async (req: Request, res: Response) => {
  const id = req.params.id;
  const auth = getAuth(req);
  if (id !== auth.userId) {
    return res.status(401).json({ error: "Not authorised to access this resource" });
  }

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