import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';
const prisma = new PrismaClient();

export const createCitizen = async (req: Request, res: Response) => {
  const { name, phoneNumber, email, localityId } = req.body;
  if (!name || !phoneNumber || !email || !localityId)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const citizen = await prisma.citizen.create({
      data: { name, phoneNumber: String(phoneNumber), email, localityId },
    });
    res.status(201).json(citizen);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getCitizenProfile = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const citizen = await prisma.citizen.findUnique({ where: { id } });
  if (!citizen) return res.status(404).json({ error: 'Citizen not found' });
  res.json(citizen);
};

export const getCitizenComplaints = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const complaints = await prisma.complaint.findMany({
    where: { citizenId: id },
    include: { localityAdmin: true, worker: true },
  });
  res.json(complaints);
};

export const updateCitizenPoints = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { points } = req.body;
  if (points == null)
    return res.status(400).json({ error: 'Points value is required' });

  const citizen = await prisma.citizen.update({
    where: { id },
    data: { points },
  });
  res.json({ message: 'Points updated', citizen });
};

export const updateCitizenReview = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { complaintId, review, rating } = req.body;

  if (!complaintId || !review || rating === undefined) {
    return res.status(400).json({ error: 'complaintId, review, and rating are required' });
  }

  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint || complaint.citizenId !== id || complaint.status !== 'RESOLVED') {
    return res.status(400).json({ error: 'Complaint not found or not resolved yet' });
  }

  await prisma.complaint.update({
    where: { id: complaintId },
    data: { reviewText: review, rating: Number(rating) },
  });
  res.json({ message: 'Review and rating updated' });
};

export const getCitizenComplaintStatus = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
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
          phoneNumber: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(complaints);
};

export const deleteCitizen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid citizen ID' });

  try {
    // First check if citizen exists
    const citizen = await prisma.citizen.findUnique({ 
      where: { id },
      include: { complaints: { where: { status: { not: 'RESOLVED' } } } }
    });
    
    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    // Check if citizen has ongoing (non-resolved) complaints
    if (citizen.complaints.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete citizen. Citizen has ${citizen.complaints.length} ongoing complaint(s). Please resolve complaints first.` 
      });
    }

    // Hard delete: actually delete the citizen
    await prisma.citizen.delete({ where: { id } });
    
    res.json({ message: 'Citizen deleted successfully' });
  } catch (error) {
    console.error("Error deleting citizen:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


