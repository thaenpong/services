import { Asset } from 'src/assets/entities/asset.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ comment: "รหัสพนักงาน", type: 'bigint', unique: true, nullable: false })
    staff_employee_id: Number

    @Column({ type: 'boolean', default: 1, comment: 'สถานะผู้ใช้งาน' })
    status: boolean
}
