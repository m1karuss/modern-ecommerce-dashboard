import { PrismaClient, User } from '@prisma/client';
import { UserRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto, UserQueryDto } from './users.dto';
import { PaginatedResponse, UserWithStats } from './users.types';
import { AppError } from '../../common/utils/app-error.util';
import { hashPassword } from '../../common/utils/hash.util';

export class UserService {
  private repository: UserRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new UserRepository(prisma);
  }

  async getUsers(query: UserQueryDto): Promise<PaginatedResponse<UserWithStats>> {
    const { page, limit, sortBy, sortOrder, ...filters } = query;

    return this.repository.findAll(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  async getUserById(id: string): Promise<UserWithStats> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    return this.repository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      status: data.status,
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.repository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }
    }

    return this.repository.update(id, data);
  }

  async updateUserRole(id: string, data: UpdateUserRoleDto): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.repository.updateRole(id, data.role);
  }

  async updateUserStatus(id: string, data: UpdateUserStatusDto): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.repository.updateStatus(id, data.status);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.repository.delete(id);
  }

  async getUserStats() {
    return this.repository.getUserStats();
  }
}
