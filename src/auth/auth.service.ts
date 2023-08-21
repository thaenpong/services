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

    //----------------------------------------- เข้าสุ่ระบบ
    async signIn(signInDto: SignInDto) {
        const username = signInDto.username;
        const pass = signInDto.password;
        //ค้นหา Username
        const user = await this.userService.findOneUserName(username);
        if (!user) { // ไม่มี
            throw new UnauthorizedException();
        }
        //เช็คระหัสผ่าน
        const Matches = await bcrypt.compare(pass, user.password);

        if (!Matches) { //ไม่ตรงกัน
            throw new UnauthorizedException();
        }
        //set data
        const payload = { sub: user.id, username: user.username, name: user.name, emp_id: user.staff_employee_id };
        //return ข้อมูล
        return {
            id: user.id,
            name: user.name,
            staff_employee_id: user.staff_employee_id,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    //----------------------------------------------------------- สร้างUser
    async signUp(signUpDto: SignUpDto) {
        const saltRounds = Number(process.env.SALT_ROUND);
        const password = signUpDto.password;

        // เช็คUsername ซ้ำ
        const existingUser = await this.userService.findOneUserName(signUpDto.username);
        if (existingUser) {//ถ้าซ้ำ
            throw new HttpException('Username Taken', HttpStatus.BAD_REQUEST);
        }

        try {
            //เข้ารหัสรหัสผ่าน
            signUpDto.password = await bcrypt.hash(password, saltRounds);
            //สร้าง User
            const newUserResponse = await this.userService.create(signUpDto);

            if (newUserResponse.status === 'ok') {//สร้างสำเร็จ
                const newUser = newUserResponse.data;
                const { password: _, ...response } = newUser;//ดึงรหัสผ่านออกจากข้อมูล
                return response;
            } else {//สร้างไม่สำเร็จ
                throw new HttpException(newUserResponse.data, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}