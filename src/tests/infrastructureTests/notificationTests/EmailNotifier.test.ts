import { EmailNotifier } from "../../../infrastructure/notifications/EmailNotifier";

describe("EmailNotifier", () => {
  let emailNotifier: EmailNotifier;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    emailNotifier = new EmailNotifier();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should send an email and return true", async () => {
    const userId = 123;
    const message = "Test Email Message";
    const result = await emailNotifier.sendNotification(userId, message);
    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending email to user ${userId}: ${message}`
    );
  });
});
