import { UserSubscription } from "../entities/UserSubscription";

export interface IUserSubscriptionRepository {
  createUserSubscription(
    userSubscription: UserSubscription
  ): Promise<UserSubscription>;
  getUserSubscriptionByChannelId(
    channelId: number
  ): Promise<UserSubscription[]>;
  getSubscriptionsByUser(userId: number): Promise<UserSubscription[]>;
  updateUserSubscription(
    id: number,
    userId: number,
    channelId: number,
    notificationId: number
  ): Promise<UserSubscription>;
  deleteSubscription(userId: number, channelId: number): Promise<void>;
}
