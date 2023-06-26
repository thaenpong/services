import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SwitchAssetDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "Id จากเครื่อง", example: 7 })
    from_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "Id ไปยังเครื่อง", example: 403 })
    to_id: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "รหัสพนังาน IT", example: 9165061501 })
    staff_employee_id: number;

    @ApiProperty({ description: "รายระเอียด", example: "กดไม่ค่อยติด" })
    detail: string;
}