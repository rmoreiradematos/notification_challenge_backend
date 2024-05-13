import { NotificationRepository } from "../../infrastructure/repositories/NotificationRespository";
import { Notification } from "../../core/entities/Notification";

export class NotificationService {
  private notificationRepository = new NotificationRepository();

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async createNotification(notificationData: Notification) {
    const notification = await this.notificationRepository.createNotification(
      notificationData
    );
    return notification;
  }

  async getNotifications() {
    const notifications = await this.notificationRepository.getNotifications();
    return notifications;
  }

  async getNotificationById(id: number) {
    const notificaton = await this.notificationRepository.getNotificationById(
      id
    );
    return notificaton;
  }

  async updateNotification(
    id: number,
    notificationData: { name?: string; description?: string }
  ) {
    const notification = await this.notificationRepository.updateNotification(
      id,
      notificationData
    );
    return notification;
  }

  async deleteNotification(id: number) {
    const user = await this.notificationRepository.deleteNotification(id);
    return user;
  }
}
