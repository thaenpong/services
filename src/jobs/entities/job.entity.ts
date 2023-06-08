import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/assets/entities/asset.entity";

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

    @Column({ default: 1, comment: "1. ยังไม่รับงาน, 2. กำลังปฎิบัติ, 3. เสร็จ, 4. ยกเลิก" })
    status: number

    @Column({ type: 'timestamp', default: null, comment: "วันที่รับงาน" })
    accept_date: Date

    @Column({ default: 1, comment: "1. รับซ่อม, 2. ส่งซ่อมภายนอก" })
    accept_status: number

    @Column({ default: null, comment: "id ผู้รับงาน", type: 'bigint' })
    staff_employee_id: number

    @Column({ type: 'timestamp', default: null, comment: "วันที่ปิดงาน" })
    done_date: Date

    @Column({ default: 1, comment: "1. ใช้งานได้, 2. ใช้งานไม่ได้" })
    done_status: number

    @Column({ default: null, comment: "รายระเอียดการซ่อม" })
    done_detail: string
}
