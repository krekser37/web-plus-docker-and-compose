import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWishlistDto {
  @MinLength(1, {
    message: 'Название Wishlist должно быть не короче 2 символов',
  })
  @MaxLength(250, {
    message: 'Название Wishlist должно быть не длиннее 64 символов',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl(undefined, { message: 'Company Url is not valid.' })
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];
}
