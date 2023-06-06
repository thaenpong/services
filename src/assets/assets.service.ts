import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Asset } from './entities/asset.entity';


@Injectable()
export class AssetsService {
  //import entity
  constructor(
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>
  ) { }
  //-------------------------------------------------------------------------------บันทึกข้อมูล
  async create(createAssetDto) {
    try {
      createAssetDto.code = createAssetDto.code.toUpperCase();
      // บันทึกข้อมูล
      const insert = await this.AssetsRespository.save(createAssetDto);
      // return
      return insert;
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
  findAll() {
    return this.AssetsRespository.find({ where: { status: Not(3) } });
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
