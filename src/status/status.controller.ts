import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusService } from './status.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';


@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) { }



  @Get('jobstatus')
  @ApiTags('status')
  @ApiOkResponse({ description: "สถานะงาน" })
  findAll() {
    return this.statusService.findAll();
  }

}
