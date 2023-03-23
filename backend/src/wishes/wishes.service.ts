import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishesRepository.save({ ...createWishDto, owner });
  }

  findAll(): Promise<Wish[]> {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  findLast(): Promise<Wish[]> {
    return this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wish;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update({ id }, { ...updateWishDto });
  }

  async remove(id: number) {
    return await this.wishesRepository.delete({ id });
  }

  async findOneQuery(query: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne(query);
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wish;
  }

  async findMany(query: FindManyOptions<Wish>): Promise<Wish[]> {
    const wish = await this.wishesRepository.find(query);
    return wish;
  }
}
