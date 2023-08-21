import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  //------------------------------------ เพิ่มพนักงาน
  @Post()
  @ApiTags('Employee')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  //------------------------------------------------ ค้นหาทั้งหมด
  @Get()
  @ApiTags('Employee')
  findAll() {
    return this.employeeService.findAll();
  }

  //------------------------------------------------- ค้นหา ID
  @Get(':id')
  @ApiTags('Employee')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  //-------------------------------------------------- ค้นหา หรัสพนักงาน
  @Get('/employee_id/:id')
  @ApiTags('Employee')
  findEmpId(@Param('id') id: string) {
    return this.employeeService.findEmpId(id);
  }

  //------------------------------------------------------- แก้ไขข้อมูล
  @Patch(':id')
  @ApiTags('Employee')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  //--------------------------------------------------------- ลบข้อมูล
  @Delete(':id')
  @ApiTags('Employee')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
