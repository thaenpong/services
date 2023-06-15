import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "src/jobs/entities/job.entity";

@Entity()
export class JobDoneStatus {
    //สถานะงาน

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Job, job => job.done_status)
    job: Job[];
}