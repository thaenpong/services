import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'รหัสพนักงาน' })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'รหัสผ่าน' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'ชื่อ' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'รหัสพนักงาน' })
    staff_employee_id: string;
}
