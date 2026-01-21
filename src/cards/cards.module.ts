import { Module } from '@nestjs/common';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';

@Module({
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
