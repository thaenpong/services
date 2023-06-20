import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

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


  /*   @Delete(':id')
    remove(@Param('id') id: string) {
      return this.assetsService.remove(+id);
    } */
}
