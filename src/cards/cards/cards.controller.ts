import { Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { OwnerGuard } from 'src/columns/guards/owner.guard';
import { UpdateCardDto } from '../dto/update-card.dto';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/columns/:columnId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create card in column' })
  @UseGuards(OwnerGuard)
  create(
    @Body() createCardDto: CreateCardDto,
    @Param('columnId', ParseIntPipe) columndId: number,
  ) {
    return this.cardsService.create(createCardDto, columndId);
  }

  @Get()
  @ApiOperation({ summary: 'Get one card' })
  @UseGuards(OwnerGuard)
  findOne(@Param('columnId', ParseIntPipe) columnId: number) {
    return this.cardsService.findOne(id, columnId);
  }

  @Path(':id')
  @ApiOperation({ summary: 'Update card' })
  @UseGuards(OwnerGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    return this.cardsService.update(id, updateCardDto, columnId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Detele card' })
  @UseGuards(OwnerGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    return this.cardsService.remove(id, columnId);
  }
}
