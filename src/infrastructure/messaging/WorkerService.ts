import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { UserNotifier } from "./UserNotifier";

export class WorkerService {
  private connection: Connection;
  private channel: Channel;

  constructor(private queueName: string = "notifications") {
    this.queueName = queueName;
  }

  public async initialize(): Promise<void> {
    await this.connect();
    await this.startConsuming();
  }

  public async connect(): Promise<void> {
    this.connection = await amqp.connect(
      "amqp://rabbitmq:rabbitmq@localhost:5672"
    );
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    console.log(`Connected to RabbitMQ and queue ${this.queueName} is ready.`);
  }

  private async startConsuming(): Promise<void> {
    console.log(`Starting to consume messages from ${this.queueName}`);
    this.channel.consume(this.queueName, (msg) => this.onMessage(msg), {
      noAck: false,
    });
  }

  private async onMessage(msg: ConsumeMessage | null): Promise<void> {
    if (msg) {
      try {
        await this.processMessage(msg.content.toString());
        this.channel.ack(msg);
      } catch (error) {
        console.error("Failed to process message:", error);
        this.channel.nack(msg);
      }
    }
  }

  private async processMessage(data: string): Promise<void> {
    const processedData = JSON.parse(data);
    for (const subscription of processedData?.subscriptions) {
      const userNotifier = new UserNotifier(subscription.userId);
      const message = {
        message: processedData.message,
        subscription,
        userId: processedData.userId,
      };
      const userNotified = await userNotifier.update(message);
      if (userNotified) {
        console.log("User notified successfully");
      } else {
        console.log("Failed to notify user");
      }
    }
  }

  public async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
