import { INotifier } from "../../core/interfaces/INotifier";

export class PushNotifier implements INotifier {
  async sendNotification(userId: number, message: string): Promise<boolean> {
    console.log(`Sending push notification to user ${userId}: ${message}`);
    return true;
  }
}
