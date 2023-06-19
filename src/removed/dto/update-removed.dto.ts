import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateRemovedDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ผู้อนุมัติ", example: 9165061501 })
    approved_id: number
}
