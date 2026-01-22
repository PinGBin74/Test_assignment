import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Card, Comment } from 'src/entities';
import { Repository } from 'typeorm';

/**
 * Service for managing comments on cards.
 * Provides CRUD operations for comments.
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  /**
   * Creates a new comment on a card.
   * @param createCommentDto - Comment data to create
   * @param cardId - ID of the card to comment on
   * @param userId - ID of the user creating the comment
   * @returns Created comment entity
   */
  async create(
    createCommentDto: CreateCommentDto,
    cardId: number,
    userId: number,
  ): Promise<Comment> {
    // Verify card exists and user has access through column ownership
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['column'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.column.userId !== userId) {
      throw new NotFoundException('Card not found or access denied');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      cardId,
      userId,
    });
    return this.commentRepository.save(comment);
  }

  async findAll(cardId: number, userId: number): Promise<Comment[]> {
    // Verify card exists and user has access through column ownership
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['column'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.column.userId !== userId) {
      throw new NotFoundException('Card not found or access denied');
    }

    return this.commentRepository.find({
      where: { cardId },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number, cardId: number, userId: number): Promise<Comment> {
    // Verify card exists and user has access through column ownership
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['column'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.column.userId !== userId) {
      throw new NotFoundException('Card not found or access denied');
    }

    const comment = await this.commentRepository.findOne({
      where: { id, cardId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async remove(id: number, cardId: number, userId: number): Promise<void> {
    const comment = await this.findOne(id, cardId, userId);
    await this.commentRepository.remove(comment);
  }
}
