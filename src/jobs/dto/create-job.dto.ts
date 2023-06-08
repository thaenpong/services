import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ผู้แจ้ง", example: "9165061501" })
    user_employee_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ทรัพสิน", example: "1" })
    asset_id: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "อาการ", example: "เปิดไม่ติด" })
    user_detail: string
}
