import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "บันทึกข้อมูลแจ้งซ่อมสำเร็จ" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags('job')
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get('status/:status')
  @ApiOkResponse({ description: "รายการแจ้งซ่อมตามสถานะงาน 1.ยังไม่รับงาน 2. กำลังปฎิบัติ 3.เสร็จ 4.ยกเลิก" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('job')
  finds(@Param('status') status: number) {
    return this.jobsService.finds(+status);
  }



  @Get(':id')
  @ApiOkResponse({ description: "แสดงรายระเอียดงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('job')
  findOne(@Param('id') id: number) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }


}
