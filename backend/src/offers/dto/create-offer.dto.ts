import { IsBoolean, IsInt, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  itemId: number;
}
