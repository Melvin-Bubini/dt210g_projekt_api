import { Controller, Post, Body, Res, Req, Get, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { HttpStatus } from "@nestjs/common";

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) { }
    @Post("register")
    async addUser(
        @Body("name") name: string,
        @Body("email") email: string,
        @Body("password") password: string,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const user = await this.usersService.createUser(name, email, password);
            return res.status(HttpStatus.CREATED).json({ message: "Användare skapad", userId: user.id });
        } catch (error) {
            console.error("Fel vid skapande av användare:", error.message);
            return res.status(error?.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || "Något gick fel" });
        }

    }

    @Post("login")
    async loginUser(
        @Body("email") email: string,
        @Body("password") password: string,
        @Res() res: Response,
    ): Promise<any> {
        try {
            const user = await this.usersService.findUserByEmail(email);

            if (!user || !user.password) {
                return res.status(400).json({ message: 'Felaktigt lösenord/email' });;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Felaktigt lösenord/email' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, "jwt_token", { expiresIn: "1h" });

            res.cookie('jwt', token, { httpOnly: true, secure: false });
            return res.status(200).json({ message: 'Inloggning lyckades', token, user: { id: user.id, email: user.email, name: user.name } });
        } catch (error) {
            console.error("Fel vid inloggning:", error.message);
            throw new Error("Inloggning misslyckades");
        }
    }

    @Get("validate")
    async validateUser(
        @Req() req: any,
        @Res() res: Response
    ): Promise<any> {
        try {
            // Läs token från Authorization-headern
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new UnauthorizedException("Ingen token hittades");
            }

            const token = authHeader.split(" ")[1]; // Extrahera token
            const secretKey = "jwt_token"; // Samma nyckel som vid inloggning

            // Validera token
            const decoded: any = jwt.verify(token, secretKey);
            if (!decoded) {
                throw new UnauthorizedException("Token är ogiltig");
            }

            // Hämta användaren från databasen
            const user = await this.usersService.findUserById(decoded.userId);
            if (!user) {
                throw new UnauthorizedException("Användare ej hittad");
            }

            // Returnera användarens info
            return res.status(200).json({ user });
        } catch (error) {
            console.error("Token valideringsfel:", error.message);
            return res.status(401).json({ message: "Ogiltig token" });
        }
    }


}