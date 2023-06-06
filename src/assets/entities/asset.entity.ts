import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, comment: "id หมวดหมู่" })
    categories_id: number

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

    @Column({ nullable: true, comment: "id ผู้ใช้" })
    user_employee_id: number

    @Column({ default: null, comment: "หมายเหตุ" })
    note: string

    @Column({ default: 1, comment: "1. ใช้งาน, 2. กำลังซ่อม, 3. ถอดถอน" })
    status: number

    @CreateDateColumn({ type: 'timestamp', comment: "วันที่ลงทะเบียน" })
    datecreate: Date

    @Column({ default: null, comment: "id ผู้ลงทะเบียน" })
    staff_employee_id: number

    @Column({ type: 'timestamp', default: null, comment: "วันที่ถอดถอน" })
    dateremoved: Date

    @Column({ default: null, comment: "id ผู้ถอดถอน" })
    staff_employee_id_remove: number

    @Column({ default: null, comment: "วันหมดประกัน" })
    waranty_expires: Date
}
