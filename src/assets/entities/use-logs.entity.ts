import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity()
export class Uselogs {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ comment: 'วันที่' })
    fromdate: Date;

    @Column({ type: 'bigint', nullable: false, comment: 'รหัสผู้ใช้' })
    user_employee_id: number;

    @Column({ type: 'bigint', nullable: false, comment: 'รหัสพนักงาน IT' })
    from_staff_employee_id: number;

    @Column({ type: 'timestamp', default: null, comment: 'ถึงวันที่' })
    todate: Date;

    @Column({ type: 'bigint', default: null, comment: 'ไปยัง หรัสผู้ใช้' })
    to_staff_employee_id: number;

    @Column({ default: null, comment: 'รายระเอียด' })
    detail: string;

    //join ทรัพย์สิน
    @ManyToOne(() => Asset, asset => asset.uselog)
    asset: Asset
}