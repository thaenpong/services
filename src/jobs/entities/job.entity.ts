import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/assets/entities/asset.entity";
<<<<<<< Updated upstream
=======
import { JobStatus } from "src/status/entities/jobs_status.entity";
import { JobAcceptStatus } from "../../status/entities/job_accept_status.entity";
import { JobDoneStatus } from "src/status/entities/job-done-status.entity";
import { JobAcceptable } from "src/status/entities/job_acceptable.entity";
>>>>>>> Stashed changes

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, comment: "id ผู้ใช้", type: 'bigint' })
    user_employee_id: number

    @ManyToOne(() => Asset, asset => asset.job, { nullable: false, })
    asset: Asset;

    @Column({ nullable: false, comment: "อาการ" })
    user_detail: string;

    @CreateDateColumn({ type: 'timestamp', comment: "วันที่สร้าง" })
    datecreate: Date;

    @Column({ default: 1, comment: "1. ยังไม่รับงาน, 2. กำลังปฎิบัติ, 3. เสร็จ, 4. ยกเลิก" })
    status: number;

    @Column({ type: 'timestamp', default: null, comment: "วันที่รับงาน" })
    accept_date: Date;

    @Column({ default: null, comment: "1. รับซ่อม, 2. ส่งซ่อมภายนอก" })
    accept_status: number;

    @Column({ default: null, comment: "id ผู้รับงาน", type: 'bigint' })
    accept_staff_employee_id: number;

    @Column({ type: 'timestamp', default: null, comment: "วันที่ปิดงาน" })
    done_date: Date;

    @Column({ default: null, comment: "1. ใช้งานได้, 2. ใช้งานไม่ได้" })
    done_status: number;

    @Column({ default: null, comment: "รายระเอียดการซ่อม" })
    done_staff_detail: string;

    @Column({ default: null, comment: "id ผู้ verify", type: 'bigint' })
    verify_user_employee_id: number;

    @Column({ default: null, comment: "ระดับความพอใจ", type: 'tinyint' })
    verify_is_acceptable: number;

    @Column({ default: null, comment: "วันที่ Verify", type: "timestamp" })
    verify_date: Date;

    @Column({ type: 'timestamp', default: null, comment: "วันที่ยกเลิกงาน" })
    cancel_date: Date

    @Column({ default: null, comment: "id ผู้ยกเลิกงาน", type: 'bigint' })
    cancel_staff_employee_id: number

<<<<<<< Updated upstream

=======
    @ManyToOne(() => JobAcceptable, verify_acceptable => verify_acceptable.job, { nullable: true, })
    verify_acceptable: number

    @Column({ default: null, comment: "วันที่ verify" })
    verify_date: Date
>>>>>>> Stashed changes

}
