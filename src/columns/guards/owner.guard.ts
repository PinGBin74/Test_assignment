import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from '../../entities/column.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly repository: Repository<ColumnEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { id } = request.params;
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!entity || entity.user.id !== user.userId) {
      throw new ForbiddenException('You can only manage you own columns');
    }
    request.entity = entity;
    return true;
  }
}
