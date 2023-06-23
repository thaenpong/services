import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { get } from 'http';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

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
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "อัพเดทข้อมูล ทรัพย์สินที่ลงทะเบียน" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("asset")
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Get('category/:id')
  @ApiTags("asset")
  findcategory(@Param('id') id: string) {
    return this.assetsService.findcategory(+id);
  }

  @Get('status/:id')
  @ApiTags("asset")
  status(@Param('id') id: string) {
    return this.assetsService.status(+id);
  }

  @Get('logs/:asset_id')
  @ApiOkResponse({ description: "รายการประวัติการใช้งาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('logs')
  getlogs(@Param('asset_id') id: number) {
    return this.assetsService.getlogs(+id);
  }

  @Get('employee/:employee_id')
  @ApiOkResponse({ description: "รายการประวัติการใช้งาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('asset')
  getemployee(@Param('employee_id') id: number) {
    return this.assetsService.getempid(+id);
  }

  @Get('switch/')
  @ApiQuery({ name: 'from_id', example: 7, required: true })
  @ApiQuery({ name: 'to_id', example: 403, required: true })
  @ApiCreatedResponse({ description: "อัพเดทข้อมูล ทรัพย์สินที่ลงทะเบียน" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("asset")
  switch(@Query('from_id') from_id: number, @Query('to_id') to_id: number) {
    return this.assetsService.switch(from_id, to_id);
  }
  /*   @Delete(':id')
    remove(@Param('id') id: string) {
      return this.assetsService.remove(+id);
    } */
}
