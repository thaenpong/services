import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  //------------------------------------------------------- สร้างหมวดหมู่
  @Post('create')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: "บันทึกข้อมูลหมวดหมู่สำเร็จ" })
  @ApiBadRequestResponse({ description: "ไม่สามารถบันทึกข้อมูลได้" })
  @ApiTags("categories")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  //----------------------------------------------------------- รับข้อมูลหมวดหมู่
  @Get()
  @Public()
  @ApiCreatedResponse({ description: "แสดงรายการหมวดหมู่" })
  @ApiBadRequestResponse({ description: "ไม่สามารถเรียกข้อมูลได้" })
  @ApiTags("categories")
  findAll() {
    return this.categoriesService.findAll();
  }

  //----------------------------------------------------------  ค้นหาจาก ID
  @Get(':id')
  @ApiCreatedResponse({ description: "แสดงรายระเอียดหมวดหมู่" })
  @ApiBadRequestResponse({ description: "ไม่สามารถเรียกข้อมูลได้" })
  @ApiTags("categories")
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  //----------------------------------------------------------- แก้ไขข้อมูล
  @Patch(':id')
  @ApiCreatedResponse({ description: "อัพเดทข้อมูลหมวดหมู่" })
  @ApiBadRequestResponse({ description: "ไม่สามารถอัพเดทข้อมูลได้" })
  @ApiTags("categories")
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  //---------------------------------------------------------- ลบข้อมูล
  @Delete(':id')
  @ApiCreatedResponse({ description: "ลบหมวดหมู่สำเร็จ" })
  @ApiBadRequestResponse({ description: "ลบหมวดหมู่ไม่สำเร็จ ไม่มี id ในระบบ / ยังมีทรัพย์สินที่ใช้ id หมวดหมู่นี้อยู่" })
  @ApiTags("categories")
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }


}
