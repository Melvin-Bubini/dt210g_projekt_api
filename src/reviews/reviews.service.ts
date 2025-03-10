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
      console.error("Fel vid skapande av recension:", error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Kunde inte skapa recension. Kontrollera inmatade data och försök igen."
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.find();
      if (reviews.length === 0) {
        throw new NotFoundException("Inga recensioner hittades.");
      }
      return reviews;
    } catch (error) {
      console.error("Fel vid hämtning av recensioner:", error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Kunde inte hämta recensioner."
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number): Promise<Review> {
    try {
      return await this.reviewRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.error(`Recension med ID ${id} hittades inte.`, error);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Recension med ID ${id} hittades inte.`
      });
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.findOne(id);
      Object.assign(review, updateReviewDto);
      return await this.reviewRepository.save(review);
    } catch (error) {
      console.error(`Fel vid uppdatering av recension med ID ${id}:`, error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `Kunde inte uppdatera recension med ID ${id}.`
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const review = await this.findOne(id);
      await this.reviewRepository.delete(review.id);
    } catch (error) {
      console.error(`Fel vid radering av recension med ID ${id}:`, error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `Kunde inte radera recension med ID ${id}.`
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByBookId(bookId: string): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.find({ where: { bookId } });
  
      if (reviews.length === 0) {
        console.warn(`Inga recensioner hittades för boken med ID: ${bookId}`);
        return []; // Returnera en tom lista istället för att kasta ett undantag
      }
  
      return reviews;
    } catch (error) {
      console.error(`Fel vid hämtning av recensioner för bok med ID ${bookId}:`, error);
  
      // Returnera ett mer informativt felmeddelande om något går fel
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: `Kunde inte hämta recensioner: ${error.message}`
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Kunde inte hämta recensioner på grund av ett oväntat fel."
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

}
