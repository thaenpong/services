import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Asset } from 'src/assets/entities/asset.entity';

@Module({
  //import entity
  imports: [TypeOrmModule.forFeature([Job, Asset])],

  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule { }
