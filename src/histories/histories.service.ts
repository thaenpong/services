import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uselogs } from 'src/assets/entities/use-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriesService {
    constructor(
        @InjectRepository(Uselogs)
        private UseLogsRespository: Repository<Uselogs>,
    ) { }

    async getlogaset(id: number) {
        try {
            //---------------------------- ค้นหา
            const res = await this.UseLogsRespository.find({ where: { asset: { id: id } }, order: { id: 'DESC' } });
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

    async getlogemp(id: number) {
        try {
            //---------------------------- ค้นหา
            const res = await this.UseLogsRespository.find({ where: { user_employee_id: id }, order: { id: 'DESC' } });
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
}
