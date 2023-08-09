import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal, IsNull } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { Category } from 'src/categories/entities/category.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import { Uselogs } from './entities/use-logs.entity';
import { SwitchAssetDto } from './dto/switch-asset.dto';
import { stringify } from 'querystring';


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

  async closelog(id_asset: number, staff_employee_id: number, user_employee_id: number, detail: string) {
    console.log(detail)
    //ค้นหา Asset ใน table logs
    const uselogs = await this.UseLogsRespository.findOne({ relations: ['asset'], where: { asset: { id: id_asset }, todate: IsNull() }, order: { id: 'desc' } });

    //----------------มีข้อมูล
    if (uselogs) {
      //------------------ employee id ไม่เหมือนกัน
      if (uselogs.user_employee_id != user_employee_id) {
        //ปิด log
        const cdata = {
          todate: new Date,
          to_staff_employee_id: staff_employee_id,
          detail: detail
        }
        //------------- บันทึก
        await this.UseLogsRespository.update(uselogs.id, cdata);

        if (user_employee_id != null) {
          //สร้าง log row ใหม่
          const odata = {
            asset: { id: id_asset },
            from_staff_employee_id: staff_employee_id,
            user_employee_id: user_employee_id
          }
          await this.UseLogsRespository.save(odata);
        }
      }
    } else {
      if (user_employee_id != null) {
        //สร้าง log row ใหม่
        const data = {
          asset: { id: id_asset },
          from_staff_employee_id: staff_employee_id,
          user_employee_id: user_employee_id,
        }

        await this.UseLogsRespository.save(data);
      }
    }
  }


  //-------------------------------------------------------------------------------บันทึกข้อมูล
  async create(createAssetDto: any) {

    try {
      //เปลี่ยนให้เป็นตัวใหญ่
      createAssetDto.code = createAssetDto.code.toUpperCase();
      //ดึงข้อมูล category
      const category = await this.CategoriesRespository.findOne({ where: { id: createAssetDto.categories_id } })
      if (!category) {
        throw new Error("Category ID not found in the database")
      }


      //บันทึกลงตัวแปล
      createAssetDto.status = { id: 1 };


      //ลบ categories_id
      const categories_id = createAssetDto.categories_id;
      delete createAssetDto.categories_id;
      // บันทึกข้อมูล
      createAssetDto.category = { id: categories_id };

      console.log(createAssetDto);
      // insert
      const insert = await this.AssetsRespository.save(createAssetDto);

      //บันทึกใบประวัติ
      const data = {
        asset: insert,
        from_staff_employee_id: insert.staff_employee_id,
      }


      //ดึงข้อมูล
      const res = await this.AssetsRespository.findOne({ where: { id: insert.id }, relations: relations })

      //---------------บันทึก log
      await this.closelog(res.id, res.staff_employee_id, res.user_employee_id, null);

      //return
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

        //ค้นหา Asset ใน table logs
        const uselogs = await this.UseLogsRespository.findOne({ relations: ['asset'], where: { asset: { id: res.id }, todate: null }, order: { id: 'desc' } });

        //----------------มีข้อมูล
        if (uselogs) {
          //------------------ employee id ไม่เหมือนกัน
          if (asset.user_employee_id != updateAssetDto.user_employee_id) {
            //ปิด log
            const cdata = {
              todate: new Date,
              to_staff_employee_id: to_staff_employee_id,
            }
            //------------- บันทึก
            await this.UseLogsRespository.update(uselogs.id, cdata);

            //สร้าง log row ใหม่
            const odata = {
              asset: res,
              from_staff_employee_id: from_staff_employee_id,
              user_employee_id: user_employee_id
            }
            await this.UseLogsRespository.save(odata);
          }
        } else {
          //สร้าง log row ใหม่
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

  //----------------------------------------------------------------- ค้นหาตาม category
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

  //------------------------------------------------------------------------ หาตาม สถานะ
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

  //---------------------------------------------------------- ค้นหา logs
  /*  async getlogs(id: number) {
     try {
       //---------------------------- ค้นหา
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
   } */

  //---------------------------------------------------------- ค้นหาตามรหัสผู้ใช้
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

  //--------------------------------------------------------------------------------------------------------------------------------- เปลี่ยน ทรัพย์สิน
  async switch(switchassetdto: SwitchAssetDto) {
    try {
      //-------------------------------- ดึงข้อมูล
      const from_asset = await this.AssetsRespository.findOne({ where: { id: switchassetdto.from_id, status: Not(3) } });
      const to_asset = await this.AssetsRespository.findOne({ where: { id: switchassetdto.to_id, status: Not(3) } });
      //-------------------------------  เช็คข้อมูล
      if (!from_asset) {
        throw new Error("The 'from_asset' ID was not found in the database.");
      }
      if (!to_asset) {
        throw new Error("The 'to_asset' ID was not found in the database.");
      }

      //--------------------------------- บันทึก to_asset ไปที่  from_asset
      await this.AssetsRespository.update(from_asset.id, { user_employee_id: to_asset.user_employee_id, note: to_asset.note });
      //--------------------------------- บันทึก from_asset ไปที่  to_asset
      await this.AssetsRespository.update(to_asset.id, { user_employee_id: from_asset.user_employee_id, note: from_asset.note });

      //--------------------------------- โหลดข้อมูล to_asset ที่อัพเดทแล้ว
      const res = await this.AssetsRespository.findOne({ where: { id: to_asset.id }, relations: relations });

      const test = await this.closelog(from_asset.id, switchassetdto.staff_employee_id, to_asset.user_employee_id, `เปลี่ยนกับ ${to_asset.code}  สาเหตุ  ${from_asset.code} ${switchassetdto.detail}`);
      await this.closelog(to_asset.id, switchassetdto.staff_employee_id, from_asset.user_employee_id, `${from_asset.code} ${switchassetdto.detail}`);
      //--------------------------------- return
      return { 'message': 'success', 'data': res };
    } catch (error) {
      //---------------------- return error massage
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

  //------------------------------ บันทึก log เริ่มต้น
  /*  async makelog() {
     const assets = await this.AssetsRespository.find({ where: { status: { id: 1 } } });
     if (assets) {
 
       let items = []
       for (const asset of assets) {
         await this.closelog(asset.id, asset.staff_employee_id, asset.user_employee_id,null);
         items.push(asset.id);
       };
       return items;
     }
 
 
 
   } */


  //----------------------------------------------------- Gen Code ล่าสุด
  async getLatestAsset(id: number) {
    function modifyCode(inputCode: string): string {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const [prefix, middle, lastPart] = inputCode.split('.');

      const yaer = (currentYear + 543).toString().slice(-2);

      let newLastPart = parseInt(lastPart);
      if (yaer === (middle).toString()) {
        newLastPart = newLastPart + 1;
      } else {
        newLastPart = 1;
      }

      return `${prefix}.${yaer}.${newLastPart.toString().padStart(2, '0')}`;
    }

    try {
      const res = await this.AssetsRespository.findOne({ where: { category: { id: id } }, order: { id: 'desc' } });
      return (modifyCode(res.code));

    } catch (error) {
      //---------------------- return error massage
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

