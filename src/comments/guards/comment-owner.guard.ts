import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Record<string, unknown>>();
    const user = request.user as { userId: string; email: string };
    const params = request.params as { id?: string };

    const commentId = parseInt(params.id || '0', 10);
    if (isNaN(commentId) || commentId <= 0) {
      throw new ForbiddenException('Invalid comment ID');
    }

    const userId = parseInt(user.userId, 10);
    if (isNaN(userId) || userId <= 0) {
      throw new ForbiddenException('Invalid user ID');
    }

    const comment = await this.repository.findOne({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      throw new ForbiddenException('You can only manage your own comments');
    }
    request.comment = comment;
    return true;
  }
}