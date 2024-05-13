import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  createNotification(notification: Notification): Promise<Notification>;
  getNotificationById(notificationId: number): Promise<Notification | null>;
  updateNotification(
    notificationId: number,
    notification: Notification
  ): Promise<Notification>;
  deleteNotification(notificationId: number): Promise<void>;
  getNotifications(): Promise<Notification[]>;
}
