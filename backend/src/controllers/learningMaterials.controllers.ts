import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const createLearningMaterial = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      content,
      videoUrl,
      documentUrls,
      category,
      targetAudience,
      estimatedDuration,
      isPublished
    } = req.body;

    if (!title || !description || !content || !targetAudience) {
      return res.status(400).json({
        error: {
          message: 'title, description, content, and targetAudience are required',
          code: 'MISSING_REQUIRED_FIELDS'
        }
      });
    }

    const validRoles = ['CITIZEN', 'WORKER', 'DISTRICT_ADMIN', 'LOCALITY_ADMIN', 'ADMIN'];
    if (!Array.isArray(targetAudience) || !targetAudience.every(role => validRoles.includes(role))) {
      return res.status(400).json({
        error: {
          message: 'Invalid targetAudience',
          code: 'INVALID_TARGET_AUDIENCE'
        }
      });
    }

    const material = await prisma.learningMaterial.create({
      data: {
        title,
        description,
        content,
        videoUrl,
        documentUrls: documentUrls || [],
        category,
        targetAudience,
        estimatedDuration: estimatedDuration || 0,
        isPublished: isPublished || false,
        createdByAdminId: "1"
      }
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating learning material:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create learning material',
        code: 'CREATE_MATERIAL_ERROR'
      }
    });
  }
};

export const getLearningMaterials = async (req: Request, res: Response) => {
  try {
    const { category, targetAudience, published, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (targetAudience) {
      where.targetAudience = {
        has: targetAudience
      };
    }

    if (published !== undefined) {
      where.isPublished = published === 'true';
    }

    const [materials, total] = await Promise.all([
      prisma.learningMaterial.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          createdByAdmin: {
            select: { id: true, name: true }
          },
          _count: {
            select: {
              progress: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.learningMaterial.count({ where })
    ]);

    res.json({
      materials,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching learning materials:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch learning materials',
        code: 'FETCH_MATERIALS_ERROR'
      }
    });
  }
};

export const getLearningMaterialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const material = await prisma.learningMaterial.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdByAdmin: {
          select: { id: true, name: true, email: true }
        },
        progress: {
          include: {
            citizen: {
              select: { id: true, name: true }
            },
            worker: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Learning material not found',
          code: 'MATERIAL_NOT_FOUND'
        }
      });
    }

    res.json(material);
  } catch (error) {
    console.error('Error fetching learning material:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch learning material',
        code: 'FETCH_MATERIAL_ERROR'
      }
    });
  }
};

export const updateLearningMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      videoUrl,
      documentUrls,
      category,
      targetAudience,
      estimatedDuration,
      isPublished
    } = req.body;

    const existingMaterial = await prisma.learningMaterial.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingMaterial) {
      return res.status(404).json({
        error: {
          message: 'Learning material not found',
          code: 'MATERIAL_NOT_FOUND'
        }
      });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (documentUrls !== undefined) updateData.documentUrls = documentUrls;
    if (category !== undefined) updateData.category = category;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (estimatedDuration !== undefined) updateData.estimatedDuration = estimatedDuration;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const updatedMaterial = await prisma.learningMaterial.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        createdByAdmin: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating learning material:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update learning material',
        code: 'UPDATE_MATERIAL_ERROR'
      }
    });
  }
};

export const deleteLearningMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingMaterial = await prisma.learningMaterial.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingMaterial) {
      return res.status(404).json({
        error: {
          message: 'Learning material not found',
          code: 'MATERIAL_NOT_FOUND'
        }
      });
    }

    await prisma.learningMaterial.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: 'Learning material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting learning material:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete learning material',
        code: 'DELETE_MATERIAL_ERROR'
      }
    });
  }
};