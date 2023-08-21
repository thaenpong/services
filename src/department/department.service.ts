import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {

  //------------------------------------------------------ เพิ่มแผนก
  create(createDepartmentDto: CreateDepartmentDto) {
    return 'This action adds a new department';
  }

  //---------------------------------------------------- ค้นหาทั้งหมด
  findAll() {
    return `This action returns all department`;
  }


  //---------------------------------------------------- ค้นหาตาม ID
  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  //------------------------------------------------------- อัพเดทข้อมูล
  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  //----------------------------------------------------------- ลบ
  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
