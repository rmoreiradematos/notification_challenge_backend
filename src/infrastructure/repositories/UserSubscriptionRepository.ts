import { IUserSubscriptionRepository } from "../../core/interfaces/IUserSubscriptionRepository";
import { UserSubscription } from "../../core/entities/UserSubscription";
import { PrismaClientSingleton } from "../db/DbConnection";

export class UserSubscriptionRepository implements IUserSubscriptionRepository {
  private prisma;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async createUserSubscription(
    userSubscription: UserSubscription
  ): Promise<UserSubscription> {
    return await this.prisma.userSubscription.create({
      data: userSubscription,
    });
  }

  async getUserSubscriptionByChannelId(
    channelId: number
  ): Promise<UserSubscription[]> {
    return await this.prisma.userSubscription.findMany({
      where: { channelId },
    });
  }

  async getSubscriptionsByUser(userId: number): Promise<UserSubscription[]> {
    return await this.prisma.userSubscription.findMany({
      where: { userId },
    });
  }

  async updateUserSubscription(
    id: number,
    userId: number,
    channelId: number,
    notificationId: number
  ): Promise<UserSubscription> {
    return await this.prisma.userSubscription.update({
      where: { id },
      data: { userId, channelId, notificationId },
    });
  }

  async deleteSubscription(userId: number, channelId: number): Promise<void> {
    await this.prisma.userSubscription.deleteMany({
      where: { userId, channelId },
    });
  }
}
