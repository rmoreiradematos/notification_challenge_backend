import { ChannelRepository } from "../../../infrastructure/repositories/ChannelsRepository";
import { Channel } from "../../../core/entities/Channel";

describe("ChannelRepository", () => {
  let repository: ChannelRepository;
  beforeEach(() => {
    repository = new ChannelRepository();
  });
  describe("getById", () => {
    it("should return null when does not found a channel", async () => {
      const channel = await repository.getChannelById(10000);
      expect(channel).toBeNull();
    });

    it("should return a channel", async () => {
      const channel = await repository.getChannelById(1);
      expect(channel).toBeInstanceOf(Channel);
    });
  });

  describe("getChannels", () => {
    it("should return null when does not found a channel", async () => {
      jest
        .spyOn(repository, "getChannels")
        .mockResolvedValue([] as unknown as Channel[]);
      const channels = await repository.getChannels();
      expect(channels).toEqual([]);
    });

    it("should return a channel", async () => {
      const channel = await repository.getChannels();
      expect(channel).toBeInstanceOf(Array<Channel>);
    });
  });

  describe("createChannel", () => {
    it("should create a channel", async () => {
      const channel = await repository.createChannel(
        new Channel("name", "description")
      );
      expect(channel).toBeInstanceOf(Channel);
    });
  });

  describe("updateChannel", () => {
    it("should update a channel", async () => {
      const channel = await repository.updateChannel(1, {
        name: "name",
        description: "description",
      });
      expect(channel).toBeInstanceOf(Channel);
    });
  });
});
