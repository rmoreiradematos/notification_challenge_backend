import { INotifier } from "../interfaces/INotifier";
import { EmailNotifier } from "../../infrastructure/notifications/EmailNotifier";
import { SmsNotifier } from "../../infrastructure/notifications/SmsNotifier";
import { PushNotifier } from "../../infrastructure/notifications/PushNotifier";

export class NotifierFactory {
  static createNotifier(type: string): INotifier | null {
    switch (type.toLowerCase()) {
      case "email":
        return new EmailNotifier();
      case "sms":
        return new SmsNotifier();
      case "push notification":
        return new PushNotifier();
      default:
        console.error("Unsupported notification type:", type);
        return null;
    }
  }
}
