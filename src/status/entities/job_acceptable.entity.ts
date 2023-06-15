import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "src/jobs/entities/job.entity";

@Entity()
export class JobAcceptable {
    //ความพอใจ

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Job, job => job.verify_acceptable)
    job: Job[];
}