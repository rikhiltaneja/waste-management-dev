import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';
const prisma = new PrismaClient();

export const createWorker = async (req: Request, res: Response) => {
  const { id, name, phoneNumber, email, localityId, workerType } = req.body;
  
  if (!id || !name || !phoneNumber || !email || !localityId || !workerType) {
    return res.status(400).json({ error: 'All fields required (id, name, phoneNumber, email, localityId, workerType)' });
  }

  const parsedLocalityId = Number(localityId);
  if (!Number.isInteger(parsedLocalityId)) {
    return res.status(400).json({ error: 'localityId must be an integer' });
  }

  try {
    const worker = await prisma.worker.create({
      data: {
        id, 
        name,
        phoneNumber: String(phoneNumber),
        email,
        workerType,
        locality: { connect: { id: parsedLocalityId } },
      },
    });
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getWorkerProfile = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const worker = await prisma.worker.findUnique({ where: { id } });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getAssignedComplaints = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const complaints = await prisma.complaint.findMany({ where: { workerId: id } });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const updateWorkerIncentive = async (req: Request, res: Response) => {
  const id = req.params.id; 
  const { bonus } = req.body;
  
  if (bonus == null) return res.status(400).json({ error: 'Bonus required' });

  try {
    // Note: You might want to add a bonus/points field to Worker model
    const worker = await prisma.worker.findUnique({ where: { id } });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    
    // For now, just return success - you can extend this when you add bonus field
    res.json({ message: 'Incentive updated', worker });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const resolveComplaintWithPhoto = async (req: Request, res: Response) => {
  const workerId = req.params.id; 
  const { complaintId } = req.body;
  const file = (req as any).file;

  if (!file) return res.status(400).json({ error: "File required" });
  if (!complaintId) return res.status(400).json({ error: "ComplaintId required" });

  const workDoneImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: Number(complaintId) },
      include: { worker: true }
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (complaint.workerId !== workerId) {
      return res.status(403).json({ error: "Complaint is not assigned to this worker" });
    }

    const updated = await prisma.complaint.update({
      where: { id: Number(complaintId) },
      data: { status: "RESOLVED", workDoneImage },
    });
    
    if (updated && (updated as any).reviewText == null) {
      const { reviewText, ...rest } = (updated as any);
      return res.json(rest);
    }
    res.json(updated);
  } catch (error) {
    console.error('Error in resolveComplaintWithPhoto:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteWorker = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    await prisma.worker.delete({ where: { id } });
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Worker not found' });
  }
};