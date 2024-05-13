import { faker } from "@faker-js/faker";
import { UserSubscriptionService } from "../../../application/services/UserSubscription.service";
import { UserSubscriptionRepository } from "../../../infrastructure/repositories/UserSubscriptionRepository";
import { UserSubscription } from "../../../core/entities/UserSubscription";
import { NotificationManager } from "../../../application/observer/NotificationManager";
jest.mock("../../../infrastructure/repositories/UserSubscriptionRepository");
jest.mock("../../../application/observer/NotificationManager");

type MockUserSubscriptionRepository = UserSubscriptionRepository & {
  createUserSubscription: jest.Mock;
  getUserSubscriptionByChannelId: jest.Mock;
  updateUserSubscription: jest.Mock;
  deleteSubscription: jest.Mock;
};

describe("UserSubscriptionService", () => {
  let mockUserSubscriptionRepository: MockUserSubscriptionRepository;
  let mockUserSubscriptionService: UserSubscriptionService;
  let mockUserSubscriptionData: UserSubscription;
  let mockNotificationManager: NotificationManager;
  beforeEach(() => {
    mockUserSubscriptionRepository =
      new UserSubscriptionRepository() as MockUserSubscriptionRepository;

    mockUserSubscriptionService = new UserSubscriptionService();
    mockUserSubscriptionService["repository"] = mockUserSubscriptionRepository;

    mockUserSubscriptionData = new UserSubscription(1, 1, 1);
    mockNotificationManager = {
      notify: jest.fn(),
      close: jest.fn(),
    } as Partial<NotificationManager> as NotificationManager;

    NotificationManager.getInstance = jest.fn(() =>
      Promise.resolve(mockNotificationManager)
    );
  });

  describe("addSubscription", () => {
    it("should successfully add a subscription", async () => {
      mockUserSubscriptionRepository.createUserSubscription.mockResolvedValue(
        mockUserSubscriptionData
      );

      const result = await mockUserSubscriptionService.addSubscription(
        mockUserSubscriptionData
      );

      expect(result).toEqual(mockUserSubscriptionData);
      expect(
        mockUserSubscriptionRepository.createUserSubscription
      ).toHaveBeenCalledWith(mockUserSubscriptionData);
    });
  });

  describe("unsubscribe", () => {
    it("should successfully unsubscribe a user", async () => {
      mockUserSubscriptionRepository.deleteSubscription.mockResolvedValue(
        undefined
      );

      await mockUserSubscriptionService.unsubscribe(1, 1);
      expect(
        mockUserSubscriptionRepository.deleteSubscription
      ).toHaveBeenCalledWith(1, 1);
    });
  });

  describe("notifySubscribers", () => {
    it("should notify all subscribers for a channel", async () => {
      const subscriptions = [new UserSubscription(1, 1, 1)];
      mockUserSubscriptionRepository.getUserSubscriptionByChannelId.mockResolvedValue(
        subscriptions
      );
      await mockUserSubscriptionService.notifySubscribers(1, 1, "New video!");

      expect(mockNotificationManager.notify).toHaveBeenCalledWith(
        1,
        subscriptions,
        "New video!"
      );
    });

    it("should handle empty subscription list", async () => {
      mockUserSubscriptionRepository.getUserSubscriptionByChannelId.mockResolvedValue(
        []
      );
      await mockUserSubscriptionService.notifySubscribers(1, 1, "New video!");

      expect(mockNotificationManager.notify).toHaveBeenCalledWith(
        1,
        [],
        "New video!"
      );
    });

    it("should close the notification manager after notifying", async () => {
      const subscriptions = [new UserSubscription(1, 1, 1)];
      mockUserSubscriptionRepository.getUserSubscriptionByChannelId.mockResolvedValue(
        subscriptions
      );
      await mockUserSubscriptionService.notifySubscribers(1, 1, "Update!");

      expect(mockNotificationManager.close).toHaveBeenCalled();
    });

    it("should handle errors when channel doesn't exists", async () => {
      const mockNotificationManager = {
        notify: jest.fn().mockResolvedValue(true),
        close: jest.fn(),
      };

      NotificationManager.getInstance = jest
        .fn()
        .mockResolvedValue(mockNotificationManager);

      mockUserSubscriptionRepository.getUserSubscriptionByChannelId.mockResolvedValue(
        []
      );

      const response = await mockUserSubscriptionService.notifySubscribers(
        1,
        1,
        "Update!"
      );

      expect(response).toBeUndefined();
    });
  });

  describe("getLogs", () => {
    it("should get all logs", async () => {
      const logs = [faker.random.alphaNumeric(10)];
      mockUserSubscriptionService["mongo"].getLogs = jest
        .fn()
        .mockResolvedValue(logs);

      const result = await mockUserSubscriptionService.getLogs();

      expect(result).toEqual(logs);
      expect(mockUserSubscriptionService["mongo"].getLogs).toHaveBeenCalled();
    });
  });
});
