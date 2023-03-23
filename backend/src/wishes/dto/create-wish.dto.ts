import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @MinLength(1, {
    message: 'Название подарка должно быть не короче 2 символов',
  })
  @MaxLength(250, {
    message: 'Название подарка должно быть не длиннее 64 символов',
  })
  @IsNotEmpty()
  name: string;

  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  link: string;

  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  image: string;

  @Min(1)
  @IsInt()
  @IsPositive()
  price: number; //округляется до сотых.

  @IsString()
  @Length(1, 1024)
  description: string;
}
