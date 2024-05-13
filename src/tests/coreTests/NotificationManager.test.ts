import { NotifierFactory } from "../../core/factories/NotifierFactory";
import { EmailNotifier } from "../../infrastructure/notifications/EmailNotifier";
import { SmsNotifier } from "../../infrastructure/notifications/SmsNotifier";
import { PushNotifier } from "../../infrastructure/notifications/PushNotifier";

describe("NotifierFactory", () => {
  it('should return an instance of EmailNotifier when type is "email"', () => {
    const notifier = NotifierFactory.createNotifier("email");
    expect(notifier).toBeInstanceOf(EmailNotifier);
  });

  it('should return an instance of SmsNotifier when type is "sms"', () => {
    const notifier = NotifierFactory.createNotifier("sms");
    expect(notifier).toBeInstanceOf(SmsNotifier);
  });

  it('should return an instance of PushNotifier when type is "push notification"', () => {
    const notifier = NotifierFactory.createNotifier("push notification");
    expect(notifier).toBeInstanceOf(PushNotifier);
  });

  it("should return null for unsupported notification types", () => {
    const types = ["postal", "telegram", "carrier pigeon"];
    types.forEach((type) => {
      const notifier = NotifierFactory.createNotifier(type);
      expect(notifier).toBeNull();
    });
  });
});
