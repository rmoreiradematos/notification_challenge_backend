import bcrypt from "bcrypt";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { User } from "../../core/entities/User";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: User) {
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.createUser(userData);
    return user;
  }

  async getUsers() {
    const user = await this.userRepository.getUsers();
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    return user;
  }
}
