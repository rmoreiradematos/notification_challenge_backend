import { Channel } from "../../core/entities/Channel";
import { IChannelRepository } from "../../core/interfaces/IChannelsRepository";
import { PrismaClientSingleton } from "../db/DbConnection";

export class ChannelRepository implements IChannelRepository {
  private prisma;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async createChannel(user: Channel): Promise<Channel> {
    const createChannel = await this.prisma.channel.create({
      data: {
        name: user.name,
        description: user.description,
      },
    });
    return new Channel(
      createChannel.name,
      createChannel.description,
      createChannel.id
    );
  }

  async getChannelById(id: number): Promise<Channel | null> {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
    });
    if (channel) {
      return new Channel(channel.name, channel.description, channel.id);
    }
    return null;
  }

  async updateChannel(
    channelId: number,
    channel: { name?: string; description?: string }
  ): Promise<Channel> {
    const updatedchannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        name: channel.name,
        description: channel.description,
      },
    });
    return new Channel(
      updatedchannel.name,
      updatedchannel.description,
      updatedchannel.id
    );
  }

  async deleteChannel(channelId: number): Promise<void> {
    await this.prisma.channel.delete({
      where: { id: channelId },
    });
  }

  async getChannels(): Promise<Channel[]> {
    const channels = await this.prisma.channel.findMany();
    return channels.map(
      (channel: Channel) =>
        new Channel(channel.name, channel.description, channel.id)
    );
  }
}
