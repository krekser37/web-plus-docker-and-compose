import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/guard/jwtGuard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async createCopy(@Param('id') id: string, @Req() req) {
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    const createWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };
    const wishCopy = await this.wishesService.create(req.user, createWishDto);
    return wishCopy;
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const user = req.user;
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    if (user.id !== wish.owner.id) {
      throw new NotFoundException(
        'Это не ваш подарок, его нельзя редактировать',
      );
    }
    if (wish.offers.length !== 0) {
      throw new NotFoundException(
        'Вы не можете редактировать подарок, тк есть желающие на него скинуться',
      );
    }

    await this.wishesService.update(+id, updateWishDto);
    return { ...wish, ...updateWishDto };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    if (req.user.id !== wish.owner.id) {
      throw new NotFoundException('Это не ваш подарок, его нельзя удалить');
    }
    await this.wishesService.remove(+id);
    return wish;
  }
}
