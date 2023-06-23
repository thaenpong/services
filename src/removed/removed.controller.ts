import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { RemovedService } from './removed.service';
import { CreateRemovedDto } from './dto/create-removed.dto';
import { UpdateRemovedDto } from './dto/update-removed.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('removed')
export class RemovedController {
  constructor(private readonly removedService: RemovedService) { }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "บันทึกข้อมูลสำเร็จ" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags('remove')
  create(@Body() createRemovedDto: CreateRemovedDto) {
    return this.removedService.create(createRemovedDto);
  }

  @Get()
  @ApiOkResponse({ description: "รายการแจ้งถอดถอน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('remove')
  findAll() {
    return this.removedService.findAll();
  }

  @Get('/status/:id')
  @ApiOkResponse({ description: "รายการแจ้งถอดถอน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('remove')
  unapprove(@Param('id') id: string) {
    return this.removedService.status(+id);
  }

  @Get(':id')
  @ApiOkResponse({ description: "แสดงรายระเอียด" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('remove')
  findOne(@Param('id') id: string) {
    return this.removedService.findOne(+id);
  }

  @Patch(':id')
  @ApiTags('remove')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: "อนุมัติการถอดถอน" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้/ รับงานไปแล้ว " })

  approve(@Param('id') id: string, @Body() updateRemovedDto: UpdateRemovedDto) {
    return this.removedService.approve(+id, updateRemovedDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: "ลบข้อมูล" })
  @ApiBadRequestResponse({ description: "ไม่สามารถลบข้อมูลได้" })
  @ApiTags('remove')
  remove(@Param('id') id: string) {
    return this.removedService.remove(+id);
  }

}
