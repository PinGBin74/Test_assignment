import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { OwnerGuard } from '../../columns/guards/owner.guard';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/columns/:columnId/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create comment for card' })
  @UseGuards(OwnerGuard)
  create(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.commentsService.create(createCommentDto, cardId, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for card' })
  @UseGuards(OwnerGuard)
  findAll(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.commentsService.findAll(cardId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific comment for card' })
  @UseGuards(OwnerGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.commentsService.findOne(id, cardId, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  @UseGuards(OwnerGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.commentsService.remove(id, cardId, req.user.userId);
  }
}
