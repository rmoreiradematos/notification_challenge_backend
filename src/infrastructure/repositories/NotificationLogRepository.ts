import MongoConnection from "../db/mongoDb/MongoConnection";

interface NotificationLogEntry {
  userSentMessage: string;
  message: string;
  notificationId: string;
  channelId: string;
  userReceivedMessage: string;
  createdAt: Date;
}

class NotificationLogRepository {
  private mongoDb: MongoConnection;

  constructor(connectionString: string) {
    this.mongoDb = new MongoConnection(connectionString);
  }

  async connect(): Promise<void> {
    await this.mongoDb.connect();
  }

  async createLog(entry: NotificationLogEntry): Promise<void> {
    await this.mongoDb.create({
      userSentMessage: entry.userSentMessage,
      message: entry.message,
      notificationId: entry.notificationId,
      channelId: entry.channelId,
      userReceivedMessage: entry.userReceivedMessage,
      createdAt: new Date(),
    });
  }

  async getLogs() {
    return (await this.mongoDb.read()).sort((a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1;
    });
  }
}

export default NotificationLogRepository;
