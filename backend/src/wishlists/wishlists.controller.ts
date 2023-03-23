import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from 'src/auth/guard/jwtGuard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  //ЕСЛИ В ЭТОМ МЕТОДЕ ОПЯТЬ БУДЕТ ОШИБКА, ПРОШУ НАПИСАТЬ В ЧЕМ ОНА ЗАКЛЮЧАЕТСЯ. Я НЕ ПОНИМАЮ...
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.update(
      +id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return await this.wishlistsService.remove(+id, req.user.id);
  }
}
