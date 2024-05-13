import { INotifier } from "../../core/interfaces/INotifier";

export class EmailNotifier implements INotifier {
  async sendNotification(userId: number, message: string): Promise<boolean> {
    console.log(`Sending email to user ${userId}: ${message}`);
    return true;
  }
}
