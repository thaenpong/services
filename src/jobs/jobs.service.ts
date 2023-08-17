import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { In, Not, Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';
import { JobStatus } from 'src/status/entities/job-status.entity';
import { JobAcceptStatus } from 'src/status/entities/job-accept-status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entiy';
import { JobVerifyStatus } from "src/status/entities/Job-verify-status.entity";
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import axios from 'axios';
import { EmployeeService } from 'src/employee/employee.service';
import { count } from 'console';

@Injectable()
export class JobsService {
  client: any;
  private readonly urlLineNotification = 'https://notify-api.line.me/api/notify';
  private readonly lineNotifyToken = process.env.LINE_NOTIFY;
  constructor(
    //import Entity Job
    @InjectRepository(Job)
    private JobResponsitory: Repository<Job>,

    //import Entity Jobstatus
    @InjectRepository(JobStatus)
    private JobStatusRespository: Repository<JobStatus>,

    //import Entity Jobstatus
    @InjectRepository(JobDoneStatus)
    private JobdonestatusRespository: Repository<JobDoneStatus>,

    //import Entity Job
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

    @InjectRepository(JobAcceptStatus)
    private JobAcceptStatusRespository: Repository<JobAcceptStatus>,

    @InjectRepository(JobVerifyStatus)
    private JobAcceptAbleRespository: Repository<JobVerifyStatus>,

    @InjectRepository(AssetStatus)
    private AssetStatusRespository: Repository<AssetStatus>,

    private EmpRepo: EmployeeService,

  ) {
  }

  async sendNotification(id: number, detail: string, user_employee_id: number, code: string) {
    try {
      const empName = await this.EmpRepo.findEmpId(String(user_employee_id));
      const text = `งานซ่อมใหม่ \n รายระเอียด : ${detail} \n รหัส : ${code}  \n แจ้งโดย : ${empName.firstName}  ${empName.lastName} \n Link : https://sil.hubnova.app/it/job/detail/${id}`;
      const response = await axios.post(
        this.urlLineNotification,
        `message=${encodeURIComponent(text)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.lineNotifyToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      //console.log(response.data);
    } catch (error) {
      //console.error(error);
    }
  }

  //อัพเดทสถานะของเครื่อง
  private async assetstatus(status_id, asset_id: any) {
    const status = await this.AssetStatusRespository.findOne({ where: { id: status_id } });
    await this.AssetsRespository.update(asset_id, { status: status });
  }

  private joinselect() {
    return ['asset', 'asset.status', 'asset.category', 'status', 'accept_status', 'done_status', 'verify_acceptable']
  }



  //----------------------------------------------------------------------------------------------------------------- บันทึกข้อมูล
  async create(createJobDto) {
    try {
      //เช็ค id ทรัพย์สิน
      const asset = await this.AssetsRespository.findOne({ where: { id: createJobDto.asset_id, status: Not(3) } });
      // ไม่มี
      if (!asset) { throw new Error("Asset ID not found in the database"); }

      //ลบ asset_id ที่รับมาจาก body
      delete createJobDto.asset_id;
      //บันทึก asset จากที่เช็ค
      createJobDto.asset = asset;

      // update สถานะทรัพย์สิน
      const update = await this.assetstatus(+2, createJobDto.asset.id)
      // ดึงข้อมูล สถานะ
      const jobstatus = await this.JobStatusRespository.findOne({ where: { id: 1 } });
      //เก็บในตัวแปล
      createJobDto.status = jobstatus;

      //insert ข้อมูล
      const insert = await this.JobResponsitory.save(createJobDto);
      //เรียกข้อมูล
      const res = await this.JobResponsitory.findOne({ where: { id: insert.id }, relations: this.joinselect() });
      return { 'message': 'success', 'data': res };

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
      const res = await this.JobResponsitory.find({ where: { status: { id: status } }, relations: this.joinselect() })
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
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() })
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
  async accept(id, acceptJobDto) {

    try {
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
          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() });
          return { 'message': 'success', 'data': res }
        } else {
          throw new Error("Job ID not in a pending state");
        }
      } else {
        throw new Error("Job ID not found in database");
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
  async done(id: number, doneJobDto: any) {
    try {
      //เช็ค สถานะงาน
      const job = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() });

      if (job != null) {
        if (job.status.id === 2) {
          if (job.accept_staff_employee_id == doneJobDto.staff_employee_id) {

            delete doneJobDto.staff_employee_id;
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

            // update สถานะทรัพย์สิน
            await this.assetstatus(+1, job.asset.id)

            //update ข้อมูล
            const update = await this.JobResponsitory.update(id, doneJobDto);
            //เรียกข้อมูล
            const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() });
            return { 'message': 'success', 'data': res }

          } else {
            throw new Error("Staff ID does not match");
          }
        } else {
          throw new Error("Job ID not in a working state");
        }
      } else {
        throw new Error("Job ID not found in database");
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
          const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() });
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
  }

  async GetEmp(emp_code: string) {
    try {
      const res = await this.JobResponsitory.find({ where: { user_employee_id: Number(emp_code) }, relations: this.joinselect() });
      return res;
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
    //กำหนดตัวแปร
    let verify = {
      'status': null,
      'verify_acceptable': null,
      'verify_date': new Date,
    }
    try {
      // ดึงตัวสถานะ verify
      const verify_status = await this.JobAcceptAbleRespository.findOne({ where: { value: verifyJobDto.is_acceptable } });
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
            const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: this.joinselect() });
            return { 'message': 'success', 'data': res }
          }
        } else {
          throw new Error("Job ID not awaiting verification");
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


  async GetCountMonth() {
    try {

      const allJob = await this.JobResponsitory.count({
        where: {
          status: {
            id: Not(6)
          }
        }
      })

      const newJob = await this.JobResponsitory.count({
        where: {
          status: {
            id: 1
          }
        }
      })

      const acceptedJob = await this.JobResponsitory.count({
        where: {
          status: {
            id: In([2, 3])
          },

        }
      })



      const currentYear = new Date().getFullYear();
      const monthlyData = await this.JobResponsitory.createQueryBuilder('job')
        .select([
          'SUM(CASE WHEN MONTH(job.datecreate) = 1 THEN 1 ELSE 0 END) AS JAN',
          'SUM(CASE WHEN MONTH(job.datecreate) = 2 THEN 1 ELSE 0 END) AS FEB',
          'SUM(CASE WHEN MONTH(job.datecreate) = 3 THEN 1 ELSE 0 END) AS MAR',
          'SUM(CASE WHEN MONTH(job.datecreate) = 4 THEN 1 ELSE 0 END) AS APR',
          'SUM(CASE WHEN MONTH(job.datecreate) = 5 THEN 1 ELSE 0 END) AS MAY',
          'SUM(CASE WHEN MONTH(job.datecreate) = 6 THEN 1 ELSE 0 END) AS JUN',
          'SUM(CASE WHEN MONTH(job.datecreate) = 7 THEN 1 ELSE 0 END) AS JUL',
          'SUM(CASE WHEN MONTH(job.datecreate) = 8 THEN 1 ELSE 0 END) AS AUG',
          'SUM(CASE WHEN MONTH(job.datecreate) = 9 THEN 1 ELSE 0 END) AS SEP',
          'SUM(CASE WHEN MONTH(job.datecreate) = 10 THEN 1 ELSE 0 END) AS OCT',
          'SUM(CASE WHEN MONTH(job.datecreate) = 11 THEN 1 ELSE 0 END) AS NOV',
          'SUM(CASE WHEN MONTH(job.datecreate) = 12 THEN 1 ELSE 0 END) AS DECEM',
        ]).where(`YEAR(job.datecreate) = :currentYear AND job.statusId != 6`, { currentYear })
        .getRawOne();

      const res = {
        chart: monthlyData,
        newJob: newJob,
        acceptedJob: acceptedJob,
        allJob: allJob,
      }

      return res;
    } catch (error) {
      // Handle the error
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



