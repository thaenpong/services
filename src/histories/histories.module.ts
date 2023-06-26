import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uselogs } from 'src/assets/entities/use-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Uselogs])],
  controllers: [HistoriesController],
  providers: [HistoriesService]
})
export class HistoriesModule { }
