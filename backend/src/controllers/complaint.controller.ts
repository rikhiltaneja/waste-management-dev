import { Request, Response } from "express";
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  auth?: any;
}

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
      where: { id: citizenId },
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

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const metadata: { role: string } = req.auth?.sessionClaims?.metadata as { role: string };
    const userId = req.auth?.userId;

    if (!metadata?.role || !userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    let whereCondition: any = {};
    let complaints;
    let total;

    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    switch (metadata.role) {
      case "Citizen":
        whereCondition.citizenId = userId;
        
        [complaints, total] = await Promise.all([
          prisma.complaint.findMany({
            where: whereCondition,
            include: {
              citizen: {
                select: { id: true, name: true }
              },
              localityAdmin: {
                select: { id: true, name: true }
              },
              worker: {
                select: { id: true, name: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.complaint.count({ where: whereCondition })
        ]);
        break;

      case "LocalityAdmin":
        // Locality admins can see complaints assigned to them
        whereCondition.localityAdminId = userId;
        
        [complaints, total] = await Promise.all([
          prisma.complaint.findMany({
            where: whereCondition,
            include: {
              citizen: {
                select: { id: true, name: true }
              },
              localityAdmin: {
                select: { id: true, name: true }
              },
              worker: {
                select: { id: true, name: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.complaint.count({ where: whereCondition })
        ]);
        break;

      case "Admin":
        // Admins can see all complaints
        [complaints, total] = await Promise.all([
          prisma.complaint.findMany({
            where: whereCondition,
            include: {
              citizen: {
                select: { id: true, name: true }
              },
              localityAdmin: {
                select: { id: true, name: true }
              },
              worker: {
                select: { id: true, name: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
          }),
          prisma.complaint.count({ where: whereCondition })
        ]);
        break;

      default:
        return res.status(403).json({ error: "Access denied for this role" });
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const metadata: { role: string } = req.auth?.sessionClaims?.metadata as { role: string };
    const userId = req.auth?.userId;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid complaint ID' });
    }

    if (!metadata?.role || !userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        citizen: {
          select: { id: true, name: true, phoneNumber: true, email: true }
        },
        localityAdmin: {
          select: { id: true, name: true, phoneNumber: true, email: true }
        },
        worker: {
          select: { id: true, name: true, phoneNumber: true, email: true }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check if user has permission to view this complaint
    const canView = 
      metadata.role === "Admin" ||
      (metadata.role === "Citizen" && complaint.citizenId === userId) ||
      (metadata.role === "LocalityAdmin" && complaint.localityAdminId === userId);

    if (!canView) {
      return res.status(403).json({ error: "Access denied to view this complaint" });
    }

    res.json(complaint);

  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, assignedWorkerId } = req.body;
    const metadata: { role: string } = req.auth?.sessionClaims?.metadata as { role: string };
    const userId = req.auth?.userId;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid complaint ID' });
    }

    if (!metadata?.role || !userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Only admins and locality admins can update complaint status
    if (metadata.role !== "Admin" && metadata.role !== "LocalityAdmin") {
      return res.status(403).json({ error: "Access denied to update complaint status" });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Locality admins can only update complaints assigned to them
    if (metadata.role === "LocalityAdmin" && complaint.localityAdminId !== userId) {
      return res.status(403).json({ error: "Access denied to update this complaint" });
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (assignedWorkerId) {
      updateData.workerId = assignedWorkerId;
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: updateData,
      include: {
        citizen: {
          select: { id: true, name: true }
        },
        localityAdmin: {
          select: { id: true, name: true }
        },
        worker: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(updatedComplaint);

  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};