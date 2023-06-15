import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobStatus } from './entities/jobs_status.entity';
import { Repository } from 'typeorm';


@Injectable()
export class StatusService {
  constructor(
    //import Entity Job
    @InjectRepository(JobStatus)
    private JobStatusResponsitory: Repository<JobStatus>,) { }

  async findAll() {
    try {
      const res = await this.JobStatusResponsitory.find();
      return res;
    } catch (error) {
      // return error
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          //show error mesage
          message: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

}
