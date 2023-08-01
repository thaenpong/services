import { Department } from "src/department/entities/department.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    employeeCode: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date;

    @Column()
    nickName: string;

    @Column({ type: 'tinyint' })
    status: number;

    @ManyToOne(() => Department, department => department.id)
    department: Department;
}