import { UserSubscriptionRepository } from "../../../infrastructure/repositories/UserSubscriptionRepository";
import { UserSubscription } from "../../../core/entities/UserSubscription";
import { faker } from "@faker-js/faker";

describe("UserSubscriptionRepository", () => {
  let repository: UserSubscriptionRepository;
  beforeEach(() => {
    repository = new UserSubscriptionRepository();
  });
  describe("getSubscriptionsByUser", () => {
    it("should return null when does not found a user subscription", async () => {
      const userSubscriptions = await repository.getSubscriptionsByUser(10000);
      expect(userSubscriptions).toEqual([]);
    });

    it("should return a user subscription", async () => {
      const findUserSubscription = await repository.createUserSubscription({
        userId: 1,
        channelId: 1,
        notificationId: 1,
      });
      const userSubscription = await repository.getSubscriptionsByUser(
        findUserSubscription.userId
      );
      expect(userSubscription).toBeInstanceOf(Array);
    });
  });
  describe("updateUserSubscription", () => {
    it("should update a user subscription", async () => {
      const userSubscription = await repository.createUserSubscription({
        userId: 1,
        channelId: 1,
        notificationId: 1,
      });
      const updatedUserSubscription = await repository.updateUserSubscription(
        userSubscription?.id as number,
        2,
        2,
        2
      );
      expect(updatedUserSubscription).toBeInstanceOf(Object);
    });
  });
  describe("deleteSubscription", () => {
    it("should delete a user subscription", async () => {
      const userSubscription = await repository.createUserSubscription({
        userId: 1,
        channelId: 1,
        notificationId: 1,
      });
      await repository.deleteSubscription(
        userSubscription.userId,
        userSubscription.channelId
      );
      const userSubscriptions = await repository.getSubscriptionsByUser(
        userSubscription.userId
      );
      expect(userSubscriptions).toEqual([]);
    });
  });
});
