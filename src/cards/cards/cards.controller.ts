import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { OwnerGuard } from '../../columns/guards/owner.guard';
import { UpdateCardDto } from '../dto/update-card.dto';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/columns/:columnId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create card in column' })
  @UseGuards(OwnerGuard)
  create(
    @Body(ValidationPipe) createCardDto: CreateCardDto,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.cardsService.create(createCardDto, columnId, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards in column' })
  @UseGuards(OwnerGuard)
  findAll(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.cardsService.findAll(columnId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one card' })
  @UseGuards(OwnerGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.cardsService.findOne(id, columnId, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update card' })
  @UseGuards(OwnerGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.cardsService.update(id, updateCardDto, columnId, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete card' })
  @UseGuards(OwnerGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Request() req: any,
  ) {
    return this.cardsService.remove(id, columnId, req.user.userId);
  }
}
