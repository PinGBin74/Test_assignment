import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/entities';
import { ColumnEntity } from 'src/entities/column.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(ColumnEntity)
    private columnRepositoy: Repository<ColumnEntity>,
  ) {}
  async create(createCardDto: CreateCardDto, columnId: number, userId: number): Promise<Card> {
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

  async remove(id: number, columnId: number, userId: number): Promise<void> {
    const card = await this.findOne(id, columnId, userId);
    await this.cardRepository.delete(card);
  }
}
