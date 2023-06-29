import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "ชื่อหมวดหมู่", example: "จอคอมพิวเตอร์" })
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "ตัวอักษรย่อ", example: "MT." })
    shortName: string

    @IsNotEmpty()
    @ApiProperty({ description: "id ผู้สร้าง", example: "9165061501" })
    staff_employee_id: number
}
