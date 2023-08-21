import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: 'ชื่อแผนก' })
    name: string;

    // join ข้อมูลพนักงาน
    @OneToMany(() => Employee, employee => employee.department)
    employee: Employee[];

}
