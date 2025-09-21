import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";
const prisma = new PrismaClient();

export const createDistrictAdmin = async (req: Request, res: Response) => {
  const { id, govtId, name, phoneNumber, email, districtId } = req.body;
  
  if (!id || !govtId || !name || !phoneNumber || !email || !districtId) {
    return res.status(400).json({ error: 'All fields required (id, govtId, name, phoneNumber, email, districtId)' });
  }

  try {
    const admin = await prisma.districtAdmin.create({
      data: {
        id, 
        govtId,
        name,
        phoneNumber: phoneNumber.toString(),
        email
      }
    });

    await prisma.district.update({
      where: { id: districtId },
      data: { districtAdminId: admin.id }
    });

    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getDistrictAdminProfile = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.districtAdmin.findUnique({ where: { id } });
    if (!admin) return res.status(404).json({ error: 'District admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getDistrictComplaints = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.districtAdmin.findUnique({
      where: { id },
      include: { district: { include: { localities: { include: { citizens: { include: { complaints: true } } } } } } },
    });

    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const complaints = admin.district?.localities.flatMap(loc =>
      loc.citizens.flatMap(cit => cit.complaints)
    );

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const getDistrictLocalityAdmins = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    const admin = await prisma.districtAdmin.findUnique({
      where: { id },
      include: { district: { include: { localities: { include: { admin: true } } } } },
    });

    if (!admin) return res.status(404).json({ error: 'District admin not found' });

    const localityAdmins = admin.district?.localities
      .map(locality => locality.admin)
      .filter(admin => admin !== null) || [];

    res.json(localityAdmins);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
};

export const deleteDistrictAdmin = async (req: Request, res: Response) => {
  const id = req.params.id; 
  
  try {
    await prisma.districtAdmin.delete({ where: { id } });
    res.json({ message: 'District admin deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'District admin not found' });
  }
};