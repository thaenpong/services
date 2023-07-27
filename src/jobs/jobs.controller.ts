import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { AcceptJobDto } from './dto/accept-job.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DoneJobDto } from './dto/done-job.dto';
import { CancelJobDto } from './dto/cancel-job.dto';
import { VerifyJobDto } from './dto/verify-job.dto';
import { Public } from 'src/auth/decorators';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Public()
  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "บันทึกข้อมูลแจ้งซ่อมสำเร็จ" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags('job')
  async create(@Body() createJobDto: CreateJobDto) {
    const res = await this.jobsService.create(createJobDto);
    this.jobsService.sendNotification(res.data.id, res.data.user_detail, res.data.user_employee_id, res.data.asset.code)
    return res;
  }

  @Public()
  @Get('status/:status')
  @ApiParam({ name: 'status', description: 'ID สถานะ', example: 1 })
  @ApiOkResponse({ description: "รายการแจ้งซ่อมตามสถานะงาน 1.ยังไม่รับงาน 2. กำลังปฎิบัติ 3.เสร็จ 4.ยกเลิก" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้ / สถานะไม่ถูกต้อง" })
  @ApiTags('job')
  finds(@Param('status') status: number) {
    return this.jobsService.finds(+status);
  }

  @Public()
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID งาน', example: 1 })
  @ApiOkResponse({ description: "แสดงรายระเอียดงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('job')
  findOne(@Param('id') id: number) {
    return this.jobsService.findOne(+id);
  }

  @Public()
  @Patch('accept/:id')
  @ApiTags('job')
  @UsePipes(ValidationPipe)
  @ApiParam({ name: 'id', description: 'ID งาน', example: 1 })
  @ApiOkResponse({ description: "บันทึกข้อมูลพนักงานที่รับงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้/ รับงานไปแล้ว " })
  accept(@Param('id') id: number, @Body() acceptJobDto: AcceptJobDto) {
    return this.jobsService.accept(+id, acceptJobDto);
  }

  @Public()
  @Patch('done/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiParam({ name: 'id', description: 'ID งาน', example: 1 })
  @ApiOkResponse({ description: "บันทึกข้อมูล / ปิดงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้/ งานปิดไปแล้ว " })
  done(@Param('id') id: number, @Body() doneJobDto: DoneJobDto) {
    return this.jobsService.done(+id, doneJobDto);
  }

  @Public()
  @Patch('cancel/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiParam({ name: 'id', description: 'ID งาน', example: 1 })
  @ApiOkResponse({ description: "ยกเลิกงานซ่อม" })
  @ApiBadRequestResponse({ description: "ไม่มารถอัพเดทข้อมูลได้" })
  cancel(@Param('id') id: number, @Body() cancelJobDto: CancelJobDto) {
    return this.jobsService.cancel(+id, cancelJobDto);
  }

  @Public()
  @Patch('verify/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('job')
  @ApiParam({ name: 'id', description: 'ID งาน', example: 1 })
  @ApiOkResponse({ description: "ประเมินงานซ่อม" })
  @ApiBadRequestResponse({ description: "ข้อมูลไม่ถูกต้อง" })
  verify(@Param('id') id: number, @Body() verifyJobDto: VerifyJobDto) {
    return this.jobsService.verify(+id, verifyJobDto)
  }


}
