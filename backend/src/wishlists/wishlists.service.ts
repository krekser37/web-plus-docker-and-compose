import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wish = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });
    delete createWishlistDto.itemsId;
    const wishlist = this.wishlistRepository.save({
      ...createWishlistDto,
      items: wish,
      owner,
    });
    return wishlist;
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const { itemsId } = updateWishlistDto;
    const wish = await this.wishesService.findMany({
      where: { id: In(itemsId) },
    });
    const wishlist = await this.findOne(id);
    const newItems = [...wish, ...wishlist.items];
    if (userId !== wishlist.owner.id) {
      throw new NotFoundException(
        'Вы не можете изменить wishlist другого пользователя',
      );
    }
    await this.wishlistRepository.save({
      id,
      items: newItems,
      ...updateWishlistDto,
    });
    const updatewishlist = await this.findOne(id);
    return updatewishlist;
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Такого wishlist не существует');
    }
    if (userId !== wishlist.owner.id) {
      throw new NotFoundException(
        'Вы не можете удалять wishlist другого пользователя',
      );
    }
    this.wishlistRepository.delete(id);
    delete wishlist.owner;
    delete wishlist.items;
    return wishlist;
  }
}
