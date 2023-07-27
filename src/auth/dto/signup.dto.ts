import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'ชื่อผู้ใช้', example: 'thaen' })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'รหัสผ่าน', example: '01234567' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'ชื่อ', example: 'แทนพงษ์ แฝงแปง' })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'รหัสพนักงาน', example: 9165061501 })
    staff_employee_id: string;

}
