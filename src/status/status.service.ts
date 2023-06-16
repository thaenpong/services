import { Injectable } from '@nestjs/common';
import { JobAcceptStatus } from 'src/status/entities/job-accept-status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entiy';
import { JobVerifyStatus } from "src/status/entities/Job-verify-status.entity";
import { JobStatus } from './entities/job-status.entity';
import { AssetStatus } from 'src/status/entities/asset-status.entyty';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(JobAcceptStatus)
        private JobAcceptStatusRespository: Repository<JobAcceptStatus>,


        @InjectRepository(JobDoneStatus)
        private JobdonestatusRespository: Repository<JobDoneStatus>,

        //import Entity Jobstatus
        @InjectRepository(JobStatus)
        private JobstatusRespository: Repository<JobStatus>,

        @InjectRepository(AssetStatus)
        private AssetStatusRespository: Repository<AssetStatus>,

        @InjectRepository(JobVerifyStatus)
        private JobAcceptAbleRespository: Repository<JobVerifyStatus>,

    ) { }

    async job_status() {
        return await this.JobstatusRespository.find();
    }
    async job_accept() {
        return await this.JobAcceptStatusRespository.find();
    }

    async job_done() {
        return await this.JobdonestatusRespository.find();
    }

    async job_acceptable() {
        return await this.JobAcceptAbleRespository.find();
    }

    async asset() {
        return await this.AssetStatusRespository.find();
    }
}
