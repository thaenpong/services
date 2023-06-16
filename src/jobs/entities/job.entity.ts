import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/assets/entities/asset.entity";
import { JobStatus } from 'src/status/entities/job-status.entity';
import { JobAcceptStatus } from 'src/status/entities/job-accept-status.entity';
import { JobDoneStatus } from 'src/status/entities/job-done-status.entiy';
import { JobVerifyStatus } from "src/status/entities/Job-verify-status.entity";


@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, comment: "id ผู้ใช้", type: 'bigint' })
    user_employee_id: number

    //join asset
    @ManyToOne(() => Asset, asset => asset.job, { nullable: false, })
    asset: Asset;

    @Column({ nullable: false, comment: "อาการ" })
    user_detail: string;

    @CreateDateColumn({ type: 'timestamp', comment: "วันที่สร้าง" })
    datecreate: Date;

    // join jobstatus
    @ManyToOne(() => JobStatus, jobstatus => jobstatus.job, { nullable: false })
    status: JobStatus;

    @Column({ type: 'timestamp', default: null, comment: "วันที่รับงาน" })
    accept_date: Date;

    // join job accept status
    @ManyToOne(() => JobAcceptStatus, jobacceptstatus => jobacceptstatus.job)
    accept_status: JobAcceptStatus;

    @Column({ default: null, comment: "id ผู้รับงาน", type: 'bigint' })
    accept_staff_employee_id: number;

    @Column({ type: 'timestamp', default: null, comment: "วันที่ปิดงาน" })
    done_date: Date;

    // join job done status
    @ManyToOne(() => JobDoneStatus, jobdonestatus => jobdonestatus.job)
    done_status: JobDoneStatus;

    @Column({ default: null, comment: "รายระเอียดการซ่อม" })
    done_staff_detail: string;

    @Column({ default: null, comment: "id ผู้ verify", type: 'bigint' })
    verify_user_employee_id: number;

    // join verify status
    @ManyToOne(() => JobVerifyStatus, jobverifystatus => jobverifystatus.job)
    verify_acceptable: number;

    @Column({ default: null, comment: "วันที่ Verify", type: "timestamp" })
    verify_date: Date;

    @Column({ type: 'timestamp', default: null, comment: "วันที่ยกเลิกงาน" })
    cancel_date: Date

    @Column({ default: null, comment: "id ผู้ยกเลิกงาน", type: 'bigint' })
    cancel_staff_employee_id: number


}
