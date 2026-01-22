import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../entities/card.entity';
import { ColumnEntity } from '../entities/column.entity';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card, ColumnEntity])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
