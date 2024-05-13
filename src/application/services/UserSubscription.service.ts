import { UserSubscription } from "../../core/entities/UserSubscription";
import { UserSubscriptionRepository } from "../../infrastructure/repositories/UserSubscriptionRepository";
import { NotificationManager } from "../observer/NotificationManager";
import NotificationLogRepository from "../../infrastructure/repositories/NotificationLogRepository";

export class UserSubscriptionService {
  private repository: UserSubscriptionRepository;
  private mongo: NotificationLogRepository;

  constructor() {
    this.repository = new UserSubscriptionRepository();
    this.mongo = new NotificationLogRepository(
      "mongodb://mongouser:mongopassword@localhost:27017/logs"
    );
  }

  async addSubscription(userSubscription: UserSubscription) {
    return await this.repository.createUserSubscription(userSubscription);
  }

  async unsubscribe(userId: number, channelId: number) {
    await this.repository.deleteSubscription(userId, channelId);
  }

  async notifySubscribers(userId: number, channelId: number, message: string) {
    const notificationManager = await NotificationManager.getInstance();
    const subscriptions = await this.repository.getUserSubscriptionByChannelId(
      channelId
    );

    await notificationManager.notify(userId, subscriptions, message);

    await notificationManager.close();
  }

  async getLogs() {
    await this.mongo.connect();
    return await this.mongo.getLogs();
  }

  async createLog(entry: any) {
    await this.mongo.connect();
    await this.mongo.createLog(entry);
  }
}
