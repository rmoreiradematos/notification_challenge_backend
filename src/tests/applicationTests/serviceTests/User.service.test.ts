import { UserService } from "../../../application/services/User.service";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { User } from "../../../core/entities/User";
import { faker } from "@faker-js/faker";
jest.mock("../../../infrastructure/repositories/UserRepository");

type MockUserRepository = UserRepository & {
  createUser: jest.Mock;
  getUserById: jest.Mock;
  updateUser: jest.Mock;
  deleteUser: jest.Mock;
  getUsers: jest.Mock;
};

describe("UserService", () => {
  let mockUserService: UserService;
  let mockUserData: User;
  let mockUserRepository: MockUserRepository;
  beforeEach(() => {
    mockUserRepository = new UserRepository() as MockUserRepository;
    mockUserService = new UserService();
    mockUserService["userRepository"] = mockUserRepository;

    mockUserData = new User(
      faker.internet.userName(),
      faker.internet.email(),
      faker.phone.number(),
      faker.internet.password(),
      "admin",
      faker.number.int()
    );
  });
  describe("createUser", () => {
    it("should create a user and return it", async () => {
      mockUserRepository.createUser.mockResolvedValue(mockUserData);

      const result = await mockUserService.createUser(mockUserData);
      expect(result).toEqual(mockUserData);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUserData);
    });
    it("should handle errors when creating a user", async () => {
      mockUserRepository.createUser.mockRejectedValue(
        new Error("Failed to create user")
      );

      await expect(mockUserService.createUser(mockUserData)).rejects.toThrow(
        "Failed to create user"
      );
    });
  });

  describe("getUserById", () => {
    it("should get a user by id and return it", async () => {
      mockUserRepository.getUserById.mockResolvedValue(mockUserData);

      const result = await mockUserService.getUserById(mockUserData?.id ?? 1);
      expect(result).toEqual(mockUserData);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(
        mockUserData.id
      );
    });
    it("should handle errors when getting a user by id", async () => {
      mockUserRepository.getUserById.mockRejectedValue(
        new Error("Failed to get user")
      );

      await expect(
        mockUserService.getUserById(mockUserData?.id ?? 1)
      ).rejects.toThrow("Failed to get user");
    });
  });
});
