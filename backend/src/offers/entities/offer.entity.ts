import { IsBoolean, IsInt, IsPositive } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends Base {
  @Column({
    default: 0,
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @IsInt()
  @IsPositive()
  amount: number; //сумма заявки, округляется до двух знаков после запятой;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean; // флаг, который определяет показывать ли информацию о скидывающемся в списке.

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  user: User; //содержит id желающего скинуться;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  item: Wish; //содержит ссылку на товар;
}
