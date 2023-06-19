import { Job } from "src/jobs/entities/job.entity";
import { Removed } from "src/removed/entities/removed.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RemoveStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Job, job => job.status)
    job: Job[];

    @OneToMany(() => Removed, remove => remove.status)
    remove: Removed[];
}
