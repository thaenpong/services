import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Asset } from 'src/assets/entities/asset.entity';
<<<<<<< Updated upstream

@Module({
  //import entity
  imports: [TypeOrmModule.forFeature([Job, Asset])],

=======
import { JobStatus } from 'src/status/entities/jobs_status.entity';
import { JobAcceptStatus } from 'src/status/entities/job_accept_status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entity';
import { JobAcceptable } from 'src/status/entities/job_acceptable.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entity';


@Module({
  //import entity
  imports: [TypeOrmModule.forFeature([Job, Asset, JobStatus, JobAcceptStatus, JobDoneStatus, JobAcceptable, AssetStatus])],
>>>>>>> Stashed changes
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule { }
