import { Controller, Get, Param } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) { }

  @Get('employee/:employee_id')
  @ApiTags('history')
  @ApiOkResponse({ description: "ค้นหารายการประวัติการใช้ ตามรหัสพนักงาน" })
  @ApiParam({ name: 'employee_id', description: 'รหัสพนักงาน', example: 9166011901 })
  getemp(@Param('employee_id') id: number) {
    return this.historiesService.getlogemp(+id);
  }

  @Get('asset/:asset_id')
  @ApiTags('history')
  @ApiParam({ name: 'asset_id', example: 77, description: 'Id ทรัพสินย์' })
  @ApiOkResponse({ description: "ค้นหารายการประวัติการใช้ ตามId asset" })
  getasset(@Param('asset_id') id: number) {
    return this.historiesService.getlogaset(+id);
  }
}

