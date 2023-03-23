import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @MinLength(2, {
    message: 'Имя пользователя должно быть не короче 2 символов',
  })
  @MaxLength(64, {
    message: 'Имя пользователя должно быть не длиннее 64 символов',
  })
  @IsString()
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(2, {
    message: "Информация 'о себе' должна быть не короче 2 символов",
  })
  @MaxLength(200, {
    message: "Информация 'о себе' должна быть не длиннее 200 символов",
  })
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email?: string;
}
