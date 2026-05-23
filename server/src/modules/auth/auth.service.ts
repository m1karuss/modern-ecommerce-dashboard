import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto, AuthResponse, AuthTokens } from './auth.types';
import { hashPassword, comparePassword } from '../../common/utils/hash.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/token.util';
import { AppError } from '../../common/utils/app-error.util';
import { UserStatus } from '@prisma/client';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await this.authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('Account is not active', 403);
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    await this.authRepository.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokenRecord = await this.authRepository.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new AppError('Refresh token not found', 401);
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.authRepository.deleteRefreshToken(refreshToken);
      throw new AppError('Refresh token expired', 401);
    }

    const user = await this.authRepository.findUserById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.authRepository.deleteRefreshToken(refreshToken);

    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRepository.deleteRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authRepository.deleteUserRefreshTokens(userId);
  }

  private async generateTokens(userId: string, email: string, role: any): Promise<AuthTokens> {
    const accessToken = generateAccessToken({ userId, email, role });
    const refreshToken = generateRefreshToken({ userId, email, role });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
