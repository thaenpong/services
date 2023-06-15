import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { JobStatus } from './entities/jobs_status.entity';
import { JobAcceptStatus } from './entities/job_accept_status.entity';
import { JobDoneStatus } from './entities/job-done-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([JobStatus, JobAcceptStatus, JobDoneStatus])],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule { }
