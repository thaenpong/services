import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(Asset)
    private assetRepo: Repository<Asset>
  ) {

  }

  //-------------------------------------------------- ค้นหาตามรหัสทรัพย์สิน
  async findEmpId(id: string) {
    try {
      //ค้นหา
      const res = await this.employeeRepo.findOne({ where: { employeeCode: id }, relations: ['department'] });
      return res
    } catch (error) {
      // return error
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //----------------------------------------------------- เพิ่มพนักงาน
  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  //----------------------------------------------------- ค้นหาพนักงาน และ ทรัพย์สินที่พนักงานใช้อยู่
  async findAll() {
    try {
      const employeesWithCounts = [];
      // ค้นหาพนักงาน
      const employees = await this.employeeRepo.find({ relations: ['department'] });
      for (const employee of employees) {
        //ค้นหา จำนวนที่ใช้งาน
        const count = await this.assetRepo.count({ where: { user_employee_id: Number(employee.employeeCode) } });
        //เพิ่ม  count ลงใน employee
        employeesWithCounts.push({ ...employee, count }); // Insert count into the employee object
      }
      return employeesWithCounts;
    } catch (error) {
      // return error
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //--------------------------------------------------------------------------------------- ค้นหาตาม ID
  async findOne(id: number) {
    try {
      //ค้นหา
      const res = await this.employeeRepo.findOne({ where: { id: id }, relations: ['department'] });
      return res
    } catch (error) {
      // return error
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //--------------------------------------------------------- แก้ไขข้อมูล
  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  //--------------------------------------------------------------- ลบพนักงาน
  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
