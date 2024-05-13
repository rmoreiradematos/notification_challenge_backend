import { UserNotifier } from "../../../infrastructure/messaging/UserNotifier";
import { INotifier } from "../../../core/interfaces/INotifier";
import { NotificationService } from "../../../application/services/Notification.service";
import { NotifierFactory } from "../../../core/factories/NotifierFactory";

jest.mock("../../../application/services/Notification.service");
jest.mock("../../../core/factories/NotifierFactory");

describe("UserNotifier", () => {
  const mockedNotificationService =
    new NotificationService() as jest.Mocked<NotificationService>;
  const mockedNotifierFactory = NotifierFactory as jest.Mocked<
    typeof NotifierFactory
  >;
  let userNotifier: UserNotifier;

  beforeEach(() => {
    userNotifier = new UserNotifier(123);
    mockedNotificationService.getNotificationById = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    { type: "email", name: "Email" },
    { type: "sms", name: "SMS" },
    { type: "push notification", name: "Push Notification" },
  ])(
    "should send a $name notification successfully",
    async ({ type, name }) => {
      const notification = {
        id: 1,
        name: type,
        description: `${name} type of notification`,
      };
      mockedNotificationService.getNotificationById.mockResolvedValue(
        notification
      );

      const mockNotifier: INotifier = {
        sendNotification: jest.fn().mockResolvedValue(true),
      };
      NotificationService.prototype.getNotificationById = jest
        .fn()
        .mockResolvedValue(notification);
      mockedNotifierFactory.createNotifier.mockReturnValue(mockNotifier);

      const result = await userNotifier.update({
        subscription: { notificationId: 1 },
        message: "Test Message",
      });

      expect(result).toBe(true);
      expect(mockedNotifierFactory.createNotifier).toHaveBeenCalledWith(type);
      expect(mockNotifier.sendNotification).toHaveBeenCalledWith(
        123,
        expect.anything()
      );
    }
  );

  it.each([
    { type: "email", name: "Email" },
    { type: "sms", name: "SMS" },
    { type: "push notification", name: "Push Notification" },
  ])(
    "should send a $name notification successfully",
    async ({ type, name }) => {
      const notification = {
        id: 1,
        name: type,
        description: `${name} type of notification`,
      };
      mockedNotificationService.getNotificationById.mockResolvedValue(
        notification
      );

      const mockNotifier: INotifier = {
        sendNotification: jest.fn().mockResolvedValue(true),
      };
      NotificationService.prototype.getNotificationById = jest
        .fn()
        .mockResolvedValue(notification);
      mockedNotifierFactory.createNotifier.mockReturnValue(mockNotifier);

      const result = await userNotifier.update({
        subscription: { notificationId: 1 },
        message: "Test Message",
      });

      expect(result).toBe(true);
      expect(mockedNotifierFactory.createNotifier).toHaveBeenCalledWith(type);
      expect(mockNotifier.sendNotification).toHaveBeenCalledWith(
        123,
        expect.anything()
      );
    }
  );

  it("should return false when notification is not found", async () => {
    mockedNotificationService.getNotificationById.mockResolvedValue(null);
    const result = await userNotifier.update({
      subscription: { notificationId: "999" },
      message: "Test Message",
    });
    expect(result).toBe(false);
  });

  it("should return false when notifier is not available", async () => {
    const notification = {
      id: 1,
      name: "unknown",
      description: "Unknown type of notification",
    };
    mockedNotificationService.getNotificationById.mockResolvedValue(
      notification
    );
    mockedNotifierFactory.createNotifier.mockReturnValue(null);

    const result = await userNotifier.update({
      subscription: { notificationId: "1" },
      message: "Test Message",
    });

    expect(result).toBe(false);
    expect(mockedNotifierFactory.createNotifier).toHaveBeenCalledTimes(0);
  });
  it("should return false when notifier is not available", async () => {
    const notification = {
      id: 1,
      name: "email",
      description: "Email notification",
    };
    mockedNotificationService.getNotificationById.mockResolvedValue(
      notification
    );
    mockedNotifierFactory.createNotifier.mockReturnValue(null);

    const result = await userNotifier.update({
      subscription: { notificationId: 1 },
      message: "Test Message",
    });

    expect(result).toBe(false);
  });

  it("should return false when an error occurs during notification sending", async () => {
    const notification = {
      id: 1,
      name: "email",
      description: "Email notification",
    };
    mockedNotificationService.getNotificationById.mockResolvedValue(
      notification
    );
    const mockNotifier: INotifier = {
      sendNotification: jest
        .fn()
        .mockRejectedValue(new Error("Sending failed")),
    };
    mockedNotifierFactory.createNotifier.mockReturnValue(mockNotifier);

    const result = await userNotifier.update({
      subscription: { notificationId: 1 },
      message: "Test Message",
    });

    expect(result).toBe(false);
    expect(mockNotifier.sendNotification).toHaveBeenCalledTimes(0);
  });
});
