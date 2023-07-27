import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';



@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService

    ) {

    }


    async signIn(signInDto: SignInDto) {
        const saltRounds = Number(process.env.SALT_ROUND);
        const username = signInDto.username;
        const pass = signInDto.password;
        const user = await this.userService.findOneUserName(username);
        if (!user) {
            throw new UnauthorizedException();
        }
        const Matches = await bcrypt.compare(pass, user.password);

        if (!Matches) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username, name: user.name, emp_id: user.staff_employee_id };
        return {
            id: user.id,
            name: user.name,
            staff_employee_id: user.staff_employee_id,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(signUpDto: SignUpDto) {
        const saltRounds = Number(process.env.SALT_ROUND);
        const password = signUpDto.password;

        const existingUser = await this.userService.findOneUserName(signUpDto.username);
        if (existingUser) {
            throw new HttpException('Username Taken', HttpStatus.BAD_REQUEST);
        }

        try {
            signUpDto.password = await bcrypt.hash(password, saltRounds);
            const newUserResponse = await this.userService.create(signUpDto);

            if (newUserResponse.status === 'ok') {
                const newUser = newUserResponse.data;
                const { password: _, ...response } = newUser;
                return response;
            } else {
                throw new HttpException(newUserResponse.data, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}