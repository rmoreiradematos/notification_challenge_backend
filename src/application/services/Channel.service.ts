import { ChannelRepository } from "../../infrastructure/repositories/ChannelsRepository";
import { Channel } from "../../core/entities/Channel";

export class ChannelService {
  private channelRepository: ChannelRepository;

  constructor() {
    this.channelRepository = new ChannelRepository();
  }

  async createChannel(channelData: Channel) {
    const channel = await this.channelRepository.createChannel(channelData);
    return channel;
  }

  async getChannels() {
    const user = await this.channelRepository.getChannels();
    return user;
  }

  async getChannelById(id: number) {
    const user = await this.channelRepository.getChannelById(id);
    return user;
  }

  async updateChannel(
    id: number,
    channelData: { name?: string; description?: string }
  ) {
    const user = await this.channelRepository.updateChannel(id, channelData);
    return user;
  }

  async deleteChannel(id: number) {
    const user = await this.channelRepository.deleteChannel(id);
    return user;
  }
}
