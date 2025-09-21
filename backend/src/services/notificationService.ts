import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

interface NotificationData {
  userId: string;
  userType: 'CITIZEN' | 'WORKER';
  type: 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_CANCELLED' | 'REGISTRATION_CONFIRMED' | 'TRAINING_REMINDER' | 'COMPLETION_CERTIFICATE' | 'COMPLIANCE_REMINDER';
  title: string;
  message: string;
  eventId?: number;
  materialId?: number;
}

export class NotificationService {
  static async sendEventCreatedNotification(eventId: number) {
    try {
      const event = await prisma.physicalTrainingEvent.findUnique({
        where: { id: eventId },
        include: {
          locality: {
            include: {
              citizens: { select: { id: true, email: true, name: true } },
              workers: { select: { id: true, email: true, name: true } }
            }
          }
        }
      });

      if (!event) return;

      const notifications: NotificationData[] = [];

      if (event.targetAudience.includes('CITIZEN')) {
        event.locality?.citizens.forEach((citizen: any) => {
          notifications.push({
            userId: citizen.id,
            userType: 'CITIZEN',
            type: 'EVENT_CREATED',
            title: 'New Training Event Available',
            message: `A new training event "${event.title}" has been scheduled for ${event.startDateTime.toLocaleDateString()}`,
            eventId: event.id
          });
        });
      }

      if (event.targetAudience.includes('WORKER')) {
        event.locality?.workers.forEach((worker: any) => {
          notifications.push({
            userId: worker.id,
            userType: 'WORKER',
            type: 'EVENT_CREATED',
            title: 'New Training Event Available',
            message: `A new training event "${event.title}" has been scheduled for ${event.startDateTime.toLocaleDateString()}`,
            eventId: event.id
          });
        });
      }

      await this.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error sending event created notifications:', error);
    }
  }

  static async sendRegistrationConfirmation(eventId: number, userId: string, userType: 'CITIZEN' | 'WORKER') {
    try {
      const event = await prisma.physicalTrainingEvent.findUnique({
        where: { id: eventId },
        select: { id: true, title: true, startDateTime: true, location: true }
      });

      if (!event) return;

      const notification: NotificationData = {
        userId,
        userType,
        type: 'REGISTRATION_CONFIRMED',
        title: 'Training Registration Confirmed',
        message: `Your registration for "${event.title}" on ${event.startDateTime.toLocaleDateString()} at ${event.location} has been confirmed.`,
        eventId: event.id
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending registration confirmation:', error);
    }
  }

  static async sendEventUpdateNotification(eventId: number) {
    try {
      const registrations = await prisma.physicalTrainingRegistration.findMany({
        where: {
          physicalTrainingEventId: eventId,
          status: 'REGISTERED'
        },
        include: {
          citizen: { select: { id: true, email: true, name: true } },
          worker: { select: { id: true, email: true, name: true } },
          physicalTrainingEvent: { select: { title: true, startDateTime: true } }
        }
      });

      const notifications: NotificationData[] = registrations.map((reg: any) => ({
        userId: reg.citizenId || reg.workerId!,
        userType: reg.citizenId ? 'CITIZEN' : 'WORKER',
        type: 'EVENT_UPDATED',
        title: 'Training Event Updated',
        message: `The training event "${reg.physicalTrainingEvent.title}" has been updated. Please check the latest details.`,
        eventId
      }));

      await this.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error sending event update notifications:', error);
    }
  }

  static async sendTrainingReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const upcomingEvents = await prisma.physicalTrainingEvent.findMany({
        where: {
          startDateTime: {
            gte: tomorrow,
            lt: dayAfterTomorrow
          },
          status: 'ACTIVE'
        },
        include: {
          registrations: {
            where: { status: 'REGISTERED' },
            include: {
              citizen: { select: { id: true, email: true, name: true } },
              worker: { select: { id: true, email: true, name: true } }
            }
          }
        }
      });

      const notifications: NotificationData[] = [];

      upcomingEvents.forEach((event: any) => {
        event.registrations.forEach((reg: any) => {
          notifications.push({
            userId: reg.citizenId || reg.workerId!,
            userType: reg.citizenId ? 'CITIZEN' : 'WORKER',
            type: 'TRAINING_REMINDER',
            title: 'Training Reminder',
            message: `Reminder: You have a training session "${event.title}" tomorrow at ${event.startDateTime.toLocaleTimeString()} at ${event.location}`,
            eventId: event.id
          });
        });
      });

      await this.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error sending training reminders:', error);
    }
  }

  static async sendCompletionCertificate(eventId: number, userId: string, userType: 'CITIZEN' | 'WORKER', certificateUrl: string) {
    try {
      const event = await prisma.physicalTrainingEvent.findUnique({
        where: { id: eventId },
        select: { title: true }
      });

      if (!event) return;

      const notification: NotificationData = {
        userId,
        userType,
        type: 'COMPLETION_CERTIFICATE',
        title: 'Training Certificate Available',
        message: `Congratulations! Your certificate for completing "${event.title}" is now available for download.`,
        eventId
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending completion certificate notification:', error);
    }
  }

  static async sendComplianceReminders(userIds: string[], userType: 'CITIZEN' | 'WORKER') {
    try {
      const notifications: NotificationData[] = userIds.map(userId => ({
        userId,
        userType,
        type: 'COMPLIANCE_REMINDER',
        title: 'Training Compliance Reminder',
        message: 'You have not completed your mandatory training for this year. Please register for an upcoming training session.'
      }));

      await this.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error sending compliance reminders:', error);
    }
  }

  private static async sendNotification(notification: NotificationData) {
    console.log(`Sending notification to ${notification.userType} ${notification.userId}:`, notification);
  }

  private static async sendBulkNotifications(notifications: NotificationData[]) {
    for (const notification of notifications) {
      await this.sendNotification(notification);
    }
  }
}