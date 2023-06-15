import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyJobDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "ID พนักงาน", example: 9165061501 })
<<<<<<< Updated upstream
    employee_code: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "การประเมิน", example: 0 })
    is_acceptable: number;
=======
    user_employee_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "การประเมิน", example: 1 })
    is_acceptable: boolean;
>>>>>>> Stashed changes
}
