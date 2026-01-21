import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { ColumnEntity } from 'src/entities/column.entity';
import { Repository } from 'typeorm';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/number-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private columnRepository: Repository<ColumnEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
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
  async findAll(userId: number): Promise<ColumnEntity[]> {
    return this.columnRepository.find({
      where: { userId },
      order: { position: 'ASC' },
    });
  }

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

  async update(
    id: number,
    updateColumnDto: UpdateColumnDto,
    userId: number,
  ): Promise<ColumnEntity> {
    const column = await this.findOne(id, userId);
    Object.assign(column, updateColumnDto);
    return this.columnRepository.save(column);
  }

  async remove(id: number, userId: number): Promise<void> {
    const column = await this.findOne(id, userId);
    await this.columnRepository.remove(column);
  }

  async findUserColumn(userId: number) {
    return this.columnRepository.find({
      where: { userId },
      relations: ['cards'],
    });
  }
}
