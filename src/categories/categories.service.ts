import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, Equal } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,

    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>

  ) { }

  //-----------------------------------------------------------------------------------------------------  บันทึกข้อมูล
  async create(createCategoryDto: any) {
    try {
      //เปลียนตัวย่อเป็นตัวใหญ่
      createCategoryDto.shortname = createCategoryDto.shortName.toLocaleUpperCase()
      delete (createCategoryDto.shortName)
      createCategoryDto.staff_employee_id
      //บันทึกข้อมูล
      const insert = await this.CategoryRepository.save(createCategoryDto);
      return { 'message': 'success', 'data': insert }
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

  //------------------------------------------------------------------------------------------------------ ค้นหาทั้งหมด
  async findAll() {
    try {
      //ค้นหาข้อมูล
      const res = await this.CategoryRepository.find();
      return { 'message': 'success', 'data': res }

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

  //----------------------------------------------------------------------------------------------------- ค้นหารายระเอียด
  async findOne(id: number) {
    try {
      //ค้นหาข้อมูล
      const res = await this.CategoryRepository.findOne({ where: { id: id } });
      return { 'message': 'success', 'data': res }

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

  //---------------------------------------------------------------------------------------------------- อัพเดทข้อมูล
  async update(id: number, updateCategoryDto: any) {
    try {
      //เปลียนตัวย่อเป็นตัวใหญ่
      updateCategoryDto.shortname = updateCategoryDto.shortName.toLocaleUpperCase()
      delete (updateCategoryDto.shortName)
      //อัพเดท
      const update = await this.CategoryRepository.update(id, updateCategoryDto);
      if (update) {
        const res = await this.CategoryRepository.findOne({ where: { id: id } });
        return { 'message': 'success', 'data': res };
      } else {
        throw new Error("cannot update")
      }
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

  async remove(id: number) {
    try {
      //เช็คว่ายังมีทรัพสินที่ใช้ id นี้ อยู่มั้ย
      const asset_check = await this.AssetsRespository.count({ where: { category: Equal(id) } })
      //ถ้าไม่มี
      if (asset_check <= 0) {
        //ลบข้อมูล
        const del = await this.CategoryRepository.delete({ id: id })
        return { 'message': 'success' }
      } else {
        // return Error
        throw new Error("Cannot delete this category")
      }
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
}
