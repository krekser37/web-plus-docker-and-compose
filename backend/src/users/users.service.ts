import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, avatar, about } = createUserDto;
    const findUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (findUser) {
      throw new ConflictException(
        'Пользователь с таким именем или email уже существует',
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.create({
      username,
      about,
      avatar,
      email,
      password: hashPassword,
    });
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  async findUserWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: {
        wishes: { owner: true },
      },
    });
    if (user.wishes.length === 0) {
      throw new NotFoundException('У вас подарков не существует');
    }
    return user.wishes;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  async updateOne(
    user: UpdateUserDto,
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    const { email, username } = updateUserDto;
    const findUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (findUser && findUser.email !== user.email) {
      throw new ConflictException(
        'Пользователь с таким именем или email уже существует',
      );
    }
    return this.usersRepository.update({ id }, updateUserDto);
  }

  async findMany(
    queryEmailOrUsername: Pick<User, 'username' | 'email'>,
  ): Promise<User[]> {
    const { username, email } = queryEmailOrUsername;
    const users = await this.usersRepository.find({
      where: [{ email }, { username }],
    });
    return users;
  }

  async findByUsernameWithPassword(username: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .addSelect('user.password')
      .from(User, 'user')
      .where('user.username = :username', { username: username })
      .getOne();
    return user;
  }
}
