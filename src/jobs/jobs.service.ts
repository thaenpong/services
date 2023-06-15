import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';
<<<<<<< Updated upstream
import { DoneJobDto } from './dto/done-job.dto';
import { verify } from 'crypto';
import { VerifyJobDto } from './dto/verify-job.dto';
=======
import { JobStatus } from 'src/status/entities/jobs_status.entity';

import { JobAcceptStatus } from 'src/status/entities/job_accept_status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entity';

import { JobAcceptable } from 'src/status/entities/job_acceptable.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entity';
>>>>>>> Stashed changes

@Injectable()
export class JobsService {
  constructor(
    //import Entity Job
    @InjectRepository(Job)
    private JobResponsitory: Repository<Job>,

<<<<<<< Updated upstream
=======
    //import Entity Jobstatus
    @InjectRepository(JobStatus)
    private JobStatusRespository: Repository<JobStatus>,

    //import Entity Jobstatus
    @InjectRepository(JobDoneStatus)
    private JobdonestatusRespository: Repository<JobDoneStatus>,

>>>>>>> Stashed changes
    //import Entity Job
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

<<<<<<< Updated upstream
=======
    @InjectRepository(JobAcceptStatus)
    private JobAcceptStatusRespository: Repository<JobAcceptStatus>,

    @InjectRepository(JobAcceptable)
    private JobAcceptAbleRespository: Repository<JobAcceptable>,

    @InjectRepository(AssetStatus)
    private AssetStatussRespository: Repository<AssetStatus>,
>>>>>>> Stashed changes
  ) { }

  //อัพเดทสถานะของเครื่อง
  private async assetstatus(status_id, asset_id: any) {
    const status = await this.AssetStatussRespository.findOne({ where: { id: status_id } });
    return status;
  }

  //----------------------------------------------------------------------------------------------------------------- บันทึกข้อมูล
  async create(createJobDto) {
    try {
      //เช็ค id ทรัพย์สิน
      const asset = await this.AssetsRespository.findOne({ where: { id: createJobDto.asset_id } });
      // ไม่มี
<<<<<<< Updated upstream
      if (!asset) {
        throw new Error("Asset ID not found in the database")
      } else {
        const status = await this.AssetsRespository.update(asset.id, { status: 2 });
        if (status) {//ลบ asset_id ที่รับมาจาก body
          delete createJobDto.asset_id;
          //บันทึก asset จากที่เช็ค
          createJobDto.asset = asset;
          //insert ข้อมูล
          const insert = await this.JobResponsitory.save(createJobDto);
          //เรียข้อมูล
          const res = await this.JobResponsitory.findOne({ where: { id: insert.id }, relations: ['asset'] })
          return { 'message': 'success', 'data': res }
        }
=======
      if (!asset) { throw new Error("Asset ID not found in the database"); }

      //ลบ asset_id ที่รับมาจาก body
      delete createJobDto.asset_id;
      //บันทึก asset จากที่เช็ค
      createJobDto.asset = asset;

      const update = await this.assetstatus(+2, createJobDto.asset.id)

      // ดึงข้อมูล สถานะ
      const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 1 } });
      //เก็บในตัวแปล
      createJobDto.status = jobstatus;

      //insert ข้อมูล
      const insert = await this.JobResponsitory.save(createJobDto);
      //เรียกข้อมูล
      const res = await this.JobResponsitory.findOne({ where: { id: insert.id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] });
      return { 'message': 'success', 'data': res };
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      const res = await this.JobResponsitory.find({ where: { status: status }, relations: ['asset'] })
=======
      const res = await this.JobResponsitory.find({ where: { status: { id: status } }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] })
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] })

=======
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] })
>>>>>>> Stashed changes
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
  async accept(id: number, acceptJobDto: AcceptJobDto) {

    try {
<<<<<<< Updated upstream
      const job = await this.JobResponsitory.findOne({ where: { id: id } });
      if (!job) { throw new Error("Job ID not found in the database"); }
      if (job.status === 1) {
        //กำหนดวันที่รับงาน
        acceptJobDto.accept_date = new Date;
        //เปลี่ยน สถานะงาน
        acceptJobDto.status = 2;
        //update ข้อมูล
        const update = await this.JobResponsitory.update(id, acceptJobDto);
        //เรียกข้อมูล
        const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
        return { 'message': 'success', 'data': res }
      } else {
        throw new Error("Job ID not in a pending state");
=======
      //เช็ค สถานะงาน
      const job = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['status'] });
      if (job != null) {
        if (job.status.id === 1) {
          //กำหนดวันที่รับงาน
          acceptJobDto.accept_date = new Date;
          //เปลี่ยน สถานะงาน
          // ดึงข้อมูล สถานะ
          const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 2 } });
          //เก็บในตัวแปล
          acceptJobDto.status = jobstatus;

          //ดึงข้อมูลสถานะรับงาน
          const accept_status = await this.JobAcceptStatusRespository.findOne({ where: { id: acceptJobDto.accept_status } });
          if (!accept_status) { throw new Error("accept_status not found in database"); }

          //เก็บในตัวแปล
          acceptJobDto.accept_status = accept_status;

          //update ข้อมูล
          await this.JobResponsitory.update(id, acceptJobDto);
          //เรียกข้อมูล
          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] });
          return { 'message': 'success', 'data': res }
        } else {
          throw new Error("Job ID not in a pending state");
        }
      } else {
        throw new Error("Job ID not found in database");
>>>>>>> Stashed changes
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

  //-------------------------------------------------------------------------------------------------------------------- ปิดงาน
<<<<<<< Updated upstream
  async done(id: number, doneJobDto: DoneJobDto) {
    try {
      const job = await this.JobResponsitory.findOne({ where: { id: id } });
      if (!job) { throw new Error("Job ID not found in the database"); }
      if (job.status === 2) {
        //กำหนดวันที่รับงาน
        doneJobDto.done_date = new Date;
        //เปลี่ยน สถานะงาน
        doneJobDto.status = 3;
        //update ข้อมูล
        const update = await this.JobResponsitory.update(id, doneJobDto);

        //เรียกข้อมูล
        const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
        return { 'message': 'success', 'data': res }
      } else {
        throw new Error("Job ID not accepted");
=======
  async done(id: number, doneJobDto) {
    try {
      //เช็ค สถานะงาน
      const job = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['status'] });
      if (job != null) {
        if (job.status.id === 2) {
          //กำหนดวันที่รับงาน
          doneJobDto.done_date = new Date;
          //เปลี่ยน สถานะงาน
          // ดึงข้อมูล สถานะ
          const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 4 } });
          //เก็บในตัวแปล
          doneJobDto.status = jobstatus;

          //ดึงข้อมูลสถานะรับงาน
          const done_status = await this.JobdonestatusRespository.findOne({ where: { id: doneJobDto.done_status } });
          if (!done_status) { throw new Error("accept_status not found in database"); }
          //เก็บในตัวแปล
          doneJobDto.done_status = done_status;
          //update ข้อมูล
          const update = await this.JobResponsitory.update(id, doneJobDto);
          //เรียกข้อมูล
          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] });
          return { 'message': 'success', 'data': res }
        } else {
          throw new Error("Job ID not in a working state");
        }
      } else {
        throw new Error("Job ID not found in database");
>>>>>>> Stashed changes
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

  //----------------------------------------------------------------------------------------------------------------- ยกเลิกงาน
  async cancel(id, cancelJobDto) {
    try {
      cancelJobDto.cancel_date = new Date;
<<<<<<< Updated upstream
      cancelJobDto.status = 4;
      const job = await this.JobResponsitory.findOne({ where: { id: id } });
      if (job) {
        switch (job.status) {
          case 2:
            throw new Error("Job ID already accepted");
=======
      // ดึงข้อมูล สถานะ
      const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 6 } });
      //เก็บในตัวแปล
      cancelJobDto.status = jobstatus;

      //ดึงข้อมูลงาน
      const job = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['status'] });
      //มีข้อมูล
      if (job) {
        //สถานะงานตรง
        if (job.status.id === 1) {
          // update
          await this.JobResponsitory.update(id, cancelJobDto);
          //select
          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] });
          //return
          return { 'message': 'success', 'data': res }
        } else {
          throw new Error("Job ID not in a pending state");
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
    }
>>>>>>> Stashed changes

          case 3:
            throw new Error("Job ID completed");

          case 4:
            throw new Error("Job ID already verified");

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
    }
  }

  async verify(id, verifyJobDto) {
<<<<<<< Updated upstream

    try {
      const job = await this.JobResponsitory.findOne({ where: { id: id, user_employee_id: verifyJobDto.user_employee_id } })
      if (!job) {
        throw new Error("Job ID not found in the database");
      } else {
        if (job.status === 3) {

          const verify = {
            'verify_user_employee_id': verifyJobDto.employee_code,
            'verify_is_acceptable': verifyJobDto.is_acceptable,
            'verify_date': new Date,
            'status': 4,
          }

          await this.JobResponsitory.update(id, verify);

          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] });
          return { 'message': 'success', 'data': res }
        } else {
          throw new Error("Incomplete job status");
        }
=======
    //กำหนดตัวแปร
    let verify = {
      'status': null,
      'verify_acceptable': null,
      'verify_date': new Date,
    }
    try {
      // ดึงตัวสถานะ verify
      const verify_status = await this.JobAcceptAbleRespository.findOne({ where: { id: verifyJobDto.is_acceptable } });
      //เก็บในตัวแปล
      if (verify_status) {
        verify.verify_acceptable = verify_status;
      } else {
        throw new Error("is_acceptable not found in the database");
      }

      // ดึงตัวสถานะ
      const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 5 } });
      if (verify_status) {
        //เก็บในตัวแปล
        verify.status = jobstatus;
      } else {
        throw new Error("is_acceptable not found in the database");
      }

      // ดึงข้อมูลงานซ่อม
      const job = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['status'] });
      //มีข้อมูลงาน
      if (job) {
        //ข้อมูลงานตรง
        if (job.status.id === 4) {
          // user id ไม่ตรงกับ ที่เปิด
          if (job.user_employee_id != verifyJobDto.user_employee_id) {
            throw new Error("user ID does not match");
          } else {
            //update
            await this.JobResponsitory.update(id, verify);
            //return
            const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset', 'status', 'accept_status', 'done_status', 'verify_acceptable'] });
            return { 'message': 'success', 'data': res }
          }
        } else {
          throw new Error("Job ID not awaiting verification");
        }
      } else {
        throw new Error("Job ID not found in the database");
>>>>>>> Stashed changes
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

