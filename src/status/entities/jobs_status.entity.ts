import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "src/jobs/entities/job.entity";

@Entity()
export class JobStatus {
    //สถานะงาน

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Job, job => job.status)
    job: Job[];
}