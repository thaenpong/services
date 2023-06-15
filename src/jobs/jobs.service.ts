import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcceptJobDto } from './dto/accept-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';
import { JobStatus } from 'src/status/entities/jobs_status.entity';
import { DoneJobDto } from './dto/done-job.dto';
import { JobAcceptStatus } from 'src/status/entities/job_accept_status.entity';

import { VerifyJobDto } from './dto/verify-job.dto';

@Injectable()
export class JobsService {
  constructor(
    //import Entity Job
    @InjectRepository(Job)
    private JobResponsitory: Repository<Job>,

    //import Entity Job
    @InjectRepository(JobStatus)
    private JobStatusRespository: Repository<JobStatus>,


    //import Entity Job
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

    @InjectRepository(JobAcceptStatus)
    private JobAcceptStatusRespository: Repository<JobAcceptStatus>,

  ) { }

  //----------------------------------------------------------------------------------------------------------------- บันทึกข้อมูล
  async create(createJobDto) {
    try {

      //เช็ค id ทรัพย์สิน
      const asset = await this.AssetsRespository.findOne({ where: { id: createJobDto.asset_id } });

      // ไม่มี
      if (!asset) {
        throw new Error("Asset ID not found in the database");
      } else {
        const status = await this.AssetsRespository.update(asset.id, { status: 2 });
        if (status) {
          //ลบ asset_id ที่รับมาจาก body
          delete createJobDto.asset_id;
          //บันทึก asset จากที่เช็ค
          createJobDto.asset = asset;

          // ดึงข้อมูล สถานะ
          const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 1 } });
          //เก็บในตัวแปล
          createJobDto.status = jobstatus;

          //insert ข้อมูล
          const insert = await this.JobResponsitory.save(createJobDto);
          //เรียกข้อมูล
          const res = await this.JobResponsitory.findOne({ where: { id: insert.id }, relations: ['asset', 'status', 'accept_status', 'done_status'] });
          return { 'message': 'success', 'data': res };
        }

      }
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

  //------------------------------------------------------------------------------------------------------------------ ค้นหาตามสถานะ
  async finds(status: number) {
    try {
      //ค้นหาจาก status join กับ asset
      const res = await this.JobResponsitory.find({ where: { status: { id: status } }, relations: ['asset', 'status', 'accept_status', 'done_status'] })
      return { 'massage': 'success', 'data': res }
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


  //------------------------------------------------------------------------------------------------------------------ ค้นหา id
  async findOne(id: number) {
    try {
      //ค้นหา id งานซ่อม join กับ asset
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status'] })

      return { 'massage': 'success', 'data': res }
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


  //------------------------------------------------------------------------------------------------------------------ รับงาน
  async accept(id: number, acceptJobDto) {
    try {
      //กำหนดวันที่รับงาน
      acceptJobDto.accept_date = new Date;

      //เปลี่ยน สถานะงาน
      // ดึงข้อมูล สถานะ
      const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 2 } });
      //เก็บในตัวแปล
      acceptJobDto.status = jobstatus;

      const accept_status = await this.JobAcceptStatusRespository.find({ where: { id: acceptJobDto.accept_status } });
      acceptJobDto.accept_status = accept_status;

      //update ข้อมูล
      const update = await this.JobResponsitory.update(id, acceptJobDto);
      //เรียกข้อมูล
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
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

  //-------------------------------------------------------------------------------------------------------------------- ปิดงาน
  async done(id: number, doneJobDto: DoneJobDto) {
    /* try {
      //กำหนดวันที่รับงาน
      doneJobDto.done_date = new Date;
      //เปลี่ยน สถานะงาน
      doneJobDto.status = 3;
      //update ข้อมูล
      const update = await this.JobResponsitory.update(id, doneJobDto);

      //เรียกข้อมูล
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
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
    } */
  }

  //----------------------------------------------------------------------------------------------------------------- ยกเลิกงาน
  async cancel(id, cancelJobDto) {
    /*  try {
       cancelJobDto.cancel_date = new Date;
       cancelJobDto.status = 4;
       const job = await this.JobResponsitory.findOne({ where: { id: id } });
       if (job) {
         switch (job.status) {
           case 2:
             throw new Error("Job ID already accept");
 
           case 3:
             throw new Error("Job ID already done");
 
           case 4:
             throw new Error("Job ID already cancel");
 
           default:
             if (job.status)
               await this.JobResponsitory.update(id, cancelJobDto);
             const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
             return { 'message': 'success', 'data': res }
         }
 
       } else {
         throw new Error("Job ID not found in the database");
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
     } */

  }

  async verify(id, verifyJobDto: VerifyJobDto) {
    console.log(id, verifyJobDto);
  }
}


