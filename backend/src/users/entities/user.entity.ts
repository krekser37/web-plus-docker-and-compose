import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsUrl,
  Length,
  MinLength,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsString,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Base } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  @Length(2, 64)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({ default: 'Пока ничего не рассказал(а) о себе' })
  @IsString()
  @MinLength(2, {
    message: "Информация 'о себе' должна быть не короче 2 символов",
  })
  @MaxLength(200, {
    message: "Информация 'о себе' должна быть не длиннее 200 символов",
  })
  @IsOptional()
  about?: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Exclude()
  @Column({ select: false })
  @MinLength(2, { message: 'Пароль должен быть не короче 2 символов User ' })
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
