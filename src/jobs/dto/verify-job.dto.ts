import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "ID พนักงาน", example: 9165061501 })
    employee_id: number;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: "การประเมิน", example: 0 })
    is_acceptable: boolean;
}
