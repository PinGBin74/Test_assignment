import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities';
import { ColumnEntity } from 'src/entities/column.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';

/**
 * Service for managing cards within columns.
 * Provides CRUD operations for cards.
 */
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(ColumnEntity)
    private columnRepositoy: Repository<ColumnEntity>,
  ) {}

  /**
   * Creates a new card in a specified column.
   * @param createCardDto - Card data to create
   * @param columnId - ID of the column to add card to
   * @param userId - ID of the user creating the card
   * @returns Created card entity
   */
  async create(
    createCardDto: CreateCardDto,
    columnId: number,
    userId: number,
  ): Promise<Card> {
    const column = await this.columnRepositoy.findOne({
      where: { id: columnId, userId },
    });
    if (!column) {
      throw new NotFoundException('Column was not found or access denied');
    }
    const card = this.cardRepository.create({
      ...createCardDto,
      columnId,
    });
    return this.cardRepository.save(card);
  }

  /**
   * Update card
   * @param id
   * @param updateCardDto
   * @param columnId
   * @param userId
   * @returns new card
   */
  async update(
    id: number,
    updateCardDto: UpdateCardDto,
    columnId: number,
    userId: number,
  ): Promise<Card> {
    const card = await this.findOne(id, columnId, userId);
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  /**
   * Retrieves all cards in a specific column for a user.
   * @param columnId - ID of the column to get cards from
   * @param userId - ID of the user requesting cards
   * @returns Array of cards with comments
   */
  async findAll(columnId: number, userId: number): Promise<Card[]> {
    // Verify column belongs to user
    const column = await this.columnRepositoy.findOne({
      where: { id: columnId, userId },
    });
    if (!column) {
      throw new NotFoundException('Column was not found or access denied');
    }

    return this.cardRepository.find({
      where: { columnId },
      order: { position: 'ASC' },
      relations: ['comments'],
    });
  }

  /**
   * Retrieves a specific card by ID from a column.
   * @param id - ID of the card to find
   * @param columnId - ID of the column containing the card
   * @param userId - ID of the user requesting the card
   * @returns Card with comments if found
   */
  async findOne(id: number, columnId: number, userId: number): Promise<Card> {
    // Verify column belongs to user first
    const column = await this.columnRepositoy.findOne({
      where: { id: columnId, userId },
    });
    if (!column) {
      throw new NotFoundException('Column was not found or access denied');
    }

    const card = await this.cardRepository.findOne({
      where: { id, columnId },
      relations: ['comments'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  /**
   * Deletes a card from a column.
   * @param id - ID of card to delete
   * @param columnId - ID of the column containing the card
   * @param userId - ID of the user deleting the card
   */
  async remove(id: number, columnId: number, userId: number): Promise<void> {
    const card = await this.findOne(id, columnId, userId);
    await this.cardRepository.delete(card);
  }
}
