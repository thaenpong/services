import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcceptJobDto } from './dto/accept-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';
import { DoneJobDto } from './dto/done-job.dto';

@Injectable()
export class JobsService {
  constructor(
    //import Entity Job
    @InjectRepository(Job)
    private JobResponsitory: Repository<Job>,

    //import Entity Job
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

  ) { }

  //----------------------------------------------------------------------------------------------------------------- บันทึกข้อมูล
  async create(createJobDto) {
    try {
      //เช็ค id ทรัพย์สิน
      const asset = await this.AssetsRespository.findOne({ where: { id: createJobDto.asset_id } });

      // ไม่มี
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
      const res = await this.JobResponsitory.find({ where: { status: status }, relations: ['asset'] })
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
      const res = await this.JobResponsitory.findOne({ where: { id: id }, relations: ['asset'] })

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
      //กำหนดวันที่รับงาน
      acceptJobDto.accept_date = new Date;
      //เปลี่ยน สถานะงาน
      acceptJobDto.status = 2;
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
    try {
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
    }
  }

}
