import { Department } from "src/department/entities/department.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: 'รหัสพนักงาน' })
    employeeCode: string;

    @Column({ comment: 'ชื่อ' })
    firstName: string;

    @Column({ comment: 'นามสกุล' })
    lastName: string;

    @CreateDateColumn({ type: 'timestamp', comment: 'วันที่สร้าง' })
    createAt: Date;

    @Column({ comment: 'ซื่อเล่น' })
    nickName: string;

    @Column({ type: 'tinyint', comment: 'สถานะ' })
    status: number;

    //่join แผนก
    @ManyToOne(() => Department, department => department.id)
    department: Department;
}