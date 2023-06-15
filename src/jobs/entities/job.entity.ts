import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/assets/entities/asset.entity";
import { JobStatus } from "src/status/entities/jobs_status.entity";
import { JobAcceptStatus } from "../../status/entities/job_accept_status.entity";
import { JobDoneStatus } from "src/status/entities/job-done-status.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, comment: "id ผู้ใช้", type: 'bigint' })
    user_employee_id: number

    @ManyToOne(() => Asset, asset => asset.job, { nullable: false, })
    asset: Asset;

    @Column({ nullable: false, comment: "อาการ" })
    user_detail: string

    @CreateDateColumn({ type: 'timestamp', comment: "วันที่สร้าง" })
    datecreate: Date

    @ManyToOne(() => JobStatus, jobstatus => jobstatus.job, { nullable: false })
    status: JobStatus;

    @Column({ type: 'timestamp', default: null, comment: "วันที่รับงาน" })
    accept_date: Date

    @ManyToOne(() => JobAcceptStatus, accept_status => accept_status.job, { nullable: true, })
    accept_status: number

    @Column({ default: null, comment: "id ผู้รับงาน", type: 'bigint' })
    accept_staff_employee_id: number

    @Column({ type: 'timestamp', default: null, comment: "วันที่ปิดงาน" })
    done_date: Date

    @ManyToOne(() => JobDoneStatus, done_status => done_status.job, { nullable: true, })
    done_status: number

    @Column({ default: null, comment: "รายระเอียดการซ่อม" })
    done_staff_detail: string

    @Column({ type: 'timestamp', default: null, comment: "วันที่ยกเลิกงาน" })
    cancel_date: Date

    @Column({ default: null, comment: "id ผู้ยกเลิกงาน", type: 'bigint' })
    cancel_staff_employee_id: number

    @Column({ default: null, comment: "id พนักงาน", type: 'bigint' })
    verify_employee_id: number

    @Column({ default: null, type: "tinyint", comment: "ระดับความพอใจ" })
    verify_acceptable: number

    @Column({ default: null, comment: "วันที่ verify" })
    verify_date: number

}
