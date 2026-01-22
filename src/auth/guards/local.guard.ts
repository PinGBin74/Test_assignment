import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard to protect routes using local authentication strategy.
 * Validates email and password for login requests.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
