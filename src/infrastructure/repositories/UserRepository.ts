import { User } from "../../core/entities/User";
import { IUserRepository } from "../../core/interfaces/IUserRepository";
import { PrismaClientSingleton } from "../db/DbConnection";

export class UserRepository implements IUserRepository {
  private prisma;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async createUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        role: user.role,
      },
    });
    return new User(
      createdUser.name,
      createdUser.email,
      createdUser.phoneNumber,
      createdUser.password,
      createdUser.role,
      createdUser.id
    );
  }

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (user: User) =>
        new User(
          user.name,
          user.email,
          user.phoneNumber,
          user.password,
          user.role,
          user.id
        )
    );
  }
  async getUserById(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      return new User(
        user.name,
        user.email,
        user.phoneNumber,
        user.password,
        user.role,
        user.id
      );
    }
    return null;
  }

  async updateUser(userId: number, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        role: user.role,
      },
    });
    return new User(
      updatedUser.name,
      updatedUser.email,
      updatedUser.phoneNumber,
      updatedUser.password,
      updatedUser.role,
      updatedUser.id
    );
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
