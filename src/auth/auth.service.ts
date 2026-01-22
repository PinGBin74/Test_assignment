import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UserWithoutPassword } from 'src/interfaces/auth.types';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

/**
 * Service for handling authentication operations.
 * Provides user registration, login, and token management.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the system.
   * @param registerDto - User registration data with email and password
   * @returns JWT tokens (access and refresh) for the new user
   */
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  /**
   * Authenticates user with email and password.
   * @param loginDto - User login credentials
   * @returns JWT tokens (access and refresh) for authenticated user
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    return this.generateTokens(user);
  }

  /**
   * Generates JWT tokens for user.
   * @param user - User entity to generate tokens for
   * @returns Object with access and refresh tokens
   */
  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  /**
   * Validates user credentials for local strategy.
   * @param email - User email to validate
   * @param password - User password to validate
   * @returns User object without password if valid, null otherwise
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      void _password;
      return result;
    }
    return null;
  }

  /**
   * Retrieves user profile by ID.
   * @param userId - User ID to fetch profile for
   * @returns User object with id and email
   */
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
