import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/reviews.model';


@Module({
  imports: [
     // Anslutning för Users
     TypeOrmModule.forRoot({
      name: 'usersConnection',
      type: 'sqlite',
      database: 'users.db',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'reviewsConnection',
      type: 'sqlite',
      database:'reviews.db',
      entities: [Review],
      synchronize: true,
    }),
    UsersModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}