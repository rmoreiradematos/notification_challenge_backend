import amqp, { Connection, Channel } from "amqplib";
import appEventEmitter from "../../infrastructure/events/AppEventEmitter";
import { UserSubscription } from "../../core/entities/UserSubscription";

export class NotificationManager {
  private static instance: NotificationManager;
  private connection: Connection;
  private channel: Channel;

  private constructor() {}

  public static async getInstance(): Promise<NotificationManager> {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
      await NotificationManager.instance.init();
    }
    return NotificationManager.instance;
  }

  private async init(): Promise<void> {
    this.connection = await amqp.connect(
      "amqp://rabbitmq:rabbitmq@localhost:5672"
    );
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue("notifications", { durable: true });
  }

  public async notify(
    userId: number,
    subscriptions: Array<UserSubscription>,
    message: string
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("Notification manager is not initialized");
    }
    try {
      const notificationContent = {
        userId,
        subscriptions,
        message,
      };
      await this.channel.sendToQueue(
        "notifications",
        Buffer.from(JSON.stringify(notificationContent)),
        {
          persistent: true,
        }
      );
      appEventEmitter.emit("notificationSent");
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
