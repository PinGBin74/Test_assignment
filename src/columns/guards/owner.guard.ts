import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from '../../entities/column.entity';

/**
 * Guard to ensure resource ownership.
 * Validates that the current user owns the requested resource.
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly repository: Repository<ColumnEntity>,
  ) {}

  /**
   * Validates resource ownership before allowing access.
   * @param context - Execution context containing request information
   * @returns True if user owns the resource, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Record<string, unknown>>();
    const user = request.user as { userId: string; email: string };
    const params = request.params as { id?: string; columnId?: string };

    // Support both 'id' and 'columnId' parameter names
    const paramId = params.id || params.columnId;
    const columnId = parseInt(paramId || '0', 10);
    if (isNaN(columnId) || columnId <= 0) {
      throw new ForbiddenException('Invalid column ID');
    }

    const userId = parseInt(user.userId, 10);
    if (isNaN(userId) || userId <= 0) {
      throw new ForbiddenException('Invalid user ID');
    }

    const entity = await this.repository.findOne({
      where: { id: columnId },
      relations: ['user'],
    });

    if (!entity || entity.user.id !== userId) {
      throw new ForbiddenException('You can only manage you own columns');
    }
    request.entity = entity;
    return true;
  }
}
