import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusService } from './status.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';


@Controller('status')
export class StatusController {
  jobsService: any;
  constructor(private readonly statusService: StatusService) { }


  @Get('job_status')
  @ApiOkResponse({ description: "แสดงสถานะงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('status')
  job_status() {
    return this.statusService.job_status();
  }

  @Get('job_accept')
  @ApiOkResponse({ description: "แสดงรายระเอียดการรับงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('status')
  job_accept() {
    return this.statusService.job_accept();
  }

  @Get('job_done')
  @ApiOkResponse({ description: "แสดงสถานะหลังปิดงานรับงาน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('status')
  job_done() {
    return this.statusService.job_done();
  }

  @Get('job_acceptable')
  @ApiOkResponse({ description: "ระดับความพอใจ" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('status')
  job_acceptable() {
    return this.statusService.job_acceptable();
  }

  @Get('asset')
  @ApiOkResponse({ description: "สถานะของทรัพย์สิน" })
  @ApiBadRequestResponse({ description: "ไม่มารถค้นหาข้อมูลได้" })
  @ApiTags('status')
  asset() {
    return this.statusService.asset();
  }
}
