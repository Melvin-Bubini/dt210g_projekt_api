import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User, 'usersConnection')
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email } });
    
            if (existingUser) {
                throw new HttpException("Användaren finns redan", HttpStatus.BAD_REQUEST);
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = this.userRepository.create({ name, email, password: hashedPassword });
            return await this.userRepository.save(newUser);
        } catch (error) {
            console.error("Fel vid registrering:", error.message);
            throw new HttpException(error.message || "Något gick fel vid registrering", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

}