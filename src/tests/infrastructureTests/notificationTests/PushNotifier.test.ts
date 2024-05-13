import { PushNotifier } from "../../../infrastructure/notifications/PushNotifier";

describe("PushNotifier", () => {
  let ushNotifier: PushNotifier;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    ushNotifier = new PushNotifier();
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should send an push and return true", async () => {
    const userId = 123;
    const message = "Test Push Message";
    const result = await ushNotifier.sendNotification(userId, message);
    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Sending push notification to user ${userId}: ${message}`
    );
  });
});
