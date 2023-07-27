import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'ชื้อผู้ใช้', example: 'thaen' })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'รหัสผ่าน', example: '' })
    password: string;

}
