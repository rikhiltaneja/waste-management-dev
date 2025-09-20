import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma';
const prisma = new PrismaClient();

export const createLocalityAdmin = async (req: Request, res: Response) => {
  const { id, govtId, name, phoneNumber, email, localityId } = req.body;
  
  if (!id || !govtId || !name || !phoneNumber || !email || !localityId) {
    return res.status(400).json({ error: 'All fields required (id, govtId, name, phoneNumber, email, localityId)' });
  }

  try {
    const admin = await prisma.localityAdmin.create({
      data: { 
        id, 
        govtId, 
        name, 
        phoneNumber: String(phoneNumber), 
        email 
      }
    });

    await prisma.locality.update({
      where: { id: localityId },
      data: { localityAdminId: admin.id }
    });

    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getLocalityAdminProfile = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.localityAdmin.findUnique({ where: { id } });
    if (!admin) return res.status(404).json({ error: 'Locality admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const assignWorkerToComplaint = async (req: Request, res: Response) => {
  try {
    const complaintId = parseInt(req.params.complaintId);
    const { workerId, localityAdminId } = req.body;

    if (!workerId) return res.status(400).json({ error: "workerId required" });
    if (!localityAdminId)
      return res.status(400).json({ error: "localityAdminId required" });

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        citizen: {
          include: { locality: true },
        },
      },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const complaintLocalityId = complaint.citizen.localityId;

    const localityAdmin = await prisma.localityAdmin.findUnique({
      where: { id: localityAdminId }, 
      include: { locality: true },
    });

    if (!localityAdmin || !localityAdmin.locality) {
      return res.status(404).json({ error: "Locality admin not found" });
    }

    if (localityAdmin.locality.id !== complaintLocalityId) {
      return res.status(403).json({ error: "Not authorized to assign this complaint" });
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId }, 
    });

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    if (worker.localityId !== complaintLocalityId) {
      return res.status(400).json({ error: "Worker must belong to the same locality" });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        workerId, 
        localityAdminId, 
        status: "IN_PROGRESS",
      },
    });

    return res.json({ message: "Worker assigned", complaint: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getLocalityComplaints = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.localityAdmin.findUnique({
      where: { id },
      include: { 
        locality: { 
          include: { 
            citizens: { 
              include: { 
                complaints: {
                  include: { worker: true, localityAdmin: true }
                }
              } 
            } 
          } 
        } 
      },
    });

    if (!admin) return res.status(404).json({ error: 'Locality admin not found' });

    const complaints = admin.locality?.citizens.flatMap(citizen => citizen.complaints) || [];
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getLocalityWorkers = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.localityAdmin.findUnique({
      where: { id },
      include: { locality: { include: { workers: true } } },
    });

    if (!admin) return res.status(404).json({ error: 'Locality admin not found' });

    const workers = admin.locality?.workers || [];
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const deleteLocalityAdmin = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    await prisma.localityAdmin.delete({ where: { id } });
    res.json({ message: 'Locality admin deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Locality admin not found' });
  }
};