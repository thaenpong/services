import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRemovedDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ทรัพย์สิน", example: 1 })
    asset_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ผู้ถอดถอน", example: 9165061501 })
    staff_employee_id: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "สาเหตุการถอดถอน", example: "บอร์ดเสีย" })
    detail: string;

}
