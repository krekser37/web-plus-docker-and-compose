import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  //генерироруем JWT-токен:
  auth(user: User) {
    const payload = { id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);
    const passwordEqual = await bcrypt.compare(password, user.password);
    if (user && passwordEqual) {
      return user;
    }
    return null;
  }
}
