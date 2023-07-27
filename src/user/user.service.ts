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

  async create(createUserDto: CreateUserDto) {
    try {
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

  findAll() {
    return `This action returns all user`;
  }

  async findOneUserName(username: string): Promise<User | undefined> {
    return await this.UserRepo.findOne({ where: { username: username } });
  }

  async findOneId(id: number) {
    return await this.UserRepo.findOne({ where: { id: id } });
  }



  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
