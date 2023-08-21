import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "src/categories/entities/category.entity";
import { Job } from "src/jobs/entities/job.entity";
import { AssetStatus } from "src/status/entities/asset-status.entyty";
import { Removed } from "src/removed/entities/removed.entity";
import { Uselogs } from "./use-logs.entity";
@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    /*  @Column({ nullable: false, comment: "id หมวดหมู่" })
     categories_id: number */

    //join category
    @ManyToOne(() => Category, category => category.assets, { nullable: false, })
    category: Category;

    @Column({ nullable: false, unique: true, comment: "รหัสทรพย์สิน" })
    code: string

    @Column({ default: null, comment: "หมายเลขซีเรียล" })
    serial_number: string

    @Column({ default: null, comment: "รุ่น" })
    brand: string

    @Column({ default: null, comment: "ประเภทของอุปกรณ์" })
    type: string

    @Column({ default: null, comment: "ชื่อรุ่นย่อย" })
    spec: string

    @Column({ default: null, comment: "สี" })
    color: string

    @Column({ default: null, comment: "id ผู้ใช้", type: 'bigint' })
    user_employee_id: number

    @Column({ default: null, comment: "หมายเหตุ" })
    note: string

    @Column({ default: null, comment: "หมายเหตุ" })
    description: string
    // join asset status
    @ManyToOne(() => AssetStatus, status => status.asset, { nullable: false, })
    status: AssetStatus;

    @CreateDateColumn({ type: 'timestamp', comment: "วันที่ลงทะเบียน" })
    datecreate: Date;

    @Column({ nullable: false, comment: "id ผู้ลงทะเบียน", type: 'bigint' })
    staff_employee_id: number;

    @Column({ nullable: true, default: null, comment: "วันหมดประกัน" })
    warranty_expires: Date

    // join งาน
    @OneToMany(() => Job, job => job.asset)
    job: Job[];

    //Join ถอดถอน
    @OneToOne(() => Removed, removed => removed.asset)
    @JoinColumn()
    removed: Removed;

    //Join ประวัติการใช้
    @OneToMany(() => Uselogs, uselogs => uselogs.asset)
    uselog: Uselogs[];
}
