import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { Asset } from 'src/assets/entities/asset.entity';
import { JobStatus } from './entities/job-status.entity';
import { JobAcceptStatus } from './entities/job-accept-status.entity';
import { JobDoneStatus } from './entities/job-done-status.entiy';
import { JobVerifyStatus } from './entities/Job-verify-status.entity';
import { AssetStatus } from './entities/asset-status.entyty';
import { RemoveStatus } from './entities/remove-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemoveStatus, Job, Asset, JobStatus, JobAcceptStatus, JobDoneStatus, JobVerifyStatus, AssetStatus])],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule { }
