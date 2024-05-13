import { Notification } from "../../core/entities/Notification";
import { INotificationRepository } from "../../core/interfaces/INotificationRepository";
import { PrismaClientSingleton } from "../db/DbConnection";

export class NotificationRepository implements INotificationRepository {
  private prisma;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async createNotification(user: Notification): Promise<Notification> {
    const createNotification = await this.prisma.notification.create({
      data: {
        name: user.name,
        description: user.description,
      },
    });
    return new Notification(
      createNotification.name,
      createNotification.description,
      createNotification.id
    );
  }

  async getNotificationById(
    notificationId: number
  ): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (notification) {
      return new Notification(
        notification.name,
        notification.description,
        notification.id
      );
    }
    return null;
  }

  async updateNotification(
    notificationId: number,
    notification: { name?: string; description?: string }
  ): Promise<Notification> {
    const updatednotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        name: notification.name,
        description: notification.description,
      },
    });
    return new Notification(
      updatednotification.name,
      updatednotification.description,
      updatednotification.id
    );
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getNotifications(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany();
    return notifications.map(
      (notification: Notification) =>
        new Notification(
          notification.name,
          notification.description,
          notification.id
        )
    );
  }
}
