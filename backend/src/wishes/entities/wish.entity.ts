import {
  IsUrl,
  IsPositive,
  Length,
  Min,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends Base {
  @Column()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  link: string;

  @Column()
  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  image: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @Min(1)
  @IsInt()
  @IsPositive()
  price: number; //округляется до сотых.

  @Column({
    default: 0,
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @Min(1)
  @IsInt()
  @IsPositive()
  raised: number; //сумма предварительного сбора или сумма,
  //которую пользователи сейчас готовы скинуть на подарок.
  //Также округляется до сотых.

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsInt()
  @IsPositive()
  copied: number; //содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число.

  @ManyToOne(() => User, (owner) => owner.wishes)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  /*  @ManyToMany(() => Wishlist, (wishlist) => wishlist.wishes)
     wishlistes: Wishlist[]; */
}
