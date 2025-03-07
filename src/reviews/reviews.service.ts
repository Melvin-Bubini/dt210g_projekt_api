import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }
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
    const reviews = await this.reviewRepository.find();
    return reviews.length > 0 ? reviews : [];
  }

  async findOne(id: number): Promise<Review | null> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    return review || null;  // Retunerar review eller null
  }


  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review | null> {
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
