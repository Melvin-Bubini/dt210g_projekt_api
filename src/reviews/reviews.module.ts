import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.model';

@Module({
  imports: [TypeOrmModule.forFeature([Review], "reviewsConnection")],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],  
})
export class ReviewsModule {}
