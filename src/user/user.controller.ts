import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  /* @Post()
  @ApiTags('User')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  } */

  @Get()
  @ApiTags('User')
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @ApiTags('User')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiTags('User')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
