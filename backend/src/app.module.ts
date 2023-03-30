import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { Offer } from './offers/entities/offer.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configurations from './utils/configurations';
import * as dotenv from 'dotenv';
dotenv.config();

const {
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
} = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST || 'localhost',
      port: parseInt(POSTGRES_PORT, 10) || 5432,
      username: POSTGRES_USER || 'student',
      password: POSTGRES_PASSWORD || 'student',
      database: POSTGRES_DB || 'kupipodariday',
      entities: [User, Wishlist, Wish, Offer],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
