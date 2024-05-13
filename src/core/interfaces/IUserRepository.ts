import { User } from "../entities/User";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  getUserById(userId: number): Promise<User | null>;
  updateUser(userId: number, user: User): Promise<User>;
  deleteUser(userId: number): Promise<void>;
  getUsers(): Promise<User[]>;
}
