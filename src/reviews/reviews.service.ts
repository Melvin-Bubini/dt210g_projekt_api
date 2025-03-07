import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './reviews.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review, "reviewsConnection")
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const newReview = this.reviewRepository.create(createReviewDto);
      return await this.reviewRepository.save(newReview);
    } catch (error) {
      console.error("Fel vid lämnad recension:", error.message);
      throw new HttpException(error.message || "Något gick fel vid vid lämnad recension", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new HttpException("Recensionen hittades inte", HttpStatus.NOT_FOUND);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException("Recension hittades inte", HttpStatus.NOT_FOUND);
    }
  }
}
