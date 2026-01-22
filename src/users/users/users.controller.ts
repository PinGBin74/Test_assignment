import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import type { AuthenticatedRequest } from '../../interfaces/auth.types';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return this.userService.findOne(req.user.userId);
  }

  @Get('columns')
  @ApiOperation({ summary: 'Get current user columns' })
  getUserColumns(@Request() req: AuthenticatedRequest) {
    return this.userService.findUserColumns(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.userService.update(
      req.user.userId,
      updateUserDto,
      req.user.userId,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 204, description: 'Account was deleted' })
  async deleteAccount(
    @Body() deleteUserDto: DeleteUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.userService.deleteAccount(req.user.userId, deleteUserDto);
  }
}
