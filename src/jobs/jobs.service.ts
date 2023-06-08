import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private JobResponsitory: Repository<Job>,

    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

  ) { }

  async create(createJobDto) {
    try {
      const asset = await this.AssetsRespository.findOne({ where: { id: createJobDto.asset_id } });
      if (!asset) {
        throw new Error("Asset ID not found in the database")
      } else {
        delete createJobDto.asset_id;
        createJobDto.asset = asset;
        const insert = await this.JobResponsitory.save(createJobDto);
        return { 'message': 'success', 'data': insert }
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

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

}
