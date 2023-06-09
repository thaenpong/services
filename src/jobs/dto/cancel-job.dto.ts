import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CancelJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id พนักงานที่ยกเลิก" })
    staff_employee_id: number
}