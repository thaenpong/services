import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { get } from 'http';
import { SwitchAssetDto } from './dto/switch-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }


  /* @Get('makelog/')
  makelog() {
    return this.assetsService.makelog();
  } */

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "บันทึกข้อมูล ทรัพย์สินที่ลงทะเบียน" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("asset")
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiTags("asset")
  @ApiOkResponse({ description: "แสดงรายการทรัพสินทั้งหมด ไม่รวมถอดถอน" })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiTags("asset")
  @ApiParam({ name: 'id', description: "ID ทรัพย์สิน", example: 77 })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: "ID ทรัพย์สิน", example: 77 })
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "อัพเดทข้อมูล ทรัพย์สินที่ลงทะเบียน" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("asset")
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Get('category/:id')
  @ApiTags("asset")
  @ApiParam({ name: 'id', description: "ID หมวดหมู่", example: 4 })
  findcategory(@Param('id') id: string) {
    return this.assetsService.findcategory(+id);
  }

  @Get('status/:id')
  @ApiTags("asset")
  @ApiParam({ name: 'id', description: "ID สถานะ", example: 1 })
  status(@Param('id') id: string) {
    return this.assetsService.status(+id);
  }

  /*  @Get('asset_logs/:asset_id')
   @ApiOkResponse({ description: "รายการประวัติการใช้งาน" })
   @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
   @ApiTags('logs')
   getlogs(@Param('asset_id') id: number) {
     return this.assetsService.getlogs(+id);
   } */


  @Get('employee/:employee_id')
  @ApiParam({ name: 'employee_id', description: "รหัสพนักงาน", example: 9165082901 })
  @ApiOkResponse({ description: "รายการ asset ตามรหัสพนักงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('asset')
  getemployee(@Param('employee_id') id: number) {
    return this.assetsService.getempid(+id);
  }

  @Post('switch/')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "แสดงรายระเอียด to_asset  " })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("switch")
  switch(@Body() switchassetdto: SwitchAssetDto) {
    return this.assetsService.switch(switchassetdto);
  }

  /*   @Delete(':id')
    remove(@Param('id') id: string) {
      return this.assetsService.remove(+id);
    } */
}
