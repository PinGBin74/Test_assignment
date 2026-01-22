import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Card } from '../entities/card.entity';
import { ColumnEntity } from '../entities/column.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentOwnerGuard } from './guards/comment-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Card, ColumnEntity])],
  controllers: [CommentsController],
  providers: [CommentsService, CommentOwnerGuard],
})
export class CommentsModule {}
