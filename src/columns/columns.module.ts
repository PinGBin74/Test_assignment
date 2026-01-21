import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnsService } from './columns/columns.service';
import { ColumnController } from './columns/columns.controller';
import { ColumnEntity } from '../entities/column.entity';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, User]), JwtModule],
  controllers: [ColumnController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
