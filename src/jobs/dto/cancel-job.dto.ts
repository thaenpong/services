import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CancelJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id พนักงานที่ยกเลิก", example: "9165061501" })
    cancel_staff_employee_id: number;
}