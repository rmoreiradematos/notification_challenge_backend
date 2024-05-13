import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { User } from "../../../core/entities/User";
import { faker } from "@faker-js/faker";

describe("UserRepository", () => {
  let repository: UserRepository;
  beforeEach(() => {
    repository = new UserRepository();
  });
  describe("getById", () => {
    it("should return null when does not found a user", async () => {
      const user = await repository.getUserById(10000);
      expect(user).toBeNull();
    });

    it("should return a user", async () => {
      const findUser = await repository.createUser({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        password: faker.internet.password(),
        role: "user",
      });
      const user = await repository.getUserById(findUser?.id as number);
      expect(user).toBeInstanceOf(User);
    });
  });

  describe("getChannels", () => {
    it("should return null when does not found a user", async () => {
      jest
        .spyOn(repository, "getUsers")
        .mockResolvedValue([] as unknown as User[]);
      const users = await repository.getUsers();
      expect(users).toEqual([]);
    });

    it("should return a user", async () => {
      const user = await repository.getUsers();
      expect(user).toBeInstanceOf(Array<User>);
    });
  });

  describe("createChannel", () => {
    it("should create a user", async () => {
      const user = await repository.createUser(
        new User(
          faker.internet.userName(),
          faker.internet.email(),
          faker.phone.number(),
          faker.internet.password(),
          "user"
        )
      );
      expect(user).toBeInstanceOf(User);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const user = await repository.updateUser(2, {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        password: faker.internet.password(),
        role: "user",
      });
      expect(user).toBeInstanceOf(User);
    });
  });
  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const user = await repository.createUser({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        password: faker.internet.password(),
        role: "user",
      });
      await repository.deleteUser(user?.id as number);
      const userDeleted = await repository.getUserById(user?.id as number);
      expect(userDeleted).toBeNull();
    });
  });
});
