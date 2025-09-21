import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const getPhysicalTrainingEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const { status, localityId, targetAudience, search, dateFrom, dateTo } = req.query;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (localityId) {
      where.localityId = parseInt(localityId as string);
    }
    
    if (targetAudience) {
      where.targetAudience = {
        has: targetAudience
      };
    }
    
    if (search) {
      where.OR = [
        {
          title: {
            contains: search as string,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search as string,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    if (dateFrom || dateTo) {
      where.startDateTime = {};
      if (dateFrom) {
        where.startDateTime.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.startDateTime.lte = new Date(dateTo as string);
      }
    }
    
    const [events, total] = await Promise.all([
      prisma.physicalTrainingEvent.findMany({
        where,
        skip,
        take: limit,
        include: {
          locality: {
            select: {
              id: true,
              district: {
                select: {
                  id: true
                }
              }
            }
          },
          createdByDistrictAdmin: {
            select: {
              id: true,
              name: true
            }
          },
          createdByLocalityAdmin: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              registrations: true
            }
          }
        },
        orderBy: {
          startDateTime: 'asc'
        }
      }),
      prisma.physicalTrainingEvent.count({ where })
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching physical training events:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch physical training events',
        code: 'FETCH_EVENTS_ERROR'
      }
    });
  }
};

export const createPhysicalTrainingEvent = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', JSON.stringify(req.body));
    
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      maxCapacity,
      targetAudience,
      status = 'ACTIVE',
      localityId,
      createdByDistrictAdminId,
      createdByLocalityAdminId
    } = req.body;
    
    console.log('Extracted values:', { title, description, startDateTime, location, targetAudience, localityId });

    if (!title || !description || !startDateTime || !location || !targetAudience || localityId === undefined || localityId === null) {
      return res.status(400).json({
        error: {
          message: 'Missing required fields: title, description, startDateTime, location, targetAudience, localityId',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const validAudiences = ['CITIZEN', 'WORKER', 'DISTRICT_ADMIN', 'LOCALITY_ADMIN'];
    if (!Array.isArray(targetAudience) || !targetAudience.every(audience => validAudiences.includes(audience))) {
      return res.status(400).json({
        error: {
          message: 'Invalid targetAudience. Must be an array containing valid user roles.',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const start = new Date(startDateTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        error: {
          message: 'Invalid startDateTime format',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    let end = null;
    if (endDateTime) {
      end = new Date(endDateTime);
      if (isNaN(end.getTime())) {
        return res.status(400).json({
          error: {
            message: 'Invalid endDateTime format',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      if (end <= start) {
        return res.status(400).json({
          error: {
            message: 'endDateTime must be after startDateTime',
            code: 'VALIDATION_ERROR'
          }
        });
      }
    }

    const locality = await prisma.locality.findUnique({
      where: { id: parseInt(localityId) }
    });

    if (!locality) {
      return res.status(400).json({
        error: {
          message: 'Locality not found',
          code: 'LOCALITY_NOT_FOUND'
        }
      });
    }

    if (createdByDistrictAdminId) {
      const districtAdmin = await prisma.districtAdmin.findUnique({
        where: { id: createdByDistrictAdminId }
      });
      if (!districtAdmin) {
        return res.status(400).json({
          error: {
            message: 'District admin not found',
            code: 'DISTRICT_ADMIN_NOT_FOUND'
          }
        });
      }
    }

    if (createdByLocalityAdminId) {
      const localityAdmin = await prisma.localityAdmin.findUnique({
        where: { id: createdByLocalityAdminId }
      });
      if (!localityAdmin) {
        return res.status(400).json({
          error: {
            message: 'Locality admin not found',
            code: 'LOCALITY_ADMIN_NOT_FOUND'
          }
        });
      }
    }

    const event = await prisma.physicalTrainingEvent.create({
      data: {
        title,
        description,
        startDateTime: start,
        endDateTime: end,
        location,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        targetAudience,
        status,
        localityId: parseInt(localityId),
        createdByDistrictAdminId,
        createdByLocalityAdminId
      },
      include: {
        locality: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        createdByDistrictAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdByLocalityAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating physical training event:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create physical training event',
        code: 'CREATE_EVENT_ERROR'
      }
    });
  }
};

export const updatePhysicalTrainingEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      maxCapacity,
      targetAudience,
      status,
      localityId
    } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid event ID',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const existingEvent = await prisma.physicalTrainingEvent.findUnique({
      where: { id: eventId }
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: {
          message: 'Physical training event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity ? parseInt(maxCapacity) : null;
    if (status !== undefined) updateData.status = status;
    if (localityId !== undefined) updateData.localityId = parseInt(localityId);

    if (startDateTime !== undefined) {
      const start = new Date(startDateTime);
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          error: {
            message: 'Invalid startDateTime format',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      updateData.startDateTime = start;
    }

    if (endDateTime !== undefined) {
      if (endDateTime === null) {
        updateData.endDateTime = null;
      } else {
        const end = new Date(endDateTime);
        if (isNaN(end.getTime())) {
          return res.status(400).json({
            error: {
              message: 'Invalid endDateTime format',
              code: 'VALIDATION_ERROR'
            }
          });
        }
        
        const startDate = updateData.startDateTime || existingEvent.startDateTime;
        if (end <= startDate) {
          return res.status(400).json({
            error: {
              message: 'endDateTime must be after startDateTime',
              code: 'VALIDATION_ERROR'
            }
          });
        }
        updateData.endDateTime = end;
      }
    }

    if (targetAudience !== undefined) {
      const validAudiences = ['CITIZEN', 'WORKER', 'DISTRICT_ADMIN', 'LOCALITY_ADMIN'];
      if (!Array.isArray(targetAudience) || !targetAudience.every(audience => validAudiences.includes(audience))) {
        return res.status(400).json({
          error: {
            message: 'Invalid targetAudience. Must be an array containing valid user roles.',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      updateData.targetAudience = targetAudience;
    }

    if (localityId !== undefined) {
      const locality = await prisma.locality.findUnique({
        where: { id: parseInt(localityId) }
      });

      if (!locality) {
        return res.status(400).json({
          error: {
            message: 'Locality not found',
            code: 'LOCALITY_NOT_FOUND'
          }
        });
      }
    }

    const updatedEvent = await prisma.physicalTrainingEvent.update({
      where: { id: eventId },
      data: updateData,
      include: {
        locality: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        createdByDistrictAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdByLocalityAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating physical training event:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update physical training event',
        code: 'UPDATE_EVENT_ERROR'
      }
    });
  }
};

export const getPhysicalTrainingEventById = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid event ID',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: eventId },
      include: {
        locality: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        createdByDistrictAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdByLocalityAdmin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        registrations: {
          include: {
            citizen: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            worker: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            registrations: true,
            attendances: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Physical training event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching physical training event:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch physical training event',
        code: 'FETCH_EVENT_ERROR'
      }
    });
  }
};

export const deletePhysicalTrainingEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid event ID',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const existingEvent = await prisma.physicalTrainingEvent.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: true,
            attendances: true
          }
        }
      }
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: {
          message: 'Physical training event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    if (existingEvent._count.registrations > 0 || existingEvent._count.attendances > 0) {
      return res.status(400).json({
        error: {
          message: 'Cannot delete event with existing registrations or attendances. Consider cancelling the event instead.',
          code: 'EVENT_HAS_DEPENDENCIES'
        }
      });
    }

    await prisma.physicalTrainingEvent.delete({
      where: { id: eventId }
    });

    res.json({
      message: 'Physical training event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting physical training event:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete physical training event',
        code: 'DELETE_EVENT_ERROR'
      }
    });
  }
};