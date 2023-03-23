import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  NotFoundException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guard/jwtGuard';
import { RequestUser } from 'src/utils/types';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('find')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getUser(@Req() requestUser: RequestUser) {
    return requestUser.user;
  }

  @Get('me/wishes')
  async getUserWishes(@Req() requestWishes) {
    return await this.usersService.findUserWishes(requestWishes.user.id);
  }

  @Patch('me')
  async updateUser(@Req() requestUser, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne(requestUser.user.id);
    if (
      updateUserDto.username === user.username &&
      updateUserDto.about === user.about &&
      updateUserDto.avatar === user.avatar &&
      updateUserDto.email === user.email
    ) {
      throw new ConflictException('Вы не изменили данные пользователя');
    }
    await this.usersService.updateOne(user, user.id, updateUserDto);
    return { ...user, ...updateUserDto };
  }

  @Get(':username')
  async getUsername(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return await this.usersService.findUserWishes(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Post('find')
  async findMany(
    @Body() queryEmailOrUsername: Pick<User, 'username' | 'email'>,
  ) {
    return await this.usersService.findMany(queryEmailOrUsername);
  }
}
