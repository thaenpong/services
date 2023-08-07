import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRemovedDto } from './dto/create-removed.dto';
import { UpdateRemovedDto } from './dto/update-removed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Removed } from './entities/removed.entity';
import { Not, Repository } from 'typeorm';
import { Asset } from 'src/assets/entities/asset.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import { RemoveStatus } from 'src/status/entities/remove-status.entity';
import { Uselogs } from 'src/assets/entities/use-logs.entity';



@Injectable()
export class RemovedService {

  constructor(
    @InjectRepository(Removed)
    private RemovedRespository: Repository<Removed>,

    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

    @InjectRepository(AssetStatus)
    private AssetStatusRespository: Repository<AssetStatus>,

    @InjectRepository(RemoveStatus)
    private RemoveStatusRepository: Repository<RemoveStatus>,

    @InjectRepository(Uselogs)
    private UseLogsRespository: Repository<Uselogs>,

  ) {

  }

  private relations() {
    return ['asset', 'status']
  }


  //อัพเดทสถานะของทรัพย์สิน
  private async assetstatus(status_id: number, asset_id: number, res: any) {
    const status = await this.AssetStatusRespository.findOne({ where: { id: status_id } });

    await this.AssetsRespository.update(asset_id, { status: status, user_employee_id: null, description: "ถอดถอนแล้ว", removed: res });
  }

  //------------------------------------------------------------------------------------------------------- insert
  async create(createRemovedDto: any) {
    try {
      // เช็คทรัพย์สิน
      const asset = await this.AssetsRespository.findOne({ where: { id: createRemovedDto.asset_id } });
      await this.AssetsRespository.update(createRemovedDto.asset_id, { status: { id: 4 } });
      //ถ้าไม่มี return error
      if (!asset) { throw new Error("Asset ID not found in the database"); }

      // เปลี่ยน asset_id เป็น asset
      delete createRemovedDto.asset_id;
      createRemovedDto.asset = asset;



      // บันทึกข้อมูลสถานะ
      createRemovedDto.status = await this.RemoveStatusRepository.findOne({ where: { id: 1 } })

      //บันทึกข้อมูล
      const insert = await this.RemovedRespository.save(createRemovedDto);



      //ดึงข้อมูล 
      const res = await this.RemovedRespository.findOne({ where: { id: insert.id }, relations: this.relations() })
      return { 'message': 'success', 'data': res };

    } catch (error) {
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

  //------------------------------------------------------------------------------ค้นหาทั้งหมด
  async findAll() {
    try {
      //ดึงข้อมูล 
      const res = await this.RemovedRespository.find({ where: { approved_id: Not(null) } });
      return { 'message': 'success', 'data': res };
    } catch (error) {
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

  async status(id: number) {
    try {
      const status = await this.RemoveStatusRepository.findOne({ where: { id: id } });

      //ดึงข้อมูล 
      const res = await this.RemovedRespository.find({ where: { status: status }, relations: this.relations() });
      return { 'message': 'success', 'data': res };
    } catch (error) {
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

  //-------------------------------------------------------------------------------------------รายระเอียด
  async findOne(id: number) {
    try {
      //ดึงข้อมูล 
      const res = await this.RemovedRespository.findOne({ where: { id: id }, relations: this.relations() })
      return { 'message': 'success', 'data': res };

    } catch (error) {
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

  async approve(id: number, updateRemovedDto: any) {
    try {

      // เช็ค id 
      const removed = await this.RemovedRespository.findOne({ where: { id: id, approved_id: null }, relations: this.relations() });
      if (!removed) { throw new Error("ID not found in the database"); }

      //บันทึกข้อมูลสถานะ
      updateRemovedDto.status = await this.RemoveStatusRepository.findOne({ where: { id: 2 } })
      //console.log(removed.asset.id)

      //update
      await this.RemovedRespository.update(id, updateRemovedDto);
      // ดึงข้อมูล
      const res = await this.RemovedRespository.findOne({ where: { id: id }, relations: this.relations() });

      //อัพเดทสถานะทรัพย์สิน
      await this.assetstatus(+3, removed.asset.id, res);

      const uselogs = await this.UseLogsRespository.findOne({ relations: ['asset'], where: { asset: { id: removed.asset.id } }, order: { id: 'desc' } });
      await this.UseLogsRespository.update(uselogs.id, { todate: new Date, to_staff_employee_id: res.staff_employee_id });
      return { 'message': 'success', 'data': res };

    } catch (error) {
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

  //-------------------------------------------------------------------- ยกเลิก
  async remove(id: number) {
    try {
      //ดึงข้อมูล
      const removed = await this.RemovedRespository.findOne({ where: { id: id }, relations: this.relations() });

      if (!removed) {//เช็ค id
        throw new Error("ID not found in the database.");

      } else if (removed.status.id === 2) {//เช็คว่ารอถอดถอนอยู่
        throw new Error("This ID has already been approved.");
      } else {
        //ลบข้อมูล 
        await this.RemovedRespository.delete({ id: id })
        return { 'message': 'success' };
      }
    } catch (error) {
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
