import { Observer } from "../../core/interfaces/IObserver";
import { NotificationService } from "../../application/services/Notification.service";
import { NotifierFactory } from "../../core/factories/NotifierFactory";
import MongoConnection from "../../infrastructure/db/mongoDb/MongoConnection";
import { UserSubscriptionService } from "../../application/services/UserSubscription.service";

export class UserNotifier implements Observer {
  mongoDb: MongoConnection;
  constructor(private userId: number) {}

  async update(message: any): Promise<boolean> {
    try {
      const notificationService = new NotificationService();
      const notification = await notificationService.getNotificationById(
        parseInt(message.subscription.notificationId)
      );

      if (!notification) {
        console.error(
          "Notification not found for ID:",
          message.subscription.notificationId
        );
        return false;
      }

      const notifier = NotifierFactory.createNotifier(
        notification.name.toLowerCase()
      );
      if (!notifier) {
        return false;
      }
      const userSubscribeService = new UserSubscriptionService();
      await userSubscribeService.createLog(message);
      return await notifier.sendNotification(this.userId, message);
    } catch (error) {
      console.error("Error in updating user notification:", error);
      return false;
    }
  }
}
