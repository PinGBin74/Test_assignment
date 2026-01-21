import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from '../dto/create-column.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateColumnDto } from '../dto/number-column.dto';

@ApiTags('columns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create column' })
  create(
    @Body(ValidationPipe) createColumnDto: CreateColumnDto,
    @Request() req: any,
  ) {
    return this.columnsService.create(createColumnDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all columns' })
  findAll(@Request() req: any) {
    return this.columnsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certain column' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.columnsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update column' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColumnDto: UpdateColumnDto,
    @Request() req: any,
  ) {
    return this.columnsService.update(id, updateColumnDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete column (cascade cards/comments)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.columnsService.remove(id, req.user.userId);
  }
}
