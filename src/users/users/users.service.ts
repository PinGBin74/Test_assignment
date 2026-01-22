import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['columns'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['columns'] });
  }

  async update(
    id: number,
    UpdateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<User> {
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your profile');
    }
    const user = await this.findOne(id);

    if (UpdateUserDto.email) {
      user.email = UpdateUserDto.email;
    }
    if (UpdateUserDto.password) {
      user.password = await bcrypt.hash(UpdateUserDto.password, 10);
    }
    return this.userRepository.save(user);
  }

  async deleteAccount(
    currentUserId: number,
    deleteUserDto: DeleteUserDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.email !== deleteUserDto.email) {
      throw new ForbiddenException("Email doesn't match your account");
    }
    await this.userRepository.delete({ id: currentUserId });

    return { message: 'Your account was deleted successfully' };
  }

  async findUserColumns(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['columns'],
    });
  }
}
