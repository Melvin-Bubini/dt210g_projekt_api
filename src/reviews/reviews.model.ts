import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    bookId: string; 

    @Column({ type: "text" })
    reviewText: string;

    @Column({ type: "float", default: 0 })
    rating: number;
}
