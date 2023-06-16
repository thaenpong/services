import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Asset } from 'src/assets/entities/asset.entity';
import { JobStatus } from 'src/status/entities/job-status.entity';
import { JobAcceptStatus } from 'src/status/entities/job-accept-status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entiy';
import { JobVerifyStatus } from "src/status/entities/Job-verify-status.entity";
import { AssetStatus } from 'src/status/entities/asset-status.entyty';


@Module({
  //import entity
  imports: [TypeOrmModule.forFeature([Job, Asset, JobStatus, JobAcceptStatus, JobDoneStatus, JobVerifyStatus, AssetStatus])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule { }
