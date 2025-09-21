import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const startLearningMaterial = async (req: Request, res: Response) => {
    try {
        const { materialId } = req.params;
        const { userId, userType } = req.body;

        if (!userId || !userType) {
            return res.status(400).json({
                error: {
                    message: 'userId and userType are required',
                    code: 'MISSING_REQUIRED_FIELDS'
                }
            });
        }

        const material = await prisma.learningMaterial.findUnique({
            where: { id: parseInt(materialId) }
        });

        if (!material) {
            return res.status(404).json({
                error: {
                    message: 'Learning material not found',
                    code: 'MATERIAL_NOT_FOUND'
                }
            });
        }

        if (!material.isPublished) {
            return res.status(400).json({
                error: {
                    message: 'Learning material is not published',
                    code: 'MATERIAL_NOT_PUBLISHED'
                }
            });
        }

        const existingProgress = await prisma.learningProgress.findFirst({
            where: {
                learningMaterialId: parseInt(materialId),
                ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId })
            }
        });

        if (existingProgress) {
            return res.json({
                message: 'Progress already exists',
                progress: existingProgress
            });
        }

        const progress = await prisma.learningProgress.create({
            data: {
                learningMaterialId: parseInt(materialId),
                ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
                progressPercent: 0
            },
            include: {
                learningMaterial: {
                    select: { id: true, title: true, estimatedDuration: true }
                }
            }
        });

        res.status(201).json({
            message: 'Learning progress started',
            progress
        });
    } catch (error) {
        console.error('Error starting learning material:', error);
        res.status(500).json({
            error: {
                message: 'Failed to start learning material',
                code: 'START_LEARNING_ERROR'
            }
        });
    }
};

export const updateLearningProgress = async (req: Request, res: Response) => {
    try {
        const { materialId } = req.params;
        const { userId, userType, progressPercent } = req.body;

        if (!userId || !userType || progressPercent === undefined) {
            return res.status(400).json({
                error: {
                    message: 'userId, userType, and progressPercent are required',
                    code: 'MISSING_REQUIRED_FIELDS'
                }
            });
        }

        if (progressPercent < 0 || progressPercent > 100) {
            return res.status(400).json({
                error: {
                    message: 'progressPercent must be between 0 and 100',
                    code: 'INVALID_PROGRESS'
                }
            });
        }

        const existingProgress = await prisma.learningProgress.findFirst({
            where: {
                learningMaterialId: parseInt(materialId),
                ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId })
            }
        });

        if (!existingProgress) {
            return res.status(404).json({
                error: {
                    message: 'Learning progress not found',
                    code: 'PROGRESS_NOT_FOUND'
                }
            });
        }

        const updateData: any = {
            progressPercent
        };

        if (progressPercent >= 100 && !existingProgress.completedAt) {
            updateData.completedAt = new Date();
        }

        const updatedProgress = await prisma.learningProgress.update({
            where: { id: existingProgress.id },
            data: updateData,
            include: {
                learningMaterial: {
                    select: { id: true, title: true, estimatedDuration: true }
                }
            }
        });

        res.json({
            message: 'Progress updated successfully',
            progress: updatedProgress
        });
    } catch (error) {
        console.error('Error updating learning progress:', error);
        res.status(500).json({
            error: {
                message: 'Failed to update learning progress',
                code: 'UPDATE_PROGRESS_ERROR'
            }
        });
    }
};

export const getUserLearningProgress = async (req: Request, res: Response) => {
    try {
        const { userType, userId } = req.params;
        const { completed, category } = req.query;

        if (!['citizen', 'worker'].includes(userType)) {
            return res.status(400).json({
                error: {
                    message: 'userType must be either citizen or worker',
                    code: 'INVALID_USER_TYPE'
                }
            });
        }

        const where: any = {
            ...(userType === 'citizen' ? { citizenId: userId } : { workerId: userId })
        };

        if (completed !== undefined) {
            if (completed === 'true') {
                where.completedAt = { not: null };
            } else {
                where.completedAt = null;
            }
        }

        let materialWhere: any = {};
        if (category) {
            materialWhere.category = category;
        }

        const progress = await prisma.learningProgress.findMany({
            where,
            include: {
                learningMaterial: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: true,
                        estimatedDuration: true,
                        targetAudience: true
                    }
                }
            },
            orderBy: {
                startedAt: 'desc'
            }
        });

        let filteredProgress = progress;
        if (category) {
            filteredProgress = progress.filter((p: any) => p.learningMaterial?.category === category);
        }

        res.json({
            progress: filteredProgress,
            summary: {
                total: filteredProgress.length,
                completed: filteredProgress.filter((p: any) => p.completedAt).length,
                inProgress: filteredProgress.filter((p: any) => !p.completedAt && p.progressPercent > 0).length,
                notStarted: filteredProgress.filter((p: any) => p.progressPercent === 0).length
            }
        });
    } catch (error) {
        console.error('Error fetching user learning progress:', error);
        res.status(500).json({
            error: {
                message: 'Failed to fetch user learning progress',
                code: 'FETCH_PROGRESS_ERROR'
            }
        });
    }
};

export const getMaterialProgress = async (req: Request, res: Response) => {
    try {
        const { materialId } = req.params;

        const material = await prisma.learningMaterial.findUnique({
            where: { id: parseInt(materialId) },
            select: { id: true, title: true, targetAudience: true }
        });

        if (!material) {
            return res.status(404).json({
                error: {
                    message: 'Learning material not found',
                    code: 'MATERIAL_NOT_FOUND'
                }
            });
        }

        const progress = await prisma.learningProgress.findMany({
            where: {
                learningMaterialId: parseInt(materialId)
            },
            include: {
                citizen: {
                    select: { id: true, name: true, email: true }
                },
                worker: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: {
                startedAt: 'desc'
            }
        });

        const stats = {
            totalUsers: progress.length,
            completed: progress.filter((p: any) => p.completedAt).length,
            inProgress: progress.filter((p: any) => !p.completedAt && p.progressPercent > 0).length,
            notStarted: progress.filter((p: any) => p.progressPercent === 0).length,
            averageProgress: progress.length > 0 ? progress.reduce((sum: any, p: any) => sum + p.progressPercent, 0) / progress.length : 0,
            completionRate: progress.length > 0 ? (progress.filter((p: any) => p.completedAt).length / progress.length * 100) : 0
        };

        res.json({
            material,
            progress,
            statistics: stats
        });
    } catch (error) {
        console.error('Error fetching material progress:', error);
        res.status(500).json({
            error: {
                message: 'Failed to fetch material progress',
                code: 'FETCH_MATERIAL_PROGRESS_ERROR'
            }
        });
    }
};