import { NotificationManager } from "../../../application/observer/NotificationManager";

describe("NotificationManager", () => {
  describe("getInstance", () => {
    it("should create an instance and initialize it", async () => {
      const instance = await NotificationManager.getInstance();
      expect(instance).toBeInstanceOf(NotificationManager);
    });
    it("should return the same instance on subsequent calls", async () => {
      const instance1 = await NotificationManager.getInstance();
      const instance2 = await NotificationManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should return Notification manager is not initialized when not initialize the channel", async () => {
      NotificationManager.getInstance = jest.fn().mockResolvedValueOnce({
        channel: null,
      });
      const instance = await NotificationManager.getInstance();
      expect(instance).toEqual({ channel: null });
    });
  });
});
