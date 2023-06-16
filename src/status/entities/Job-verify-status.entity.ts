import { Job } from "src/jobs/entities/job.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class JobVerifyStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ comment: "ระดับความพอใจ", type: "tinyint" })
    value: number;

    @OneToMany(() => Job, job => job.done_status)
    job: Job[];
}
