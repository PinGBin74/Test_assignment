import { User } from '../entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface AuthenticatedRequest {
  user: {
    userId: number;
    email: string;
  };
}
