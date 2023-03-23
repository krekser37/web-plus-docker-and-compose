import {
  IsUrl,
  IsOptional,
  Length,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Wishlist extends Base {
  @Column()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @Column()
  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  image: string;

  @ManyToOne(() => User, (owner) => owner.wishlists)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
