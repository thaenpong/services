import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DoneJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "สถานะหลังปิดงาน 1. ใช้งานได้ , 2. ใช้งานไม่ได้", example: 1 })
    done_status: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "รายระเอียดการซ๋อม", example: "เปลียนแรม" })
    done_staff_detail: string;

    done_date: Date;

    status: number;
}