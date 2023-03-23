import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const { itemId, amount, hidden } = createOfferDto;
    const wish = await this.wishesService.findOneQuery({
      where: { id: itemId },
      relations: {
        owner: true,
        offers: true,
      },
    });

    const { raised, price } = wish;
    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственный подарок',
      );
    }

    if (amount > price - raised) {
      throw new ForbiddenException(
        `Вы можете внести не более ${price - raised} рублей`,
      );
    }
    const offer = await this.offersRepository.save({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    if (hidden === true) {
      delete offer.user;
      return this.offersRepository.save(offer);
    }
    delete offer.user.password;
    await this.wishesService.update(wish.id, {
      raised: raised + amount,
    });
    return offer;
  }

  findAll() {
    return this.offersRepository.find({
      relations: ['user', 'item'],
    });
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
    if (!offer) {
      throw new NotFoundException('Такого offer не существует');
    }
    return offer;
  }
}
