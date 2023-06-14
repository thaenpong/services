import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { AcceptJobDto } from './dto/accept-job.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DoneJobDto } from './dto/done-job.dto';
import { CancelJobDto } from './dto/cancel-job.dto';
import { VerifyJobDto } from './dto/verify-job.dto';

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


  @Patch('accept/:id')
  @ApiTags('job')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: "บันทึกข้อมูลพนักงานที่รับงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้/ รับงานไปแล้ว " })
  accept(@Param('id') id: number, @Body() acceptJobDto: AcceptJobDto) {
    return this.jobsService.accept(+id, acceptJobDto);
  }

  @Patch('done/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiOkResponse({ description: "บันทึกข้อมูล / ปิดงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้/ งานปิดไปแล้ว " })
  done(@Param('id') id: number, @Body() doneJobDto: DoneJobDto) {
    return this.jobsService.done(+id, doneJobDto);
  }

  @Patch('cancel/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiOkResponse({ description: "ยกเลิกงานซ่อม" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้" })
  cancel(@Param('id') id: number, @Body() cancelJobDto: CancelJobDto) {
    return this.jobsService.cancel(+id, cancelJobDto);
  }

  @Patch('verify/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiOkResponse({ description: "ประเมินงานซ่อม" })
  @ApiBadRequestResponse({ description: "ข้อมูลไม่ถูกต้อง" })
  verify(@Param('id') id: number, @Body() verifyJobDto: VerifyJobDto) {
    return this.jobsService.verify(+id, verifyJobDto)
  }


}
