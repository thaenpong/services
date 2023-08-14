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


  async findEmpId(id: string) {
    try {
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

  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  async findAll() {
    try {
      const employeesWithCounts = [];

      const employees = await this.employeeRepo.find({ relations: ['department'] });

      for (const employee of employees) {
        const count = await this.assetRepo.count({ where: { user_employee_id: Number(employee.employeeCode) } });
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

  async findOne(id: number) {
    try {
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

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
