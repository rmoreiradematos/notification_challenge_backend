import { ChannelService } from "../../../application/services/Channel.service";
import { ChannelRepository } from "../../../infrastructure/repositories/ChannelsRepository";
import { Channel } from "../../../core/entities/Channel";
import { faker } from "@faker-js/faker";

jest.mock("../../../infrastructure/repositories/ChannelsRepository");

type MockChannelRepository = ChannelRepository & {
  createChannel: jest.Mock<any, any>;
  getChannels: jest.Mock;
  getChannelById: jest.Mock;
  updateChannel: jest.Mock;
  deleteChannel: jest.Mock;
};

describe("ChannelService", () => {
  let channelService: ChannelService;
  let mockChannelData: Channel;
  let mockChannelRepository: MockChannelRepository;

  beforeEach(() => {
    mockChannelRepository =
      new ChannelRepository() as any as MockChannelRepository;

    channelService = new ChannelService();
    channelService["channelRepository"] = mockChannelRepository;
    mockChannelData = new Channel(
      faker.internet.userName(),
      faker.internet.userName(),
      faker.number.int()
    );
  });

  describe("createChannel", () => {
    it("should create a new channel", async () => {
      mockChannelRepository.createChannel.mockResolvedValue(mockChannelData);

      const result = await channelService.createChannel(mockChannelData);
      expect(result).toEqual(mockChannelData);
      expect(mockChannelRepository.createChannel).toHaveBeenCalledWith(
        mockChannelData
      );
    });

    it("should handle errors", async () => {
      mockChannelRepository.createChannel.mockRejectedValue(
        new Error("Failed to create channel")
      );

      await expect(
        channelService.createChannel(mockChannelData)
      ).rejects.toThrow("Failed to create channel");
    });
  });

  describe("getChannels", () => {
    it("should get all channels", async () => {
      mockChannelRepository.getChannels.mockResolvedValue([mockChannelData]);

      const result = await channelService.getChannels();
      expect(result).toEqual([mockChannelData]);
      expect(mockChannelRepository.getChannels).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      mockChannelRepository.getChannels.mockRejectedValue(
        new Error("Failed to get channels")
      );

      await expect(channelService.getChannels()).rejects.toThrow(
        "Failed to get channels"
      );
    });

    it("should return an empty array if no channels are found", async () => {
      mockChannelRepository.getChannels.mockResolvedValue([]);

      const result = await channelService.getChannels();
      expect(result).toEqual([]);
    });
  });

  describe("getChannelById", () => {
    it("should get a channel by id", async () => {
      mockChannelRepository.getChannelById.mockResolvedValue(mockChannelData);

      const result = await channelService.getChannelById(1);
      expect(result).toEqual(mockChannelData);
      expect(mockChannelRepository.getChannelById).toHaveBeenCalledWith(1);
    });

    it("should handle errors", async () => {
      mockChannelRepository.getChannelById.mockRejectedValue(
        new Error("Failed to get channel")
      );

      await expect(channelService.getChannelById(1)).rejects.toThrow(
        "Failed to get channel"
      );
    });

    it("should return null if no channel is found", async () => {
      mockChannelRepository.getChannelById.mockResolvedValue(null);

      const result = await channelService.getChannelById(1);
      expect(result).toBeNull();
    });
  });

  describe("updateChannel", () => {
    it("should update a channel", async () => {
      mockChannelRepository.updateChannel.mockResolvedValue(mockChannelData);

      const result = await channelService.updateChannel(1, {
        name: "Updated Channel",
      });
      expect(result).toEqual(mockChannelData);
      expect(mockChannelRepository.updateChannel).toHaveBeenCalledWith(1, {
        name: "Updated Channel",
      });
    });

    it("should handle errors", async () => {
      mockChannelRepository.updateChannel.mockRejectedValue(
        new Error("Failed to update channel")
      );

      await expect(
        channelService.updateChannel(1, { name: "Updated Channel" })
      ).rejects.toThrow("Failed to update channel");
    });
  });

  describe("deleteChannel", () => {
    it("should delete a channel", async () => {
      mockChannelRepository.deleteChannel.mockResolvedValue(mockChannelData);

      const result = await channelService.deleteChannel(1);
      expect(result).toEqual(mockChannelData);
      expect(mockChannelRepository.deleteChannel).toHaveBeenCalledWith(1);
    });

    it("should handle errors", async () => {
      mockChannelRepository.deleteChannel.mockRejectedValue(
        new Error("Failed to delete channel")
      );

      await expect(channelService.deleteChannel(1)).rejects.toThrow(
        "Failed to delete channel"
      );
    });
  });
});
