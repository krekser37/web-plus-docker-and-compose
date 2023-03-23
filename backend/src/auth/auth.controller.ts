import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RequestUser } from 'src/utils/types';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/localGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  //авторизации
  //При запросе на /signin Passport.js проверит логин и пароль пользователя, и, если они валидные, в ответ также вернётся JWT токен.
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: RequestUser) {
    /* Генерируем для пользователя JWT токен */
    const token = await this.authService.auth(req.user);
    return token;
  }

  // регистрация
  //при запросе на /signup пользователь добавится в базу, а в ответ вернется JWT-токен для аутентификации.
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    /* При регистрации, создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create(createUserDto);
    const token = await this.authService.auth(user);
    return token;
  }
}
