import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
  ) {

  }

  //---------------------------------------- เพิ่มผู้ใช้
  async create(createUserDto: CreateUserDto) {
    try {
      //บันทึก
      const save = await this.UserRepo.save(createUserDto);
      const response = {
        status: 'ok',
        data: save,
      };
      return response;
    } catch (error) {
      const response = {
        status: 'failed',
        data: error.message, // Corrected typo from `error.massage` to `error.message`
      };
      return response;
    }
  }

  //----------------------------------------------- ค้นหาทั้งหมด
  findAll() {
    return `This action returns all user`;
  }

  //------------------------------------------------- ค้นหา username
  async findOneUserName(username: string): Promise<User | undefined> {
    return await this.UserRepo.findOne({ where: { username: username } });
  }

  //----------------------------------------------------------- ค้นหา ID
  async findOneId(id: number) {
    return await this.UserRepo.findOne({ where: { id: id } });
  }

  //-------------------------------------------------------------- แก้ไขข้อมูล
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  //---------------------------------------------------------------- ลบ
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
