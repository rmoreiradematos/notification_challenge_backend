import { INotifier } from "../../core/interfaces/INotifier";

export class SmsNotifier implements INotifier {
  async sendNotification(userId: number, message: string): Promise<boolean> {
    console.log(`Sending SMS to user ${userId}: ${message}`);
    return true;
  }
}
