import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
export class CreateUserDto {
  @MinLength(2, {
    message: 'Имя пользователя должно быть не короче 2 символов',
  })
  @MaxLength(64, {
    message: 'Имя пользователя должно быть не длиннее 64 символов',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

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
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(2, {
    message: 'Пароль должен быть не короче 2 символов CreateUserDto ',
  })
  password: string;
}
