import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { Category } from 'src/categories/entities/category.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import { Uselogs } from './entities/use-logs.entity';


const relations = ['category', 'status', 'removed'];

@Injectable()
export class AssetsService {
  //import entity
  constructor(
    @InjectRepository(Asset)
    private AssetsRespository: Repository<Asset>,

    @InjectRepository(Category)
    private CategoriesRespository: Repository<Category>,

    @InjectRepository(AssetStatus)
    private AssetStatussRespository: Repository<AssetStatus>,

    @InjectRepository(Uselogs)
    private UseLogsRespository: Repository<Uselogs>,
  ) { }

  //-------------------------------------------------------------------------------บันทึกข้อมูล
  async create(createAssetDto) {
    try {
      //เปลี่ยนให้เป็นตัวใหญ่
      createAssetDto.code = createAssetDto.code.toUpperCase();
      //ดึงข้อมูล category
      const category = await this.CategoriesRespository.findOne({ where: { id: createAssetDto.categories_id } })
      if (!category) {
        throw new Error("Category ID not found in the database")
      }

      // ดึงข้อมูลสถานะ
      const status = await this.AssetStatussRespository.findOne({ where: { id: 1 } })
      //บันทึกลงตัวแปล
      createAssetDto.status = status;


      //ลบ categories_id
      delete createAssetDto.categories_id;
      // บันทึกข้อมูล
      createAssetDto.category = category;
      // insert
      const insert = await this.AssetsRespository.save(createAssetDto);

      //บันทึกใบประวัติ
      const data = {
        asset: insert,
        from_staff_employee_id: insert.staff_employee_id,
      }
      await this.UseLogsRespository.save(data);

      //return
      const res = this.AssetsRespository.findOne({ where: { id: insert.id }, relations: relations })
      return { 'message': 'success', 'data': insert };

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
        relations: relations,
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
      const res = await this.AssetsRespository.findOne({ where: { id: id }, relations: relations, });
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
      const user_employee_id = updateAssetDto.user_employee_id;
      const from_staff_employee_id = updateAssetDto.staff_employee_id;
      const to_staff_employee_id = updateAssetDto.staff_employee_id;

      delete updateAssetDto.staff_employee_id;
      //เปลี่ยนให้เป็นตัวใหญ่
      updateAssetDto.code = updateAssetDto.code.toUpperCase();
      const category = await this.CategoriesRespository.findOne({ where: { id: updateAssetDto.categories_id, } })
      if (!category) {
        throw new Error("Category ID not found in the database")
      } else {
        const asset = await this.AssetsRespository.findOne({ where: { id: id, status: Not(3) } });
        if (!asset) {
          throw new Error("Asset ID not found in the database")
        }
        //ลบ categories_id
        delete updateAssetDto.categories_id;
        // บันทึกข้อมูล
        updateAssetDto.category = category;
        // update
        const update = await this.AssetsRespository.update(id, updateAssetDto);

        // เรียกข้อมูล
        const res = await this.AssetsRespository.findOne({ where: { id: id }, relations: relations });
        //
        console.log(asset)
        const uselogs = await this.UseLogsRespository.findOne({ relations: ['asset'], where: { asset: { id: res.id }, todate: null }, order: { id: 'desc' } });

        if (uselogs) {
          if (asset.user_employee_id != updateAssetDto.user_employee_id) {
            //ปิด log
            const cdata = {
              todate: new Date,
              to_staff_employee_id: to_staff_employee_id,
            }
            await this.UseLogsRespository.update(uselogs.id, cdata);

            //บันทึกใบประวัติ
            const odata = {
              asset: res,
              from_staff_employee_id: from_staff_employee_id,
              user_employee_id: user_employee_id
            }
            await this.UseLogsRespository.save(odata);
          }
        } else {
          //บันทึกใบประวัติ
          const data = {
            asset: res,
            from_staff_employee_id: from_staff_employee_id,
            user_employee_id: user_employee_id,
          }
          await this.UseLogsRespository.save(data);
        }

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

  async findcategory(id: any) {
    try {
      const category = await this.CategoriesRespository.findOne({ where: { id: id } });
      if (!category) {
        throw new Error("Category ID not found in the database");
      }
      const res = await this.AssetsRespository.find({ where: { category: category, status: Not(3) }, relations: relations });
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

  async status(id: any) {
    try {
      const status = await this.AssetStatussRespository.findOne({ where: { id: id } });
      if (!status) {
        throw new Error("Status ID not found in the database");
      }
      const res = await this.AssetsRespository.find({ where: { status: status }, relations: relations });
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

  async getlogs(id: number) {
    try {
      const res = await this.UseLogsRespository.find({ where: { asset: { id: id } } });
      return { 'message': 'success', 'data': res };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getempid(user_employee_id: number) {
    try {
      const res = await this.AssetsRespository.find({ where: { user_employee_id: user_employee_id, status: Not(3) } });
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

  async switch(from_id: number, to_id: number) {
    try {
      const from_asset = await this.AssetsRespository.findOne({ where: { id: from_id } });
      const to_asset = await this.AssetsRespository.findOne({ where: { id: to_id } });
      if (!from_asset) {
        throw new Error("The 'from_asset' ID was not found in the database.");
      }

      if (!to_asset) {
        throw new Error("The 'to_asset' ID was not found in the database.");
      }
      await this.AssetsRespository.update(from_asset.id, { user_employee_id: to_asset.user_employee_id, note: to_asset.note });
      await this.AssetsRespository.update(to_asset.id, { user_employee_id: from_asset.user_employee_id, note: from_asset.note });
      return { 'message': 'success' };
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
