import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class AssetsService {
  //import entity
  constructor(
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

    @InjectRepository(Category)
    private CategoriesRespository: Repository<Category>
  ) { }

  //-------------------------------------------------------------------------------บันทึกข้อมูล
  async create(createAssetDto) {
    try {
      //เปลี่ยนให้เป็นตัวใหญ่
      createAssetDto.code = createAssetDto.code.toUpperCase();
      const category = await this.CategoriesRespository.findOne({ where: { id: createAssetDto.categories_id } })
      if (!category) {
        throw new Error("Category ID not found in the database")
      } else {
        //ลบ categories_id
        delete createAssetDto.categories_id;
        // บันทึกข้อมูล
        createAssetDto.category = category;
        // insert
        const insert = await this.AssetsRespository.save(createAssetDto);
        return { 'message': 'success', 'data': insert };
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

  //----------------------------------------------------------------------------ค้นหาทั้งหมด
  async findAll() {

    try {
      //เรียกข้อมูลทั้งหมดที่ status != 3
      const res = await this.AssetsRespository.find({
        where: { status: Not(3) },
        relations: ['category'],
      });
      return { 'message': 'success', 'data': res };
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
  //---------------------------------------------------------------------------- ค้นหารายระเอียด
  async findOne(id: number) {
    try {
      //เรียกข้อมูล
      const res = await this.AssetsRespository.findOne({ where: { id: id }, relations: ['category'], });
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

  //--------------------------------------------------------------------------- อัพเดทข้อมูล
  async update(id, updateAssetDto) {
    try {

      //เปลี่ยนให้เป็นตัวใหญ่
      updateAssetDto.code = updateAssetDto.code.toUpperCase();
      const category = await this.CategoriesRespository.findOne({ where: { id: updateAssetDto.categories_id } })
      if (!category) {
        throw new Error("Category ID not found in the database")
      } else {
        //ลบ categories_id
        delete updateAssetDto.categories_id;
        // บันทึกข้อมูล
        updateAssetDto.category = category;
        // update
        const update = await this.AssetsRespository.update(id, updateAssetDto);
        // เรียกข้อมูล
        const res = await this.AssetsRespository.findOne({ where: { id: id }, relations: ['category'] })
        // return
        return { 'message': 'success', 'data': res };
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


  /* 
    remove(id: number) {
      return `This action removes a #${id} asset`;
    } */
}
