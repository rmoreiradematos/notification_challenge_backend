import { WorkerService } from "../../../infrastructure/messaging/WorkerService";

describe("WorkerService", () => {
  describe("initialize", () => {
    it("should initialize the worker service", async () => {
      const workerService = new WorkerService();
      expect(await workerService.initialize()).toBeUndefined();
    });
  });
});
