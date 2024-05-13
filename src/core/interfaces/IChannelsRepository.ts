import { Channel } from "../entities/Channel";

export interface IChannelRepository {
  createChannel(channel: Channel): Promise<Channel>;
  getChannelById(channelId: number): Promise<Channel | null>;
  updateChannel(channelId: number, channel: Channel): Promise<Channel>;
  deleteChannel(channelId: number): Promise<void>;
  getChannels(): Promise<Channel[]>;
}
