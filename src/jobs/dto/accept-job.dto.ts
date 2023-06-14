import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptJobDto {

    status: number

    accept_date: Date

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ผู้รับงาน", example: "9165061501" })
    accept_staff_employee_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "สถานะรับงาน 1.รับซ่อม 2. ส่งซ่อมภายนอก", example: "1" })
    accept_status: number;
}