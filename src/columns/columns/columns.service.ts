import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { ColumnEntity } from 'src/entities/column.entity';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/create-column.dto';

/**
 * Service for managing user columns.
 * Provides CRUD operations for columns with ownership validation.
 */
@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnRepository: Repository<ColumnEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new column for a user.
   * @param createColumnsDto - Column data to create
   * @param userId - ID of user creating the column
   * @returns Created column entity
   */
  async create(
    createColumnsDto: CreateColumnDto,
    userId: number,
  ): Promise<ColumnEntity> {
    const column = this.columnRepository.create({
      ...createColumnsDto,
      userId,
    });
    return this.columnRepository.save(column);
  }

  /**
   * Retrieves all columns for a specific user.
   * @param userId - ID of user to get columns for
   * @returns Array of columns ordered by position
   */
  async findAll(userId: number): Promise<ColumnEntity[]> {
    return this.columnRepository.find({
      where: { userId },
      order: { position: 'ASC' },
    });
  }

  /**
   * Finds a specific column by ID for a user.
   * @param id - ID of the column to find
   * @param userId - ID of the user requesting the column
   * @returns Column entity with cards if found
   */
  async findOne(id: number, userId: number): Promise<ColumnEntity> {
    const column = await this.columnRepository.findOne({
      where: { id, userId },
      relations: ['cards'],
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return column;
  }

  /**
   * Deletes a column for a user.
   * @param id - ID of the column to delete
   * @param userId - ID of the user deleting the column
   */
  async remove(id: number, userId: number): Promise<void> {
    const column = await this.findOne(id, userId);
    await this.columnRepository.remove(column);
  }

  /**
   * Retrieves all columns with cards for a user.
   * @param userId - ID of the user to get columns for
   * @returns Columns with cards relation loaded
   */
  async findUserColumn(userId: number) {
    return this.columnRepository.find({
      where: { userId },
      relations: ['cards'],
    });
  }
