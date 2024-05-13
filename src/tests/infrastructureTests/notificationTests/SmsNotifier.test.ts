import { SmsNotifier } from "../../../infrastructure/notifications/SmsNotifier";

describe("SmsNotifier", () => {
  let smsNotifier: SmsNotifier;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    smsNotifier = new SmsNotifier();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should send an sms and return true", async () => {
    const userId = 123;
    const message = "Test SMS Message";
    const result = await smsNotifier.sendNotification(userId, message);
    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending SMS to user ${userId}: ${message}`
    );
  });
});
