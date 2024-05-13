import { NotificationService } from "../../../application/services/Notification.service";
import { NotificationRepository } from "../../../infrastructure/repositories/NotificationRespository";
import { Notification } from "../../../core/entities/Notification";
import { faker } from "@faker-js/faker";

jest.mock("../../../infrastructure/repositories/NotificationRespository");

type MockNotificationRepository = NotificationRepository & {
  createNotification: jest.Mock;
  getNotifications: jest.Mock;
  getNotificationById: jest.Mock;
  updateNotification: jest.Mock;
  deleteNotification: jest.Mock;
};

describe("NotificationService", () => {
  let notificationService: NotificationService;
  let mockNotificationData: Notification;
  let mockNotificationRepository: MockNotificationRepository;

  beforeEach(() => {
    mockNotificationRepository =
      new NotificationRepository() as any as MockNotificationRepository;
    notificationService = new NotificationService();
    notificationService["notificationRepository"] = mockNotificationRepository;

    mockNotificationData = new Notification(
      faker.internet.userName(),
      faker.internet.userName(),
      faker.number.int()
    );
  });

  describe("createNotification", () => {
    it("should create a notification and return it", async () => {
      mockNotificationRepository.createNotification.mockResolvedValue(
        mockNotificationData
      );

      const result = await notificationService.createNotification(
        mockNotificationData
      );
      expect(result).toEqual(mockNotificationData);
      expect(
        mockNotificationRepository.createNotification
      ).toHaveBeenCalledWith(mockNotificationData);
    });

    it("should handle errors when creating a notification", async () => {
      mockNotificationRepository.createNotification.mockRejectedValue(
        new Error("Failed to create notification")
      );

      await expect(
        notificationService.createNotification(mockNotificationData)
      ).rejects.toThrow("Failed to create notification");
    });
  });

  describe("getNotifications", () => {
    it("should return all notifications", async () => {
      mockNotificationRepository.getNotifications.mockResolvedValue([
        mockNotificationData,
      ]);

      const result = await notificationService.getNotifications();
      expect(result).toEqual([mockNotificationData]);
      expect(mockNotificationRepository.getNotifications).toHaveBeenCalled();
    });

    it("should handle errors when retrieving notifications", async () => {
      mockNotificationRepository.getNotifications.mockRejectedValue(
        new Error("Failed to retrieve notifications")
      );

      await expect(notificationService.getNotifications()).rejects.toThrow(
        "Failed to retrieve notifications"
      );
    });
  });

  describe("getNotificationById", () => {
    it("should return a notification by id", async () => {
      mockNotificationRepository.getNotificationById.mockResolvedValue(
        mockNotificationData
      );

      const result = await notificationService.getNotificationById(1);
      expect(result).toEqual(mockNotificationData);
      expect(
        mockNotificationRepository.getNotificationById
      ).toHaveBeenCalledWith(1);
    });

    it("should handle errors when retrieving a notification by id", async () => {
      mockNotificationRepository.getNotificationById.mockRejectedValue(
        new Error("Failed to retrieve notification")
      );

      await expect(notificationService.getNotificationById(1)).rejects.toThrow(
        "Failed to retrieve notification"
      );
    });
  });

  describe("updateNotification", () => {
    it("should update a notification and return it", async () => {
      mockNotificationRepository.updateNotification.mockResolvedValue(
        mockNotificationData
      );

      const result = await notificationService.updateNotification(
        1,
        mockNotificationData
      );
      expect(result).toEqual(mockNotificationData);
      expect(
        mockNotificationRepository.updateNotification
      ).toHaveBeenCalledWith(1, mockNotificationData);
    });

    it("should handle errors when updating a notification", async () => {
      mockNotificationRepository.updateNotification.mockRejectedValue(
        new Error("Failed to update notification")
      );

      await expect(
        notificationService.updateNotification(1, mockNotificationData)
      ).rejects.toThrow("Failed to update notification");
    });
  });

  describe("deleteNotification", () => {
    it("should delete a notification", async () => {
      mockNotificationRepository.deleteNotification.mockResolvedValue(
        mockNotificationData
      );

      await notificationService.deleteNotification(1);
      expect(
        mockNotificationRepository.deleteNotification
      ).toHaveBeenCalledWith(1);
    });

    it("should handle errors when deleting a notification", async () => {
      mockNotificationRepository.deleteNotification.mockRejectedValue(
        new Error("Failed to delete notification")
      );

      await expect(notificationService.deleteNotification(1)).rejects.toThrow(
        "Failed to delete notification"
      );
    });
  });
});
