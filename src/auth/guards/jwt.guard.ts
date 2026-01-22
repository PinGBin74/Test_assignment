import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard to protect routes using JWT authentication.
 * Validates JWT tokens from Authorization header.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
