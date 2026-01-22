import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

type UserWithoutPassword = {
  id: number;
  email: string;
  created_at: Date;
};

/**
 * Local strategy for email/password authentication.
 * Validates user credentials during login.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates user credentials against the database.
   * @param email - User email from request body
   * @param password - User password from request body
   * @returns User object without password if valid
   * @throws UnauthorizedException if credentials are invalid
   */
  async validate(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
