import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  //------------------------------------------------------- เพิ่ม
  @Post()
  @ApiTags('department')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  //---------------------------------------------------- ค้นหาทั้งหมด
  @Get()
  @ApiTags('department')
  findAll() {
    return this.departmentService.findAll();
  }

  //---------------------------------------------------- ค้นหา ตาม ID
  @Get(':id')
  @ApiTags('department')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  //----------------------------------------------------- อัพเดทข้อมูล
  @Patch(':id')
  @ApiTags('department')
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  //------------------------------------------------------ ลบ
  @Delete(':id')
  @ApiTags('department')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
