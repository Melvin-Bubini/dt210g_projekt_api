import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.model';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'usersConnection')],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}