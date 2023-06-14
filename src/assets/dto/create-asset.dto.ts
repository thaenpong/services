import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAssetDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id หมวดหมู่", example: "3" })
    categories_id: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "รหัสทรัพย์สิน", example: "MS.65.65" })
    code: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "หมายเลขซีเรียล", example: "SN548879ZV44" })
    serial_number: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ยี่ห้อ", example: "Asus" })
    brand: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "ประเภทอุปกรณ์", example: "เมาส์ไร้สาย" })
    type: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "ชื่อรุ่น", example: "Asus Example" })
    spec: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: "สีอุปกรณ์", example: "เทา" })
    color: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "id ผู้ใช้", example: "9165061501" })
    user_employee_id: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "หมายเหตุ", example: "ไม่ติดแท็ก" })
    note: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "id ผู้ลงทะเบียน", example: "9165061501" })
    staff_employee_id: number

    @IsOptional()
    @IsDateString()
    @ApiProperty({ description: "วันหมดประกัน", example: new Date() })
    warranty_expires: Date
}
